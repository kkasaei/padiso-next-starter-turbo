export interface AIPlatform {
  name: string;
  icon: string;
  color: string;
}

export const AI_PLATFORMS: AIPlatform[] = [
  { name: 'Google', icon: '/icons/google.svg', color: '#4285f4' },
  { name: 'Bing', icon: '/icons/bing.svg', color: '#00809d' },
  { name: 'OpenAI', icon: '/icons/openai.svg', color: '#10a37f' },
  { name: 'Perplexity', icon: '/icons/perplexity.svg', color: '#20808d' },
  { name: 'Gemini', icon: '/icons/gemini.svg', color: '#4285f4' },
  { name: 'Claude', icon: '/icons/claude.svg', color: '#d97706' },
  { name: 'Grok', icon: '/icons/xai.svg', color: '#1d9bf0' },
  { name: 'DeepSeek', icon: '/icons/deepseek.svg', color: '#0066ff' },
];

export const ECOMMERCE_PLATFORMS: AIPlatform[] = [
  { name: 'Shopify', icon: '/icons/shopify_glyph_black.svg', color: '#95bf47' },
  { name: 'Amazon', icon: '/icons/amazon.svg', color: '#ff9900' },
];

export const SOCIAL_PLATFORMS: AIPlatform[] = [
  { name: 'Reddit', icon: '/icons/reddit.svg', color: '#ff4500' },
  { name: 'TikTok', icon: '/icons/tiktok.svg', color: '#00f2ea' },
  { name: 'Meta', icon: '/icons/meta.svg', color: '#0082fb' },
];

export const SEARCH_ENGINES: AIPlatform[] = [
  { name: 'Google', icon: '/icons/google.svg', color: '#4285f4' },
  { name: 'Bing', icon: '/icons/bing.svg', color: '#00809d' },
];

// All platforms combined
export const ALL_PLATFORMS: AIPlatform[] = [
  ...SEARCH_ENGINES,
  ...AI_PLATFORMS.filter(p => !['Google', 'Bing'].includes(p.name)),
  ...ECOMMERCE_PLATFORMS,
  ...SOCIAL_PLATFORMS,
];

// Hero section icons (specific order)
export const HERO_ICONS: AIPlatform[] = [
  { name: 'Google', icon: '/icons/google.svg', color: '#4285f4' },
  { name: 'Bing', icon: '/icons/bing.svg', color: '#00809d' },
  { name: 'OpenAI', icon: '/icons/openai.svg', color: '#10a37f' },
  { name: 'Perplexity', icon: '/icons/perplexity.svg', color: '#20808d' },
  { name: 'Gemini', icon: '/icons/gemini.svg', color: '#4285f4' },
  { name: 'Claude', icon: '/icons/claude.svg', color: '#d97706' },
  { name: 'Grok', icon: '/icons/grok.svg', color: '#1d9bf0' },
  { name: 'DeepSeek', icon: '/icons/deepseek.svg', color: '#0066ff' },
  { name: 'Shopify', icon: '/icons/shopify_glyph_black.svg', color: '#95bf47' },
  { name: 'Reddit', icon: '/icons/reddit.svg', color: '#ff4500' },
  { name: 'TikTok', icon: '/icons/tiktok.svg', color: '#00f2ea' },
  { name: 'Meta', icon: '/icons/meta.svg', color: '#0082fb' },
  { name: 'Amazon', icon: '/icons/amazon.svg', color: '#ff9900' },
];

// Animated title logos (AI engines only)
export const ANIMATED_TITLE_LOGOS: AIPlatform[] = [
  { name: 'Google', icon: '/icons/google.svg', color: '#4285f4' },
  { name: 'OpenAI', icon: '/icons/openai.svg', color: '#10a37f' },
  { name: 'Perplexity', icon: '/icons/perplexity.svg', color: '#20808d' },
  { name: 'Claude', icon: '/icons/claude.svg', color: '#d97706' },
  { name: 'Gemini', icon: '/icons/gemini.svg', color: '#4285f4' },
  { name: 'Grok', icon: '/icons/xai.svg', color: '#1d9bf0' },
  { name: 'DeepSeek', icon: '/icons/deepseek.svg', color: '#0066ff' },
];
