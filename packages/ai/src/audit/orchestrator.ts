/**
 * Website Audit Orchestrator
 *
 * Two-phase audit process:
 * 1. DISCOVERY: Crawl and store ALL pages with PENDING status (visible in UI immediately)
 * 2. ANALYSIS: Batch analyze first `maxPagesToScan` pages, leaving rest as PENDING
 *
 * Users can later request scanning of additional pages via `scanMorePages`
 * 
 * TODO: Replace with actual database implementation
 */

import { mockPrisma as prisma } from '../mock-db';
import { discoverPages, fetchPage, extractPageData } from './crawler';
import { analyzePageWithAI } from './analyzer';
import { storePageAuditData } from './store-audits';
import type {
  AuditConfig,
  AuditResult,
  PageProcessingResult,
  ScanMorePagesPayload,
  ScanMorePagesResult,
} from './types';
import {
  CRAWL_DELAY_MS,
  DEFAULT_MAX_PAGES,
  DEFAULT_MAX_PAGES_TO_SCAN,
  AI_ANALYSIS_BATCH_SIZE,
} from './types';
import type { PageIssue, ImageInfo, LinkInfo } from '../types/audit-dto';

// ============================================================
// Main Audit Function (Two-Phase)
// ============================================================

export async function runWebsiteAudit(config: AuditConfig): Promise<AuditResult> {
  const startTime = Date.now();
  const {
    projectId,
    auditId,
    websiteUrl,
    sitemapUrl,
    maxPagesToAudit = DEFAULT_MAX_PAGES,
    maxPagesToScan = DEFAULT_MAX_PAGES_TO_SCAN,
  } = config;
  const errors: string[] = [];
  let totalCost = 0;

  // Get project info
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, name: true, orgId: true, websiteUrl: true },
  });

  if (!project) {
    throw new Error(`Project ${projectId} not found`);
  }

  const targetUrl = websiteUrl || project.websiteUrl;

  if (!targetUrl) {
    throw new Error('No website URL provided for audit');
  }

  // Get existing WebsiteAudit record (must exist - created by runAuditAction)
  const audit = await prisma.websiteAudit.findUnique({
    where: { id: auditId },
  });

  if (!audit) {
    throw new Error(`WebsiteAudit ${auditId} not found`);
  }

  try {
    // ============================================================
    // PHASE 1: DISCOVERY - Find and store ALL pages
    // ============================================================
    await prisma.websiteAudit.update({
      where: { id: audit.id },
      data: { status: 'DISCOVERING', startedAt: new Date() },
    });

    console.log(`🔍 Phase 1: Discovering pages for ${targetUrl}`);
    console.log(`📋 Config: maxPagesToAudit=${maxPagesToAudit}, maxPagesToScan=${maxPagesToScan}`);

    const discovery = await discoverPages(targetUrl, {
      sitemapUrl,
      maxPages: maxPagesToAudit,
      respectRobotsTxt: config.respectRobotsTxt ?? true,
    });

    if (discovery.errors.length > 0) {
      errors.push(...discovery.errors);
    }

    const urls = discovery.urls;
    const totalPages = urls.length;

    console.log(`📄 Found ${totalPages} pages - storing in database...`);

    // Store ALL pages with PENDING status
    const pageAuditRecords = await storeDiscoveredPages(audit.id, urls);

    // Update audit with total pages
    await prisma.websiteAudit.update({
      where: { id: audit.id },
      data: {
        totalPages,
        sitemapUrl: discovery.sitemapUrl,
        pagesScanned: 0,
      },
    });

    console.log(`✅ Phase 1 complete: ${totalPages} pages discovered and stored`);

    // ============================================================
    // PHASE 2: ANALYSIS - Analyze first `maxPagesToScan` pages
    // ============================================================
    await prisma.websiteAudit.update({
      where: { id: audit.id },
      data: { status: 'ANALYZING' },
    });

    // Determine how many pages to scan initially
    const pagesToScanCount = Math.min(maxPagesToScan, pageAuditRecords.length);
    const pagesToScan = pageAuditRecords.slice(0, pagesToScanCount);

    console.log(`🤖 Phase 2: Analyzing ${pagesToScanCount}/${totalPages} pages...`);

    let pagesScanned = 0;
    let criticalIssues = 0;
    let warningIssues = 0;
    let infoIssues = 0;
    const pageResults: PageProcessingResult[] = [];

    // Process pages in batches
    for (let i = 0; i < pagesToScan.length; i += AI_ANALYSIS_BATCH_SIZE) {
      const batch = pagesToScan.slice(i, i + AI_ANALYSIS_BATCH_SIZE);

      // Process batch concurrently
      const batchResults = await Promise.all(
        batch.map((pageRecord) => analyzeStoredPage(pageRecord.id, pageRecord.url))
      );

      for (const result of batchResults) {
        pageResults.push(result);

        if (result.success) {
          pagesScanned++;
          criticalIssues += result.issueCount.critical;
          warningIssues += result.issueCount.warning;
          infoIssues += result.issueCount.info;
          totalCost += result.cost;
        } else if (result.error) {
          errors.push(`${result.url}: ${result.error}`);
        }
      }

      // Update progress after each batch
      await prisma.websiteAudit.update({
        where: { id: audit.id },
        data: {
          pagesScanned,
          criticalIssues,
          warningIssues,
          infoIssues,
          totalCost,
        },
      });

      console.log(`📊 Progress: ${pagesScanned}/${pagesToScanCount} pages analyzed`);

      // Add delay between batches to avoid rate limits
      if (i + AI_ANALYSIS_BATCH_SIZE < pagesToScan.length) {
        await sleep(CRAWL_DELAY_MS);
      }
    }

    // Calculate aggregate scores from analyzed pages
    const successfulResults = pageResults.filter((r) => r.success && r.scores);
    const scores = calculateAggregateScores(successfulResults);

    // Mark audit as COMPLETED
    await prisma.websiteAudit.update({
      where: { id: audit.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        overallScore: scores.overall,
        seoScore: scores.seo,
        performanceScore: scores.performance,
        accessibilityScore: scores.accessibility,
        contentScore: scores.content,
        totalCost,
      },
    });

    const unscannedPages = totalPages - pagesToScanCount;
    console.log(`✅ Audit completed! Score: ${scores.overall}/100`);
    console.log(`📄 Scanned: ${pagesScanned}/${totalPages} pages`);
    if (unscannedPages > 0) {
      console.log(`⏸️  ${unscannedPages} pages remain PENDING for on-demand scanning`);
    }

    return {
      auditId: audit.id,
      projectId,
      success: true,
      totalPages,
      pagesScanned,
      pagesFailed: pagesToScanCount - pagesScanned,
      scores,
      issues: {
        critical: criticalIssues,
        warning: warningIssues,
        info: infoIssues,
      },
      totalCost,
      totalTimeMs: Date.now() - startTime,
      errors,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    errors.push(errorMessage);

    await prisma.websiteAudit.update({
      where: { id: audit.id },
      data: {
        status: 'FAILED',
        completedAt: new Date(),
      },
    });

    return {
      auditId: audit.id,
      projectId,
      success: false,
      totalPages: 0,
      pagesScanned: 0,
      pagesFailed: 0,
      scores: {
        overall: 0,
        seo: 0,
        performance: 0,
        accessibility: 0,
        content: 0,
      },
      issues: {
        critical: 0,
        warning: 0,
        info: 0,
      },
      totalCost,
      totalTimeMs: Date.now() - startTime,
      errors,
    };
  }
}

// ============================================================
// Scan More Pages (On-Demand)
// Called when user requests to scan additional pages
// ============================================================

export async function scanMorePages(
  payload: ScanMorePagesPayload
): Promise<ScanMorePagesResult> {
  const { auditId, pageAuditIds } = payload;
  const errors: string[] = [];
  let pagesScanned = 0;
  let pagesFailed = 0;

  console.log(`📄 Scanning ${pageAuditIds.length} additional pages for audit ${auditId}`);

  // Verify audit exists
  const audit = await prisma.websiteAudit.findUnique({
    where: { id: auditId },
  });

  if (!audit) {
    return {
      success: false,
      pagesScanned: 0,
      pagesFailed: 0,
      errors: [`Audit ${auditId} not found`],
    };
  }

  // Get pages to scan (must be PENDING status)
  const pagesToScan = await prisma.pageAudit.findMany({
    where: {
      id: { in: pageAuditIds },
      auditId,
      status: 'PENDING',
    },
    select: { id: true, url: true },
  });

  if (pagesToScan.length === 0) {
    return {
      success: true,
      pagesScanned: 0,
      pagesFailed: 0,
      errors: ['No PENDING pages found to scan'],
    };
  }

  let criticalIssues = audit.criticalIssues;
  let warningIssues = audit.warningIssues;
  let infoIssues = audit.infoIssues;
  let totalCost = audit.totalCost || 0;
  let currentPagesScanned = audit.pagesScanned;

  // Process pages in batches
  for (let i = 0; i < pagesToScan.length; i += AI_ANALYSIS_BATCH_SIZE) {
    const batch = pagesToScan.slice(i, i + AI_ANALYSIS_BATCH_SIZE);

    const batchResults = await Promise.all(
      batch.map((page) => analyzeStoredPage(page.id, page.url))
    );

    for (const result of batchResults) {
      if (result.success) {
        pagesScanned++;
        currentPagesScanned++;
        criticalIssues += result.issueCount.critical;
        warningIssues += result.issueCount.warning;
        infoIssues += result.issueCount.info;
        totalCost += result.cost;
      } else {
        pagesFailed++;
        if (result.error) {
          errors.push(`${result.url}: ${result.error}`);
        }
      }
    }

    // Update audit progress
    await prisma.websiteAudit.update({
      where: { id: auditId },
      data: {
        pagesScanned: currentPagesScanned,
        criticalIssues,
        warningIssues,
        infoIssues,
        totalCost,
      },
    });

    // Add delay between batches
    if (i + AI_ANALYSIS_BATCH_SIZE < pagesToScan.length) {
      await sleep(CRAWL_DELAY_MS);
    }
  }

  // Recalculate aggregate scores
  const allCompletedPages = await prisma.pageAudit.findMany({
    where: {
      auditId,
      status: 'COMPLETED',
    },
    select: {
      overallScore: true,
      seoScore: true,
      aeoScore: true,
      contentScore: true,
      technicalScore: true,
    },
  });

  const scores = calculateAggregateScoresFromPages(allCompletedPages);

  // Update audit with new scores
  await prisma.websiteAudit.update({
    where: { id: auditId },
    data: {
      overallScore: scores.overall,
      seoScore: scores.seo,
      performanceScore: scores.performance,
      accessibilityScore: scores.accessibility,
      contentScore: scores.content,
    },
  });

  console.log(`✅ Scanned ${pagesScanned} additional pages (${pagesFailed} failed)`);

  return {
    success: true,
    pagesScanned,
    pagesFailed,
    errors,
  };
}

// ============================================================
// Phase 1: Store Discovered Pages
// ============================================================

async function storeDiscoveredPages(
  auditId: string,
  urls: string[]
): Promise<Array<{ id: string; url: string }>> {
  const records: Array<{ id: string; url: string }> = [];

  // Create all pages with PENDING status
  // Use createMany for better performance, then fetch the created records
  const pageData = urls.map((url) => {
    const path = new URL(url).pathname;
    return {
      auditId,
      url,
      path,
      status: 'PENDING' as const,
    };
  });

  // MongoDB doesn't support createMany with returning, so we batch create individually
  // but more efficiently than one at a time
  const BATCH_SIZE = 50;
  for (let i = 0; i < pageData.length; i += BATCH_SIZE) {
    const batch = pageData.slice(i, i + BATCH_SIZE);

    const created = await Promise.all(
      batch.map((data) =>
        prisma.pageAudit.create({
          data,
          select: { id: true, url: true },
        })
      )
    );

    records.push(...created);
  }

  return records;
}

// ============================================================
// Phase 2: Analyze Stored Page (Exported for on-demand scanning)
// ============================================================

export async function analyzeStoredPage(
  pageAuditId: string,
  url: string
): Promise<PageProcessingResult> {
  const startTime = Date.now();
  const path = new URL(url).pathname;

  try {
    // Update status to FETCHING
    await prisma.pageAudit.update({
      where: { id: pageAuditId },
      data: { status: 'FETCHING' },
    });

    // Fetch page content (track fetch time for performance metrics)
    const fetchStartTime = Date.now();
    const fetchResult = await fetchPage(url);
    const fetchTimeMs = Date.now() - fetchStartTime;

    if (!fetchResult.success || !fetchResult.html) {
      await prisma.pageAudit.update({
        where: { id: pageAuditId },
        data: {
          status: 'FAILED',
          error: fetchResult.error || 'Failed to fetch page',
        },
      });

      return {
        url,
        path,
        success: false,
        scores: null,
        issueCount: { critical: 0, warning: 0, info: 0 },
        error: fetchResult.error || 'Failed to fetch page',
        processingTimeMs: Date.now() - startTime,
        cost: 0,
      };
    }

    // Extract page data
    const pageData = extractPageData(url, fetchResult.html);

    // Update status to ANALYZING
    await prisma.pageAudit.update({
      where: { id: pageAuditId },
      data: {
        title: pageData.metadata.title,
        status: 'ANALYZING',
      },
    });

    // Run AI analysis
    const analysis = await analyzePageWithAI(pageData);

    if (!analysis.success) {
      await prisma.pageAudit.update({
        where: { id: pageAuditId },
        data: {
          status: 'FAILED',
          error: analysis.error || 'AI analysis failed',
          metadata: pageData.metadata as object,
        },
      });

      return {
        url,
        path,
        success: false,
        scores: null,
        issueCount: { critical: 0, warning: 0, info: 0 },
        error: analysis.error || 'AI analysis failed',
        processingTimeMs: Date.now() - startTime,
        cost: analysis.cost,
      };
    }

    // Count issues by severity
    const issueCount = countIssuesBySeverity(analysis.issues);

    // Get the auditId from the pageAudit record
    const pageAuditRecord = await prisma.pageAudit.findUnique({
      where: { id: pageAuditId },
      select: { auditId: true },
    });

    const auditId = pageAuditRecord?.auditId;

    // Update page as COMPLETED with results
    await prisma.pageAudit.update({
      where: { id: pageAuditId },
      data: {
        status: 'COMPLETED',
        overallScore: analysis.scores.overall,
        seoScore: analysis.scores.seo,
        aeoScore: analysis.scores.aeo,
        contentScore: analysis.scores.content,
        technicalScore: analysis.scores.technical,
        metadata: pageData.metadata as object,
        analysis: analysis.analysis as object,
        issues: analysis.issues as object[],
        content: pageData.markdownContent, // Store markdown-formatted content for the editor
        scannedAt: new Date(),
      },
    });

    // Store LinkAudit, AssetAudit, and PerformanceAudit records
    if (auditId) {
      try {
        await storePageAuditData({
          auditId,
          pageAuditId,
          pageUrl: url,
          pagePath: path,
          links: pageData.metadata.links as LinkInfo[],
          images: pageData.metadata.images as ImageInfo[],
          fetchTimeMs,
        });
      } catch (storeError) {
        // Log but don't fail the page scan if storing audits fails
        console.error('Failed to store audit data:', storeError);
      }
    }

    return {
      url,
      path,
      success: true,
      scores: analysis.scores,
      issueCount,
      error: null,
      processingTimeMs: Date.now() - startTime,
      cost: analysis.cost,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    await prisma.pageAudit.update({
      where: { id: pageAuditId },
      data: {
        status: 'FAILED',
        error: errorMessage,
      },
    });

    return {
      url,
      path,
      success: false,
      scores: null,
      issueCount: { critical: 0, warning: 0, info: 0 },
      error: errorMessage,
      processingTimeMs: Date.now() - startTime,
      cost: 0,
    };
  }
}

// ============================================================
// Helper Functions
// ============================================================

function countIssuesBySeverity(issues: PageIssue[]): {
  critical: number;
  warning: number;
  info: number;
} {
  return issues.reduce(
    (acc, issue) => {
      acc[issue.severity]++;
      return acc;
    },
    { critical: 0, warning: 0, info: 0 }
  );
}

function calculateAggregateScores(results: PageProcessingResult[]): {
  overall: number;
  seo: number;
  performance: number;
  accessibility: number;
  content: number;
} {
  if (results.length === 0) {
    return {
      overall: 0,
      seo: 0,
      performance: 0,
      accessibility: 0,
      content: 0,
    };
  }

  const validResults = results.filter((r) => r.scores);

  if (validResults.length === 0) {
    return {
      overall: 0,
      seo: 0,
      performance: 0,
      accessibility: 0,
      content: 0,
    };
  }

  const sum = validResults.reduce(
    (acc, r) => {
      if (!r.scores) return acc;
      acc.overall += r.scores.overall || 0;
      acc.seo += r.scores.seo || 0;
      acc.content += r.scores.content || 0;
      acc.technical += r.scores.technical || 0;
      acc.aeo += r.scores.aeo || 0;
      return acc;
    },
    { overall: 0, seo: 0, content: 0, technical: 0, aeo: 0 }
  );

  const count = validResults.length;

  return {
    overall: Math.round(sum.overall / count),
    seo: Math.round(sum.seo / count),
    performance: Math.round(sum.technical / count),
    accessibility: Math.round(sum.aeo / count),
    content: Math.round(sum.content / count),
  };
}

function calculateAggregateScoresFromPages(
  pages: Array<{
    overallScore: number | null;
    seoScore: number | null;
    aeoScore: number | null;
    contentScore: number | null;
    technicalScore: number | null;
  }>
): {
  overall: number;
  seo: number;
  performance: number;
  accessibility: number;
  content: number;
} {
  if (pages.length === 0) {
    return {
      overall: 0,
      seo: 0,
      performance: 0,
      accessibility: 0,
      content: 0,
    };
  }

  const sum = pages.reduce(
    (acc, p) => {
      acc.overall += p.overallScore || 0;
      acc.seo += p.seoScore || 0;
      acc.content += p.contentScore || 0;
      acc.technical += p.technicalScore || 0;
      acc.aeo += p.aeoScore || 0;
      return acc;
    },
    { overall: 0, seo: 0, content: 0, technical: 0, aeo: 0 }
  );

  const count = pages.length;

  return {
    overall: Math.round(sum.overall / count),
    seo: Math.round(sum.seo / count),
    performance: Math.round(sum.technical / count),
    accessibility: Math.round(sum.aeo / count),
    content: Math.round(sum.content / count),
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
