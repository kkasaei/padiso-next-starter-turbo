'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BrandPosition {
  name: string;
  domain?: string; // Domain to fetch favicon from (e.g., "example.com")
  x: number; // 0-100
  y: number; // 0-100
  isYourBrand?: boolean;
}

interface ProviderData {
  provider: string;
  logo: string;
  positions: BrandPosition[];
}

interface BrandPositioningChartProps {
  xAxisLabel: { low: string; high: string };
  yAxisLabel: { low: string; high: string };
  providers: ProviderData[];
}

/**
 * Get favicon URL for a domain using Google's favicon service
 */
function getFaviconUrl(domain: string, size: number = 64): string {
  // Clean the domain (remove protocol if present)
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(cleanDomain)}&sz=${size}`;
}

export function BrandPositioningChart({
  xAxisLabel,
  yAxisLabel,
  providers
}: BrandPositioningChartProps): React.JSX.Element {
  const [hoveredBrand, setHoveredBrand] = React.useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = React.useState<string>(
    providers[0]?.provider || ''
  );

  const currentPositions =
    providers.find((p) => p.provider === selectedProvider)?.positions || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Brand Positioning</h2>
          <p className="text-muted-foreground">
            See where your brand stands in the competitive landscape
          </p>
        </div>

        {/* Answer Engine Filter */}
        <div className="flex flex-wrap gap-2">
          {providers.map((provider) => (
            <button
              key={provider.provider}
              onClick={() => setSelectedProvider(provider.provider)}
              className={cn(
                'flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-semibold shadow-sm transition-all hover:scale-105',
                selectedProvider === provider.provider
                  ? 'border-primary bg-primary text-primary-foreground shadow-lg'
                  : 'border-border bg-background hover:border-primary/50 hover:shadow-md'
              )}
            >
              <Image
                src={provider.logo}
                alt={provider.provider}
                width={20}
                height={20}
                className={cn(
                  "h-5 w-5 object-contain transition-all",
                  selectedProvider === provider.provider
                    ? 'brightness-0 invert'
                    : ''
                )}
              />
              <span>{provider.provider}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart Content */}
      <div className="relative aspect-square w-full max-w-3xl mx-auto">
        {/* Chart Container */}
        <div className="relative h-full w-full border-2 border-border bg-muted/10 rounded-2xl shadow-inner backdrop-blur-sm">
          {/* Grid Lines */}
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="border-r border-b border-border/30 last:border-r-0 [&:nth-child(4n)]:border-r-0"
              />
            ))}
          </div>

          {/* Center Lines */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-border" />

          {/* Brand Positions */}
          {currentPositions.map((brand, index) => {
            const isHovered = hoveredBrand === brand.name;
            const isYourBrand = brand.isYourBrand;
            const hasFavicon = !!brand.domain;

            return (
              <div
                key={index}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
                style={{
                  left: `${brand.x}%`,
                  top: `${100 - brand.y}%`,
                  zIndex: isYourBrand ? 50 : isHovered ? 40 : 10
                }}
                onMouseEnter={() => setHoveredBrand(brand.name)}
                onMouseLeave={() => setHoveredBrand(null)}
              >
                {/* Highlight Circle for Your Brand */}
                {isYourBrand && (
                  <div className="absolute inset-0 -m-8">
                    <svg
                      className="w-full h-full animate-pulse"
                      viewBox="0 0 100 100"
                    >
                      <ellipse
                        cx="50"
                        cy="50"
                        rx="45"
                        ry="35"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        opacity="0.5"
                      />
                    </svg>
                  </div>
                )}

                {/* Brand Box with Favicon and Name */}
                <div
                  className={cn(
                    'relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer',
                    isYourBrand
                      ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl ring-2 ring-primary/50 ring-offset-2 ring-offset-background scale-105'
                      : 'bg-card border-2 border-border shadow-md hover:shadow-xl hover:border-primary/50',
                    isHovered && !isYourBrand ? 'scale-110 border-primary shadow-xl' : ''
                  )}
                >
                  {/* Favicon */}
                  {hasFavicon && (
                    <div className="relative flex-shrink-0 h-5 w-5 rounded overflow-hidden">
                      <Image
                        src={getFaviconUrl(brand.domain!, 64)}
                        alt={brand.name}
                        width={20}
                        height={20}
                        className="rounded-sm"
                        unoptimized // External URL from Google
                      />
                    </div>
                  )}

                  {/* Brand Name */}
                  <span className={cn(
                    'font-semibold text-sm whitespace-nowrap',
                    isYourBrand ? 'text-primary-foreground' : 'text-foreground'
                  )}>
                    {brand.name}
                  </span>

                  {/* Your Brand Label */}
                  {isYourBrand && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-bold bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
                      Your Brand
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Y-Axis Label (Top) */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-semibold">
          {yAxisLabel.high}
        </div>

        {/* Y-Axis Label (Bottom) */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-semibold">
          {yAxisLabel.low}
        </div>

        {/* X-Axis Label (Left) */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-4 text-sm font-semibold text-right">
          {xAxisLabel.low}
        </div>

        {/* X-Axis Label (Right) */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full pl-4 text-sm font-semibold">
          {xAxisLabel.high}
        </div>
      </div>

      {/* Legend */}
      <div className="relative mt-8 pt-6 border-t flex flex-wrap gap-6 justify-center text-sm font-medium">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-gradient-to-br from-primary to-primary/80 rounded-lg shadow-md ring-1 ring-primary/50">
            <div className="w-4 h-4 bg-white/20 rounded" />
            <span className="text-primary-foreground text-xs">Brand</span>
          </div>
          <span className="text-foreground">Your Brand</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-card border-2 border-border rounded-lg shadow-sm">
            <div className="w-4 h-4 bg-muted rounded" />
            <span className="text-foreground text-xs">Brand</span>
          </div>
          <span className="text-foreground">Competitors</span>
        </div>
      </div>
    </div>
  );
}
