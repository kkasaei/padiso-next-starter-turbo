import Link from 'next/link'
import { ArrowUpRight, HelpCircle, Sparkles } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@workspace/ui/components/chart'
import { cn } from '@workspace/ui/lib/utils'

import type { MetricCardData } from '../types'
import { createChartConfig } from '../utils'
import { TrendIcon } from './TrendIcon'

interface MetricCardProps {
  metric: MetricCardData
  index: number
  dateRangeLabel: string
}

export function MetricCard({ metric, index, dateRangeLabel }: MetricCardProps) {
  const chartConfig = createChartConfig(metric.color)
  const tickInterval = metric.data.length > 14 ? Math.ceil(metric.data.length / 7) : 0
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
              <p className="text-sm text-gray-500 dark:text-polar-500">No data yet</p>
              <p className="text-xs text-gray-400 dark:text-polar-600 mt-1">
                Data will appear once tracking starts
              </p>
            </div>
          )}
        </div>
        {metric.href && hasData && (
          <div className="flex flex-row items-center gap-x-4">
            <Button variant="ghost" size="icon" className="rounded-full opacity-0 transition-opacity group-hover:opacity-100">
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
              margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
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
              <p className="text-xs text-gray-400 dark:text-polar-600 mt-2">Chart will display here</p>
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

export function MetricCardSkeleton() {
  return (
    <div className="group flex w-full flex-col justify-between rounded-xl border border-transparent bg-gray-50 p-2 shadow-xs dark:border-polar-700 dark:bg-polar-800 lg:rounded-4xl">
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
        <div className="flex w-full flex-col gap-y-4">
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-x-2">
              <div className="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-polar-700" />
              <div className="h-4 w-4 animate-pulse rounded-full bg-gray-200 dark:bg-polar-700" />
            </div>
            <div className="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-polar-700" />
          </div>
          <div className="flex items-baseline gap-x-2">
            <div className="h-12 w-20 animate-pulse rounded bg-gray-200 dark:bg-polar-700" />
            <div className="h-6 w-8 animate-pulse rounded bg-gray-200 dark:bg-polar-700" />
          </div>
          <div className="flex flex-row items-center gap-x-2">
            <div className="h-3 w-3 animate-pulse rounded-full bg-gray-200 dark:bg-polar-700" />
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-polar-700" />
            <div className="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-polar-700" />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-y-2 rounded-3xl bg-white p-4 dark:bg-polar-900">
        <div className="h-[200px] w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-polar-800 dark:via-polar-700 dark:to-polar-800" />
      </div>
    </div>
  )
}
