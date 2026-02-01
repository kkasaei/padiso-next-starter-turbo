/**
 * Asset Audit Mock Data
 *
 * Mock data for image, video, and media asset audits.
 */

import { MOCK_COMPANY, MOCK_PAGES, buildUrl, getRecentTimestamp, type AuditIssue } from './common';

// ============================================================
// TYPES
// ============================================================
export interface AssetAuditItem {
  id: string;
  url: string;
  fileName: string;
  pageUrl: string;
  pagePath: string;
  type: 'image' | 'video' | 'svg' | 'gif' | 'other';
  format: string;
  altText: string | null;
  width: number | null;
  height: number | null;
  fileSize: number; // in bytes
  hasAltText: boolean;
  isLazyLoaded: boolean;
  isResponsive: boolean;
  issueCount: number;
  criticalCount: number;
  warningCount: number;
}

export interface AssetDetailData extends AssetAuditItem {
  title: string | null;
  caption: string | null;
  hasWebP: boolean;
  isCompressed: boolean;
  hasStructuredData: boolean;
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
  createdAt: string;
  lastChecked: string;
}

// ============================================================
// ASSET LIST DATA
// ============================================================
export const MOCK_ASSETS_LIST: AssetAuditItem[] = [
  {
    id: 'asset-1',
    url: `${MOCK_COMPANY.baseUrl}/images/hero-banner.webp`,
    fileName: 'hero-banner.webp',
    pageUrl: buildUrl(MOCK_PAGES.home),
    pagePath: MOCK_PAGES.home,
    type: 'image',
    format: 'webp',
    altText: `${MOCK_COMPANY.name} - Transform your business with artificial intelligence`,
    width: 1920,
    height: 1080,
    fileSize: 245000,
    hasAltText: true,
    isLazyLoaded: false,
    isResponsive: true,
    issueCount: 0,
    criticalCount: 0,
    warningCount: 0,
  },
  {
    id: 'asset-2',
    url: `${MOCK_COMPANY.baseUrl}/images/team-photo.jpg`,
    fileName: 'team-photo.jpg',
    pageUrl: buildUrl(MOCK_PAGES.about),
    pagePath: MOCK_PAGES.about,
    type: 'image',
    format: 'jpg',
    altText: null,
    width: 1200,
    height: 800,
    fileSize: 520000,
    hasAltText: false,
    isLazyLoaded: true,
    isResponsive: false,
    issueCount: 2,
    criticalCount: 1,
    warningCount: 1,
  },
  {
    id: 'asset-3',
    url: `${MOCK_COMPANY.baseUrl}/images/ai-diagram.svg`,
    fileName: 'ai-diagram.svg',
    pageUrl: buildUrl(MOCK_PAGES.services),
    pagePath: MOCK_PAGES.services,
    type: 'svg',
    format: 'svg',
    altText: 'AI workflow diagram showing automation process',
    width: null,
    height: null,
    fileSize: 12000,
    hasAltText: true,
    isLazyLoaded: false,
    isResponsive: true,
    issueCount: 0,
    criticalCount: 0,
    warningCount: 0,
  },
  {
    id: 'asset-4',
    url: `${MOCK_COMPANY.baseUrl}/blog/ai-roi/feature-image.png`,
    fileName: 'feature-image.png',
    pageUrl: buildUrl(MOCK_PAGES.blogPost1),
    pagePath: MOCK_PAGES.blogPost1,
    type: 'image',
    format: 'png',
    altText: '',
    width: 1600,
    height: 900,
    fileSize: 1250000,
    hasAltText: false,
    isLazyLoaded: true,
    isResponsive: false,
    issueCount: 3,
    criticalCount: 1,
    warningCount: 2,
  },
  {
    id: 'asset-5',
    url: `${MOCK_COMPANY.baseUrl}/videos/demo.mp4`,
    fileName: 'demo.mp4',
    pageUrl: buildUrl(MOCK_PAGES.services),
    pagePath: MOCK_PAGES.services,
    type: 'video',
    format: 'mp4',
    altText: null,
    width: 1920,
    height: 1080,
    fileSize: 15000000,
    hasAltText: false,
    isLazyLoaded: true,
    isResponsive: false,
    issueCount: 2,
    criticalCount: 0,
    warningCount: 2,
  },
  {
    id: 'asset-6',
    url: `${MOCK_COMPANY.baseUrl}/images/icon-ai.gif`,
    fileName: 'icon-ai.gif',
    pageUrl: buildUrl(MOCK_PAGES.home),
    pagePath: MOCK_PAGES.home,
    type: 'gif',
    format: 'gif',
    altText: 'AI animation icon',
    width: 120,
    height: 120,
    fileSize: 85000,
    hasAltText: true,
    isLazyLoaded: false,
    isResponsive: false,
    issueCount: 1,
    criticalCount: 0,
    warningCount: 1,
  },
  {
    id: 'asset-7',
    url: `${MOCK_COMPANY.baseUrl}/blog/seo-trends/chart.png`,
    fileName: 'chart.png',
    pageUrl: buildUrl(MOCK_PAGES.blogPost2),
    pagePath: MOCK_PAGES.blogPost2,
    type: 'image',
    format: 'png',
    altText: 'SEO trends chart showing growth in AI-powered search',
    width: 800,
    height: 600,
    fileSize: 180000,
    hasAltText: true,
    isLazyLoaded: true,
    isResponsive: true,
    issueCount: 0,
    criticalCount: 0,
    warningCount: 0,
  },
  {
    id: 'asset-8',
    url: `${MOCK_COMPANY.baseUrl}/images/DSC_0001.jpg`,
    fileName: 'DSC_0001.jpg',
    pageUrl: buildUrl(MOCK_PAGES.about),
    pagePath: MOCK_PAGES.about,
    type: 'image',
    format: 'jpg',
    altText: 'Image',
    width: 4000,
    height: 3000,
    fileSize: 3500000,
    hasAltText: true,
    isLazyLoaded: false,
    isResponsive: false,
    issueCount: 4,
    criticalCount: 2,
    warningCount: 2,
  },
];

// ============================================================
// ASSET DETAIL DATA
// ============================================================
const ASSET_DETAILS: Record<string, AssetDetailData> = {
  'asset-1': {
    id: 'asset-1',
    url: `${MOCK_COMPANY.baseUrl}/images/hero-banner.webp`,
    fileName: 'hero-banner.webp',
    pageUrl: buildUrl(MOCK_PAGES.home),
    pagePath: MOCK_PAGES.home,
    type: 'image',
    format: 'webp',
    altText: `${MOCK_COMPANY.name} - Transform your business with artificial intelligence`,
    title: `${MOCK_COMPANY.name} Hero Banner`,
    caption: null,
    width: 1920,
    height: 1080,
    fileSize: 245000,
    hasAltText: true,
    isLazyLoaded: false,
    isResponsive: true,
    hasWebP: true,
    isCompressed: true,
    hasStructuredData: false,
    loading: 'eager',
    decoding: 'async',
    srcset: '320w, 640w, 1024w, 1920w',
    issues: [],
    issueCount: 0,
    criticalCount: 0,
    warningCount: 0,
    metrics: {
      performanceImpact: 92,
      seoScore: 95,
      accessibilityScore: 100,
      aeoReadiness: 88,
    },
    createdAt: getRecentTimestamp(30),
    lastChecked: getRecentTimestamp(0),
  },
  'asset-2': {
    id: 'asset-2',
    url: `${MOCK_COMPANY.baseUrl}/images/team-photo.jpg`,
    fileName: 'team-photo.jpg',
    pageUrl: buildUrl(MOCK_PAGES.about),
    pagePath: MOCK_PAGES.about,
    type: 'image',
    format: 'jpg',
    altText: null,
    title: null,
    caption: null,
    width: 1200,
    height: 800,
    fileSize: 520000,
    hasAltText: false,
    isLazyLoaded: true,
    isResponsive: false,
    hasWebP: false,
    isCompressed: false,
    hasStructuredData: false,
    loading: 'lazy',
    decoding: null,
    srcset: null,
    issues: [
      {
        type: 'missing_alt_text',
        severity: 'critical',
        message: 'Image is missing alt text, making it inaccessible and invisible to search engines',
        fix: `Add descriptive alt text that explains the image content, e.g., "${MOCK_COMPANY.name} team members collaborating in the Sydney office"`,
      },
      {
        type: 'not_responsive',
        severity: 'warning',
        message: 'Image lacks srcset attribute for responsive delivery',
        fix: 'Add srcset with multiple image sizes to serve appropriate sizes on different devices',
      },
    ],
    issueCount: 2,
    criticalCount: 1,
    warningCount: 1,
    metrics: {
      performanceImpact: 45,
      seoScore: 25,
      accessibilityScore: 0,
      aeoReadiness: 20,
    },
    createdAt: getRecentTimestamp(60),
    lastChecked: getRecentTimestamp(0),
  },
  'asset-4': {
    id: 'asset-4',
    url: `${MOCK_COMPANY.baseUrl}/blog/ai-roi/feature-image.png`,
    fileName: 'feature-image.png',
    pageUrl: buildUrl(MOCK_PAGES.blogPost1),
    pagePath: MOCK_PAGES.blogPost1,
    type: 'image',
    format: 'png',
    altText: '',
    title: null,
    caption: null,
    width: 1600,
    height: 900,
    fileSize: 1250000,
    hasAltText: false,
    isLazyLoaded: true,
    isResponsive: false,
    hasWebP: false,
    isCompressed: false,
    hasStructuredData: false,
    loading: 'lazy',
    decoding: null,
    srcset: null,
    issues: [
      {
        type: 'missing_alt_text',
        severity: 'critical',
        message: 'Image has empty alt text attribute, which provides no value for accessibility or SEO',
        fix: 'Add meaningful alt text that describes the image, e.g., "Chart showing AI agency ROI metrics for Sydney businesses in 2026"',
      },
      {
        type: 'oversized_file',
        severity: 'warning',
        message: 'Image file size (1.2 MB) exceeds recommended maximum (500 KB), impacting page load performance',
        fix: 'Compress the image using tools like TinyPNG or convert to WebP format to reduce file size by up to 70%',
      },
      {
        type: 'wrong_format',
        severity: 'warning',
        message: 'PNG format is not optimal for photographic images, use WebP or JPEG instead',
        fix: 'Convert to WebP format for better compression while maintaining quality',
      },
    ],
    issueCount: 3,
    criticalCount: 1,
    warningCount: 2,
    metrics: {
      performanceImpact: 25,
      seoScore: 30,
      accessibilityScore: 10,
      aeoReadiness: 15,
    },
    createdAt: getRecentTimestamp(14),
    lastChecked: getRecentTimestamp(0),
  },
  'asset-8': {
    id: 'asset-8',
    url: `${MOCK_COMPANY.baseUrl}/images/DSC_0001.jpg`,
    fileName: 'DSC_0001.jpg',
    pageUrl: buildUrl(MOCK_PAGES.about),
    pagePath: MOCK_PAGES.about,
    type: 'image',
    format: 'jpg',
    altText: 'Image',
    title: null,
    caption: null,
    width: 4000,
    height: 3000,
    fileSize: 3500000,
    hasAltText: true,
    isLazyLoaded: false,
    isResponsive: false,
    hasWebP: false,
    isCompressed: false,
    hasStructuredData: false,
    loading: null,
    decoding: null,
    srcset: null,
    issues: [
      {
        type: 'poor_alt_text',
        severity: 'critical',
        message: 'Alt text "Image" is generic and provides no meaningful description',
        fix: 'Replace with descriptive text that explains the image content and context',
      },
      {
        type: 'oversized_file',
        severity: 'critical',
        message: 'Image file size (3.5 MB) is extremely large, severely impacting page performance',
        fix: 'Resize to appropriate dimensions and compress. Target under 500 KB for web images.',
      },
      {
        type: 'poor_filename',
        severity: 'warning',
        message: 'Filename "DSC_0001.jpg" is not descriptive and provides no SEO value',
        fix: 'Rename to a descriptive filename like "sydney-office-team-meeting.jpg"',
      },
      {
        type: 'oversized_dimensions',
        severity: 'warning',
        message: 'Image dimensions (4000x3000) are larger than needed for web display',
        fix: 'Resize to maximum display size needed (typically 1920px wide for full-width images)',
      },
    ],
    issueCount: 4,
    criticalCount: 2,
    warningCount: 2,
    metrics: {
      performanceImpact: 10,
      seoScore: 15,
      accessibilityScore: 20,
      aeoReadiness: 10,
    },
    createdAt: getRecentTimestamp(45),
    lastChecked: getRecentTimestamp(0),
  },
};

/**
 * Get asset detail data by ID
 */
export function getMockAssetDetail(assetId: string): AssetDetailData {
  return (
    ASSET_DETAILS[assetId] || {
      id: assetId,
      url: `${MOCK_COMPANY.baseUrl}/images/default.jpg`,
      fileName: 'default.jpg',
      pageUrl: buildUrl(MOCK_PAGES.home),
      pagePath: MOCK_PAGES.home,
      type: 'image' as const,
      format: 'jpg',
      altText: 'Default image',
      title: null,
      caption: null,
      width: 800,
      height: 600,
      fileSize: 150000,
      hasAltText: true,
      isLazyLoaded: true,
      isResponsive: false,
      hasWebP: false,
      isCompressed: true,
      hasStructuredData: false,
      loading: 'lazy' as const,
      decoding: 'async' as const,
      srcset: null,
      issues: [],
      issueCount: 0,
      criticalCount: 0,
      warningCount: 0,
      metrics: {
        performanceImpact: 70,
        seoScore: 75,
        accessibilityScore: 85,
        aeoReadiness: 65,
      },
      createdAt: getRecentTimestamp(0),
      lastChecked: getRecentTimestamp(0),
    }
  );
}

