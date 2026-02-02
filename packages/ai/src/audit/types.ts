/**
 * Website Audit AI Types
 *
 * Types for the AI-driven website audit system
 */

import type {
  PageMetadata,
  PageAnalysis,
  PageIssue,
  IssueSeverity,
  IssueType,
} from '../types/audit-dto';

// Re-export DTO types for convenience
export type {
  PageMetadata,
  PageAnalysis,
  PageIssue,
  IssueSeverity,
  IssueType,
};

// ============================================================
// Crawler Types
// ============================================================

export interface SitemapResult {
  success: boolean;
  sitemapUrl: string | null;
  urls: string[];
  errors: string[];
}

export interface RobotsTxtResult {
  success: boolean;
  sitemapUrls: string[];
  disallowedPaths: string[];
  crawlDelay: number | null;
}

export interface PageFetchResult {
  success: boolean;
  url: string;
  html: string | null;
  statusCode: number;
  contentType: string | null;
  error: string | null;
  fetchTimeMs: number;
  redirectedTo: string | null;
}

export interface ExtractedPageData {
  url: string;
  path: string;
  metadata: PageMetadata;
  rawHtml: string;
  textContent: string;
  markdownContent: string;
}

// ============================================================
// AI Analysis Types
// ============================================================

export interface PageAnalysisInput {
  url: string;
  path: string;
  title: string | null;
  description: string | null;
  h1: string | null;
  h2s: string[];
  textContent: string;
  wordCount: number;
  hasStructuredData: boolean;
  structuredDataTypes: string[];
  hasOgTags: boolean;
  hasCanonical: boolean;
  imagesWithoutAlt: number;
  totalImages: number;
  internalLinks: number;
  externalLinks: number;
  brokenLinks: number;
}

export interface AIAnalysisResult {
  success: boolean;
  scores: {
    overall: number;
    seo: number;
    aeo: number;
    content: number;
    technical: number;
  };
  analysis: PageAnalysis;
  issues: PageIssue[];
  cost: number;
  tokensUsed: number;
  error: string | null;
}

// ============================================================
// Orchestrator Types
// ============================================================

export interface AuditConfig {
  projectId: string;
  auditId: string; // Required - audit record must exist
  websiteUrl: string;
  sitemapUrl?: string;
  maxPagesToAudit?: number; // Max pages to discover
  maxPagesToScan?: number; // Max pages to analyze initially
  includeSubdomains?: boolean;
  respectRobotsTxt?: boolean;
  customUserAgent?: string;
}

export interface AuditJobPayload {
  projectId: string;
  auditId: string; // Required - audit record must exist
  websiteUrl: string;
  sitemapUrl?: string;
  maxPagesToAudit?: number; // Max pages to discover
  maxPagesToScan?: number; // Max pages to analyze initially
  organizationId: string;
}

// Payload for scanning additional pages on-demand
export interface ScanMorePagesPayload {
  auditId: string;
  pageAuditIds: string[]; // Specific pages to scan
  organizationId: string;
}

// Result of scanning additional pages
export interface ScanMorePagesResult {
  success: boolean;
  pagesScanned: number;
  pagesFailed: number;
  errors: string[];
}

export interface PageProcessingResult {
  url: string;
  path: string;
  success: boolean;
  scores: {
    overall: number | null;
    seo: number | null;
    aeo: number | null;
    content: number | null;
    technical: number | null;
  } | null;
  issueCount: {
    critical: number;
    warning: number;
    info: number;
  };
  error: string | null;
  processingTimeMs: number;
  cost: number;
}

export interface AuditResult {
  auditId: string;
  projectId: string;
  success: boolean;
  totalPages: number;
  pagesScanned: number;
  pagesFailed: number;
  scores: {
    overall: number;
    seo: number;
    performance: number;
    accessibility: number;
    content: number;
  };
  issues: {
    critical: number;
    warning: number;
    info: number;
  };
  totalCost: number;
  totalTimeMs: number;
  errors: string[];
}

// ============================================================
// Constants
// ============================================================

export const AUDIT_USER_AGENT = 'SearchFit-AuditBot/1.0 (+https://searchfit.io/bot)';

export const DEFAULT_MAX_PAGES = 100;
export const DEFAULT_MAX_PAGES_TO_SCAN = 50; // Initial pages to scan
export const MAX_PAGES_LIMIT = 1000;

export const CRAWL_DELAY_MS = 500; // Delay between page fetches to be respectful
export const PAGE_FETCH_TIMEOUT_MS = 30000; // 30 seconds
export const AI_ANALYSIS_TIMEOUT_MS = 60000; // 60 seconds
export const AI_ANALYSIS_BATCH_SIZE = 3; // Process pages in batches to avoid rate limits

export const SITEMAP_LOCATIONS = [
  '/sitemap.xml',
  '/sitemap_index.xml',
  '/sitemap-index.xml',
  '/sitemaps.xml',
  '/sitemap1.xml',
];

// Score thresholds
export const SCORE_THRESHOLDS = {
  excellent: 80,
  good: 60,
  needsWork: 40,
  poor: 0,
} as const;

// Issue severity weights for score calculation
export const ISSUE_SEVERITY_WEIGHTS = {
  critical: 10,
  warning: 5,
  info: 1,
} as const;

