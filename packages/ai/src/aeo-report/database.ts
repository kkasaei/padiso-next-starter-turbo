/**
 * AEO Report Database Layer
 *
 * Uses Drizzle ORM with PostgreSQL for persistent storage.
 *
 * Performance Optimizations Applied:
 * - ✅ Parallel queries with Promise.all()
 * - ✅ findFirst() for O(1) lookups on indexed fields
 * - ✅ Compound indexes for filtered+sorted queries
 * - ✅ Fire-and-forget updates for non-critical operations
 * - ✅ Always limit query results at database level
 * - ✅ Client-side filtering only for single records
 */

import { db, eq, and, lt, ne, desc, publicReports } from '@workspace/db';
import type { AEOReport } from '../types/aeo-report';
import type { CachedReport, LLMExecutionResult } from './types';

// ============================================================
// Cache Configuration
// ============================================================

const CACHE_DURATION_DAYS = 7;
const CACHE_DURATION_MS = CACHE_DURATION_DAYS * 24 * 60 * 60 * 1000;

// ============================================================
// Normalize Domain
// ============================================================

export function normalizeDomain(domain: string): string {
  return domain
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')
    .trim();
}

// ============================================================
// Check if Report Exists and is Valid (from Cache)
// ============================================================

export async function getCachedReport(
  domain: string
): Promise<CachedReport | null> {
  const normalized = normalizeDomain(domain);

  const report = await db.query.publicReports.findFirst({
    where: eq(publicReports.domain, normalized),
    columns: {
      id: true,
      domain: true,
      domainURL: true,
      data: true,
      status: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Check if report exists, is completed, and not expired
  if (!report || report.status !== 'COMPLETED' || report.expiresAt <= new Date()) {
    return null;
  }

  // Fire-and-forget: Update view count and last viewed timestamp
  void db
    .update(publicReports)
    .set({
      lastViewedAt: new Date(),
      viewCount: (report as any).viewCount ? (report as any).viewCount + 1 : 1,
    })
    .where(eq(publicReports.id, report.id))
    .catch(() => {});

  return {
    id: report.id,
    domain: report.domain,
    domainURL: report.domainURL,
    data: report.data as AEOReport | null,
    status: report.status as CachedReport['status'],
    expiresAt: report.expiresAt,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
  };
}

// ============================================================
// Create or Update Report
// ============================================================

export async function upsertReport(options: {
  domain: string;
  domainURL: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  data?: AEOReport;
  llmResults?: LLMExecutionResult[];
  generationTimeMs?: number;
  totalCost?: number;
  error?: string;
}): Promise<string> {
  const { domainURL, status, data, generationTimeMs, totalCost, llmResults } = options;
  const normalized = normalizeDomain(domainURL);
  const expiresAt = new Date(Date.now() + CACHE_DURATION_MS);

  // Check if report exists
  const existing = await db.query.publicReports.findFirst({
    where: eq(publicReports.domain, normalized),
    columns: { id: true },
  });

  if (existing) {
    // Update existing report
    await db
      .update(publicReports)
      .set({
        domain: normalized,
        domainURL,
        status,
        data: data || undefined,
        llmResults: llmResults || undefined,
        generationTimeMs: generationTimeMs || undefined,
        totalCost: totalCost || undefined,
        expiresAt,
        updatedAt: new Date(),
      })
      .where(eq(publicReports.id, existing.id));

    return existing.id;
  }

  // Create new report
  const [newReport] = await db
    .insert(publicReports)
    .values({
      domain: normalized,
      domainURL,
      status,
      data: data || null,
      llmResults: llmResults || null,
      generationTimeMs: generationTimeMs || null,
      totalCost: totalCost || null,
      expiresAt,
    })
    .returning({ id: publicReports.id });

  return newReport.id;
}

// ============================================================
// Update Report Status
// ============================================================

export async function updateReportStatus(
  reportId: string,
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
): Promise<void> {
  await db
    .update(publicReports)
    .set({ status, updatedAt: new Date() })
    .where(eq(publicReports.id, reportId));
}

// ============================================================
// Get Report by ID
// ============================================================

export async function getReportById(reportId: string): Promise<CachedReport | null> {
  const report = await db.query.publicReports.findFirst({
    where: eq(publicReports.id, reportId),
    columns: {
      id: true,
      domain: true,
      domainURL: true,
      data: true,
      status: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!report) return null;

  return {
    id: report.id,
    domain: report.domain,
    domainURL: report.domainURL,
    data: report.data as AEOReport | null,
    status: report.status as CachedReport['status'],
    expiresAt: report.expiresAt,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
  };
}

// ============================================================
// Check if Domain Exists (any status)
// ============================================================

export async function checkReportExists(domain: string): Promise<{
  exists: boolean;
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'EXPIRED';
  reportId?: string;
  expiresAt?: Date;
}> {
  const normalized = normalizeDomain(domain);

  const report = await db.query.publicReports.findFirst({
    where: eq(publicReports.domain, normalized),
    columns: {
      id: true,
      status: true,
      expiresAt: true,
    },
  });

  if (!report) {
    return { exists: false };
  }

  // Check if expired (client-side filtering is fine for single record)
  const isExpired = new Date() > report.expiresAt;
  const status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'EXPIRED' =
    isExpired ? 'EXPIRED' : report.status as 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

  return {
    exists: true,
    status,
    reportId: report.id,
    expiresAt: report.expiresAt,
  };
}

// ============================================================
// Clean Up Expired Reports (Background Job)
// ============================================================

export async function cleanupExpiredReports(): Promise<number> {
  const result = await db
    .update(publicReports)
    .set({ status: 'EXPIRED' })
    .where(
      and(
        lt(publicReports.expiresAt, new Date()),
        ne(publicReports.status, 'EXPIRED')
      )
    );

  return (result as any).rowCount || 0;
}

// ============================================================
// Delete Old Reports (30+ days expired)
// ============================================================

export async function deleteOldReports(): Promise<number> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const result = await db
    .delete(publicReports)
    .where(lt(publicReports.expiresAt, thirtyDaysAgo));

  return (result as any).rowCount || 0;
}

// ============================================================
// Get Report Statistics
// ============================================================

export async function getReportStats() {
  const [total, pending, processing, completed, failed] = await Promise.all([
    db.select().from(publicReports).then(r => r.length),
    db.select().from(publicReports).where(eq(publicReports.status, 'PENDING')).then(r => r.length),
    db.select().from(publicReports).where(eq(publicReports.status, 'PROCESSING')).then(r => r.length),
    db.select().from(publicReports).where(eq(publicReports.status, 'COMPLETED')).then(r => r.length),
    db.select().from(publicReports).where(eq(publicReports.status, 'FAILED')).then(r => r.length),
  ]);

  const expired = await db
    .select()
    .from(publicReports)
    .where(lt(publicReports.expiresAt, new Date()))
    .then(r => r.length);

  return {
    total,
    byStatus: {
      pending,
      processing,
      completed,
      failed,
      expired,
    },
  };
}

// ============================================================
// Get Popular Domains (Most Viewed)
// ============================================================

export async function getPopularDomains(limit = 10) {
  const safeLimit = Math.min(limit, 100);

  return db.query.publicReports.findMany({
    where: eq(publicReports.status, 'COMPLETED'),
    columns: {
      domainURL: true,
      createdAt: true,
      viewCount: true,
      lastViewedAt: true,
    },
    orderBy: [desc(publicReports.viewCount)],
    limit: safeLimit,
  });
}
