/**
 * Manually sync subscription from Stripe
 * 
 * Use this when webhook didn't fire (e.g., testing without stripe listen)
 * 
 * POST /api/billing/sync
 * Body: { workspaceId }
 */

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, workspaces, eq } from '@workspace/db';
import { getStripe, getPlanIdFromPriceId, getPlanById, getPlanLimits, getIntervalFromPriceId } from '@workspace/billing/server';

export const runtime = 'nodejs';

type WorkspaceStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'incomplete_expired' | 'paused';

export async function POST(req: Request): Promise<Response> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { workspaceId } = body as { workspaceId: string };

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId is required' }, { status: 400 });
    }

    // Get workspace
    const [workspace] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .limit(1);

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    // If we have a Stripe customer ID, try to find their subscription
    if (!workspace.stripeCustomerId) {
      return NextResponse.json({ 
        error: 'No Stripe customer found. Please complete checkout first.',
        workspace 
      }, { status: 400 });
    }

    // List subscriptions for this customer
    const stripe = getStripe();
    const subscriptions = await stripe.subscriptions.list({
      customer: workspace.stripeCustomerId,
      limit: 1,
      status: 'all',
    });

    const subscription = subscriptions.data[0];
    if (!subscription) {
      return NextResponse.json({ 
        error: 'No subscription found in Stripe for this customer',
        customerId: workspace.stripeCustomerId
      }, { status: 404 });
    }

    const firstItem = subscription.items.data[0];
    if (!firstItem) {
      return NextResponse.json({ 
        error: 'No subscription items found',
        subscriptionId: subscription.id
      }, { status: 404 });
    }
    
    // Get plan info
    const priceId = firstItem.price?.id || '';
    const planId = getPlanIdFromPriceId(priceId);
    const plan = getPlanById(planId);
    const interval = getIntervalFromPriceId(priceId);
    const limits = getPlanLimits(planId);

    // Map status
    const statusMap: Record<string, WorkspaceStatus> = {
      active: 'active',
      trialing: 'trialing',
      past_due: 'past_due',
      canceled: 'canceled',
      unpaid: 'unpaid',
      incomplete: 'incomplete',
      incomplete_expired: 'incomplete_expired',
      paused: 'paused',
    };

    const workspaceStatus = statusMap[subscription.status] || 'active';

    // Update workspace with subscription data
    const [updated] = await db
      .update(workspaces)
      .set({
        status: workspaceStatus,
        stripeSubscriptionId: subscription.id,
        planId,
        planName: plan?.name || 'Growth',
        billingInterval: interval,
        priceAmount: String((firstItem.price?.unit_amount ?? 0) / 100),
        currency: subscription.currency,
        trialStartsAt: subscription.trial_start 
          ? new Date(subscription.trial_start * 1000) 
          : null,
        trialEndsAt: subscription.trial_end 
          ? new Date(subscription.trial_end * 1000) 
          : null,
        subscriptionPeriodStartsAt: new Date((firstItem.current_period_start ?? 0) * 1000),
        subscriptionPeriodEndsAt: new Date((firstItem.current_period_end ?? 0) * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        limitBrands: limits.maxBrands === -1 ? null : limits.maxBrands,
        limitApiCallsPerMonth: limits.maxApiCalls === -1 ? null : limits.maxApiCalls,
        limitAiCreditsPerMonth: limits.maxInsightsQueries === -1 ? null : limits.maxInsightsQueries,
        updatedAt: new Date(),
      })
      .where(eq(workspaces.id, workspaceId))
      .returning();


    return NextResponse.json({ 
      success: true,
      workspace: updated,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        planId,
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      }
    });
  } catch (err) {
    console.error('[Sync] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Sync failed' },
      { status: 500 }
    );
  }
}
