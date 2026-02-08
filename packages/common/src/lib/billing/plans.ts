/**
 * Plan configuration for marketing/pricing UI components.
 *
 * All numerical limits are derived from @workspace/billing (limits.json)
 * which is the single source of truth. Do NOT hardcode numbers here.
 */

import {
  PLAN_LIMITS as BILLING_LIMITS,
  formatLimit,
  type PlanLimits,
} from '@workspace/billing';

// Feature type that supports optional badges
export type PlanFeature = string | { text: string; badge: string };

// ─── Plan Limits (derived from @workspace/billing) ──────────
// Flat structure for backward compatibility with existing consumers.
// "scale" maps to billing's "custom" plan for marketing naming.

export const PLAN_LIMITS = {
  growth: {
    maxBrands: BILLING_LIMITS.growth.brands.max,
    maxPrompts: BILLING_LIMITS.growth.prompts.maxGlobal,
    maxCompetitors: BILLING_LIMITS.growth.competitors.maxPerBrand,
    maxKeywords: BILLING_LIMITS.growth.keywords.maxPerBrand,
    maxIntegrations: BILLING_LIMITS.growth.integrations.max,
    maxInsightsQueries: BILLING_LIMITS.growth.visibility.maxInsightsQueries,
    maxSiteAuditPages: BILLING_LIMITS.growth.technicalAudit.maxPages,
    maxContentGen: BILLING_LIMITS.growth.content.maxPerBrand,
    maxImageGen: BILLING_LIMITS.growth.media.maxImageGen,
    maxAudioMinutes: BILLING_LIMITS.growth.media.maxAudioMinutes,
    maxApiCalls: BILLING_LIMITS.growth.api.maxCalls,
  },
  scale: {
    maxBrands: BILLING_LIMITS.custom.brands.max,
    maxPrompts: BILLING_LIMITS.custom.prompts.maxGlobal,
    maxCompetitors: BILLING_LIMITS.custom.competitors.maxPerBrand,
    maxKeywords: BILLING_LIMITS.custom.keywords.maxPerBrand,
    maxIntegrations: BILLING_LIMITS.custom.integrations.max,
    maxInsightsQueries: BILLING_LIMITS.custom.visibility.maxInsightsQueries,
    maxSiteAuditPages: BILLING_LIMITS.custom.technicalAudit.maxPages,
    maxContentGen: BILLING_LIMITS.custom.content.maxPerBrand,
    maxImageGen: BILLING_LIMITS.custom.media.maxImageGen,
    maxAudioMinutes: BILLING_LIMITS.custom.media.maxAudioMinutes,
    maxApiCalls: BILLING_LIMITS.custom.api.maxCalls,
  },
};

export type PlanId = keyof typeof PLAN_LIMITS;

// Helper: shorthand references
const gL = BILLING_LIMITS.growth;
const cL = BILLING_LIMITS.custom;

// Plan pricing configuration
export const PLANS = {
  growth: {
    id: 'growth',
    name: 'Growth',
    tagline: 'For Small Businesses',
    description: 'Put your growth engine on autopilot. Everything you need to build lasting organic visibility.',
    trialDays: 7,
    recommended: true,
    prices: {
      month: {
        id: 'price_growth_month',
        amount: 99,
        currency: 'USD',
        originalAmount: 299,
      },
      year: {
        id: 'price_growth_year',
        amount: 990,
        currency: 'USD',
        originalAmount: 3588,
      },
    },
    features: [
      `${formatLimit(gL.brands.max)} brands with ${formatLimit(gL.prompts.maxGlobal)} prompts tracked`,
      { text: `${formatLimit(gL.competitors.maxPerBrand)} competitors & ${formatLimit(gL.keywords.maxPerBrand)} keywords monitoring`, badge: 'Coming soon' },
      `${formatLimit(gL.content.maxPerBrand)} SEO & AI-optimized articles published monthly`,
      { text: 'Premium backlinks from a growing network of vetted partner sites (worth $800+/mo)', badge: 'Coming soon' },
      'Real-time AI-driven research & expert-backed content',
      'Articles with citations, internal links & branded infographics',
      { text: 'Reddit agent that builds your brand visibility & authority', badge: 'Coming soon' },
      'JSON-LD schema markup for featured snippets',
      `Technical SEO audit (Google & AI crawlability)`,
      'Visibility dashboard with weekly refresh',
      'Integrates with WordPress, Webflow, Shopify, Wix & API',
      'Webhook support & weekly email digest',
      'Email support (24hr response)',
      { text: 'Articles available in 20+ languages', badge: 'Add-on' },
    ] as PlanFeature[],
  },
  scale: {
    id: 'scale',
    name: 'Scale',
    tagline: 'For Larger Organizations',
    description: 'Custom solutions for agencies, enterprises, and teams that need more power and flexibility.',
    isEnterprise: true,
    prices: {
      month: {
        id: 'price_scale_month',
        amount: 0,
        currency: 'USD',
      },
      year: {
        id: 'price_scale_year',
        amount: 0,
        currency: 'USD',
      },
    },
    features: [
      'Tailormade solution for your needs',
      'Customer Success Manager',
      'Priority support',
    ] as PlanFeature[],
  },
} as const;

export function getPlanById(planId: string): typeof PLANS[PlanId] | undefined {
  if (planId in PLANS) {
    return PLANS[planId as PlanId];
  }
  const basePlanId = planId.split('_')[0] as PlanId;
  return PLANS[basePlanId];
}

export function getPlanLimits(planId: string) {
  if (planId in PLAN_LIMITS) {
    return PLAN_LIMITS[planId as PlanId];
  }
  const basePlanId = planId.split('_')[0] as PlanId;
  return PLAN_LIMITS[basePlanId] || PLAN_LIMITS.growth;
}

export function getPlanIdFromPriceId(priceId: string): PlanId {
  for (const [planId, plan] of Object.entries(PLANS)) {
    if (plan.prices.month.id === priceId || plan.prices.year.id === priceId) {
      return planId as PlanId;
    }
  }
  return 'growth';
}

export function getIntervalFromPriceId(priceId: string): 'month' | 'year' {
  for (const plan of Object.values(PLANS)) {
    if (plan.prices.year.id === priceId) return 'year';
  }
  return 'month';
}
