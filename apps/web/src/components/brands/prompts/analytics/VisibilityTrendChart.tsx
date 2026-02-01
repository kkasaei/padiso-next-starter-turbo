'use client'

// ============================================================
// VISIBILITY TREND CHART
// Line chart showing visibility scores across AI providers
// ============================================================

import { useState } from 'react'
import Image from 'next/image'
import {
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip as RechartsTooltip,
} from 'recharts'

import { useAnalyticsDateRange } from '@workspace/ui/hooks/use-analytics-date-range'
import type { VisibilityDataPoint } from '@workspace/common/lib/shcmea/types/dtos/prompt-analytics-dto'
import { PROVIDERS } from './constants'
import { formatDateRangeDisplay } from './helpers'

interface VisibilityTrendChartProps {
  data: VisibilityDataPoint[]
  defaultVisibilityScore?: number
}

export function VisibilityTrendChart({
  data,
  defaultVisibilityScore = 72
}: VisibilityTrendChartProps) {
  const { dateRange } = useAnalyticsDateRange()
  const [selectedProviders, setSelectedProviders] = useState<string[]>(['chatgpt', 'perplexity', 'gemini'])

  const toggleProvider = (providerId: string) => {
    setSelectedProviders((prev) =>
      prev.includes(providerId) ? prev.filter((p) => p !== providerId) : [...prev, providerId]
    )
  }

  // Data is already filtered by date range on the server (in getPromptAnalytics)
  // No need for redundant client-side filtering
  const filteredData = data

  // Calculate average visibility score
  const calculateAverageScore = () => {
    if (filteredData.length === 0) return defaultVisibilityScore
    const total = filteredData.reduce((sum, item) => {
      let count = 0
      let scoreSum = 0
      if (selectedProviders.includes('chatgpt')) { scoreSum += item.chatgpt; count++ }
      if (selectedProviders.includes('perplexity')) { scoreSum += item.perplexity; count++ }
      if (selectedProviders.includes('gemini')) { scoreSum += item.gemini; count++ }
      return sum + (count > 0 ? scoreSum / count : 0)
    }, 0)
    return Math.round(total / filteredData.length)
  }

  // Calculate score change
  const calculateScoreChange = () => {
    if (filteredData.length < 2) return 0
    const midPoint = Math.floor(filteredData.length / 2)
    const firstHalf = filteredData.slice(0, midPoint)
    const secondHalf = filteredData.slice(midPoint)

    const avgFirst = firstHalf.reduce((sum, item) => sum + (item.chatgpt + item.perplexity + item.gemini) / 3, 0) / firstHalf.length
    const avgSecond = secondHalf.reduce((sum, item) => sum + (item.chatgpt + item.perplexity + item.gemini) / 3, 0) / secondHalf.length

    return Math.round(avgSecond - avgFirst)
  }

  const avgScore = calculateAverageScore()
  const scoreChange = calculateScoreChange()

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      {/* Header Section */}
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
        <div className="flex w-full flex-col gap-y-4">
          <div className="flex flex-row items-center gap-x-2">
            <span className="text-sm text-muted-foreground">Prompt Visibility Score</span>
          </div>
          <div className="flex items-baseline gap-x-3">
            <h2 className="text-5xl font-light">{avgScore}</h2>
            <span
              className={`text-lg font-medium ${
                scoreChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {scoreChange >= 0 ? '+' : ''}{scoreChange}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDateRangeDisplay(dateRange.from, dateRange.to)}
          </p>
        </div>

        {/* Provider Filter Buttons */}
        <div className="flex shrink-0 flex-row items-center gap-2">
          {PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              onClick={() => toggleProvider(provider.id)}
              className={`flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all ${
                selectedProviders.includes(provider.id)
                  ? 'bg-card shadow-sm ring-1 ring-border'
                  : 'bg-muted/50 opacity-50'
              }`}
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
          ))}
        </div>
      </div>

      {/* Chart Section */}
      <div className="flex w-full flex-col gap-y-2 rounded-3xl bg-card p-4">
        {filteredData.length === 0 ? (
          <div className="flex items-center justify-center" style={{ height: '300px', width: '100%' }}>
            <p className="text-sm text-muted-foreground">No visibility data for this date range. Run a scan to see trends.</p>
          </div>
        ) : (
        <div style={{ height: '300px', width: '100%', minWidth: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}>
              <CartesianGrid
                strokeDasharray="6 6"
                stroke="hsl(var(--border))"
                opacity={0.5}
                vertical={true}
                horizontal={true}
              />
              <XAxis
                dataKey="displayDate"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.85)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                }}
                labelStyle={{ color: '#fff', fontWeight: 500 }}
                itemStyle={{ color: '#fff' }}
              />
              {selectedProviders.includes('chatgpt') && (
                <Line
                  type="monotone"
                  dataKey="chatgpt"
                  name="ChatGPT"
                  stroke="#10a37f"
                  strokeWidth={2}
                  dot={filteredData.length <= 2}
                  activeDot={{ r: 6 }}
                />
              )}
              {selectedProviders.includes('perplexity') && (
                <Line
                  type="monotone"
                  dataKey="perplexity"
                  name="Perplexity"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={filteredData.length <= 2}
                  activeDot={{ r: 6 }}
                />
              )}
              {selectedProviders.includes('gemini') && (
                <Line
                  type="monotone"
                  dataKey="gemini"
                  name="Gemini"
                  stroke="#4285f4"
                  strokeWidth={2}
                  dot={filteredData.length <= 2}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          {PROVIDERS.map((provider) => (
            <div
              key={provider.id}
              className={`flex items-center gap-x-2 text-sm ${
                !selectedProviders.includes(provider.id) ? 'opacity-50' : ''
              }`}
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

