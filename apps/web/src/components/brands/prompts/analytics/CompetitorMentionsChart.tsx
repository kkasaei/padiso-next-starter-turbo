'use client'

// ============================================================
// COMPETITOR MENTIONS CHART
// Dual pie charts showing full distribution and brand vs competition
// Uses ONLY real data passed via props - no mock fallbacks
// ============================================================

import { useState } from 'react'
import Image from 'next/image'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from 'recharts'
import { HelpCircle, PieChart as PieChartIcon } from 'lucide-react'

import { cn } from '@workspace/common/lib'
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip'
import type { PromptAnalyticsData, CompetitorData } from '@workspace/common/lib/shcmea/types/dtos/prompt-analytics-dto'
import { COMPETITION_PROVIDERS } from './constants'
import { getFaviconUrl, getMarketPositionData } from './helpers'

// Color palette for competitors
const COMPETITOR_COLORS = [
  '#3B82F6', // Blue (Your brand)
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#14B8A6', // Teal
]

interface CompetitorMentionsChartProps {
  analyticsData: PromptAnalyticsData | null
}

export function CompetitorMentionsChart({ analyticsData }: CompetitorMentionsChartProps) {
  const [selectedProvider, setSelectedProvider] = useState('ChatGPT')

  // Get positioning data for the selected provider (to match brand positioning map)
  const getPositioningBrands = () => {
    if (!analyticsData?.positioning?.length) return []

    const providerData = analyticsData.positioning.find(
      p => p.provider.toLowerCase() === selectedProvider.toLowerCase() ||
           p.provider.toLowerCase() === selectedProvider.toLowerCase().replace(/\s/g, '')
    )

    if (!providerData) return []

    // Parse positions if it's a string
    let positions = providerData.positions || []
    if (typeof positions === 'string') {
      try { positions = JSON.parse(positions) } catch { positions = [] }
    }

    return Array.isArray(positions) ? positions : []
  }

  // Transform data into chart format
  // Uses REAL mention percentages from competitors data, enriched with positioning brand info
  const getChartData = (): CompetitorData[] => {
    const positioningBrands = getPositioningBrands()
    
    // Build lookup maps from competitors data for real mention percentages
    const competitorMentions = new Map<string, number>()
    const competitorDomains = new Map<string, string>()
    const competitorIsYourBrand = new Map<string, boolean>()
    
    analyticsData?.competitors?.forEach(c => {
      const key = c.name.toLowerCase()
      competitorMentions.set(key, c.mentionPercentage)
      if (c.domain) competitorDomains.set(key, c.domain)
      if (c.isYourBrand) competitorIsYourBrand.set(key, true)
    })

    // If we have positioning data for this provider, use it for brand list
    // but get REAL mention percentages from competitors data
    if (positioningBrands.length > 0) {
      // Check if any brand is explicitly marked as "your brand"
      const hasExplicitYourBrand = positioningBrands.some(
        (brand: { isYourBrand?: boolean }) => brand.isYourBrand === true
      ) || Array.from(competitorIsYourBrand.values()).some(v => v)

      return positioningBrands.map((brand: { name: string; isYourBrand?: boolean; domain?: string }, index: number) => {
        const brandKey = brand.name.toLowerCase()
        // Use REAL mention percentage from competitors data, fallback to 0 if not found
        const realMentionPercentage = competitorMentions.get(brandKey) ?? 0
        
        return {
          name: brand.name,
          value: realMentionPercentage, // Use REAL data, not fake equal distribution
          color: COMPETITOR_COLORS[index % COMPETITOR_COLORS.length],
          position: index + 1,
          dateFound: new Date().toISOString(),
          domain: brand.domain || competitorDomains.get(brandKey) || `${brandKey.replace(/[^a-z0-9]/g, '')}.com`,
          // If no brand is explicitly marked, assume first brand is "your brand"
          isYourBrand: brand.isYourBrand === true || competitorIsYourBrand.get(brandKey) === true || (!hasExplicitYourBrand && index === 0),
        }
      })
    }

    // Fall back to competitors data directly
    if (!analyticsData?.competitors?.length) {
      return []
    }

    // Check if any competitor is explicitly marked as "your brand"
    const hasExplicitYourBrand = analyticsData.competitors.some(c => c.isYourBrand === true)

    return analyticsData.competitors.map((competitor, index) => ({
      name: competitor.name,
      value: competitor.mentionPercentage,
      color: COMPETITOR_COLORS[index % COMPETITOR_COLORS.length],
      position: index + 1,
      dateFound: new Date().toISOString(),
      domain: competitor.domain,
      // If no competitor is explicitly marked, assume first one is "your brand"
      isYourBrand: competitor.isYourBrand === true || (!hasExplicitYourBrand && index === 0),
    }))
  }

  const data = getChartData()
  const hasData = data.length > 0

  // Use the SAME data for both charts - this ensures consistency
  // The data already has isYourBrand correctly set from getChartData()
  const marketPositionData = getMarketPositionData(data)
  const yourBrand = data.find(c => c.isYourBrand)
  const topCompetitor = [...data].filter(c => !c.isYourBrand).sort((a, b) => b.value - a.value)[0]
  const gap = yourBrand && topCompetitor ? yourBrand.value - topCompetitor.value : 0

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider)
  }

  if (!hasData) {
    return (
      <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
          <div className="flex w-full flex-col gap-y-2">
            <span className="text-lg font-semibold">Competitor Mentions</span>
            <p className="text-sm text-muted-foreground">
              Share of voice when this prompt is asked.
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col rounded-3xl bg-card p-6">
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <PieChartIcon className="h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground text-center">
              No competitor data available yet.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      {/* Header Section */}
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
        <div className="flex w-full flex-col gap-y-2">
          <span className="text-lg font-semibold">Competitor Mentions</span>
          <p className="text-sm text-muted-foreground">
            Share of voice when this prompt is asked.
          </p>
        </div>

        {/* Provider Tabs */}
        <div className="flex shrink-0 flex-row items-center gap-2">
          {COMPETITION_PROVIDERS.filter(p => p.id !== 'all').map((provider) => {
            // Check if this provider has positioning data
            const providerPositioning = analyticsData?.positioning?.find(
              p => p.provider.toLowerCase() === provider.id.toLowerCase() ||
                   p.provider.toLowerCase() === provider.name.toLowerCase()
            )
            let providerPositions = providerPositioning?.positions || []
            if (typeof providerPositions === 'string') {
              try { providerPositions = JSON.parse(providerPositions) } catch { providerPositions = [] }
            }
            const hasData = Array.isArray(providerPositions) && providerPositions.length > 0

            return (
              <button
                key={provider.id}
                onClick={() => hasData && handleProviderChange(provider.name)}
                disabled={!hasData}
                className={cn(
                  'flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all',
                  !hasData && 'opacity-30 cursor-not-allowed',
                  hasData && selectedProvider === provider.name
                    ? 'bg-card shadow-sm ring-1 ring-border'
                    : hasData ? 'opacity-50 hover:opacity-75' : ''
                )}
              >
                {'logo' in provider && (
                  <div className="relative h-4 w-4">
                    <Image
                      src={provider.logo}
                      alt={provider.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <span>{provider.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Charts - White card inside */}
      <div className="flex w-full flex-col gap-y-2 rounded-3xl bg-card p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart 1 - Full Distribution */}
          <div className="flex flex-col">
            <h4 className="text-sm font-medium mb-4 text-muted-foreground">Full Distribution</h4>
            <div className="flex flex-col items-center gap-6">
              <div style={{ width: '280px', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data as unknown as Array<{ name: string; value: number; color: string; [key: string]: unknown }>}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        padding: '8px 12px',
                      }}
                      formatter={(value, name) => [`${value}%`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                {data.map((item, index) => {
                  const faviconUrl = getFaviconUrl(item.domain)
                  return (
                    <div key={`${item.name}-${index}`} className="flex items-center gap-2">
                      {faviconUrl ? (
                        <img
                          src={faviconUrl}
                          alt={item.name}
                          className="h-4 w-4 shrink-0 rounded object-contain"
                        />
                      ) : (
                        <div
                          className="h-3 w-3 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                      )}
                      <span className={cn(
                        "text-sm",
                        item.isYourBrand && "font-medium text-primary"
                      )}>
                        {item.name}
                      </span>
                      <span className={cn(
                        "text-sm font-medium",
                        item.isYourBrand && "text-primary"
                      )}>
                        {item.value}%
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Pie Chart 2 - Your Brand vs Competition */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <h4 className="text-sm font-medium text-muted-foreground">Your Brand vs Competition</h4>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs p-3">
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">What does this chart show?</p>
                    <p className="text-muted-foreground">
                      A simplified view of your market position showing your brand vs the top competitor and all others combined.
                    </p>
                    <p className="font-medium pt-1">Center Number</p>
                    <p className="text-muted-foreground">
                      Shows your share of voice gap vs the top competitor.
                      <span className="text-green-600"> Positive (+)</span> means you&apos;re leading,
                      <span className="text-red-600"> negative (-)</span> means you&apos;re behind.
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex flex-col items-center gap-6">
              <div className="relative" style={{ width: '280px', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={marketPositionData as unknown as Array<{ name: string; value: number; color: string; [key: string]: unknown }>}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {marketPositionData.map((entry, index) => (
                        <Cell key={`cell-market-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        padding: '8px 12px',
                      }}
                      formatter={(value, name) => [`${value}%`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className={cn(
                    "text-3xl font-bold",
                    gap >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {gap >= 0 ? '+' : ''}{gap}%
                  </span>
                  <span className="text-xs text-muted-foreground">vs {topCompetitor?.name || 'leader'}</span>
                </div>
              </div>
              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                {marketPositionData.map((item) => {
                  const faviconUrl = getFaviconUrl(item.domain)
                  return (
                    <div key={item.name} className="flex items-center gap-2">
                      {faviconUrl ? (
                        <img
                          src={faviconUrl}
                          alt={item.name}
                          className="h-4 w-4 shrink-0 rounded object-contain"
                        />
                      ) : (
                        <div
                          className="h-3 w-3 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                      )}
                      <span className={cn(
                        "text-sm",
                        item.isYourBrand && "font-medium text-primary"
                      )}>
                        {item.name}
                      </span>
                      <span className={cn(
                        "text-sm font-medium",
                        item.isYourBrand && "text-primary"
                      )}>
                        {item.value}%
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
