/**
 * Content Import Types
 *
 * Types for importing content from Google Drive and CSV files
 */

// ============================================================
// IMPORT SOURCE TYPES
// ============================================================

export type ImportSource = 'google_drive' | 'csv'

export type ImportJobStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'

// ============================================================
// IMPORT JOB TYPES
// ============================================================

export interface ImportJobProgress {
  total: number
  processed: number
  succeeded: number
  failed: number
  currentItem?: string
}

export interface ImportJobError {
  item: string
  error: string
}

export interface ImportJob {
  id: string
  projectId: string
  source: ImportSource
  status: ImportJobStatus
  progress: ImportJobProgress
  errors: ImportJobError[]
  createdAt: string
  updatedAt: string
  completedAt?: string
}

// ============================================================
// GOOGLE DRIVE IMPORT TYPES
// ============================================================

export interface GoogleDriveDocForImport {
  id: string
  name: string
  mimeType: string
  webViewLink?: string
  iconLink?: string
  modifiedTime?: string
  selected?: boolean
}

export interface GoogleDriveImportInput {
  projectId: string
  integrationId: string
  documentIds: string[]
  defaultStatus: ContentStatusForImport
}

// ============================================================
// CSV IMPORT TYPES
// ============================================================

export interface CsvImportRow {
  title: string
  content?: string
  status?: ContentStatusForImport
}

export interface CsvImportInput {
  projectId: string
  rows: CsvImportRow[]
  defaultStatus: ContentStatusForImport
}

export interface CsvValidationResult {
  valid: boolean
  totalRows: number
  validRows: number
  errors: {
    row: number
    field: string
    message: string
  }[]
  data: CsvImportRow[]
}

// ============================================================
// CONTENT STATUS ENUM FOR IMPORT
// ============================================================

export type ContentStatusForImport =
  | 'IDEA'
  | 'OUTLINE'
  | 'DRAFT'
  | 'REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'ARCHIVED'

// ============================================================
// IMPORT JOB RESULT
// ============================================================

export interface ImportJobResult {
  jobId: string
  status: ImportJobStatus
  progress: ImportJobProgress
  errors: ImportJobError[]
  createdContentIds: string[]
}

// ============================================================
// REDIS KEY HELPERS
// ============================================================

export const IMPORT_JOB_KEYS = {
  job: (jobId: string) => `import:job:${jobId}`,
  projectJobs: (projectId: string) => `import:project:${projectId}:jobs`,
  jobProgress: (jobId: string) => `import:job:${jobId}:progress`,
} as const

// TTL for import job data (24 hours)
export const IMPORT_JOB_TTL = 86400

