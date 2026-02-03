'use client'

import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@workspace/ui/components/chart'
import type { PerformanceDataPoint, MetricType } from './types'

interface PerformanceChartProps {
  data: PerformanceDataPoint[]
  selectedMetrics: MetricType[]
}

const METRIC_COLORS: Record<MetricType, string> = {
  clicks: '#2563eb', // blue-600 for clicks
  impressions: '#7c3aed', // violet-600 for impressions  
  ctr: '#059669', // emerald-600 for ctr
  position: '#ea580c', // orange-600 for position
}

const METRIC_LABELS: Record<MetricType, string> = {
  clicks: 'Clicks',
  impressions: 'Impressions',
  ctr: 'CTR',
  position: 'Position',
}

export function PerformanceChart({ data, selectedMetrics }: PerformanceChartProps) {
  const chartConfig = useMemo<ChartConfig>(() => {
    const config: ChartConfig = {}
    selectedMetrics.forEach((metric) => {
      config[metric] = {
        label: METRIC_LABELS[metric],
        color: METRIC_COLORS[metric],
      }
    })
    return config
  }, [selectedMetrics])

  const formattedData = useMemo(() => {
    return data.map((point) => ({
      ...point,
      formattedDate: new Date(point.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
    }))
  }, [data])

  // Determine which Y-axes to show
  const showClicksAxis = selectedMetrics.includes('clicks')
  const showImpressionsAxis = selectedMetrics.includes('impressions')
  const showCtrAxis = selectedMetrics.includes('ctr') && !showClicksAxis && !showImpressionsAxis
  const showPositionAxis = selectedMetrics.includes('position') && !showClicksAxis && !showImpressionsAxis && !showCtrAxis

  // Calculate domain for left axis (clicks or primary metric)
  const leftAxisMetric = showClicksAxis ? 'clicks' : showCtrAxis ? 'ctr' : showPositionAxis ? 'position' : null
  const rightAxisMetric = showImpressionsAxis ? 'impressions' : null

  if (selectedMetrics.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        Select at least one metric to display the chart
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
          <XAxis
            dataKey="formattedDate"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          
          {/* Left Y-axis for clicks */}
          {leftAxisMetric && (
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
              domain={leftAxisMetric === 'position' ? ['dataMax', 'dataMin'] : [0, 'auto']}
              tickFormatter={(value) => 
                leftAxisMetric === 'ctr' ? `${value}%` : value.toString()
              }
            />
          )}
          
          {/* Right Y-axis for impressions */}
          {rightAxisMetric && (
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
              domain={[0, 'auto']}
            />
          )}

          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) => {
                  if (payload?.[0]?.payload?.date) {
                    return new Date(payload[0].payload.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  }
                  return ''
                }}
                formatter={(value, name) => {
                  if (name === 'ctr') return [`${Number(value).toFixed(2)}%`, 'CTR']
                  if (name === 'position') return [Number(value).toFixed(1), 'Position']
                  return [value, METRIC_LABELS[name as MetricType] || name]
                }}
              />
            }
          />

          {selectedMetrics.includes('clicks') && (
            <Line
              yAxisId={leftAxisMetric === 'clicks' ? 'left' : 'right'}
              type="monotone"
              dataKey="clicks"
              stroke={METRIC_COLORS.clicks}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: METRIC_COLORS.clicks }}
            />
          )}

          {selectedMetrics.includes('impressions') && (
            <Line
              yAxisId={rightAxisMetric === 'impressions' ? 'right' : 'left'}
              type="monotone"
              dataKey="impressions"
              stroke={METRIC_COLORS.impressions}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: METRIC_COLORS.impressions }}
            />
          )}

          {selectedMetrics.includes('ctr') && (
            <Line
              yAxisId={leftAxisMetric === 'ctr' ? 'left' : 'right'}
              type="monotone"
              dataKey="ctr"
              stroke={METRIC_COLORS.ctr}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: METRIC_COLORS.ctr }}
            />
          )}

          {selectedMetrics.includes('position') && (
            <Line
              yAxisId={leftAxisMetric === 'position' ? 'left' : 'right'}
              type="monotone"
              dataKey="position"
              stroke={METRIC_COLORS.position}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: METRIC_COLORS.position }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
