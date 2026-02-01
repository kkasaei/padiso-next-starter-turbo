'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';

import { GridSection } from '../../shared/fragments/GridSection';

interface ReportSkeletonProps {
  domain: string;
}

/**
 * Dashed grid lines for report skeleton
 */
function ReportSkeletonDashedGridLines(): React.JSX.Element {
  return (
    <>
      <svg className="absolute left-[16.85%] top-0 hidden h-full w-px mask-[linear-gradient(to_bottom,#0000,#000_128px,#000_calc(100%-24px),#0000)] lg:block">
        <line
          x1="0.5"
          y1="0"
          x2="0.5"
          y2="100%"
          strokeLinecap="round"
          strokeDasharray="5 5"
          stroke="var(--border)"
        />
      </svg>
      <svg className="absolute right-[16.85%] top-0 hidden h-full w-px mask-[linear-gradient(to_bottom,#0000,#000_128px,#000_calc(100%-24px),#0000)] lg:block">
        <line
          x1="0.5"
          y1="0"
          x2="0.5"
          y2="100%"
          strokeLinecap="round"
          strokeDasharray="5 5"
          stroke="var(--border)"
        />
      </svg>
      <svg className="absolute bottom-0 left-[calc(50%-50vw)] hidden h-px w-screen mask-[linear-gradient(to_right,#0000,#000_100px,#000_calc(100%-100px),#0000)] lg:block">
        <line
          x1="0"
          y1="0.5"
          x2="100%"
          y2="0.5"
          strokeLinecap="round"
          strokeDasharray="5 5"
          stroke="var(--border)"
        />
      </svg>
    </>
  );
}

export function ReportSkeleton({ domain }: ReportSkeletonProps): React.JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <GridSection>
        <ReportSkeletonDashedGridLines />
        <div className="container relative mx-auto px-4 py-12 md:py-20">
          <div className="mx-auto max-w-5xl">
            {/* Top row skeleton */}
            <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-3">
                <div className="h-7 w-24 animate-pulse rounded-full bg-muted" />
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              </div>
              <div className="hidden gap-2 sm:flex">
                <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
                <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />
              </div>
            </div>

            {/* Main content area */}
            <div className="flex flex-col items-center gap-8 md:items-start">
              {/* Domain name and description */}
              <div className="flex-1 space-y-6 text-center md:text-left">
                <div className="space-y-3">
                  {/* Domain name - actual value */}
                  <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                    {decodeURIComponent(domain)}
                  </h1>
                  {/* Description */}
                  <p className="text-lg text-muted-foreground md:text-xl">
                    Answer Engine Optimization Performance Analysis
                  </p>
                </div>

                {/* Stats preview skeleton */}
                <div className="flex flex-wrap justify-center gap-6 md:justify-start">
                  {[1, 2, 3].map((i) => (
                    <React.Fragment key={i}>
                      <div className="space-y-2">
                        <div className="h-10 w-16 animate-pulse rounded bg-muted" />
                        <div className="h-3 w-20 animate-pulse rounded bg-muted/70" />
                      </div>
                      {i < 3 && <div className="h-auto w-px bg-border" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Loading message */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-3 rounded-full border bg-background/80 px-6 py-3 shadow-lg backdrop-blur-sm">
                <Loader2 className="size-5 animate-spin text-primary" />
                <div className="space-y-1 text-left">
                  <p className="text-sm font-semibold">Preparing your report...</p>
                  <p className="text-xs text-muted-foreground">
                    Analyzing your brand across AI platforms
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GridSection>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-16">
          {/* AEO Score Cards Skeleton */}
          <section className="space-y-6">
            <div className="space-y-2">
              <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
              <div className="h-5 w-96 animate-pulse rounded bg-muted/70" />
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="size-10 animate-pulse rounded-lg bg-muted" />
                      <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 w-20 animate-pulse rounded-lg bg-muted" />
                      <div className="h-4 w-24 animate-pulse rounded bg-muted/70" />
                    </div>
                    <div className="space-y-2">
                      {[1, 2].map((j) => (
                        <div key={j} className="flex items-center justify-between">
                          <div className="h-3 w-32 animate-pulse rounded bg-muted/70" />
                          <div className="h-3 w-12 animate-pulse rounded bg-muted" />
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent [animation:shimmer_2s_infinite]" />
                </div>
              ))}
            </div>
          </section>

          {/* Brand Recognition Skeleton */}
          <section className="space-y-6">
            <div className="space-y-2">
              <div className="h-8 w-72 animate-pulse rounded-lg bg-muted" />
              <div className="h-5 w-full max-w-2xl animate-pulse rounded bg-muted/70" />
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="size-12 animate-pulse rounded-lg bg-muted" />
                      <div className="h-6 w-32 animate-pulse rounded bg-muted" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="space-y-2">
                          <div className="h-3 w-24 animate-pulse rounded bg-muted/70" />
                          <div className="h-6 w-16 animate-pulse rounded bg-muted" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent [animation:shimmer_2s_infinite]" />
                </div>
              ))}
            </div>
          </section>

          {/* Chart Skeleton */}
          <section className="space-y-6">
            <div className="space-y-2">
              <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
              <div className="h-5 w-96 animate-pulse rounded bg-muted/70" />
            </div>
            <div className="relative overflow-hidden rounded-xl border bg-card p-8 shadow-sm">
              <div className="flex items-center justify-center">
                <div className="size-96 animate-pulse rounded-lg bg-muted/50" />
              </div>
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
          </section>

          {/* Sentiment Analysis Skeleton */}
          <section className="space-y-6">
            <div className="space-y-2">
              <div className="h-8 w-56 animate-pulse rounded-lg bg-muted" />
              <div className="h-5 w-full max-w-xl animate-pulse rounded bg-muted/70" />
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm"
                >
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="size-10 animate-pulse rounded-lg bg-muted" />
                      <div className="h-5 w-28 animate-pulse rounded bg-muted" />
                    </div>
                    <div className="space-y-4">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="space-y-2">
                          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                          <div className="h-2 w-full animate-pulse rounded-full bg-muted/70" />
                          <div className="h-3 w-full animate-pulse rounded bg-muted/50" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent [animation:shimmer_2s_infinite]" />
                </div>
              ))}
            </div>
          </section>

          {/* Loading progress indicator */}
          <div className="flex justify-center">
            <div className="w-full max-w-md space-y-4 rounded-xl border bg-card p-6 shadow-sm">
              <div className="space-y-2 text-center">
                <p className="text-sm font-medium">Analyzing Your Brand</p>
                <div className="flex items-center justify-center gap-2">
                  <div className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                  <div className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                  <div className="size-2 animate-bounce rounded-full bg-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 [animation:progress_3s_ease-in-out_infinite]" />
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  This may take a few moments...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
