// ============================================================
// PROMPT ANALYTICS CONSTANTS
// Provider configurations, table columns, and static config
// ============================================================

import type { ProviderConfig } from '@/lib/shcmea/types/dtos/prompt-analytics-dto'

// ============================================================
// PROVIDER CONFIGURATION
// ============================================================
export const PROVIDERS: readonly ProviderConfig[] = [
  { id: 'chatgpt', name: 'ChatGPT', logo: '/icons/openai.svg', color: '#10a37f' },
  { id: 'perplexity', name: 'Perplexity', logo: '/icons/perplexity.svg', color: '#8b5cf6' },
  { id: 'gemini', name: 'Gemini', logo: '/icons/gemini.svg', color: '#4285f4' },
] as const

export const COMPETITION_PROVIDERS = [
  { id: 'all', name: 'All' },
  { id: 'chatgpt', name: 'ChatGPT', logo: '/icons/openai.svg' },
  { id: 'perplexity', name: 'Perplexity', logo: '/icons/perplexity.svg' },
  { id: 'gemini', name: 'Gemini', logo: '/icons/gemini.svg' },
] as const

// ============================================================
// PAGE SIZE OPTIONS
// ============================================================
export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const
export const COMPETITOR_PAGE_SIZE_OPTIONS = [10, 20, 50] as const

// ============================================================
// TABLE COLUMN DEFINITIONS
// ============================================================
export const COMPETITOR_TABLE_COLUMNS = [
  {
    key: 'rank' as const,
    label: 'Rank',
    tooltip: 'Current ranking based on the selected sort column. By default, sorted by Share of Voice.',
    sortable: false,
  },
  {
    key: 'name' as const,
    label: 'Competitor',
    tooltip: 'Brand or competitor name as mentioned in AI responses.',
    sortable: true,
  },
  {
    key: 'value' as const,
    label: 'Share of Voice',
    tooltip: 'Percentage of times this brand is mentioned when the prompt is asked. Higher = more visibility.',
    sortable: true,
  },
  {
    key: 'position' as const,
    label: 'Avg. Position',
    tooltip: 'Average position where the brand appears in AI responses. #1 = mentioned first, #2 = second, etc.',
    sortable: true,
  },
  {
    key: 'dateFound' as const,
    label: 'First Detected',
    tooltip: 'Date when this competitor was first detected in AI responses for this prompt.',
    sortable: true,
  },
] as const

export const MENTION_TABLE_COLUMNS = [
  {
    key: 'date' as const,
    label: 'Date',
    tooltip: 'When the AI response was captured during monitoring.',
    sortable: true,
  },
  {
    key: 'response' as const,
    label: 'AI Response',
    tooltip: 'The actual response from the AI provider when asked this prompt.',
    sortable: false,
  },
  {
    key: 'mentionPosition' as const,
    label: 'Position',
    tooltip: 'Where your brand was mentioned in the response. #1 = mentioned first.',
    sortable: true,
  },
  {
    key: 'sentiment' as const,
    label: 'Sentiment',
    tooltip: 'How the AI characterized your brand - positive, neutral, or negative.',
    sortable: true,
  },
] as const

// ============================================================
// PRIORITY ORDER FOR SORTING
// ============================================================
export const PRIORITY_ORDER: Record<string, number> = {
  'High': 3,
  'Medium': 2,
  'Low': 1,
}

