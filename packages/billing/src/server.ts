/**
 * @workspace/billing/server
 * 
 * Server-only exports for Stripe API and webhook handlers.
 * Only import this in Server Components or API routes.
 */
import 'server-only';

// Re-export everything from main index (client-safe)
export * from './index';

// Stripe integration (server-only)
export {
  getStripe,
  createCustomer,
  createCheckoutSession,
  createBillingPortalSession,
  getInvoices,
  verifyWebhookSignature,
  handleWebhookEvent,
} from './stripe';

// Webhook handlers (server-only)
export {
  handleCheckoutCompleted,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handleCustomerCreated,
  handleCustomerUpdated,
  handleCustomerDeleted,
} from './webhook';
