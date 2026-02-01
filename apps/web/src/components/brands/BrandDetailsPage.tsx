'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { format, eachDayOfInterval, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardHeader } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { Input } from '@workspace/ui/components/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { MoreVertical, ArrowUpRight, TrendingUp, TrendingDown, Minus, HelpCircle, Sparkles, Rocket, Search, ArrowLeft, FileText, Clock, User, ChevronRight, Loader2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@workspace/ui/components/chart'
import { AnalyticsDatePicker } from '@workspace/ui/components/analytics-date-picker'
import { AnalyticsDateRangeProvider, useAnalyticsDateRange } from '@workspace/ui/hooks/use-analytics-date-range'
import { ACTIVITY_TYPE_LABELS, type ProjectActivityDto } from '@workspace/common/lib/shcmea/types/activity'
import type { ContentDraftDto } from '@workspace/common/lib/shcmea/types/content'
import { CONTENT_STATUS_CONFIG } from '@workspace/common/lib/shcmea/types/content'
import { ActiveBrandProvider, useActiveBrand } from '@/hooks/use-active-brand'
import { useBrand } from '@/hooks/use-brands'
import { cn } from '@workspace/ui/lib/utils'
import { Skeleton } from '@workspace/ui/components/skeleton'

// ============================================================
// TYPE DEFINITIONS
// ============================================================
interface MetricDataPoint {
  label: string
  value: number
}

interface MetricCardData {
  title: string
  description: string // Tooltip description
  value: string | number
  unit?: string
  trend: 'up' | 'down' | 'stable'
  trendValue?: string
  data: MetricDataPoint[]
  color: string
  href?: string
  hasData?: boolean // Whether this metric has real data
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

// ============================================================
// BRAND STATUS BADGE COMPONENT
// ============================================================
function BrandStatusBadge({ status }: { status: string }) {
  const getStatusStyles = () => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
      case 'PAUSED':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400'
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
      case 'DELETED':
        return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  return (
    <div className={`flex flex-row items-center justify-center rounded-[0.5em] px-[0.7em] py-[0.3em] text-sm ${getStatusStyles()}`}>
      {status}
    </div>
  )
}

// ============================================================
// TREND ICON COMPONENT
// ============================================================
function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />
  if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />
  return <Minus className="h-4 w-4 text-muted-foreground" />
}

// ============================================================
// CHART CONFIGURATIONS
// ============================================================
const createChartConfig = (color: string): ChartConfig => ({
  value: {
    label: 'Value',
    color: color,
  },
})

// ============================================================
// GENERATE DATA BASED ON DATE RANGE
// ============================================================
function generateDataForDateRange(
  startDate: Date,
  endDate: Date,
  baseValue: number,
  variance: number,
  trend: 'up' | 'down' | 'stable'
): MetricDataPoint[] {
  const days = eachDayOfInterval({ start: startDate, end: endDate })
  const totalDays = days.length

  return days.map((date, index) => {
    // Add trend bias to make charts look more realistic
    const trendMultiplier = totalDays > 1 ? index / (totalDays - 1) : 0
    const trendBias = trend === 'up'
      ? trendMultiplier * variance * 0.5
      : trend === 'down'
        ? -trendMultiplier * variance * 0.5
        : 0

    // Use date-based seed for consistent randomness
    const seed = date.getTime() % 1000
    const randomVariance = ((seed / 1000) * variance) - (variance / 2)
    const value = Math.max(0, baseValue + trendBias + randomVariance)

    // Format label based on date range length
    let label: string
    if (totalDays <= 7) {
      label = format(date, 'EEE') // Mon, Tue, etc.
    } else if (totalDays <= 31) {
      label = format(date, 'MMM d') // Dec 25
    } else {
      label = format(date, 'MMM d') // Dec 25
    }

  return {
      label,
      value: Math.round(value),
    }
  })
}

// ============================================================
// METRIC CARD COMPONENT
// ============================================================
function MetricCard({ metric, index, dateRangeLabel }: { metric: MetricCardData; index: number; dateRangeLabel: string }) {
  const chartConfig = createChartConfig(metric.color)

  // Calculate tick interval based on data length
  const tickInterval = metric.data.length > 14 ? Math.ceil(metric.data.length / 7) : 0

  // Check if metric has real data
  const hasData = metric.hasData !== false

  const content = (
    <div className="group flex w-full flex-col justify-between rounded-xl border border-transparent bg-gray-50 p-2 shadow-xs transition-all hover:shadow-md dark:border-polar-700 dark:bg-polar-800 lg:rounded-4xl">
          <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
            <div className="flex w-full flex-col gap-y-4">
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-x-2">
                <h3 className="text-lg">{metric.title}</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="text-gray-400 hover:text-gray-600 dark:text-polar-500 dark:hover:text-polar-300 transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-sm">{metric.description}</p>
                </TooltipContent>
              </Tooltip>
              </div>
            {hasData && <TrendIcon trend={metric.trend} />}
          </div>
          {hasData ? (
            <>
              <div className="flex items-baseline gap-x-2">
              <h2 className="text-5xl font-light">{metric.value}</h2>
                {metric.unit && (
                  <span className="text-2xl text-gray-400 dark:text-polar-500">{metric.unit}</span>
                )}
              </div>
              <div className="flex flex-col gap-x-6 gap-y-2 md:flex-row md:items-center">
                <div className="flex flex-row items-center gap-x-2 text-sm">
                  <span
                    className="h-3 w-3 rounded-full border-2"
                    style={{ borderColor: metric.color }}
                  />
                  <span className="text-gray-500 dark:text-polar-500">{dateRangeLabel}</span>
                  {metric.trendValue && (
                    <span className={cn(
                      "font-medium",
                      metric.trend === 'up' && "text-green-600 dark:text-green-400",
                      metric.trend === 'down' && "text-red-600 dark:text-red-400",
                      metric.trend === 'stable' && "text-gray-500 dark:text-polar-500"
                    )}>
                      {metric.trendValue}
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <div className="mb-3 rounded-full bg-gray-200 p-3 dark:bg-polar-700">
                <Sparkles className="h-6 w-6 text-gray-400 dark:text-polar-500" />
            </div>
              <p className="text-sm text-gray-500 dark:text-polar-500">
                No data yet
              </p>
              <p className="text-xs text-gray-400 dark:text-polar-600 mt-1">
                Data will appear once tracking starts
              </p>
            </div>
          )}
        </div>
        {metric.href && hasData && (
            <div className="flex flex-row items-center gap-x-4">
              <Button
                variant="ghost"
                size="icon"
              className="rounded-full opacity-0 transition-opacity group-hover:opacity-100"
              >
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
        )}
          </div>
      {hasData ? (
          <div className="flex w-full flex-col gap-y-2 rounded-3xl bg-white p-4 dark:bg-polar-900">
          <ChartContainer config={chartConfig} className="aspect-video h-[200px] w-full">
              <AreaChart
                data={metric.data}
                margin={{
                  left: 12,
                  right: 12,
                  top: 12,
                  bottom: 12,
                }}
              >
              <CartesianGrid strokeDasharray="6 6" vertical={false} className="stroke-gray-200 dark:stroke-polar-700" />
                <XAxis
                dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                className="text-xs"
                interval={tickInterval}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id={`areaGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={metric.color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={metric.color} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="value"
                type="monotone"
                  fill={`url(#areaGradient-${index})`}
                fillOpacity={1}
                stroke={metric.color}
                strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </div>
      ) : (
        <div className="flex w-full flex-col items-center justify-center rounded-3xl bg-white p-8 dark:bg-polar-900">
          <div className="flex h-[200px] w-full items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="h-16 w-full rounded-lg bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-polar-800 dark:via-polar-700 dark:to-polar-800 animate-pulse" />
              <div className="h-12 w-3/4 rounded-lg bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-polar-800 dark:via-polar-700 dark:to-polar-800 animate-pulse" />
              <p className="text-xs text-gray-400 dark:text-polar-600 mt-2">
                Chart will display here
              </p>
        </div>
          </div>
        </div>
      )}
    </div>
  )

  if (metric.href) {
    return <Link href={metric.href}>{content}</Link>
  }

  return content
}

// ============================================================
// METRIC CARD SKELETON - Loading state matching actual card style
// ============================================================
function MetricCardSkeleton() {
  return (
    <div className="group flex w-full flex-col justify-between rounded-xl border border-transparent bg-gray-50 p-2 shadow-xs dark:border-polar-700 dark:bg-polar-800 lg:rounded-4xl">
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
        <div className="flex w-full flex-col gap-y-4">
          {/* Title row */}
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-x-2">
              <div className="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-polar-700" />
              <div className="h-4 w-4 animate-pulse rounded-full bg-gray-200 dark:bg-polar-700" />
            </div>
            <div className="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-polar-700" />
          </div>
          {/* Value */}
          <div className="flex items-baseline gap-x-2">
            <div className="h-12 w-20 animate-pulse rounded bg-gray-200 dark:bg-polar-700" />
            <div className="h-6 w-8 animate-pulse rounded bg-gray-200 dark:bg-polar-700" />
          </div>
          {/* Date range label */}
          <div className="flex flex-row items-center gap-x-2">
            <div className="h-3 w-3 animate-pulse rounded-full bg-gray-200 dark:bg-polar-700" />
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-polar-700" />
            <div className="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-polar-700" />
          </div>
        </div>
      </div>
      {/* Chart area */}
      <div className="flex w-full flex-col gap-y-2 rounded-3xl bg-white p-4 dark:bg-polar-900">
        <div className="h-[200px] w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-polar-800 dark:via-polar-700 dark:to-polar-800" />
      </div>
    </div>
  )
}

// ============================================================
// METRICS GRID COMPONENT (Uses Date Range Context + Real Data)
// ============================================================
interface MetricsGridProps {
  brandId: string
  hasData?: boolean
  dashboardStats: any | null
}

function MetricsGrid({ brandId, hasData = true, dashboardStats }: MetricsGridProps) {
  const { dateRange, presetId } = useAnalyticsDateRange()
  const [analyticsData, setAnalyticsData] = useState<{
    overallScore: number
    brandMentions: number
    sentimentScore: number
    visibilityTrend: 'up' | 'down' | 'stable'
    competitorCount: number
    visibilityChartData: Array<{ date: string; chatgpt: number; perplexity: number; gemini: number }>
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Data fetching removed - useAction calls commented out
  useEffect(() => {
    // TODO: Implement data fetching
    setIsLoading(false)
  }, [brandId, dateRange.from, dateRange.to])

  const { metrics, dateRangeLabel } = useMemo(() => {
    const startDate = dateRange.from || new Date()
    const endDate = dateRange.to || new Date()

    // Create readable label
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

    // Transform visibility trend data into chart format
    const visibilityChartData = analyticsData?.visibilityChartData?.map(d => ({
      label: d.date,
      value: Math.round((d.chatgpt + d.perplexity + d.gemini) / 3),
    })) || generateDataForDateRange(startDate, endDate, 50, 10, 'stable')

    // Determine sentiment label based on score
    const sentimentScore = analyticsData?.sentimentScore || 0
    const sentimentLabel = sentimentScore >= 70 ? 'Positive' : sentimentScore >= 40 ? 'Neutral' : 'Negative'
    const sentimentTrend: 'up' | 'down' | 'stable' = sentimentScore >= 70 ? 'up' : sentimentScore >= 40 ? 'stable' : 'down'
    const sentimentColor = sentimentScore >= 70 ? '#10b981' : sentimentScore >= 40 ? '#f59e0b' : '#ef4444'

    // Real data from analytics + dashboard stats
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
        color: '#3b82f6', // blue
        href: `/dashboard/brands/${brandId}/analytics`,
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
        href: `/dashboard/brands/${brandId}/analytics`,
        hasData: hasAnalyticsData,
      },
      {
        title: 'Competitors Tracked',
        description: 'Number of competitors being monitored. Shows your position relative to them in AI search results and mentions.',
        value: analyticsData?.competitorCount || 0,
        trend: 'stable',
        data: generateDataForDateRange(startDate, endDate, analyticsData?.competitorCount || 0, 2, 'stable'),
        color: '#ec4899', // pink
        href: `/dashboard/brands/${brandId}/analytics`,
        hasData: hasAnalyticsData,
      },
      {
        title: 'Brand Mentions',
        description: 'Total times your brand has been mentioned in tracked AI prompts and responses during the selected period.',
        value: analyticsData?.brandMentions || 0,
        trend: analyticsData?.visibilityTrend || 'stable',
        trendValue: analyticsData?.brandMentions ? `${analyticsData.brandMentions} total` : undefined,
        data: generateDataForDateRange(startDate, endDate, analyticsData?.brandMentions || 0, 5, analyticsData?.visibilityTrend || 'stable'),
        color: '#8b5cf6', // purple
        href: `/dashboard/brands/${brandId}/analytics`,
        hasData: hasAnalyticsData,
      },
      {
        title: 'Website Health',
        description: 'Technical SEO score based on site performance, accessibility, indexability, and AI-friendliness of your content structure.',
        value: dashboardStats?.websiteHealth ?? 0,
        unit: '/100',
        trend: 'stable',
        data: generateDataForDateRange(startDate, endDate, dashboardStats?.websiteHealth ?? 50, 5, 'stable'),
        color: '#06b6d4', // cyan
        href: `/dashboard/brands/${brandId}/audit`,
        hasData: hasData && dashboardStats?.websiteHealth !== null,
      },
      {
        title: 'Open Opportunities',
        description: 'Actionable recommendations to improve your AI visibility. Lower is better – means you\'ve addressed most suggestions.',
        value: dashboardStats?.openOpportunities ?? 0,
        trend: 'stable',
        data: generateDataForDateRange(startDate, endDate, dashboardStats?.openOpportunities ?? 5, 3, 'stable'),
        color: '#f59e0b', // amber
        href: `/dashboard/brands/${brandId}/opportunities`,
        hasData: hasData,
      },
    ]

    return { metrics: metricsData, dateRangeLabel: label }
  }, [dateRange, presetId, brandId, hasData, analyticsData, dashboardStats, isLoading])

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

// ============================================================
// CONTENT TAB COMPONENT
// ============================================================
function ContentTab({ brandId }: { brandId: string }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [content, setContent] = useState<ContentDraftDto[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Data fetching removed - useAction calls commented out
  useEffect(() => {
    // TODO: Implement content fetching
    setIsLoading(false)
  }, [brandId, statusFilter, searchQuery, currentPage, pageSize])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const validCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (validCurrentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)

  return (
    <TabsContent value="content" className="space-y-8">
      <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
          <div className="flex w-full flex-col gap-y-2">
            <span className="text-lg font-semibold">Content Drafts</span>
            <p className="text-sm text-muted-foreground">
              All content pieces for this brand. Click to edit or view details.
            </p>
          </div>

          <div className="flex shrink-0 flex-row items-center gap-2">
            {(['all', 'DRAFT', 'REVIEW', 'PUBLISHED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => { setStatusFilter(status); setCurrentPage(1) }}
                className={cn(
                  'flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all',
                  statusFilter === status
                    ? 'bg-card shadow-sm ring-1 ring-border'
                    : 'opacity-50 hover:opacity-75'
                )}
              >
                <span>{status === 'all' ? 'All' : CONTENT_STATUS_CONFIG[status].label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                className="pl-9 h-9"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Updated</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 text-muted-foreground/50 animate-spin" />
                        <p className="text-sm text-muted-foreground">Loading content...</p>
                      </div>
                    </td>
                  </tr>
                ) : content.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-8 w-8 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">
                          {searchQuery || statusFilter !== 'all' ? 'No content matches your filters' : 'No content drafts yet'}
                        </p>
                        {(searchQuery || statusFilter !== 'all') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setSearchQuery(''); setStatusFilter('all') }}
                            className="text-primary"
                          >
                            Clear filters
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  content.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                            <FileText className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium">{item.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={cn("text-xs", CONTENT_STATUS_CONFIG[item.status].bgColor, CONTENT_STATUS_CONFIG[item.status].color)}>
                          {CONTENT_STATUS_CONFIG[item.status].label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-muted-foreground">
                          {new Date(item.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-4 px-6 py-4 border-t border-border bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {totalItems > 0 ? startIndex + 1 : 0}–{endIndex} of {totalItems} items
            </div>
            <div className="flex items-center gap-4">
              <Select value={pageSize.toString()} onValueChange={(value) => { setPageSize(Number(value)); setCurrentPage(1) }}>
                <SelectTrigger className="w-[70px] h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((size) => (<SelectItem key={size} value={size.toString()}>{size}</SelectItem>))}
                </SelectContent>
              </Select>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={validCurrentPage === 1} className="h-8 px-2">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span className="px-2 text-sm text-muted-foreground">{validCurrentPage} / {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={validCurrentPage === totalPages} className="h-8 px-2">
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  )
}

// ============================================================
// ACTIVITIES TAB COMPONENT
// ============================================================
function ActivitiesTab({ brandId }: { brandId: string }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [activities, setActivities] = useState<ProjectActivityDto[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Data fetching removed - useAction calls commented out
  useEffect(() => {
    // TODO: Implement activities fetching
    setIsLoading(false)
  }, [brandId, currentPage, pageSize])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const validCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (validCurrentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'BRAND_CREATED':
      case 'PROJECT_CREATED':
        return <Sparkles className="h-4 w-4 text-green-500" />
      case 'BRAND_UPDATED':
      case 'PROJECT_UPDATED':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'BRAND_DELETED':
      case 'PROJECT_DELETED':
        return <Clock className="h-4 w-4 text-red-500" />
      case 'BRAND_FAVORITED':
      case 'PROJECT_FAVORITED':
        return <TrendingUp className="h-4 w-4 text-yellow-500" />
      case 'BRAND_UNFAVORITED':
      case 'PROJECT_UNFAVORITED':
        return <TrendingDown className="h-4 w-4 text-gray-500 dark:text-polar-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500 dark:text-polar-500" />
    }
  }

  const formatMetadata = (activity: ProjectActivityDto) => {
    if (!activity.metadata || Object.keys(activity.metadata).length === 0) {
      return null
    }
    if (activity.metadata.field) {
      return (
        <span className="text-muted-foreground">
          Changed <span className="font-medium text-foreground">{activity.metadata.field}</span>
          {activity.metadata.from && (
            <>
              {' from '}<span className="font-medium text-foreground">&quot;{activity.metadata.from || 'empty'}&quot;</span>
            </>
          )}
          {activity.metadata.to && (
            <>
              {' to '}<span className="font-medium text-foreground">&quot;{activity.metadata.to}&quot;</span>
            </>
          )}
        </span>
      )
    }
    return null
  }

  return (
    <TabsContent value="activities" className="space-y-8">
      <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
          <div className="flex w-full flex-col gap-y-2">
            <span className="text-lg font-semibold">Activity Log</span>
            <p className="text-sm text-muted-foreground">
              Audit trail of all changes made to this brand.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 text-muted-foreground/50 animate-spin" />
                        <p className="text-sm text-muted-foreground">Loading activities...</p>
                      </div>
                    </td>
                  </tr>
                ) : activities.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Clock className="h-8 w-8 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">No activity recorded yet</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  activities.map((activity) => (
                    <tr
                      key={activity.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm">
                            {new Date(activity.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(activity.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getActivityIcon(activity.type)}
                          <span className="text-sm font-medium">{ACTIVITY_TYPE_LABELS[activity.type]}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                          <span className="text-sm">{activity.performedByUserId || 'System'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm">
                          {formatMetadata(activity) || <span className="text-muted-foreground">—</span>}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-4 px-6 py-4 border-t border-border bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {totalItems > 0 ? startIndex + 1 : 0}–{endIndex} of {totalItems} activities
            </div>
            <div className="flex items-center gap-4">
              <Select value={pageSize.toString()} onValueChange={(value) => { setPageSize(Number(value)); setCurrentPage(1) }}>
                <SelectTrigger className="w-[70px] h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((size) => (<SelectItem key={size} value={size.toString()}>{size}</SelectItem>))}
                </SelectContent>
              </Select>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={validCurrentPage === 1} className="h-8 px-2">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span className="px-2 text-sm text-muted-foreground">{validCurrentPage} / {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={validCurrentPage === totalPages} className="h-8 px-2">
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  )
}

// ============================================================
// OPPORTUNITIES BAR CHART (Uses Date Range Context + Real Data)
// ============================================================
function OpportunitiesChart({ brandId }: { brandId: string }) {
  const { dateRange, presetId } = useAnalyticsDateRange()
  const [rawData, setRawData] = useState<Array<{ date: string; count: number }>>([])
  const [totalOpportunities, setTotalOpportunities] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Data fetching removed - useAction calls commented out
  useEffect(() => {
    // TODO: Implement opportunities data fetching
    setIsLoading(false)
  }, [brandId, dateRange])

  // Process and group data based on date range
  const { opportunitiesData, dateRangeLabel, gridCols } = useMemo(() => {
    const endDate = dateRange.to || new Date()
    const startDate = dateRange.from || subMonths(endDate, 5)
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    // Create a map of date -> count from raw data
    const dateCountMap = new Map<string, number>()
    for (const item of rawData) {
      dateCountMap.set(item.date, item.count)
    }

    let data: Array<{ label: string; count: number }>
    let label: string
    let cols: number

    if (daysDiff <= 7) {
      // Show daily data for short ranges
      const days = eachDayOfInterval({ start: startDate, end: endDate })
      data = days.map((day) => {
        const dateKey = format(day, 'yyyy-MM-dd')
        return {
          label: format(day, 'EEE'),
          count: dateCountMap.get(dateKey) || 0,
        }
      })
      label = presetId === '24h' ? 'Last 24 Hours' : 'Last 7 Days'
      cols = Math.min(days.length, 7)
    } else if (daysDiff <= 31) {
      // Show weekly data for medium ranges
      const weeks: Date[] = []
      let current = startDate
      while (current <= endDate) {
        weeks.push(current)
        current = new Date(current.getTime() + 7 * 24 * 60 * 60 * 1000)
      }
      data = weeks.slice(0, 4).map((weekStart, i) => {
        const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
        // Sum counts for all days in this week
        let weekCount = 0
        const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd > endDate ? endDate : weekEnd })
        for (const day of daysInWeek) {
          const dateKey = format(day, 'yyyy-MM-dd')
          weekCount += dateCountMap.get(dateKey) || 0
        }
        return {
          label: `Week ${i + 1}`,
          count: weekCount,
        }
      })
      label = 'Last 28 Days'
      cols = Math.min(data.length, 4)
    } else {
      // Show monthly data for longer ranges
      const months = eachMonthOfInterval({ start: startOfMonth(startDate), end: endOfMonth(endDate) })
      data = months.map((month) => {
        // Sum counts for all days in this month
        let monthCount = 0
        const daysInMonth = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) })
        for (const day of daysInMonth) {
          const dateKey = format(day, 'yyyy-MM-dd')
          monthCount += dateCountMap.get(dateKey) || 0
        }
        return {
          label: format(month, 'MMM'),
          count: monthCount,
        }
      })

      // Create label based on preset
      switch (presetId) {
        case '3m':
          label = 'Last 3 Months'
          break
        case '6m':
          label = 'Last 6 Months'
          break
        case '12m':
          label = 'Last 12 Months'
          break
        case '16m':
          label = 'Last 16 Months'
          break
        default:
          label = `${format(startDate, 'MMM yyyy')} – ${format(endDate, 'MMM yyyy')}`
      }
      cols = Math.min(data.length, 6)
    }

    return { opportunitiesData: data, dateRangeLabel: label, gridCols: cols }
  }, [dateRange, presetId, rawData])

  const maxOpportunities = Math.max(...opportunitiesData.map(m => m.count), 1)
  const hasData = totalOpportunities > 0

  // Explicit grid class mapping - Tailwind doesn't support dynamic class names
  const gridColsClassMap: Record<number, string> = {
    1: 'grid-cols-1 lg:grid-cols-1',
    2: 'grid-cols-2 lg:grid-cols-2',
    3: 'grid-cols-3 lg:grid-cols-3',
    4: 'grid-cols-4 lg:grid-cols-4',
    5: 'grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-3 lg:grid-cols-6',
    7: 'grid-cols-4 lg:grid-cols-7',
  }
  const gridColsClass = gridColsClassMap[gridCols] || 'grid-cols-3 lg:grid-cols-6'

  return (
    <div className="flex w-full flex-col gap-y-8 rounded-4xl border border-transparent bg-gray-50 p-6 text-gray-950 shadow-none dark:border-transparent dark:bg-polar-800 dark:text-white">
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg text-gray-500 dark:text-polar-500">
            {dateRangeLabel}
          </h2>
        </div>
        <div className="flex items-center gap-x-3">
          <h3 className="text-4xl font-light">Opportunities</h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-gray-400 hover:text-gray-600 dark:text-polar-500 dark:hover:text-polar-300 transition-colors">
                <HelpCircle className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-sm">Tracks AI visibility improvement opportunities identified for your brand. Each opportunity helps improve your presence in AI search results.</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 text-muted-foreground/50 animate-spin" />
          <p className="mt-2 text-sm text-muted-foreground">Loading opportunities...</p>
        </div>
      ) : hasData ? (
        <div className={`grid gap-4 lg:gap-6 ${gridColsClass}`}>
          {opportunitiesData.map((item, index) => {
            const height = maxOpportunities > 0 ? (item.count / maxOpportunities) * 100 : 0
            const isLast = index === opportunitiesData.length - 1
            return (
              <div key={`${item.label}-${index}`} className="flex flex-col gap-y-2">
                <div
                  className="relative h-48 overflow-hidden rounded-2xl bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.05),rgba(0,0,0,0.05)_2px,transparent_2px,transparent_8px)] dark:bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.03),rgba(255,255,255,0.03)_2px,transparent_2px,transparent_8px)]"
                >
                  <div
                    className={`absolute bottom-0 w-full rounded-2xl transition-all ${
                      isLast
                        ? 'bg-amber-400 dark:bg-amber-500'
                        : 'bg-gray-300 dark:bg-polar-600'
                    }`}
                    style={{ height: `${Math.max(height, item.count > 0 ? 5 : 0)}%` }}
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm lg:text-base">{item.label}</span>
                  <div className="flex flex-row items-center justify-between gap-x-2">
                    <span className="text-sm text-gray-500 dark:text-polar-500">
                      {item.count} {item.count === 1 ? 'opportunity' : 'opportunities'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <div className="mb-4 rounded-full bg-gray-200 p-4 dark:bg-polar-700">
            <Rocket className="h-8 w-8 text-gray-400 dark:text-polar-500" />
          </div>
          <h4 className="text-lg font-medium text-gray-700 dark:text-polar-300">No opportunities yet</h4>
          <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-polar-500">
            Once we start tracking your AI visibility, we&apos;ll identify opportunities to improve your brand&apos;s presence.
          </p>
        </div>
      )}
    </div>
  )
}

// ============================================================
// PAGE CONTENT (Uses Date Range Context)
// ============================================================
function PageContent() {
  const router = useRouter()
  const brand = useActiveBrand()

  // ============================================================
  // DASHBOARD STATS STATE
  // ============================================================
  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  // Data fetching removed - useAction calls commented out
  useEffect(() => {
    // TODO: Implement dashboard stats fetching
    setIsLoadingStats(false)
  }, [brand.id])

  // ============================================================
  // DELETE BRAND ACTION
  // ============================================================
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this brand? This action cannot be undone.')) {
      // TODO: Implement delete functionality
      toast.error('Delete functionality not implemented')
    }
  }

  // Stats for the top cards - using real data from database
  const stats = {
    trackedPrompts: dashboardStats?.trackedPrompts ?? 0,
    activeKeywords: brand.businessKeywords?.length || 0,
    openOpportunities: dashboardStats?.openOpportunities ?? 0,
  }

  // Determine if brand has data based on actual tracked prompts
  const hasBrandData = !isLoadingStats && (dashboardStats?.trackedPrompts ?? 0) > 0

  return (
    <div className="relative flex min-w-0 flex-2 flex-col items-center md:overflow-y-auto md:bg-white md:shadow-xs">
      <div className="flex h-full w-full flex-col">

        {/* Tabs Container */}
        <Tabs defaultValue="overview" className="w-full">
          {/* Tab Navigation */}
          <div className="flex items-center justify-between overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6">
            <TabsList className="bg-transparent ring-0 dark:bg-transparent dark:ring-0 p-1 gap-2 w-max md:w-auto">
              <TabsTrigger
                value="overview"
                className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="content"
                className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Content
              </TabsTrigger>
              <TabsTrigger
                value="activities"
                className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Activities
              </TabsTrigger>
            </TabsList>

            <AnalyticsDatePicker />
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-12 pb-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Link href={`/dashboard/brands/${brand.id}/prompts`}>
                <Card className="rounded-2xl border border-transparent bg-gray-100 text-gray-950 shadow-none transition-all hover:shadow-md dark:border-transparent dark:bg-polar-800 dark:text-white">
                  <CardHeader className="flex flex-row items-center gap-2 pb-2">
                      <span className="text-gray-500 dark:text-polar-500">
                      Tracked Prompts
                      </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-gray-400 hover:text-gray-600 dark:text-polar-500 dark:hover:text-polar-300 transition-colors">
                          <HelpCircle className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p className="text-sm">Search queries and prompts being monitored across AI platforms to track your brand&apos;s visibility.</p>
                      </TooltipContent>
                    </Tooltip>
                    </CardHeader>
                    <CardContent className="pt-0">
                    <h3 className="text-2xl">{hasBrandData ? stats.trackedPrompts : '—'}</h3>
                    </CardContent>
                  </Card>
              </Link>
                  <Card className="rounded-2xl border border-transparent bg-gray-100 text-gray-950 shadow-none dark:border-transparent dark:bg-polar-800 dark:text-white">
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                      <span className="text-gray-500 dark:text-polar-500">
                        Active Keywords
                      </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-gray-400 hover:text-gray-600 dark:text-polar-500 dark:hover:text-polar-300 transition-colors">
                        <HelpCircle className="h-3.5 w-3.5" />
                      </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p className="text-sm">Target keywords configured for this brand, used for SEO and AI visibility tracking.</p>
                      </TooltipContent>
                    </Tooltip>
                    </CardHeader>
                    <CardContent className="pt-0">
                  <h3 className="text-2xl">{stats.activeKeywords}</h3>
                    </CardContent>
                  </Card>
              <Link href={`/dashboard/brands/${brand.id}/opportunities`}>
                <Card className="rounded-2xl border border-transparent bg-gray-100 text-gray-950 shadow-none transition-all hover:shadow-md dark:border-transparent dark:bg-polar-800 dark:text-white">
                  <CardHeader className="flex flex-row items-center gap-2 pb-2">
                      <span className="text-gray-500 dark:text-polar-500">
                      Open Opportunities
                      </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-gray-400 hover:text-gray-600 dark:text-polar-500 dark:hover:text-polar-300 transition-colors">
                          <HelpCircle className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p className="text-sm">Actionable recommendations to improve your AI visibility and search presence.</p>
                      </TooltipContent>
                    </Tooltip>
                    </CardHeader>
                    <CardContent className="pt-0">
                    {hasBrandData ? (
                      <div className="flex items-baseline gap-x-2">
                        <h3 className="text-2xl">{stats.openOpportunities}</h3>
                        <span className="text-sm text-amber-600 dark:text-amber-400">action items</span>
                      </div>
                    ) : (
                      <h3 className="text-2xl">—</h3>
                    )}
                    </CardContent>
                  </Card>
              </Link>
                </div>

            {/* 6-Month Opportunities Chart */}
            <OpportunitiesChart brandId={brand.id} />

            {/* Metric Cards Grid - Real data from ClickHouse analytics */}
            <MetricsGrid brandId={brand.id} hasData={hasBrandData} dashboardStats={dashboardStats} />
          </TabsContent>

          {/* Content Tab */}
          <ContentTab brandId={brand.id} />

          {/* Activities Tab */}
          <ActivitiesTab brandId={brand.id} />
        </Tabs>
      </div>
    </div>
  )
}

// ============================================================
// MAIN PAGE COMPONENT
// Wraps content with providers
// ============================================================
export function BrandDetailsPage({ brandId }: { brandId: string }) {
  const { data: brand, isLoading, error } = useBrand(brandId)

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex flex-col gap-2 px-4 justify-center h-[82px]">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex flex-1 p-8">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            <Skeleton className="h-64 rounded-xl" />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Skeleton className="h-96 rounded-xl" />
              <Skeleton className="h-96 rounded-xl" />
              <Skeleton className="h-96 rounded-xl" />
              <Skeleton className="h-96 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !brand) {
    return (
      <div className="flex flex-1 flex-col min-w-0">
        <div className="h-[82px] flex items-center justify-between gap-4 px-4 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="text-sm text-destructive">
              {error?.message ?? "Brand not found"}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Convert date strings to Date objects if needed
  const brandWithDates = {
    ...brand,
    createdAt: typeof brand.createdAt === 'string' ? new Date(brand.createdAt) : brand.createdAt,
    updatedAt: typeof brand.updatedAt === 'string' ? new Date(brand.updatedAt) : brand.updatedAt,
    lastScanAt: brand.lastScanAt ? (typeof brand.lastScanAt === 'string' ? new Date(brand.lastScanAt) : brand.lastScanAt) : null,
    nextScanAt: brand.nextScanAt ? (typeof brand.nextScanAt === 'string' ? new Date(brand.nextScanAt) : brand.nextScanAt) : null,
  }

  return (
    <ActiveBrandProvider brand={brandWithDates}>
      <AnalyticsDateRangeProvider>
        <PageContent />
      </AnalyticsDateRangeProvider>
    </ActiveBrandProvider>
  )
}
