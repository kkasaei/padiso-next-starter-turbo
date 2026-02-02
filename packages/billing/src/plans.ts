import { env } from '@/env';

// Feature type that supports optional badges
export type PlanFeature = string | { text: string; badge: string };

// Plan limits configuration based on pricing structure
// -1 = unlimited, 0 = feature not included

export const PLAN_LIMITS = {
  starter: {
    // Count-based limits
    maxBrands: 1,
    maxPrompts: 25,
    maxCompetitors: 3, // Coming soon
    maxKeywords: 3, // Coming soon
    maxIntegrations: 1,
    // Usage-based limits (monthly)
    maxInsightsQueries: 10, // 10 opportunities
    maxSiteAuditPages: 0,
    maxContentGen: 0,
    maxImageGen: 0,
    maxAudioMinutes: 0,
    maxApiCalls: 0,
  },
  growth: {
    maxBrands: 5,
    maxPrompts: 150,
    maxCompetitors: 10, // Coming soon
    maxKeywords: 10, // Coming soon
    maxIntegrations: 5,
    maxInsightsQueries: 30, // 30 opportunities
    maxSiteAuditPages: 25, // 25 pages/mo per brand
    maxContentGen: 0,
    maxImageGen: 0,
    maxAudioMinutes: 0,
    maxApiCalls: 0,
  },
  pro: {
    maxBrands: 10,
    maxPrompts: 300,
    maxCompetitors: 100, // Coming soon
    maxKeywords: 100, // Coming soon
    maxIntegrations: -1,
    maxInsightsQueries: 100, // 100 opportunities
    maxSiteAuditPages: 100, // 100 pages/mo per brand
    maxContentGen: 50, // 50 pieces/mo per brand
    maxImageGen: 0,
    maxAudioMinutes: 0,
    maxApiCalls: 0,
  },
  enterprise: {
    maxBrands: -1,
    maxPrompts: -1,
    maxCompetitors: -1,
    maxKeywords: -1,
    maxIntegrations: -1,
    maxInsightsQueries: -1, // Unlimited opportunities
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
  starter: {
    id: 'starter',
    name: 'Starter',
    description: 'Track and learn - For solo marketers starting their AI visibility journey.',
    trialDays: 7,
    prices: {
      month: {
        id: env.NEXT_PUBLIC_BILLING_PRICE_STARTER_MONTH_ID || 'price_starter_month',
        amount: 49,
        currency: 'USD',
      },
      year: {
        id: env.NEXT_PUBLIC_BILLING_PRICE_STARTER_YEAR_ID || 'price_starter_year',
        amount: 468, // $39/mo
        currency: 'USD',
      },
    },
    features: [
      '1 brand',
      '25 prompts tracked',
      { text: '3 competitors', badge: 'Coming soon' },
      { text: '3 keywords', badge: 'Coming soon' },
      'Weekly Opportunities Report (10 opportunities)',
      'Weekly visibility refresh',
      'Visibility dashboard',
      'Webhook support',
      'Weekly email digest',
      'Email support (48hr)',
    ],
    notIncluded: [
      'Site audit',
      'Content generation',
      'Ask AI Assistant',
      'Live chat support',
      'Dedicated Customer Success Manager',
      'SLA guarantee',
    ],
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    description: 'Monitor and optimize - For growing brands ready to take action.',
    trialDays: 7,
    recommended: true,
    prices: {
      month: {
        id: env.NEXT_PUBLIC_BILLING_PRICE_GROWTH_MONTH_ID || 'price_growth_month',
        amount: 199,
        currency: 'USD',
      },
      year: {
        id: env.NEXT_PUBLIC_BILLING_PRICE_GROWTH_YEAR_ID || 'price_growth_year',
        amount: 1908, // $159/mo
        currency: 'USD',
      },
    },
    features: [
      '5 brands',
      '150 prompts tracked',
      { text: '10 competitors', badge: 'Coming soon' },
      { text: '10 keywords', badge: 'Coming soon' },
      'Weekly Opportunities Report (30 opportunities)',
      'Weekly visibility refresh',
      'Visibility dashboard',
      'Site audit (25 pages/mo per brand)',
      'Webhook support',
      'Weekly email digest',
      'Email support (24hr)',
    ],
    notIncluded: [
      'Content generation',
      'Ask AI Assistant',
      'Live chat support',
      'Daily visibility refresh',
      'Dedicated Customer Success Manager',
      'SLA guarantee',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'Full platform - For serious teams and small agencies.',
    trialDays: 7,
    prices: {
      month: {
        id: env.NEXT_PUBLIC_BILLING_PRICE_PRO_MONTH_ID || 'price_pro_month',
        amount: 499,
        currency: 'USD',
      },
      year: {
        id: env.NEXT_PUBLIC_BILLING_PRICE_PRO_YEAR_ID || 'price_pro_year',
        amount: 4788, // $399/mo
        currency: 'USD',
      },
    },
    features: [
      '10 brands',
      '300 prompts tracked',
      { text: '100 competitors', badge: 'Coming soon' },
      { text: '100 keywords', badge: 'Coming soon' },
      'Weekly Opportunities Report (100 opportunities)',
      'Weekly visibility refresh',
      'Visibility dashboard',
      'Site audit (100 pages/mo per brand)',
      'Content generation (50 pieces/mo per brand)',
      'Ask AI Assistant',
      'Webhook support',
      'Weekly email digest',
      'Priority live chat support (4hr)',
      'Email support (12hr)',
    ],
    notIncluded: [
      'Daily visibility refresh',
      'Dedicated Customer Success Manager',
      'SLA guarantee',
      'Slack Connect support channel',
      'Custom training & onboarding',
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Unlimited scale - For agencies and large brands with custom needs.',
    isEnterprise: true,
    prices: {
      month: {
        id: env.NEXT_PUBLIC_BILLING_PRICE_ENTERPRISE_MONTH_ID || 'price_enterprise_month',
        amount: 1500,
        currency: 'USD',
      },
      year: {
        id: env.NEXT_PUBLIC_BILLING_PRICE_ENTERPRISE_YEAR_ID || 'price_enterprise_year',
        amount: 18000,
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
      'Ask AI Assistant',
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
  // Extract base plan id (e.g., "starter" from "starter_monthly" or "price_starter_month")
  const basePlanId = planId.split('_')[0] as PlanId;
  return PLANS[basePlanId];
}

export function getPlanLimits(planId: string) {
  const basePlanId = planId.split('_')[0] as PlanId;
  return PLAN_LIMITS[basePlanId] || PLAN_LIMITS.starter;
}

export function getPlanIdFromPriceId(priceId: string): PlanId {
  for (const [planId, plan] of Object.entries(PLANS)) {
    if (plan.prices.month.id === priceId || plan.prices.year.id === priceId) {
      return planId as PlanId;
    }
  }
  return 'starter'; // Default fallback
}

export function getIntervalFromPriceId(priceId: string): 'month' | 'year' {
  for (const plan of Object.values(PLANS)) {
    if (plan.prices.year.id === priceId) return 'year';
  }
  return 'month';
}



