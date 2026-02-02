/**
 * Integration Icons
 * 
 * SVG icons for various integration providers and services.
 * Icons are exported as file paths for use in the application.
 */

// Helper to get icon path
const getIconPath = (filename: string) => `/integrations/icons/${filename}`;

// Provider Icons
export const INTEGRATION_ICONS = {
  // Search & Analytics
  google: getIconPath('google.svg'),
  microsoft: getIconPath('microsoft.svg'),
  yandex: getIconPath('yandex.svg'),
  baidu: getIconPath('baidu.svg'),
  
  // AI Platforms
  openai: getIconPath('openai.svg'),
  anthropic: getIconPath('anthropic.svg'),
  perplexity: getIconPath('perplexity.svg'),
  
  // Analytics
  googleAnalytics: getIconPath('google-analytics.svg'),
  adobe: getIconPath('adobe.svg'),
  mixpanel: getIconPath('mixpanel.svg'),
  amplitude: getIconPath('amplitude.svg'),
  posthog: getIconPath('posthog.svg'),
  plausible: getIconPath('plausible.svg'),
  
  // Content & CMS
  wordpress: getIconPath('wordpress.svg'),
  webflow: getIconPath('webflow.svg'),
  contentful: getIconPath('contentful.svg'),
  sanity: getIconPath('sanity.svg'),
  notion: getIconPath('notion.svg'),
  airtable: getIconPath('airtable.svg'),
  github: getIconPath('github.svg'),
  dropbox: getIconPath('dropbox.svg'),
  
  // Social & Communities
  twitter: getIconPath('twitter.svg'),
  x: getIconPath('x.svg'),
  linkedin: getIconPath('linkedin.svg'),
  reddit: getIconPath('reddit.svg'),
  youtube: getIconPath('youtube.svg'),
  quora: getIconPath('quora.svg'),
  discord: getIconPath('discord.svg'),
  facebook: getIconPath('facebook.svg'),
  tiktok: getIconPath('tiktok.svg'),
  
  // Communication
  slack: getIconPath('slack.svg'),
  teams: getIconPath('teams.svg'),
  
  // E-commerce
  shopify: getIconPath('shopify.svg'),
  woocommerce: getIconPath('woocommerce.svg'),
  bigcommerce: getIconPath('bigcommerce.svg'),
  amazon: getIconPath('amazon.svg'),
  wix: getIconPath('wix.svg'),
  
  // Advertising
  googleAds: getIconPath('google-ads.svg'),
  metaAds: getIconPath('meta.svg'),
  
  // Automation
  zapier: getIconPath('zapier.svg'),
  make: getIconPath('make.svg'),
  n8n: getIconPath('n8n.svg'),
  webhook: getIconPath('webhook.svg'),
  
  // SEO Tools
  ahrefs: getIconPath('ahrefs.svg'),
  semrush: getIconPath('semrush.svg'),
  moz: getIconPath('moz.svg'),
  
  // Data & Cloud
  bigquery: getIconPath('bigquery.svg'),
  snowflake: getIconPath('snowflake.svg'),
  awsS3: getIconPath('aws-s3.svg'),
  vercel: getIconPath('vercel.svg'),
  
  // Google Services
  gsc: getIconPath('google.svg'), // Using google icon for GSC
  drive: getIconPath('google-drive.svg'),
  docs: getIconPath('google.svg'), // Using google icon for Docs
  ga4: getIconPath('google-analytics.svg'),
  googleIndexing: getIconPath('google.svg'), // Using google icon for Indexing
  
  // Microsoft Services
  bing: getIconPath('bing.svg'),
  onedrive: getIconPath('onedrive.svg'),
  sharepoint: getIconPath('sharepoint.svg'),
  microsoftAds: getIconPath('microsoft.svg'), // Using microsoft icon for Ads
  
  // AI Monitoring
  chatgpt: getIconPath('chatgpt.svg'),
  claude: getIconPath('claude.svg'),
  googleAi: getIconPath('gemini.svg'), // Using gemini icon for Google AI
  
  // Other
  email: getIconPath('mailchimp.svg'), // Using mailchimp as fallback for email
  meta: getIconPath('meta.svg'),
} as const;

export type IntegrationIconKey = keyof typeof INTEGRATION_ICONS;

// Re-export all SVG files for direct access if needed
export { default as GoogleIcon } from './google.svg';
export { default as MicrosoftIcon } from './microsoft.svg';
export { default as YandexIcon } from './yandex.svg';
// ... add more as needed
