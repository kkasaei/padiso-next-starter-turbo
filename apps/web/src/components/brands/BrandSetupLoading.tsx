'use client'

import { Sparkles } from 'lucide-react'
import { Skeleton } from '@workspace/ui/components/skeleton'

// ============================================================
// SETUP HERO - Minimal but magical anticipation
// ============================================================
function SetupHero() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Animated icon with subtle glow */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-gray-900/5 dark:bg-white/5 blur-xl animate-pulse" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-polar-800">
          <Sparkles className="h-6 w-6 text-gray-400 dark:text-polar-400 animate-pulse" />
        </div>
      </div>
      
      {/* Copy with animated dots */}
      <p className="text-lg text-gray-500 dark:text-polar-400 max-w-sm">
        We're setting up your brand
        <span className="inline-flex ml-0.5">
          <span className="animate-[bounce_1s_ease-in-out_infinite]">.</span>
          <span className="animate-[bounce_1s_ease-in-out_0.2s_infinite]">.</span>
          <span className="animate-[bounce_1s_ease-in-out_0.4s_infinite]">.</span>
        </span>
        <br />
        <span className="text-gray-400 dark:text-polar-500">This usually takes 10–15 minutes.</span>
      </p>
    </div>
  )
}

// ============================================================
// STAT CARD SKELETON
// ============================================================
function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-transparent bg-gray-100 p-4 dark:border-polar-700 dark:bg-polar-800">
      <div className="flex flex-row items-center gap-2 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3.5 w-3.5 rounded-full" />
      </div>
      <div className="pt-0">
        <Skeleton className="h-8 w-12" />
      </div>
    </div>
  )
}

// ============================================================
// METRIC CARD SKELETON (matching the real design)
// ============================================================
function MetricCardSkeleton() {
  return (
    <div className="group flex w-full flex-col justify-between rounded-xl border border-transparent bg-gray-50 p-2 shadow-xs dark:border-polar-700 dark:bg-polar-800 lg:rounded-4xl">
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
        <div className="flex w-full flex-col gap-y-4">
          {/* Title row */}
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-x-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="h-4 w-4" />
          </div>
          {/* Value */}
          <div className="flex items-baseline gap-x-2">
            <Skeleton className="h-12 w-20" />
            <Skeleton className="h-6 w-8" />
          </div>
          {/* Date range label */}
          <div className="flex flex-row items-center gap-x-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </div>
      {/* Chart area with shimmer effect */}
      <div className="flex w-full flex-col gap-y-2 rounded-3xl bg-white p-4 dark:bg-polar-900">
        <div className="relative h-[200px] w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-polar-800 animate-pulse" />
      </div>
    </div>
  )
}

// ============================================================
// OPPORTUNITIES CHART SKELETON - Simple placeholder
// ============================================================
function OpportunitiesChartSkeleton() {
  return (
    <div className="flex w-full flex-col gap-y-8 rounded-4xl border border-transparent bg-gray-50 p-6 dark:border-transparent dark:bg-polar-800">
      <div className="flex flex-col gap-y-4">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="h-48 rounded-2xl bg-gray-100 dark:bg-polar-700" />
    </div>
  )
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export function BrandSetupLoading() {
  return (
    <div className="relative flex min-w-0 flex-2 flex-col items-center md:overflow-y-auto md:bg-white md:shadow-xs">
      <div className="flex h-full w-full flex-col">
        {/* Hero section - the magical moment */}
        <SetupHero />

        {/* Faded preview of what's coming */}
        <div className="opacity-30 pointer-events-none space-y-12 pb-8">
          {/* Stats Cards - Skeleton */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>

          {/* Opportunities Chart - Skeleton */}
          <OpportunitiesChartSkeleton />

          {/* Metric Cards Grid - Skeleton */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <MetricCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

