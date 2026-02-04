/**
 * Background Job: AEO Report Generator & Cleanup
 * Handles generation, cleanup of expired reports, and statistics
 */

import { task } from '@trigger.dev/sdk/v3';
import {
  cleanupExpiredReports,
  deleteOldReports,
  getReportStats,
  generateAEOReport,
  getReportById,
} from '@workspace/ai';
import { uploadPDFToR2 } from '@workspace/cloudflare';
import { db, publicReports, eq } from '@workspace/db';

// ============================================================
// Generate AEO Report (Background)
// Can be triggered manually or via webhook
// ============================================================

export const generateReportTask = task({
  id: 'generate-aeo-report',
  // Use larger machine for AI processing and PDF generation
  machine: 'medium-2x', // 2 vCPU, 4 GB RAM
  run: async (payload: { domain: string; forceRegenerate?: boolean }) => {
    console.log(`🚀 Generating AEO report for: ${payload.domain}`);

    const result = await generateAEOReport(payload.domain, {
      forceRegenerate: payload.forceRegenerate,
    });

    if (result.success) {
      console.log(
        `✅ Report generated successfully (${result.fromCache ? 'from cache' : 'newly generated'})`
      );
      console.log(`⚡ Generation time: ${result.generationTimeMs}ms`);
    } else {
      console.error(`❌ Report generation failed: ${result.error}`);
    }

    return result;
  },
});

// ============================================================
// Cleanup Expired Reports
// Runs daily to mark expired reports
// ============================================================

export const cleanupExpiredReportsTask = task({
  id: 'cleanup-expired-reports',
  run: async () => {
    console.log('🧹 Starting cleanup of expired reports...');

    const expiredCount = await cleanupExpiredReports();

    console.log(`✅ Marked ${expiredCount} reports as expired`);

    return {
      success: true,
      expiredCount,
    };
  },
});

// ============================================================
// Delete Old Reports
// Runs weekly to permanently delete reports expired for 30+ days
// ============================================================

export const deleteOldReportsTask = task({
  id: 'delete-old-reports',
  run: async () => {
    console.log('🗑️  Starting deletion of old reports...');

    const deletedCount = await deleteOldReports();

    console.log(`✅ Deleted ${deletedCount} old reports`);

    return {
      success: true,
      deletedCount,
    };
  },
});

// ============================================================
// Report Statistics
// Runs daily to log report statistics
// ============================================================

export const reportStatsTask = task({
  id: 'report-stats',
  run: async () => {
    console.log('📊 Fetching report statistics...');

    const stats = await getReportStats();

    console.log('📊 Report Statistics:', {
      total: stats.total,
      completed: stats.byStatus.completed,
      pending: stats.byStatus.pending,
      processing: stats.byStatus.processing,
      failed: stats.byStatus.failed,
      expired: stats.byStatus.expired,
    });

    return {
      success: true,
      stats,
    };
  },
});

// ============================================================
// Generate PDF Report
// Generates PDF from existing report data, uploads to R2, caches URL
// ============================================================

export const generatePDFReportTask = task({
  id: 'generate-pdf-report',
  run: async (payload: { reportId: string; domain: string }) => {
    console.log(
      `📄 Starting PDF generation for report ${payload.reportId} (${payload.domain})`
    );

    try {
      // 1. Fetch report data from database
      const [report] = await db
        .select({
          id: publicReports.id,
          domain: publicReports.domain,
          data: publicReports.data,
          pdfUrl: publicReports.pdfUrl,
        })
        .from(publicReports)
        .where(eq(publicReports.id, payload.reportId))
        .limit(1);

      if (!report) {
        throw new Error(`Report not found: ${payload.reportId}`);
      }

      // Check if PDF already exists
      if (report.pdfUrl) {
        console.log(`✓ PDF already exists: ${report.pdfUrl}`);
        return {
          success: true,
          cached: true,
          pdfUrl: report.pdfUrl,
        };
      }

      // 2. Generate PDF using @workspace/pdf
      // TODO: PDF generation with @react-pdf/renderer requires a React component
      // to be passed in. This task needs to either:
      // - Import a PDF document component bundled with this package
      // - Call a web app API endpoint that generates the PDF
      // - Use a standalone PDF service
      //
      // For now, we log the report data and return an error
      console.log('📄 Report data available for PDF generation:', {
        domain: report.domain,
        hasData: !!report.data,
      });

      // Placeholder: Generate PDF when PDF document component is available
      // const pdfBuffer = await generateReportPDF(report.data as AEOReport, payload.domain, PDFDocument);

      // 3. Upload to Cloudflare R2 (ready to use when PDF is generated)
      // const pdfUrl = await uploadPDFToR2(payload.reportId, payload.domain, pdfBuffer);

      // 4. Save URL to database (ready to use when PDF is uploaded)
      // await db
      //   .update(publicReports)
      //   .set({
      //     pdfUrl,
      //     pdfGeneratedAt: new Date(),
      //     updatedAt: new Date(),
      //   })
      //   .where(eq(publicReports.id, payload.reportId));

      console.log(
        '⚠️ PDF generation requires a PDF document component to be configured'
      );

      return {
        success: false,
        error: 'PDF generation requires PDF document component configuration',
        reportId: payload.reportId,
      };
    } catch (error) {
      console.error('❌ PDF generation failed:', error);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});
