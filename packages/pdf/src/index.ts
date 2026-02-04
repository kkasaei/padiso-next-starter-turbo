/**
 * @workspace/pdf package
 *
 * PDF generation utilities for SearchFit reports.
 * Uses @react-pdf/renderer for high-quality PDF output.
 */

// ============================================================
// Configuration
// ============================================================
export { PDF_CONFIG } from './config';
export type { PDFConfig } from './config';

// ============================================================
// PDF Generator
// ============================================================
export { generateReportPDF, generatePDFFilename } from './generator';
export type { PDFDocumentProps } from './generator';

// ============================================================
// Icon Utilities
// ============================================================
export { convertIconToCDN, convertReportIconsToCDN } from './icon-utils';

// ============================================================
// Canvas Stub (for serverless environments)
// ============================================================
export {
  default as canvasStub,
  createCanvas,
  loadImage,
  registerFont,
} from './canvas-stub';
