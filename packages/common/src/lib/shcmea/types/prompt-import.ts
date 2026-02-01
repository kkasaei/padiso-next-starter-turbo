/**
 * Prompt Import Types
 *
 * Types for importing prompts from Google Spreadsheets and CSV files
 */

// ============================================================
// IMPORT SOURCE TYPES
// ============================================================

export type PromptImportSource = 'google_spreadsheet' | 'csv'

// ============================================================
// CSV/SPREADSHEET ROW TYPES
// ============================================================

export interface PromptImportRow {
  prompt: string
  location?: string
  notes?: string
}

export interface PromptImportInput {
  projectId: string
  rows: PromptImportRow[]
}

// ============================================================
// VALIDATION TYPES
// ============================================================

export interface PromptValidationError {
  row: number
  field: string
  message: string
}

export interface PromptValidationResult {
  valid: boolean
  totalRows: number
  validRows: number
  errors: PromptValidationError[]
  data: PromptImportRow[]
}

// ============================================================
// GOOGLE SPREADSHEET TYPES
// ============================================================

export interface GoogleSpreadsheetForPromptImport {
  id: string
  name: string
  mimeType: string
  webViewLink?: string
  iconLink?: string
  modifiedTime?: string
}

export interface GoogleSpreadsheetPromptSheet {
  sheetId: number
  title: string
  rowCount: number
}

// ============================================================
// IMPORT RESULT TYPES
// ============================================================

export interface PromptImportResult {
  success: boolean
  message: string
  imported: number
  failed: number
  skipped: number
  errors: PromptValidationError[]
  promptIds: string[]
}

// ============================================================
// CSV TEMPLATE
// ============================================================

export const PROMPT_CSV_TEMPLATE = `prompt,location,notes
"What are the best project management tools for startups?","United States","Focused on software recommendations for startups"
"How does [Company Name] compare to competitors in [Industry]?","","Competitor analysis query - replace placeholders with actual values"
"What are the top 10 AI marketing automation platforms?","","List-style query for AI visibility tracking"
"Best practices for implementing [Product Category] in enterprise companies","Global","Enterprise-focused informational query"`

// ============================================================
// REQUIRED COLUMNS
// ============================================================

export const REQUIRED_PROMPT_COLUMNS = ['prompt'] as const
export const OPTIONAL_PROMPT_COLUMNS = ['location', 'notes'] as const
export const ALL_PROMPT_COLUMNS = [...REQUIRED_PROMPT_COLUMNS, ...OPTIONAL_PROMPT_COLUMNS] as const
