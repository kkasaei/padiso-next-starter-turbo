/**
 * PDF Generator
 *
 * Generates PDF reports from AEO data using @react-pdf/renderer.
 * The actual PDF document component must be passed in to allow
 * the web app to provide its own styled components.
 */

// ============================================================
// SERVERLESS CONFIGURATION: Disable canvas for pdfjs-dist
// This prevents @napi-rs/canvas from being loaded in serverless environments
// ============================================================
if (typeof process !== 'undefined') {
  // Disable PDF.js workers (not needed for @react-pdf/renderer)
  process.env.PDFJS_DISABLE_WORKER = '1';
  // Disable canvas (not available in serverless)
  process.env.PDFJS_SKIP_BABEL = '1';
}

import { pdf } from '@react-pdf/renderer';
import { createElement, type ComponentType } from 'react';
import type { AEOReport } from '@workspace/ai';
import { PDF_CONFIG } from './config';

/**
 * Props for PDF document components
 */
export interface PDFDocumentProps {
  data: AEOReport;
  domain: string;
}

/**
 * Format file size in human-readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Check if file size is acceptable
 */
function isFileSizeAcceptable(bytes: number, maxMB: number): boolean {
  return bytes <= maxMB * 1024 * 1024;
}

/**
 * Generate PDF report from AEO data
 *
 * @param data - AEO report data
 * @param domain - Domain name for the report
 * @param PDFDocument - React component that renders the PDF
 * @returns PDF as Buffer
 */
export async function generateReportPDF(
  data: AEOReport,
  domain: string,
  PDFDocument: ComponentType<PDFDocumentProps>
): Promise<Buffer> {
  console.log(`[PDF Generator] Starting PDF generation for ${domain}`);

  try {
    const startTime = Date.now();

    // Create PDF document using React component
    const pdfDoc = createElement(PDFDocument, { data, domain });

    // Generate PDF buffer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBlob = await pdf(pdfDoc as any).toBlob();
    const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

    const endTime = Date.now();
    const duration = endTime - startTime;
    const fileSize = pdfBuffer.length;

    console.log(`[PDF Generator] ✓ PDF generated successfully`);
    console.log(`[PDF Generator] Duration: ${duration}ms`);
    console.log(`[PDF Generator] File size: ${formatFileSize(fileSize)}`);

    // Check file size
    if (!isFileSizeAcceptable(fileSize, PDF_CONFIG.MAX_FILE_SIZE_MB)) {
      console.warn(
        `[PDF Generator] ⚠️ PDF file size exceeds ${PDF_CONFIG.MAX_FILE_SIZE_MB}MB: ${formatFileSize(fileSize)}`
      );
    }

    return pdfBuffer;
  } catch (error) {
    console.error('[PDF Generator] Failed to generate PDF:', error);
    throw new Error(
      `PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate PDF filename for a domain
 */
export function generatePDFFilename(domain: string): string {
  return `${domain}${PDF_CONFIG.FILE_SUFFIX}`;
}
