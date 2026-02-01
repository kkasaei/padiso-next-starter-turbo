import { env } from '@/env';

// Feature type that supports optional badges
export type PlanFeature = string | { text: string; badge: string };

// Plan limits configuration based on pricing structure
// -1 = unlimited, 0 = feature not included

export const PLAN_LIMITS = {
  growth: {
    maxBrands: 5,
    maxPrompts: 150,
    maxCompetitors: 10,
    maxKeywords: 10,
    maxIntegrations: 5,
    maxInsightsQueries: 30,
    maxSiteAuditPages: 25,
    maxContentGen: 30,
    maxImageGen: 0,
    maxAudioMinutes: 0,
    maxApiCalls: -1,
  },
  scale: {
    maxBrands: -1,
    maxPrompts: -1,
    maxCompetitors: -1,
    maxKeywords: -1,
    maxIntegrations: -1,
    maxInsightsQueries: -1,
    maxSiteAuditPages: -1,
    maxContentGen: -1,
    maxImageGen: -1,
    maxAudioMinutes: -1,
    maxApiCalls: -1,
  },
} as const;

export type PlanId = keyof typeof PLAN_LIMITS;

// Plan pricing configuration
export const PLANS = {
  growth: {
    id: 'growth',
    name: 'Growth Engine',
    tagline: 'For Smart Entrepreneurs',
    description: 'Everything you need to build lasting organic visibility and drive sustainable growth.',
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
        amount: 948,
        currency: 'USD',
        originalAmount: 3588,
      },
    },
    features: [
      '5 brands with 150 prompts tracked',
      { text: '10 competitors & 50 keywords monitoring', badge: 'Coming soon' },
      '30 SEO & AI-optimized articles published monthly',
      { text: 'Premium backlinks from 2,500+ vetted partner sites (worth $800+/mo)', badge: 'Coming soon' },
      'Real-time AI-driven research & expert-backed content',
      'Articles with citations, internal links & branded infographics',
      { text: 'Reddit agent that builds your brand visibility & authority', badge: 'Coming soon' },
      'JSON-LD schema markup for featured snippets',
      'Technical SEO audit (Google & AI crawlability)',
      'Visibility dashboard with weekly refresh',
      'Integrates with WordPress, Webflow, Shopify, Wix & API',
      'Webhook support & weekly email digest',
      'Email support (24hr response)',
      { text: 'Articles available in 20+ languages', badge: 'Add-on' },
    ],
  },
  scale: {
    id: 'scale',
    name: 'Scale Partner',
    tagline: 'For Agencies, Enterprises & Teams',
    description: 'Custom solutions for agencies, enterprises, and businesses serving multiple clients.',
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
    ],
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
