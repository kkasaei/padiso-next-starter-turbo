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
  // Display helpers — use these to format limit values from PLAN_LIMITS
  formatLimit,
  formatLimitWithUnit,
  // Feature comparison — use this for plan comparison tables
  getFeatureComparison,
} from './plans';
export type {
  PlanFeature,
  PlanId,
  PlanLimits,
  RefreshRate,
  FeatureComparisonItem,
  FeatureComparisonCategory,
  // Functional area types
  WorkspacesLimits,
  TeamLimits,
  BrandsLimits,
  PromptsLimits,
  CompetitorsLimits,
  KeywordsLimits,
  IntegrationsLimits,
  ExtensionsLimits,
  TasksLimits,
  VisibilityLimits,
  ContentLimits,
  MediaLimits,
  TechnicalAuditLimits,
  BacklinksLimits,
  RedditLimits,
  StorageLimits,
  WebhooksLimits,
  HistoryLimits,
  ApiLimits,
} from './plans';

// Re-export types only from stripe (types are client-safe)
export type {
  SubscriptionPayload,
  CustomerPayload,
  Invoice,
} from './stripe';
