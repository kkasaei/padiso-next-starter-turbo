// ============================================================
// PROMPT ANALYTICS HELPERS
// Utility functions for analytics components
// ============================================================

import type { CompetitorData } from '@workspace/common/lib/shcmea/types/dtos/prompt-analytics-dto'

// ============================================================
// FAVICON HELPER
// ============================================================
export function getFaviconUrl(domain: string | null): string | null {
  if (!domain) return null
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
}

// ============================================================
// SENTIMENT COLOR HELPER
// Supports both string sentiment values and numeric scores
// ============================================================
export function getSentimentColor(sentiment: string | number): string {
  // Handle numeric scores (0-100)
  if (typeof sentiment === 'number') {
    if (sentiment >= 70) {
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    }
    if (sentiment >= 50) {
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    }
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }

  // Handle string sentiment values
  switch (sentiment.toLowerCase()) {
    case 'positive':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case 'neutral':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    case 'negative':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }
}

// ============================================================
// PROVIDER LOGO HELPER
// Handles both capitalized and lowercase provider names
// ============================================================
export function getProviderLogo(provider: string): string {
  const normalizedProvider = provider.toLowerCase()
  const providerMap: Record<string, string> = {
    chatgpt: '/icons/openai.svg',
    perplexity: '/icons/perplexity.svg',
    gemini: '/icons/gemini.svg',
    openai: '/icons/openai.svg',
  }
  return providerMap[normalizedProvider] || '/icons/openai.svg'
}

// ============================================================
// MARKET POSITION DATA GENERATOR
// Simplifies competitor data for market position chart
// Shows: Your Brand vs Top Competitor vs Others (combined)
// ============================================================
export function getMarketPositionData(competitors: CompetitorData[]) {
  // Find "your brand" - should be explicitly marked in the data
  const yourBrand = competitors.find(c => c.isYourBrand)
  
  // Sort other competitors by value to find the top one
  const otherCompetitors = [...competitors].filter(c => !c.isYourBrand).sort((a, b) => b.value - a.value)
  const topCompetitor = otherCompetitors[0]
  
  // Sum up all "others" (everyone except your brand and top competitor)
  const othersValue = otherCompetitors.slice(1).reduce((sum, c) => sum + c.value, 0)

  // Build the chart data - only include segments that have data
  const result: Array<{
    name: string
    value: number
    color: string
    isYourBrand: boolean
    domain: string | null
  }> = []

  // Add your brand if found (use actual name, not generic "Your Brand")
  if (yourBrand) {
    result.push({
      name: yourBrand.name,
      value: yourBrand.value,
      color: '#3b82f6',
      isYourBrand: true,
      domain: yourBrand.domain || null
    })
  }

  // Add top competitor if found
  if (topCompetitor) {
    result.push({
      name: topCompetitor.name,
      value: topCompetitor.value,
      color: topCompetitor.color || '#8b5cf6',
      isYourBrand: false,
      domain: topCompetitor.domain || null
    })
  }

  // Add "Others" only if there's a meaningful value
  if (othersValue > 0 && otherCompetitors.length > 1) {
    result.push({
      name: 'Others',
      value: othersValue,
      color: '#94a3b8',
      isYourBrand: false,
      domain: null
    })
  }

  return result
}

// ============================================================
// PAGINATION HELPER
// Generates page numbers with ellipsis for pagination
// ============================================================
export function getPageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisiblePages: number = 5
): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = []

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)

    if (currentPage > 3) {
      pages.push('ellipsis')
    }

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i)
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis')
    }

    if (!pages.includes(totalPages)) pages.push(totalPages)
  }

  return pages
}

// ============================================================
// DATE RANGE DISPLAY FORMATTER
// ============================================================
export function formatDateRangeDisplay(from: Date | undefined, to: Date | undefined): string {
  if (!from) return 'All time'
  const fromStr = from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const toStr = to
    ? to.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Present'
  return `${fromStr} – ${toStr}`
}

// ============================================================
// PERIOD LABEL HELPER
// ============================================================
export function getPeriodLabel(from: Date | undefined, to: Date | undefined): string {
  if (!from) return 'All time'
  const toDate = to ?? new Date()
  const days = Math.round((toDate.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))
  if (days <= 7) return 'in selected week'
  if (days <= 31) return 'in selected month'
  return 'in selected period'
}

// ============================================================
// TRAJECTORY COLOR HELPERS
// ============================================================
export function getTrajectoryTextColor(status: string): string {
  switch (status) {
    case 'positive':
      return 'text-green-600 dark:text-green-400'
    case 'negative':
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-yellow-600 dark:text-yellow-400'
  }
}

export function getTrajectoryBgColor(status: string): string {
  switch (status) {
    case 'positive':
      return 'bg-green-100 dark:bg-green-900/30'
    case 'negative':
      return 'bg-red-100 dark:bg-red-900/30'
    default:
      return 'bg-yellow-100 dark:bg-yellow-900/30'
  }
}

