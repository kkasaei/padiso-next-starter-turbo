/**
 * Common Types and Constants for Audit Mocks
 *
 * All mocks use a consistent fictional company: PADISO (padiso.co)
 * This ensures consistency across all audit mock data.
 */

// ============================================================
// COMMON COMPANY DATA
// ============================================================
export const MOCK_COMPANY = {
  name: 'PADISO',
  domain: 'padiso.co',
  baseUrl: 'https://www.padiso.co',
  industry: 'AI Solutions',
  founder: 'Kevin Kasaei',
} as const;

// ============================================================
// COMMON PAGE PATHS
// ============================================================
export const MOCK_PAGES = {
  home: '/',
  about: '/about',
  services: '/services',
  contact: '/contact',
  pricing: '/pricing',
  blog: '/blog',
  blogPost1: '/blog/ai-agency-roi-sydney-2026',
  blogPost2: '/blog/seo-trends-2026',
  team: '/team',
  careers: '/careers',
  privacy: '/privacy',
  faq: '/faq',
} as const;

// ============================================================
// COMMON ISSUE SEVERITIES
// ============================================================
export type IssueSeverity = 'critical' | 'warning' | 'info';

export interface AuditIssue {
  type: string;
  severity: IssueSeverity;
  message: string;
  fix: string;
  savings?: string;
}

// ============================================================
// COMMON SCORE HELPERS
// ============================================================
export function getRandomScore(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getScoreStatus(score: number): 'good' | 'needs-work' | 'poor' {
  if (score >= 90) return 'good';
  if (score >= 50) return 'needs-work';
  return 'poor';
}

// ============================================================
// TIMESTAMP HELPERS
// ============================================================
export function getRecentTimestamp(daysAgo: number = 0): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

// ============================================================
// URL BUILDER HELPER
// ============================================================
export function buildUrl(path: string): string {
  return `${MOCK_COMPANY.baseUrl}${path}`;
}

