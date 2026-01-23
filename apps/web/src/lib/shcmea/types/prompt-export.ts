/**
 * Prompt Export Types
 *
 * Types for exporting prompts to CSV and Google Sheets
 */

// ============================================================
// EXPORT ROW TYPE
// ============================================================

export interface PromptExportRow {
  prompt: string
  location: string
  notes: string
  status: string
  visibilityScore: string
  lastScanDate: string
  createdAt: string
}

// ============================================================
// EXPORT RESULT TYPES
// ============================================================

export interface PromptCsvExportResult {
  success: boolean
  csvContent: string
  filename: string
  rowCount: number
}

export interface PromptGoogleSheetsExportResult {
  success: boolean
  spreadsheetId: string
  spreadsheetUrl: string
  name: string
  rowCount: number
}

// ============================================================
// CSV EXPORT COLUMNS
// ============================================================

export const PROMPT_EXPORT_CSV_HEADERS = [
  'prompt',
  'location',
  'notes',
  'status',
  'visibilityScore',
  'lastScanDate',
  'createdAt',
] as const

export type PromptExportCsvHeader = (typeof PROMPT_EXPORT_CSV_HEADERS)[number]
