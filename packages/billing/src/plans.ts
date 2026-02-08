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

// ─── Source of Truth: limits.json ───────────────────────────
// All numerical limits come from limits.json — never hardcode plan numbers elsewhere.
export const PLAN_LIMITS: Record<PlanId, PlanLimits> = PLAN_LIMITS_JSON as unknown as Record<PlanId, PlanLimits>;

// ─── Display Helpers ────────────────────────────────────────

/** Format a limit value for display (-1 becomes "Unlimited", numbers get locale formatting) */
export function formatLimit(value: number): string {
  if (value === -1) return 'Unlimited';
  return value.toLocaleString('en-US');
}

/** Format a limit with a unit suffix (e.g., "1 GB" or "Unlimited") */
export function formatLimitWithUnit(value: number, unit: string): string {
  if (value === -1) return 'Unlimited';
  return `${value.toLocaleString('en-US')} ${unit}`;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── Feature Generation (derived from PLAN_LIMITS) ──────────

/** Generate the display feature list for the Growth plan */
function growthFeatures(): PlanFeature[] {
  const l = PLAN_LIMITS.growth;
  return [
    `${formatLimit(l.brands.max)} brands`,
    `${formatLimit(l.prompts.maxGlobal)} prompts tracked`,
    `${formatLimit(l.competitors.maxPerBrand)} competitors`,
    `${formatLimit(l.keywords.maxPerBrand)} keywords`,
    `${capitalize(l.visibility.refreshRate)} Opportunities Report (${formatLimit(l.visibility.maxInsightsQueries)} opportunities)`,
    `${capitalize(l.visibility.refreshRate)} visibility refresh`,
    'Visibility dashboard',
    `Site audit (${formatLimit(l.technicalAudit.maxPages)} pages/mo per brand)`,
    `Content generation (${formatLimit(l.content.maxPerBrand)} pieces/mo)`,
    `Image generation (${formatLimit(l.media.maxImageGen)} images/mo)`,
    `Audio generation (${formatLimit(l.media.maxAudioMinutes)} min/mo)`,
    `API access (${formatLimit(l.api.maxCalls)} calls/mo)`,
    'Webhook support',
    'Weekly email digest',
    'Email support (24hr)',
  ];
}

/** Generate the display feature list for the Custom plan */
function customFeatures(): PlanFeature[] {
  const l = PLAN_LIMITS.custom;
  return [
    `${formatLimit(l.brands.max)} brands`,
    `${formatLimit(l.prompts.maxGlobal)} prompts`,
    `${formatLimit(l.competitors.maxGlobal)} competitors`,
    `${formatLimit(l.keywords.maxGlobal)} keywords`,
    `${formatLimit(l.visibility.maxInsightsQueries)} Opportunities Report`,
    `${capitalize(l.visibility.refreshRate)} visibility refresh`,
    'Visibility dashboard',
    `${formatLimit(l.technicalAudit.maxPages)} site audit`,
    `${formatLimit(l.content.maxGlobal)} content generation`,
    `${formatLimit(l.media.maxImageGen)} image generation`,
    `${formatLimit(l.media.maxAudioMinutes)} audio generation`,
    `${formatLimit(l.api.maxCalls)} API access`,
    'Custom integrations',
    'Webhook support',
    'Real-time email alerts',
    'Priority live chat support (1hr)',
    'Email support (4hr)',
    'Dedicated Customer Success Manager',
    'SLA guarantee (99.9% uptime)',
    'Slack Connect support channel',
    'Custom training & onboarding',
  ];
}

/** Features not included in Growth plan (shown for upsell comparison) */
function growthNotIncluded(): string[] {
  return [
    'Unlimited resources',
    `${capitalize(PLAN_LIMITS.custom.visibility.refreshRate)} visibility refresh`,
    'Dedicated Customer Success Manager',
    'SLA guarantee',
    'Custom integrations',
  ];
}

// ─── Feature Comparison Table ───────────────────────────────

export type FeatureComparisonItem = {
  name: string;
  growth: string;
  custom: string;
};

export type FeatureComparisonCategory = {
  category: string;
  features: FeatureComparisonItem[];
};

/**
 * Generate feature comparison data for plan comparison tables.
 * All values derived from PLAN_LIMITS (limits.json).
 */
export function getFeatureComparison(): FeatureComparisonCategory[] {
  const g = PLAN_LIMITS.growth;
  const c = PLAN_LIMITS.custom;
  const f = formatLimit;
  const cap = capitalize;

  return [
    { category: 'Brands & Tracking', features: [
      { name: 'Brands', growth: f(g.brands.max), custom: f(c.brands.max) },
      { name: 'Prompts tracked', growth: `${f(g.prompts.maxGlobal)} (${f(g.prompts.maxPerBrand)}/brand)`, custom: f(c.prompts.maxGlobal) },
      { name: 'Competitors', growth: `${f(g.competitors.maxGlobal)} (${f(g.competitors.maxPerBrand)}/brand)`, custom: f(c.competitors.maxGlobal) },
      { name: 'Keywords', growth: `${f(g.keywords.maxGlobal)} (${f(g.keywords.maxPerBrand)}/brand)`, custom: f(c.keywords.maxGlobal) },
    ]},
    { category: 'Content & Media', features: [
      { name: 'Content pieces/month', growth: `${f(g.content.maxGlobal)} (${f(g.content.maxPerBrand)}/brand)`, custom: f(c.content.maxGlobal) },
      { name: 'AI images/month', growth: f(g.media.maxImageGen), custom: f(c.media.maxImageGen) },
      { name: 'Audio minutes/month', growth: f(g.media.maxAudioMinutes), custom: f(c.media.maxAudioMinutes) },
      { name: 'Content refresh', growth: cap(g.content.refreshRate), custom: cap(c.content.refreshRate) },
    ]},
    { category: 'AI Visibility', features: [
      { name: 'Visibility queries', growth: f(g.visibility.maxInsightsQueries), custom: f(c.visibility.maxInsightsQueries) },
      { name: 'Visibility refresh', growth: cap(g.visibility.refreshRate), custom: cap(c.visibility.refreshRate) },
      { name: 'Technical audit pages', growth: f(g.technicalAudit.maxPages), custom: f(c.technicalAudit.maxPages) },
    ]},
    { category: 'Reddit & Social', features: [
      { name: 'Reddit keywords/brand', growth: f(g.reddit.maxKeywordsPerBrand), custom: f(c.reddit.maxKeywordsPerBrand) },
      { name: 'Reddit scans/brand', growth: f(g.reddit.maxScansPerBrand), custom: f(c.reddit.maxScansPerBrand) },
      { name: 'Total Reddit scans', growth: f(g.reddit.maxScansGlobal), custom: f(c.reddit.maxScansGlobal) },
    ]},
    { category: 'Team & Integrations', features: [
      { name: 'Team members', growth: f(g.team.maxMembers), custom: f(c.team.maxMembers) },
      { name: 'Integrations', growth: f(g.integrations.max), custom: f(c.integrations.max) },
      { name: 'Webhooks/brand', growth: f(g.webhooks.maxPerBrand), custom: f(c.webhooks.maxPerBrand) },
      { name: 'API calls/month', growth: f(g.api.maxCalls), custom: f(c.api.maxCalls) },
    ]},
    { category: 'Storage & History', features: [
      { name: 'Storage/brand', growth: formatLimitWithUnit(g.storage.maxGbPerBrand, 'GB'), custom: formatLimitWithUnit(c.storage.maxGbPerBrand, 'GB') },
      { name: 'History retention', growth: formatLimitWithUnit(g.history.retentionMonths, 'months'), custom: formatLimitWithUnit(c.history.retentionMonths, 'months') },
      { name: 'Extensions', growth: f(g.extensions.max), custom: f(c.extensions.max) },
      { name: 'Tasks', growth: f(g.tasks.maxGlobal), custom: f(c.tasks.maxGlobal) },
    ]},
  ];
}

// ─── Plan Configuration ─────────────────────────────────────
// Plan metadata + features (features are derived from PLAN_LIMITS above).

export const PLANS = {
  growth: {
    id: 'growth' as const,
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
    features: growthFeatures(),
    notIncluded: growthNotIncluded(),
  },
  custom: {
    id: 'custom' as const,
    name: 'Custom',
    description: 'For agencies and large brands with custom needs and unlimited scale.',
    isEnterprise: true as const,
    features: customFeatures(),
  },
};

// ─── Utility Functions ──────────────────────────────────────

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
