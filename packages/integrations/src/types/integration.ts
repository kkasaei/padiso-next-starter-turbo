/**
 * Integration Types
 *
 * Type definitions for the project integration system.
 * Includes provider metadata, service configurations, and DTOs.
 */

import { INTEGRATION_ICONS } from '../icons';

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
    icon: INTEGRATION_ICONS.google,
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
    icon: INTEGRATION_ICONS.microsoft,
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
    icon: INTEGRATION_ICONS.yandex,
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
    icon: INTEGRATION_ICONS.baidu,
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
    icon: INTEGRATION_ICONS.openai,
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
    icon: INTEGRATION_ICONS.anthropic,
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
    icon: INTEGRATION_ICONS.perplexity,
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
    icon: INTEGRATION_ICONS.googleAnalytics,
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
    icon: INTEGRATION_ICONS.adobe,
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
    icon: INTEGRATION_ICONS.mixpanel,
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
    icon: INTEGRATION_ICONS.amplitude,
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
    icon: INTEGRATION_ICONS.posthog,
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
    icon: INTEGRATION_ICONS.plausible,
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
    icon: INTEGRATION_ICONS.wordpress,
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
    icon: INTEGRATION_ICONS.webflow,
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
    icon: INTEGRATION_ICONS.contentful,
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
    icon: INTEGRATION_ICONS.sanity,
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
    icon: INTEGRATION_ICONS.notion,
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
    icon: INTEGRATION_ICONS.airtable,
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
    icon: INTEGRATION_ICONS.github,
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
    icon: INTEGRATION_ICONS.dropbox,
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
    icon: INTEGRATION_ICONS.twitter,
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
    icon: INTEGRATION_ICONS.linkedin,
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
    icon: INTEGRATION_ICONS.reddit,
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
    icon: INTEGRATION_ICONS.youtube,
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
    icon: INTEGRATION_ICONS.quora,
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
    icon: INTEGRATION_ICONS.discord,
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
    icon: INTEGRATION_ICONS.meta,
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
    icon: INTEGRATION_ICONS.tiktok,
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
    icon: INTEGRATION_ICONS.slack,
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
    icon: INTEGRATION_ICONS.teams,
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
    icon: INTEGRATION_ICONS.shopify,
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
    icon: INTEGRATION_ICONS.woocommerce,
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
    icon: INTEGRATION_ICONS.bigcommerce,
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
    icon: INTEGRATION_ICONS.amazon,
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
    icon: INTEGRATION_ICONS.googleAds,
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
    icon: INTEGRATION_ICONS.microsoft,
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
    icon: INTEGRATION_ICONS.metaAds,
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
    icon: INTEGRATION_ICONS.linkedin,
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
    icon: INTEGRATION_ICONS.zapier,
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
    icon: INTEGRATION_ICONS.make,
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
    icon: INTEGRATION_ICONS.n8n,
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
    icon: INTEGRATION_ICONS.webhook,
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
    icon: INTEGRATION_ICONS.ahrefs,
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
    icon: INTEGRATION_ICONS.semrush,
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
    icon: INTEGRATION_ICONS.moz,
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
    icon: INTEGRATION_ICONS.bigquery,
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
    icon: INTEGRATION_ICONS.snowflake,
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
    icon: INTEGRATION_ICONS.awsS3,
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
    icon: INTEGRATION_ICONS.gsc,
    requiredScopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    capabilities: ['keyword_rankings', 'clicks', 'impressions', 'ctr', 'position'],
    isAvailable: true,
  },
  GOOGLE_DRIVE: {
    id: 'GOOGLE_DRIVE',
    name: 'Google Drive',
    description: 'Import and export content files',
    icon: INTEGRATION_ICONS.drive,
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
    icon: INTEGRATION_ICONS.docs,
    requiredScopes: ['https://www.googleapis.com/auth/documents'],
    capabilities: ['create', 'read', 'update', 'export'],
    isAvailable: true,
  },
  GOOGLE_ANALYTICS_4: {
    id: 'GOOGLE_ANALYTICS_4',
    name: 'Google Analytics 4',
    description: 'Traffic and conversion data',
    icon: INTEGRATION_ICONS.ga4,
    requiredScopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    capabilities: ['traffic', 'conversions', 'events'],
    isAvailable: false,
  },
  GOOGLE_ADS_SERVICE: {
    id: 'GOOGLE_ADS_SERVICE',
    name: 'Google Ads',
    description: 'PPC campaign data',
    icon: INTEGRATION_ICONS.googleAds,
    requiredScopes: ['https://www.googleapis.com/auth/adwords'],
    capabilities: ['campaigns', 'keywords', 'costs'],
    isAvailable: false,
  },
  GOOGLE_INDEXING: {
    id: 'GOOGLE_INDEXING',
    name: 'Google Indexing',
    description: 'Fast content indexing',
    icon: INTEGRATION_ICONS.googleIndexing,
    requiredScopes: ['https://www.googleapis.com/auth/indexing'],
    capabilities: ['submit_url', 'check_status'],
    isAvailable: false,
  },

  // Microsoft Services
  BING_WEBMASTER: {
    id: 'BING_WEBMASTER',
    name: 'Bing Webmaster',
    description: 'Bing search rankings',
    icon: INTEGRATION_ICONS.bing,
    requiredScopes: [],
    capabilities: ['rankings', 'crawl_stats'],
    isAvailable: false,
  },
  ONEDRIVE: {
    id: 'ONEDRIVE',
    name: 'OneDrive',
    description: 'Microsoft file storage',
    icon: INTEGRATION_ICONS.onedrive,
    requiredScopes: ['Files.ReadWrite'],
    capabilities: ['upload', 'download', 'create_folder'],
    isAvailable: false,
  },
  SHAREPOINT: {
    id: 'SHAREPOINT',
    name: 'SharePoint',
    description: 'Enterprise document management',
    icon: INTEGRATION_ICONS.sharepoint,
    requiredScopes: ['Sites.ReadWrite.All'],
    capabilities: ['upload', 'download', 'lists'],
    isAvailable: false,
  },
  MICROSOFT_ADS_SERVICE: {
    id: 'MICROSOFT_ADS_SERVICE',
    name: 'Microsoft Ads',
    description: 'Bing advertising data',
    icon: INTEGRATION_ICONS.microsoftAds,
    requiredScopes: [],
    capabilities: ['campaigns', 'keywords'],
    isAvailable: false,
  },

  // AI Monitoring (placeholders)
  CHATGPT_MONITORING: {
    id: 'CHATGPT_MONITORING',
    name: 'ChatGPT Monitoring',
    description: 'Track brand mentions in ChatGPT',
    icon: INTEGRATION_ICONS.chatgpt,
    requiredScopes: [],
    capabilities: ['mentions', 'sentiment'],
    isAvailable: false,
  },
  PERPLEXITY_MONITORING: {
    id: 'PERPLEXITY_MONITORING',
    name: 'Perplexity Monitoring',
    description: 'Track citations in Perplexity',
    icon: INTEGRATION_ICONS.perplexity,
    requiredScopes: [],
    capabilities: ['citations', 'visibility'],
    isAvailable: false,
  },
  CLAUDE_MONITORING: {
    id: 'CLAUDE_MONITORING',
    name: 'Claude Monitoring',
    description: 'Track mentions in Claude',
    icon: INTEGRATION_ICONS.claude,
    requiredScopes: [],
    capabilities: ['mentions'],
    isAvailable: false,
  },
  AI_OVERVIEW_MONITORING: {
    id: 'AI_OVERVIEW_MONITORING',
    name: 'AI Overview Monitoring',
    description: 'Track Google AI Overview citations',
    icon: INTEGRATION_ICONS.googleAi,
    requiredScopes: [],
    capabilities: ['citations', 'position'],
    isAvailable: false,
  },

  // Analytics
  GA4_REPORTING: {
    id: 'GA4_REPORTING',
    name: 'GA4 Reporting',
    description: 'Google Analytics 4 reports',
    icon: INTEGRATION_ICONS.ga4,
    requiredScopes: [],
    capabilities: ['reports', 'dimensions', 'metrics'],
    isAvailable: false,
  },
  MIXPANEL_EVENTS: {
    id: 'MIXPANEL_EVENTS',
    name: 'Mixpanel Events',
    description: 'Product analytics events',
    icon: INTEGRATION_ICONS.mixpanel,
    requiredScopes: [],
    capabilities: ['events', 'funnels'],
    isAvailable: false,
  },
  AMPLITUDE_EVENTS: {
    id: 'AMPLITUDE_EVENTS',
    name: 'Amplitude Events',
    description: 'User behavior events',
    icon: INTEGRATION_ICONS.amplitude,
    requiredScopes: [],
    capabilities: ['events', 'cohorts'],
    isAvailable: false,
  },

  // Content
  WORDPRESS_PUBLISH: {
    id: 'WORDPRESS_PUBLISH',
    name: 'WordPress Publish',
    description: 'Publish content to WordPress',
    icon: INTEGRATION_ICONS.wordpress,
    requiredScopes: [],
    capabilities: ['publish', 'draft', 'schedule'],
    isAvailable: false,
  },
  WORDPRESS_IMPORT: {
    id: 'WORDPRESS_IMPORT',
    name: 'WordPress Import',
    description: 'Import content from WordPress',
    icon: INTEGRATION_ICONS.wordpress,
    requiredScopes: [],
    capabilities: ['import_posts', 'import_pages'],
    isAvailable: false,
  },
  WEBFLOW_PUBLISH: {
    id: 'WEBFLOW_PUBLISH',
    name: 'Webflow Publish',
    description: 'Publish to Webflow CMS',
    icon: INTEGRATION_ICONS.webflow,
    requiredScopes: [],
    capabilities: ['publish', 'update'],
    isAvailable: false,
  },
  NOTION_SYNC: {
    id: 'NOTION_SYNC',
    name: 'Notion Sync',
    description: 'Sync content with Notion',
    icon: INTEGRATION_ICONS.notion,
    requiredScopes: [],
    capabilities: ['import', 'export', 'sync'],
    isAvailable: false,
  },
  AIRTABLE_SYNC: {
    id: 'AIRTABLE_SYNC',
    name: 'Airtable Sync',
    description: 'Sync with Airtable bases',
    icon: INTEGRATION_ICONS.airtable,
    requiredScopes: [],
    capabilities: ['read', 'write', 'sync'],
    isAvailable: false,
  },
  GITHUB_CONTENT: {
    id: 'GITHUB_CONTENT',
    name: 'GitHub Content',
    description: 'Import markdown from repos',
    icon: INTEGRATION_ICONS.github,
    requiredScopes: ['repo'],
    capabilities: ['read', 'commit'],
    isAvailable: false,
  },

  // Social Monitoring
  REDDIT_MENTIONS: {
    id: 'REDDIT_MENTIONS',
    name: 'Reddit Mentions',
    description: 'Track Reddit discussions',
    icon: INTEGRATION_ICONS.reddit,
    requiredScopes: ['read'],
    capabilities: ['mentions', 'sentiment', 'subreddits'],
    isAvailable: false,
  },
  TWITTER_MENTIONS: {
    id: 'TWITTER_MENTIONS',
    name: 'Twitter Mentions',
    description: 'Track Twitter/X mentions',
    icon: INTEGRATION_ICONS.twitter,
    requiredScopes: ['tweet.read', 'users.read'],
    capabilities: ['mentions', 'sentiment'],
    isAvailable: false,
  },
  LINKEDIN_MENTIONS: {
    id: 'LINKEDIN_MENTIONS',
    name: 'LinkedIn Mentions',
    description: 'Track LinkedIn mentions',
    icon: INTEGRATION_ICONS.linkedin,
    requiredScopes: [],
    capabilities: ['mentions'],
    isAvailable: false,
  },
  YOUTUBE_MENTIONS: {
    id: 'YOUTUBE_MENTIONS',
    name: 'YouTube Mentions',
    description: 'Track YouTube video mentions',
    icon: INTEGRATION_ICONS.youtube,
    requiredScopes: [],
    capabilities: ['videos', 'comments'],
    isAvailable: false,
  },
  QUORA_MENTIONS: {
    id: 'QUORA_MENTIONS',
    name: 'Quora Mentions',
    description: 'Track Quora Q&A mentions',
    icon: INTEGRATION_ICONS.quora,
    requiredScopes: [],
    capabilities: ['mentions', 'answers'],
    isAvailable: false,
  },

  // Notifications
  SLACK_ALERTS: {
    id: 'SLACK_ALERTS',
    name: 'Slack Alerts',
    description: 'Send alerts to Slack channels',
    icon: INTEGRATION_ICONS.slack,
    requiredScopes: ['incoming-webhook'],
    capabilities: ['alerts', 'reports', 'notifications'],
    isAvailable: false,
  },
  TEAMS_ALERTS: {
    id: 'TEAMS_ALERTS',
    name: 'Teams Alerts',
    description: 'Send alerts to Microsoft Teams',
    icon: INTEGRATION_ICONS.teams,
    requiredScopes: [],
    capabilities: ['alerts', 'notifications'],
    isAvailable: false,
  },
  EMAIL_ALERTS: {
    id: 'EMAIL_ALERTS',
    name: 'Email Alerts',
    description: 'Send email notifications',
    icon: INTEGRATION_ICONS.email,
    requiredScopes: [],
    capabilities: ['alerts', 'reports', 'digests'],
    isAvailable: true,
  },
  WEBHOOK_ALERTS: {
    id: 'WEBHOOK_ALERTS',
    name: 'Webhook Alerts',
    description: 'Custom webhook notifications',
    icon: INTEGRATION_ICONS.webhook,
    requiredScopes: [],
    capabilities: ['alerts', 'custom_payload'],
    isAvailable: true,
  },

  // E-commerce
  SHOPIFY_PRODUCTS: {
    id: 'SHOPIFY_PRODUCTS',
    name: 'Shopify Products',
    description: 'Product data and SEO',
    icon: INTEGRATION_ICONS.shopify,
    requiredScopes: ['read_products'],
    capabilities: ['products', 'collections', 'seo'],
    isAvailable: false,
  },
  WOOCOMMERCE_PRODUCTS: {
    id: 'WOOCOMMERCE_PRODUCTS',
    name: 'WooCommerce Products',
    description: 'Product data and SEO',
    icon: INTEGRATION_ICONS.woocommerce,
    requiredScopes: [],
    capabilities: ['products', 'categories'],
    isAvailable: false,
  },

  // Advertising
  GOOGLE_ADS_DATA: {
    id: 'GOOGLE_ADS_DATA',
    name: 'Google Ads Data',
    description: 'Campaign and keyword data',
    icon: INTEGRATION_ICONS.googleAds,
    requiredScopes: [],
    capabilities: ['campaigns', 'keywords', 'costs'],
    isAvailable: false,
  },
  META_ADS_DATA: {
    id: 'META_ADS_DATA',
    name: 'Meta Ads Data',
    description: 'Facebook/Instagram ad data',
    icon: INTEGRATION_ICONS.metaAds,
    requiredScopes: [],
    capabilities: ['campaigns', 'audiences'],
    isAvailable: false,
  },

  // Automation
  ZAPIER_TRIGGER: {
    id: 'ZAPIER_TRIGGER',
    name: 'Zapier Trigger',
    description: 'Trigger Zapier workflows',
    icon: INTEGRATION_ICONS.zapier,
    requiredScopes: [],
    capabilities: ['trigger'],
    isAvailable: false,
  },
  ZAPIER_ACTION: {
    id: 'ZAPIER_ACTION',
    name: 'Zapier Action',
    description: 'Receive Zapier actions',
    icon: INTEGRATION_ICONS.zapier,
    requiredScopes: [],
    capabilities: ['action'],
    isAvailable: false,
  },
  MAKE_TRIGGER: {
    id: 'MAKE_TRIGGER',
    name: 'Make Trigger',
    description: 'Trigger Make scenarios',
    icon: INTEGRATION_ICONS.make,
    requiredScopes: [],
    capabilities: ['trigger'],
    isAvailable: false,
  },
  MAKE_ACTION: {
    id: 'MAKE_ACTION',
    name: 'Make Action',
    description: 'Receive Make actions',
    icon: INTEGRATION_ICONS.make,
    requiredScopes: [],
    capabilities: ['action'],
    isAvailable: false,
  },
  N8N_TRIGGER: {
    id: 'N8N_TRIGGER',
    name: 'n8n Trigger',
    description: 'Trigger n8n workflows',
    icon: INTEGRATION_ICONS.n8n,
    requiredScopes: [],
    capabilities: ['trigger'],
    isAvailable: false,
  },
  N8N_ACTION: {
    id: 'N8N_ACTION',
    name: 'n8n Action',
    description: 'Receive n8n actions',
    icon: INTEGRATION_ICONS.n8n,
    requiredScopes: [],
    capabilities: ['action'],
    isAvailable: false,
  },
  CUSTOM_WEBHOOK: {
    id: 'CUSTOM_WEBHOOK',
    name: 'Custom Webhook',
    description: 'Custom HTTP integrations',
    icon: INTEGRATION_ICONS.webhook,
    requiredScopes: [],
    capabilities: ['send', 'receive'],
    isAvailable: true,
  },

  // SEO Data
  AHREFS_BACKLINKS: {
    id: 'AHREFS_BACKLINKS',
    name: 'Ahrefs Backlinks',
    description: 'Backlink data from Ahrefs',
    icon: INTEGRATION_ICONS.ahrefs,
    requiredScopes: [],
    capabilities: ['backlinks', 'referring_domains'],
    isAvailable: false,
  },
  AHREFS_KEYWORDS: {
    id: 'AHREFS_KEYWORDS',
    name: 'Ahrefs Keywords',
    description: 'Keyword data from Ahrefs',
    icon: INTEGRATION_ICONS.ahrefs,
    requiredScopes: [],
    capabilities: ['keywords', 'difficulty', 'volume'],
    isAvailable: false,
  },
  SEMRUSH_DATA: {
    id: 'SEMRUSH_DATA',
    name: 'SEMrush Data',
    description: 'Competitor and keyword data',
    icon: INTEGRATION_ICONS.semrush,
    requiredScopes: [],
    capabilities: ['keywords', 'competitors', 'backlinks'],
    isAvailable: false,
  },
  MOZ_DATA: {
    id: 'MOZ_DATA',
    name: 'Moz Data',
    description: 'Domain authority and links',
    icon: INTEGRATION_ICONS.moz,
    requiredScopes: [],
    capabilities: ['da', 'pa', 'backlinks'],
    isAvailable: false,
  },

  // Data Export
  BIGQUERY_EXPORT: {
    id: 'BIGQUERY_EXPORT',
    name: 'BigQuery Export',
    description: 'Export data to BigQuery',
    icon: INTEGRATION_ICONS.bigquery,
    requiredScopes: ['bigquery.insertdata'],
    capabilities: ['export', 'schedule'],
    isAvailable: false,
  },
  S3_EXPORT: {
    id: 'S3_EXPORT',
    name: 'S3 Export',
    description: 'Export data to AWS S3',
    icon: INTEGRATION_ICONS.awsS3,
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

