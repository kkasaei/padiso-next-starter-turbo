/**
 * Integration Types
 *
 * Type definitions for the project integration system.
 * Includes provider metadata, service configurations, and DTOs.
 */

// ============================================================
// ENUMS (Mirror Prisma enums for client-side use)
// ============================================================

export type IntegrationProvider =
  // Search & Webmaster
  | 'GOOGLE'
  | 'MICROSOFT'
  | 'YANDEX'
  | 'BAIDU'
  // AI Platforms
  | 'OPENAI_INTEGRATION'
  | 'ANTHROPIC_INTEGRATION'
  | 'PERPLEXITY_INTEGRATION'
  // Analytics
  | 'GOOGLE_ANALYTICS_INTEGRATION'
  | 'ADOBE_ANALYTICS'
  | 'MIXPANEL'
  | 'AMPLITUDE'
  | 'POSTHOG'
  | 'PLAUSIBLE'
  // Content & CMS
  | 'WORDPRESS'
  | 'WEBFLOW'
  | 'CONTENTFUL'
  | 'SANITY'
  | 'NOTION'
  | 'AIRTABLE'
  | 'GITHUB'
  | 'DROPBOX'
  // Social & Communities
  | 'TWITTER'
  | 'LINKEDIN'
  | 'REDDIT'
  | 'YOUTUBE'
  | 'QUORA'
  | 'DISCORD'
  | 'FACEBOOK'
  | 'TIKTOK'
  // Communication
  | 'SLACK'
  | 'TEAMS'
  // E-commerce
  | 'SHOPIFY_INTEGRATION'
  | 'WOOCOMMERCE'
  | 'BIGCOMMERCE'
  | 'AMAZON_INTEGRATION'
  // Advertising
  | 'GOOGLE_ADS'
  | 'MICROSOFT_ADS'
  | 'META_ADS'
  | 'LINKEDIN_ADS'
  // Automation
  | 'ZAPIER'
  | 'MAKE'
  | 'N8N'
  | 'WEBHOOK'
  // SEO Tools
  | 'AHREFS_INTEGRATION'
  | 'SEMRUSH_INTEGRATION'
  | 'MOZ'
  // Data
  | 'BIGQUERY'
  | 'SNOWFLAKE'
  | 'AWS_S3';

export type ServiceType =
  // Google Services
  | 'GOOGLE_SEARCH_CONSOLE'
  | 'GOOGLE_DRIVE'
  | 'GOOGLE_DOCS'
  | 'GOOGLE_ANALYTICS_4'
  | 'GOOGLE_ADS_SERVICE'
  | 'GOOGLE_INDEXING'
  // Microsoft Services
  | 'BING_WEBMASTER'
  | 'ONEDRIVE'
  | 'SHAREPOINT'
  | 'MICROSOFT_ADS_SERVICE'
  // AI Monitoring
  | 'CHATGPT_MONITORING'
  | 'PERPLEXITY_MONITORING'
  | 'CLAUDE_MONITORING'
  | 'AI_OVERVIEW_MONITORING'
  // Analytics
  | 'GA4_REPORTING'
  | 'MIXPANEL_EVENTS'
  | 'AMPLITUDE_EVENTS'
  // Content
  | 'WORDPRESS_PUBLISH'
  | 'WORDPRESS_IMPORT'
  | 'WEBFLOW_PUBLISH'
  | 'NOTION_SYNC'
  | 'AIRTABLE_SYNC'
  | 'GITHUB_CONTENT'
  // Social Monitoring
  | 'REDDIT_MENTIONS'
  | 'TWITTER_MENTIONS'
  | 'LINKEDIN_MENTIONS'
  | 'YOUTUBE_MENTIONS'
  | 'QUORA_MENTIONS'
  // Notifications
  | 'SLACK_ALERTS'
  | 'TEAMS_ALERTS'
  | 'EMAIL_ALERTS'
  | 'WEBHOOK_ALERTS'
  // E-commerce
  | 'SHOPIFY_PRODUCTS'
  | 'WOOCOMMERCE_PRODUCTS'
  // Advertising
  | 'GOOGLE_ADS_DATA'
  | 'META_ADS_DATA'
  // Automation
  | 'ZAPIER_TRIGGER'
  | 'ZAPIER_ACTION'
  | 'MAKE_TRIGGER'
  | 'MAKE_ACTION'
  | 'N8N_TRIGGER'
  | 'N8N_ACTION'
  | 'CUSTOM_WEBHOOK'
  // SEO Data
  | 'AHREFS_BACKLINKS'
  | 'AHREFS_KEYWORDS'
  | 'SEMRUSH_DATA'
  | 'MOZ_DATA'
  // Data Export
  | 'BIGQUERY_EXPORT'
  | 'S3_EXPORT';

export type IntegrationStatus =
  | 'ACTIVE'
  | 'EXPIRED'
  | 'REVOKED'
  | 'ERROR'
  | 'DISCONNECTED';

export type ServiceStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'ERROR'
  | 'DISABLED'
  | 'NOT_AVAILABLE';

export type SyncStatus = 'SUCCESS' | 'PARTIAL' | 'FAILED' | 'SKIPPED';

export type TrackingTier = 'DAILY' | 'WEEKLY' | 'GSC_ONLY';

export type TrackedKeywordIntent =
  | 'INFORMATIONAL'
  | 'TRANSACTIONAL'
  | 'NAVIGATIONAL'
  | 'COMMERCIAL';

// ============================================================
// SERVICE CONFIGURATION TYPES
// ============================================================

/** Google Search Console service configuration */
export interface GSCServiceConfig {
  siteUrl: string; // "https://example.com" or "sc-domain:example.com"
  permissionLevel?: 'owner' | 'full' | 'restricted';
}

/** Google Drive service configuration */
export interface DriveServiceConfig {
  rootFolderId?: string; // SearchFit folder ID
  folderName?: string; // "SearchFit" or custom name
}

/** Google Docs service configuration */
export interface DocsServiceConfig {
  templateFolderId?: string;
}

/** Bing Webmaster service configuration */
export interface BingServiceConfig {
  siteUrl: string;
  apiKey?: string;
}

/** Slack alerts service configuration */
export interface SlackServiceConfig {
  webhookUrl: string;
  channel?: string;
  notifyOnMentionDrop?: boolean;
  notifyOnPositionChange?: boolean;
  notifyOnNewCompetitor?: boolean;
}

/** Webhook service configuration */
export interface WebhookExecution {
  id: string;
  timestamp: string;
  success: boolean;
  statusCode?: number;
  duration: number;
  errorMessage?: string;
  event?: string;
}

export interface WebhookServiceConfig {
  url: string;
  method?: 'POST' | 'PUT';
  headers?: Record<string, string>;
  events?: string[]; // Events to trigger webhook
  authType?: 'none' | 'api_key' | 'basic_auth' | 'oauth_bearer' | 'oauth_client_credentials';
  apiKey?: string;
  apiKeyHeader?: string; // Header name for API key (default: 'Authorization')
  basicAuthUsername?: string;
  basicAuthPassword?: string;
  // OAuth Bearer Token
  oauthBearerToken?: string;
  // OAuth Client Credentials
  oauthClientId?: string;
  oauthClientSecret?: string;
  oauthTokenUrl?: string;
  oauthScope?: string;
  // Execution history (stored in config)
  executionHistory?: WebhookExecution[];
}

/** WordPress service configuration */
export interface WordPressServiceConfig {
  siteUrl: string;
  username?: string;
  applicationPassword?: string; // Encrypted
}

// Union type for all service configs
export type ServiceConfig =
  | GSCServiceConfig
  | DriveServiceConfig
  | DocsServiceConfig
  | BingServiceConfig
  | SlackServiceConfig
  | WebhookServiceConfig
  | WordPressServiceConfig
  | Record<string, unknown>; // Fallback for other services

// ============================================================
// DTOs (Data Transfer Objects)
// ============================================================

/** Integration DTO (returned to client) */
export interface IntegrationDto {
  id: string;
  projectId: string;
  provider: IntegrationProvider;
  providerEmail: string | null;
  status: IntegrationStatus;
  services: IntegrationServiceDto[];
  lastSyncAt: string | null;
  errorCount: number;
  createdAt: string;
  updatedAt: string;
}

/** Integration Service DTO (returned to client) */
export interface IntegrationServiceDto {
  id: string;
  integrationId: string;
  service: ServiceType;
  status: ServiceStatus;
  isEnabled: boolean;
  config: ServiceConfig | null;
  lastSyncAt: string | null;
  lastSyncStatus: SyncStatus | null;
  usageThisMonth: number;
  createdAt: string;
}

/** Tracked Keyword DTO */
export interface TrackedKeywordDto {
  id: string;
  projectId: string;
  keyword: string;
  intent: TrackedKeywordIntent;
  isTracking: boolean;
  trackingTier: TrackingTier;
  // GSC data
  lastPosition: number | null;
  lastClicks: number | null;
  lastImpressions: number | null;
  lastCtr: number | null;
  lastGscSync: string | null;
  // SERP data
  lastSerpPosition: number | null;
  lastSerpFeatures: string[];
  lastSerpCheck: string | null;
  lastCompetitors: Array<{ domain: string; position: number }> | null;
  // Metrics
  searchVolume: number | null;
  difficulty: number | null;
  cpc: number | null;
  // Metadata
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// PROVIDER METADATA (for UI display)
// ============================================================

/** Provider metadata for display */
export interface ProviderMetadata {
  id: IntegrationProvider;
  name: string;
  description: string;
  icon: string; // Path to icon
  category: ProviderCategory;
  services: ServiceType[];
  authType: 'oauth2' | 'api_key' | 'webhook';
  isAvailable: boolean; // Feature flag
  comingSoon?: boolean;
}

export type ProviderCategory =
  | 'search'
  | 'ai'
  | 'analytics'
  | 'content'
  | 'social'
  | 'communication'
  | 'ecommerce'
  | 'advertising'
  | 'automation'
  | 'seo'
  | 'data';

/** Service metadata for display */
export interface ServiceMetadata {
  id: ServiceType;
  name: string;
  description: string;
  icon: string;
  requiredScopes: string[]; // OAuth scopes needed
  capabilities: string[]; // What this service can do
  isAvailable: boolean;
}

// ============================================================
// PROVIDER & SERVICE METADATA CONSTANTS
// ============================================================

export const PROVIDER_METADATA: Record<IntegrationProvider, ProviderMetadata> = {
  // Search & Webmaster
  GOOGLE: {
    id: 'GOOGLE',
    name: 'Google',
    description: 'Search Console, Drive, Docs, Analytics',
    icon: '/icons/google.svg',
    category: 'search',
    services: [
      'GOOGLE_SEARCH_CONSOLE',
      'GOOGLE_DRIVE',
      'GOOGLE_DOCS',
      'GOOGLE_ANALYTICS_4',
      'GOOGLE_ADS_SERVICE',
      'GOOGLE_INDEXING',
    ],
    authType: 'oauth2',
    isAvailable: true,
  },
  MICROSOFT: {
    id: 'MICROSOFT',
    name: 'Microsoft',
    description: 'Bing Webmaster, OneDrive, SharePoint',
    icon: '/icons/microsoft.svg',
    category: 'search',
    services: ['BING_WEBMASTER', 'ONEDRIVE', 'SHAREPOINT', 'MICROSOFT_ADS_SERVICE'],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },
  YANDEX: {
    id: 'YANDEX',
    name: 'Yandex',
    description: 'Yandex Webmaster Tools',
    icon: '/icons/yandex.svg',
    category: 'search',
    services: [],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },
  BAIDU: {
    id: 'BAIDU',
    name: 'Baidu',
    description: 'Baidu Webmaster Tools',
    icon: '/icons/baidu.svg',
    category: 'search',
    services: [],
    authType: 'api_key',
    isAvailable: false,
    comingSoon: true,
  },

  // AI Platforms
  OPENAI_INTEGRATION: {
    id: 'OPENAI_INTEGRATION',
    name: 'OpenAI',
    description: 'Monitor ChatGPT mentions',
    icon: '/icons/openai.svg',
    category: 'ai',
    services: ['CHATGPT_MONITORING'],
    authType: 'api_key',
    isAvailable: false,
    comingSoon: true,
  },
  ANTHROPIC_INTEGRATION: {
    id: 'ANTHROPIC_INTEGRATION',
    name: 'Anthropic',
    description: 'Monitor Claude mentions',
    icon: '/icons/anthropic.svg',
    category: 'ai',
    services: ['CLAUDE_MONITORING'],
    authType: 'api_key',
    isAvailable: false,
    comingSoon: true,
  },
  PERPLEXITY_INTEGRATION: {
    id: 'PERPLEXITY_INTEGRATION',
    name: 'Perplexity',
    description: 'Monitor Perplexity citations',
    icon: '/icons/perplexity.svg',
    category: 'ai',
    services: ['PERPLEXITY_MONITORING'],
    authType: 'api_key',
    isAvailable: false,
    comingSoon: true,
  },

  // Analytics
  GOOGLE_ANALYTICS_INTEGRATION: {
    id: 'GOOGLE_ANALYTICS_INTEGRATION',
    name: 'Google Analytics',
    description: 'GA4 traffic and conversion data',
    icon: '/icons/google-analytics.svg',
    category: 'analytics',
    services: ['GA4_REPORTING'],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },
  ADOBE_ANALYTICS: {
    id: 'ADOBE_ANALYTICS',
    name: 'Adobe Analytics',
    description: 'Enterprise analytics',
    icon: '/icons/adobe.svg',
    category: 'analytics',
    services: [],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },
  MIXPANEL: {
    id: 'MIXPANEL',
    name: 'Mixpanel',
    description: 'Product analytics',
    icon: '/icons/mixpanel.svg',
    category: 'analytics',
    services: ['MIXPANEL_EVENTS'],
    authType: 'api_key',
    isAvailable: false,
    comingSoon: true,
  },
  AMPLITUDE: {
    id: 'AMPLITUDE',
    name: 'Amplitude',
    description: 'User behavior analytics',
    icon: '/icons/amplitude.svg',
    category: 'analytics',
    services: ['AMPLITUDE_EVENTS'],
    authType: 'api_key',
    isAvailable: false,
    comingSoon: true,
  },
  POSTHOG: {
    id: 'POSTHOG',
    name: 'PostHog',
    description: 'Open source product analytics',
    icon: '/icons/posthog.svg',
    category: 'analytics',
    services: [],
    authType: 'api_key',
    isAvailable: false,
    comingSoon: true,
  },
  PLAUSIBLE: {
    id: 'PLAUSIBLE',
    name: 'Plausible',
    description: 'Privacy-focused analytics',
    icon: '/icons/plausible.svg',
    category: 'analytics',
    services: [],
    authType: 'api_key',
    isAvailable: false,
    comingSoon: true,
  },

  // Content & CMS
  WORDPRESS: {
    id: 'WORDPRESS',
    name: 'WordPress',
    description: 'Publish and import content',
    icon: '/icons/wordpress.svg',
    category: 'content',
    services: ['WORDPRESS_PUBLISH', 'WORDPRESS_IMPORT'],
    authType: 'api_key',
    isAvailable: false,
    comingSoon: true,
  },
  WEBFLOW: {
    id: 'WEBFLOW',
    name: 'Webflow',
    description: 'Publish to Webflow sites',
    icon: '/icons/webflow.svg',
    category: 'content',
    services: ['WEBFLOW_PUBLISH'],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },
  CONTENTFUL: {
    id: 'CONTENTFUL',
    name: 'Contentful',
    description: 'Headless CMS integration',
    icon: '/icons/contentful.svg',
    category: 'content',
    services: [],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },
  SANITY: {
    id: 'SANITY',
    name: 'Sanity',
    description: 'Headless CMS integration',
    icon: '/icons/sanity.svg',
    category: 'content',
    services: [],
    authType: 'api_key',
    isAvailable: false,
    comingSoon: true,
  },
  NOTION: {
    id: 'NOTION',
    name: 'Notion',
    description: 'Import and sync content',
    icon: '/icons/notion.svg',
    category: 'content',
    services: ['NOTION_SYNC'],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },
  AIRTABLE: {
    id: 'AIRTABLE',
    name: 'Airtable',
    description: 'Content planning and tracking',
    icon: '/icons/airtable.svg',
    category: 'content',
    services: ['AIRTABLE_SYNC'],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },
  GITHUB: {
    id: 'GITHUB',
    name: 'GitHub',
    description: 'Markdown content from repos',
    icon: '/icons/github.svg',
    category: 'content',
    services: ['GITHUB_CONTENT'],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },
  DROPBOX: {
    id: 'DROPBOX',
    name: 'Dropbox',
    description: 'File storage and sync',
    icon: '/icons/dropbox.svg',
    category: 'content',
    services: [],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },

  // Social & Communities
  TWITTER: {
    id: 'TWITTER',
    name: 'Twitter/X',
    description: 'Monitor brand mentions',
    icon: '/icons/twitter.svg',
    category: 'social',
    services: ['TWITTER_MENTIONS'],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },
  LINKEDIN: {
    id: 'LINKEDIN',
    name: 'LinkedIn',
    description: 'Professional mentions',
    icon: '/icons/linkedin.svg',
    category: 'social',
    services: ['LINKEDIN_MENTIONS'],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },
  REDDIT: {
    id: 'REDDIT',
    name: 'Reddit',
    description: 'Community monitoring',
    icon: '/icons/reddit.svg',
    category: 'social',
    services: ['REDDIT_MENTIONS'],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },
  YOUTUBE: {
    id: 'YOUTUBE',
    name: 'YouTube',
    description: 'Video mentions and comments',
    icon: '/icons/youtube.svg',
    category: 'social',
    services: ['YOUTUBE_MENTIONS'],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },
  QUORA: {
    id: 'QUORA',
    name: 'Quora',
    description: 'Q&A platform monitoring',
    icon: '/icons/quora.svg',
    category: 'social',
    services: ['QUORA_MENTIONS'],
    authType: 'api_key',
    isAvailable: false,
    comingSoon: true,
  },
  DISCORD: {
    id: 'DISCORD',
    name: 'Discord',
    description: 'Community monitoring',
    icon: '/icons/discord.svg',
    category: 'social',
    services: [],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },
  FACEBOOK: {
    id: 'FACEBOOK',
    name: 'Facebook',
    description: 'Social presence monitoring',
    icon: '/icons/meta.svg',
    category: 'social',
    services: [],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },
  TIKTOK: {
    id: 'TIKTOK',
    name: 'TikTok',
    description: 'Short-form video trends',
    icon: '/icons/tiktok.svg',
    category: 'social',
    services: [],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },

  // Communication
  SLACK: {
    id: 'SLACK',
    name: 'Slack',
    description: 'Real-time alerts and notifications',
    icon: '/icons/slack.svg',
    category: 'communication',
    services: ['SLACK_ALERTS'],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },
  TEAMS: {
    id: 'TEAMS',
    name: 'Microsoft Teams',
    description: 'Enterprise notifications',
    icon: '/icons/teams.svg',
    category: 'communication',
    services: ['TEAMS_ALERTS'],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },

  // E-commerce
  SHOPIFY_INTEGRATION: {
    id: 'SHOPIFY_INTEGRATION',
    name: 'Shopify',
    description: 'Product SEO and store data',
    icon: '/icons/shopify.svg',
    category: 'ecommerce',
    services: ['SHOPIFY_PRODUCTS'],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },
  WOOCOMMERCE: {
    id: 'WOOCOMMERCE',
    name: 'WooCommerce',
    description: 'WordPress e-commerce',
    icon: '/icons/woocommerce.svg',
    category: 'ecommerce',
    services: ['WOOCOMMERCE_PRODUCTS'],
    authType: 'api_key',
    isAvailable: false,
    comingSoon: true,
  },
  BIGCOMMERCE: {
    id: 'BIGCOMMERCE',
    name: 'BigCommerce',
    description: 'Store integration',
    icon: '/icons/bigcommerce.svg',
    category: 'ecommerce',
    services: [],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },
  AMAZON_INTEGRATION: {
    id: 'AMAZON_INTEGRATION',
    name: 'Amazon',
    description: 'Amazon product tracking',
    icon: '/icons/amazon.svg',
    category: 'ecommerce',
    services: [],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },

  // Advertising
  GOOGLE_ADS: {
    id: 'GOOGLE_ADS',
    name: 'Google Ads',
    description: 'PPC data and keyword costs',
    icon: '/icons/google-ads.svg',
    category: 'advertising',
    services: ['GOOGLE_ADS_DATA'],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },
  MICROSOFT_ADS: {
    id: 'MICROSOFT_ADS',
    name: 'Microsoft Ads',
    description: 'Bing advertising data',
    icon: '/icons/microsoft.svg',
    category: 'advertising',
    services: [],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },
  META_ADS: {
    id: 'META_ADS',
    name: 'Meta Ads',
    description: 'Facebook/Instagram ad data',
    icon: '/icons/meta.svg',
    category: 'advertising',
    services: ['META_ADS_DATA'],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },
  LINKEDIN_ADS: {
    id: 'LINKEDIN_ADS',
    name: 'LinkedIn Ads',
    description: 'B2B advertising data',
    icon: '/icons/linkedin.svg',
    category: 'advertising',
    services: [],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },

  // Automation
  ZAPIER: {
    id: 'ZAPIER',
    name: 'Zapier',
    description: 'Connect to 5000+ apps',
    icon: '/icons/zapier.svg',
    category: 'automation',
    services: ['ZAPIER_TRIGGER', 'ZAPIER_ACTION'],
    authType: 'webhook',
    isAvailable: false,
    comingSoon: true,
  },
  MAKE: {
    id: 'MAKE',
    name: 'Make',
    description: 'Advanced automation workflows',
    icon: '/icons/make.svg',
    category: 'automation',
    services: ['MAKE_TRIGGER', 'MAKE_ACTION'],
    authType: 'webhook',
    isAvailable: false,
    comingSoon: true,
  },
  N8N: {
    id: 'N8N',
    name: 'n8n',
    description: 'Open source workflow automation',
    icon: '/icons/n8n.svg',
    category: 'automation',
    services: ['N8N_TRIGGER', 'N8N_ACTION'],
    authType: 'webhook',
    isAvailable: false,
    comingSoon: true,
  },
  WEBHOOK: {
    id: 'WEBHOOK',
    name: 'Custom Webhook',
    description: 'Custom HTTP integrations',
    icon: '/icons/webhook.svg',
    category: 'automation',
    services: ['CUSTOM_WEBHOOK', 'WEBHOOK_ALERTS'],
    authType: 'webhook',
    isAvailable: true,
  },

  // SEO Tools
  AHREFS_INTEGRATION: {
    id: 'AHREFS_INTEGRATION',
    name: 'Ahrefs',
    description: 'Backlinks and keyword research',
    icon: '/icons/ahrefs.svg',
    category: 'seo',
    services: ['AHREFS_BACKLINKS', 'AHREFS_KEYWORDS'],
    authType: 'api_key',
    isAvailable: false,
    comingSoon: true,
  },
  SEMRUSH_INTEGRATION: {
    id: 'SEMRUSH_INTEGRATION',
    name: 'SEMrush',
    description: 'Competitor analysis',
    icon: '/icons/semrush.svg',
    category: 'seo',
    services: ['SEMRUSH_DATA'],
    authType: 'api_key',
    isAvailable: false,
    comingSoon: true,
  },
  MOZ: {
    id: 'MOZ',
    name: 'Moz',
    description: 'Domain authority and backlinks',
    icon: '/icons/moz.svg',
    category: 'seo',
    services: ['MOZ_DATA'],
    authType: 'api_key',
    isAvailable: false,
    comingSoon: true,
  },

  // Data
  BIGQUERY: {
    id: 'BIGQUERY',
    name: 'BigQuery',
    description: 'Export analytics to BigQuery',
    icon: '/icons/bigquery.svg',
    category: 'data',
    services: ['BIGQUERY_EXPORT'],
    authType: 'oauth2',
    isAvailable: false,
    comingSoon: true,
  },
  SNOWFLAKE: {
    id: 'SNOWFLAKE',
    name: 'Snowflake',
    description: 'Data warehouse export',
    icon: '/icons/snowflake.svg',
    category: 'data',
    services: [],
    authType: 'api_key',
    isAvailable: false,
    comingSoon: true,
  },
  AWS_S3: {
    id: 'AWS_S3',
    name: 'AWS S3',
    description: 'File storage export',
    icon: '/icons/aws-s3.svg',
    category: 'data',
    services: ['S3_EXPORT'],
    authType: 'api_key',
    isAvailable: false,
    comingSoon: true,
  },
};

export const SERVICE_METADATA: Record<ServiceType, ServiceMetadata> = {
  // Google Services
  GOOGLE_SEARCH_CONSOLE: {
    id: 'GOOGLE_SEARCH_CONSOLE',
    name: 'Search Console',
    description: 'Track keyword rankings, clicks, and impressions',
    icon: '/icons/gsc.svg',
    requiredScopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    capabilities: ['keyword_rankings', 'clicks', 'impressions', 'ctr', 'position'],
    isAvailable: true,
  },
  GOOGLE_DRIVE: {
    id: 'GOOGLE_DRIVE',
    name: 'Google Drive',
    description: 'Import and export content files',
    icon: '/icons/drive.svg',
    requiredScopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/spreadsheets', // For reading/creating Google Sheets
    ],
    capabilities: ['create_folder', 'list_files', 'upload', 'download', 'sheets_export'],
    isAvailable: true,
  },
  GOOGLE_DOCS: {
    id: 'GOOGLE_DOCS',
    name: 'Google Docs',
    description: 'Create and edit documents',
    icon: '/icons/docs.svg',
    requiredScopes: ['https://www.googleapis.com/auth/documents'],
    capabilities: ['create', 'read', 'update', 'export'],
    isAvailable: true,
  },
  GOOGLE_ANALYTICS_4: {
    id: 'GOOGLE_ANALYTICS_4',
    name: 'Google Analytics 4',
    description: 'Traffic and conversion data',
    icon: '/icons/ga4.svg',
    requiredScopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    capabilities: ['traffic', 'conversions', 'events'],
    isAvailable: false,
  },
  GOOGLE_ADS_SERVICE: {
    id: 'GOOGLE_ADS_SERVICE',
    name: 'Google Ads',
    description: 'PPC campaign data',
    icon: '/icons/google-ads.svg',
    requiredScopes: ['https://www.googleapis.com/auth/adwords'],
    capabilities: ['campaigns', 'keywords', 'costs'],
    isAvailable: false,
  },
  GOOGLE_INDEXING: {
    id: 'GOOGLE_INDEXING',
    name: 'Google Indexing',
    description: 'Fast content indexing',
    icon: '/icons/google-indexing.svg',
    requiredScopes: ['https://www.googleapis.com/auth/indexing'],
    capabilities: ['submit_url', 'check_status'],
    isAvailable: false,
  },

  // Microsoft Services
  BING_WEBMASTER: {
    id: 'BING_WEBMASTER',
    name: 'Bing Webmaster',
    description: 'Bing search rankings',
    icon: '/icons/bing.svg',
    requiredScopes: [],
    capabilities: ['rankings', 'crawl_stats'],
    isAvailable: false,
  },
  ONEDRIVE: {
    id: 'ONEDRIVE',
    name: 'OneDrive',
    description: 'Microsoft file storage',
    icon: '/icons/onedrive.svg',
    requiredScopes: ['Files.ReadWrite'],
    capabilities: ['upload', 'download', 'create_folder'],
    isAvailable: false,
  },
  SHAREPOINT: {
    id: 'SHAREPOINT',
    name: 'SharePoint',
    description: 'Enterprise document management',
    icon: '/icons/sharepoint.svg',
    requiredScopes: ['Sites.ReadWrite.All'],
    capabilities: ['upload', 'download', 'lists'],
    isAvailable: false,
  },
  MICROSOFT_ADS_SERVICE: {
    id: 'MICROSOFT_ADS_SERVICE',
    name: 'Microsoft Ads',
    description: 'Bing advertising data',
    icon: '/icons/microsoft-ads.svg',
    requiredScopes: [],
    capabilities: ['campaigns', 'keywords'],
    isAvailable: false,
  },

  // AI Monitoring (placeholders)
  CHATGPT_MONITORING: {
    id: 'CHATGPT_MONITORING',
    name: 'ChatGPT Monitoring',
    description: 'Track brand mentions in ChatGPT',
    icon: '/icons/chatgpt.svg',
    requiredScopes: [],
    capabilities: ['mentions', 'sentiment'],
    isAvailable: false,
  },
  PERPLEXITY_MONITORING: {
    id: 'PERPLEXITY_MONITORING',
    name: 'Perplexity Monitoring',
    description: 'Track citations in Perplexity',
    icon: '/icons/perplexity.svg',
    requiredScopes: [],
    capabilities: ['citations', 'visibility'],
    isAvailable: false,
  },
  CLAUDE_MONITORING: {
    id: 'CLAUDE_MONITORING',
    name: 'Claude Monitoring',
    description: 'Track mentions in Claude',
    icon: '/icons/claude.svg',
    requiredScopes: [],
    capabilities: ['mentions'],
    isAvailable: false,
  },
  AI_OVERVIEW_MONITORING: {
    id: 'AI_OVERVIEW_MONITORING',
    name: 'AI Overview Monitoring',
    description: 'Track Google AI Overview citations',
    icon: '/icons/google-ai.svg',
    requiredScopes: [],
    capabilities: ['citations', 'position'],
    isAvailable: false,
  },

  // Analytics
  GA4_REPORTING: {
    id: 'GA4_REPORTING',
    name: 'GA4 Reporting',
    description: 'Google Analytics 4 reports',
    icon: '/icons/ga4.svg',
    requiredScopes: [],
    capabilities: ['reports', 'dimensions', 'metrics'],
    isAvailable: false,
  },
  MIXPANEL_EVENTS: {
    id: 'MIXPANEL_EVENTS',
    name: 'Mixpanel Events',
    description: 'Product analytics events',
    icon: '/icons/mixpanel.svg',
    requiredScopes: [],
    capabilities: ['events', 'funnels'],
    isAvailable: false,
  },
  AMPLITUDE_EVENTS: {
    id: 'AMPLITUDE_EVENTS',
    name: 'Amplitude Events',
    description: 'User behavior events',
    icon: '/icons/amplitude.svg',
    requiredScopes: [],
    capabilities: ['events', 'cohorts'],
    isAvailable: false,
  },

  // Content
  WORDPRESS_PUBLISH: {
    id: 'WORDPRESS_PUBLISH',
    name: 'WordPress Publish',
    description: 'Publish content to WordPress',
    icon: '/icons/wordpress.svg',
    requiredScopes: [],
    capabilities: ['publish', 'draft', 'schedule'],
    isAvailable: false,
  },
  WORDPRESS_IMPORT: {
    id: 'WORDPRESS_IMPORT',
    name: 'WordPress Import',
    description: 'Import content from WordPress',
    icon: '/icons/wordpress.svg',
    requiredScopes: [],
    capabilities: ['import_posts', 'import_pages'],
    isAvailable: false,
  },
  WEBFLOW_PUBLISH: {
    id: 'WEBFLOW_PUBLISH',
    name: 'Webflow Publish',
    description: 'Publish to Webflow CMS',
    icon: '/icons/webflow.svg',
    requiredScopes: [],
    capabilities: ['publish', 'update'],
    isAvailable: false,
  },
  NOTION_SYNC: {
    id: 'NOTION_SYNC',
    name: 'Notion Sync',
    description: 'Sync content with Notion',
    icon: '/icons/notion.svg',
    requiredScopes: [],
    capabilities: ['import', 'export', 'sync'],
    isAvailable: false,
  },
  AIRTABLE_SYNC: {
    id: 'AIRTABLE_SYNC',
    name: 'Airtable Sync',
    description: 'Sync with Airtable bases',
    icon: '/icons/airtable.svg',
    requiredScopes: [],
    capabilities: ['read', 'write', 'sync'],
    isAvailable: false,
  },
  GITHUB_CONTENT: {
    id: 'GITHUB_CONTENT',
    name: 'GitHub Content',
    description: 'Import markdown from repos',
    icon: '/icons/github.svg',
    requiredScopes: ['repo'],
    capabilities: ['read', 'commit'],
    isAvailable: false,
  },

  // Social Monitoring
  REDDIT_MENTIONS: {
    id: 'REDDIT_MENTIONS',
    name: 'Reddit Mentions',
    description: 'Track Reddit discussions',
    icon: '/icons/reddit.svg',
    requiredScopes: ['read'],
    capabilities: ['mentions', 'sentiment', 'subreddits'],
    isAvailable: false,
  },
  TWITTER_MENTIONS: {
    id: 'TWITTER_MENTIONS',
    name: 'Twitter Mentions',
    description: 'Track Twitter/X mentions',
    icon: '/icons/twitter.svg',
    requiredScopes: ['tweet.read', 'users.read'],
    capabilities: ['mentions', 'sentiment'],
    isAvailable: false,
  },
  LINKEDIN_MENTIONS: {
    id: 'LINKEDIN_MENTIONS',
    name: 'LinkedIn Mentions',
    description: 'Track LinkedIn mentions',
    icon: '/icons/linkedin.svg',
    requiredScopes: [],
    capabilities: ['mentions'],
    isAvailable: false,
  },
  YOUTUBE_MENTIONS: {
    id: 'YOUTUBE_MENTIONS',
    name: 'YouTube Mentions',
    description: 'Track YouTube video mentions',
    icon: '/icons/youtube.svg',
    requiredScopes: [],
    capabilities: ['videos', 'comments'],
    isAvailable: false,
  },
  QUORA_MENTIONS: {
    id: 'QUORA_MENTIONS',
    name: 'Quora Mentions',
    description: 'Track Quora Q&A mentions',
    icon: '/icons/quora.svg',
    requiredScopes: [],
    capabilities: ['mentions', 'answers'],
    isAvailable: false,
  },

  // Notifications
  SLACK_ALERTS: {
    id: 'SLACK_ALERTS',
    name: 'Slack Alerts',
    description: 'Send alerts to Slack channels',
    icon: '/icons/slack.svg',
    requiredScopes: ['incoming-webhook'],
    capabilities: ['alerts', 'reports', 'notifications'],
    isAvailable: false,
  },
  TEAMS_ALERTS: {
    id: 'TEAMS_ALERTS',
    name: 'Teams Alerts',
    description: 'Send alerts to Microsoft Teams',
    icon: '/icons/teams.svg',
    requiredScopes: [],
    capabilities: ['alerts', 'notifications'],
    isAvailable: false,
  },
  EMAIL_ALERTS: {
    id: 'EMAIL_ALERTS',
    name: 'Email Alerts',
    description: 'Send email notifications',
    icon: '/icons/email.svg',
    requiredScopes: [],
    capabilities: ['alerts', 'reports', 'digests'],
    isAvailable: true,
  },
  WEBHOOK_ALERTS: {
    id: 'WEBHOOK_ALERTS',
    name: 'Webhook Alerts',
    description: 'Custom webhook notifications',
    icon: '/icons/webhook.svg',
    requiredScopes: [],
    capabilities: ['alerts', 'custom_payload'],
    isAvailable: true,
  },

  // E-commerce
  SHOPIFY_PRODUCTS: {
    id: 'SHOPIFY_PRODUCTS',
    name: 'Shopify Products',
    description: 'Product data and SEO',
    icon: '/icons/shopify.svg',
    requiredScopes: ['read_products'],
    capabilities: ['products', 'collections', 'seo'],
    isAvailable: false,
  },
  WOOCOMMERCE_PRODUCTS: {
    id: 'WOOCOMMERCE_PRODUCTS',
    name: 'WooCommerce Products',
    description: 'Product data and SEO',
    icon: '/icons/woocommerce.svg',
    requiredScopes: [],
    capabilities: ['products', 'categories'],
    isAvailable: false,
  },

  // Advertising
  GOOGLE_ADS_DATA: {
    id: 'GOOGLE_ADS_DATA',
    name: 'Google Ads Data',
    description: 'Campaign and keyword data',
    icon: '/icons/google-ads.svg',
    requiredScopes: [],
    capabilities: ['campaigns', 'keywords', 'costs'],
    isAvailable: false,
  },
  META_ADS_DATA: {
    id: 'META_ADS_DATA',
    name: 'Meta Ads Data',
    description: 'Facebook/Instagram ad data',
    icon: '/icons/meta-ads.svg',
    requiredScopes: [],
    capabilities: ['campaigns', 'audiences'],
    isAvailable: false,
  },

  // Automation
  ZAPIER_TRIGGER: {
    id: 'ZAPIER_TRIGGER',
    name: 'Zapier Trigger',
    description: 'Trigger Zapier workflows',
    icon: '/icons/zapier.svg',
    requiredScopes: [],
    capabilities: ['trigger'],
    isAvailable: false,
  },
  ZAPIER_ACTION: {
    id: 'ZAPIER_ACTION',
    name: 'Zapier Action',
    description: 'Receive Zapier actions',
    icon: '/icons/zapier.svg',
    requiredScopes: [],
    capabilities: ['action'],
    isAvailable: false,
  },
  MAKE_TRIGGER: {
    id: 'MAKE_TRIGGER',
    name: 'Make Trigger',
    description: 'Trigger Make scenarios',
    icon: '/icons/make.svg',
    requiredScopes: [],
    capabilities: ['trigger'],
    isAvailable: false,
  },
  MAKE_ACTION: {
    id: 'MAKE_ACTION',
    name: 'Make Action',
    description: 'Receive Make actions',
    icon: '/icons/make.svg',
    requiredScopes: [],
    capabilities: ['action'],
    isAvailable: false,
  },
  N8N_TRIGGER: {
    id: 'N8N_TRIGGER',
    name: 'n8n Trigger',
    description: 'Trigger n8n workflows',
    icon: '/icons/n8n.svg',
    requiredScopes: [],
    capabilities: ['trigger'],
    isAvailable: false,
  },
  N8N_ACTION: {
    id: 'N8N_ACTION',
    name: 'n8n Action',
    description: 'Receive n8n actions',
    icon: '/icons/n8n.svg',
    requiredScopes: [],
    capabilities: ['action'],
    isAvailable: false,
  },
  CUSTOM_WEBHOOK: {
    id: 'CUSTOM_WEBHOOK',
    name: 'Custom Webhook',
    description: 'Custom HTTP integrations',
    icon: '/icons/webhook.svg',
    requiredScopes: [],
    capabilities: ['send', 'receive'],
    isAvailable: true,
  },

  // SEO Data
  AHREFS_BACKLINKS: {
    id: 'AHREFS_BACKLINKS',
    name: 'Ahrefs Backlinks',
    description: 'Backlink data from Ahrefs',
    icon: '/icons/ahrefs.svg',
    requiredScopes: [],
    capabilities: ['backlinks', 'referring_domains'],
    isAvailable: false,
  },
  AHREFS_KEYWORDS: {
    id: 'AHREFS_KEYWORDS',
    name: 'Ahrefs Keywords',
    description: 'Keyword data from Ahrefs',
    icon: '/icons/ahrefs.svg',
    requiredScopes: [],
    capabilities: ['keywords', 'difficulty', 'volume'],
    isAvailable: false,
  },
  SEMRUSH_DATA: {
    id: 'SEMRUSH_DATA',
    name: 'SEMrush Data',
    description: 'Competitor and keyword data',
    icon: '/icons/semrush.svg',
    requiredScopes: [],
    capabilities: ['keywords', 'competitors', 'backlinks'],
    isAvailable: false,
  },
  MOZ_DATA: {
    id: 'MOZ_DATA',
    name: 'Moz Data',
    description: 'Domain authority and links',
    icon: '/icons/moz.svg',
    requiredScopes: [],
    capabilities: ['da', 'pa', 'backlinks'],
    isAvailable: false,
  },

  // Data Export
  BIGQUERY_EXPORT: {
    id: 'BIGQUERY_EXPORT',
    name: 'BigQuery Export',
    description: 'Export data to BigQuery',
    icon: '/icons/bigquery.svg',
    requiredScopes: ['bigquery.insertdata'],
    capabilities: ['export', 'schedule'],
    isAvailable: false,
  },
  S3_EXPORT: {
    id: 'S3_EXPORT',
    name: 'S3 Export',
    description: 'Export data to AWS S3',
    icon: '/icons/aws-s3.svg',
    requiredScopes: [],
    capabilities: ['export', 'schedule'],
    isAvailable: false,
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get all available providers (not coming soon)
 */
export function getAvailableProviders(): ProviderMetadata[] {
  return Object.values(PROVIDER_METADATA).filter((p) => p.isAvailable);
}

/**
 * Get providers by category
 */
export function getProvidersByCategory(
  category: ProviderCategory
): ProviderMetadata[] {
  return Object.values(PROVIDER_METADATA).filter((p) => p.category === category);
}

/**
 * Get all services for a provider
 */
export function getServicesForProvider(provider: IntegrationProvider): ServiceMetadata[] {
  const providerMeta = PROVIDER_METADATA[provider];
  if (!providerMeta) return [];

  return providerMeta.services
    .map((serviceId) => SERVICE_METADATA[serviceId])
    .filter(Boolean);
}

/**
 * Get required OAuth scopes for a set of services
 */
export function getRequiredScopes(services: ServiceType[]): string[] {
  const scopes = new Set<string>();

  for (const serviceId of services) {
    const service = SERVICE_METADATA[serviceId];
    if (service) {
      service.requiredScopes.forEach((scope) => scopes.add(scope));
    }
  }

  return Array.from(scopes);
}

/**
 * Check if a provider uses OAuth
 */
export function isOAuthProvider(provider: IntegrationProvider): boolean {
  const meta = PROVIDER_METADATA[provider];
  return meta?.authType === 'oauth2';
}

/**
 * Get all category labels
 */
export const CATEGORY_LABELS: Record<ProviderCategory, string> = {
  search: 'Search & Webmaster',
  ai: 'AI Platforms',
  analytics: 'Analytics',
  content: 'Content & CMS',
  social: 'Social & Communities',
  communication: 'Communication',
  ecommerce: 'E-commerce',
  advertising: 'Advertising',
  automation: 'Automation',
  seo: 'SEO Tools',
  data: 'Data & Storage',
};

