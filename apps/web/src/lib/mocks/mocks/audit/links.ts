/**
 * Link Audit Mock Data
 *
 * Mock data for internal and external link audits.
 */

import { MOCK_COMPANY, MOCK_PAGES, buildUrl, getRecentTimestamp, type AuditIssue } from './common';

// ============================================================
// TYPES
// ============================================================
export interface LinkAuditItem {
  id: string;
  sourceUrl: string;
  sourcePage: string;
  targetUrl: string;
  anchorText: string;
  type: 'internal' | 'external' | 'resource';
  status: 'active' | 'broken' | 'redirect' | 'timeout';
  statusCode: number | null;
  issueCount: number;
  criticalCount: number;
  warningCount: number;
}

export interface LinkDetailData extends LinkAuditItem {
  redirectUrl: string | null;
  noFollow: boolean;
  noIndex: boolean;
  position: 'header' | 'content' | 'footer' | 'sidebar' | 'navigation';
  context: string;
  issues: AuditIssue[];
  metrics: {
    clickThroughRate: number | null;
    linkEquity: number;
    relevanceScore: number;
    authorityScore: number;
  };
  createdAt: string;
  lastChecked: string;
}

// ============================================================
// LINK LIST DATA
// ============================================================
export const MOCK_LINKS_LIST: LinkAuditItem[] = [
  {
    id: 'link-1',
    sourceUrl: buildUrl(MOCK_PAGES.blogPost1),
    sourcePage: MOCK_PAGES.blogPost1,
    targetUrl: buildUrl(MOCK_PAGES.services),
    anchorText: 'our AI services',
    type: 'internal',
    status: 'active',
    statusCode: 200,
    issueCount: 0,
    criticalCount: 0,
    warningCount: 0,
  },
  {
    id: 'link-2',
    sourceUrl: buildUrl(MOCK_PAGES.blogPost1),
    sourcePage: MOCK_PAGES.blogPost1,
    targetUrl: 'https://www.oldresource.com/deprecated-page',
    anchorText: 'external resource',
    type: 'external',
    status: 'broken',
    statusCode: 404,
    issueCount: 2,
    criticalCount: 1,
    warningCount: 1,
  },
  {
    id: 'link-3',
    sourceUrl: buildUrl(MOCK_PAGES.blogPost1),
    sourcePage: MOCK_PAGES.blogPost1,
    targetUrl: buildUrl(MOCK_PAGES.contact),
    anchorText: 'click here',
    type: 'internal',
    status: 'active',
    statusCode: 200,
    issueCount: 2,
    criticalCount: 0,
    warningCount: 1,
  },
  {
    id: 'link-4',
    sourceUrl: buildUrl(MOCK_PAGES.services),
    sourcePage: MOCK_PAGES.services,
    targetUrl: buildUrl(MOCK_PAGES.blogPost2),
    anchorText: 'SEO trends guide',
    type: 'internal',
    status: 'active',
    statusCode: 200,
    issueCount: 0,
    criticalCount: 0,
    warningCount: 0,
  },
  {
    id: 'link-5',
    sourceUrl: buildUrl(MOCK_PAGES.about),
    sourcePage: MOCK_PAGES.about,
    targetUrl: 'https://www.linkedin.com/company/padiso',
    anchorText: 'LinkedIn',
    type: 'external',
    status: 'active',
    statusCode: 200,
    issueCount: 0,
    criticalCount: 0,
    warningCount: 0,
  },
  {
    id: 'link-6',
    sourceUrl: buildUrl(MOCK_PAGES.blogPost2),
    sourcePage: MOCK_PAGES.blogPost2,
    targetUrl: 'https://www.deadlink.com/old-article',
    anchorText: 'industry report',
    type: 'external',
    status: 'broken',
    statusCode: 404,
    issueCount: 1,
    criticalCount: 1,
    warningCount: 0,
  },
  {
    id: 'link-7',
    sourceUrl: buildUrl(MOCK_PAGES.pricing),
    sourcePage: MOCK_PAGES.pricing,
    targetUrl: buildUrl(MOCK_PAGES.contact),
    anchorText: 'Get in touch',
    type: 'internal',
    status: 'active',
    statusCode: 200,
    issueCount: 1,
    criticalCount: 0,
    warningCount: 1,
  },
  {
    id: 'link-8',
    sourceUrl: buildUrl(MOCK_PAGES.blogPost1),
    sourcePage: MOCK_PAGES.blogPost1,
    targetUrl: 'https://www.old-reference.com/stats',
    anchorText: 'statistics show',
    type: 'external',
    status: 'redirect',
    statusCode: 301,
    issueCount: 1,
    criticalCount: 0,
    warningCount: 1,
  },
];

// ============================================================
// LINK DETAIL DATA
// ============================================================
const LINK_DETAILS: Record<string, LinkDetailData> = {
  'link-1': {
    id: 'link-1',
    sourceUrl: buildUrl(MOCK_PAGES.blogPost1),
    sourcePage: MOCK_PAGES.blogPost1,
    targetUrl: buildUrl(MOCK_PAGES.services),
    anchorText: 'our AI services',
    type: 'internal',
    status: 'active',
    statusCode: 200,
    redirectUrl: null,
    noFollow: false,
    noIndex: false,
    position: 'content',
    context: `Learn more about our AI services and how ${MOCK_COMPANY.name} can help your business.`,
    issues: [],
    issueCount: 0,
    criticalCount: 0,
    warningCount: 0,
    metrics: {
      clickThroughRate: 4.2,
      linkEquity: 85,
      relevanceScore: 92,
      authorityScore: 78,
    },
    createdAt: getRecentTimestamp(7),
    lastChecked: getRecentTimestamp(0),
  },
  'link-2': {
    id: 'link-2',
    sourceUrl: buildUrl(MOCK_PAGES.blogPost1),
    sourcePage: MOCK_PAGES.blogPost1,
    targetUrl: 'https://www.oldresource.com/deprecated-page',
    anchorText: 'external resource',
    type: 'external',
    status: 'broken',
    statusCode: 404,
    redirectUrl: null,
    noFollow: true,
    noIndex: false,
    position: 'content',
    context: 'For more information, check this external resource for detailed statistics.',
    issues: [
      {
        type: 'broken_link',
        severity: 'critical',
        message: 'External link returns 404 Not Found',
        fix: 'Remove the broken link or replace with an active alternative source.',
      },
      {
        type: 'link_equity_loss',
        severity: 'warning',
        message: 'Broken links waste crawl budget and hurt user experience',
        fix: 'Find an alternative authoritative source or remove the link entirely.',
      },
    ],
    issueCount: 2,
    criticalCount: 1,
    warningCount: 1,
    metrics: {
      clickThroughRate: 0.1,
      linkEquity: 0,
      relevanceScore: 45,
      authorityScore: 0,
    },
    createdAt: getRecentTimestamp(30),
    lastChecked: getRecentTimestamp(0),
  },
  'link-3': {
    id: 'link-3',
    sourceUrl: buildUrl(MOCK_PAGES.blogPost1),
    sourcePage: MOCK_PAGES.blogPost1,
    targetUrl: buildUrl(MOCK_PAGES.contact),
    anchorText: 'click here',
    type: 'internal',
    status: 'active',
    statusCode: 200,
    redirectUrl: null,
    noFollow: false,
    noIndex: false,
    position: 'content',
    context: 'Ready to get started? Click here to contact our team today.',
    issues: [
      {
        type: 'generic_anchor_text',
        severity: 'warning',
        message: 'Anchor text "click here" is generic and provides no SEO value',
        fix: `Replace with descriptive anchor text like "contact our AI consulting team" to improve relevance and accessibility.`,
      },
      {
        type: 'missing_context',
        severity: 'info',
        message: 'Link could benefit from surrounding contextual keywords',
        fix: 'Add relevant keywords in the surrounding text to strengthen topical relevance.',
      },
    ],
    issueCount: 2,
    criticalCount: 0,
    warningCount: 1,
    metrics: {
      clickThroughRate: 2.8,
      linkEquity: 72,
      relevanceScore: 48,
      authorityScore: 85,
    },
    createdAt: getRecentTimestamp(14),
    lastChecked: getRecentTimestamp(0),
  },
};

/**
 * Get link detail data by ID
 */
export function getMockLinkDetail(linkId: string): LinkDetailData {
  return (
    LINK_DETAILS[linkId] || {
      id: linkId,
      sourceUrl: buildUrl(MOCK_PAGES.home),
      sourcePage: MOCK_PAGES.home,
      targetUrl: buildUrl('/page'),
      anchorText: 'example link',
      type: 'internal' as const,
      status: 'active' as const,
      statusCode: 200,
      redirectUrl: null,
      noFollow: false,
      noIndex: false,
      position: 'content' as const,
      context: 'This is an example link in context.',
      issues: [],
      issueCount: 0,
      criticalCount: 0,
      warningCount: 0,
      metrics: {
        clickThroughRate: 1.5,
        linkEquity: 50,
        relevanceScore: 60,
        authorityScore: 55,
      },
      createdAt: getRecentTimestamp(0),
      lastChecked: getRecentTimestamp(0),
    }
  );
}

