'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HelpCircle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@workspace/ui/components/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip'
import { AnalyticsDatePicker } from '@workspace/ui/components/analytics-date-picker'
import { AnalyticsDateRangeProvider } from '@workspace/ui/hooks/use-analytics-date-range'

import type { DashboardStats } from './types'
import {
  MetricsGrid,
  OpportunitiesChart,
} from './components'

function PageContent() {
  // TODO: Replace with actual data fetching when API is ready
  const [dashboardStats] = useState<DashboardStats | null>(null)
  const [isLoadingStats] = useState(false)

  const stats = {
    trackedPrompts: dashboardStats?.trackedPrompts ?? 0,
    activeKeywords: 0,
    openOpportunities: dashboardStats?.openOpportunities ?? 0,
  }

  const hasProjectData = !isLoadingStats && (dashboardStats?.trackedPrompts ?? 0) > 0

  return (
    <div className="relative flex min-w-0 flex-2 flex-col items-center px-4">
      <div className="flex h-full w-full flex-col">
        <div className="flex flex-row items-center justify-end mb-4">
          <AnalyticsDatePicker />
        </div>

        <div className="space-y-12 pb-8">
          <StatsCards stats={stats} hasProjectData={hasProjectData} />
          <OpportunitiesChart projectId="123" />
          <MetricsGrid projectId="123" hasData={hasProjectData} dashboardStats={dashboardStats} />
        </div>
      </div>
    </div>
  )
}

interface StatsCardsProps {
  stats: {
    trackedPrompts: number
    activeKeywords: number
    openOpportunities: number
  }
  hasProjectData: boolean
}

function StatsCards({ stats, hasProjectData }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Link href="/dashboard/brands/123/prompts">
        <Card className="rounded-2xl border border-transparent bg-gray-100 text-gray-950 shadow-none transition-all hover:shadow-md dark:border-transparent dark:bg-polar-800 dark:text-white">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <span className="text-gray-500 dark:text-polar-500">Tracked Prompts</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-400 hover:text-gray-600 dark:text-polar-500 dark:hover:text-polar-300 transition-colors">
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-sm">Search queries and prompts being monitored across AI platforms to track your brand&apos;s visibility.</p>
              </TooltipContent>
            </Tooltip>
          </CardHeader>
          <CardContent className="pt-0">
            <h3 className="text-2xl">{hasProjectData ? stats.trackedPrompts : '—'}</h3>
          </CardContent>
        </Card>
      </Link>

      <Card className="rounded-2xl border border-transparent bg-gray-100 text-gray-950 shadow-none dark:border-transparent dark:bg-polar-800 dark:text-white">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <span className="text-gray-500 dark:text-polar-500">Active Keywords</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-gray-400 hover:text-gray-600 dark:text-polar-500 dark:hover:text-polar-300 transition-colors">
                <HelpCircle className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-sm">Target keywords configured for this project, used for SEO and AI visibility tracking.</p>
            </TooltipContent>
          </Tooltip>
        </CardHeader>
        <CardContent className="pt-0">
          <h3 className="text-2xl">{stats.activeKeywords}</h3>
        </CardContent>
      </Card>

      <Link href="/dashboard/brands/123/opportunities">
        <Card className="rounded-2xl border border-transparent bg-gray-100 text-gray-950 shadow-none transition-all hover:shadow-md dark:border-transparent dark:bg-polar-800 dark:text-white">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <span className="text-gray-500 dark:text-polar-500">Open Opportunities</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-400 hover:text-gray-600 dark:text-polar-500 dark:hover:text-polar-300 transition-colors">
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-sm">Actionable recommendations to improve your AI visibility and search presence.</p>
              </TooltipContent>
            </Tooltip>
          </CardHeader>
          <CardContent className="pt-0">
            {hasProjectData ? (
              <div className="flex items-baseline gap-x-2">
                <h3 className="text-2xl">{stats.openOpportunities}</h3>
                <span className="text-sm text-amber-600 dark:text-amber-400">action items</span>
              </div>
            ) : (
              <h3 className="text-2xl">—</h3>
            )}
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}

export default function ProjectDetailsPage() {
  return (
    <AnalyticsDateRangeProvider>
      <PageContent />
    </AnalyticsDateRangeProvider>
  )
}
