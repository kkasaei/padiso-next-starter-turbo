export type UserRole =
  | 'founder'
  | 'marketing-manager'
  | 'seo-specialist'
  | 'product-manager'
  | 'agency-owner'
  | 'content-creator'
  | 'other';

export type BusinessType =
  | 'saas'
  | 'ecommerce'
  | 'agency'
  | 'b2b-services'
  | 'local-business'
  | 'content-media'
  | 'healthcare'
  | 'education'
  | 'finance'
  | 'real-estate'
  | 'travel-hospitality'
  | 'technology'
  | 'other';

export type TeamSize =
  | 'solo'
  | '2-5'
  | '6-20'
  | '21-50'
  | '51-200'
  | '200+';

export type PrimaryGoal =
  | 'track-visibility'
  | 'improve-rankings'
  | 'monitor-competitors'
  | 'generate-reports'
  | 'understand-mentions'
  | 'all';

export type HelpNeeded =
  | 'aeo-basics'
  | 'performance-metrics'
  | 'competitor-analysis'
  | 'content-optimization'
  | 'reporting'
  | 'ai-trends';

export type FindSource =
  | 'ai-search'
  | 'google-search'
  | 'social-media'
  | 'recommendation'
  | 'blog-article'
  | 'youtube-podcast'
  | 'product-hunt'
  | 'newsletter-email'
  | 'ad'
  | 'other';

export type SupportChannel =
  | 'live-chat'
  | 'email'
  | 'phone'
  | 'sms'
  | 'whatsapp'
  | 'social-media'
  | 'other';

export interface OnboardingData {
  role: UserRole | null;
  businessType: BusinessType | null;
  teamSize: TeamSize | null;
  primaryGoal: PrimaryGoal[];
  helpNeeded: HelpNeeded[];
  findSource: FindSource | null;
  supportChannels: SupportChannel[];
}

export const INITIAL_ONBOARDING_DATA: OnboardingData = {
  role: null,
  businessType: null,
  teamSize: null,
  primaryGoal: [],
  helpNeeded: [],
  findSource: null,
  supportChannels: [],
};

