'use client'

import { cn } from '@workspace/common/lib'
import { Checkbox } from '@workspace/ui/components/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip'
import { HelpCircle } from 'lucide-react'
import type { MetricType, PerformanceMetrics } from './types'

// Match colors with PerformanceChart
const METRIC_COLORS: Record<MetricType, string> = {
  clicks: '#2563eb', // blue-600
  impressions: '#7c3aed', // violet-600
  ctr: '#059669', // emerald-600
  position: '#ea580c', // orange-600
}

interface MetricCardProps {
  type: MetricType
  label: string
  value: string | number
  helpText: string
  isSelected: boolean
  onToggle: (type: MetricType) => void
}

function MetricCard({
  type,
  label,
  value,
  helpText,
  isSelected,
  onToggle,
}: MetricCardProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(type)}
      className={cn(
        'flex flex-col gap-1 p-4 rounded-lg transition-all text-left border',
        isSelected
          ? 'bg-muted/50 border-border'
          : 'bg-transparent border-transparent hover:bg-muted/30'
      )}
    >
      <div className="flex items-center gap-2">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggle(type)}
          onClick={(e) => e.stopPropagation()}
        />
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: METRIC_COLORS[type] }}
        />
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/60" />
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p>{helpText}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <span className="text-2xl font-semibold text-foreground pl-6">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
    </button>
  )
}

interface MetricCardsProps {
  metrics: PerformanceMetrics
  selectedMetrics: MetricType[]
  onToggleMetric: (type: MetricType) => void
}

export function MetricCards({
  metrics,
  selectedMetrics,
  onToggleMetric,
}: MetricCardsProps) {
  const metricConfigs: {
    type: MetricType
    label: string
    getValue: (m: PerformanceMetrics) => string | number
    helpText: string
  }[] = [
    {
      type: 'clicks',
      label: 'Total clicks',
      getValue: (m) => m.clicks,
      helpText: 'The number of clicks from Google Search results to your website.',
    },
    {
      type: 'impressions',
      label: 'Total impressions',
      getValue: (m) => m.impressions,
      helpText: 'The number of times your site appeared in Google Search results.',
    },
    {
      type: 'ctr',
      label: 'Average CTR',
      getValue: (m) => `${m.ctr.toFixed(1)}%`,
      helpText: 'Click-through rate: the percentage of impressions that resulted in a click.',
    },
    {
      type: 'position',
      label: 'Average position',
      getValue: (m) => m.position.toFixed(1),
      helpText: 'The average position of your site in search results (1 is the top).',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {metricConfigs.map((config) => (
        <MetricCard
          key={config.type}
          type={config.type}
          label={config.label}
          value={config.getValue(metrics)}
          helpText={config.helpText}
          isSelected={selectedMetrics.includes(config.type)}
          onToggle={onToggleMetric}
        />
      ))}
    </div>
  )
}
