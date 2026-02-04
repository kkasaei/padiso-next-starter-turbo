import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  generateAEOReport,
  getCachedReport,
  normalizeDomain,
} from '@workspace/ai';
import { notifyDomainSearch } from '@workspace/notification';
import { env } from '@/env';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds max execution time

// ============================================================
// Helper: Get client IP from request headers
// ============================================================
function getClientIp(request: NextRequest): string {
  // Check various headers in order of preference
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp;

  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    // Take the first IP if there are multiple
    return xForwardedFor.split(',')[0].trim();
  }

  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp) return xRealIp;

  return 'unknown';
}

// ============================================================
// Simple in-memory rate limiter
// In production, use Redis or similar for distributed rate limiting
// ============================================================
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3; // 3 requests per window
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in ms

function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  retryAfter?: number;
} {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // Clean up expired records
  if (record && record.resetAt < now) {
    rateLimitMap.delete(ip);
  }

  const current = rateLimitMap.get(ip);

  if (!current) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (current.count >= RATE_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  current.count++;
  return { allowed: true, remaining: RATE_LIMIT - current.count };
}

// ============================================================
// GET /api/reports/[domain]
// Fetch existing report OR generate new one if not cached
// ============================================================

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ domain: string }> }
) {
  try {
    const params = await context.params;
    const domain = decodeURIComponent(params.domain);
    const normalized = normalizeDomain(domain);

    // Get business vertical from query params (for industry context)
    const { searchParams } = new URL(request.url);
    const vertical = searchParams.get('vertical') || undefined;

    console.log(
      `[Report API] Fetching/generating report for: ${normalized}${vertical ? ` (vertical: ${vertical})` : ''}`
    );

    // Get client IP once at the start
    const clientIp = getClientIp(request);

    // ============================================================
    // STEP 1: Check cache first (fast path - no rate limit applied)
    // Cached reports are FREE and unlimited
    // ============================================================
    const cached = await getCachedReport(normalized);
    if (cached && cached.data) {
      console.log(
        `[Report API] ✅ Cached report served for ${normalized} (no rate limit applied)`
      );

      // Get rate limit info for response headers (but don't enforce it)
      const currentRateLimit = checkRateLimit(clientIp);

      // Notify about domain search (from cache)
      void notifyDomainSearch({
        domain: normalized,
        domainURL: domain,
        fromCache: true,
        reportUrl: `${env.NEXT_PUBLIC_CLIENT_URL}/report/${normalized}`,
        ipAddress: clientIp,
      });

      return NextResponse.json(
        {
          success: true,
          fromCache: true,
          report: {
            metadata: {
              domain: normalized,
              domainURL: domain,
              generatedAt: cached.createdAt,
              status: 'COMPLETED',
            },
            data: cached.data,
          },
        },
        {
          headers: {
            'X-RateLimit-Limit': String(RATE_LIMIT),
            'X-RateLimit-Remaining': String(currentRateLimit.remaining),
            'X-From-Cache': 'true',
          },
        }
      );
    }

    // ============================================================
    // STEP 2: No cache found - enforce rate limiting for NEW generation
    // This protects against LLM cost abuse
    // ============================================================
    const rateLimitResult = checkRateLimit(clientIp);

    if (!rateLimitResult.allowed) {
      const retryAfterSeconds = rateLimitResult.retryAfter || 0;
      const hours = Math.ceil(retryAfterSeconds / 3600);
      const timeMessage =
        hours > 1
          ? `${hours} hours`
          : hours === 1
            ? '1 hour'
            : `${Math.ceil(retryAfterSeconds / 60)} minutes`;

      console.log(`[Report API] ❌ Rate limit exceeded for IP ${clientIp}`);

      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          message: `You've reached your limit of ${RATE_LIMIT} new reports per 24 hours. Please try again in ${timeMessage}.`,
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.retryAfter),
            'X-RateLimit-Limit': String(RATE_LIMIT),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    // ============================================================
    // STEP 3: Generate new report (slow path - rate limit applied)
    // All LLM queries run in parallel (60s max)
    // ============================================================
    console.log(
      `[Report API] Generating new report for ${normalized} (Rate limit: ${rateLimitResult.remaining} remaining)`
    );

    const result = await generateAEOReport(domain, { vertical });

    console.log(
      `[Report API] ${result.success ? '✅' : '❌'} Generation complete for ${normalized}:`,
      {
        success: result.success,
        generationTimeMs: result.generationTimeMs,
      }
    );

    if (!result.success || !result.report) {
      console.error(`[Report API] Generation failed for ${normalized}:`, {
        error: result.error,
        fromCache: result.fromCache,
        llmResults: result.llmResults?.map((r) => ({
          provider: r.provider,
          status: r.status,
          error: r.error,
        })),
      });

      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to generate report',
          llmResults: result.llmResults,
          fromCache: result.fromCache,
        },
        { status: 500 }
      );
    }

    // Get rate limit info for response headers
    const currentRateLimit = checkRateLimit(clientIp);

    // Notify about new report generation
    void notifyDomainSearch({
      domain: normalized,
      domainURL: domain,
      fromCache: result.fromCache || false,
      generationTimeMs: result.generationTimeMs,
      reportUrl: `${env.NEXT_PUBLIC_CLIENT_URL}/report/${normalized}`,
      ipAddress: clientIp,
    });

    return NextResponse.json(
      {
        success: true,
        fromCache: result.fromCache,
        generationTimeMs: result.generationTimeMs,
        report: {
          metadata: {
            domain: normalized,
            domainURL: domain,
            generatedAt: new Date(),
            status: 'COMPLETED',
          },
          data: result.report,
        },
      },
      {
        headers: {
          'X-RateLimit-Limit': String(RATE_LIMIT),
          'X-RateLimit-Remaining': String(currentRateLimit.remaining),
          'X-From-Cache': String(result.fromCache),
        },
      }
    );
  } catch (error) {
    console.error('[Report API] Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch or generate report',
      },
      { status: 500 }
    );
  }
}

// ============================================================
// POST /api/reports/[domain]
// Force regenerate report (bypass cache)
// ============================================================

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ domain: string }> }
) {
  try {
    const params = await context.params;
    const domain = decodeURIComponent(params.domain);
    const body = await request.json().catch(() => ({}));
    const forceRegenerate = body.forceRegenerate === true;

    // Validate domain
    if (!domain || domain.length < 3) {
      return NextResponse.json({ error: 'Invalid domain' }, { status: 400 });
    }

    // Force regeneration (useful for "Refresh Report" button)
    const result = await generateAEOReport(domain, { forceRegenerate });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to generate report',
          llmResults: result.llmResults,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      fromCache: result.fromCache,
      generationTimeMs: result.generationTimeMs,
      report: {
        metadata: {
          domain: normalizeDomain(domain),
          domainURL: domain,
          generatedAt: new Date(),
          status: 'COMPLETED',
        },
        data: result.report,
      },
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
