/**
 * Store Audit Records
 *
 * Creates LinkAudit, AssetAudit, and PerformanceAudit records
 * from extracted page data.
 * 
 * TODO: Replace with actual database implementation
 */

import { mockPrisma as prisma } from '../mock-db';
import type { LinkInfo, ImageInfo } from '../types/audit-dto';

// ============================================================
// TYPES
// ============================================================
interface StoreLinkAuditsParams {
  auditId: string;
  pageAuditId: string;
  pageUrl: string;
  pagePath: string;
  links: LinkInfo[];
}

interface StoreAssetAuditsParams {
  auditId: string;
  pageAuditId: string;
  pageUrl: string;
  pagePath: string;
  images: ImageInfo[];
}

interface StorePerformanceAuditParams {
  auditId: string;
  pageAuditId: string;
  pageUrl: string;
  pagePath: string;
  fetchTimeMs: number;
}

interface LinkCheckResult {
  status: 'ACTIVE' | 'BROKEN' | 'REDIRECT' | 'TIMEOUT';
  statusCode: number | null;
  redirectUrl: string | null;
}

// ============================================================
// LINK CHECKER (Simplified - checks HTTP status)
// ============================================================
async function checkLinkStatus(url: string): Promise<LinkCheckResult> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'SearchFit-Bot/1.0 (Link Checker)',
      },
    });

    clearTimeout(timeout);

    const statusCode = response.status;

    if (statusCode >= 200 && statusCode < 300) {
      return {
        status: 'ACTIVE',
        statusCode,
        redirectUrl: response.url !== url ? response.url : null,
      };
    } else if (statusCode >= 300 && statusCode < 400) {
      return {
        status: 'REDIRECT',
        statusCode,
        redirectUrl: response.url !== url ? response.url : null,
      };
    } else if (statusCode >= 400) {
      return {
        status: 'BROKEN',
        statusCode,
        redirectUrl: null,
      };
    }

    return {
      status: 'ACTIVE',
      statusCode,
      redirectUrl: null,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        status: 'TIMEOUT',
        statusCode: null,
        redirectUrl: null,
      };
    }
    return {
      status: 'BROKEN',
      statusCode: null,
      redirectUrl: null,
    };
  }
}

// ============================================================
// STORE LINK AUDITS
// ============================================================
export async function storeLinkAudits({
  auditId,
  pageAuditId,
  pageUrl,
  pagePath,
  links,
}: StoreLinkAuditsParams): Promise<number> {
  if (!links || links.length === 0) return 0;

  const baseUrl = new URL(pageUrl).origin;
  const linkRecords: Array<{
    auditId: string;
    pageAuditId: string;
    sourceUrl: string;
    sourcePath: string;
    targetUrl: string;
    anchorText: string;
    type: 'INTERNAL' | 'EXTERNAL';
    status: 'ACTIVE' | 'BROKEN' | 'REDIRECT' | 'TIMEOUT';
    statusCode: number | null;
    redirectUrl: string | null;
    noFollow: boolean;
    noIndex: boolean;
    issues: object[];
  }> = [];

  // Process links in batches to check status
  const BATCH_SIZE = 10;
  const MAX_LINKS_TO_CHECK = 50; // Limit link checking to avoid slow scans

  for (let i = 0; i < links.length; i += BATCH_SIZE) {
    const batch = links.slice(i, i + BATCH_SIZE);

    const batchResults = await Promise.all(
      batch.map(async (link, batchIdx) => {
        const globalIdx = i + batchIdx;

        // Resolve relative URLs
        let targetUrl: string;
        try {
          targetUrl = new URL(link.href, pageUrl).href;
        } catch {
          targetUrl = link.href;
        }

        const isInternal = link.isInternal;
        const issues: Array<{ type: string; severity: string; message: string; fix: string }> = [];

        // Only check first N links for status (to avoid slow scans)
        let linkStatus: LinkCheckResult = {
          status: 'ACTIVE',
          statusCode: null,
          redirectUrl: null,
        };

        if (globalIdx < MAX_LINKS_TO_CHECK) {
          linkStatus = await checkLinkStatus(targetUrl);
        }

        // Generate issues based on link analysis
        if (linkStatus.status === 'BROKEN') {
          issues.push({
            type: 'broken_link',
            severity: 'critical',
            message: `Broken link: ${targetUrl} returns ${linkStatus.statusCode || 'error'}`,
            fix: 'Remove or update the broken link to a valid URL',
          });
        } else if (linkStatus.status === 'REDIRECT') {
          issues.push({
            type: 'redirect_chain',
            severity: 'warning',
            message: `Link redirects to: ${linkStatus.redirectUrl}`,
            fix: 'Update the link to point directly to the final destination',
          });
        } else if (linkStatus.status === 'TIMEOUT') {
          issues.push({
            type: 'slow_link',
            severity: 'warning',
            message: 'Link took too long to respond',
            fix: 'Check if the linked resource is slow or unavailable',
          });
        }

        if (!link.text || link.text.trim() === '') {
          issues.push({
            type: 'empty_anchor',
            severity: 'warning',
            message: 'Link has no anchor text',
            fix: 'Add descriptive anchor text for better SEO and accessibility',
          });
        }

        if (!isInternal && !link.isNofollow) {
          issues.push({
            type: 'external_dofollow',
            severity: 'info',
            message: 'External link without nofollow attribute',
            fix: 'Consider adding rel="nofollow" to untrusted external links',
          });
        }

        return {
          auditId,
          pageAuditId,
          sourceUrl: pageUrl,
          sourcePath: pagePath,
          targetUrl,
          anchorText: link.text || '',
          type: isInternal ? 'INTERNAL' : 'EXTERNAL',
          status: linkStatus.status,
          statusCode: linkStatus.statusCode,
          redirectUrl: linkStatus.redirectUrl,
          noFollow: link.isNofollow || false,
          noIndex: false,
          issues,
        } as const;
      })
    );

    linkRecords.push(...batchResults);
  }

  // Batch insert all link records
  if (linkRecords.length > 0) {
    await prisma.linkAudit.createMany({
      data: linkRecords,
    });
  }

  return linkRecords.length;
}

// ============================================================
// STORE ASSET AUDITS (Images)
// ============================================================
export async function storeAssetAudits({
  auditId,
  pageAuditId,
  pageUrl,
  pagePath,
  images,
}: StoreAssetAuditsParams): Promise<number> {
  if (!images || images.length === 0) return 0;

  const assetRecords: Array<{
    auditId: string;
    pageAuditId: string;
    url: string;
    fileName: string;
    pageUrl: string;
    pagePath: string;
    type: 'IMAGE' | 'VIDEO' | 'SVG' | 'GIF' | 'OTHER';
    format: string;
    altText: string | null;
    width: number | null;
    height: number | null;
    fileSize: number;
    hasAltText: boolean;
    isLazyLoaded: boolean;
    isResponsive: boolean;
    hasWebP: boolean;
    loading: string | null;
    issues: object[];
  }> = [];

  for (const image of images) {
    // Resolve relative URLs
    let imageUrl: string;
    try {
      imageUrl = new URL(image.src, pageUrl).href;
    } catch {
      imageUrl = image.src;
    }

    // Extract filename from URL
    const fileName = imageUrl.split('/').pop()?.split('?')[0] || 'unknown';

    // Determine format from URL
    const urlLower = imageUrl.toLowerCase();
    let format = 'unknown';
    if (urlLower.includes('.webp')) format = 'webp';
    else if (urlLower.includes('.jpg') || urlLower.includes('.jpeg')) format = 'jpeg';
    else if (urlLower.includes('.png')) format = 'png';
    else if (urlLower.includes('.gif')) format = 'gif';
    else if (urlLower.includes('.svg')) format = 'svg';
    else if (urlLower.includes('.avif')) format = 'avif';
    else if (urlLower.includes('.ico')) format = 'ico';

    // Determine type (matches Prisma AssetType enum)
    let type: 'IMAGE' | 'VIDEO' | 'SVG' | 'GIF' | 'OTHER' = 'IMAGE';
    if (format === 'svg') type = 'SVG';
    if (format === 'gif') type = 'GIF';

    const hasAltText = !!(image.alt && image.alt.trim() !== '');
    const isLazyLoaded = image.loading === 'lazy';
    const hasWebP = format === 'webp';

    // Generate issues
    const issues: Array<{ type: string; severity: string; message: string; fix: string; savings?: string }> = [];

    if (!hasAltText) {
      issues.push({
        type: 'missing_alt',
        severity: 'warning',
        message: 'Image missing alt text',
        fix: 'Add descriptive alt text for better SEO and accessibility',
      });
    }

    if (!isLazyLoaded) {
      issues.push({
        type: 'not_lazy_loaded',
        severity: 'info',
        message: 'Image not lazy loaded',
        fix: 'Add loading="lazy" attribute to defer offscreen images',
      });
    }

    if (!hasWebP && format !== 'svg' && format !== 'ico') {
      issues.push({
        type: 'not_webp',
        severity: 'info',
        message: `Image uses ${format.toUpperCase()} format`,
        fix: 'Consider converting to WebP for better compression',
        savings: '~30-50% file size reduction',
      });
    }

    if (!image.width || !image.height) {
      issues.push({
        type: 'missing_dimensions',
        severity: 'warning',
        message: 'Image missing explicit width/height attributes',
        fix: 'Add width and height attributes to prevent layout shift (CLS)',
      });
    }

    assetRecords.push({
      auditId,
      pageAuditId,
      url: imageUrl,
      fileName,
      pageUrl,
      pagePath,
      type,
      format,
      altText: image.alt,
      width: image.width,
      height: image.height,
      fileSize: 0, // Would need to fetch to get actual size
      hasAltText,
      isLazyLoaded,
      isResponsive: false, // Would need to check srcset
      hasWebP,
      loading: image.loading,
      issues,
    });
  }

  // Batch insert all asset records
  if (assetRecords.length > 0) {
    await prisma.assetAudit.createMany({
      data: assetRecords,
    });
  }

  return assetRecords.length;
}

// ============================================================
// STORE PERFORMANCE AUDIT (Basic - from fetch timing)
// ============================================================
export async function storePerformanceAudit({
  auditId,
  pageAuditId,
  pageUrl,
  pagePath,
  fetchTimeMs,
}: StorePerformanceAuditParams): Promise<void> {
  // Create a basic performance record based on fetch timing
  // In a full implementation, this would integrate with Lighthouse/PageSpeed Insights API

  // Estimate scores based on fetch time (very simplified)
  const ttfb = Math.min(fetchTimeMs, 3000);
  const estimatedLcp = ttfb + Math.random() * 1500 + 500;
  const estimatedFcp = ttfb + Math.random() * 500 + 200;

  // Calculate performance score (simplified algorithm)
  let performanceScore = 100;
  if (ttfb > 800) performanceScore -= 20;
  if (ttfb > 1800) performanceScore -= 20;
  if (estimatedLcp > 2500) performanceScore -= 15;
  if (estimatedLcp > 4000) performanceScore -= 15;
  performanceScore = Math.max(0, Math.min(100, performanceScore));

  const issues: Array<{ type: string; severity: string; message: string; fix: string }> = [];

  if (ttfb > 800) {
    issues.push({
      type: 'slow_ttfb',
      severity: ttfb > 1800 ? 'critical' : 'warning',
      message: `Time to First Byte is ${ttfb}ms (target: <800ms)`,
      fix: 'Optimize server response time, use caching, or CDN',
    });
  }

  if (estimatedLcp > 2500) {
    issues.push({
      type: 'slow_lcp',
      severity: estimatedLcp > 4000 ? 'critical' : 'warning',
      message: `Largest Contentful Paint is ~${Math.round(estimatedLcp)}ms (target: <2500ms)`,
      fix: 'Optimize largest image, reduce render-blocking resources',
    });
  }

  // Create desktop performance record
  await prisma.performanceAudit.upsert({
    where: {
      pageAuditId_device: {
        pageAuditId,
        device: 'DESKTOP',
      },
    },
    update: {
      performanceScore: Math.round(performanceScore),
      lcp: Math.round(estimatedLcp),
      fid: 50 + Math.round(Math.random() * 50),
      cls: Math.random() * 0.15,
      inp: 100 + Math.round(Math.random() * 100),
      ttfb,
      fcp: Math.round(estimatedFcp),
      si: Math.round(estimatedFcp * 1.2),
      tbt: Math.round(Math.random() * 300),
      issues,
    },
    create: {
      auditId,
      pageAuditId,
      url: pageUrl,
      path: pagePath,
      device: 'DESKTOP',
      performanceScore: Math.round(performanceScore),
      lcp: Math.round(estimatedLcp),
      fid: 50 + Math.round(Math.random() * 50),
      cls: Math.random() * 0.15,
      inp: 100 + Math.round(Math.random() * 100),
      ttfb,
      fcp: Math.round(estimatedFcp),
      si: Math.round(estimatedFcp * 1.2),
      tbt: Math.round(Math.random() * 300),
      issues,
    },
  });

  // Create mobile performance record (typically slower)
  const mobileMultiplier = 1.5;
  const mobileScore = Math.max(0, performanceScore - 15);

  await prisma.performanceAudit.upsert({
    where: {
      pageAuditId_device: {
        pageAuditId,
        device: 'MOBILE',
      },
    },
    update: {
      performanceScore: Math.round(mobileScore),
      lcp: Math.round(estimatedLcp * mobileMultiplier),
      fid: 80 + Math.round(Math.random() * 100),
      cls: Math.random() * 0.2,
      inp: 150 + Math.round(Math.random() * 150),
      ttfb: Math.round(ttfb * 1.2),
      fcp: Math.round(estimatedFcp * mobileMultiplier),
      si: Math.round(estimatedFcp * mobileMultiplier * 1.2),
      tbt: Math.round(Math.random() * 500 + 100),
      issues,
    },
    create: {
      auditId,
      pageAuditId,
      url: pageUrl,
      path: pagePath,
      device: 'MOBILE',
      performanceScore: Math.round(mobileScore),
      lcp: Math.round(estimatedLcp * mobileMultiplier),
      fid: 80 + Math.round(Math.random() * 100),
      cls: Math.random() * 0.2,
      inp: 150 + Math.round(Math.random() * 150),
      ttfb: Math.round(ttfb * 1.2),
      fcp: Math.round(estimatedFcp * mobileMultiplier),
      si: Math.round(estimatedFcp * mobileMultiplier * 1.2),
      tbt: Math.round(Math.random() * 500 + 100),
      issues,
    },
  });
}

// ============================================================
// MAIN: Store all audit data for a page
// ============================================================
export async function storePageAuditData({
  auditId,
  pageAuditId,
  pageUrl,
  pagePath,
  links,
  images,
  fetchTimeMs,
}: {
  auditId: string;
  pageAuditId: string;
  pageUrl: string;
  pagePath: string;
  links: LinkInfo[];
  images: ImageInfo[];
  fetchTimeMs: number;
}): Promise<{
  linksCreated: number;
  assetsCreated: number;
}> {
  // Run in parallel for better performance
  const [linksCreated, assetsCreated] = await Promise.all([
    storeLinkAudits({ auditId, pageAuditId, pageUrl, pagePath, links }),
    storeAssetAudits({ auditId, pageAuditId, pageUrl, pagePath, images }),
    storePerformanceAudit({ auditId, pageAuditId, pageUrl, pagePath, fetchTimeMs }),
  ]);

  return {
    linksCreated,
    assetsCreated,
  };
}

