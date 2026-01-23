'use client'

import * as React from 'react'
import Image from 'next/image'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LLMProviderScore, TrendDirection } from '@/lib/shcmea/types/dtos/ai-visibility-dto'

interface ProviderScoresProps {
  providers: LLMProviderScore[]
}

const TrendIcon = ({ trend }: { trend?: TrendDirection }) => {
  if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />
  if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />
  return <Minus className="h-4 w-4 text-muted-foreground" />
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

export function ProviderScores({ providers }: ProviderScoresProps) {
  return (
    <div className="flex w-full flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg text-muted-foreground">AI Engine Performance</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {providers.map((provider) => (
          <div
            key={provider.name}
            className="flex h-80 flex-col justify-between rounded-4xl bg-muted/30"
          >
            {/* Header */}
            <div className="flex flex-col gap-y-4 p-6 pb-2">
              <div className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-x-3">
                  <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-background p-1">
                    <Image
                      src={provider.logo}
                      alt={provider.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <span className="text-lg">{provider.name}</span>
                </div>
                <TrendIcon trend={provider.trend} />
              </div>
              <h2 className={cn('text-5xl font-light', getScoreColor(provider.score))}>
                {provider.score}
                <span className="text-2xl text-muted-foreground">/100</span>
              </h2>
            </div>

            {/* Score Bar */}
            <div className="m-2 flex flex-col gap-y-4 rounded-3xl bg-card p-4">
              <div className="flex flex-col gap-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Visibility Score</span>
                  <span className="capitalize text-muted-foreground">{provider.status.replace('-', ' ')}</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn('h-full rounded-full transition-all duration-500', getBarColor(provider.score))}
                    style={{ width: `${provider.score}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
