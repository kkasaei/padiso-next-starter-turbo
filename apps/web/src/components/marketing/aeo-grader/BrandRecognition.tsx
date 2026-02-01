'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Eye,
  User,
  TrendingUp,
  Award,
  Database
} from 'lucide-react';

import { Badge } from '@workspace/ui/components/badge';

interface BrandMetric {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

interface ProviderRecognition {
  provider: string;
  logo?: string;
  score: number;
  marketPosition: string;
  brandArchetype: string;
  confidenceLevel: number;
  mentionDepth: number;
  sourceQuality: number;
  dataRichness: number;
}

interface BrandRecognitionProps {
  providers: ProviderRecognition[];
}

const getScoreColor = (score: number): string => {
  if (score >= 70) return 'text-green-600 dark:text-green-400';
  if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

export function BrandRecognition({
  providers
}: BrandRecognitionProps): React.JSX.Element {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Brand Recognition</h2>
        <p className="text-muted-foreground">
          Shows how visible your brand is across digital channels. Higher scores mean more people recognize your brand name.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {Array.isArray(providers) && providers.map((provider) => {
          const scoreColor = getScoreColor(provider.score);

          return (
            <div
              key={provider.provider}
              className="group relative overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:shadow-2xl"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {provider.logo && (
                      <div className="relative h-8 w-8 shrink-0">
                        <Image
                          src={provider.logo}
                          alt={provider.provider}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <h3 className="text-lg font-semibold">{provider.provider}</h3>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-background/80 backdrop-blur-sm"
                  >
                    {provider.marketPosition}
                  </Badge>
                </div>

                {/* Score Display */}
                <div className="mb-6 space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-5xl font-bold ${scoreColor}`}>
                      {provider.score}
                    </span>
                    <span className="text-lg text-muted-foreground">/100</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative h-2 overflow-hidden rounded-full bg-muted/30">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        provider.score >= 70
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : provider.score >= 50
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                          : 'bg-gradient-to-r from-red-500 to-rose-500'
                      }`}
                      style={{ width: `${provider.score}%` }}
                    />
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="space-y-4">
                  {/* Primary Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <User className="size-3.5" />
                        <span>Brand Archetype</span>
                      </div>
                      <p className="font-semibold">{provider.brandArchetype}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <TrendingUp className="size-3.5" />
                        <span>Confidence</span>
                      </div>
                      <p className="font-semibold">{provider.confidenceLevel}%</p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-border" />

                  {/* Secondary Metrics */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col items-center rounded-lg bg-muted/30 p-3 text-center">
                      <Eye className="mb-1 size-4 text-muted-foreground" />
                      <div className="text-lg font-bold">{provider.mentionDepth}</div>
                      <div className="text-[10px] text-muted-foreground">Mention Depth</div>
                    </div>

                    <div className="flex flex-col items-center rounded-lg bg-muted/30 p-3 text-center">
                      <Award className="mb-1 size-4 text-muted-foreground" />
                      <div className="text-lg font-bold">{provider.sourceQuality}</div>
                      <div className="text-[10px] text-muted-foreground">Source Quality</div>
                    </div>

                    <div className="flex flex-col items-center rounded-lg bg-muted/30 p-3 text-center">
                      <Database className="mb-1 size-4 text-muted-foreground" />
                      <div className="text-lg font-bold">{provider.dataRichness}</div>
                      <div className="text-[10px] text-muted-foreground">Data Richness</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}



