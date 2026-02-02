/**
 * @workspace/billing package
 * 
 * Central export for billing and payment functionality
 */

// Environment configuration
export { env, validateEnv } from './env';
export type * from './env';

// Plans configuration
export {
  PLAN_LIMITS,
  PLANS,
  getPlanById,
  getPlanLimits,
  getPlanIdFromPriceId,
  getIntervalFromPriceId,
} from './plans';
export type { PlanFeature, PlanId } from './plans';

// Stripe integration
export {
  getStripe,
  createCustomer,
  createCheckoutSession,
  createBillingPortalSession,
  getInvoices,
  verifyWebhookSignature,
  handleWebhookEvent,
} from './stripe';
export type {
  SubscriptionPayload,
  CustomerPayload,
  Invoice,
} from './stripe';

// Webhook handlers
export {
  handleCheckoutCompleted,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handleCustomerCreated,
  handleCustomerUpdated,
  handleCustomerDeleted,
} from './webhook';
