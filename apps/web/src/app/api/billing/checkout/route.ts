/**
 * Stripe Checkout Session API Route
 * 
 * Creates a Stripe Checkout session for subscription signup.
 * After payment, Stripe redirects back to /workspace-setup with query params.
 * 
 * Supports two flows:
 * 1. NEW SETUP (no workspace yet): { planId, interval } - creates Stripe customer from Clerk user
 * 2. EXISTING WORKSPACE: { workspaceId, planId, interval } - uses existing workspace's Stripe customer
 * 
 * POST /api/billing/checkout
 * Returns: { url: string, sessionId: string }
 */

import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db, workspaces, eq } from '@workspace/db';
import { createCheckoutSession, createCustomer, type PlanId } from '@workspace/billing/server';

export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
  try {
    // Verify authentication
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const { workspaceId, planId, interval } = body as {
      workspaceId?: string;
      planId: PlanId;
      interval: 'month' | 'year';
    };

    if (!planId || !interval) {
      return NextResponse.json(
        { error: 'Missing required fields: planId, interval' },
        { status: 400 }
      );
    }

    // Use Vercel URL in production/staging, fallback to localhost for development
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const returnUrl = `${baseUrl}/workspace-setup`;

    // ─── Flow 1: Existing workspace (re-subscribe, plan change) ───
    if (workspaceId) {
      const [workspace] = await db
        .select()
        .from(workspaces)
        .where(eq(workspaces.id, workspaceId))
        .limit(1);

      if (!workspace) {
        return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
      }

      // Verify the user has access to this workspace (via Clerk org)
      if (workspace.clerkOrgId !== orgId) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }

      // Get or create Stripe customer
      let customerId = workspace.stripeCustomerId;

      if (!customerId) {
        customerId = await createCustomer({
          organizationId: workspaceId,
          organizationName: workspace.clerkOrgId,
          name: workspace.clerkOrgId,
          email: workspace.billingEmail || '',
        });

        await db
          .update(workspaces)
          .set({ stripeCustomerId: customerId, updatedAt: new Date() })
          .where(eq(workspaces.id, workspaceId));
      }

      const session = await createCheckoutSession({
        returnUrl,
        organizationId: workspaceId,
        planId,
        interval,
        customerId,
        customerEmail: workspace.billingEmail || undefined,
      });

      return NextResponse.json({ url: session.url, sessionId: session.id });
    }

    // ─── Flow 2: New setup (no workspace yet, pre-payment) ───
    // Get user details from Clerk for the Stripe customer
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Could not retrieve user details' }, { status: 401 });
    }

    const userEmail = user.emailAddresses[0]?.emailAddress || '';
    const userName = [user.firstName, user.lastName].filter(Boolean).join(' ') || userEmail;

    // Generate a temporary setup ID to track this checkout session
    // This is NOT a workspace ID - the real workspace will be created after payment
    const setupId = `setup_${crypto.randomUUID()}`;

    // Create Stripe customer with user info (not tied to a workspace yet)
    const customerId = await createCustomer({
      organizationId: setupId,
      organizationName: userName,
      name: userName,
      email: userEmail,
    });

    // Create checkout session with setupId as the reference
    // The provisionAfterCheckout tRPC mutation will link this to the real workspace later
    const session = await createCheckoutSession({
      returnUrl,
      organizationId: setupId,
      planId,
      interval,
      customerId,
      customerEmail: userEmail,
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      setupId,
    });
  } catch (err) {
    console.error('[Checkout] Error creating checkout session:', err);

    const errorMessage = err instanceof Error ? err.message : 'Failed to create checkout session';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
