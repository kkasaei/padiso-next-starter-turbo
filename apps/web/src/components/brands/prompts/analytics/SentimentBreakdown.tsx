'use client'

// ============================================================
// SENTIMENT BREAKDOWN
// Shows sentiment distribution (positive/neutral/negative)
// Uses ONLY real data from analyticsData prop - no mock fallbacks
// ============================================================

import { Smile } from 'lucide-react'

import type { PromptAnalyticsData, SentimentBreakdown as SentimentBreakdownType } from '@/lib/shcmea/types/dtos/prompt-analytics-dto'

interface SentimentBreakdownProps {
  analyticsData: PromptAnalyticsData | null
}

export function SentimentBreakdown({ analyticsData }: SentimentBreakdownProps) {
  // Calculate sentiment from real mentions ONLY - no mock fallbacks
  const getSentimentFromMentions = (): SentimentBreakdownType | null => {
    if (!analyticsData?.mentions?.length) {
      return null
    }
    const mentions = analyticsData.mentions
    const positive = mentions.filter(m => m.sentiment === 'positive').length
    const negative = mentions.filter(m => m.sentiment === 'negative').length
    const neutral = mentions.filter(m => m.sentiment === 'neutral').length
    const total = mentions.length || 1
    return {
      positive: Math.round((positive / total) * 100),
      neutral: Math.round((neutral / total) * 100),
      negative: Math.round((negative / total) * 100),
    }
  }

  const sentimentData = getSentimentFromMentions()
  const hasData = sentimentData !== null

  return (
    <div className="group flex w-full flex-col justify-between p-2 bg-transparent dark:bg-transparent border dark:border-polar-700 border-t-0 border-r border-b border-l-0 border-gray-200 shadow-none">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-1">Sentiment Analysis</h3>
        <p className="text-sm text-muted-foreground mb-6">
          How AI responses characterize your brand for this prompt
        </p>
        {hasData ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="w-20 text-sm">Positive</span>
              <div className="flex-1 h-3 bg-gray-100 dark:bg-polar-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${sentimentData.positive}%` }}
                />
              </div>
              <span className="w-12 text-sm font-medium text-right">
                {sentimentData.positive}%
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-20 text-sm">Neutral</span>
              <div className="flex-1 h-3 bg-gray-100 dark:bg-polar-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-400 rounded-full transition-all duration-500"
                  style={{ width: `${sentimentData.neutral}%` }}
                />
              </div>
              <span className="w-12 text-sm font-medium text-right">
                {sentimentData.neutral}%
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-20 text-sm">Negative</span>
              <div className="flex-1 h-3 bg-gray-100 dark:bg-polar-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${sentimentData.negative}%` }}
                />
              </div>
              <span className="w-12 text-sm font-medium text-right">
                {sentimentData.negative}%
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <Smile className="h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground text-center">
              No sentiment data available yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
