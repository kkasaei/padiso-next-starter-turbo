'use client'

// ============================================================
// BRAND POSITIONING MAP
// Visual map showing brand positions across AI providers
// ============================================================

import { useState } from 'react'
import Image from 'next/image'
import { HelpCircle } from 'lucide-react'
import { cn } from '@workspace/common/lib'
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip'
import type { PromptAnalyticsData } from '@workspace/common/lib/shcmea/types/dtos/prompt-analytics-dto'
import { PROVIDERS } from './constants'

interface BrandPositioningMapProps {
  analyticsData: PromptAnalyticsData | null
}

export function BrandPositioningMap({ analyticsData }: BrandPositioningMapProps) {
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null)

  // Get positioning data from analytics
  const positioning = analyticsData?.positioning || []

  // Find providers that have actual position data
  const providersWithData = positioning.filter(p => p.positions && p.positions.length > 0)

  // Use first provider with data as default, or first in list, or fallback to ChatGPT
  const defaultProvider = providersWithData[0]?.provider || positioning[0]?.provider || 'ChatGPT'
  const [selectedProvider, setSelectedProvider] = useState<string>(defaultProvider)

  // Find current provider's positioning (case-insensitive, match by id or name)
  const currentProviderData = positioning.find(
    (p) => p.provider.toLowerCase() === selectedProvider.toLowerCase() ||
           PROVIDERS.some(
             prov => (prov.name.toLowerCase() === selectedProvider.toLowerCase() ||
                      prov.id.toLowerCase() === selectedProvider.toLowerCase()) &&
                     (p.provider.toLowerCase() === prov.id.toLowerCase() ||
                      p.provider.toLowerCase() === prov.name.toLowerCase())
           )
  ) || positioning[0]

  // Build a domain lookup from competitors data
  const competitors = analyticsData?.competitors || []
  const domainLookup = new Map<string, string>()
  competitors.forEach(c => {
    if (c.domain) {
      domainLookup.set(c.name.toLowerCase(), c.domain)
    }
  })

  // Ensure positions is always an array (might come as JSON string from ClickHouse)
  const rawPositions = currentProviderData?.positions
  let positions: Array<{ name: string; x: number; y: number; isYourBrand?: boolean; domain?: string }> = []
  try {
    if (Array.isArray(rawPositions)) {
      positions = rawPositions
    } else if (typeof rawPositions === 'string') {
      positions = JSON.parse(rawPositions)
    }
  } catch {
    positions = []
  }

  // Try to infer domain from brand name (e.g., "Google" -> "google.com")
  const inferDomain = (name: string): string | null => {
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (!cleanName) return null
    // Try common TLDs
    return `${cleanName}.com`
  }

  // Enrich positions with domains from competitors if not already set
  positions = positions.map(p => ({
    ...p,
    domain: p.domain || domainLookup.get(p.name.toLowerCase()) || inferDomain(p.name) || undefined
  }))
  const xAxisLabel = currentProviderData?.xAxisLabel || { low: 'Budget-Friendly', high: 'Premium/Enterprise' }
  const yAxisLabel = currentProviderData?.yAxisLabel || { low: 'Traditional', high: 'AI-Innovative' }

  // If no positioning data at all, show empty state
  if (positioning.length === 0) {
    return (
      <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
          <div className="flex w-full flex-col gap-y-4">
            <div className="flex flex-row items-center gap-x-2">
              <span className="text-lg font-semibold">Brand Positioning Map</span>
            </div>
            <p className="text-sm text-muted-foreground">
              How AI engines position your brand relative to competitors.
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-y-4 rounded-3xl bg-card p-8 py-24">
          <HelpCircle className="h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">
            No positioning data available for the selected date range.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      {/* Header Section */}
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
        <div className="flex w-full flex-col gap-y-4">
          <div className="flex flex-row items-center gap-x-2">
            <span className="text-lg font-semibold">Brand Positioning Map</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <HelpCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-sm p-4">
                <div className="space-y-3 text-sm">
                  <p className="font-semibold">How is this map generated?</p>
                  <p className="opacity-90">
                    This map is created by analyzing how AI engines describe and compare your brand
                    with competitors across queries. Position is determined by semantic analysis of AI responses.
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-sm text-muted-foreground">
            How AI engines position your brand relative to competitors.
          </p>
        </div>

        {/* Provider Tabs */}
        <div className="flex shrink-0 flex-row items-center gap-2">
          {PROVIDERS.map((provider) => {
            // Check if this provider has actual position data (case-insensitive match)
            const providerData = positioning.find(
              p => p.provider.toLowerCase() === provider.id.toLowerCase() ||
                   p.provider.toLowerCase() === provider.name.toLowerCase()
            )
            // Parse positions if needed
            let providerPositions = providerData?.positions || []
            if (typeof providerPositions === 'string') {
              try { providerPositions = JSON.parse(providerPositions) } catch { providerPositions = [] }
            }
            const hasData = Array.isArray(providerPositions) && providerPositions.length > 0

            const isSelected = selectedProvider.toLowerCase() === provider.name.toLowerCase() ||
                               selectedProvider.toLowerCase() === provider.id.toLowerCase()

            return (
              <button
                key={provider.id}
                onClick={() => setSelectedProvider(provider.name)}
                className={cn(
                  'flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all',
                  isSelected
                    ? 'bg-card shadow-sm ring-1 ring-border'
                    : hasData
                      ? 'opacity-50 hover:opacity-75'
                      : 'opacity-30 cursor-not-allowed'
                )}
                disabled={!hasData}
              >
                <div className="relative h-4 w-4">
                  <Image
                    src={provider.logo}
                    alt={provider.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span>{provider.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Positioning Chart */}
      <div className="flex w-full flex-col gap-y-2 rounded-3xl bg-card p-4">
        {/* Chart Container with labels */}
        <div className="flex gap-4">
          {/* Y Axis Labels */}
          <div className="flex flex-col justify-between py-4 text-xs text-muted-foreground w-24 text-right">
            <span>{yAxisLabel.high}</span>
            <span>{yAxisLabel.low}</span>
          </div>

          {/* Chart Area */}
          <div className="flex-1 flex flex-col">
            {/* Grid Container */}
            <div className="relative w-full" style={{ paddingBottom: '75%' }}>
              <div className="absolute inset-0">
                {/* Grid Background */}
                <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div key={i} className="border border-border/30" />
                  ))}
                </div>

                {/* Axis Lines */}
                <div className="absolute left-0 right-0 top-1/2 h-px bg-border" />
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-border" />

                {/* Brand Points */}
                {positions.map((brand, index) => {
                  const isHovered = hoveredBrand === brand.name

                  return (
                    <div
                      key={`${brand.name}-${index}`}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                      style={{
                        left: `${brand.x}%`,
                        top: `${100 - brand.y}%`,
                      }}
                      onMouseEnter={() => setHoveredBrand(brand.name)}
                      onMouseLeave={() => setHoveredBrand(null)}
                    >
                      <div
                        className={cn(
                          'flex items-center gap-x-2 rounded-full px-2 py-1 transition-all cursor-pointer',
                          brand.isYourBrand
                            ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                            : 'bg-background border border-border shadow-sm hover:border-primary hover:shadow-md',
                          isHovered && !brand.isYourBrand && 'scale-105 border-primary'
                        )}
                      >
                        {/* Favicon or Dot */}
                        {brand.domain ? (
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${brand.domain}&sz=32`}
                            alt={brand.name}
                            className="h-5 w-5 shrink-0 rounded object-contain"
                          />
                        ) : (
                          <div
                            className={cn(
                              'h-2 w-2 shrink-0 rounded-full',
                              brand.isYourBrand ? 'bg-primary-foreground' : 'bg-primary'
                            )}
                          />
                        )}
                        {/* Brand Name */}
                        <span className={cn(
                          'text-xs font-medium whitespace-nowrap',
                          brand.isYourBrand ? 'text-primary-foreground' : 'text-foreground'
                        )}>
                          {brand.name}
                        </span>
                      </div>

                      {/* Hover Tooltip */}
                      {isHovered && (
                        <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-popover px-3 py-1.5 text-xs shadow-md ring-1 ring-border z-20">
                          <span className="text-muted-foreground">
                            Position: ({brand.x}, {brand.y})
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* X Axis Labels */}
            <div className="flex justify-between pt-2 text-xs text-muted-foreground">
              <span>{xAxisLabel.low}</span>
              <span>{xAxisLabel.high}</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 pt-2">
          {positions.map((brand, index) => (
            <div
              key={`legend-${brand.name}-${index}`}
              className={cn(
                'flex items-center gap-x-2 text-sm',
                brand.isYourBrand ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {brand.domain ? (
                <img
                  src={`https://www.google.com/s2/favicons?domain=${brand.domain}&sz=32`}
                  alt={brand.name}
                  className="h-4 w-4 shrink-0 rounded object-contain"
                />
              ) : (
                <span
                  className={cn(
                    'h-3 w-3 rounded-full',
                    brand.isYourBrand ? 'bg-primary' : 'bg-muted-foreground'
                  )}
                />
              )}
              {brand.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

