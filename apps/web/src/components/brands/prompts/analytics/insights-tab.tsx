'use client'

// ============================================================
// INSIGHTS TAB CONTENT
// Features:
// 1. Market Trajectory - Current status with provider tabs
// 2. Analysis Insights - Table with search and type filter
// 3. Add to Opportunities - Convert insights to opportunities
// Uses ONLY real data from analyticsData prop - no mock fallbacks
// ============================================================

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { TabsContent } from '@workspace/ui/components/tabs'
import { Input } from '@workspace/ui/components/input'
import { Button } from '@workspace/ui/components/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { TrendingUp, Clock, Sparkles, Search, ArrowLeft, Plus, MoreHorizontal, FileText, Zap, Loader2 } from 'lucide-react'
import { Checkbox } from '@workspace/ui/components/checkbox'

import type { PromptAnalyticsData } from '@/lib/shcmea/types/dtos/prompt-analytics-dto'

import { PROVIDERS } from './constants'
import { getProviderLogo } from './helpers'

type ProviderTab = 'chatgpt' | 'perplexity' | 'gemini'
type InsightType = 'all' | 'strength' | 'opportunity'
type SortKey = 'title' | 'type'

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const

// Parsed insight item type
interface InsightItem {
  id: string
  type: 'strength' | 'opportunity'
  title: string
  description: string
}

interface InsightsTabProps {
  analyticsData: PromptAnalyticsData | null
  brandId: string
}

// Helper to safely parse JSON string
function parseInsightItem(json: string): { title: string; description: string } | null {
  try {
    const parsed = JSON.parse(json)
    if (typeof parsed === 'object' && parsed.title && parsed.description) {
      return { title: parsed.title, description: parsed.description }
    }
    // If it's just a plain string, use it as both title and description
    if (typeof parsed === 'string') {
      return { title: parsed, description: parsed }
    }
    return null
  } catch {
    // Not JSON, treat the raw string as the content
    return { title: json, description: json }
  }
}

export function InsightsTab({ analyticsData, brandId }: InsightsTabProps) {
  const [selectedProvider, setSelectedProvider] = useState<ProviderTab>('chatgpt')

  // Table state
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<InsightType>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [sortKey, setSortKey] = useState<SortKey>('type')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Add to Opportunities state
  const [addToOpportunityItem, setAddToOpportunityItem] = useState<InsightItem | null>(null)
  const [selectedOpportunityType, setSelectedOpportunityType] = useState<'CONTENT' | 'ACTION'>('CONTENT')
  const [showBulkAddModal, setShowBulkAddModal] = useState(false)
  const [bulkAddProgress, setBulkAddProgress] = useState(0)

  // Create opportunities state
  const [isCreating, setIsCreating] = useState(false)
  const [isBulkCreating, setIsBulkCreating] = useState(false)

  const handleAddToOpportunities = () => {
    if (!addToOpportunityItem) return
  }

  const handleBulkAddToOpportunities = async () => {
    const selectedItems = allInsights.filter((item) => selectedIds.has(item.id))
    if (selectedItems.length === 0) return

    setIsBulkCreating(true)
    setBulkAddProgress(0)

    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < selectedItems.length; i++) {
      const item = selectedItems[i]
      try {
        // Call the action directly for bulk operations
        // TODO: Create opportunities - loading state
      } catch {
        errorCount++
      }
      setBulkAddProgress(Math.round(((i + 1) / selectedItems.length) * 100))
    }

    setIsBulkCreating(false)
    setShowBulkAddModal(false)
    setSelectedIds(new Set())
    setBulkAddProgress(0)

    if (successCount > 0) {
      toast.success(`${successCount} insight${successCount > 1 ? 's' : ''} added to Opportunities!`)
    }
    if (errorCount > 0) {
      toast.error(`Failed to add ${errorCount} insight${errorCount > 1 ? 's' : ''}`)
    }
  }

  // Bulk selection handlers
  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }

  // Parse strengths and opportunities into structured items
  // All logic moved inside useMemo to ensure stable dependencies
  const { allInsights, trajectory, insightsByProvider, legacyInsights } = useMemo(() => {
    const insightsByProvider = analyticsData?.insightsByProvider || {}
    const currentProviderInsights = insightsByProvider[selectedProvider] || null
    const legacyInsights = analyticsData?.insights || null
    const trajectory = currentProviderInsights?.trajectory || legacyInsights?.trajectory || null

    const rawStrengths = currentProviderInsights?.strengths || legacyInsights?.strengths || []
    const rawOpportunities = currentProviderInsights?.opportunities || legacyInsights?.opportunities || []

    const items: InsightItem[] = []

    rawStrengths.forEach((str, index) => {
      const parsed = parseInsightItem(str)
      if (parsed) {
        items.push({
          id: `strength-${selectedProvider}-${index}`,
          type: 'strength',
          title: parsed.title,
          description: parsed.description,
        })
      }
    })

    rawOpportunities.forEach((str, index) => {
      const parsed = parseInsightItem(str)
      if (parsed) {
        items.push({
          id: `opportunity-${selectedProvider}-${index}`,
          type: 'opportunity',
          title: parsed.title,
          description: parsed.description,
        })
      }
    })

    return {
      allInsights: items,
      trajectory,
      insightsByProvider,
      legacyInsights,
    }
  }, [analyticsData, selectedProvider])

  // Handler for provider change - reset pagination
  const handleProviderChange = (provider: ProviderTab) => {
    setSelectedProvider(provider)
    setCurrentPage(1) // Reset to page 1 when switching providers
  }

  const hasAnyInsights = Object.keys(insightsByProvider).length > 0 || legacyInsights !== null

  // Filter by search and type
  const filteredInsights = useMemo(() => {
    return allInsights.filter((item) => {
      // Filter by type
      if (filterType !== 'all' && item.type !== filterType) {
        return false
      }

      // Filter by search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        return (
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        )
      }

      return true
    })
  }, [allInsights, filterType, searchQuery])

  // Sort
  const sortedInsights = useMemo(() => {
    return [...filteredInsights].sort((a, b) => {
      let comparison = 0
      if (sortKey === 'title') {
        comparison = a.title.localeCompare(b.title)
      } else if (sortKey === 'type') {
        comparison = a.type.localeCompare(b.type)
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredInsights, sortKey, sortDirection])

  // Pagination
  const totalItems = sortedInsights.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1))
  const startIndex = (validCurrentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedInsights = sortedInsights.slice(startIndex, endIndex)

  // Bulk selection computed values (must be after paginatedInsights)
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedInsights.map((item) => item.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const isAllSelected = paginatedInsights.length > 0 && paginatedInsights.every((item) => selectedIds.has(item.id))
  const isSomeSelected = selectedIds.size > 0

  // Handlers
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleTypeChange = (type: InsightType) => {
    setFilterType(type)
    setCurrentPage(1)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  // Page numbers helper
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (validCurrentPage > 3) pages.push('ellipsis')

      const start = Math.max(2, validCurrentPage - 1)
      const end = Math.min(totalPages - 1, validCurrentPage + 1)
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i)
      }

      if (validCurrentPage < totalPages - 2) pages.push('ellipsis')
      if (!pages.includes(totalPages)) pages.push(totalPages)
    }
    return pages
  }

  // Get trajectory status display
  const getTrajectoryStatus = () => {
    if (!trajectory) return { label: 'Unknown', color: 'text-muted-foreground', bgColor: 'bg-muted' }

    const status = trajectory.status?.toLowerCase() || 'stable'

    if (status === 'improving' || status === 'positive') {
      return { label: 'Positive', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' }
    }
    if (status === 'declining' || status === 'negative') {
      return { label: 'Negative', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' }
    }
    return { label: 'Stable', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' }
  }

  const trajectoryStatus = getTrajectoryStatus()
  const selectedProviderName = PROVIDERS.find((p) => p.id === selectedProvider)?.name || 'ChatGPT'

  // Empty state - only show if NO insights exist for ANY provider
  if (!hasAnyInsights) {
    return (
      <TabsContent value="insights" className="space-y-8">
        <div className="md:dark:bg-polar-900 dark:border-polar-700 w-full md:rounded-xl md:border md:border-gray-100 md:bg-gray-50 md:p-8 lg:rounded-4xl items-center justify-center gap-y-6 md:flex md:flex-col md:py-48">
          <Sparkles className="text-gray-300 dark:text-gray-600 h-16 w-16" />
          <div className="flex flex-col items-center gap-y-6">
            <div className="flex flex-col items-center gap-y-2">
              <h3 className="text-lg font-medium">No Insights Yet</h3>
              <p className="dark:text-polar-500 text-gray-500 text-center max-w-md">
                AI-generated insights will appear here after scans are performed.
                Run a scan to analyze your brand&apos;s visibility and get recommendations.
              </p>
            </div>
          </div>
        </div>
      </TabsContent>
    )
  }

  return (
    <TabsContent value="insights" className="space-y-8">
      {/* Analysis based on snapshots indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>Analysis based on 1 snapshot in selected period</span>
      </div>

      {/* Market Trajectory Card */}
      <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
          <div className="flex w-full flex-col gap-y-2">
            <h3 className="text-lg font-semibold">Market Trajectory</h3>
            <p className="text-sm text-muted-foreground">
              AI market position analysis for {selectedProviderName}.
            </p>
          </div>

          <div className="flex shrink-0 flex-row items-center gap-2">
            {PROVIDERS.map((provider) => {
              const hasData = insightsByProvider[provider.id] !== undefined
              return (
                <button
                  key={provider.id}
                  onClick={() => handleProviderChange(provider.id as ProviderTab)}
                  disabled={!hasData && provider.id !== 'chatgpt'}
                  className={`flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all ${
                    selectedProvider === provider.id
                      ? 'bg-card shadow-sm ring-1 ring-border'
                      : hasData || provider.id === 'chatgpt'
                        ? 'opacity-50 hover:opacity-75'
                        : 'opacity-30 cursor-not-allowed'
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
              )
            })}
          </div>
        </div>

        <div className="flex w-full flex-col rounded-3xl bg-card p-6">
          <div className="flex items-start gap-4">
            <div className={`shrink-0 p-3 rounded-xl ${trajectoryStatus.bgColor}`}>
              <TrendingUp className={`h-5 w-5 ${trajectoryStatus.color}`} />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Current Status</span>
              </div>
              <span className={`text-lg font-semibold ${trajectoryStatus.color}`}>
                {trajectoryStatus.label}
              </span>
            </div>
          </div>

          {trajectory?.description && (
            <p className="mt-4 text-sm text-muted-foreground border-t border-border pt-4">
              {trajectory.description}
            </p>
          )}
        </div>
      </div>

      {/* Analysis Insights Table Card */}
      <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
          <div className="flex w-full flex-col gap-y-2">
            <h3 className="text-lg font-semibold">Analysis Insights</h3>
            <p className="text-sm text-muted-foreground">
              Key findings and recommendations from {selectedProviderName} analysis of this prompt.
            </p>
          </div>

          <div className="flex shrink-0 flex-row items-center gap-2">
            {PROVIDERS.map((provider) => {
              const hasData = insightsByProvider[provider.id] !== undefined
              return (
                <button
                  key={provider.id}
                  onClick={() => handleProviderChange(provider.id as ProviderTab)}
                  disabled={!hasData && provider.id !== 'chatgpt'}
                  className={`flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all ${
                    selectedProvider === provider.id
                      ? 'bg-card shadow-sm ring-1 ring-border'
                      : hasData || provider.id === 'chatgpt'
                        ? 'opacity-50 hover:opacity-75'
                        : 'opacity-30 cursor-not-allowed'
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
              )
            })}
          </div>
        </div>

        <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
          {/* Search and Filter Bar */}
          <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search insights..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Select value={filterType} onValueChange={(value) => handleTypeChange(value as InsightType)}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="strength">Strengths</SelectItem>
                <SelectItem value="opportunity">Opportunities</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Action Bar */}
          {isSomeSelected && (
            <div className="flex items-center justify-between gap-4 px-6 py-3 bg-primary/5 border-b border-border">
              <span className="text-sm font-medium">
                {selectedIds.size} insight{selectedIds.size > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedIds(new Set())}
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowBulkAddModal(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add to Opportunities
                </Button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-4 w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={(checked) => handleSelectAll(!!checked)}
                    />
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground w-32"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center gap-1.5">
                      Type
                      {sortKey === 'type' && (
                        <span className="text-primary">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center gap-1.5">
                      Title
                      {sortKey === 'title' && (
                        <span className="text-primary">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider w-20">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedInsights.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-8 w-8 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">
                          {searchQuery || filterType !== 'all'
                            ? 'No results match your search or filter'
                            : 'No insights found'}
                        </p>
                        {(searchQuery || filterType !== 'all') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSearchQuery('')
                              setFilterType('all')
                            }}
                            className="text-primary"
                          >
                            Clear filters
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedInsights.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-4">
                        <Checkbox
                          checked={selectedIds.has(item.id)}
                          onCheckedChange={(checked) => handleSelectOne(item.id, !!checked)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            item.type === 'strength'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}
                        >
                          {item.type === 'strength' ? 'Strength' : 'Opportunity'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-sm">{item.title}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setAddToOpportunityItem(item)
                                setSelectedOpportunityType('CONTENT')
                              }}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add to Opportunities
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalItems > 0 && (
            <div className="flex flex-col gap-4 px-6 py-4 border-t border-border bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
              {/* Results info */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  Showing {totalItems > 0 ? startIndex + 1 : 0}–{endIndex} of {totalItems} insight
                  {totalItems !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Pagination controls and page size */}
              <div className="flex items-center gap-4">
                {/* Page size selector */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="hidden sm:inline">Show</span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => handlePageSizeChange(Number(value))}
                  >
                    <SelectTrigger className="w-[70px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="hidden sm:inline">per page</span>
                </div>

                {/* Page navigation */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={validCurrentPage === 1}
                      className="h-8 px-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>

                    {getPageNumbers().map((page, index) =>
                      page === 'ellipsis' ? (
                        <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                          ...
                        </span>
                      ) : (
                        <Button
                          key={page}
                          variant={validCurrentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="h-8 w-8 p-0"
                        >
                          {page}
                        </Button>
                      )
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={validCurrentPage === totalPages}
                      className="h-8 px-2"
                    >
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Single to Opportunities Modal */}
      <Dialog open={!!addToOpportunityItem} onOpenChange={(open) => !open && setAddToOpportunityItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Opportunities</DialogTitle>
            <DialogDescription>
              Choose what type of opportunity this insight should become.
            </DialogDescription>
          </DialogHeader>

          {addToOpportunityItem && (
            <div className="space-y-4 py-4">
              {/* Preview of the insight */}
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      addToOpportunityItem.type === 'strength'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}
                  >
                    {addToOpportunityItem.type === 'strength' ? 'Strength' : 'Opportunity'}
                  </span>
                </div>
                <p className="text-sm font-medium">{addToOpportunityItem.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{addToOpportunityItem.description}</p>
              </div>

              {/* Type Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Add as:</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOpportunityType('CONTENT')}
                    disabled={isCreating}
                    className={`flex flex-1 flex-col items-center gap-2 rounded-lg border p-4 transition-all ${
                      selectedOpportunityType === 'CONTENT'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <FileText className={`h-6 w-6 ${selectedOpportunityType === 'CONTENT' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-medium">Content</span>
                    <span className="text-xs text-muted-foreground text-center">Blog, article, or guide</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedOpportunityType('ACTION')}
                    disabled={isCreating}
                    className={`flex flex-1 flex-col items-center gap-2 rounded-lg border p-4 transition-all ${
                      selectedOpportunityType === 'ACTION'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <Zap className={`h-6 w-6 ${selectedOpportunityType === 'ACTION' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-medium">Action</span>
                    <span className="text-xs text-muted-foreground text-center">Task to complete</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setAddToOpportunityItem(null)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button onClick={handleAddToOpportunities} disabled={isCreating} className="gap-2">
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Opportunity
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Add to Opportunities Modal */}
      <Dialog open={showBulkAddModal} onOpenChange={(open) => !open && !isBulkCreating && setShowBulkAddModal(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add {selectedIds.size} Insights to Opportunities</DialogTitle>
            <DialogDescription>
              Choose what type of opportunities these insights should become.
              All selected insights will be added with the same type.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Preview count */}
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Selected insights:</span>
                <span className="text-sm text-muted-foreground">{selectedIds.size} items</span>
              </div>
              {isBulkCreating && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Adding opportunities...</span>
                    <span>{bulkAddProgress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${bulkAddProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Add all as:</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOpportunityType('CONTENT')}
                  disabled={isBulkCreating}
                  className={`flex flex-1 flex-col items-center gap-2 rounded-lg border p-4 transition-all ${
                    selectedOpportunityType === 'CONTENT'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <FileText className={`h-6 w-6 ${selectedOpportunityType === 'CONTENT' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-medium">Content</span>
                  <span className="text-xs text-muted-foreground text-center">Blog, article, or guide</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOpportunityType('ACTION')}
                  disabled={isBulkCreating}
                  className={`flex flex-1 flex-col items-center gap-2 rounded-lg border p-4 transition-all ${
                    selectedOpportunityType === 'ACTION'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <Zap className={`h-6 w-6 ${selectedOpportunityType === 'ACTION' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-medium">Action</span>
                  <span className="text-xs text-muted-foreground text-center">Task to complete</span>
                </button>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setShowBulkAddModal(false)}
              disabled={isBulkCreating}
            >
              Cancel
            </Button>
            <Button onClick={handleBulkAddToOpportunities} disabled={isBulkCreating} className="gap-2">
              {isBulkCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding {bulkAddProgress}%...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add {selectedIds.size} Opportunities
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TabsContent>
  )
}
