import 'server-only';

import { prisma, OrganizationStatus, SubscriptionStatus } from '@workspace/db';
import {
  type SubscriptionPayload,
  type CustomerPayload,
} from './stripe';
import { getPlanIdFromPriceId, getPlanById, getPlanLimits, getIntervalFromPriceId } from './plans';

// ======================== Webhook Event Handlers ======================== //

export async function handleCheckoutCompleted(payload: SubscriptionPayload): Promise<void> {
  await upsertSubscription(payload);
  // Note: Referral system not yet implemented in current schema
}

export async function handleSubscriptionUpdated(payload: SubscriptionPayload): Promise<void> {
  // Find subscription by Stripe ID to check if period changed
  const existing = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: payload.subscriptionId },
    select: { periodStartsAt: true, organizationId: true },
  });

  await upsertSubscription(payload);

  // Reset usage if new period
  if (existing && new Date(payload.periodStartsAt) > existing.periodStartsAt) {
    const orgId = payload.organizationId || existing.organizationId;
    await resetUsage(orgId, payload.periodStartsAt, payload.periodEndsAt);
  }
}

export async function handleSubscriptionDeleted(subscriptionId: string): Promise<void> {
  // Find subscription by Stripe ID
  const subscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
    select: { id: true, organizationId: true },
  });

  if (!subscription) return;

  // Update organization status
  await prisma.organization.update({
    where: { id: subscription.organizationId },
    data: {
      status: OrganizationStatus.CANCELED,
    },
  });

  // Delete subscription
  await prisma.subscription.delete({
    where: { id: subscription.id },
  }).catch(() => {});
}

export async function handleCustomerCreated(payload: CustomerPayload): Promise<void> {
  // Store customer ID in subscription if it exists
  // Note: The relationship is managed through the Subscription model
  await prisma.subscription.updateMany({
    where: { organizationId: payload.organizationId },
    data: { stripeCustomerId: payload.customerId },
  });
}

export async function handleCustomerUpdated(payload: CustomerPayload): Promise<void> {
  // Update customer ID in subscription
  await prisma.subscription.updateMany({
    where: { organizationId: payload.organizationId },
    data: { stripeCustomerId: payload.customerId },
  });
}

export async function handleCustomerDeleted(customerId: string): Promise<void> {
  // Remove customer ID from subscriptions
  await prisma.subscription.updateMany({
    where: { stripeCustomerId: customerId },
    data: { stripeCustomerId: null },
  });
}

// ======================== Database Operations ======================== //

function mapSubscriptionStatus(status: string): SubscriptionStatus {
  const map: Record<string, SubscriptionStatus> = {
    active: SubscriptionStatus.ACTIVE,
    past_due: SubscriptionStatus.PAST_DUE,
    canceled: SubscriptionStatus.CANCELED,
    cancelled: SubscriptionStatus.CANCELED,
    paused: SubscriptionStatus.PAUSED,
    trialing: SubscriptionStatus.TRIALING,
    unpaid: SubscriptionStatus.UNPAID,
  };
  return map[status.toLowerCase()] || SubscriptionStatus.ACTIVE;
}

function mapOrganizationStatus(subscriptionStatus: string, isActive: boolean): OrganizationStatus {
  if (subscriptionStatus === 'trialing') return OrganizationStatus.TRIALING;
  if (subscriptionStatus === 'active' && isActive) return OrganizationStatus.ACTIVE;
  if (subscriptionStatus === 'past_due') return OrganizationStatus.PAST_DUE;
  if (subscriptionStatus === 'canceled' || subscriptionStatus === 'cancelled') return OrganizationStatus.CANCELED;
  if (subscriptionStatus === 'unpaid') return OrganizationStatus.UNPAID;
  if (subscriptionStatus === 'paused') return OrganizationStatus.PAUSED;
  return OrganizationStatus.ACTIVE;
}

async function upsertSubscription(payload: SubscriptionPayload): Promise<void> {
  // Find org if not in payload
  let orgId = payload.organizationId;
  if (!orgId) {
    // Try to find by existing subscription with this Stripe subscription ID
    const existingSubscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: payload.subscriptionId },
      select: { organizationId: true },
    });

    if (existingSubscription) {
      orgId = existingSubscription.organizationId;
    } else {
      throw new Error('Organization not found for subscription');
    }
  }

  // Get plan info from price
  const planId = getPlanIdFromPriceId(payload.priceId || '');
  const plan = getPlanById(planId);
  const interval = getIntervalFromPriceId(payload.priceId || '');
  const limits = getPlanLimits(planId);

  // Prepare subscription data
  const subscriptionData = {
    organizationId: orgId,
    provider: 'stripe',
    status: mapSubscriptionStatus(payload.status),
    active: payload.active,
    cancelAtPeriodEnd: payload.cancelAtPeriodEnd,
    periodStartsAt: new Date(payload.periodStartsAt),
    periodEndsAt: new Date(payload.periodEndsAt),
    trialStartsAt: payload.trialStartsAt ? new Date(payload.trialStartsAt) : null,
    trialEndsAt: payload.trialEndsAt ? new Date(payload.trialEndsAt) : null,
    stripeSubscriptionId: payload.subscriptionId,
    stripeCustomerId: payload.customerId,
    planId,
    planName: plan?.name || 'Unknown',
    priceAmount: (payload.priceAmount ?? 0) / 100, // Convert cents to dollars
    currency: payload.currency,
    interval,
    limits: limits, // Store limits as JSON
  };

  // Upsert subscription using organizationId (which is unique)
  await prisma.subscription.upsert({
    where: { organizationId: orgId },
    create: subscriptionData,
    update: subscriptionData,
  });

  // Update organization status (subscription link is managed via Subscription.organizationId)
  await prisma.organization.update({
    where: { id: orgId },
    data: {
      status: mapOrganizationStatus(payload.status, payload.active),
      trialEndsAt: payload.trialEndsAt ? new Date(payload.trialEndsAt) : null,
      currentUsage: {
        periodStart: payload.periodStartsAt,
        periodEnd: payload.periodEndsAt,
        reports: 0,
        pdfs: 0,
        apiCalls: 0,
      },
    },
  });

  // Log the subscription update
  await prisma.usageLog.create({
    data: {
      organizationId: orgId,
      eventType: 'subscription_updated',
      amount: 1,
      metadata: {
        planId,
        planName: plan?.name,
        status: payload.status,
        interval,
      },
    },
  });
}

async function resetUsage(orgId: string, periodStart: string, periodEnd: string): Promise<void> {
  // Update organization's currentUsage JSON field
  await prisma.organization.update({
    where: { id: orgId },
    data: {
      currentUsage: {
        periodStart,
        periodEnd,
        reports: 0,
        pdfs: 0,
        apiCalls: 0,
      },
    },
  });

  // Log the usage reset
  await prisma.usageLog.create({
    data: {
      organizationId: orgId,
      eventType: 'billing_period_reset',
      amount: 0,
      metadata: {
        periodStart,
        periodEnd,
      },
    },
  });
}
