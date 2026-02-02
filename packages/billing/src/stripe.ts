import { Stripe } from 'stripe';
import { env } from './env';
import { PLANS, type PlanId } from './plans';

// Singleton Stripe instance
let stripeInstance: Stripe | undefined;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not configured.');
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2025-12-15.clover',
    });
  }
  return stripeInstance;
}

// ======================== Types ======================== //

export type SubscriptionPayload = {
  subscriptionId: string;
  organizationId: string;
  customerId: string;
  status: string;
  active: boolean;
  cancelAtPeriodEnd: boolean;
  currency: string;
  periodStartsAt: string;
  periodEndsAt: string;
  trialStartsAt?: string;
  trialEndsAt?: string;
  priceId?: string;
  priceAmount?: number;
};

export type CustomerPayload = {
  customerId: string;
  organizationId: string;
  email: string;
};

export type Invoice = {
  id: string;
  number?: string;
  url?: string;
  createdAt: string;
  total: number;
  currency: string;
  status?: string;
};

// ======================== Customer ======================== //

export async function createCustomer(params: {
  organizationId: string;
  organizationName: string;
  name: string;
  email: string;
}): Promise<string> {
  const customer = await getStripe().customers.create({
    name: params.name,
    email: params.email,
    metadata: {
      organizationId: params.organizationId,
      organizationName: params.organizationName,
    },
  });
  return customer.id;
}

// ======================== Checkout Session ======================== //

export async function createCheckoutSession(params: {
  returnUrl: string;
  organizationId: string; // This is the workspaceId
  planId: PlanId;
  interval: 'month' | 'year';
  customerId: string;
  customerEmail?: string;
}): Promise<{ id: string; url: string }> {
  const plan = PLANS[params.planId];
  if (!plan) {
    throw new Error(`Plan ${params.planId} not found`);
  }

  const priceId = plan.prices[params.interval].id;
  const trialDays = 'trialDays' in plan ? plan.trialDays : undefined;

  // Validate price ID is configured
  if (!priceId.startsWith('price_')) {
    throw new Error(
      `Stripe price ID not configured for ${params.planId}_${params.interval}. ` +
      `Please set NEXT_PUBLIC_BILLING_PRICE_${params.planId.toUpperCase()}_${params.interval.toUpperCase()}_ID`
    );
  }

  // Build success/cancel URLs with workspace_id for redirect handling
  const successUrl = `${params.returnUrl}?success=true&workspace_id=${params.organizationId}&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${params.returnUrl}?canceled=true&workspace_id=${params.organizationId}`;

  const session = await getStripe().checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    allow_promotion_codes: true,
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: params.organizationId, // workspaceId - used by webhook to find workspace
    customer: params.customerId,
    subscription_data: {
      trial_period_days: trialDays,
      metadata: {
        organizationId: params.organizationId, // workspaceId
        planId: params.planId,
      },
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  if (!session.url) {
    throw new Error('Failed to create checkout session');
  }

  return { id: session.id, url: session.url };
}

// ======================== Billing Portal ======================== //

export async function createBillingPortalSession(params: {
  returnUrl: string;
  customerId: string;
}): Promise<{ id: string; url: string }> {
  const session = await getStripe().billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  });

  if (!session.url) {
    throw new Error('Failed to create billing portal session');
  }

  return { id: session.id, url: session.url };
}

// ======================== Invoices ======================== //

export async function getInvoices(customerId: string): Promise<Invoice[]> {
  const response = await getStripe().invoices.list({
    customer: customerId,
    limit: 100,
  });

  return response.data.map((invoice) => ({
    id: invoice.id,
    number: invoice.number ?? undefined,
    url: invoice.invoice_pdf ?? undefined,
    createdAt: new Date(invoice.created * 1000).toISOString(),
    total: invoice.total / 100,
    currency: invoice.currency,
    status: invoice.status ?? undefined,
  }));
}

// ======================== Webhook ======================== //

export async function verifyWebhookSignature(request: Request): Promise<Stripe.Event> {
  const body = await request.clone().text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    throw new Error('Missing stripe-signature header');
  }

  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET not configured');
  }

  return getStripe().webhooks.constructEventAsync(body, signature, webhookSecret);
}

export async function handleWebhookEvent(
  event: Stripe.Event,
  handlers: {
    onCheckoutCompleted: (payload: SubscriptionPayload) => Promise<void>;
    onSubscriptionUpdated: (payload: SubscriptionPayload) => Promise<void>;
    onSubscriptionDeleted: (subscriptionId: string) => Promise<void>;
    onCustomerCreated: (payload: CustomerPayload) => Promise<void>;
    onCustomerUpdated: (payload: CustomerPayload) => Promise<void>;
    onCustomerDeleted: (customerId: string) => Promise<void>;
  }
): Promise<void> {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== 'subscription' || !session.subscription) return;

      const subscription = await getStripe().subscriptions.retrieve(
        session.subscription as string
      );
      const payload = buildSubscriptionPayload(subscription, session.client_reference_id!);
      await handlers.onCheckoutCompleted(payload);
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const payload = buildSubscriptionPayload(subscription);
      await handlers.onSubscriptionUpdated(payload);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await handlers.onSubscriptionDeleted(subscription.id);
      break;
    }

    case 'customer.created':
    case 'customer.updated': {
      const customer = event.data.object as Stripe.Customer;
      if (!customer.metadata?.organizationId) return;
      await (event.type === 'customer.created' ? handlers.onCustomerCreated : handlers.onCustomerUpdated)({
        customerId: customer.id,
        organizationId: customer.metadata.organizationId,
        email: customer.email ?? '',
      });
      break;
    }

    case 'customer.deleted': {
      const customer = event.data.object as Stripe.Customer;
      await handlers.onCustomerDeleted(customer.id);
      break;
    }

    default:
      // Unhandled event type - ignore silently
  }
}

// ======================== Helpers ======================== //

function buildSubscriptionPayload(
  subscription: Stripe.Subscription,
  organizationIdOverride?: string
): SubscriptionPayload {
  const firstItem = subscription.items.data[0];
  const organizationId = organizationIdOverride || subscription.metadata?.organizationId || '';

  return {
    subscriptionId: subscription.id,
    organizationId,
    customerId: subscription.customer as string,
    status: subscription.status,
    active: subscription.status === 'active' || subscription.status === 'trialing',
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    currency: subscription.currency,
    periodStartsAt: formatStripeDate(firstItem?.current_period_start),
    periodEndsAt: formatStripeDate(firstItem?.current_period_end),
    trialStartsAt: subscription.trial_start ? formatStripeDate(subscription.trial_start) : undefined,
    trialEndsAt: subscription.trial_end ? formatStripeDate(subscription.trial_end) : undefined,
    priceId: firstItem?.price?.id,
    priceAmount: firstItem?.price?.unit_amount ?? undefined,
  };
}

function formatStripeDate(timestamp: number | null | undefined): string {
  if (!timestamp) return new Date().toISOString();
  return new Date(timestamp * 1000).toISOString();
}



