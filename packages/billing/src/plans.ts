import { env } from './env';
import PLAN_LIMITS_JSON from './limits.json';

// Feature type that supports optional badges
export type PlanFeature = string | { text: string; badge: string };

// Limit types
// -1 = unlimited, 0 = feature not included

export type RefreshRate = 'daily' | 'weekly' | 'monthly';

// Functional area limit types
export type WorkspacesLimits = {
  max: number;
};

export type TeamLimits = {
  maxMembers: number;
};

export type BrandsLimits = {
  max: number;
};

export type PromptsLimits = {
  maxGlobal: number;
  maxPerBrand: number;
};

export type CompetitorsLimits = {
  maxGlobal: number;
  maxPerBrand: number;
};

export type KeywordsLimits = {
  maxGlobal: number;
  maxPerBrand: number;
};

export type IntegrationsLimits = {
  max: number;
};

export type ExtensionsLimits = {
  max: number;
};

export type TasksLimits = {
  maxGlobal: number;
  maxPerBrand: number;
};

export type VisibilityLimits = {
  maxInsightsQueries: number;
  refreshRate: RefreshRate;
};

export type ContentLimits = {
  maxGlobal: number;
  maxPerBrand: number;
  refreshRate: RefreshRate;
};

export type MediaLimits = {
  maxImageGen: number;
  maxAudioMinutes: number;
};

export type TechnicalAuditLimits = {
  maxPages: number;
};

export type BacklinksLimits = {
  max: number; // Note: uses separate credit system
};

export type RedditLimits = {
  maxKeywordsPerBrand: number;
  maxScansPerBrand: number;
  maxScansGlobal: number;
};

export type StorageLimits = {
  maxGbPerBrand: number;
};

export type WebhooksLimits = {
  maxPerBrand: number;
};

export type HistoryLimits = {
  retentionMonths: number;
};

export type ApiLimits = {
  maxCalls: number;
};

export type PlanLimits = {
  workspaces: WorkspacesLimits;
  team: TeamLimits;
  brands: BrandsLimits;
  prompts: PromptsLimits;
  competitors: CompetitorsLimits;
  keywords: KeywordsLimits;
  integrations: IntegrationsLimits;
  extensions: ExtensionsLimits;
  tasks: TasksLimits;
  visibility: VisibilityLimits;
  content: ContentLimits;
  media: MediaLimits;
  technicalAudit: TechnicalAuditLimits;
  backlinks: BacklinksLimits;
  reddit: RedditLimits;
  storage: StorageLimits;
  webhooks: WebhooksLimits;
  history: HistoryLimits;
  api: ApiLimits;
};

export type PlanId = 'growth' | 'custom';

// Plan limits configuration based on new 2-tier pricing structure
// Imported from limits.json for single source of truth
export const PLAN_LIMITS: Record<PlanId, PlanLimits> = PLAN_LIMITS_JSON;

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
    if ('prices' in plan && (plan.prices.month.id === priceId || plan.prices.year.id === priceId)) {
      return planId as PlanId;
    }
  }
  return 'growth'; // Default fallback
}

export function getIntervalFromPriceId(priceId: string): 'month' | 'year' {
  for (const plan of Object.values(PLANS)) {
    if ('prices' in plan && plan.prices.year.id === priceId) return 'year';
  }
  return 'month';
}



