// ============================================================
// PROMPT SUGGESTION DTOs
// ============================================================

export interface PromptSuggestionDto {
  id: string
  projectId: string
  orgId: string
  title: string
  prompt: string
  category: string | null
  isUsed: boolean
  usedAt: Date | null
  usedById: string | null
  generatedAt: Date
  batchId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface PromptSuggestionListDto {
  suggestions: PromptSuggestionDto[]
  total: number
  unused: number
  used: number
}

export interface GenerateSuggestionsInput {
  projectId: string
  count?: number // Default: 10
}

export interface UseSuggestionInput {
  suggestionId: string
  targetLocation?: string
  notes?: string
}

export interface SuggestionCountDto {
  orgTotal: number
  projectTotal: number
  projectUnused: number
  canGenerate: boolean // true if org hasn't hit 100 limit
  remaining: number // how many more can be generated (100 - orgTotal)
}





