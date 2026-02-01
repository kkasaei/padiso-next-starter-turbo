'use client'

import * as React from 'react'
import Image from 'next/image'
import { Smile, Meh, Frown, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SentimentProvider } from '@/lib/shcmea/types/dtos/ai-visibility-dto'

interface SentimentSectionProps {
  providers: SentimentProvider[]
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600 dark:text-green-400'
  if (score >= 60) return 'text-blue-600 dark:text-blue-400'
  if (score >= 40) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

const getBarColor = (score: number): string => {
  if (score >= 80) return 'bg-green-500 dark:bg-green-400'
  if (score >= 60) return 'bg-blue-500 dark:bg-blue-400'
  if (score >= 40) return 'bg-yellow-500 dark:bg-yellow-400'
  return 'bg-red-500 dark:bg-red-400'
}

const getSentimentIcon = (score: number) => {
  if (score >= 70) return <Smile className="h-5 w-5 text-green-500" />
  if (score >= 50) return <Meh className="h-5 w-5 text-yellow-500" />
  return <Frown className="h-5 w-5 text-red-500" />
}

export function SentimentSection({ providers }: SentimentSectionProps) {
  // Allow multiple providers to be expanded - default all expanded
  const [expandedProviders, setExpandedProviders] = React.useState<Set<string>>(
    new Set(providers.map(p => p.provider))
  )

  const toggleProvider = (provider: string) => {
    setExpandedProviders(prev => {
      const next = new Set(prev)
      if (next.has(provider)) {
        next.delete(provider)
      } else {
        next.add(provider)
      }
      return next
    })
  }

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      {/* Header Section - Inside gray card */}
      <div className="flex flex-col gap-6 p-6">
        <div className="flex w-full flex-col gap-y-2">
          <span className="text-lg font-semibold">Sentiment Breakdown</span>
          <p className="text-sm text-muted-foreground">
            How your brand is perceived across different AI platforms and contexts.
          </p>
        </div>
      </div>

      {/* Provider Cards - White inner card */}
      <div className="flex w-full flex-col gap-y-2 rounded-3xl bg-card p-4">
        <div className="grid gap-4 lg:grid-cols-3">
          {providers.map((provider) => {
            const isExpanded = expandedProviders.has(provider.provider)

            return (
              <div
                key={provider.provider}
                className="flex flex-col rounded-2xl border border-border"
              >
                {/* Header - Clickable */}
                <button
                  onClick={() => toggleProvider(provider.provider)}
                  className="flex flex-col gap-y-4 p-5 pb-4 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-3">
                      <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-muted p-1">
                        <Image
                          src={provider.logo}
                          alt={provider.provider}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <span className="font-medium">{provider.provider}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex items-end justify-between">
                    <h2 className={cn('text-4xl font-light', getScoreColor(provider.totalScore))}>
                      {provider.totalScore}
                      <span className="text-xl text-muted-foreground">/100</span>
                    </h2>
                    {getSentimentIcon(provider.totalScore)}
                  </div>

                  {/* Polarization & Reliability */}
                  <div className="flex items-center gap-x-4 text-sm">
                    <div className="flex items-center gap-x-1.5">
                      <span className="text-muted-foreground">Polarization:</span>
                      <span className={provider.polarization > 30 ? 'text-yellow-600' : 'text-green-600'}>
                        {provider.polarization}%
                      </span>
                    </div>
                    <div className="flex items-center gap-x-1.5">
                      {provider.reliableData ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="text-muted-foreground">
                        {provider.reliableData ? 'Reliable' : 'Limited Data'}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Expanded Metrics */}
                {isExpanded && (
                  <div className="flex flex-col gap-y-3 border-t border-border p-4">
                    {provider.metrics.map((metric) => (
                      <div key={metric.category} className="flex flex-col gap-y-2 border-b border-border pb-3 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{metric.category}</span>
                          <span className={cn('text-lg font-light', getScoreColor(metric.score))}>
                            {metric.score}
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn('h-full rounded-full transition-all duration-500', getBarColor(metric.score))}
                            style={{ width: `${metric.score}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{metric.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {metric.keyFactors.map((factor) => (
                            <span
                              key={factor}
                              className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                            >
                              {factor}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
