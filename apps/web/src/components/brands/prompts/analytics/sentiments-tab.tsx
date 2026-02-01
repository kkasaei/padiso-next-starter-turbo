'use client'

// ============================================================
// SENTIMENTS TAB CONTENT
// Matches the design with:
// 1. Sentiment Analysis - horizontal bars for positive/neutral/negative
// 2. Sentiment Breakdown - 3-column grid showing all providers
// 3. Contextual Analysis - narrative themes
// Uses ONLY real data from analyticsData prop - no mock fallbacks
// ============================================================

import { useState } from 'react'
import Image from 'next/image'
import { TabsContent } from '@workspace/ui/components/tabs'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@workspace/ui/components/collapsible'
import { Heart, ChevronUp, CheckCircle, Tag } from 'lucide-react'

import type { PromptAnalyticsData, SentimentMetricItem } from '@/lib/shcmea/types/dtos/prompt-analytics-dto'

import { PROVIDERS } from './constants'
import { getProviderLogo } from './helpers'

type ProviderTab = 'chatgpt' | 'perplexity' | 'gemini'

interface SentimentsTabProps {
  analyticsData: PromptAnalyticsData | null
}

export function SentimentsTab({ analyticsData }: SentimentsTabProps) {
  const [selectedProvider, setSelectedProvider] = useState<ProviderTab>('chatgpt')
  const [expandedProviders, setExpandedProviders] = useState<Set<string>>(
    new Set(['chatgpt', 'perplexity', 'gemini'])
  )

  // Get sentiment breakdown from real data
  const sentimentBreakdown = analyticsData?.sentimentBreakdown || []
  const sentimentMetricsByProvider = analyticsData?.sentimentMetricsByProvider || {}
  const narrativeThemesByProvider = analyticsData?.narrativeThemesByProvider || {}
  
  // Get narrative themes for selected provider
  const getProviderNarrativeThemes = (providerId: string): string[] => {
    // Normalize provider id for lookup
    const normalizedId = providerId.toLowerCase()
    return narrativeThemesByProvider[normalizedId] || []
  }
  
  const currentNarrativeThemes = getProviderNarrativeThemes(selectedProvider)

  // Calculate overall sentiment percentages (aggregate across selected provider or all)
  const calculateSentimentPercentages = () => {
    const mentions = analyticsData?.mentions || []
    const providerMentions = selectedProvider === 'chatgpt'
      ? mentions.filter(m => m.provider?.toLowerCase().includes('gpt') || m.provider?.toLowerCase().includes('openai') || m.provider?.toLowerCase().includes('chatgpt'))
      : mentions.filter(m => m.provider?.toLowerCase().includes(selectedProvider.toLowerCase()))

    const total = providerMentions.length || 1
    const positive = providerMentions.filter(m => m.sentiment === 'positive').length
    const neutral = providerMentions.filter(m => m.sentiment === 'neutral').length
    const negative = providerMentions.filter(m => m.sentiment === 'negative').length

    return {
      positive: Math.round((positive / total) * 100),
      neutral: Math.round((neutral / total) * 100),
      negative: Math.round((negative / total) * 100),
    }
  }

  const sentimentPercentages = calculateSentimentPercentages()

  // Get provider sentiment data
  const getProviderData = (providerId: string) => {
    const breakdown = sentimentBreakdown.find(
      s => s.provider.toLowerCase().includes(providerId.toLowerCase()) ||
           (providerId === 'chatgpt' && (s.provider.toLowerCase().includes('gpt') || s.provider.toLowerCase().includes('openai')))
    )
    const metrics = sentimentMetricsByProvider[providerId] || []
    
    return {
      score: breakdown?.score || 0,
      polarization: breakdown?.polarization || 0,
      metrics,
    }
  }

  const toggleProvider = (providerId: string) => {
    setExpandedProviders(prev => {
      const next = new Set(prev)
      if (next.has(providerId)) {
        next.delete(providerId)
      } else {
        next.add(providerId)
      }
      return next
    })
  }

  // Check if any provider has narrative themes
  const hasAnyNarrativeThemes = Object.values(narrativeThemesByProvider).some(themes => themes.length > 0)
  const hasData = sentimentBreakdown.length > 0 || Object.keys(sentimentMetricsByProvider).length > 0

  // Empty state
  if (!hasData && !hasAnyNarrativeThemes) {
    return (
      <TabsContent value="sentiments" className="space-y-8">
        <div className="md:dark:bg-polar-900 dark:border-polar-700 w-full md:rounded-xl md:border md:border-gray-100 md:bg-gray-50 md:p-8 lg:rounded-4xl items-center justify-center gap-y-6 md:flex md:flex-col md:py-48">
          <Heart className="text-gray-300 dark:text-gray-600 h-16 w-16" />
          <div className="flex flex-col items-center gap-y-6">
            <div className="flex flex-col items-center gap-y-2">
              <h3 className="text-lg font-medium">No Sentiment Data Yet</h3>
              <p className="dark:text-polar-500 text-gray-500 text-center max-w-md">
                Sentiment analysis will appear here after scans are performed.
                Run a scan to analyze how AI responses characterize your brand.
              </p>
            </div>
          </div>
        </div>
      </TabsContent>
    )
  }

  const selectedProviderName = PROVIDERS.find(p => p.id === selectedProvider)?.name || 'ChatGPT'

  return (
    <TabsContent value="sentiments" className="space-y-8">
      {/* Sentiment Analysis - Horizontal Bars */}
      <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
          <div className="flex w-full flex-col gap-y-2">
            <h3 className="text-lg font-semibold">Sentiment Analysis</h3>
            <p className="text-sm text-muted-foreground">
              How {selectedProviderName} responses characterize your brand for this prompt.
            </p>
          </div>

          <div className="flex shrink-0 flex-row items-center gap-2">
            {PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                onClick={() => setSelectedProvider(provider.id as ProviderTab)}
                className={`flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all ${
                  selectedProvider === provider.id
                    ? 'bg-card shadow-sm ring-1 ring-border'
                    : 'opacity-50 hover:opacity-75'
                }`}
              >
                <div className="relative h-4 w-4">
                  <Image
                    src={getProviderLogo(provider.id)}
                    alt={provider.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span>{provider.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 rounded-3xl bg-card p-6">
          {/* Positive Bar */}
          <div className="flex items-center gap-4">
            <span className="w-20 text-sm font-medium">Positive</span>
            <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${sentimentPercentages.positive}%` }}
              />
            </div>
            <span className="w-12 text-sm font-medium text-right">{sentimentPercentages.positive}%</span>
          </div>

          {/* Neutral Bar */}
          <div className="flex items-center gap-4">
            <span className="w-20 text-sm font-medium">Neutral</span>
            <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-400 rounded-full transition-all duration-500"
                style={{ width: `${sentimentPercentages.neutral}%` }}
              />
            </div>
            <span className="w-12 text-sm font-medium text-right">{sentimentPercentages.neutral}%</span>
          </div>

          {/* Negative Bar */}
          <div className="flex items-center gap-4">
            <span className="w-20 text-sm font-medium">Negative</span>
            <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-500"
                style={{ width: `${sentimentPercentages.negative}%` }}
              />
            </div>
            <span className="w-12 text-sm font-medium text-right">{sentimentPercentages.negative}%</span>
          </div>
        </div>
      </div>

      {/* Sentiment Breakdown - Single container with 3 inner cards */}
      <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
        <div className="flex flex-col gap-6 p-6">
          <div className="flex w-full flex-col gap-y-2">
            <h3 className="text-lg font-semibold">Sentiment Breakdown</h3>
            <p className="text-sm text-muted-foreground">
              How your brand is perceived across different AI platforms and contexts.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col rounded-3xl bg-card p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROVIDERS.map((provider) => {
              const providerData = getProviderData(provider.id)
              const isExpanded = expandedProviders.has(provider.id)

              return (
                <Collapsible
                  key={provider.id}
                  open={isExpanded}
                  onOpenChange={() => toggleProvider(provider.id)}
                  className="flex w-full flex-col rounded-xl border border-border overflow-hidden"
                >
                  {/* Header */}
                  <CollapsibleTrigger className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative h-5 w-5">
                        <Image
                          src={getProviderLogo(provider.id)}
                          alt={provider.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="font-medium">{provider.name}</span>
                    </div>
                    <ChevronUp
                      className={`h-5 w-5 text-muted-foreground transition-transform ${
                        isExpanded ? '' : 'rotate-180'
                      }`}
                    />
                  </CollapsibleTrigger>

                  {/* Score Section - Always Visible */}
                  <div className="px-4 pb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-light text-primary">{providerData.score || '--'}</span>
                      <span className="text-lg text-muted-foreground">/100</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-muted-foreground">
                        Polarization: <span className="text-primary">{providerData.polarization}%</span>
                      </span>
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        <span>Reliable</span>
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Metrics Content */}
                  <CollapsibleContent>
                    <div className="border-t border-border">
                      {providerData.metrics.length > 0 ? (
                        <div className="p-4 space-y-4">
                          {providerData.metrics.map((metric, idx) => (
                            <div key={idx} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">{metric.category}</span>
                                <span className="text-sm font-semibold text-primary">{metric.score}</span>
                              </div>
                              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    metric.score >= 70
                                      ? 'bg-primary'
                                      : metric.score >= 50
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                  }`}
                                  style={{ width: `${metric.score}%` }}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {metric.description}
                              </p>
                              {metric.keyFactors && metric.keyFactors.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {metric.keyFactors.slice(0, 3).map((factor, fIdx) => (
                                    <span
                                      key={fIdx}
                                      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-muted text-muted-foreground"
                                    >
                                      {factor}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center">
                          <p className="text-sm text-muted-foreground">
                            No detailed metrics available for {provider.name} yet.
                          </p>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )
            })}
          </div>
        </div>
      </div>

      {/* Contextual Analysis - Narrative Themes */}
      <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
          <div className="flex w-full flex-col gap-y-2">
            <h3 className="text-lg font-semibold">Contextual Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Recurring narratives and perceptions from {selectedProviderName}.
            </p>
          </div>

          <div className="flex shrink-0 flex-row items-center gap-2">
            {PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                onClick={() => setSelectedProvider(provider.id as ProviderTab)}
                className={`flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all ${
                  selectedProvider === provider.id
                    ? 'bg-card shadow-sm ring-1 ring-border'
                    : 'opacity-50 hover:opacity-75'
                }`}
              >
                <div className="relative h-4 w-4">
                  <Image
                    src={getProviderLogo(provider.id)}
                    alt={provider.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span>{provider.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col rounded-3xl bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Narrative Themes</span>
            <span className="text-xs text-muted-foreground">
              {currentNarrativeThemes.length} themes identified by {selectedProviderName}
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {currentNarrativeThemes.length > 0 ? (
              currentNarrativeThemes.map((theme, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                >
                  {theme}
                </span>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No narrative themes detected yet. Check back after more AI responses are analyzed.
              </p>
            )}
          </div>
        </div>
      </div>
    </TabsContent>
  )
}
