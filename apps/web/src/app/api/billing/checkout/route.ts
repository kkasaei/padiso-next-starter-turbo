/**
 * Stripe Checkout Session API Route
 * 
 * Creates a Stripe Checkout session for subscription signup.
 * After payment, Stripe redirects back to /workspace-setup with query params.
 * 
 * POST /api/billing/checkout
 * Body: { workspaceId, planId, interval }
 * Returns: { url: string } - Stripe Checkout URL
 */

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
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
      workspaceId: string;
      planId: PlanId;
      interval: 'month' | 'year';
    };

    if (!workspaceId || !planId || !interval) {
      return NextResponse.json(
        { error: 'Missing required fields: workspaceId, planId, interval' },
        { status: 400 }
      );
    }

    // Get workspace from database
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
      // Create a new Stripe customer
      customerId = await createCustomer({
        organizationId: workspaceId,
        organizationName: workspace.clerkOrgId, // We'll use Clerk org ID as name for now
        name: workspace.clerkOrgId,
        email: workspace.billingEmail || '',
      });

      // Store customer ID in workspace
      await db
        .update(workspaces)
        .set({
          stripeCustomerId: customerId,
          updatedAt: new Date(),
        })
        .where(eq(workspaces.id, workspaceId));
    }

    // Build return URL - the createCheckoutSession function adds workspace_id and session_id
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const returnUrl = `${baseUrl}/workspace-setup`;

    // Create Stripe Checkout session
    // Note: createCheckoutSession adds workspace_id and session_id to success/cancel URLs
    const session = await createCheckoutSession({
      returnUrl,
      organizationId: workspaceId, // This becomes client_reference_id and is added to URLs
      planId,
      interval,
      customerId,
      customerEmail: workspace.billingEmail || undefined,
    });


    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id,
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
