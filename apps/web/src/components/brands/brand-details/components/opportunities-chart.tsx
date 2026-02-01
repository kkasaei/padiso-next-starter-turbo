'use client'

import { useState, useMemo } from 'react'
import { format, eachDayOfInterval, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns'
import { HelpCircle, Rocket, Loader2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip'
import { useAnalyticsDateRange } from '@workspace/ui/hooks/use-analytics-date-range'

interface OpportunitiesChartProps {
  projectId: string
}

export function OpportunitiesChart({ projectId: _projectId }: OpportunitiesChartProps) {
  const { dateRange, presetId } = useAnalyticsDateRange()

  // TODO: Replace with actual data fetching when API is ready
  const [rawData] = useState<Array<{ date: string; count: number }>>([])
  const [totalOpportunities] = useState(0)
  const [isLoading] = useState(false)

  const { opportunitiesData, dateRangeLabel, gridCols } = useMemo(() => {
    const endDate = dateRange.to || new Date()
    const startDate = dateRange.from || subMonths(endDate, 5)
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    const dateCountMap = new Map<string, number>()
    for (const item of rawData) {
      dateCountMap.set(item.date, item.count)
    }

    let data: Array<{ label: string; count: number }>
    let label: string
    let cols: number

    if (daysDiff <= 7) {
      const days = eachDayOfInterval({ start: startDate, end: endDate })
      data = days.map((day) => ({
        label: format(day, 'EEE'),
        count: dateCountMap.get(format(day, 'yyyy-MM-dd')) || 0,
      }))
      label = presetId === '24h' ? 'Last 24 Hours' : 'Last 7 Days'
      cols = Math.min(days.length, 7)
    } else if (daysDiff <= 31) {
      const weeks: Date[] = []
      let current = startDate
      while (current <= endDate) {
        weeks.push(current)
        current = new Date(current.getTime() + 7 * 24 * 60 * 60 * 1000)
      }
      data = weeks.slice(0, 4).map((weekStart, i) => {
        const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
        let weekCount = 0
        const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd > endDate ? endDate : weekEnd })
        for (const day of daysInWeek) {
          weekCount += dateCountMap.get(format(day, 'yyyy-MM-dd')) || 0
        }
        return { label: `Week ${i + 1}`, count: weekCount }
      })
      label = 'Last 28 Days'
      cols = Math.min(data.length, 4)
    } else {
      const months = eachMonthOfInterval({ start: startOfMonth(startDate), end: endOfMonth(endDate) })
      data = months.map((month) => {
        let monthCount = 0
        const daysInMonth = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) })
        for (const day of daysInMonth) {
          monthCount += dateCountMap.get(format(day, 'yyyy-MM-dd')) || 0
        }
        return { label: format(month, 'MMM'), count: monthCount }
      })

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
          <h2 className="text-lg text-gray-500 dark:text-polar-500">{dateRangeLabel}</h2>
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
                <div className="relative h-48 overflow-hidden rounded-2xl bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.05),rgba(0,0,0,0.05)_2px,transparent_2px,transparent_8px)] dark:bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.03),rgba(255,255,255,0.03)_2px,transparent_2px,transparent_8px)]">
                  <div
                    className={`absolute bottom-0 w-full rounded-2xl transition-all ${
                      isLast ? 'bg-amber-400 dark:bg-amber-500' : 'bg-gray-300 dark:bg-polar-600'
                    }`}
                    style={{ height: `${Math.max(height, item.count > 0 ? 5 : 0)}%` }}
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm lg:text-base">{item.label}</span>
                  <span className="text-sm text-gray-500 dark:text-polar-500">
                    {item.count} {item.count === 1 ? 'opportunity' : 'opportunities'}
                  </span>
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
