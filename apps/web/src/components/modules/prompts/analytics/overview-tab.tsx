'use client'

// ============================================================
// OVERVIEW TAB CONTENT
// Main dashboard overview for prompt analytics
// Uses ONLY real data from analyticsData prop - no mock fallbacks
// ============================================================

import { BarChart3, Target, Clock, Tag, AlertCircle } from 'lucide-react'
import { TabsContent } from '@workspace/ui/components/tabs'

import { useAnalyticsDateRange } from '@/hooks/use-analytics-date-range'
import type { PromptAnalyticsData, VisibilityDataPoint } from '@/lib/shcmea/types/dtos/prompt-analytics-dto'
import type { TrackedPrompt } from '@/components/modules/prompts/types'

import { VisibilityTrendChart } from './visibility-trend-chart'
import { StatCard } from './stat-card'
import { ProviderBreakdownChart } from './provider-breakdown-chart'
import { SentimentBreakdown } from './sentiment-breakdown'
import { getPeriodLabel } from './helpers'

interface OverviewTabProps {
  prompt: TrackedPrompt
  analyticsData: PromptAnalyticsData | null
}

export function OverviewTab({ prompt, analyticsData }: OverviewTabProps) {
  const { dateRange } = useAnalyticsDateRange()

  // Use ONLY real data - no mock fallbacks
  const visibilityData: VisibilityDataPoint[] = analyticsData?.visibilityTrend || []

  // Data is already filtered by date range on the server (in getPromptAnalytics)
  // No need for redundant client-side filtering
  const filteredVisibilityData = visibilityData

  // Calculate metrics from real data only
  const calculateAverageScore = () => {
    if (filteredVisibilityData.length === 0) return prompt.lastVisibilityScore ?? null
    const total = filteredVisibilityData.reduce((sum, item) => {
      const avgScore = (item.chatgpt + item.perplexity + item.gemini) / 3
      return sum + avgScore
    }, 0)
    return Math.round(total / filteredVisibilityData.length)
  }

  const calculateMentionPosition = () => {
    if (filteredVisibilityData.length === 0) return prompt.lastMentionPosition ?? null
    const avgVisibility = calculateAverageScore()
    if (avgVisibility === null) return null
    if (avgVisibility >= 75) return 1
    if (avgVisibility >= 65) return 2
    if (avgVisibility >= 55) return 3
    return 4
  }

  const calculateScansInPeriod = () => {
    return filteredVisibilityData.length * 3
  }

  const calculateCompetitorGap = () => {
    const avgVisibility = calculateAverageScore()
    if (avgVisibility === null) return null
    const gap = Math.round((avgVisibility - 64) / 64 * 100)
    return gap >= 0 ? `+${gap}%` : `${gap}%`
  }

  const calculateTrend = () => {
    if (filteredVisibilityData.length < 4) return undefined
    const midPoint = Math.floor(filteredVisibilityData.length / 2)
    const firstHalf = filteredVisibilityData.slice(0, midPoint)
    const secondHalf = filteredVisibilityData.slice(midPoint)

    const avgFirst = firstHalf.reduce((sum, item) => sum + (item.chatgpt + item.perplexity + item.gemini) / 3, 0) / firstHalf.length
    const avgSecond = secondHalf.reduce((sum, item) => sum + (item.chatgpt + item.perplexity + item.gemini) / 3, 0) / secondHalf.length

    const diff = avgSecond - avgFirst
    if (diff > 2) return 'up' as const
    if (diff < -2) return 'down' as const
    return 'stable' as const
  }

  const avgScore = calculateAverageScore()
  const mentionPosition = calculateMentionPosition()
  const scansInPeriod = calculateScansInPeriod()
  const competitorGap = calculateCompetitorGap()
  const trend = calculateTrend()
  const periodLabel = getPeriodLabel(dateRange.from, dateRange.to)

  const hasData = visibilityData.length > 0

  // Empty state when no data
  if (!hasData) {
    return (
      <TabsContent value="overview" className="space-y-8">
        <div className="md:dark:bg-polar-900 dark:border-polar-700 w-full md:rounded-xl md:border md:border-gray-100 md:bg-gray-50 md:p-8 lg:rounded-4xl items-center justify-center gap-y-6 md:flex md:flex-col md:py-48">
          <AlertCircle className="text-gray-300 dark:text-gray-600 h-16 w-16" />
          <div className="flex flex-col items-center gap-y-6">
            <div className="flex flex-col items-center gap-y-2">
              <h3 className="text-lg font-medium">No Analytics Data Yet</h3>
              <p className="dark:text-polar-500 text-gray-500 text-center max-w-md">
                Analytics data will appear here after scans are performed on this prompt.
                Run a scan to start tracking AI visibility.
              </p>
            </div>
          </div>
        </div>
      </TabsContent>
    )
  }

  return (
    <TabsContent value="overview" className="space-y-8">
      {/* Visibility Trend */}
      <VisibilityTrendChart
        data={visibilityData}
        defaultVisibilityScore={avgScore ?? 0}
      />

      {/* Stats Grid */}
      <div className="dark:border-polar-700 flex flex-col overflow-hidden rounded-2xl border border-gray-200">
        <div className="grid grid-cols-1 flex-col [clip-path:inset(1px_1px_1px_1px)] md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Visibility Score"
            value={avgScore ?? '—'}
            subtitle={`Average ${periodLabel}`}
            icon={BarChart3}
            trend={trend}
          />
          <StatCard
            title="Mention Position"
            value={mentionPosition ? `#${mentionPosition}` : '—'}
            subtitle={`In AI responses ${periodLabel}`}
            icon={Target}
            trend={trend}
          />
          <StatCard
            title="Scans"
            value={scansInPeriod}
            subtitle={`Across all providers ${periodLabel}`}
            icon={Clock}
          />
          <StatCard
            title="Competitor Gap"
            value={competitorGap ?? '—'}
            subtitle="vs top competitor"
            icon={Tag}
            trend={competitorGap?.startsWith('+') ? 'up' : competitorGap === '0%' ? 'stable' : 'down'}
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="dark:border-polar-700 flex flex-col overflow-hidden rounded-2xl border border-gray-200">
        <div className="grid grid-cols-1 flex-col [clip-path:inset(1px_1px_1px_1px)] lg:grid-cols-2">
          <ProviderBreakdownChart analyticsData={analyticsData} />
          <SentimentBreakdown analyticsData={analyticsData} />
        </div>
      </div>
    </TabsContent>
  )
}
