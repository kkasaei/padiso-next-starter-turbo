'use client'

import { cn } from '@workspace/common/lib'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip'
import { HelpCircle, Plus } from 'lucide-react'
import type { BacklinkMetrics } from './types'

interface StatCardProps {
  label: string
  value: string | number
  helpText: string
  prefix?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

function StatCard({
  label,
  value,
  helpText,
  prefix,
  action,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 p-6 rounded-2xl bg-gray-50 dark:bg-polar-900',
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-muted-foreground">
          {label}
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-4 w-4 text-muted-foreground/50 cursor-help" />
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p>{helpText}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-baseline gap-0.5">
          {prefix && (
            <span className="text-2xl font-semibold text-foreground">{prefix}</span>
          )}
          <span className="text-3xl font-semibold text-foreground">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
        </div>
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}

interface BacklinkStatsCardsProps {
  metrics: BacklinkMetrics
  onBuyCredits: () => void
}

export function BacklinkStatsCards({ metrics, onBuyCredits }: BacklinkStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Backlink Credits"
        value={metrics.creditBalance}
        helpText="Available credits to spend on receiving backlinks. Each backlink costs credits equal to the source website's domain rating."
        action={{
          label: 'Add',
          onClick: onBuyCredits,
        }}
      />
      
      <StatCard
        label="Backlinks Received"
        value={metrics.totalReceived}
        helpText="Total number of backlinks you've received through the exchange network."
      />
      
      <StatCard
        label="Backlinks Value"
        value={metrics.backlinksValue}
        prefix="$"
        helpText="Estimated dollar value of received backlinks if you were to buy them on a marketplace."
      />
      
      <StatCard
        label="Your Domain Rating"
        value={metrics.domainRating.toFixed(1)}
        helpText="Domain Rating (DR) measures the strength of your website's backlink profile. Powered by Ahrefs."
      />
    </div>
  )
}
