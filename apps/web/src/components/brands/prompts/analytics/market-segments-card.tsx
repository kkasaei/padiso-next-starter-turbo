'use client'

// ============================================================
// MARKET SEGMENTS CARD
// Shows brand share across different market categories
// Uses ONLY real data passed via props - no mock fallbacks
// Features provider tabs to filter by AI provider
// ============================================================

import { useState } from 'react'
import Image from 'next/image'
import { Search } from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from 'recharts'

import type { MarketSegmentData } from '@/lib/shcmea/types/dtos/prompt-analytics-dto'
import { getFaviconUrl, getProviderLogo } from './helpers'
import { PROVIDERS } from './constants'
import { cn } from '@/lib/utils'

type ProviderTab = 'chatgpt' | 'perplexity' | 'gemini'

interface MarketSegmentsCardProps {
  data: MarketSegmentData[]
}

export function MarketSegmentsCard({ data }: MarketSegmentsCardProps) {
  const [selectedProvider, setSelectedProvider] = useState<ProviderTab>('chatgpt')

  // Filter segments by selected provider
  const filteredData = data.filter(
    segment => segment.provider?.toLowerCase() === selectedProvider.toLowerCase()
  )

  // Check which providers have data
  const providersWithData = new Set(
    data.map(segment => segment.provider?.toLowerCase()).filter(Boolean)
  )

  const hasData = filteredData.length > 0

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      {/* Header Section */}
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
        <div className="flex w-full flex-col gap-y-2">
          <span className="text-lg font-semibold">Market Segments</span>
          <p className="text-sm text-muted-foreground">
            Your brand&apos;s share of voice across different market categories according to {PROVIDERS.find(p => p.id === selectedProvider)?.name || 'AI'}.
          </p>
        </div>

        {/* Provider Tabs */}
        <div className="flex shrink-0 flex-row items-center gap-2">
          {PROVIDERS.map((provider) => {
            const hasProviderData = providersWithData.has(provider.id.toLowerCase())
            return (
              <button
                key={provider.id}
                onClick={() => setSelectedProvider(provider.id as ProviderTab)}
                disabled={!hasProviderData}
                className={cn(
                  'flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all',
                  selectedProvider === provider.id
                    ? 'bg-card shadow-sm ring-1 ring-border'
                    : hasProviderData
                      ? 'opacity-50 hover:opacity-75'
                      : 'opacity-30 cursor-not-allowed'
                )}
              >
                {getProviderLogo(provider.id) && (
                  <div className="relative h-4 w-4">
                    <Image
                      src={getProviderLogo(provider.id)!}
                      alt={provider.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <span>{provider.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Segments Grid - White inner card */}
      <div className="flex w-full flex-col rounded-3xl bg-card p-4">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Search className="h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground text-center">
              No market segment data available for the selected date range
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {filteredData.map((segment, index) => (
              <MarketSegmentItem key={`${segment.title}-${index}`} segment={segment} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function MarketSegmentItem({ segment }: { segment: MarketSegmentData }) {
  const brandData = segment.data.find((d) => d.name === 'PADISO') || segment.data[0]

  return (
    <div className="flex flex-col rounded-2xl border border-border">
      {/* Segment Header */}
      <div className="flex flex-col gap-y-3 p-5 pb-4">
        <div className="flex flex-col gap-y-1">
          <span className="text-base font-medium">{segment.title}</span>
          <span className="text-xs text-muted-foreground">
            {segment.queries} queries · {segment.totalMentions.toLocaleString()} mentions
          </span>
        </div>
        <h2 className="text-4xl font-light text-blue-600 dark:text-blue-400">
          {brandData?.value || 0}%
          <span className="text-lg text-muted-foreground"> share</span>
        </h2>
      </div>

      {/* Chart & Legend */}
      <div className="flex flex-col gap-y-4 border-t border-border p-4">
        {/* Pie Chart */}
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={segment.data as unknown as Array<{ name: string; value: number; color: string; [key: string]: unknown }>}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
              >
                {segment.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const chartData = payload[0].payload as { name: string; value: number }
                    return (
                      <div className="rounded-lg bg-popover px-3 py-2 text-sm shadow-md border border-border">
                        <p className="font-medium">{chartData.name}</p>
                        <p className="text-muted-foreground">{chartData.value}% share</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-3 gap-y-1.5">
          {segment.data.map((item) => {
            const faviconUrl = getFaviconUrl(item.domain)
            return (
              <div key={item.name} className="flex items-center gap-x-1.5">
                {faviconUrl ? (
                  <div className="relative h-4 w-4 shrink-0 overflow-hidden rounded">
                    <Image
                      src={faviconUrl}
                      alt={item.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ) : (
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                )}
                <span className="text-xs text-muted-foreground">
                  {item.name} ({item.value}%)
                </span>
              </div>
            )
          })}
        </div>

        {/* Key Factors */}
        <div className="border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">Key Factors:</span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {segment.keyFactors.map((factor) => (
              <span
                key={factor}
                className="rounded-full bg-muted px-2.5 py-1 text-xs"
              >
                {factor}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
