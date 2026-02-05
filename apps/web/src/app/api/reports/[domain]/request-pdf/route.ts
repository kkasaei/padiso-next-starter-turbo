import { NextRequest, NextResponse } from 'next/server';
import { db, publicReports, reportUnlockRequests, eq, and } from '@workspace/db';
import { normalizeDomain, uploadPDFToR2 } from '@workspace/cloudflare';
import { generateReportPDF, convertReportIconsToCDN } from '@workspace/pdf';
import type { AEOReport } from '@workspace/common/lib';
import { AEOReportPDF } from '@/components/marketing/public-report/pdf-report/PdfDocument';

/**
 * POST /api/reports/[domain]/request-pdf
 *
 * Request PDF generation for a report
 * - Verifies user has unlocked the report (required email)
 * - Checks if PDF already exists in database (instant return)
 * - If not, generates PDF inline and uploads to R2
 */
export async function POST(
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

    // Parse request body to get user email
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required. Please unlock the report first.' },
        { status: 401 }
      );
    }

    // Normalize domain for consistent lookups
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

    console.log(
      `[PDF API] User ${email} verified for domain ${normalizedDomain}`
    );

    // 1. Check if report exists
    const [report] = await db
      .select({
        id: publicReports.id,
        domain: publicReports.domain,
        pdfUrl: publicReports.pdfUrl,
        pdfGeneratedAt: publicReports.pdfGeneratedAt,
        status: publicReports.status,
        data: publicReports.data,
        createdAt: publicReports.createdAt,
      })
      .from(publicReports)
      .where(eq(publicReports.domain, normalizedDomain))
      .limit(1);

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found. Please generate a report first.' },
        { status: 404 }
      );
    }

    // 2. Check if report is completed
    if (report.status !== 'COMPLETED') {
      return NextResponse.json(
        {
          error:
            'Report is not ready yet. Please wait for report generation to complete.',
        },
        { status: 400 }
      );
    }

    // 3. Check if PDF already exists (cache hit!)
    if (report.pdfUrl) {
      console.log(`[PDF API] Cache hit - PDF already exists: ${report.pdfUrl}`);

      // TODO: Send email notification when email package is available
      console.log(
        `[PDF API] 📧 PDF ready for ${email} - domain ${normalizedDomain}`
      );

      return NextResponse.json({
        status: 'ready',
        pdfUrl: report.pdfUrl,
        cached: true,
        generatedAt: report.pdfGeneratedAt,
      });
    }

    // 4. PDF doesn't exist - generate inline
    console.log(
      `[PDF API] Cache miss - generating PDF for ${normalizedDomain}`
    );

    try {
      // Parse report data
      const reportData = report.data as AEOReport;
      
      // Convert icons to CDN URLs for PDF compatibility
      const dataWithCDNIcons = convertReportIconsToCDN(reportData);
      
      // Generate PDF using the AEOReportPDF component
      console.log(`[PDF API] Starting PDF generation...`);
      const pdfBuffer = await generateReportPDF(
        dataWithCDNIcons,
        normalizedDomain,
        AEOReportPDF
      );
      console.log(`[PDF API] PDF generated: ${pdfBuffer.length} bytes`);

      // Upload to R2
      console.log(`[PDF API] Uploading to R2...`);
      const pdfUrl = await uploadPDFToR2(
        report.id,
        normalizedDomain,
        pdfBuffer
      );
      console.log(`[PDF API] Uploaded to R2: ${pdfUrl}`);

      // Save URL to database
      await db
        .update(publicReports)
        .set({
          pdfUrl,
          pdfGeneratedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(publicReports.id, report.id));

      console.log(`[PDF API] ✅ PDF ready for ${email} - ${pdfUrl}`);

      return NextResponse.json({
        status: 'ready',
        pdfUrl,
        cached: false,
        generatedAt: new Date().toISOString(),
      });
    } catch (pdfError) {
      console.error(`[PDF API] PDF generation failed:`, pdfError);
      return NextResponse.json(
        {
          error: 'PDF generation failed',
          details: pdfError instanceof Error ? pdfError.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[PDF API] Error requesting PDF:', error);

    return NextResponse.json(
      {
        error: 'Failed to request PDF generation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
