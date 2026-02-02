import { eq } from 'drizzle-orm';
import { db, workspaces } from '@workspace/db';
import {
  type SubscriptionPayload,
  type CustomerPayload,
} from './stripe';
import { getPlanIdFromPriceId, getPlanById, getPlanLimits, getIntervalFromPriceId } from './plans';

// ======================== Webhook Event Handlers ======================== //

/**
 * Handle checkout.session.completed event
 * Called when a customer completes the Stripe Checkout flow
 */
export async function handleCheckoutCompleted(payload: SubscriptionPayload): Promise<void> {
  await upsertSubscription(payload);
}

/**
 * Handle customer.subscription.updated event
 * Called when a subscription is updated (plan change, renewal, etc.)
 */
export async function handleSubscriptionUpdated(payload: SubscriptionPayload): Promise<void> {
  // Find existing workspace to check if period changed
  const [existing] = await db
    .select({
      subscriptionPeriodStartsAt: workspaces.subscriptionPeriodStartsAt,
      id: workspaces.id,
    })
    .from(workspaces)
    .where(eq(workspaces.stripeSubscriptionId, payload.subscriptionId))
    .limit(1);

  await upsertSubscription(payload);

  // Reset usage if billing period changed
  if (existing && existing.subscriptionPeriodStartsAt && new Date(payload.periodStartsAt) > existing.subscriptionPeriodStartsAt) {
    const workspaceId = payload.organizationId || existing.id;
    await resetUsage(workspaceId, payload.periodStartsAt, payload.periodEndsAt);
  }
}

/**
 * Handle customer.subscription.deleted event
 * Called when a subscription is canceled
 */
export async function handleSubscriptionDeleted(subscriptionId: string): Promise<void> {
  // Update workspace status to canceled
  await db
    .update(workspaces)
    .set({
      status: 'canceled',
      canceledAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(workspaces.stripeSubscriptionId, subscriptionId));
}

/**
 * Handle customer.created event
 */
export async function handleCustomerCreated(payload: CustomerPayload): Promise<void> {
  // Update workspace with Stripe customer ID
  await db
    .update(workspaces)
    .set({
      stripeCustomerId: payload.customerId,
      updatedAt: new Date(),
    })
    .where(eq(workspaces.id, payload.organizationId));
}

/**
 * Handle customer.updated event
 */
export async function handleCustomerUpdated(payload: CustomerPayload): Promise<void> {
  // Update workspace with Stripe customer ID
  await db
    .update(workspaces)
    .set({
      stripeCustomerId: payload.customerId,
      billingEmail: payload.email,
      updatedAt: new Date(),
    })
    .where(eq(workspaces.id, payload.organizationId));
}

/**
 * Handle customer.deleted event
 */
export async function handleCustomerDeleted(customerId: string): Promise<void> {
  // Remove Stripe customer ID from workspace
  await db
    .update(workspaces)
    .set({
      stripeCustomerId: null,
      updatedAt: new Date(),
    })
    .where(eq(workspaces.stripeCustomerId, customerId));
}

// ======================== Database Operations ======================== //

/**
 * Map subscription status to workspace status
 */
function mapWorkspaceStatus(subscriptionStatus: string, isActive: boolean): 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'incomplete_expired' | 'paused' | 'admin_suspended' | 'deleted' {
  if (subscriptionStatus === 'trialing') return 'trialing';
  if (subscriptionStatus === 'active' && isActive) return 'active';
  if (subscriptionStatus === 'past_due') return 'past_due';
  if (subscriptionStatus === 'canceled' || subscriptionStatus === 'cancelled') return 'canceled';
  if (subscriptionStatus === 'unpaid') return 'unpaid';
  if (subscriptionStatus === 'paused') return 'paused';
  return 'active';
}

/**
 * Create or update workspace from Stripe webhook payload
 */
async function upsertSubscription(payload: SubscriptionPayload): Promise<void> {
  // Find workspace ID - it should be in organizationId (passed as client_reference_id)
  let workspaceId = payload.organizationId;
  
  if (!workspaceId) {
    // Try to find by existing workspace with this Stripe subscription ID
    const [existingWorkspace] = await db
      .select({ id: workspaces.id })
      .from(workspaces)
      .where(eq(workspaces.stripeSubscriptionId, payload.subscriptionId))
      .limit(1);

    if (existingWorkspace) {
      workspaceId = existingWorkspace.id;
    } else {
      console.error('Workspace not found for subscription:', payload.subscriptionId);
      throw new Error('Workspace not found for subscription');
    }
  }

  // Get plan info from price ID
  const planId = getPlanIdFromPriceId(payload.priceId || '');
  const plan = getPlanById(planId);
  const interval = getIntervalFromPriceId(payload.priceId || '');
  const limits = getPlanLimits(planId);

  // Update workspace with subscription info
  await db
    .update(workspaces)
    .set({
      status: mapWorkspaceStatus(payload.status, payload.active),
      stripeCustomerId: payload.customerId,
      stripeSubscriptionId: payload.subscriptionId,
      stripePriceId: payload.priceId || null,
      planId,
      planName: plan?.name || 'Unknown',
      billingInterval: interval,
      priceAmount: String((payload.priceAmount ?? 0) / 100),
      currency: payload.currency,
      trialStartsAt: payload.trialStartsAt ? new Date(payload.trialStartsAt) : null,
      trialEndsAt: payload.trialEndsAt ? new Date(payload.trialEndsAt) : null,
      subscriptionPeriodStartsAt: new Date(payload.periodStartsAt),
      subscriptionPeriodEndsAt: new Date(payload.periodEndsAt),
      cancelAtPeriodEnd: payload.cancelAtPeriodEnd,
      limitBrands: limits.maxBrands === -1 ? null : limits.maxBrands,
      limitApiCallsPerMonth: limits.maxApiCalls === -1 ? null : limits.maxApiCalls,
      limitAiCreditsPerMonth: limits.maxInsightsQueries === -1 ? null : limits.maxInsightsQueries,
      updatedAt: new Date(),
    })
    .where(eq(workspaces.id, workspaceId));
}

/**
 * Reset usage counters at the start of a new billing period
 */
async function resetUsage(workspaceId: string, periodStart: string, periodEnd: string): Promise<void> {
  await db
    .update(workspaces)
    .set({
      usageBrandsCount: 0,
      usageApiCallsCount: 0,
      usageAiCreditsUsed: 0,
      usageResetAt: new Date(),
      subscriptionPeriodStartsAt: new Date(periodStart),
      subscriptionPeriodEndsAt: new Date(periodEnd),
      updatedAt: new Date(),
    })
    .where(eq(workspaces.id, workspaceId));

}
