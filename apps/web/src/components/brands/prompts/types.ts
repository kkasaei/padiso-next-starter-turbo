export interface TrackedPrompt {
  id: string
  brandId: string
  prompt: string
  notes: string | null
  lastVisibilityScore: number | null
  lastMentionPosition: number | null
  lastScanDate: Date | null
  isActive: boolean
  scanStatus?: 'IDLE' | 'SCANNING' | 'COMPLETED' | 'FAILED' | null
  targetLocation: string | null
  targetLanguage: string | null
  createdAt: Date
  updatedAt: Date
}

export interface PromptFormData {
  promptText: string
  location: string
  notes: string
}

export interface SuggestedPrompt {
  id: string
  title: string
  prompt: string
  category?: string | null
  isUsed?: boolean
}

