'use client'

import * as React from 'react'
import Image from 'next/image'
import { HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip'
import type { BrandPositioning } from '@/lib/shcmea/types/dtos/ai-visibility-dto'

interface BrandPositioningSectionProps {
  positioning: BrandPositioning
  selectedProvider?: string
  onProviderChange?: (provider: string) => void
}

// Generate favicon URL from domain using Google's favicon service
const getFaviconUrl = (domain?: string) => {
  if (!domain) return null
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
}

export function BrandPositioningSection({ 
  positioning, 
  selectedProvider: controlledProvider,
  onProviderChange 
}: BrandPositioningSectionProps) {
  // Use controlled or uncontrolled mode
  const [internalProvider, setInternalProvider] = React.useState<string>(
    positioning.providers[0]?.provider || ''
  )
  const [hoveredBrand, setHoveredBrand] = React.useState<string | null>(null)
  
  // Determine which provider value to use
  const selectedProvider = controlledProvider ?? internalProvider
  
  // Handle provider change - call external handler if provided, otherwise use internal state
  const handleProviderChange = (provider: string) => {
    if (onProviderChange) {
      onProviderChange(provider)
    } else {
      setInternalProvider(provider)
    }
  }

  const currentPositions =
    positioning.providers.find((p) => p.provider === selectedProvider)?.positions || []

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      {/* Header Section - Inside gray card */}
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
                    with competitors across hundreds of queries. Position is determined by semantic 
                    analysis of AI responses.
                  </p>
                  <div className="space-y-2 pt-2 border-t border-white/20">
                    <p className="font-semibold">Axis Definitions:</p>
                    <div className="space-y-1.5">
                      <p className="opacity-90">
                        <span className="font-medium">X-Axis:</span>{' '}
                        {positioning.xAxisLabel.low} → {positioning.xAxisLabel.high}
                      </p>
                      <p className="opacity-70 text-xs">
                        Measures pricing perception and market tier positioning.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="opacity-90">
                        <span className="font-medium">Y-Axis:</span>{' '}
                        {positioning.yAxisLabel.low} → {positioning.yAxisLabel.high}
                      </p>
                      <p className="opacity-70 text-xs">
                        Measures innovation perception based on AI features and technology.
                      </p>
                    </div>
                  </div>
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
          {positioning.providers.map((provider) => (
            <button
              key={provider.provider}
              onClick={() => handleProviderChange(provider.provider)}
              className={cn(
                'flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all',
                selectedProvider === provider.provider
                  ? 'bg-card shadow-sm ring-1 ring-border'
                  : 'opacity-50 hover:opacity-75'
              )}
            >
              <div className="relative h-4 w-4">
                <Image
                  src={provider.logo}
                  alt={provider.provider}
                  fill
                  className="object-contain"
                />
              </div>
              <span>{provider.provider}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Positioning Chart - White card inside */}
      <div className="flex w-full flex-col gap-y-2 rounded-3xl bg-card p-4">
          {/* Chart Container with labels */}
          <div className="flex gap-4">
            {/* Y Axis Labels */}
            <div className="flex flex-col justify-between py-4 text-xs text-muted-foreground w-24 text-right">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help border-b border-dashed border-muted-foreground/50">
                    {positioning.yAxisLabel.high}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p className="text-sm">
                    Brands positioned higher are perceived as more innovative with advanced AI features, 
                    smart connectivity, and cutting-edge technology.
                  </p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help border-b border-dashed border-muted-foreground/50">
                    {positioning.yAxisLabel.low}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p className="text-sm">
                    Brands positioned lower are perceived as more traditional with focus on 
                    reliability and established methods over new technology.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Chart Area */}
            <div className="flex-1 flex flex-col">
              {/* Grid Container */}
              <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                <div className="absolute inset-0">
                  {/* Grid Background */}
                  <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
                    {Array.from({ length: 100 }).map((_, i) => (
                      <div
                        key={i}
                        className="border border-border/30"
                      />
                    ))}
                  </div>

                  {/* Axis Lines */}
                  <div className="absolute left-0 right-0 top-1/2 h-px bg-border" />
                  <div className="absolute top-0 bottom-0 left-1/2 w-px bg-border" />

                  {/* Brand Points */}
                  {currentPositions.map((brand) => {
                    const faviconUrl = brand.favicon || getFaviconUrl(brand.domain)
                    const isHovered = hoveredBrand === brand.name

                    return (
                      <div
                        key={brand.name}
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
                          {faviconUrl ? (
                            <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded">
                              <Image
                                src={faviconUrl}
                                alt={brand.name}
                                fill
                                className="object-contain"
                                unoptimized
                              />
                            </div>
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

                        {/* Hover Tooltip with coordinates */}
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help border-b border-dashed border-muted-foreground/50">
                      {positioning.xAxisLabel.low}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="text-sm">
                      Brands positioned left are perceived as more affordable, value-focused, 
                      and accessible to a wider market.
                    </p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help border-b border-dashed border-muted-foreground/50">
                      {positioning.xAxisLabel.high}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="text-sm">
                      Brands positioned right are perceived as premium, enterprise-grade, 
                      or luxury with higher price positioning.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 pt-2">
          {currentPositions.map((brand) => {
            const faviconUrl = brand.favicon || getFaviconUrl(brand.domain)
            
            return (
              <div
                key={brand.name}
                className={cn(
                  'flex items-center gap-x-2 text-sm',
                  brand.isYourBrand ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {faviconUrl ? (
                  <div className="relative h-4 w-4 shrink-0 overflow-hidden rounded">
                    <Image
                      src={faviconUrl}
                      alt={brand.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
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
            )
          })}
        </div>
      </div>
    </div>
  )
}
