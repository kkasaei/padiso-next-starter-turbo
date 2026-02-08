import { allDocs } from 'content-collections';
import fs from 'fs';
import path from 'path';

type SitemapEntry = {
  url: string;
  lastModified: Date | string;
  changeFreq?: string;
  priority?: number;
};

export default async function Sitemap(): Promise<SitemapEntry[]> {
  // Access directly to avoid triggering full env validation during build
  const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000';

  // ============================================================
  // WORKAROUND: Manually scan blog directory
  // content-collections has a bug where it only processes 12 posts
  // So we manually scan the filesystem to get all blog posts
  // ============================================================
  const blogDir = path.join(process.cwd(), 'src/content/blog');
  const blogFiles = fs.readdirSync(blogDir).filter(file => file.endsWith('.mdx'));

  // ============================================================
  // CORE PAGES — Highest priority
  // ============================================================
  const corePages: SitemapEntry[] = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      priority: 1.0,
      changeFreq: 'weekly'
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      priority: 0.9,
      changeFreq: 'weekly'
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      priority: 0.9,
      changeFreq: 'daily'
    },
    {
      url: `${baseUrl}/story`,
      lastModified: new Date(),
      priority: 0.7,
      changeFreq: 'monthly'
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      priority: 0.7,
      changeFreq: 'monthly'
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      priority: 0.8,
      changeFreq: 'weekly'
    },
    {
      url: `${baseUrl}/report`,
      lastModified: new Date(),
      priority: 0.7,
      changeFreq: 'weekly'
    },
  ];

  // ============================================================
  // FEATURE PAGES — Product features
  // ============================================================
  const featurePages: SitemapEntry[] = [
    'ai-tracking',
    'content',
    'analytics',
    'backlinks',
    'technical-audit',
    'social-listening',
    'integrations',
  ].map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    priority: 0.8,
    changeFreq: 'monthly' as const
  }));

  // ============================================================
  // PLATFORM / INTEGRATION PAGES
  // ============================================================
  const platformPages: SitemapEntry[] = [
    'shopify',
    'wordpress',
    'webflow',
    'woocommerce',
    'wix',
    'bigcommerce',
    'squarespace',
  ].map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    priority: 0.7,
    changeFreq: 'monthly' as const
  }));

  // ============================================================
  // USE CASE / SOLUTION PAGES
  // ============================================================
  const useCasePages: SitemapEntry[] = [
    'ecommerce',
    'answer-engine-optimization',
    'generative-engine-optimization',
    'rank-on-chatgpt',
    'content-automation',
    'content-strategy',
    'automated-publishing',
    'seo-automation',
    'keyword-research',
    'keyword-clustering',
    'keyword-discovery',
    'link-building',
    'backlink-building',
    'backlink-exchange',
    'multilingual-seo',
    'json-ld-schema',
    'article-generator',
    'ai-blog-writer',
    'ai-content-marketing',
    'ai-seo-agent',
    'auto-linking',
    'autoblog',
    'domain-authority',
    'organic-traffic',
    'seo-audit-software',
    'roi-calculator',
    'use-cases',
    'compare',
  ].map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    priority: 0.7,
    changeFreq: 'monthly' as const
  }));

  // ============================================================
  // COMPANY / RESOURCE PAGES
  // ============================================================
  const companyPages: SitemapEntry[] = [
    'careers',
    'partners',
    'press',
    'reviews',
    'success-stories',
    'resources',
    'templates',
    'webinars',
    'changelog',
    'developers',
    'seo-agency',
    'seo-agencies',
    'affiliate',
    'whitelabel',
    'glossary',
    'status',
    'gdpr',
    'security',
  ].map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    priority: 0.5,
    changeFreq: 'monthly' as const
  }));

  // ============================================================
  // FREE TOOLS
  // ============================================================
  const freeToolPages: SitemapEntry[] = [
    'free-tools/geo-audit',
    'free-tools/jsonld-schema',
    'free-tools/missing-keywords',
  ].map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    priority: 0.6,
    changeFreq: 'monthly' as const
  }));

  // ============================================================
  // LEGAL PAGES
  // ============================================================
  const legalPages: SitemapEntry[] = [
    'privacy-policy',
    'terms-of-use',
    'cookie-policy',
  ].map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    priority: 0.3,
    changeFreq: 'yearly' as const
  }));

  // ============================================================
  // DYNAMIC CONTENT — Blog posts
  // Manually scanned from filesystem (workaround for content-collections bug)
  // ============================================================
  const blogPosts: SitemapEntry[] = blogFiles.map((file) => {
    const slug = file.replace('.mdx', '');
    return {
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      priority: 0.6,
      changeFreq: 'monthly'
    };
  });

  // ============================================================
  // DYNAMIC CONTENT — Docs
  // ============================================================
  const docPages: SitemapEntry[] = allDocs.map((doc) => ({
    url: `${baseUrl}${doc.slug}`,
    lastModified: new Date(),
    priority: 0.8,
    changeFreq: 'weekly'
  }));

  // ============================================================
  // PROGRAMMATIC PAGES — Competitors
  // ============================================================
  const competitors = ['ahrefs', 'semrush', 'moz', 'surfer', 'clearscope', 'frase', 'jasper', 'marketmuse', 'scalenut', 'writesonic'];
  const competitorPages: SitemapEntry[] = competitors.map((competitor) => ({
    url: `${baseUrl}/compare/${competitor}`,
    lastModified: new Date(),
    priority: 0.7,
    changeFreq: 'monthly'
  }));

  // ============================================================
  // PROGRAMMATIC PAGES — Glossary Terms
  // ============================================================
  const glossaryTerms = ['seo', 'aeo', 'geo', 'backlink', 'domain-authority', 'keyword', 'serp', 'crawling', 'indexing', 'organic-traffic', 'meta-tags', 'schema-markup', 'canonical-url', 'bounce-rate', 'long-tail-keywords'];
  const glossaryTermPages: SitemapEntry[] = glossaryTerms.map((term) => ({
    url: `${baseUrl}/glossary/${term}`,
    lastModified: new Date(),
    priority: 0.6,
    changeFreq: 'monthly'
  }));

  // ============================================================
  // PROGRAMMATIC PAGES — Industries
  // ============================================================
  const industries = ['restaurants', 'dentists', 'lawyers', 'real-estate', 'healthcare', 'ecommerce', 'gyms', 'plumbers', 'accountants', 'photographers'];
  const industryPages: SitemapEntry[] = industries.map((industry) => ({
    url: `${baseUrl}/industries/${industry}`,
    lastModified: new Date(),
    priority: 0.7,
    changeFreq: 'monthly'
  }));

  // ============================================================
  // PROGRAMMATIC PAGES — Integrations
  // ============================================================
  const integrations = ['google-search-console', 'google-analytics', 'shopify', 'wordpress', 'webflow', 'slack', 'zapier', 'notion', 'airtable', 'hubspot', 'semrush', 'ahrefs'];
  const integrationPages: SitemapEntry[] = integrations.map((integration) => ({
    url: `${baseUrl}/integrations/${integration}`,
    lastModified: new Date(),
    priority: 0.7,
    changeFreq: 'monthly'
  }));

  // ============================================================
  // PROGRAMMATIC PAGES — Languages
  // ============================================================
  const languages = ['german', 'french', 'spanish', 'italian', 'portuguese', 'japanese', 'korean', 'chinese', 'arabic', 'dutch'];
  const languagePages: SitemapEntry[] = languages.map((language) => ({
    url: `${baseUrl}/languages/${language}`,
    lastModified: new Date(),
    priority: 0.6,
    changeFreq: 'monthly'
  }));

  // ============================================================
  // PROGRAMMATIC PAGES — Platforms
  // ============================================================
  const platformsList = ['shopify', 'woocommerce', 'wordpress', 'webflow', 'wix', 'squarespace', 'bigcommerce', 'magento', 'ghost', 'drupal'];
  const platformDetailPages: SitemapEntry[] = platformsList.map((platform) => ({
    url: `${baseUrl}/platforms/${platform}`,
    lastModified: new Date(),
    priority: 0.7,
    changeFreq: 'monthly'
  }));

  // ============================================================
  // PROGRAMMATIC PAGES — SEO Agency Cities
  // ============================================================
  const cities = [
    // USA
    'new-york', 'los-angeles', 'chicago', 'houston', 'phoenix', 'philadelphia', 'san-antonio', 'san-diego', 'dallas', 'san-jose', 'austin', 'san-francisco', 'seattle', 'denver', 'boston', 'miami', 'atlanta', 'portland', 'las-vegas', 'detroit',
    // UK
    'london', 'manchester', 'birmingham', 'leeds', 'glasgow', 'liverpool', 'edinburgh', 'bristol',
    // Europe
    'berlin', 'munich', 'paris', 'amsterdam', 'barcelona', 'madrid', 'rome', 'milan', 'dublin', 'stockholm',
    // Australia
    'sydney', 'melbourne', 'brisbane', 'perth', 'adelaide', 'gold-coast', 'newcastle', 'canberra', 'wollongong', 'hobart', 'geelong', 'townsville', 'cairns', 'darwin', 'toowoomba', 'ballarat', 'bendigo', 'launceston', 'sunshine-coast', 'central-coast', 'mackay', 'rockhampton', 'bunbury', 'bundaberg', 'hervey-bay', 'wagga-wagga', 'albury', 'mildura', 'shepparton', 'tamworth', 'port-macquarie', 'orange', 'dubbo', 'geraldton', 'kalgoorlie', 'alice-springs',
    // Canada
    'toronto', 'vancouver', 'montreal',
    // Asia
    'singapore', 'hong-kong', 'tokyo', 'dubai'
  ];
  const cityPages: SitemapEntry[] = cities.map((city) => ({
    url: `${baseUrl}/seo-agency/${city}`,
    lastModified: new Date(),
    priority: 0.6,
    changeFreq: 'monthly'
  }));

  // ============================================================
  // PROGRAMMATIC PAGES — Use Cases
  // ============================================================
  const useCases = ['marketing-teams', 'agencies', 'startups', 'enterprises', 'ecommerce', 'saas', 'publishers', 'freelancers', 'content-creators', 'local-business'];
  const useCaseDetailPages: SitemapEntry[] = useCases.map((usecase) => ({
    url: `${baseUrl}/use-cases/${usecase}`,
    lastModified: new Date(),
    priority: 0.7,
    changeFreq: 'monthly'
  }));

  // ============================================================
  // OTHER PAGES
  // ============================================================
  const otherPages: SitemapEntry[] = [
    {
      url: `${baseUrl}/sales`,
      lastModified: new Date(),
      priority: 0.5,
      changeFreq: 'monthly'
    },
    {
      url: `${baseUrl}/waitlist`,
      lastModified: new Date(),
      priority: 0.5,
      changeFreq: 'monthly'
    },
  ];

  // ============================================================
  // COMBINE ALL ENTRIES
  // ============================================================
  const sitemap: SitemapEntry[] = [
    ...corePages,
    ...featurePages,
    ...platformPages,
    ...useCasePages,
    ...companyPages,
    ...freeToolPages,
    ...legalPages,
    ...blogPosts,
    ...docPages,
    ...competitorPages,
    ...glossaryTermPages,
    ...industryPages,
    ...integrationPages,
    ...languagePages,
    ...platformDetailPages,
    ...cityPages,
    ...useCaseDetailPages,
    ...otherPages,
  ];

  // Sort alphabetically by URL for consistency
  return sitemap.sort((a, b) => a.url.localeCompare(b.url));
}
