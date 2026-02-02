'use client'

import { ArrowLeft, ArrowRight, Search } from 'lucide-react'
import { LineChart, Line, XAxis, CartesianGrid, ResponsiveContainer, Tooltip, YAxis } from 'recharts'
import { Button } from '@workspace/ui/components/button'
import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { format, eachDayOfInterval, subDays, differenceInDays, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns'
import { useAnalyticsDateRange } from '@/hooks/use-analytics-date-range'
import { cn } from '@workspace/common/lib'

// ============================================================
// Provider Configuration
// ============================================================
const AI_PROVIDERS = [
  { id: 'chatgpt', name: 'ChatGPT', logo: '/icons/openai.svg', color: '#10a37f' },
  { id: 'perplexity', name: 'Perplexity', logo: '/icons/perplexity.svg', color: '#8b5cf6' },
  { id: 'gemini', name: 'Gemini', logo: '/icons/gemini.svg', color: '#4285f4' },
] as const

type ProviderId = typeof AI_PROVIDERS[number]['id']

// Provider config for data generation
const PROVIDER_CONFIG: Record<ProviderId, { baseScore: number; variance: number; trend: number }> = {
  chatgpt: { baseScore: 72, variance: 10, trend: 0.2 },
  perplexity: { baseScore: 92, variance: 5, trend: 0.5 },
  gemini: { baseScore: 88, variance: 7, trend: 0.4 },
}

// ============================================================
// Dummy Data Generator - Generates realistic visibility scores
// ============================================================
const generateProviderScore = (providerId: ProviderId, date: Date, index: number) => {
  const config = PROVIDER_CONFIG[providerId]

  // Seeded random for consistent data
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  const dayOfYear = Math.floor(date.getTime() / (1000 * 60 * 60 * 24))
  const seed = dayOfYear + providerId.charCodeAt(0)

  // Score with upward trend
  const noise = (seededRandom(seed) - 0.5) * config.variance * 2
  const trendBoost = index * config.trend
  return Math.min(100, Math.max(0, Math.round(config.baseScore + noise + trendBoost)))
}

const generateAllProvidersData = (dates: Date[]) => {
  return dates.map((date, index) => ({
    date: format(date, 'MMM d'),
    fullDate: date,
    chatgpt: generateProviderScore('chatgpt', date, index),
    perplexity: generateProviderScore('perplexity', date, index),
    gemini: generateProviderScore('gemini', date, index),
  }))
}

// ============================================================
// Visibility Chart Card Component
// Uses useAnalyticsDateRange hook for date range state
// ============================================================
export function VisibilityChartCard() {
  const { dateRange } = useAnalyticsDateRange()
  const [activeProviders, setActiveProviders] = useState<Set<ProviderId>>(
    new Set(['chatgpt', 'perplexity', 'gemini'])
  )

  const toggleProvider = (providerId: ProviderId) => {
    setActiveProviders(prev => {
      const next = new Set(prev)
      if (next.has(providerId)) {
        // Don't allow deselecting all
        if (next.size > 1) {
          next.delete(providerId)
        }
      } else {
        next.add(providerId)
      }
      return next
    })
  }

  // Generate chart data based on date range
  const { chartData, currentPeriodLabel, tickInterval, averageScore, scoreChange } = useMemo(() => {
    const endDate = dateRange.to || new Date()
    const startDate = dateRange.from || subDays(endDate, 6)

    // Calculate previous period
    const daysDiff = differenceInDays(endDate, startDate)
    const previousEnd = subDays(startDate, 1)
    const previousStart = subDays(previousEnd, daysDiff)

    // Generate dates
    const dates = eachDayOfInterval({ start: startDate, end: endDate })
    const previousDates = eachDayOfInterval({ start: previousStart, end: previousEnd })

    // Format labels
    const currentLabel = `${format(startDate, 'MMM d')} – ${format(endDate, 'MMM d, yyyy')}`

    // Calculate tick interval
    const totalDays = dates.length
    let interval = 1
    if (totalDays > 90) interval = 14
    else if (totalDays > 60) interval = 7
    else if (totalDays > 30) interval = 5
    else if (totalDays > 14) interval = 3
    else if (totalDays > 7) interval = 2

    // Generate data for all providers
    const data = generateAllProvidersData(dates)
    const previousData = generateAllProvidersData(previousDates)

    // Calculate average score across active providers (last 3 days)
    const recentData = data.slice(-3)
    const activeProviderIds = Array.from(activeProviders)

    const avgCurrent = Math.round(
      recentData.reduce((acc, d) => {
        const sum = activeProviderIds.reduce((s, p) => s + (d[p] || 0), 0)
        return acc + sum / activeProviderIds.length
      }, 0) / recentData.length
    )

    const recentPrevious = previousData.slice(-3)
    const avgPrevious = Math.round(
      recentPrevious.reduce((acc, d) => {
        const sum = activeProviderIds.reduce((s, p) => s + (d[p] || 0), 0)
        return acc + sum / activeProviderIds.length
      }, 0) / recentPrevious.length
    )

    return {
      chartData: data,
      currentPeriodLabel: currentLabel,
      tickInterval: interval,
      averageScore: avgCurrent,
      scoreChange: avgCurrent - avgPrevious,
    }
  }, [dateRange, activeProviders])

  return (
    <div className="group flex w-full flex-col justify-between rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex w-full flex-col gap-y-4">
          {/* Title */}
          <div className="flex flex-row items-center gap-x-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              AI Visibility Score
            </span>
          </div>

          {/* Score Display */}
          <div className="flex items-baseline gap-x-3">
            <h2 className="text-5xl font-semibold tracking-tight">{averageScore}</h2>
            <span className={cn(
              'text-sm font-medium',
              scoreChange > 0 ? 'text-emerald-500' : scoreChange < 0 ? 'text-rose-500' : 'text-muted-foreground'
            )}>
              {scoreChange > 0 ? '+' : ''}{scoreChange}
            </span>
          </div>

          {/* Period Label */}
          <p className="text-xs text-muted-foreground">{currentPeriodLabel}</p>
        </div>

        {/* Provider Legend / Toggles */}
        <div className="flex shrink-0 flex-row items-center gap-2">
          {AI_PROVIDERS.map((provider) => {
            const isActive = activeProviders.has(provider.id)
            return (
              <button
                key={provider.id}
                onClick={() => toggleProvider(provider.id)}
                className={cn(
                  'flex items-center gap-x-2 rounded-full border border-transparent px-3 py-1.5 text-xs transition-all',
                  isActive
                    ? 'border-border/60 bg-background shadow-sm'
                    : 'opacity-50 hover:opacity-80'
                )}
              >
                <div className="relative h-4 w-4">
                  <Image
                    src={provider.logo}
                    alt={provider.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: provider.color }}
                />
                <span>{provider.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex w-full flex-col gap-y-2 rounded-2xl border border-border/60 bg-background p-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="4 6"
              stroke="hsl(var(--border))"
              opacity={0.35}
              vertical={true}
            />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              tickFormatter={(value, index) => {
                if (index % tickInterval === 0) return value
                return ''
              }}
            />
            <YAxis
              domain={[0, 100]}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={30}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl bg-popover px-3 py-2 shadow-md ring-1 ring-border/60">
                      <p className="mb-2 text-xs font-semibold text-foreground">{label}</p>
                      {payload.map((entry) => {
                        const provider = AI_PROVIDERS.find(p => p.id === entry.dataKey)
                        if (!provider) return null
                        return (
                          <div key={entry.dataKey} className="flex items-center gap-x-2 text-xs text-muted-foreground">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: provider.color }}
                            />
                            <span>{provider.name}:</span>
                            <span className="font-semibold text-foreground">{entry.value}</span>
                          </div>
                        )
                      })}
                    </div>
                  )
                }
                return null
              }}
            />
            {AI_PROVIDERS.map((provider) => (
              <Line
                key={provider.id}
                type="monotone"
                dataKey={provider.id}
                stroke={provider.color}
                strokeWidth={activeProviders.has(provider.id) ? 2 : 0}
                dot={false}
                strokeOpacity={activeProviders.has(provider.id) ? 1 : 0}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>

        {/* Bottom Legend */}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          {AI_PROVIDERS.map((provider) => (
            <div
              key={provider.id}
              className={cn(
                'flex items-center gap-x-2 text-xs',
                !activeProviders.has(provider.id) && 'opacity-40'
              )}
            >
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: provider.color }}
              />
              <span className="text-muted-foreground">{provider.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// AI Mentions Calendar Card
// Uses useAnalyticsDateRange hook for date range state
// ============================================================
export function AIMentionsCalendarCard() {
  const { dateRange } = useAnalyticsDateRange()

  // Get the month to display based on the end date of the range
  const displayMonth = useMemo(() => {
    const endDate = dateRange.to || new Date()
    return format(endDate, 'MMMM yyyy')
  }, [dateRange])

  // Generate calendar days for the current month
  const calendarDays = useMemo(() => {
    const endDate = dateRange.to || new Date()
    const monthStart = startOfMonth(endDate)
    const monthEnd = endOfMonth(endDate)

    // Get day of week for first day (0 = Sunday, we want Monday as first)
    const firstDayOfWeek = monthStart.getDay()
    const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

    const days: ({ day: number; mentions: number | null } | null)[] = []

    // Add empty slots before the first day
    for (let i = 0; i < offset; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= monthEnd.getDate(); day++) {
      days.push({ day, mentions: null }) // TODO: Fetch actual mentions data
    }

    // Pad to fill remaining grid
    while (days.length < 35) {
      days.push(null)
    }

    return days
  }, [dateRange])

  return (
    <div className="flex w-full flex-col h-full">
      <div className="flex w-full flex-col rounded-4xl bg-muted/30 p-2">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl">{displayMonth}</h2>
          <div className="flex items-center gap-x-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 pb-4">
          <div className="flex items-baseline gap-x-2">
            <h3 className="text-5xl font-light">0</h3>
            <span className="text-lg">AI Mentions</span>
          </div>
        </div>

        <div className="flex min-h-[300px] flex-col gap-y-4 rounded-3xl bg-card px-2 py-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 justify-items-center">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={i} className="text-sm text-muted-foreground">{day}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 justify-items-center gap-y-2">
            {calendarDays.map((item, i) => (
              <div key={i}>
                {item ? (
                  <button className={`relative flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                    item.mentions !== null ? 'bg-primary text-primary-foreground' : ''
                  }`}>
                    <div className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 text-sm ${
                      item.mentions !== null
                        ? 'border-primary'
                        : 'border-border'
                    }`}>
                      {item.mentions !== null ? (
                        <span>{item.mentions}</span>
                      ) : (
                        <span className="h-1 w-1 rounded-full bg-border"></span>
                      )}
                    </div>
                  </button>
                ) : (
                  <div className="h-8 w-8"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Visibility Trends Card
// Uses useAnalyticsDateRange hook for date range state
// ============================================================
export function VisibilityTrendsCard() {
  const { dateRange } = useAnalyticsDateRange()

  // Generate month data based on date range
  const monthsData = useMemo(() => {
    const endDate = dateRange.to || new Date()
    const startDate = dateRange.from || subMonths(endDate, 6)

    // Get months in the range (up to 6 months)
    const months = eachMonthOfInterval({ start: startDate, end: endDate })
    const displayMonths = months.slice(-6) // Show last 6 months max

    return displayMonths.map((date) => ({
      month: format(date, 'MMMM'),
      shortMonth: format(date, 'MMM'),
      score: 0, // TODO: Fetch actual data
      height: 0, // TODO: Calculate based on actual score
    }))
  }, [dateRange])

  // Determine period label based on date range
  const periodLabel = useMemo(() => {
    const days = dateRange.from && dateRange.to
      ? differenceInDays(dateRange.to, dateRange.from)
      : 7

    if (days <= 7) return 'Last 7 Days'
    if (days <= 28) return 'Last 28 Days'
    if (days <= 90) return 'Last 3 Months'
    if (days <= 180) return 'Last 6 Months'
    return 'Last 12 Months'
  }, [dateRange])

  return (
    <div className="flex w-full flex-col h-full xl:col-span-2">
      <div className="flex h-full w-full flex-col gap-y-8 rounded-4xl bg-muted/30 p-6">
        <div className="flex flex-col gap-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg text-muted-foreground">{periodLabel}</h2>
          </div>
          <h3 className="text-4xl font-light">Visibility Trends</h3>
        </div>

        <div className="grid h-full grid-cols-3 gap-4 lg:grid-cols-6 lg:gap-6">
          {monthsData.map((item) => (
            <div key={item.month} className="flex h-full flex-col gap-y-2">
              <button className="relative h-full min-h-48 overflow-hidden rounded-2xl bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.05),rgba(0,0,0,0.05)_2px,transparent_2px,transparent_8px)] dark:bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.03),rgba(255,255,255,0.03)_2px,transparent_2px,transparent_8px)]">
                <div
                  className={`absolute bottom-0 w-full rounded-2xl ${
                    item.height > 0 ? 'bg-indigo-300 dark:bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  style={{ height: `${item.height}%` }}
                ></div>
              </button>
              <div className="flex flex-col text-left">
                <span className="text-sm lg:text-base">{item.month}</span>
                <span className="text-sm text-muted-foreground">{item.score}/100</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// No Mentions Card
// ============================================================
export function NoMentionsCard() {
  return (
    <div className="flex w-full flex-col h-full">
      <div className="relative h-full min-h-80 rounded-4xl bg-gray-50 dark:bg-polar-800 md:min-h-fit">
        <div className="flex h-full flex-col items-center justify-center gap-y-6 rounded-4xl border border-transparent bg-gray-50 p-6 text-gray-400 shadow-none dark:border-transparent dark:bg-polar-800 dark:text-polar-500">
          <Search className="h-12 w-12 text-gray-300 dark:text-polar-600" strokeWidth={1.5} />
          <h3>No mentions detected yet</h3>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Tracked Keywords Card
// Uses useAnalyticsDateRange hook for date range state
// ============================================================
export function TrackedKeywordsCard() {
  const { dateRange } = useAnalyticsDateRange()

  // Generate bar data based on date range
  const barsData = useMemo(() => {
    const endDate = dateRange.to || new Date()
    const startDate = dateRange.from || subDays(endDate, 6)
    const days = differenceInDays(endDate, startDate) + 1

    // Show appropriate number of bars based on range
    const barCount = Math.min(Math.max(days, 7), 13)

    return Array.from({ length: barCount }, (_, i) => ({
      value: 8, // TODO: Fetch actual data
      isActive: i === barCount - 1
    }))
  }, [dateRange])

  return (
    <div className="flex w-full flex-col h-full">
      <div className="flex h-80 flex-col justify-between rounded-4xl bg-muted/30">
        <div className="space-y-1.5 p-6 flex flex-col gap-y-2 pb-2">
          <div className="flex flex-row items-center justify-between">
            <span className="text-lg">Tracked Keywords</span>
          </div>
          <h2 className="text-5xl font-light">0</h2>
        </div>
        <div className="m-2 flex h-full flex-row items-end justify-between gap-x-1 rounded-3xl bg-card p-4">
          {barsData.map((item, i) => (
            <button
              key={i}
              className={`w-3 shrink rounded-full ${
                item.isActive
                  ? 'bg-primary dark:bg-primary'
                  : 'bg-gray-300 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900'
              }`}
              style={{ height: `${item.value}%` }}
            ></button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// AEO Score Card
// Uses useAnalyticsDateRange hook for date range state
// ============================================================
export function AEOScoreCard() {
  const { dateRange } = useAnalyticsDateRange()

  // Period label based on date range
  const periodLabel = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return ''
    return `${format(dateRange.from, 'MMM d')} – ${format(dateRange.to, 'MMM d, yyyy')}`
  }, [dateRange])

  return (
    <div className="flex w-full flex-col h-full">
      <div className="flex h-80 flex-col justify-between rounded-4xl bg-muted/30">
        <div className="flex flex-col gap-y-4 p-6 pb-2">
          <div className="flex flex-row items-center justify-between">
            <span className="text-lg">AEO Score</span>
            <Link href="#">
              <Button variant="secondary" size="sm" className="rounded-full border-none">
                View Details
              </Button>
            </Link>
          </div>
          <h2 className="text-5xl font-light">0<span className="text-2xl text-muted-foreground">/100</span></h2>
          {periodLabel && (
            <p className="text-sm text-muted-foreground">{periodLabel}</p>
          )}
        </div>
        <div className="m-2 flex flex-col gap-y-4 rounded-3xl bg-card p-4 dark:bg-card">
          <div className="flex flex-col">
            <h3>Start tracking visibility</h3>
            <p className="text-sm text-muted-foreground">
              Your AEO score will appear once data is collected.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
