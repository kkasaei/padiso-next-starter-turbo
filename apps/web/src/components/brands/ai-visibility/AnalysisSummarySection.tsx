'use client'

import * as React from 'react'
import { Target, TrendingUp, CheckCircle2 } from 'lucide-react'
import { cn } from '@workspace/common/lib'
import type { AnalysisSummary } from '@workspace/common/lib/shcmea/types/dtos/ai-visibility-dto'

interface AnalysisSummarySectionProps {
  summary: AnalysisSummary
}

export function AnalysisSummarySection({ summary }: AnalysisSummarySectionProps) {
  const trajectoryColor =
    summary.marketTrajectory.status === 'positive'
      ? 'text-green-600 dark:text-green-400'
      : summary.marketTrajectory.status === 'negative'
        ? 'text-red-600 dark:text-red-400'
        : 'text-yellow-600 dark:text-yellow-400'

  return (
    <div className="flex w-full flex-col gap-y-6">
      {/* Market Trajectory */}
      <div className="flex flex-col rounded-4xl bg-muted/30">
        <div className="flex flex-col gap-y-4 p-6">
          <div className="flex items-center gap-x-3">
            <div className="rounded-xl bg-background p-2.5">
              <TrendingUp className={cn('h-5 w-5', trajectoryColor)} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium">Market Trajectory</span>
              <span className={cn('text-sm capitalize', trajectoryColor)}>
                {summary.marketTrajectory.status}
              </span>
            </div>
          </div>
        </div>
        <div className="m-2 rounded-3xl bg-card p-4">
          <p className="text-muted-foreground">{summary.marketTrajectory.description}</p>
        </div>
      </div>

      {/* Strengths & Opportunities Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Strengths */}
        <div className="flex flex-col rounded-4xl bg-muted/30">
          <div className="flex items-center gap-x-3 p-6 pb-4">
            <div className="rounded-xl bg-green-100 p-2.5 dark:bg-green-900/30">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium">Key Strengths</span>
              <span className="text-sm text-muted-foreground">{summary.strengths.length} identified</span>
            </div>
          </div>
          <div className="m-2 flex flex-col gap-y-3 rounded-3xl bg-card p-4">
            {summary.strengths.map((strength, index) => (
              <div
                key={index}
                className="flex flex-col gap-y-1 border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <span className="font-medium">{strength.title}</span>
                <p className="text-sm text-muted-foreground">{strength.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Opportunities */}
        <div className="flex flex-col rounded-4xl bg-muted/30">
          <div className="flex items-center gap-x-3 p-6 pb-4">
            <div className="rounded-xl bg-blue-100 p-2.5 dark:bg-blue-900/30">
              <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium">Growth Opportunities</span>
              <span className="text-sm text-muted-foreground">{summary.opportunities.length} identified</span>
            </div>
          </div>
          <div className="m-2 flex flex-col gap-y-3 rounded-3xl bg-card p-4">
            {summary.opportunities.map((opportunity, index) => (
              <div
                key={index}
                className="flex flex-col gap-y-1 border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <span className="font-medium">{opportunity.title}</span>
                <p className="text-sm text-muted-foreground">{opportunity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
