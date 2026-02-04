import { NextRequest, NextResponse } from 'next/server';
import { db, publicReports, reportUnlockRequests, eq, and } from '@workspace/db';
import { normalizeDomain } from '@workspace/cloudflare';

/**
 * GET /api/reports/[domain]/download-pdf
 *
 * Download or redirect to PDF
 * - Verifies user has unlocked the report (via query param)
 * - If PDF exists, redirect to CDN URL
 * - If PDF doesn't exist, return error
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

    // Get email from query params for verification
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required for download verification' },
        { status: 401 }
      );
    }

    // Normalize domain
    const normalizedDomain = normalizeDomain(domain);

    // ============================================================
    // SECURITY CHECK: Verify user has unlocked the report
    // ============================================================
    const [unlockRequest] = await db
      .select()
      .from(reportUnlockRequests)
      .where(
        and(
          eq(reportUnlockRequests.domain, normalizedDomain),
          eq(reportUnlockRequests.email, email.toLowerCase()),
          eq(reportUnlockRequests.unlocked, true)
        )
      )
      .limit(1);

    if (!unlockRequest) {
      return NextResponse.json(
        {
          error:
            'Report not unlocked. Please provide your details to unlock the report first.',
          unlocked: false,
        },
        { status: 403 }
      );
    }

    // Fetch PDF URL and report data from database
    const [report] = await db
      .select({
        pdfUrl: publicReports.pdfUrl,
        status: publicReports.status,
        data: publicReports.data,
        createdAt: publicReports.createdAt,
      })
      .from(publicReports)
      .where(eq(publicReports.domain, normalizedDomain))
      .limit(1);

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    if (report.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Report is not ready yet' },
        { status: 400 }
      );
    }

    if (!report.pdfUrl) {
      return NextResponse.json(
        {
          error: 'PDF not generated yet. Please request PDF generation first.',
        },
        { status: 404 }
      );
    }

    // ============================================================
    // SEND EMAIL: Send report link to user when downloading
    // TODO: Implement email sending with @workspace/email when available
    // ============================================================
    console.log(
      `[PDF Download API] 📧 User ${unlockRequest.email} downloading PDF for domain ${normalizedDomain}`
    );

    // Redirect to CDN URL
    console.log(`[PDF Download API] Redirecting to: ${report.pdfUrl}`);

    return NextResponse.redirect(report.pdfUrl, 302);
  } catch (error) {
    console.error('[PDF Download API] Error downloading PDF:', error);

    return NextResponse.json(
      {
        error: 'Failed to download PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
