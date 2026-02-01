/**
 * Page Audit Detail Mock Data
 *
 * Mock data for individual page audit details with full analysis.
 */

import { MOCK_COMPANY, MOCK_PAGES, buildUrl, getRecentTimestamp } from './common';
import type { PageAuditDto } from '@/components/brands/audit';

// ============================================================
// MOCK PAGE CONTENT
// ============================================================
const MOCK_PAGE_CONTENT: Record<string, string> = {
  'mock-page-1': `# AI Agency ROI Sydney: How to Measure and Maximize ROI for Your Business

*February 21, 2026 • 10 mins*

Discover how to measure and maximize AI agency ROI for your Sydney business. Learn about key metrics, measurement strategies, and why ${MOCK_COMPANY.name} delivers exceptional results for Australian businesses.

## Understanding AI Agency ROI

What if I told you that 87% of Sydney businesses using AI services see ROI within 6 months?

The secret that's helping Sydney companies save $50,000+ annually through strategic AI implementation isn't what you think. It's about partnering with an AI agency that focuses on delivering measurable ROI.

At ${MOCK_COMPANY.name}, Sydney's leading AI automation agency, we've helped 100+ Australian businesses achieve exceptional ROI through strategic consulting, implementation, and ongoing optimisation.

## Key Benefits for Sydney Businesses

**1. Measurable Value**
AI solutions provide measurable value from your investments. You understand the tangible benefits delivered by your AI partnership.

**2. Strategic Focus**
Proper AI implementation ensures strategic focus on high-value initiatives. You prioritise work that delivers the best returns.

**3. Cost Justification**
Quality AI partnerships provide cost justification for technology investments based on measurable returns.

**4. Continuous Optimisation**
Modern AI solutions enable continuous optimisation to maximise long-term value.

## How to Measure AI ROI

Measuring AI ROI requires systematic measurement approaches:

**Step 1: Establish Baseline Metrics**
Before engaging an AI agency, establish baseline metrics. Understand current performance, costs, and efficiency levels.

**Step 2: Define Success Metrics**
Define specific metrics you'll track. What will you measure? Cost savings? Revenue increases? Efficiency gains?

**Step 3: Track Implementation Costs**
Track all costs associated with AI implementation including agency fees, technology costs, and ongoing maintenance.

**Step 4: Calculate Returns**
Compare business outcomes to investment to calculate ROI percentage.

## Ready to Get Started?

Working with the right AI partner can deliver exceptional ROI and transform your business operations.

Contact ${MOCK_COMPANY.name} today to discuss how AI can transform your business.`,

  'mock-page-2': `# About ${MOCK_COMPANY.name}

Learn about our journey and the team behind our success.

## Our Story

Founded in Sydney, we started with a simple mission: to help businesses succeed through AI automation. Today, we serve clients across Australia.

## Our Team

Our diverse team brings together experts in AI, automation, and business strategy. Together, we create solutions that make a difference.

## Our Values

- **Integrity**: We believe in honest, transparent relationships
- **Innovation**: We constantly push boundaries to deliver better results
- **Excellence**: We strive for the highest quality in everything we do`,

  'mock-page-3': `# Blog

Welcome to our blog where we share insights, tips, and industry news.

Check back soon for our latest articles on AI automation and business transformation.`,
};

export function getMockPageContent(pageId: string): string {
  return MOCK_PAGE_CONTENT[pageId] || '';
}

// ============================================================
// DETAILED PAGE AUDIT DATA
// ============================================================
const PAGE_AUDIT_DETAILS: Record<string, PageAuditDto> = {
  'mock-page-1': {
    id: 'mock-page-1',
    auditId: 'audit-main-1',
    url: buildUrl(MOCK_PAGES.blogPost1),
    path: MOCK_PAGES.blogPost1,
    title: 'AI Agency ROI Sydney: How to Measure and Maximize ROI for Your Business',
    overallScore: 68,
    seoScore: 62,
    aeoScore: 58,
    contentScore: 72,
    technicalScore: 78,
    status: 'COMPLETED',
    error: null,
    createdAt: getRecentTimestamp(0),
    discoveredAt: getRecentTimestamp(0),
    discoveredFrom: 'sitemap',
    depth: 1,
    scannedAt: getRecentTimestamp(0),
    metadata: {
      title: 'AI Agency ROI Sydney: How to Measure and Maximize ROI for Your Business',
      description: `Discover how to measure and maximize AI agency ROI for your business. Learn about metrics, measurement strategies, and why ${MOCK_COMPANY.name} delivers exceptional results.`,
      h1: 'AI Agency ROI Sydney: How to Measure and Maximize ROI for Your Business',
      h2s: [
        'Understanding AI Agency ROI',
        'Key Benefits for Sydney Businesses',
        'How to Measure AI ROI',
        'Ready to Get Started?',
      ],
      canonicalUrl: buildUrl(MOCK_PAGES.blogPost1),
      ogImage: `${MOCK_COMPANY.baseUrl}/og-image.jpg`,
      ogTitle: 'AI Agency ROI Sydney: How to Measure and Maximize ROI',
      ogDescription: 'Discover how to measure and maximize AI agency ROI for your business.',
      robots: 'index, follow',
      viewport: 'width=device-width, initial-scale=1',
      charset: 'utf-8',
      language: 'en',
      structuredData: [
        {
          type: 'Article',
          data: {
            '@type': 'Article',
            headline: 'AI Agency ROI Sydney',
            author: MOCK_COMPANY.founder,
            datePublished: '2026-02-21',
          },
        },
        {
          type: 'Organization',
          data: {
            '@type': 'Organization',
            name: MOCK_COMPANY.name,
            url: MOCK_COMPANY.baseUrl,
          },
        },
      ],
      wordCount: 1850,
      images: [],
      links: [
        { href: '/about', text: 'About', isInternal: true, isNofollow: false },
        { href: '/services', text: 'Services', isInternal: true, isNofollow: false },
        { href: '/blog', text: 'Blog', isInternal: true, isNofollow: false },
        {
          href: 'https://calendly.com/padiso/30min',
          text: 'Book a consultation',
          isInternal: false,
          isNofollow: true,
        },
      ],
    },
    analysis: {
      strengths: [
        {
          title: 'Comprehensive Content',
          description: 'The article provides detailed information with case studies, metrics, and actionable steps.',
          impact: 'high',
        },
        {
          title: 'Good Heading Structure',
          description:
            'The page uses a logical H1 > H2 > H3 hierarchy that helps search engines understand the content.',
          impact: 'medium',
        },
        {
          title: 'Clear Call-to-Action',
          description: 'Multiple CTAs are present including consultation booking.',
          impact: 'medium',
        },
        {
          title: 'Author Attribution',
          description: `Content is attributed to a named author (${MOCK_COMPANY.founder}), which builds E-E-A-T signals.`,
          impact: 'medium',
        },
      ],
      issues: [
        {
          title: 'Thin Content in Sections',
          description: 'Several sections contain very short paragraphs that could be expanded.',
          impact: 'medium',
        },
        {
          title: 'Missing FAQ Schema',
          description: 'Despite having FAQ-style content, there is no FAQ schema markup implemented.',
          impact: 'medium',
        },
      ],
      recommendations: [
        {
          title: 'Add FAQ Schema',
          description:
            'Implement FAQ-Page schema markup for the "How to Measure" section to improve chances of appearing in rich results.',
          impact: 'high',
        },
        {
          title: 'Expand Short Sections',
          description: 'Expand benefit sections with examples, statistics, or case study snippets.',
          impact: 'medium',
        },
        {
          title: 'Add Internal Links',
          description: 'Link to other relevant blog posts and service pages to improve site structure.',
          impact: 'medium',
        },
        {
          title: 'Include Visual Content',
          description: 'Add charts, infographics, or images to break up the text and illustrate key concepts.',
          impact: 'low',
        },
      ],
      aeoReadiness: {
        score: 58,
        status: 'needs-improvement',
        factors: { structuredData: 45, contentClarity: 65, answerability: 70, semanticMarkup: 52 },
      },
      contentQuality: {
        readabilityScore: 65,
        uniquenessIndicator: 'medium',
        topicRelevance: 85,
        keywordOptimization: 70,
      },
    },
    issues: [
      {
        type: 'thin_content_sections',
        severity: 'warning',
        message: 'Multiple sections contain only 1-2 short sentences with minimal value',
        fix: 'Expand these sections with examples, data, or detailed explanations',
      },
      {
        type: 'missing_structured_data',
        severity: 'warning',
        message: 'Missing FAQ schema despite having FAQ-style content structure',
        fix: 'Add FAQ-Page schema markup to the "How to Measure" section',
      },
    ],
    content: MOCK_PAGE_CONTENT['mock-page-1'] ?? null,
  },
  'mock-page-2': {
    id: 'mock-page-2',
    auditId: 'audit-main-1',
    url: buildUrl(MOCK_PAGES.about),
    path: MOCK_PAGES.about,
    title: `About Us - ${MOCK_COMPANY.name}`,
    overallScore: 72,
    seoScore: 75,
    aeoScore: 68,
    contentScore: 74,
    technicalScore: 71,
    status: 'COMPLETED',
    error: null,
    createdAt: getRecentTimestamp(0),
    discoveredAt: getRecentTimestamp(0),
    discoveredFrom: 'sitemap',
    depth: 0,
    scannedAt: getRecentTimestamp(0),
    metadata: {
      title: `About Us - ${MOCK_COMPANY.name}`,
      description: `Learn about ${MOCK_COMPANY.name}'s journey, mission, and the team behind our success.`,
      h1: `About ${MOCK_COMPANY.name}`,
      h2s: ['Our Story', 'Our Team', 'Our Values'],
      canonicalUrl: buildUrl(MOCK_PAGES.about),
      ogImage: null,
      ogTitle: `About Us - ${MOCK_COMPANY.name}`,
      ogDescription: 'Learn about our company and meet the team.',
      robots: 'index, follow',
      viewport: 'width=device-width, initial-scale=1',
      charset: 'utf-8',
      language: 'en',
      structuredData: [],
      wordCount: 350,
      images: [
        { src: '/team-photo.jpg', alt: null, width: 800, height: 500, loading: 'lazy' },
        { src: '/office.jpg', alt: 'Our modern office space', width: 600, height: 400, loading: 'lazy' },
        { src: '/founder.jpg', alt: null, width: 300, height: 300, loading: 'lazy' },
      ],
      links: [
        { href: '/', text: 'Home', isInternal: true, isNofollow: false },
        { href: '/contact', text: 'Get in Touch', isInternal: true, isNofollow: false },
        { href: '/careers', text: 'Join Our Team', isInternal: true, isNofollow: false },
      ],
    },
    analysis: {
      strengths: [
        {
          title: 'Clear Page Structure',
          description: 'The page has a logical heading hierarchy that helps users and search engines.',
          impact: 'medium',
        },
        {
          title: 'Good Meta Description',
          description: 'The meta description is informative and within the recommended length.',
          impact: 'medium',
        },
      ],
      issues: [
        {
          title: 'Missing Image Alt Text',
          description: 'Two images are missing alt attributes, affecting accessibility and SEO.',
          impact: 'high',
        },
        {
          title: 'No Structured Data',
          description: 'The page lacks any structured data markup.',
          impact: 'medium',
        },
        { title: 'Missing OG Image', description: 'No Open Graph image is set.', impact: 'low' },
      ],
      recommendations: [
        {
          title: 'Add Alt Text to All Images',
          description: 'Add descriptive alt text to team-photo.jpg and founder.jpg.',
          impact: 'high',
        },
        {
          title: 'Implement AboutPage Schema',
          description: "Add AboutPage structured data to help search engines understand this is your company's about page.",
          impact: 'medium',
        },
        {
          title: 'Set OG Image',
          description: 'Add an Open Graph image for better social media sharing.',
          impact: 'low',
        },
      ],
      aeoReadiness: {
        score: 68,
        status: 'needs-improvement',
        factors: { structuredData: 40, contentClarity: 78, answerability: 72, semanticMarkup: 82 },
      },
      contentQuality: {
        readabilityScore: 68,
        uniquenessIndicator: 'medium',
        topicRelevance: 80,
        keywordOptimization: 65,
      },
    },
    issues: [
      {
        type: 'missing_alt_text',
        severity: 'critical',
        message: 'Image team-photo.jpg is missing alt text',
        fix: 'Add descriptive alt text like alt="Our team members at the annual company retreat"',
      },
      {
        type: 'missing_alt_text',
        severity: 'critical',
        message: 'Image founder.jpg is missing alt text',
        fix: `Add alt text describing the founder, e.g., alt="${MOCK_COMPANY.founder}, Founder and CEO"`,
      },
      {
        type: 'missing_structured_data',
        severity: 'warning',
        message: 'No structured data found on this page',
        fix: 'Add AboutPage and Organization schema markup',
      },
      {
        type: 'missing_og_tags',
        severity: 'info',
        message: 'Missing og:image tag',
        fix: `Add <meta property="og:image" content="${MOCK_COMPANY.baseUrl}/about-og.jpg">`,
      },
    ],
    content: MOCK_PAGE_CONTENT['mock-page-2'] ?? null,
  },
  'mock-page-3': {
    id: 'mock-page-3',
    auditId: 'audit-main-1',
    url: buildUrl(MOCK_PAGES.blog),
    path: MOCK_PAGES.blog,
    title: `Blog - ${MOCK_COMPANY.name}`,
    overallScore: 58,
    seoScore: 62,
    aeoScore: 55,
    contentScore: 58,
    technicalScore: 57,
    status: 'COMPLETED',
    error: null,
    createdAt: getRecentTimestamp(0),
    discoveredAt: getRecentTimestamp(0),
    discoveredFrom: 'sitemap',
    depth: 0,
    scannedAt: getRecentTimestamp(0),
    metadata: {
      title: `Blog - ${MOCK_COMPANY.name}`,
      description: null,
      h1: 'Blog',
      h2s: [],
      canonicalUrl: null,
      ogImage: null,
      ogTitle: null,
      ogDescription: null,
      robots: 'index, follow',
      viewport: 'width=device-width, initial-scale=1',
      charset: 'utf-8',
      language: 'en',
      structuredData: [],
      wordCount: 120,
      images: [],
      links: [],
    },
    analysis: {
      strengths: [
        { title: 'Valid HTML Structure', description: 'The page passes HTML validation checks.', impact: 'low' },
      ],
      issues: [
        {
          title: 'Missing Meta Description',
          description: 'No meta description is set, which is crucial for SEO.',
          impact: 'high',
        },
        {
          title: 'Thin Content',
          description: 'The page has very little content (120 words).',
          impact: 'high',
        },
        {
          title: 'Missing Canonical URL',
          description: 'No canonical URL is specified.',
          impact: 'medium',
        },
        { title: 'No H2 Headings', description: 'The page lacks H2 subheadings.', impact: 'medium' },
      ],
      recommendations: [
        {
          title: 'Add Meta Description',
          description: 'Write a compelling meta description of 150-160 characters.',
          impact: 'high',
        },
        {
          title: 'Expand Page Content',
          description: 'Add more valuable content including featured posts, categories, or an introduction.',
          impact: 'high',
        },
        {
          title: 'Set Canonical URL',
          description: `Add a canonical tag: <link rel="canonical" href="${buildUrl(MOCK_PAGES.blog)}">`,
          impact: 'medium',
        },
        {
          title: 'Add Blog Structured Data',
          description: 'Implement Blog or CollectionPage schema.',
          impact: 'medium',
        },
      ],
      aeoReadiness: {
        score: 55,
        status: 'needs-improvement',
        factors: { structuredData: 30, contentClarity: 60, answerability: 55, semanticMarkup: 75 },
      },
      contentQuality: {
        readabilityScore: 55,
        uniquenessIndicator: 'low',
        topicRelevance: 60,
        keywordOptimization: 45,
      },
    },
    issues: [
      {
        type: 'missing_description',
        severity: 'critical',
        message: 'Missing meta description tag',
        fix: 'Add <meta name="description" content="Explore our latest articles on AI automation, industry trends, and company updates...">',
      },
      {
        type: 'thin_content',
        severity: 'critical',
        message: 'Page content is too thin (120 words). Aim for at least 500-1000 words.',
        fix: 'Add more valuable content such as featured posts, category descriptions, or blog introduction',
      },
      {
        type: 'missing_canonical',
        severity: 'warning',
        message: 'No canonical URL specified',
        fix: `Add <link rel="canonical" href="${buildUrl(MOCK_PAGES.blog)}">`,
      },
      {
        type: 'missing_og_tags',
        severity: 'warning',
        message: 'Missing Open Graph tags (og:title, og:description, og:image)',
        fix: 'Add complete Open Graph meta tags for better social sharing',
      },
      {
        type: 'missing_structured_data',
        severity: 'info',
        message: 'No Blog or CollectionPage schema found',
        fix: 'Add appropriate structured data for blog listing page',
      },
    ],
    content: MOCK_PAGE_CONTENT['mock-page-3'] ?? null,
  },
};

/**
 * Get detailed page audit by ID
 */
export function getMockPageAuditDetail(pageId: string): PageAuditDto | null {
  return PAGE_AUDIT_DETAILS[pageId] || null;
}

/**
 * Alias for getMockPageAuditDetail to maintain backward compatibility
 */
export const getMockPageAudit = getMockPageAuditDetail;

