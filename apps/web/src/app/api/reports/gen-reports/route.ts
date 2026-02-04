import { NextRequest, NextResponse } from 'next/server';
import { aeoReportSchema } from '@workspace/common';
import { convertReportIconsToCDN } from '@workspace/pdf';

/**
 * POST /api/reports/gen-reports
 * Generate PDF report from JSON data without storing in database
 *
 * NOTE: This endpoint requires the PDF generation service to be configured.
 * The @workspace/pdf package provides utilities but the actual PDF React
 * component needs to be passed to generateReportPDF.
 *
 * Request body: Full report object with domain and data fields
 * Response: PDF file as application/pdf
 */
export async function POST(request: NextRequest) {
  console.log('[Gen Reports API] Received PDF generation request');

  try {
    // Parse request body
    const body = await request.json();

    // Extract domain and data
    const { domain, domainURL, data } = body;

    if (!domain && !domainURL) {
      return NextResponse.json(
        { success: false, error: 'Domain or domainURL is required' },
        { status: 400 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Report data is required' },
        { status: 400 }
      );
    }

    // Validate the report data structure
    const validationResult = aeoReportSchema.safeParse(data);

    if (!validationResult.success) {
      console.error(
        '[Gen Reports API] Invalid report data:',
        validationResult.error
      );
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid report data structure',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    // Use domain or fallback to domainURL
    const reportDomain = domain || domainURL;
    console.log(`[Gen Reports API] Generating PDF for domain: ${reportDomain}`);

    // Convert all icon paths to CDN URLs
    const dataWithCDNIcons = convertReportIconsToCDN(validationResult.data);
    console.log('[Gen Reports API] Converted all icon paths to CDN URLs');

    // TODO: Generate PDF when PDF document component is available
    // The @workspace/pdf package provides generateReportPDF function
    // but requires a React PDF document component to be passed:
    //
    // import { generateReportPDF } from '@workspace/pdf';
    // import { AEOReportPDF } from '@/components/pdf/AEOReportPDF';
    // const pdfBuffer = await generateReportPDF(dataWithCDNIcons, reportDomain, AEOReportPDF);
    //
    // For now, return error indicating PDF generation is not yet configured

    console.log(
      '[Gen Reports API] ⚠️ PDF generation not yet configured for this endpoint'
    );

    return NextResponse.json(
      {
        success: false,
        error:
          'PDF generation service not yet configured. Please use the report UI to generate PDFs.',
        domain: reportDomain,
        dataValid: true,
      },
      { status: 501 }
    );
  } catch (error) {
    console.error('[Gen Reports API] Error generating PDF:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate PDF report',
      },
      { status: 500 }
    );
  }
}
