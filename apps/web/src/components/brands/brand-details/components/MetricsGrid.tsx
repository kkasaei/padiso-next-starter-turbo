'use client'

import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { useAnalyticsDateRange } from '@workspace/ui/hooks/use-analytics-date-range'

import type { MetricCardData, DashboardStats, AnalyticsData } from '../types'
import { generateDataForDateRange } from '../utils'
import { MetricCard, MetricCardSkeleton } from './MetricCard'

interface MetricsGridProps {
  projectId: string
  hasData?: boolean
  dashboardStats: DashboardStats | null
}

export function MetricsGrid({ projectId, hasData = true, dashboardStats }: MetricsGridProps) {
  const { dateRange, presetId } = useAnalyticsDateRange()

  // TODO: Replace with actual data fetching when API is ready
  const [analyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading] = useState(false)

  const { metrics, dateRangeLabel } = useMemo(() => {
    const startDate = dateRange.from || new Date()
    const endDate = dateRange.to || new Date()

    let label: string
    switch (presetId) {
      case '24h':
        label = 'Last 24 hours'
        break
      case '7d':
        label = 'Last 7 days'
        break
      case '28d':
        label = 'Last 28 days'
        break
      case '3m':
        label = 'Last 3 months'
        break
      case '6m':
        label = 'Last 6 months'
        break
      case '12m':
        label = 'Last 12 months'
        break
      case '16m':
        label = 'Last 16 months'
        break
      default:
        label = `${format(startDate, 'MMM d')} – ${format(endDate, 'MMM d, yyyy')}`
    }

    const visibilityChartData = analyticsData?.visibilityChartData?.map(d => ({
      label: d.date,
      value: Math.round((d.chatgpt + d.perplexity + d.gemini) / 3),
    })) || generateDataForDateRange(startDate, endDate, 50, 10, 'stable')

    const sentimentScore = analyticsData?.sentimentScore || 0
    const sentimentLabel = sentimentScore >= 70 ? 'Positive' : sentimentScore >= 40 ? 'Neutral' : 'Negative'
    const sentimentTrend: 'up' | 'down' | 'stable' = sentimentScore >= 70 ? 'up' : sentimentScore >= 40 ? 'stable' : 'down'
    const sentimentColor = sentimentScore >= 70 ? '#10b981' : sentimentScore >= 40 ? '#f59e0b' : '#ef4444'

    const realDataAvailable = !isLoading && analyticsData !== null
    const hasAnalyticsData = hasData && realDataAvailable

    const metricsData: MetricCardData[] = [
      {
        title: 'AI Visibility Score',
        description: 'Measures how often your brand appears in AI-generated responses across major AI platforms like ChatGPT, Perplexity, and Claude.',
        value: analyticsData?.overallScore || 0,
        unit: '/100',
        trend: analyticsData?.visibilityTrend || 'stable',
        trendValue: analyticsData?.visibilityTrend === 'up' ? '+5%' : analyticsData?.visibilityTrend === 'down' ? '-5%' : undefined,
        data: visibilityChartData,
        color: '#3b82f6',
        href: `/dashboard/brands/${projectId}/analytics`,
        hasData: hasAnalyticsData,
      },
      {
        title: 'Brand Health',
        description: 'Analyzes sentiment of how AI models describe your brand. Positive means AI mentions are favorable, negative indicates concerns to address.',
        value: sentimentLabel,
        trend: sentimentTrend,
        trendValue: `${sentimentScore}%`,
        data: generateDataForDateRange(startDate, endDate, sentimentScore, 10, sentimentTrend),
        color: sentimentColor,
        href: `/dashboard/brands/${projectId}/analytics`,
        hasData: hasAnalyticsData,
      },
      {
        title: 'Competitors Tracked',
        description: 'Number of competitors being monitored. Shows your position relative to them in AI search results and mentions.',
        value: analyticsData?.competitorCount || 0,
        trend: 'stable',
        data: generateDataForDateRange(startDate, endDate, analyticsData?.competitorCount || 0, 2, 'stable'),
        color: '#ec4899',
        href: `/dashboard/brands/${projectId}/analytics`,
        hasData: hasAnalyticsData,
      },
      {
        title: 'Brand Mentions',
        description: 'Total times your brand has been mentioned in tracked AI prompts and responses during the selected period.',
        value: analyticsData?.brandMentions || 0,
        trend: analyticsData?.visibilityTrend || 'stable',
        trendValue: analyticsData?.brandMentions ? `${analyticsData.brandMentions} total` : undefined,
        data: generateDataForDateRange(startDate, endDate, analyticsData?.brandMentions || 0, 5, analyticsData?.visibilityTrend || 'stable'),
        color: '#8b5cf6',
        href: `/dashboard/brands/${projectId}/analytics`,
        hasData: hasAnalyticsData,
      },
      {
        title: 'Website Health',
        description: 'Technical SEO score based on site performance, accessibility, indexability, and AI-friendliness of your content structure.',
        value: dashboardStats?.websiteHealth ?? 0,
        unit: '/100',
        trend: 'stable',
        data: generateDataForDateRange(startDate, endDate, dashboardStats?.websiteHealth ?? 50, 5, 'stable'),
        color: '#06b6d4',
        href: `/dashboard/brands/${projectId}/audit`,
        hasData: hasData && dashboardStats?.websiteHealth !== null,
      },
      {
        title: 'Open Opportunities',
        description: 'Actionable recommendations to improve your AI visibility. Lower is better – means you\'ve addressed most suggestions.',
        value: dashboardStats?.openOpportunities ?? 0,
        trend: 'stable',
        data: generateDataForDateRange(startDate, endDate, dashboardStats?.openOpportunities ?? 5, 3, 'stable'),
        color: '#f59e0b',
        href: `/dashboard/brands/${projectId}/opportunities`,
        hasData: hasData,
      },
    ]

    return { metrics: metricsData, dateRangeLabel: label }
  }, [dateRange, presetId, projectId, hasData, analyticsData, dashboardStats, isLoading])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <MetricCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {metrics.map((metric, index) => (
        <MetricCard key={metric.title} metric={metric} index={index} dateRangeLabel={dateRangeLabel} />
      ))}
    </div>
  )
}
