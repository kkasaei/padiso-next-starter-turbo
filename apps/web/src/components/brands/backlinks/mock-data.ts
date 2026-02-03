import type {
  BacklinkReceived,
  BacklinkGiven,
  CreditTransaction,
  BacklinkMetrics,
  SubscriptionPlan,
  CMSProvider,
} from './types'

// ============================================================
// MOCK METRICS
// ============================================================
export const MOCK_BACKLINK_METRICS: BacklinkMetrics = {
  creditBalance: 181,
  totalReceived: 77,
  totalGiven: 45,
  backlinksValue: 14075,
  domainRating: 38.0,
  monthlyCreditsEarned: 156,
  monthlyCreditsSpent: 89,
}

// ============================================================
// MOCK BACKLINKS RECEIVED
// ============================================================
export const MOCK_BACKLINKS_RECEIVED: BacklinkReceived[] = [
  {
    id: '1',
    date: '2025-12-30',
    sourceWebsite: 'techcrunch.com',
    sourceUrl: 'https://techcrunch.com/best-seo-tools-2025',
    article: 'Top SEO Tools for E-commerce in 2025',
    articleUrl: '/blog/seo-optimization-guide',
    domainRating: 46,
    linkValue: 125,
    status: 'verified',
  },
  {
    id: '2',
    date: '2025-12-30',
    sourceWebsite: 'searchenginejournal.com',
    sourceUrl: 'https://searchenginejournal.com/ai-seo-trends',
    article: 'AI-Powered SEO: The Future of Search',
    articleUrl: '/blog/ai-seo-trends',
    domainRating: 46,
    linkValue: 125,
    status: 'verified',
  },
  {
    id: '3',
    date: '2025-12-28',
    sourceWebsite: 'moz.com',
    sourceUrl: 'https://moz.com/blog/domain-authority-guide',
    article: 'Understanding Domain Authority',
    articleUrl: '/features/domain-analysis',
    domainRating: 19,
    linkValue: 175,
    status: 'verified',
  },
  {
    id: '4',
    date: '2025-12-27',
    sourceWebsite: 'ahrefs.com',
    sourceUrl: 'https://ahrefs.com/blog/backlink-strategies',
    article: 'Backlink Building Strategies That Work',
    articleUrl: '/blog/link-building-guide',
    domainRating: 12,
    linkValue: 150,
    status: 'verified',
  },
  {
    id: '5',
    date: '2025-12-21',
    sourceWebsite: 'semrush.com',
    sourceUrl: 'https://semrush.com/blog/ecommerce-seo',
    article: 'E-commerce SEO Best Practices',
    articleUrl: '/blog/ecommerce-optimization',
    domainRating: 18,
    linkValue: 175,
    status: 'verified',
  },
  {
    id: '6',
    date: '2025-12-19',
    sourceWebsite: 'hubspot.com',
    sourceUrl: 'https://hubspot.com/marketing/seo-guide',
    article: 'Complete SEO Marketing Guide',
    articleUrl: '/resources/seo-checklist',
    domainRating: 52,
    linkValue: 200,
    status: 'verified',
  },
  {
    id: '7',
    date: '2025-12-15',
    sourceWebsite: 'neilpatel.com',
    sourceUrl: 'https://neilpatel.com/blog/ai-visibility',
    article: 'How to Increase AI Visibility',
    articleUrl: '/blog/ai-search-optimization',
    domainRating: 38,
    linkValue: 150,
    status: 'verified',
  },
  {
    id: '8',
    date: '2025-12-12',
    sourceWebsite: 'backlinko.com',
    sourceUrl: 'https://backlinko.com/content-marketing',
    article: 'Content Marketing for Links',
    articleUrl: '/blog/content-strategy',
    domainRating: 41,
    linkValue: 175,
    status: 'verified',
  },
  {
    id: '9',
    date: '2025-12-08',
    sourceWebsite: 'contentmarketinginstitute.com',
    sourceUrl: 'https://contentmarketinginstitute.com/seo',
    article: 'SEO Content Strategy Guide',
    articleUrl: '/blog/content-seo',
    domainRating: 35,
    linkValue: 140,
    status: 'verified',
  },
  {
    id: '10',
    date: '2025-12-05',
    sourceWebsite: 'searchengineland.com',
    sourceUrl: 'https://searchengineland.com/google-updates',
    article: 'Google Algorithm Updates 2025',
    articleUrl: '/blog/algorithm-changes',
    domainRating: 48,
    linkValue: 185,
    status: 'verified',
  },
]

// Generate more mock data for pagination
const additionalReceived: BacklinkReceived[] = []
for (let i = 11; i <= 77; i++) {
  const websites = [
    'medium.com',
    'forbes.com',
    'entrepreneur.com',
    'inc.com',
    'fastcompany.com',
    'wired.com',
    'theverge.com',
    'mashable.com',
    'digitaltrends.com',
    'cnet.com',
  ]
  const website = websites[i % websites.length]
  additionalReceived.push({
    id: String(i),
    date: new Date(2025, 11, 30 - i).toISOString().split('T')[0],
    sourceWebsite: website,
    sourceUrl: `https://${website}/article-${i}`,
    article: `SEO Article ${i}`,
    articleUrl: `/blog/article-${i}`,
    domainRating: Math.floor(Math.random() * 50) + 10,
    linkValue: Math.floor(Math.random() * 150) + 75,
    status: 'verified',
  })
}

export const MOCK_BACKLINKS_RECEIVED_FULL = [...MOCK_BACKLINKS_RECEIVED, ...additionalReceived]

// ============================================================
// MOCK BACKLINKS GIVEN
// ============================================================
export const MOCK_BACKLINKS_GIVEN: BacklinkGiven[] = [
  {
    id: '1',
    date: '2025-12-29',
    destinationWebsite: 'marketingprofs.com',
    destinationUrl: 'https://marketingprofs.com/ai-marketing',
    article: 'Content Marketing Best Practices',
    articleUrl: '/blog/content-marketing-tips',
    creditsEarned: 15,
    status: 'active',
  },
  {
    id: '2',
    date: '2025-12-26',
    destinationWebsite: 'contentmarketingadvice.com',
    destinationUrl: 'https://contentmarketingadvice.com/strategy',
    article: 'SEO Content Strategy Guide',
    articleUrl: '/blog/seo-strategy',
    creditsEarned: 12,
    status: 'active',
  },
  {
    id: '3',
    date: '2025-12-22',
    destinationWebsite: 'copyblogger.com',
    destinationUrl: 'https://copyblogger.com/writing-tips',
    article: 'Writing for Search Engines',
    articleUrl: '/blog/seo-writing',
    creditsEarned: 18,
    status: 'active',
  },
  {
    id: '4',
    date: '2025-12-18',
    destinationWebsite: 'convinceandconvert.com',
    destinationUrl: 'https://convinceandconvert.com/digital',
    article: 'Digital Marketing Trends',
    articleUrl: '/blog/marketing-trends',
    creditsEarned: 14,
    status: 'active',
  },
  {
    id: '5',
    date: '2025-12-14',
    destinationWebsite: 'socialmediaexaminer.com',
    destinationUrl: 'https://socialmediaexaminer.com/content',
    article: 'Social Media and SEO',
    articleUrl: '/blog/social-seo',
    creditsEarned: 20,
    status: 'active',
  },
]

// ============================================================
// MOCK CREDIT TRANSACTIONS
// ============================================================
export const MOCK_CREDIT_TRANSACTIONS: CreditTransaction[] = [
  {
    id: '1',
    date: '2025-12-30',
    type: 'spent',
    amount: -46,
    description: 'Received backlink from techcrunch.com (DR 46)',
    balanceAfter: 181,
  },
  {
    id: '2',
    date: '2025-12-29',
    type: 'earned',
    amount: 15,
    description: 'Gave backlink to marketingprofs.com',
    balanceAfter: 227,
  },
  {
    id: '3',
    date: '2025-12-28',
    type: 'spent',
    amount: -19,
    description: 'Received backlink from moz.com (DR 19)',
    balanceAfter: 212,
  },
  {
    id: '4',
    date: '2025-12-27',
    type: 'purchased',
    amount: 100,
    description: 'Purchased credit package',
    balanceAfter: 231,
  },
  {
    id: '5',
    date: '2025-12-26',
    type: 'earned',
    amount: 12,
    description: 'Gave backlink to contentmarketingadvice.com',
    balanceAfter: 131,
  },
  {
    id: '6',
    date: '2025-12-01',
    type: 'bonus',
    amount: 100,
    description: 'Welcome bonus credits',
    balanceAfter: 119,
  },
]

// ============================================================
// MOCK FAQ ITEMS
// ============================================================
export const MOCK_FAQ_ITEMS: FAQItem[] = [
  {
    id: 'what-is-backlink',
    question: 'What Is Backlink?',
    answer: `A backlink is a link from another website that points to your website. It serves as a signal to search engines that your content is credible and valuable.

**Example:** If an authoritative industry blog links to your article, it suggests to Google that your page should be considered more valuable or trustworthy than similar pages without a backlink.

**Why it matters:**
• Helps grow your domain authority (DR)
• Improves your chances of ranking higher on Google and in AI answers (such as ChatGPT, Perplexity)
• Can earn you qualified referral traffic
• Builds brand credibility`,
    category: 'general',
  },
  {
    id: 'dashboard-overview',
    question: 'Dashboard Overview',
    answer: `**Backlink Credits:** Available credits to spend on receiving backlinks.

**Backlinks Received:** Total number of received backlinks

**Backlinks Value:** Estimated dollar value of received backlinks if you were to buy them of a marketplace`,
    category: 'general',
  },
  {
    id: 'credit-system',
    question: 'How the Credit System Works',
    answer: `A transparent credit model keeps exchanges fair so high-authority domains receive proportional value.

**Starting Balance:** Every new account begins with 100 credits to start receiving backlinks immediately.

**Earn Credits:** When you give a backlink (happens automatically), you earn credits (1 DR == 1 credit, capped at 20 per link)

**Spend Credits:** When you receive a backlink (happens automatically), you spend credits (== amount of giving website DR)

**No Monthly Cap:** Receive as many backlinks as your credits allow.

**Optional Top-Up:** Purchase additional credits if you want faster growth. Subscriptions are entirely optional.`,
    category: 'credits',
  },
  {
    id: 'how-placed',
    question: 'How Backlinks Are Placed',
    answer: `Links are naturally integrated into daily articles published on participating websites within your niche.

• Each link is contextually placed where it adds genuine value for readers.
• All links are dofollow, passing full SEO value.
• Your articles must be live and in your sitemap for placement and verification.`,
    category: 'placement',
  },
  {
    id: 'requirements',
    question: 'Requirements for Approval',
    answer: `To participate in the backlink exchange, your site must meet these criteria:

**Publish regularly:** Fresh, live articles create placement opportunities.

**Sitemap coverage:** Published articles must be in your sitemap so the network can discover and verify them.

**Accessible pages:** No hard paywalls or blocks on target URLs.

**Relevant niche:** Stay in your niche to receive contextual, high-value links.

**Credits available:** Maintain a positive balance so incoming links are not skipped.`,
    category: 'requirements',
  },
  {
    id: 'not-approved',
    question: 'Why Some Sites Are Not Approved',
    answer: `Sites may be rejected or paused for the following reasons:

• Adult, illegal, or gray hat content.
• Very new sites typically need 15 to 20 days before first placements as trust builds.`,
    category: 'requirements',
  },
  {
    id: 'timing',
    question: 'Timing and What to Expect',
    answer: `**New sites:** Expect your first backlinks within 15 to 20 days while trust and crawl coverage ramp up.

**Ongoing:** No monthly limit. Links flow continuously as long as you have credits and relevant targets.

**Flow rate:** More fresh content plus more credits equals more frequent placements.`,
    category: 'general',
  },
  {
    id: 'maximize',
    question: 'Tips to Maximize Your Backlinks',
    answer: `**Publish consistently:** More indexed URLs in your sitemap means more eligible targets for backlinks.

**Maintain credit balance:** Keep a buffer of credits to avoid missing placement opportunities.

**Stay in your niche:** Contextual links from relevant sites provide the most SEO value.

**Keep content accessible:** Ensure your articles are live, indexed, and without paywalls.`,
    category: 'general',
  },
  {
    id: 'faq-subscription',
    question: 'Do I need a backlink subscription?',
    answer: `No. Subscriptions are optional. Use them only if you want more credits faster. Earning credits by giving links works fine on its own.`,
    category: 'credits',
  },
  {
    id: 'faq-no-links',
    question: 'Why have I not received any links yet?',
    answer: `New or newly approved sites typically take 15 to 20 days. Ensure your articles are published, included in your sitemap, and publicly accessible.`,
    category: 'general',
  },
  {
    id: 'faq-not-approved',
    question: 'Why was my site not approved?',
    answer: `Common reasons include missing sitemap, blocked pages, off-policy content. Fix these issues and reapply.`,
    category: 'requirements',
  },
  {
    id: 'faq-monthly-limit',
    question: 'Is there a monthly limit on backlinks?',
    answer: `No. You can receive as many backlinks as your credits and relevance allow.`,
    category: 'credits',
  },
  {
    id: 'faq-lose-credits',
    question: 'Do I lose credits when I give links?',
    answer: `No. Giving links earns credits. Receiving links spends credits. Keep a buffer to avoid missing placements.`,
    category: 'credits',
  },
  {
    id: 'faq-ai-visibility',
    question: 'Do these links help with AI visibility?',
    answer: `Yes. Quality backlinks improve authority signals that both search engines and AI systems consider when citing sources.`,
    category: 'general',
  },
  {
    id: 'faq-addon',
    question: 'What is a backlink add-on subscription?',
    answer: `An optional monthly subscription that grants bonus backlink credits (100, 300, or 600 credits/month) to accelerate backlink growth. Pricing is $100, $300, or $600 per month. Credits roll over month to month and are used to receive backlinks from other websites in the network.`,
    category: 'credits',
  },
  {
    id: 'faq-limited-seats',
    question: 'Are there limited seats for this subscription?',
    answer: `Yes. There are 20 total slots across the platform. The frontend shows remaining slots (e.g., "5 slots left"). When all slots are taken, new purchases are blocked until a slot becomes available.`,
    category: 'credits',
  },
]

// ============================================================
// MOCK SUBSCRIPTION PLANS
// ============================================================
export const MOCK_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 100,
    price: 100,
    slotsAvailable: 8,
    totalSlots: 20,
    features: [
      '100 credits per month',
      'Credits roll over',
      'Priority placement',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    credits: 300,
    price: 300,
    slotsAvailable: 5,
    totalSlots: 20,
    features: [
      '300 credits per month',
      'Credits roll over',
      'Priority placement',
      'Monthly reports',
    ],
  },
  {
    id: 'scale',
    name: 'Scale',
    credits: 600,
    price: 600,
    slotsAvailable: 2,
    totalSlots: 20,
    features: [
      '600 credits per month',
      'Credits roll over',
      'Priority placement',
      'Monthly reports',
      'Dedicated support',
    ],
  },
]

// ============================================================
// MOCK CMS PROVIDERS
// ============================================================
export const MOCK_CMS_PROVIDERS: CMSProvider[] = [
  {
    id: 'wordpress',
    name: 'WordPress',
    icon: 'wordpress',
    description: 'Sync with WordPress',
    popular: true,
  },
  {
    id: 'shopify',
    name: 'Shopify',
    icon: 'shopify',
    description: 'Sync with Shopify blog',
    popular: true,
  },
  {
    id: 'webflow',
    name: 'Webflow',
    icon: 'webflow',
    description: 'Connect Webflow CMS',
    popular: true,
  },
  {
    id: 'notion',
    name: 'Notion',
    icon: 'notion',
    description: 'Connect your Notion workspace',
    popular: true,
  },
  {
    id: 'framer',
    name: 'Framer',
    icon: 'framer',
    description: 'Connect Framer CMS',
  },
  {
    id: 'squarespace',
    name: 'Squarespace',
    icon: 'squarespace',
    description: 'Sync with Squarespace',
  },
  {
    id: 'wix',
    name: 'Wix',
    icon: 'wix',
    description: 'Connect Wix blog',
  },
  {
    id: 'ghost',
    name: 'Ghost',
    icon: 'ghost',
    description: 'Sync with Ghost CMS',
  },
  {
    id: 'contentful',
    name: 'Contentful',
    icon: 'contentful',
    description: 'Headless CMS',
  },
  {
    id: 'sanity',
    name: 'Sanity',
    icon: 'sanity',
    description: 'Connect Sanity CMS',
  },
  {
    id: 'strapi',
    name: 'Strapi',
    icon: 'strapi',
    description: 'Connect Strapi CMS',
  },
  {
    id: 'drupal',
    name: 'Drupal',
    icon: 'drupal',
    description: 'Connect Drupal CMS',
  },
  {
    id: 'bigcommerce',
    name: 'BigCommerce',
    icon: 'bigcommerce',
    description: 'Sync with BigCommerce',
  },
  {
    id: 'storyblok',
    name: 'Storyblok',
    icon: 'storyblock',
    description: 'Connect Storyblok CMS',
  },
]
