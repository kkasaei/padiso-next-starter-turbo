/**
 * PDF Generation Configuration
 */

export const PDF_CONFIG = {
  // Page dimensions (16:9 ratio for presentation/sharing)
  PAGE_WIDTH: 1280, // points
  PAGE_HEIGHT: 720, // points (16:9 aspect ratio)

  // File naming
  FILE_SUFFIX: '-aeo-report.pdf',

  // Size limits
  MAX_FILE_SIZE_MB: 5,
  WARN_FILE_SIZE_MB: 3,

  // Generation settings
  GENERATION_TIMEOUT_MS: 60000, // 60 seconds

  // Cache settings
  CACHE_DURATION_DAYS: 365, // PDFs cached for 1 year

  // Metadata
  AUTHOR: 'SearchFit',
  CREATOR: 'SearchFit',
  SUBJECT: 'Answer Engine Optimization Report',
  KEYWORDS: 'AEO, AI Search, SearchFit',
} as const;

export type PDFConfig = typeof PDF_CONFIG;
