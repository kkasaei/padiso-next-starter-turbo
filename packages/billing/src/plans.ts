import { env } from './env';

// Feature type that supports optional badges
export type PlanFeature = string | { text: string; badge: string };

// Plan limits configuration based on new 2-tier pricing structure
// -1 = unlimited, 0 = feature not included

export const PLAN_LIMITS = {
  growth: {
    // Count-based limits
    maxBrands: 5,
    maxPrompts: 150,
    maxCompetitors: 10,
    maxKeywords: 10,
    maxIntegrations: 5,
    // Usage-based limits (monthly)
    maxInsightsQueries: 30,
    maxSiteAuditPages: 25,
    maxContentGen: 25,
    maxImageGen: 10,
    maxAudioMinutes: 30,
    maxApiCalls: 1000,
  },
  custom: {
    // Unlimited or custom limits
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

// Plan pricing configuration - New 2-tier model
export const PLANS = {
  growth: {
    id: 'growth',
    name: 'Growth',
    description: 'For growing brands ready to take action and optimize their AI visibility.',
    trialDays: 7,
    recommended: true,
    prices: {
      month: {
        id: env.NEXT_PUBLIC_BILLING_PRICE_GROWTH_PLAN_MONTHLY_ID || 'price_growth_month',
        amount: 99,
        currency: 'USD',
      },
      year: {
        id: env.NEXT_PUBLIC_BILLING_PRICE_GROWTH_PLAN_YEARLY_ID || 'price_growth_year',
        amount: 990,
        currency: 'USD',
      },
    },
    features: [
      '5 brands',
      '150 prompts tracked',
      '10 competitors',
      '10 keywords',
      'Weekly Opportunities Report (30 opportunities)',
      'Weekly visibility refresh',
      'Visibility dashboard',
      'Site audit (25 pages/mo per brand)',
      'Content generation (25 pieces/mo)',
      'Image generation (10 images/mo)',
      'Audio generation (30 min/mo)',
      'API access (1,000 calls/mo)',
      'Webhook support',
      'Weekly email digest',
      'Email support (24hr)',
    ],
    notIncluded: [
      'Unlimited resources',
      'Daily visibility refresh',
      'Dedicated Customer Success Manager',
      'SLA guarantee',
      'Custom integrations',
    ],
  },
  custom: {
    id: 'custom',
    name: 'Custom',
    description: 'For agencies and large brands with custom needs and unlimited scale.',
    isEnterprise: true,
    prices: {
      month: {
        id: env.NEXT_PUBLIC_BILLING_PRICE_CUSTOM_PLAN_MONTHLY_ID || 'price_custom_month',
        amount: 2000,
        currency: 'USD',
      },
      year: {
        id: env.NEXT_PUBLIC_BILLING_PRICE_CUSTOM_PLAN_YEARLY_ID || 'price_custom_year',
        amount: 20000,
        currency: 'USD',
      },
    },
    features: [
      'Unlimited brands',
      'Unlimited prompts',
      'Unlimited competitors',
      'Unlimited keywords',
      'Unlimited Opportunities Report',
      'Daily visibility refresh',
      'Visibility dashboard',
      'Unlimited site audit',
      'Unlimited content generation',
      'Unlimited image generation',
      'Unlimited audio generation',
      'Unlimited API access',
      'Custom integrations',
      'Webhook support',
      'Real-time email alerts',
      'Priority live chat support (1hr)',
      'Email support (4hr)',
      'Dedicated Customer Success Manager',
      'SLA guarantee (99.9% uptime)',
      'Slack Connect support channel',
      'Custom training & onboarding',
    ],
  },
} as const;

export function getPlanById(planId: string): typeof PLANS[PlanId] | undefined {
  // Extract base plan id (e.g., "growth" from "growth_monthly" or "price_growth_month")
  const basePlanId = planId.split('_')[0] as PlanId;
  return PLANS[basePlanId];
}

export function getPlanLimits(planId: string) {
  const basePlanId = planId.split('_')[0] as PlanId;
  return PLAN_LIMITS[basePlanId] || PLAN_LIMITS.growth;
}

export function getPlanIdFromPriceId(priceId: string): PlanId {
  for (const [planId, plan] of Object.entries(PLANS)) {
    if (plan.prices.month.id === priceId || plan.prices.year.id === priceId) {
      return planId as PlanId;
    }
  }
  return 'growth'; // Default fallback
}

export function getIntervalFromPriceId(priceId: string): 'month' | 'year' {
  for (const plan of Object.values(PLANS)) {
    if (plan.prices.year.id === priceId) return 'year';
  }
  return 'month';
}



