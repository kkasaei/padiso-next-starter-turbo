/**
 * @workspace/billing package
 * 
 * Client-safe exports for billing and payment functionality.
 * For server-only exports (Stripe API, webhooks), import from '@workspace/billing/server'
 */

// Environment configuration (client-safe parts)
export { env, validateEnv } from './env';
export type * from './env';

// Plans configuration (fully client-safe)
export {
  PLAN_LIMITS,
  PLANS,
  getPlanById,
  getPlanLimits,
  getPlanIdFromPriceId,
  getIntervalFromPriceId,
} from './plans';
export type { PlanFeature, PlanId } from './plans';

// Re-export types only from stripe (types are client-safe)
export type {
  SubscriptionPayload,
  CustomerPayload,
  Invoice,
} from './stripe';
