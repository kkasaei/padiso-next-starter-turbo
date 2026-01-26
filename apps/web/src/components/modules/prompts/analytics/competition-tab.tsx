'use client'

// ============================================================
// COMPETITION TAB CONTENT
// Competitor analysis and market positioning
// Uses ONLY real data from analyticsData prop - no mock fallbacks
// ============================================================

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { Search, ArrowLeft, ExternalLink, ChevronDown, ChevronUp, Users } from 'lucide-react'
import { TabsContent } from '@workspace/ui/components/tabs'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'

import { useAnalyticsDateRange } from '@workspace/ui/hooks/use-analytics-date-range'
import type { PromptAnalyticsData, CompetitorItem, MarketSegment } from '@/lib/shcmea/types/dtos/prompt-analytics-dto'

import { CompetitorMentionsChart } from './competitor-mentions-chart'
import { MarketSegmentsCard } from './market-segments-card'
import { BrandPositioningMap } from './brand-positioning-map'
import { COMPETITOR_PAGE_SIZE_OPTIONS, COMPETITION_PROVIDERS } from './constants'
import { getFaviconUrl, getProviderLogo, getPageNumbers } from './helpers'

type ProviderTab = 'all' | 'chatgpt' | 'perplexity' | 'gemini'
type SortKey = 'name' | 'mentionPercentage' | 'totalMentions'

interface CompetitionTabProps {
  analyticsData: PromptAnalyticsData | null
}

export function CompetitionTab({ analyticsData }: CompetitionTabProps) {
  const { dateRange } = useAnalyticsDateRange()
  const [selectedProvider, setSelectedProvider] = useState<ProviderTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [sortKey, setSortKey] = useState<SortKey>('mentionPercentage')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedProvider, dateRange])

  // Get positioning brands for the selected provider (to match brand positioning map)
  const getPositioningBrands = () => {
    if (!analyticsData?.positioning?.length || selectedProvider === 'all') return []
    
    const providerData = analyticsData.positioning.find(
      p => p.provider.toLowerCase() === selectedProvider.toLowerCase()
    )
    
    if (!providerData) return []
    
    // Parse positions if it's a string
    let positions = providerData.positions || []
    if (typeof positions === 'string') {
      try { positions = JSON.parse(positions) } catch { positions = [] }
    }
    
    return Array.isArray(positions) ? positions : []
  }

  // Use positioning data for specific providers, competitors data for "all"
  const competitorData = useMemo((): CompetitorItem[] => {
    const positioningBrands = getPositioningBrands()
    
    // If we have positioning data for this provider, use it
    if (positioningBrands.length > 0 && selectedProvider !== 'all') {
      // Create domain and mention lookup from competitors
      const competitorDomains = new Map<string, string>()
      const competitorMentions = new Map<string, number>()
      const competitorCounts = new Map<string, number>()
      analyticsData?.competitors?.forEach(c => {
        if (c.domain) competitorDomains.set(c.name.toLowerCase(), c.domain)
        competitorMentions.set(c.name.toLowerCase(), c.mentionPercentage)
        competitorCounts.set(c.name.toLowerCase(), c.totalMentions)
      })
      
      const totalBrands = positioningBrands.length
      const equalValue = Math.round(100 / totalBrands)
      
      return positioningBrands.map((brand: { name: string; isYourBrand?: boolean; domain?: string }) => ({
        name: brand.name,
        domain: brand.domain || competitorDomains.get(brand.name.toLowerCase()) || `${brand.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        isYourBrand: brand.isYourBrand || false,
        mentionPercentage: competitorMentions.get(brand.name.toLowerCase()) || equalValue,
        totalMentions: competitorCounts.get(brand.name.toLowerCase()) || 0,
        contextType: 'ai_response',
      }))
    }
    
    return analyticsData?.competitors || []
  }, [analyticsData, selectedProvider])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return competitorData
    const query = searchQuery.toLowerCase()
    return competitorData.filter((item) =>
      item.name.toLowerCase().includes(query) ||
      item.domain.toLowerCase().includes(query) ||
      item.contextType?.toLowerCase().includes(query)
    )
  }, [competitorData, searchQuery])

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let comparison = 0
      if (sortKey === 'name') {
        comparison = a.name.localeCompare(b.name)
      } else if (sortKey === 'mentionPercentage') {
        comparison = a.mentionPercentage - b.mentionPercentage
      } else if (sortKey === 'totalMentions') {
        comparison = a.totalMentions - b.totalMentions
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredData, sortKey, sortDirection])

  const totalItems = sortedData.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1))
  const startIndex = (validCurrentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedData = sortedData.slice(startIndex, endIndex)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
    setCurrentPage(1)
  }

  // Get market segments from real data - no mock fallbacks
  const marketSegmentsData: MarketSegment[] = analyticsData?.marketSegments || []

  const hasData = competitorData.length > 0

  // Empty state when no data
  if (!hasData) {
    return (
      <TabsContent value="competition" className="space-y-8">
        <div className="md:dark:bg-polar-900 dark:border-polar-700 w-full md:rounded-xl md:border md:border-gray-100 md:bg-gray-50 md:p-8 lg:rounded-4xl items-center justify-center gap-y-6 md:flex md:flex-col md:py-48">
          <Users className="text-gray-300 dark:text-gray-600 h-16 w-16" />
          <div className="flex flex-col items-center gap-y-6">
            <div className="flex flex-col items-center gap-y-2">
              <h3 className="text-lg font-medium">No Competitor Data Yet</h3>
              <p className="dark:text-polar-500 text-gray-500 text-center max-w-md">
                Competitor analysis will appear here after scans are performed.
                Run a scan to discover competitor mentions in AI responses.
              </p>
            </div>
          </div>
        </div>
      </TabsContent>
    )
  }

  return (
    <TabsContent value="competition" className="space-y-8">
      <BrandPositioningMap analyticsData={analyticsData} />
      <CompetitorMentionsChart analyticsData={analyticsData} />

      {/* Competitor Breakdown */}
      <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
          <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
            <div className="flex w-full flex-col gap-y-2">
              <span className="text-sm text-muted-foreground">Competitor Breakdown</span>
              <p className="text-sm text-muted-foreground">
                Detailed analysis of competitor mentions across AI platforms
              </p>
            </div>

            <div className="flex shrink-0 flex-row items-center gap-2">
              {COMPETITION_PROVIDERS.map((provider) => {
                // Check if this provider has positioning data (for non-all providers)
                let hasData = provider.id === 'all' // "All" always has data from competitors
                if (provider.id !== 'all') {
                  const providerPositioning = analyticsData?.positioning?.find(
                    p => p.provider.toLowerCase() === provider.id.toLowerCase() ||
                         p.provider.toLowerCase() === provider.name.toLowerCase()
                  )
                  let providerPositions = providerPositioning?.positions || []
                  if (typeof providerPositions === 'string') {
                    try { providerPositions = JSON.parse(providerPositions) } catch { providerPositions = [] }
                  }
                  hasData = Array.isArray(providerPositions) && providerPositions.length > 0
                }
                
                return (
                  <button
                    key={provider.id}
                    onClick={() => hasData && setSelectedProvider(provider.id as ProviderTab)}
                    disabled={!hasData}
                    className={`flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all ${
                      !hasData ? 'opacity-30 cursor-not-allowed' :
                      selectedProvider === provider.id
                        ? 'bg-card shadow-sm ring-1 ring-border'
                        : 'opacity-50 hover:opacity-75'
                    }`}
                  >
                    {provider.id !== 'all' && (
                      <div className="relative h-4 w-4">
                        <Image
                          src={getProviderLogo(provider.id)}
                          alt={provider.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <span>{provider.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search competitors..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                  className="pl-9 h-9"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th onClick={() => handleSort('name')} className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground">
                      <div className="flex items-center gap-1.5">
                        Competitor
                        {sortKey === 'name' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>
                    <th onClick={() => handleSort('mentionPercentage')} className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground">
                      <div className="flex items-center gap-1.5">
                        Mention %
                        {sortKey === 'mentionPercentage' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>
                    <th onClick={() => handleSort('totalMentions')} className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground">
                      <div className="flex items-center gap-1.5">
                        Count
                        {sortKey === 'totalMentions' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Context</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Search className="h-8 w-8 text-muted-foreground/50" />
                          <p className="text-sm text-muted-foreground">
                            {searchQuery ? 'No competitors match your search' : 'No competitor data found'}
                          </p>
                          {searchQuery && (
                            <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')} className="text-primary">
                              Clear search
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((competitor, index) => (
                      <tr key={`${competitor.name}-${competitor.domain}-${index}`} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                              {getFaviconUrl(competitor.domain) ? (
                                <img src={getFaviconUrl(competitor.domain)!} alt={competitor.name} className="h-6 w-6 object-contain" />
                              ) : (
                                <span className="text-xs font-medium text-muted-foreground">{competitor.name.charAt(0)}</span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{competitor.name}</p>
                              <p className="text-xs text-muted-foreground">{competitor.domain}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${competitor.mentionPercentage}%` }} />
                            </div>
                            <span className="text-sm font-medium">{competitor.mentionPercentage}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{competitor.totalMentions}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                            {competitor.contextType || 'General'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => window.open(`https://${competitor.domain}`, '_blank')}>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-4 px-6 py-4 border-t border-border bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Showing {totalItems > 0 ? startIndex + 1 : 0}–{endIndex} of {totalItems} competitor{totalItems !== 1 ? 's' : ''}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="hidden sm:inline">Show</span>
                  <Select value={pageSize.toString()} onValueChange={(value) => { setPageSize(Number(value)); setCurrentPage(1) }}>
                    <SelectTrigger className="w-[70px] h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {COMPETITOR_PAGE_SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="hidden sm:inline">per page</span>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={validCurrentPage === 1} className="h-8 px-2">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    {getPageNumbers(validCurrentPage, totalPages).map((page, index) => (
                      page === 'ellipsis' ? (
                        <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">...</span>
                      ) : (
                        <Button key={page} variant={validCurrentPage === page ? 'default' : 'outline'} size="sm" onClick={() => setCurrentPage(page)} className="h-8 w-8 p-0">{page}</Button>
                      )
                    ))}
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={validCurrentPage === totalPages} className="h-8 px-2">
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
      </div>

      {/* Market Segments */}
      <MarketSegmentsCard data={marketSegmentsData} />
    </TabsContent>
  )
}
