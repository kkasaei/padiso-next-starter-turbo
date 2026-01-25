/**
 * Performance Audit Mock Data
 *
 * Mock data for page performance metrics including Core Web Vitals.
 */

import { MOCK_COMPANY, MOCK_PAGES, buildUrl, getRecentTimestamp, type AuditIssue } from './common';

// ============================================================
// TYPES
// ============================================================
export interface PerformanceAuditItem {
  id: string;
  url: string;
  path: string;
  title: string;
  performanceScore: number;
  lcp: number; // Largest Contentful Paint in ms
  fid: number; // First Input Delay in ms
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte in ms
  fcp: number; // First Contentful Paint in ms
  device: 'mobile' | 'desktop';
  issueCount: number;
  criticalCount: number;
  warningCount: number;
  lastAuditedAt: string;
}

export interface PerformanceDetailData extends PerformanceAuditItem {
  inp: number; // Interaction to Next Paint
  si: number; // Speed Index
  tbt: number; // Total Blocking Time
  resources: {
    totalRequests: number;
    totalSize: number;
    htmlSize: number;
    cssSize: number;
    jsSize: number;
    imageSize: number;
    fontSize: number;
    otherSize: number;
  };
  issues: AuditIssue[];
}

// ============================================================
// PERFORMANCE LIST DATA
// ============================================================
export const MOCK_PERFORMANCE_LIST: PerformanceAuditItem[] = [
  {
    id: 'perf-1',
    url: buildUrl(MOCK_PAGES.home),
    path: MOCK_PAGES.home,
    title: `${MOCK_COMPANY.name} - AI Automation Agency Sydney`,
    performanceScore: 92,
    lcp: 1800,
    fid: 45,
    cls: 0.05,
    ttfb: 180,
    fcp: 1200,
    device: 'desktop',
    issueCount: 1,
    criticalCount: 0,
    warningCount: 1,
    lastAuditedAt: getRecentTimestamp(0),
  },
  {
    id: 'perf-2',
    url: buildUrl(MOCK_PAGES.home),
    path: MOCK_PAGES.home,
    title: `${MOCK_COMPANY.name} - AI Automation Agency Sydney`,
    performanceScore: 68,
    lcp: 3200,
    fid: 120,
    cls: 0.15,
    ttfb: 350,
    fcp: 2100,
    device: 'mobile',
    issueCount: 4,
    criticalCount: 2,
    warningCount: 2,
    lastAuditedAt: getRecentTimestamp(0),
  },
  {
    id: 'perf-3',
    url: buildUrl(MOCK_PAGES.blogPost1),
    path: MOCK_PAGES.blogPost1,
    title: 'AI Agency ROI Sydney: How to Measure and Maximize ROI',
    performanceScore: 45,
    lcp: 4500,
    fid: 280,
    cls: 0.32,
    ttfb: 520,
    fcp: 3200,
    device: 'mobile',
    issueCount: 6,
    criticalCount: 4,
    warningCount: 2,
    lastAuditedAt: getRecentTimestamp(0),
  },
  {
    id: 'perf-4',
    url: buildUrl(MOCK_PAGES.blogPost1),
    path: MOCK_PAGES.blogPost1,
    title: 'AI Agency ROI Sydney: How to Measure and Maximize ROI',
    performanceScore: 72,
    lcp: 2400,
    fid: 85,
    cls: 0.12,
    ttfb: 280,
    fcp: 1800,
    device: 'desktop',
    issueCount: 3,
    criticalCount: 1,
    warningCount: 2,
    lastAuditedAt: getRecentTimestamp(0),
  },
  {
    id: 'perf-5',
    url: buildUrl(MOCK_PAGES.services),
    path: MOCK_PAGES.services,
    title: `AI Services - ${MOCK_COMPANY.name}`,
    performanceScore: 88,
    lcp: 2000,
    fid: 55,
    cls: 0.08,
    ttfb: 200,
    fcp: 1400,
    device: 'desktop',
    issueCount: 2,
    criticalCount: 0,
    warningCount: 2,
    lastAuditedAt: getRecentTimestamp(0),
  },
  {
    id: 'perf-6',
    url: buildUrl(MOCK_PAGES.services),
    path: MOCK_PAGES.services,
    title: `AI Services - ${MOCK_COMPANY.name}`,
    performanceScore: 62,
    lcp: 3800,
    fid: 150,
    cls: 0.18,
    ttfb: 380,
    fcp: 2400,
    device: 'mobile',
    issueCount: 5,
    criticalCount: 2,
    warningCount: 3,
    lastAuditedAt: getRecentTimestamp(0),
  },
  {
    id: 'perf-7',
    url: buildUrl(MOCK_PAGES.about),
    path: MOCK_PAGES.about,
    title: `About Us - ${MOCK_COMPANY.name}`,
    performanceScore: 95,
    lcp: 1500,
    fid: 35,
    cls: 0.02,
    ttfb: 150,
    fcp: 1000,
    device: 'desktop',
    issueCount: 0,
    criticalCount: 0,
    warningCount: 0,
    lastAuditedAt: getRecentTimestamp(0),
  },
  {
    id: 'perf-8',
    url: buildUrl(MOCK_PAGES.contact),
    path: MOCK_PAGES.contact,
    title: `Contact Us - ${MOCK_COMPANY.name}`,
    performanceScore: 78,
    lcp: 2600,
    fid: 95,
    cls: 0.10,
    ttfb: 220,
    fcp: 1600,
    device: 'mobile',
    issueCount: 3,
    criticalCount: 1,
    warningCount: 2,
    lastAuditedAt: getRecentTimestamp(0),
  },
];

// ============================================================
// PERFORMANCE DETAIL DATA
// ============================================================
const PERFORMANCE_DETAILS: Record<string, PerformanceDetailData> = {
  'perf-1': {
    id: 'perf-1',
    url: buildUrl(MOCK_PAGES.home),
    path: MOCK_PAGES.home,
    title: `${MOCK_COMPANY.name} - AI Automation Agency Sydney`,
    device: 'desktop',
    performanceScore: 92,
    lcp: 1800,
    fid: 45,
    cls: 0.05,
    inp: 120,
    ttfb: 180,
    fcp: 1200,
    si: 1500,
    tbt: 150,
    resources: {
      totalRequests: 45,
      totalSize: 1250000,
      htmlSize: 45000,
      cssSize: 120000,
      jsSize: 450000,
      imageSize: 580000,
      fontSize: 35000,
      otherSize: 20000,
    },
    issues: [
      {
        type: 'render_blocking',
        severity: 'warning',
        message: 'Eliminate render-blocking resources',
        fix: 'Consider inlining critical CSS and deferring non-critical JavaScript',
        savings: '~200ms',
      },
    ],
    issueCount: 1,
    criticalCount: 0,
    warningCount: 1,
    lastAuditedAt: getRecentTimestamp(0),
  },
  'perf-3': {
    id: 'perf-3',
    url: buildUrl(MOCK_PAGES.blogPost1),
    path: MOCK_PAGES.blogPost1,
    title: 'AI Agency ROI Sydney: How to Measure and Maximize ROI',
    device: 'mobile',
    performanceScore: 45,
    lcp: 4500,
    fid: 280,
    cls: 0.32,
    inp: 450,
    ttfb: 520,
    fcp: 3200,
    si: 4800,
    tbt: 1200,
    resources: {
      totalRequests: 85,
      totalSize: 5200000,
      htmlSize: 120000,
      cssSize: 350000,
      jsSize: 1800000,
      imageSize: 2800000,
      fontSize: 85000,
      otherSize: 45000,
    },
    issues: [
      {
        type: 'large_lcp',
        severity: 'critical',
        message: 'Largest Contentful Paint element took 4.5s to render',
        fix: 'Optimize the hero image (2.8MB) by compressing and using WebP format. Consider lazy loading below-fold images.',
        savings: '~2.0s',
      },
      {
        type: 'layout_shift',
        severity: 'critical',
        message: 'Cumulative Layout Shift (0.32) exceeds acceptable threshold (0.1)',
        fix: 'Add explicit width and height attributes to images and ads. Reserve space for dynamic content.',
        savings: 'CLS reduced to ~0.05',
      },
      {
        type: 'excessive_js',
        severity: 'critical',
        message: 'JavaScript execution time is excessive (1.8MB of JS)',
        fix: 'Remove unused JavaScript, code-split large bundles, and defer non-critical scripts.',
        savings: '~1.5s',
      },
      {
        type: 'unoptimized_images',
        severity: 'critical',
        message: 'Serve images in next-gen formats',
        fix: 'Convert JPEG/PNG images to WebP or AVIF format for 25-50% smaller file sizes.',
        savings: '~1.4MB',
      },
      {
        type: 'slow_ttfb',
        severity: 'warning',
        message: 'Server response time (520ms) is above recommended 200ms',
        fix: 'Enable server caching, use a CDN, or optimize database queries.',
        savings: '~300ms',
      },
      {
        type: 'render_blocking',
        severity: 'warning',
        message: 'Multiple render-blocking CSS files detected',
        fix: 'Inline critical CSS and load non-critical styles asynchronously.',
        savings: '~400ms',
      },
    ],
    issueCount: 6,
    criticalCount: 4,
    warningCount: 2,
    lastAuditedAt: getRecentTimestamp(0),
  },
  'perf-7': {
    id: 'perf-7',
    url: buildUrl(MOCK_PAGES.about),
    path: MOCK_PAGES.about,
    title: `About Us - ${MOCK_COMPANY.name}`,
    device: 'desktop',
    performanceScore: 95,
    lcp: 1500,
    fid: 35,
    cls: 0.02,
    inp: 80,
    ttfb: 150,
    fcp: 1000,
    si: 1200,
    tbt: 80,
    resources: {
      totalRequests: 32,
      totalSize: 850000,
      htmlSize: 35000,
      cssSize: 95000,
      jsSize: 320000,
      imageSize: 350000,
      fontSize: 35000,
      otherSize: 15000,
    },
    issues: [],
    issueCount: 0,
    criticalCount: 0,
    warningCount: 0,
    lastAuditedAt: getRecentTimestamp(0),
  },
};

/**
 * Get performance detail data by ID (single device)
 */
export function getMockPerformanceDetail(pageId: string): PerformanceDetailData {
  return (
    PERFORMANCE_DETAILS[pageId] || {
      id: pageId,
      url: buildUrl('/page'),
      path: '/page',
      title: 'Page',
      device: 'desktop' as const,
      performanceScore: 75,
      lcp: 2200,
      fid: 80,
      cls: 0.08,
      inp: 150,
      ttfb: 250,
      fcp: 1500,
      si: 2000,
      tbt: 200,
      resources: {
        totalRequests: 50,
        totalSize: 1500000,
        htmlSize: 50000,
        cssSize: 150000,
        jsSize: 500000,
        imageSize: 700000,
        fontSize: 50000,
        otherSize: 50000,
      },
      issues: [
        {
          type: 'generic',
          severity: 'warning' as const,
          message: 'Page could be optimized further',
          fix: 'Run a full Lighthouse audit for detailed recommendations',
        },
      ],
      issueCount: 1,
      criticalCount: 0,
      warningCount: 1,
      lastAuditedAt: getRecentTimestamp(0),
    }
  );
}

/**
 * Get performance detail data for both mobile and desktop
 */
export function getMockPerformanceDetailByDevice(
  pageId: string
): { desktop: PerformanceDetailData; mobile: PerformanceDetailData } {
  const baseData = getMockPerformanceDetail(pageId);
  
  // Generate desktop version (better scores)
  const desktop: PerformanceDetailData = {
    ...baseData,
    device: 'desktop',
    performanceScore: Math.min(100, baseData.performanceScore + 15),
    lcp: Math.round(baseData.lcp * 0.7),
    fid: Math.round(baseData.fid * 0.6),
    cls: parseFloat((baseData.cls * 0.6).toFixed(2)),
    inp: Math.round((baseData.inp || 150) * 0.6),
    ttfb: Math.round(baseData.ttfb * 0.8),
    fcp: Math.round(baseData.fcp * 0.7),
    si: Math.round((baseData.si || 2000) * 0.7),
    tbt: Math.round((baseData.tbt || 200) * 0.6),
  };

  // Generate mobile version (worse scores)
  const mobile: PerformanceDetailData = {
    ...baseData,
    device: 'mobile',
    performanceScore: Math.max(20, baseData.performanceScore - 15),
    lcp: Math.round(baseData.lcp * 1.4),
    fid: Math.round(baseData.fid * 1.6),
    cls: parseFloat((baseData.cls * 1.5).toFixed(2)),
    inp: Math.round((baseData.inp || 150) * 1.5),
    ttfb: Math.round(baseData.ttfb * 1.3),
    fcp: Math.round(baseData.fcp * 1.4),
    si: Math.round((baseData.si || 2000) * 1.4),
    tbt: Math.round((baseData.tbt || 200) * 1.8),
    issues: [
      ...baseData.issues,
      {
        type: 'mobile_optimization',
        severity: 'warning' as const,
        message: 'Page is not fully optimized for mobile devices',
        fix: 'Ensure touch targets are at least 48x48px and text is readable without zooming',
      },
    ],
    issueCount: baseData.issueCount + 1,
    warningCount: baseData.warningCount + 1,
  };

  return { desktop, mobile };
}

