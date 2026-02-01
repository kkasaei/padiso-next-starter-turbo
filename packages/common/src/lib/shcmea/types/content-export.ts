// ============================================================
// CONTENT EXPORT TYPES
// Types for bulk content export jobs with progress tracking
// ============================================================

export type ExportSourceType = 'google_drive' | 'markdown_zip' | 'csv'

export type ExportJobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'

export interface ExportJobProgress {
  total: number
  processed: number
  successful: number
  failed: number
}

export interface ExportJobError {
  contentId: string
  title: string
  error: string
  timestamp: string
}

export interface ExportJob {
  id: string
  projectId: string
  organizationId: string
  userId: string
  sourceType: ExportSourceType
  status: ExportJobStatus
  progress: ExportJobProgress
  errors: ExportJobError[]
  contentIds: string[]
  config: ExportJobConfig
  result?: ExportJobResult
  createdAt: string
  updatedAt: string
}

export interface ExportJobConfig {
  // For Google Drive export
  folderId?: string
  folderName?: string
  integrationId?: string
  // For markdown/csv export
  fileName?: string
}

export interface ExportJobResult {
  // For Google Drive
  documentUrls?: string[]
  folderId?: string
  // For file downloads
  downloadUrl?: string
  fileName?: string
}

