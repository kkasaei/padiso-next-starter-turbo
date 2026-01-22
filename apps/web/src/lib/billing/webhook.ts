import 'server-only';

import {
  type SubscriptionPayload,
  type CustomerPayload,
} from './stripe';
import { getPlanIdFromPriceId, getPlanById, getPlanLimits, getIntervalFromPriceId } from './plans';

// ======================== Mock Types ======================== //

enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELED = 'CANCELED',
  PAUSED = 'PAUSED',
  TRIALING = 'TRIALING',
  UNPAID = 'UNPAID',
}

enum OrganizationStatus {
  ACTIVE = 'ACTIVE',
  TRIALING = 'TRIALING',
  PAST_DUE = 'PAST_DUE',
  CANCELED = 'CANCELED',
  UNPAID = 'UNPAID',
  PAUSED = 'PAUSED',
}

// ======================== Mock Data Store ======================== //

interface MockSubscription {
  id: string;
  organizationId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string | null;
  periodStartsAt: Date;
  periodEndsAt: Date;
  status: SubscriptionStatus;
  active: boolean;
  cancelAtPeriodEnd: boolean;
  trialStartsAt: Date | null;
  trialEndsAt: Date | null;
  planId: string;
  planName: string;
  priceAmount: number;
  currency: string;
  interval: string;
  limits: Record<string, number>;
}

interface MockOrganization {
  id: string;
  status: OrganizationStatus;
  trialEndsAt: Date | null;
  currentUsage: {
    periodStart: string;
    periodEnd: string;
    reports: number;
    pdfs: number;
    apiCalls: number;
  };
}

// In-memory mock stores
const mockSubscriptions = new Map<string, MockSubscription>();
const mockOrganizations = new Map<string, MockOrganization>();
const mockUsageLogs: Array<{ organizationId: string; eventType: string; amount: number; metadata: Record<string, unknown> }> = [];

// ======================== Webhook Event Handlers ======================== //

export async function handleCheckoutCompleted(payload: SubscriptionPayload): Promise<void> {
  await upsertSubscription(payload);
  // Note: Referral system not yet implemented in current schema
}

export async function handleSubscriptionUpdated(payload: SubscriptionPayload): Promise<void> {
  // Find subscription by Stripe ID to check if period changed
  const existing = findSubscriptionByStripeId(payload.subscriptionId);

  await upsertSubscription(payload);

  // Reset usage if new period
  if (existing && new Date(payload.periodStartsAt) > existing.periodStartsAt) {
    const orgId = payload.organizationId || existing.organizationId;
    await resetUsage(orgId, payload.periodStartsAt, payload.periodEndsAt);
  }
}

export async function handleSubscriptionDeleted(subscriptionId: string): Promise<void> {
  // Find subscription by Stripe ID
  const subscription = findSubscriptionByStripeId(subscriptionId);

  if (!subscription) return;

  // Update organization status
  const org = mockOrganizations.get(subscription.organizationId);
  if (org) {
    org.status = OrganizationStatus.CANCELED;
    mockOrganizations.set(subscription.organizationId, org);
  }

  // Delete subscription
  mockSubscriptions.delete(subscription.organizationId);
}

export async function handleCustomerCreated(payload: CustomerPayload): Promise<void> {
  // Store customer ID in subscription if it exists
  const subscription = mockSubscriptions.get(payload.organizationId);
  if (subscription) {
    subscription.stripeCustomerId = payload.customerId;
    mockSubscriptions.set(payload.organizationId, subscription);
  }
}

export async function handleCustomerUpdated(payload: CustomerPayload): Promise<void> {
  // Update customer ID in subscription
  const subscription = mockSubscriptions.get(payload.organizationId);
  if (subscription) {
    subscription.stripeCustomerId = payload.customerId;
    mockSubscriptions.set(payload.organizationId, subscription);
  }
}

export async function handleCustomerDeleted(customerId: string): Promise<void> {
  // Remove customer ID from subscriptions
  for (const [orgId, subscription] of mockSubscriptions) {
    if (subscription.stripeCustomerId === customerId) {
      subscription.stripeCustomerId = null;
      mockSubscriptions.set(orgId, subscription);
    }
  }
}

// ======================== Mock Helper Functions ======================== //

function findSubscriptionByStripeId(stripeSubscriptionId: string): MockSubscription | undefined {
  for (const subscription of mockSubscriptions.values()) {
    if (subscription.stripeSubscriptionId === stripeSubscriptionId) {
      return subscription;
    }
  }
  return undefined;
}

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
    const existingSubscription = findSubscriptionByStripeId(payload.subscriptionId);

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
  const subscriptionData: MockSubscription = {
    id: `sub_${orgId}`,
    organizationId: orgId,
    stripeSubscriptionId: payload.subscriptionId,
    stripeCustomerId: payload.customerId,
    status: mapSubscriptionStatus(payload.status),
    active: payload.active,
    cancelAtPeriodEnd: payload.cancelAtPeriodEnd,
    periodStartsAt: new Date(payload.periodStartsAt),
    periodEndsAt: new Date(payload.periodEndsAt),
    trialStartsAt: payload.trialStartsAt ? new Date(payload.trialStartsAt) : null,
    trialEndsAt: payload.trialEndsAt ? new Date(payload.trialEndsAt) : null,
    planId,
    planName: plan?.name || 'Unknown',
    priceAmount: (payload.priceAmount ?? 0) / 100, // Convert cents to dollars
    currency: payload.currency,
    interval,
    limits,
  };

  // Upsert subscription
  mockSubscriptions.set(orgId, subscriptionData);

  // Upsert organization
  const orgData: MockOrganization = {
    id: orgId,
    status: mapOrganizationStatus(payload.status, payload.active),
    trialEndsAt: payload.trialEndsAt ? new Date(payload.trialEndsAt) : null,
    currentUsage: {
      periodStart: payload.periodStartsAt,
      periodEnd: payload.periodEndsAt,
      reports: 0,
      pdfs: 0,
      apiCalls: 0,
    },
  };
  mockOrganizations.set(orgId, orgData);

  // Log the subscription update
  mockUsageLogs.push({
    organizationId: orgId,
    eventType: 'subscription_updated',
    amount: 1,
    metadata: {
      planId,
      planName: plan?.name,
      status: payload.status,
      interval,
    },
  });
}

async function resetUsage(orgId: string, periodStart: string, periodEnd: string): Promise<void> {
  // Update organization's currentUsage
  const org = mockOrganizations.get(orgId);
  if (org) {
    org.currentUsage = {
      periodStart,
      periodEnd,
      reports: 0,
      pdfs: 0,
      apiCalls: 0,
    };
    mockOrganizations.set(orgId, org);
  }

  // Log the usage reset
  mockUsageLogs.push({
    organizationId: orgId,
    eventType: 'billing_period_reset',
    amount: 0,
    metadata: {
      periodStart,
      periodEnd,
    },
  });
}

// ======================== Mock Data Access (for testing) ======================== //

export const mockStore = {
  subscriptions: mockSubscriptions,
  organizations: mockOrganizations,
  usageLogs: mockUsageLogs,
  clear: () => {
    mockSubscriptions.clear();
    mockOrganizations.clear();
    mockUsageLogs.length = 0;
  },
};
