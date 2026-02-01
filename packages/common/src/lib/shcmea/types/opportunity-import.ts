/**
 * Opportunity Import Types
 *
 * Types for importing opportunities from Google Spreadsheets and CSV files
 */

// Opportunity type enum (mirrors database enum)
export type OpportunityType = 'CONTENT' | 'ACTION'

// Opportunity impact enum (mirrors database enum)
export type OpportunityImpact = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'

// Opportunity status enum (mirrors database enum)
export type OpportunityStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DISMISSED'

// ============================================================
// IMPORT SOURCE TYPES
// ============================================================

export type OpportunityImportSource = 'google_spreadsheet' | 'csv'

// ============================================================
// CSV/SPREADSHEET ROW TYPES
// ============================================================

export interface OpportunityImportRow {
  title: string
  type: OpportunityType
  impact: OpportunityImpact
  status?: OpportunityStatus
  // Instructions (markdown format) - For CONTENT type, should include content title (H1)
  instructions: string
}

export interface OpportunityImportInput {
  projectId: string
  rows: OpportunityImportRow[]
  defaultStatus?: OpportunityStatus
}

// ============================================================
// VALIDATION TYPES
// ============================================================

export interface OpportunityValidationError {
  row: number
  field: string
  message: string
}

export interface OpportunityValidationResult {
  valid: boolean
  totalRows: number
  validRows: number
  errors: OpportunityValidationError[]
  data: OpportunityImportRow[]
}

// ============================================================
// GOOGLE SPREADSHEET TYPES
// ============================================================

export interface GoogleSpreadsheetForImport {
  id: string
  name: string
  mimeType: string
  webViewLink?: string
  iconLink?: string
  modifiedTime?: string
}

export interface GoogleSpreadsheetSheet {
  sheetId: number
  title: string
  rowCount: number
}

// ============================================================
// IMPORT RESULT TYPES
// ============================================================

export interface OpportunityImportResult {
  success: boolean
  message: string
  imported: number
  failed: number
  errors: OpportunityValidationError[]
  opportunityIds: string[]
}

// ============================================================
// VALID ENUM VALUES (for validation)
// ============================================================

export const VALID_OPPORTUNITY_TYPES: OpportunityType[] = ['CONTENT', 'ACTION']
export const VALID_OPPORTUNITY_IMPACTS: OpportunityImpact[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
export const VALID_OPPORTUNITY_STATUSES: OpportunityStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'DISMISSED']

// ============================================================
// CSV TEMPLATE
// ============================================================

export const OPPORTUNITY_CSV_TEMPLATE = `title,type,impact,instructions,status
"Write: Complete Guide to AI SEO",CONTENT,HIGH,"# The Complete Guide to AI-Powered SEO in 2025 - Create an in-depth guide covering AI-powered SEO strategies. Target keywords: AI SEO strategy, AEO optimization. Include: Introduction, Traditional SEO vs AEO, Implementation Guide, Case Studies. Tone: Professional with practical examples. Length: 2500-3000 words.",PENDING
"Fix: Broken internal links on /pricing",ACTION,CRITICAL,"Check all CTAs and navigation links on /pricing page. Several internal links return 404 errors. Update href attributes and test all links after fix.",PENDING
"Update: Meta descriptions for landing pages",ACTION,MEDIUM,"Review and update meta descriptions on /features, /pricing, /about pages. Current descriptions are missing or too short for optimal SEO.",PENDING
"Create: Customer success case study",CONTENT,HIGH,"# Acme Corp Success Story - Interview their marketing team and document before/after metrics. Include: Challenge, Solution, Results, Key Takeaways. Target length: 1500-2000 words.",PENDING`

// ============================================================
// REQUIRED COLUMNS
// ============================================================

export const REQUIRED_COLUMNS = ['title', 'type', 'impact', 'instructions'] as const
export const OPTIONAL_COLUMNS = ['status'] as const
export const ALL_COLUMNS = [...REQUIRED_COLUMNS, ...OPTIONAL_COLUMNS] as const
