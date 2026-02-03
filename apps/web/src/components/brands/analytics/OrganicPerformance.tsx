'use client'

import { useState } from 'react'
import { MetricCards } from './MetricCards'
import { PerformanceChart } from './PerformanceChart'
import { AnalyticsEmptyState } from './AnalyticsEmptyState'
import type { PerformanceMetrics, PerformanceDataPoint, MetricType } from './types'

interface OrganicPerformanceProps {
  isConnected: boolean
  metrics: PerformanceMetrics
  chartData: PerformanceDataPoint[]
  onConnect: () => void
  brandName?: string
}

export function OrganicPerformance({
  isConnected,
  metrics,
  chartData,
  onConnect,
  brandName = 'your brand',
}: OrganicPerformanceProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<MetricType[]>([
    'clicks',
    'impressions',
  ])

  const handleToggleMetric = (type: MetricType) => {
    setSelectedMetrics((prev) => {
      if (prev.includes(type)) {
        // Don't allow deselecting all metrics
        if (prev.length === 1) return prev
        return prev.filter((m) => m !== type)
      }
      return [...prev, type]
    })
  }

  if (!isConnected) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Organic Performance</h3>
        <AnalyticsEmptyState
          description={`Once you connect your Google Search Console, you'll have access to valuable data such as organic clicks, impressions, and other important organic metrics directly in ${brandName}.`}
          onConnect={onConnect}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Organic Performance</h3>

      <div className="rounded-xl border border-gray-200 dark:border-polar-800 bg-card p-6 space-y-6">
        {/* Metric Cards */}
        <MetricCards
          metrics={metrics}
          selectedMetrics={selectedMetrics}
          onToggleMetric={handleToggleMetric}
        />

        {/* Chart */}
        <PerformanceChart data={chartData} selectedMetrics={selectedMetrics} />
      </div>
    </div>
  )
}
