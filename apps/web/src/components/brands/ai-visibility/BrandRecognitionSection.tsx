'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { BrandRecognitionProvider } from '@/lib/shcmea/types/dtos/ai-visibility-dto'

interface BrandRecognitionSectionProps {
  providers: BrandRecognitionProvider[]
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

const MetricBar = ({ label, value, max = 10 }: { label: string; value: number; max?: number }) => {
  const percentage = (value / max) * 100
  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span>{value}/{max}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn('h-full rounded-full transition-all duration-500', getBarColor(percentage))}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export function BrandRecognitionSection({ providers }: BrandRecognitionSectionProps) {
  return (
    <div className="flex w-full flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <h2 className="text-lg text-muted-foreground">Brand Recognition</h2>
        <p className="text-sm text-muted-foreground">
          How well AI models recognize and understand your brand across different platforms.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {providers.map((provider) => (
          <div
            key={provider.provider}
            className="flex flex-col rounded-4xl bg-muted/30"
          >
            {/* Header */}
            <div className="flex flex-col gap-y-4 p-6 pb-4">
              <div className="flex items-center gap-x-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-background p-1">
                  <Image
                    src={provider.logo}
                    alt={provider.provider}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-medium">{provider.provider}</span>
                  <span className="text-sm text-muted-foreground">{provider.marketPosition}</span>
                </div>
              </div>
              <h2 className={cn('text-5xl font-light', getScoreColor(provider.score))}>
                {provider.score}
                <span className="text-2xl text-muted-foreground">/100</span>
              </h2>
            </div>

            {/* Metrics */}
            <div className="m-2 flex flex-col gap-y-4 rounded-3xl bg-card p-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-sm text-muted-foreground">Brand Archetype</span>
                <span className="rounded-full bg-muted px-3 py-1 text-sm">{provider.brandArchetype}</span>
              </div>
              <MetricBar label="Confidence Level" value={provider.confidenceLevel} max={100} />
              <MetricBar label="Mention Depth" value={provider.mentionDepth} />
              <MetricBar label="Source Quality" value={provider.sourceQuality} />
              <MetricBar label="Data Richness" value={provider.dataRichness} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
