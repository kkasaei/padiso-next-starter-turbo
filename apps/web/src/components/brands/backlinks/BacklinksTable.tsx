'use client'

import { useState, useMemo } from 'react'
import { cn } from '@workspace/common/lib'
import { Button } from '@workspace/ui/components/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import {
  ExternalLink,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type { BacklinkReceived, BacklinkGiven } from './types'

type SortDirection = 'asc' | 'desc'

// ============================================================
// Sort Header Component
// ============================================================
interface SortHeaderProps {
  label: string
  sortKey: string
  currentSortKey: string
  sortDirection: SortDirection
  onSort: (key: string) => void
}

function SortHeader({
  label,
  sortKey,
  currentSortKey,
  sortDirection,
  onSort,
}: SortHeaderProps) {
  const isActive = currentSortKey === sortKey

  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto"
    >
      {isActive && <ArrowDown className={cn('h-3.5 w-3.5', sortDirection === 'asc' && 'rotate-180')} />}
      {label}
    </button>
  )
}

// ============================================================
// Pagination Component
// ============================================================
interface PaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="flex items-center justify-end gap-4 px-6 py-3 border-t border-gray-200 dark:border-polar-800">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Rows per page:</span>
        <Select value={pageSize.toString()} onValueChange={(v) => onPageSizeChange(Number(v))}>
          <SelectTrigger className="w-[65px] h-8 border-0 bg-transparent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <span className="text-sm text-muted-foreground">
        {startItem}-{endItem} of {totalItems}
      </span>
      
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// ============================================================
// Combined Backlinks Table with Tabs
// ============================================================
interface BacklinksTabsTableProps {
  receivedData: BacklinkReceived[]
  givenData: BacklinkGiven[]
}

type BacklinkTab = 'received' | 'given'

export function BacklinksTabsTable({ receivedData, givenData }: BacklinksTabsTableProps) {
  const [activeTab, setActiveTab] = useState<BacklinkTab>('received')
  
  // Received table state
  const [receivedSortKey, setReceivedSortKey] = useState('date')
  const [receivedSortDirection, setReceivedSortDirection] = useState<SortDirection>('desc')
  const [receivedCurrentPage, setReceivedCurrentPage] = useState(1)
  const [receivedPageSize, setReceivedPageSize] = useState(10)

  // Given table state
  const [givenSortKey, setGivenSortKey] = useState('date')
  const [givenSortDirection, setGivenSortDirection] = useState<SortDirection>('desc')
  const [givenCurrentPage, setGivenCurrentPage] = useState(1)
  const [givenPageSize, setGivenPageSize] = useState(10)

  const sortedReceivedData = useMemo(() => {
    const sorted = [...receivedData].sort((a, b) => {
      let aVal: string | number = ''
      let bVal: string | number = ''

      switch (receivedSortKey) {
        case 'date':
          aVal = new Date(a.date).getTime()
          bVal = new Date(b.date).getTime()
          break
        case 'sourceWebsite':
          aVal = a.sourceWebsite.toLowerCase()
          bVal = b.sourceWebsite.toLowerCase()
          break
        case 'domainRating':
          aVal = a.domainRating
          bVal = b.domainRating
          break
        case 'linkValue':
          aVal = a.linkValue
          bVal = b.linkValue
          break
        default:
          return 0
      }

      if (aVal < bVal) return receivedSortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return receivedSortDirection === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [receivedData, receivedSortKey, receivedSortDirection])

  const sortedGivenData = useMemo(() => {
    const sorted = [...givenData].sort((a, b) => {
      let aVal: string | number = ''
      let bVal: string | number = ''

      switch (givenSortKey) {
        case 'date':
          aVal = new Date(a.date).getTime()
          bVal = new Date(b.date).getTime()
          break
        case 'destinationWebsite':
          aVal = a.destinationWebsite.toLowerCase()
          bVal = b.destinationWebsite.toLowerCase()
          break
        default:
          return 0
      }

      if (aVal < bVal) return givenSortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return givenSortDirection === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [givenData, givenSortKey, givenSortDirection])

  const receivedTotalPages = Math.ceil(sortedReceivedData.length / receivedPageSize)
  const paginatedReceivedData = sortedReceivedData.slice(
    (receivedCurrentPage - 1) * receivedPageSize,
    receivedCurrentPage * receivedPageSize
  )

  const givenTotalPages = Math.ceil(sortedGivenData.length / givenPageSize)
  const paginatedGivenData = sortedGivenData.slice(
    (givenCurrentPage - 1) * givenPageSize,
    givenCurrentPage * givenPageSize
  )

  const handleReceivedSort = (key: string) => {
    if (receivedSortKey === key) {
      setReceivedSortDirection(receivedSortDirection === 'desc' ? 'asc' : 'desc')
    } else {
      setReceivedSortKey(key)
      setReceivedSortDirection('desc')
    }
    setReceivedCurrentPage(1)
  }

  const handleGivenSort = (key: string) => {
    if (givenSortKey === key) {
      setGivenSortDirection(givenSortDirection === 'desc' ? 'asc' : 'desc')
    } else {
      setGivenSortKey(key)
      setGivenSortDirection('desc')
    }
    setGivenCurrentPage(1)
  }

  const handleReceivedPageSizeChange = (size: number) => {
    setReceivedPageSize(size)
    setReceivedCurrentPage(1)
  }

  const handleGivenPageSizeChange = (size: number) => {
    setGivenPageSize(size)
    setGivenCurrentPage(1)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as BacklinkTab)} className="w-full">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
          <div className="flex w-full flex-col gap-y-2">
            <span className="text-lg font-semibold">Backlinks</span>
            <p className="text-sm text-muted-foreground">
              Track all your received and given backlinks in the exchange network.
            </p>
          </div>
          <div className="shrink-0">
            <TabsList className="bg-transparent ring-0 dark:bg-transparent dark:ring-0 p-1 gap-2 w-max">
              <TabsTrigger
                value="received"
                className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Received ({receivedData.length})
              </TabsTrigger>
              <TabsTrigger
                value="given"
                className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Given ({givenData.length})
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
          {/* Received Tab Content */}
          <TabsContent value="received" className="mt-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-polar-800">
                    <th className="px-6 py-4 text-left">
                      <SortHeader
                        label="Date"
                        sortKey="date"
                        currentSortKey={receivedSortKey}
                        sortDirection={receivedSortDirection}
                        onSort={handleReceivedSort}
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                      Source Website
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                      Article
                    </th>
                    <th className="px-6 py-4 text-right">
                      <SortHeader
                        label="Domain Rating"
                        sortKey="domainRating"
                        currentSortKey={receivedSortKey}
                        sortDirection={receivedSortDirection}
                        onSort={handleReceivedSort}
                      />
                    </th>
                    <th className="px-6 py-4 text-right">
                      <SortHeader
                        label="Link Value ($)"
                        sortKey="linkValue"
                        currentSortKey={receivedSortKey}
                        sortDirection={receivedSortDirection}
                        onSort={handleReceivedSort}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-polar-800">
                  {paginatedReceivedData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 dark:hover:bg-polar-800/50 transition-colors group"
                    >
                      <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(item.date)}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm text-foreground hover:underline"
                        >
                          <span className="truncate max-w-[180px]">{item.sourceWebsite}</span>
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-muted-foreground" />
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={item.articleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-foreground hover:underline truncate max-w-[200px] block"
                        >
                          {item.article}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm">{item.domainRating}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                          ${item.linkValue}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {sortedReceivedData.length > 0 && (
              <Pagination
                currentPage={receivedCurrentPage}
                totalPages={receivedTotalPages}
                pageSize={receivedPageSize}
                totalItems={sortedReceivedData.length}
                onPageChange={setReceivedCurrentPage}
                onPageSizeChange={handleReceivedPageSizeChange}
              />
            )}
          </TabsContent>

          {/* Given Tab Content */}
          <TabsContent value="given" className="mt-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-polar-800">
                    <th className="px-6 py-4 text-left">
                      <SortHeader
                        label="Date"
                        sortKey="date"
                        currentSortKey={givenSortKey}
                        sortDirection={givenSortDirection}
                        onSort={handleGivenSort}
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                      Destination Website
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                      Article
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-polar-800">
                  {paginatedGivenData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 dark:hover:bg-polar-800/50 transition-colors group"
                    >
                      <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(item.date)}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={item.destinationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm text-foreground hover:underline"
                        >
                          <span className="truncate max-w-[180px]">{item.destinationWebsite}</span>
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-muted-foreground" />
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={item.articleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-foreground hover:underline truncate max-w-[200px] block"
                        >
                          {item.article}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {sortedGivenData.length > 0 && (
              <Pagination
                currentPage={givenCurrentPage}
                totalPages={givenTotalPages}
                pageSize={givenPageSize}
                totalItems={sortedGivenData.length}
                onPageChange={setGivenCurrentPage}
                onPageSizeChange={handleGivenPageSizeChange}
              />
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
