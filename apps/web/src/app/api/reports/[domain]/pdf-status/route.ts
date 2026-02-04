import { NextRequest, NextResponse } from 'next/server';
import { db, publicReports, eq } from '@workspace/db';
import { normalizeDomain } from '@workspace/cloudflare';

/**
 * GET /api/reports/[domain]/pdf-status
 *
 * Check PDF generation status
 * - Returns 'ready' if PDF exists with URL
 * - Returns 'pending' if PDF generation is in progress
 * - Returns 'not_found' if report doesn't exist
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  try {
    const { domain } = await params;

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain parameter is required' },
        { status: 400 }
      );
    }

    // Normalize domain
    const normalizedDomain = normalizeDomain(domain);

    // Check if PDF exists in database
    const [report] = await db
      .select({
        id: publicReports.id,
        pdfUrl: publicReports.pdfUrl,
        pdfGeneratedAt: publicReports.pdfGeneratedAt,
        status: publicReports.status,
      })
      .from(publicReports)
      .where(eq(publicReports.domain, normalizedDomain))
      .limit(1);

    if (!report) {
      return NextResponse.json({
        status: 'not_found',
        message: 'Report not found',
      });
    }

    if (report.status !== 'COMPLETED') {
      return NextResponse.json({
        status: 'report_not_ready',
        message: 'Report generation is still in progress',
      });
    }

    // PDF exists - ready for download
    if (report.pdfUrl) {
      return NextResponse.json({
        status: 'ready',
        pdfUrl: report.pdfUrl,
        generatedAt: report.pdfGeneratedAt,
      });
    }

    // Report exists but PDF not generated yet
    return NextResponse.json({
      status: 'pending',
      message: 'PDF generation in progress',
    });
  } catch (error) {
    console.error('[PDF Status API] Error checking PDF status:', error);

    return NextResponse.json(
      {
        error: 'Failed to check PDF status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
