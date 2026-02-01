import { format, eachDayOfInterval } from 'date-fns'
import type { ChartConfig } from '@workspace/ui/components/chart'
import type { MetricDataPoint } from './types'

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

export const createChartConfig = (color: string): ChartConfig => ({
  value: {
    label: 'Value',
    color: color,
  },
})

export function generateDataForDateRange(
  startDate: Date,
  endDate: Date,
  baseValue: number,
  variance: number,
  trend: 'up' | 'down' | 'stable'
): MetricDataPoint[] {
  const days = eachDayOfInterval({ start: startDate, end: endDate })
  const totalDays = days.length

  return days.map((date, index) => {
    const trendMultiplier = totalDays > 1 ? index / (totalDays - 1) : 0
    const trendBias = trend === 'up'
      ? trendMultiplier * variance * 0.5
      : trend === 'down'
        ? -trendMultiplier * variance * 0.5
        : 0

    const seed = date.getTime() % 1000
    const randomVariance = ((seed / 1000) * variance) - (variance / 2)
    const value = Math.max(0, baseValue + trendBias + randomVariance)

    let label: string
    if (totalDays <= 7) {
      label = format(date, 'EEE')
    } else {
      label = format(date, 'MMM d')
    }

    return {
      label,
      value: Math.round(value),
    }
  })
}
