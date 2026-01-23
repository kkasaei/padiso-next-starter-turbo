'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MoreVertical, HelpCircle } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardHeader } from '@workspace/ui/components/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip'
import { AnalyticsDatePicker } from '@workspace/ui/components/analytics-date-picker'
import { AnalyticsDateRangeProvider } from '@workspace/ui/hooks/use-analytics-date-range'

import type { DashboardStats } from './types'
import {
  ProjectStatusBadge,
  MetricsGrid,
  ContentTab,
  ActivitiesTab,
  OpportunitiesChart,
} from './components'

function PageContent() {
  const router = useRouter()

  // TODO: Replace with actual data fetching when API is ready
  const [dashboardStats] = useState<DashboardStats | null>(null)
  const [isLoadingStats] = useState(false)

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      // TODO: Implement delete functionality
    }
  }

  const stats = {
    trackedPrompts: dashboardStats?.trackedPrompts ?? 0,
    activeKeywords: 0,
    openOpportunities: dashboardStats?.openOpportunities ?? 0,
  }

  const hasProjectData = !isLoadingStats && (dashboardStats?.trackedPrompts ?? 0) > 0

  return (
    <div className="relative flex min-w-0 flex-2 flex-col items-center">
      <div className="flex h-full w-full flex-col">
        {/* Header */}
        <div className="flex flex-col gap-y-4 pb-8 md:flex-row md:items-start md:justify-between md:gap-x-4 md:pb-8">
          <div className="flex min-w-0 flex-row items-center gap-4">
            <div className="flex min-w-0 flex-row items-center gap-4">
              <div className="hidden aspect-square h-10 w-10 shrink-0 grow-0 overflow-hidden rounded-md border border-gray-200 bg-white text-center dark:border-polar-700 dark:bg-polar-800 md:flex">
                <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-400 dark:text-polar-600">
                  N
                </div>
              </div>
              <h1 className="truncate text-2xl">Project Name</h1>
            </div>
            <ProjectStatusBadge status="ACTIVE" />
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="flex flex-row items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard/projects/123/edit')}
              >
                Edit Project
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem>Archive</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <AnalyticsDatePicker />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6">
            <TabsList className="bg-transparent ring-0 dark:bg-transparent dark:ring-0 p-1 gap-2 w-max md:w-auto">
              <TabsTrigger
                value="overview"
                className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="content"
                className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Content
              </TabsTrigger>
              <TabsTrigger
                value="activities"
                className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Activities
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-12 pb-8">
            <StatsCards stats={stats} hasProjectData={hasProjectData} />
            <OpportunitiesChart projectId="123" />
            <MetricsGrid projectId="123" hasData={hasProjectData} dashboardStats={dashboardStats} />
          </TabsContent>

          <ContentTab projectId="123" />
          <ActivitiesTab projectId="123" />
        </Tabs>
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
      <Link href="/dashboard/projects/123/prompts">
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

      <Link href="/dashboard/projects/123/opportunities">
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
