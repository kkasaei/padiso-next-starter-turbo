/**
 * Page Audit Mock Data
 *
 * Mock data for website page audits including SEO, AEO, and content analysis.
 */

import type { WebsiteAuditDto, PageAuditDto } from '@/lib/shcmea/types/dtos/audit-dto';
import type { AuditHistoryEntry } from '@/components/modules/audit';
import { MOCK_COMPANY, MOCK_PAGES, buildUrl, getRecentTimestamp } from './common';

// ============================================================
// TECHNICAL AUDIT GENERATOR
// ============================================================
export function generateMockAudit(
  status: WebsiteAuditDto['status'],
  pagesScanned: number
): WebsiteAuditDto {
  const isCompleted = status === 'COMPLETED';

  return {
    id: 'audit-main-1',
    projectId: 'project-1',
    sitemapUrl: `${MOCK_COMPANY.baseUrl}/sitemap.xml`,
    maxPagesToScan: 50,
    status,
    startedAt: getRecentTimestamp(0),
    completedAt: isCompleted ? getRecentTimestamp(0) : null,
    overallScore: isCompleted ? 68 : null,
    seoScore: isCompleted ? 65 : null,
    performanceScore: isCompleted ? 72 : null,
    accessibilityScore: isCompleted ? 78 : null,
    contentScore: isCompleted ? 68 : null,
    criticalIssues: isCompleted ? 3 : 0,
    warningIssues: isCompleted ? 8 : 0,
    infoIssues: isCompleted ? 12 : 0,
    totalPages: 12,
    pagesDiscovered: 12,
    pagesScanned,
    pagesFailed: 0,
    pagesQueued: 0,
    totalLinks: isCompleted ? 156 : 0,
    brokenLinks: isCompleted ? 3 : 0,
    totalAssets: isCompleted ? 48 : 0,
    assetsWithIssues: isCompleted ? 5 : 0,
    totalCost: isCompleted ? 0.45 : null,
    createdAt: getRecentTimestamp(0),
    updatedAt: getRecentTimestamp(0),
  };
}

// ============================================================
// PAGE AUDIT DATA
// ============================================================
interface MockPageConfig {
  path: string;
  title: string;
  overallScore: number;
  seoScore: number;
  aeoScore: number;
  contentScore: number;
  technicalScore: number;
}

const MOCK_PAGE_CONFIGS: MockPageConfig[] = [
  {
    path: MOCK_PAGES.home,
    title: `${MOCK_COMPANY.name} - AI Automation Agency Sydney`,
    overallScore: 85,
    seoScore: 88,
    aeoScore: 82,
    contentScore: 84,
    technicalScore: 86,
  },
  {
    path: MOCK_PAGES.about,
    title: `About Us - ${MOCK_COMPANY.name}`,
    overallScore: 78,
    seoScore: 80,
    aeoScore: 75,
    contentScore: 79,
    technicalScore: 78,
  },
  {
    path: MOCK_PAGES.services,
    title: `AI Services - ${MOCK_COMPANY.name}`,
    overallScore: 92,
    seoScore: 94,
    aeoScore: 90,
    contentScore: 91,
    technicalScore: 93,
  },
  {
    path: MOCK_PAGES.contact,
    title: `Contact Us - ${MOCK_COMPANY.name}`,
    overallScore: 88,
    seoScore: 90,
    aeoScore: 85,
    contentScore: 88,
    technicalScore: 89,
  },
  {
    path: MOCK_PAGES.blog,
    title: `Blog - ${MOCK_COMPANY.name}`,
    overallScore: 72,
    seoScore: 75,
    aeoScore: 68,
    contentScore: 74,
    technicalScore: 71,
  },
  {
    path: MOCK_PAGES.blogPost1,
    title: 'AI Agency ROI Sydney: How to Measure and Maximize ROI',
    overallScore: 68,
    seoScore: 62,
    aeoScore: 58,
    contentScore: 72,
    technicalScore: 78,
  },
  {
    path: MOCK_PAGES.blogPost2,
    title: 'SEO Trends 2026: What Sydney Businesses Need to Know',
    overallScore: 76,
    seoScore: 78,
    aeoScore: 73,
    contentScore: 77,
    technicalScore: 76,
  },
  {
    path: MOCK_PAGES.pricing,
    title: `Pricing Plans - ${MOCK_COMPANY.name}`,
    overallScore: 94,
    seoScore: 96,
    aeoScore: 92,
    contentScore: 93,
    technicalScore: 95,
  },
  {
    path: MOCK_PAGES.faq,
    title: `FAQ - ${MOCK_COMPANY.name}`,
    overallScore: 89,
    seoScore: 91,
    aeoScore: 87,
    contentScore: 88,
    technicalScore: 90,
  },
  {
    path: MOCK_PAGES.team,
    title: `Our Team - ${MOCK_COMPANY.name}`,
    overallScore: 83,
    seoScore: 85,
    aeoScore: 80,
    contentScore: 84,
    technicalScore: 83,
  },
  {
    path: MOCK_PAGES.careers,
    title: `Careers - ${MOCK_COMPANY.name}`,
    overallScore: 77,
    seoScore: 79,
    aeoScore: 74,
    contentScore: 78,
    technicalScore: 77,
  },
  {
    path: MOCK_PAGES.privacy,
    title: `Privacy Policy - ${MOCK_COMPANY.name}`,
    overallScore: 95,
    seoScore: 97,
    aeoScore: 93,
    contentScore: 94,
    technicalScore: 96,
  },
];

/**
 * Generate mock PageAuditDto array
 */
export function generateMockPages(count: number): PageAuditDto[] {
  return MOCK_PAGE_CONFIGS.slice(0, count).map((config, index) => ({
    id: `page-${index + 1}`,
    auditId: 'audit-main-1',
    url: buildUrl(config.path),
    path: config.path,
    title: config.title,
    overallScore: config.overallScore,
    seoScore: config.seoScore,
    aeoScore: config.aeoScore,
    contentScore: config.contentScore,
    technicalScore: config.technicalScore,
    metadata: null,
    analysis: null,
    issues: null,
    content: null,
    status: 'COMPLETED' as const,
    error: null,
    createdAt: getRecentTimestamp(0),
    discoveredAt: getRecentTimestamp(0),
    discoveredFrom: 'sitemap',
    depth: index === 0 ? 0 : 1,
    scannedAt: getRecentTimestamp(0),
  }));
}

// ============================================================
// AUDIT HISTORY
// ============================================================
export const MOCK_AUDIT_HISTORY: AuditHistoryEntry[] = [
  {
    id: 'history-1',
    startedAt: getRecentTimestamp(0),
    completedAt: getRecentTimestamp(0),
    status: 'COMPLETED',
    pagesScanned: 12,
    criticalIssues: 3,
    warnings: 8,
    duration: 245,
  },
  {
    id: 'history-2',
    startedAt: getRecentTimestamp(7),
    completedAt: getRecentTimestamp(7),
    status: 'COMPLETED',
    pagesScanned: 10,
    criticalIssues: 5,
    warnings: 12,
    duration: 180,
  },
  {
    id: 'history-3',
    startedAt: getRecentTimestamp(14),
    completedAt: null,
    status: 'CANCELLED',
    pagesScanned: 6,
    criticalIssues: 0,
    warnings: 0,
    duration: null,
  },
  {
    id: 'history-4',
    startedAt: getRecentTimestamp(21),
    completedAt: getRecentTimestamp(21),
    status: 'COMPLETED',
    pagesScanned: 15,
    criticalIssues: 2,
    warnings: 6,
    duration: 320,
  },
  {
    id: 'history-5',
    startedAt: getRecentTimestamp(30),
    completedAt: null,
    status: 'FAILED',
    pagesScanned: 3,
    criticalIssues: 0,
    warnings: 0,
    duration: 45,
  },
];

// ============================================================
// PAGE LIST MOCKS (for /audit/pages)
// IDs must match page-detail.ts for linking to work
// ============================================================
export function getMockPageAudits(): PageAuditDto[] {
  return [
    {
      id: 'mock-page-1', // ID must match page-detail.ts
      auditId: 'audit-main-1',
      url: buildUrl(MOCK_PAGES.blogPost1),
      path: MOCK_PAGES.blogPost1,
      title: 'AI Agency ROI Sydney: How to Measure and Maximize ROI',
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
      metadata: null,
      analysis: null,
      issues: null,
      content: null,
    },
    {
      id: 'mock-page-2', // ID must match page-detail.ts
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
      metadata: null,
      analysis: null,
      issues: null,
      content: null,
    },
    {
      id: 'mock-page-3', // ID must match page-detail.ts
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
      metadata: null,
      analysis: null,
      issues: null,
      content: null,
    },
    {
      id: 'mock-page-4', // Pending page (no detail available)
      auditId: 'audit-main-1',
      url: buildUrl(MOCK_PAGES.contact),
      path: MOCK_PAGES.contact,
      title: `Contact Us - ${MOCK_COMPANY.name}`,
      overallScore: null,
      seoScore: null,
      aeoScore: null,
      contentScore: null,
      technicalScore: null,
      status: 'PENDING',
      error: null,
      createdAt: getRecentTimestamp(0),
      discoveredAt: getRecentTimestamp(0),
      discoveredFrom: 'sitemap',
      depth: 0,
      scannedAt: null, // Not scanned yet
      metadata: null,
      analysis: null,
      issues: null,
      content: null,
    },
    {
      id: 'mock-page-5', // Failed page (no detail available)
      auditId: 'audit-main-1',
      url: buildUrl(MOCK_PAGES.services),
      path: MOCK_PAGES.services,
      title: `AI Services - ${MOCK_COMPANY.name}`,
      overallScore: null,
      seoScore: null,
      aeoScore: null,
      contentScore: null,
      technicalScore: null,
      status: 'FAILED',
      error: 'Failed to fetch page: 503 Service Unavailable',
      createdAt: getRecentTimestamp(0),
      discoveredAt: getRecentTimestamp(0),
      discoveredFrom: 'sitemap',
      depth: 0,
      scannedAt: getRecentTimestamp(0), // Attempted to scan but failed
      metadata: null,
      analysis: null,
      issues: null,
      content: null,
    },
  ];
}

