/**
 * Opportunity Export Types
 *
 * Types for exporting opportunities to CSV and Google Sheets
 */

// ============================================================
// EXPORT ROW TYPE
// ============================================================

export interface OpportunityExportRow {
  title: string
  type: string
  impact: string
  status: string
  instructions: string
  createdAt: string
}

// ============================================================
// GOOGLE DRIVE FOLDER TYPES
// ============================================================

export interface GoogleDriveFolder {
  id: string
  name: string
  modifiedTime?: string
}

export interface GoogleDriveFolderBreadcrumb {
  id: string
  name: string
}

// ============================================================
// EXPORT RESULT TYPES
// ============================================================

export interface CsvExportResult {
  success: boolean
  csvContent: string
  filename: string
  rowCount: number
}

export interface GoogleSheetsExportResult {
  success: boolean
  spreadsheetId: string
  spreadsheetUrl: string
  name: string
  rowCount: number
}

// ============================================================
// CSV EXPORT COLUMNS
// ============================================================

export const EXPORT_CSV_HEADERS = [
  'title',
  'type',
  'impact',
  'status',
  'instructions',
  'createdAt',
] as const

export type ExportCsvHeader = (typeof EXPORT_CSV_HEADERS)[number]
