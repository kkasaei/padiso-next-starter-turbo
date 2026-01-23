'use client'

// ============================================================
// AI RESPONSES SECTION
// Table showing actual AI responses with pagination and search
// Uses ONLY real data from analyticsData prop - no mock fallbacks
// ============================================================

import { useState } from 'react'
import Image from 'next/image'
import { Search, ArrowLeft, HelpCircle, MessageSquare } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useAnalyticsDateRange } from '@/hooks/use-analytics-date-range'
import type { PromptAnalyticsData, MentionSortKey, SortDirection } from '@/types/dtos/prompt-analytics-dto'
import { COMPETITION_PROVIDERS, MENTION_TABLE_COLUMNS, PAGE_SIZE_OPTIONS } from './constants'
import { getSentimentColor, getProviderLogo, getPageNumbers } from './helpers'

interface AIResponsesSectionProps {
  analyticsData: PromptAnalyticsData | null
}

export function AIResponsesSection({ analyticsData }: AIResponsesSectionProps) {
  const { dateRange } = useAnalyticsDateRange()
  const [selectedProvider, setSelectedProvider] = useState('ChatGPT')
  const [sortKey, setSortKey] = useState<MentionSortKey>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(10)

  // Use ONLY real data from analyticsData - no mock fallbacks
  const allMentions = analyticsData?.mentions || []
  
  // Better provider matching (handle variations like "chatgpt", "ChatGPT", "gpt-4", "openai")
  const matchesProvider = (provider: string | undefined, selected: string): boolean => {
    if (!provider) return false
    const p = provider.toLowerCase()
    const s = selected.toLowerCase()
    
    if (s === 'chatgpt') {
      return p.includes('chatgpt') || p.includes('gpt') || p.includes('openai')
    }
    if (s === 'perplexity') {
      return p.includes('perplexity')
    }
    if (s === 'gemini') {
      return p.includes('gemini') || p.includes('google')
    }
    return p === s
  }
  
  const mentionData = allMentions.filter(m => matchesProvider(m.provider, selectedProvider))

  // Data is already filtered by date range on the server (in getPromptAnalytics)
  // No need for redundant client-side filtering
  const dateFilteredData = mentionData

  // Filter by search query
  const filteredData = dateFilteredData.filter((mention) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      mention.response.toLowerCase().includes(query) ||
      mention.date.includes(query) ||
      mention.sentiment.toLowerCase().includes(query)
    )
  })

  // Sort filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    let comparison = 0
    switch (sortKey) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
        break
      case 'mentionPosition':
        const posA = a.mentionPosition ?? 999
        const posB = b.mentionPosition ?? 999
        comparison = posA - posB
        break
      case 'sentiment':
        const sentimentOrder: Record<string, number> = { positive: 1, neutral: 2, negative: 3 }
        comparison = (sentimentOrder[a.sentiment] || 2) - (sentimentOrder[b.sentiment] || 2)
        break
    }
    return sortDirection === 'asc' ? comparison : -comparison
  })

  // Pagination calculations
  const totalItems = sortedData.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1))
  const startIndex = (validCurrentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedData = sortedData.slice(startIndex, endIndex)

  // Handlers
  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider)
    setCurrentPage(1)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  const handleSort = (key: MentionSortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection(key === 'date' ? 'desc' : 'asc')
    }
  }

  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const pageNumbers = getPageNumbers(validCurrentPage, totalPages)
  const hasData = allMentions.length > 0

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      {/* Header Section */}
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
        <div className="flex w-full flex-col gap-y-2">
          <span className="text-lg font-semibold">AI Mentions</span>
          <p className="text-sm text-muted-foreground">
            Actual AI responses when this prompt is asked. Click to expand full response.
          </p>
        </div>

        {/* Provider Tabs */}
        <div className="flex shrink-0 flex-row items-center gap-2">
          {COMPETITION_PROVIDERS.filter(p => p.id !== 'all').map((provider) => (
            <button
              key={provider.id}
              onClick={() => handleProviderChange(provider.name)}
              className={cn(
                'flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all',
                selectedProvider === provider.name
                  ? 'bg-card shadow-sm ring-1 ring-border'
                  : 'opacity-50 hover:opacity-75'
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
          ))}
        </div>
      </div>

      {/* Table - White card inside */}
      <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground text-center">
              No AI responses available yet. Run a scan to see AI mentions.
            </p>
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="px-6 py-4 border-b border-border">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search responses..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {MENTION_TABLE_COLUMNS.map((column) => (
                      <th
                        key={column.key}
                        className={cn(
                          "px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider",
                          column.sortable && "cursor-pointer hover:text-foreground transition-colors select-none",
                          column.key === 'response' && "min-w-[400px]"
                        )}
                        onClick={() => column.sortable && handleSort(column.key as MentionSortKey)}
                      >
                        <div className="flex items-center gap-1.5">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="flex items-center gap-1.5">
                                {column.label}
                                <HelpCircle className="h-3 w-3 opacity-50" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs">
                              <p className="text-sm">{column.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                          {column.sortable && sortKey === column.key && (
                            <span className="text-primary">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Search className="h-8 w-8 text-muted-foreground/50" />
                          <p className="text-sm text-muted-foreground">
                            {searchQuery ? 'No mentions match your search' : 'No mentions found for this provider'}
                          </p>
                          {searchQuery && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSearchQuery('')}
                              className="text-primary"
                            >
                              Clear search
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((mention) => {
                      const isExpanded = expandedRows.has(mention.id)
                      const truncatedResponse = mention.response.length > 150
                        ? mention.response.slice(0, 150) + '...'
                        : mention.response

                      return (
                        <tr
                          key={mention.id}
                          className="hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => toggleRowExpansion(mention.id)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm">
                              {new Date(mention.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-start gap-3">
                                <div className="relative h-5 w-5 shrink-0 mt-0.5">
                                  <Image
                                    src={getProviderLogo(selectedProvider)}
                                    alt={selectedProvider}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                                <p className={cn(
                                  "text-sm leading-relaxed",
                                  !isExpanded && "line-clamp-2"
                                )}>
                                  {isExpanded ? mention.response : truncatedResponse}
                                </p>
                              </div>
                              {mention.response.length > 150 && (
                                <button
                                  className="text-xs text-primary hover:underline self-start ml-8"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleRowExpansion(mention.id)
                                  }}
                                >
                                  {isExpanded ? 'Show less' : 'Show more'}
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="outline" className="text-xs">
                              #{mention.mentionPosition}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={cn("text-xs capitalize", getSentimentColor(mention.sentiment))}>
                              {mention.sentiment}
                            </Badge>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col gap-4 px-6 py-4 border-t border-border bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
              {/* Results info */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex flex-col gap-0.5">
                  <span>
                    Showing {totalItems > 0 ? startIndex + 1 : 0}–{endIndex} of {totalItems} mention{totalItems !== 1 ? 's' : ''}
                  </span>
                  {dateFilteredData.length < mentionData.length && (
                    <span className="text-xs">
                      {mentionData.length} total • {dateFilteredData.length} in selected period
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    {filteredData.filter(m => m.sentiment === 'positive').length}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-gray-400" />
                    {filteredData.filter(m => m.sentiment === 'neutral').length}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    {filteredData.filter(m => m.sentiment === 'negative').length}
                  </span>
                </div>
              </div>

              {/* Pagination controls */}
              <div className="flex items-center gap-4">
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

                    {pageNumbers.map((page, index) => (
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
                    ))}

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
          </>
        )}
      </div>
    </div>
  )
}
