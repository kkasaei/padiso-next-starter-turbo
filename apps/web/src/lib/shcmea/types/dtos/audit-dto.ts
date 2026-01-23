/**
 * Website Audit DTOs
 *
 * Data Transfer Objects for website audit functionality
 */

// Audit status enum (mirrors database enum)
export type AuditStatus = 'PENDING' | 'DISCOVERING' | 'SCANNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'

// Page audit status enum (mirrors database enum)
export type PageAuditStatus = 'PENDING' | 'QUEUED' | 'SCANNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED'

// Link type enum (mirrors database enum)
export type LinkType = 'INTERNAL' | 'EXTERNAL' | 'RESOURCE' | 'ANCHOR' | 'MAILTO' | 'TEL' | 'JAVASCRIPT' | 'OTHER'

// Link status enum (mirrors database enum)
export type LinkStatus = 'OK' | 'BROKEN' | 'REDIRECT' | 'TIMEOUT' | 'ERROR' | 'UNCHECKED'

// Asset type enum (mirrors database enum)
export type AssetType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FONT' | 'SCRIPT' | 'STYLESHEET' | 'OTHER'

// Device type enum (mirrors database enum)
export type DeviceType = 'DESKTOP' | 'MOBILE'

// ============================================================
// Page Metadata (extracted from HTML)
// ============================================================

export interface PageMetadata {
  title: string | null;
  description: string | null;
  h1: string | null;
  h2s: string[];
  canonicalUrl: string | null;
  ogImage: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  robots: string | null;
  viewport: string | null;
  charset: string | null;
  language: string | null;
  structuredData: StructuredDataItem[];
  wordCount: number;
  images: ImageInfo[];
  links: LinkInfo[];
}

export interface StructuredDataItem {
  type: string;
  data: Record<string, unknown>;
}

export interface ImageInfo {
  src: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  loading: string | null;
}

export interface LinkInfo {
  href: string;
  text: string;
  isInternal: boolean;
  isNofollow: boolean;
  isBroken?: boolean;
}

// ============================================================
// AI Analysis Results
// ============================================================

export interface PageAnalysis {
  strengths: AnalysisItem[];
  issues: AnalysisItem[];
  recommendations: AnalysisItem[];
  aeoReadiness: AEOReadiness;
  contentQuality: ContentQuality;
}

export interface AnalysisItem {
  title: string;
  description: string;
  impact?: 'high' | 'medium' | 'low';
}

export interface AEOReadiness {
  score: number; // 0-100
  status: 'excellent' | 'good' | 'needs-improvement' | 'poor';
  factors: {
    structuredData: number;
    contentClarity: number;
    answerability: number;
    semanticMarkup: number;
  };
}

export interface ContentQuality {
  readabilityScore: number;
  uniquenessIndicator: 'high' | 'medium' | 'low';
  topicRelevance: number;
  keywordOptimization: number;
}

// ============================================================
// Audit Issues (common)
// ============================================================

export type IssueSeverity = 'critical' | 'warning' | 'info';

export type IssueType =
  // Page issues
  | 'missing_title'
  | 'missing_description'
  | 'missing_h1'
  | 'multiple_h1'
  | 'missing_alt_text'
  | 'broken_link'
  | 'missing_canonical'
  | 'missing_og_tags'
  | 'missing_structured_data'
  | 'duplicate_content'
  | 'thin_content'
  | 'thin_content_sections'
  | 'slow_loading'
  | 'mobile_unfriendly'
  | 'missing_viewport'
  | 'blocked_by_robots'
  | 'redirect_chain'
  | 'mixed_content'
  | 'missing_lang'
  // Link issues
  | 'link_equity_loss'
  | 'generic_anchor_text'
  | 'missing_context'
  // Asset issues
  | 'poor_alt_text'
  | 'oversized_file'
  | 'wrong_format'
  | 'poor_filename'
  | 'oversized_dimensions'
  | 'not_responsive'
  // Performance issues
  | 'large_lcp'
  | 'layout_shift'
  | 'excessive_js'
  | 'unoptimized_images'
  | 'slow_ttfb'
  | 'render_blocking'
  | 'mobile_optimization'
  | 'generic'
  | 'other';

export interface AuditIssue {
  type: IssueType | string;
  severity: IssueSeverity;
  message: string;
  fix: string;
  element?: string;
  savings?: string;
}

// Alias for backwards compatibility
export type PageIssue = AuditIssue;

// ============================================================
// Website Audit DTOs
// ============================================================

export interface WebsiteAuditDto {
  id: string;
  projectId: string;
  sitemapUrl: string | null;
  maxPagesToScan: number;
  status: AuditStatus;
  startedAt: string | null;
  completedAt: string | null;
  // Scores
  overallScore: number | null;
  seoScore: number | null;
  performanceScore: number | null;
  accessibilityScore: number | null;
  contentScore: number | null;
  // Issue counts
  criticalIssues: number;
  warningIssues: number;
  infoIssues: number;
  // Page counts
  totalPages: number;
  pagesDiscovered: number;
  pagesScanned: number;
  pagesFailed: number;
  pagesQueued: number;
  // Link/Asset counts
  totalLinks: number;
  brokenLinks: number;
  totalAssets: number;
  assetsWithIssues: number;
  // Cost
  totalCost: number | null;
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Page Audit DTOs
// ============================================================

export interface PageAuditDto {
  id: string;
  auditId: string;
  url: string;
  path: string;
  title: string | null;
  // Discovery info
  discoveredAt: string;
  discoveredFrom: 'sitemap' | 'crawl' | 'manual' | null;
  depth: number;
  // Scores (null if not scanned)
  overallScore: number | null;
  seoScore: number | null;
  aeoScore: number | null;
  contentScore: number | null;
  technicalScore: number | null;
  // Data (null if not scanned)
  metadata: PageMetadata | null;
  analysis: PageAnalysis | null;
  issues: AuditIssue[] | null;
  // Page content (markdown format, null if not scanned)
  content: string | null;
  // Status
  status: PageAuditStatus;
  error: string | null;
  scannedAt: string | null;
  createdAt: string;
}

export interface WebsiteAuditWithPagesDto extends WebsiteAuditDto {
  pageAudits: PageAuditDto[];
}

// ============================================================
// Link Audit DTOs
// ============================================================

export interface LinkAuditDto {
  id: string;
  auditId: string;
  pageAuditId: string;
  // Link info
  sourceUrl: string;
  sourcePath: string;
  targetUrl: string;
  anchorText: string;
  // Classification
  type: LinkType;
  status: LinkStatus;
  statusCode: number | null;
  redirectUrl: string | null;
  // Attributes
  noFollow: boolean;
  noIndex: boolean;
  position: 'header' | 'content' | 'footer' | 'sidebar' | 'navigation' | null;
  context: string | null;
  // Issue counts (computed)
  issueCount: number;
  criticalCount: number;
  warningCount: number;
  // Timestamps
  lastChecked: string;
  createdAt: string;
}

export interface LinkAuditDetailDto extends LinkAuditDto {
  issues: AuditIssue[];
  metrics: {
    clickThroughRate: number | null;
    linkEquity: number;
    relevanceScore: number;
    authorityScore: number;
  };
}

// ============================================================
// Asset Audit DTOs
// ============================================================

export interface AssetAuditDto {
  id: string;
  auditId: string;
  pageAuditId: string;
  // Asset info
  url: string;
  fileName: string;
  pageUrl: string;
  pagePath: string;
  // Classification
  type: AssetType;
  format: string;
  // Image metadata
  altText: string | null;
  title: string | null;
  width: number | null;
  height: number | null;
  // Performance attributes
  fileSize: number;
  hasAltText: boolean;
  isLazyLoaded: boolean;
  isResponsive: boolean;
  hasWebP: boolean;
  isCompressed: boolean;
  // Issue counts (computed)
  issueCount: number;
  criticalCount: number;
  warningCount: number;
  // Timestamps
  createdAt: string;
}

export interface AssetAuditDetailDto extends AssetAuditDto {
  loading: 'lazy' | 'eager' | null;
  decoding: 'async' | 'sync' | 'auto' | null;
  srcset: string | null;
  issues: AuditIssue[];
  metrics: {
    performanceImpact: number;
    seoScore: number;
    accessibilityScore: number;
    aeoReadiness: number;
  };
}

// ============================================================
// Performance Audit DTOs
// ============================================================

export interface PerformanceAuditDto {
  id: string;
  auditId: string;
  pageAuditId: string;
  // Page info
  url: string;
  path: string;
  title?: string;
  device: DeviceType;
  // Overall score
  performanceScore: number;
  // Core Web Vitals
  lcp: number; // Largest Contentful Paint (ms)
  fid: number; // First Input Delay (ms)
  cls: number; // Cumulative Layout Shift
  inp: number; // Interaction to Next Paint (ms)
  ttfb: number; // Time to First Byte (ms)
  fcp: number; // First Contentful Paint (ms)
  si: number; // Speed Index
  tbt: number; // Total Blocking Time (ms)
  // Issue counts (computed)
  issueCount: number;
  criticalCount: number;
  warningCount: number;
  // Timestamps
  createdAt: string;
}

export interface PerformanceAuditDetailDto extends PerformanceAuditDto {
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
// Audit Summary (for dashboard)
// ============================================================

export interface AuditSummary {
  audit: WebsiteAuditDto;
  topIssues: AuditIssue[];
  worstPages: PageAuditDto[];
  bestPages: PageAuditDto[];
  issuesByType: Record<string, number>;
  scoreDistribution: {
    excellent: number; // 80-100
    good: number; // 60-79
    needsWork: number; // 40-59
    poor: number; // 0-39
  };
}

// ============================================================
// Audit Progress (for real-time updates)
// ============================================================

export interface AuditProgress {
  auditId: string;
  status: AuditStatus;
  phase: 'discovering' | 'scanning' | 'completed';
  totalPages: number;
  pagesDiscovered: number;
  pagesScanned: number;
  pagesQueued: number;
  currentPage: string | null;
  estimatedTimeRemaining: number | null; // seconds
  errors: string[];
}

// ============================================================
// Audit History (for ClickHouse trends)
// ============================================================

export interface AuditHistoryItem {
  scanDate: string;
  overallScore: number;
  seoScore: number;
  performanceScore: number;
  accessibilityScore: number;
  contentScore: number;
  criticalIssues: number;
  warningIssues: number;
  totalPages: number;
  pagesScanned: number;
}

export interface LinkAuditHistoryItem {
  scanDate: string;
  totalLinks: number;
  internalLinks: number;
  externalLinks: number;
  brokenLinks: number;
  redirectLinks: number;
  linkHealthScore: number;
}

export interface AssetAuditHistoryItem {
  scanDate: string;
  totalAssets: number;
  assetsWithAltText: number;
  assetsLazyLoaded: number;
  assetsWithIssues: number;
  totalSizeBytes: number;
  potentialSavingsBytes: number;
  assetOptimizationScore: number;
}

export interface PerformanceHistoryItem {
  scanDate: string;
  url: string;
  device: DeviceType;
  performanceScore: number;
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
}

