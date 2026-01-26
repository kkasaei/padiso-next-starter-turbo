// ============================================================
// TRACKING MOCK DATA
// ============================================================

// Keywords Types
export type KeywordIntent = 'informational' | 'transactional' | 'navigational' | 'commercial'
export type KeywordTrend = 'up' | 'down' | 'stable'

export interface TrackedKeyword {
  id: string
  keyword: string
  searchVolume: number
  difficulty: number
  cpc: number
  trend: KeywordTrend
  intent: KeywordIntent
  isTracking: boolean
  position: number | null
  lastUpdated: string | null
  notes: string | null
}

export interface SuggestedKeywordItem {
  keyword: string
  searchVolume: number
  difficulty: number
  cpc: number
  intent: KeywordIntent
}

// Competitors Types
export interface TrackedCompetitor {
  id: string
  name: string
  domain: string
  isTracking: boolean
  shareOfVoice: number
  avgPosition: number
  mentionCount: number
  lastUpdated: string | null
  notes: string | null
}

// Mock keywords data
export const MOCK_KEYWORDS: TrackedKeyword[] = [
  { id: '1', keyword: 'best project management software', searchVolume: 14800, difficulty: 72, cpc: 12.50, trend: 'up', intent: 'commercial', isTracking: true, position: 8, lastUpdated: '2025-01-15T10:30:00Z', notes: 'High-value keyword for main landing page' },
  { id: '2', keyword: 'how to manage remote teams', searchVolume: 8200, difficulty: 45, cpc: 4.20, trend: 'up', intent: 'informational', isTracking: true, position: 3, lastUpdated: '2025-01-14T14:20:00Z', notes: 'Blog content opportunity' },
  { id: '3', keyword: 'project management tools comparison', searchVolume: 6500, difficulty: 68, cpc: 15.80, trend: 'stable', intent: 'commercial', isTracking: true, position: 12, lastUpdated: '2025-01-13T09:15:00Z', notes: null },
  { id: '4', keyword: 'asana alternatives', searchVolume: 4900, difficulty: 58, cpc: 18.30, trend: 'up', intent: 'transactional', isTracking: true, position: 5, lastUpdated: '2025-01-12T16:45:00Z', notes: 'Competitor comparison page target' },
  { id: '5', keyword: 'free task management app', searchVolume: 12100, difficulty: 62, cpc: 6.90, trend: 'down', intent: 'transactional', isTracking: false, position: null, lastUpdated: '2025-01-10T11:00:00Z', notes: null },
  { id: '6', keyword: 'what is agile methodology', searchVolume: 22000, difficulty: 38, cpc: 2.10, trend: 'stable', intent: 'informational', isTracking: true, position: 15, lastUpdated: '2025-01-11T08:30:00Z', notes: 'Educational content' },
]

// Suggested keywords
export const SUGGESTED_KEYWORDS: SuggestedKeywordItem[] = [
  { keyword: 'remote work tools 2025', searchVolume: 5600, difficulty: 48, cpc: 8.20, intent: 'commercial' },
  { keyword: 'best gantt chart software', searchVolume: 4200, difficulty: 52, cpc: 11.30, intent: 'commercial' },
  { keyword: 'project management for startups', searchVolume: 3100, difficulty: 42, cpc: 9.80, intent: 'commercial' },
]

// Mock competitors data
export const MOCK_COMPETITORS: TrackedCompetitor[] = [
  { id: '1', name: 'Asana', domain: 'asana.com', isTracking: true, shareOfVoice: 28.5, avgPosition: 2.3, mentionCount: 156, lastUpdated: '2025-01-15T10:30:00Z', notes: 'Main competitor' },
  { id: '2', name: 'Monday.com', domain: 'monday.com', isTracking: true, shareOfVoice: 24.2, avgPosition: 3.1, mentionCount: 142, lastUpdated: '2025-01-14T14:20:00Z', notes: null },
  { id: '3', name: 'Trello', domain: 'trello.com', isTracking: true, shareOfVoice: 18.7, avgPosition: 4.2, mentionCount: 98, lastUpdated: '2025-01-13T09:15:00Z', notes: 'Kanban focus' },
  { id: '4', name: 'ClickUp', domain: 'clickup.com', isTracking: true, shareOfVoice: 15.3, avgPosition: 5.0, mentionCount: 87, lastUpdated: '2025-01-12T16:45:00Z', notes: null },
  { id: '5', name: 'Notion', domain: 'notion.so', isTracking: false, shareOfVoice: 12.1, avgPosition: 6.5, mentionCount: 65, lastUpdated: '2025-01-10T11:00:00Z', notes: 'Docs-focused' },
]

// Intent labels
export const INTENT_LABELS: Record<KeywordIntent, string> = {
  informational: 'Informational',
  transactional: 'Transactional',
  navigational: 'Navigational',
  commercial: 'Commercial',
}

// Mock prompts data
export interface MockTrackedPrompt {
  id: string
  projectId: string
  prompt: string
  notes: string | null
  lastVisibilityScore: number | null
  lastMentionPosition: number | null
  lastScanDate: Date | null
  isActive: boolean
  scanStatus: 'IDLE' | 'SCANNING' | 'COMPLETED' | 'FAILED' | null
  targetLocation: string | null
  targetLanguage: string | null
  createdAt: Date
  updatedAt: Date
}

export const MOCK_PROMPTS: MockTrackedPrompt[] = [
  {
    id: 'prompt-001',
    projectId: 'project-001',
    prompt: 'Best project management software for remote teams',
    notes: 'Tracking visibility for our main product keyword',
    lastVisibilityScore: 78,
    lastMentionPosition: 3,
    lastScanDate: new Date('2026-01-25'),
    isActive: true,
    scanStatus: 'COMPLETED',
    targetLocation: 'United States',
    targetLanguage: 'en',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-25'),
  },
]
