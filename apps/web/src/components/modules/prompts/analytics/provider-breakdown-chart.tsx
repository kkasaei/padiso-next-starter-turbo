'use client'

// ============================================================
// PROVIDER BREAKDOWN CHART
// Pie chart showing mentions distribution by AI provider
// Uses ONLY real data from analyticsData prop - no mock fallbacks
// ============================================================

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { PieChart as PieChartIcon } from 'lucide-react'

import type { PromptAnalyticsData } from '@/lib/shcmea/types/dtos/prompt-analytics-dto'

const PROVIDER_COLORS = ['#00A67E', '#FFAA00', '#4285F4', '#7C3AED']

interface ProviderBreakdownChartProps {
  analyticsData: PromptAnalyticsData | null
}

export function ProviderBreakdownChart({ analyticsData }: ProviderBreakdownChartProps) {
  // Use ONLY real provider breakdown data - no mock fallbacks
  const chartData = analyticsData?.providerBreakdown?.length
    ? analyticsData.providerBreakdown.map((p, i) => ({
        name: p.provider,
        value: p.count || p.score,
        color: PROVIDER_COLORS[i % PROVIDER_COLORS.length],
      }))
    : []

  const hasData = chartData.length > 0

  return (
    <div className="group flex w-full flex-col justify-between p-2 bg-transparent dark:bg-transparent border dark:border-polar-700 border-t-0 border-r border-b border-l-0 border-gray-200 shadow-none">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">Mentions by Provider</h3>
        {hasData ? (
          <div className="flex items-center gap-8">
            <div style={{ width: '200px', height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-3">
              {chartData.map((provider) => (
                <div key={provider.name} className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: provider.color }}
                  />
                  <span className="text-sm">{provider.name}</span>
                  <span className="text-sm font-medium">{provider.value}%</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <PieChartIcon className="h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground text-center">
              No provider data available yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
