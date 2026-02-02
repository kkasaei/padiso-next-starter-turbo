/**
 * Stripe Webhook Handler
 * 
 * Handles subscription events from Stripe:
 * - checkout.session.completed - Customer completed checkout
 * - customer.subscription.updated - Subscription changed
 * - customer.subscription.deleted - Subscription canceled
 * - customer.created/updated/deleted - Customer management
 * 
 * @see https://stripe.com/docs/webhooks
 */

import { NextResponse } from 'next/server';
import {
  verifyWebhookSignature,
  handleWebhookEvent,
  handleCheckoutCompleted,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handleCustomerCreated,
  handleCustomerUpdated,
  handleCustomerDeleted,
} from '@workspace/billing/server';

export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
  try {
    // Verify webhook signature
    const event = await verifyWebhookSignature(req);

    console.log(`[Stripe Webhook] Received event: ${event.type}`);

    // Handle webhook event
    await handleWebhookEvent(event, {
      onCheckoutCompleted: handleCheckoutCompleted,
      onSubscriptionUpdated: handleSubscriptionUpdated,
      onSubscriptionDeleted: handleSubscriptionDeleted,
      onCustomerCreated: handleCustomerCreated,
      onCustomerUpdated: handleCustomerUpdated,
      onCustomerDeleted: handleCustomerDeleted,
    });

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error('[Stripe Webhook] Error:', err);
    
    const errorMessage = err instanceof Error ? err.message : 'Webhook failed';
    
    // Return 400 for signature verification failures, 500 for processing failures
    const status = errorMessage.includes('signature') ? 400 : 500;
    
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
}

