'use client'

import { useState, useMemo } from 'react'
import { cn } from '@workspace/common/lib'
import { Button } from '@workspace/ui/components/button'
import {
  UnderlinedTabs,
  UnderlinedTabsList,
  UnderlinedTabsTrigger,
  UnderlinedTabsContent,
} from '@workspace/ui/components/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import { SlidersHorizontal, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react'
import type {
  AnalyticsTab,
  QueryData,
  PageData,
  CountryData,
  DeviceData,
  SearchAppearanceData,
  DateRangeData,
} from './types'

// ============================================================
// TYPES
// ============================================================
type SortDirection = 'asc' | 'desc'
type SortKey = 'clicks' | 'impressions' | 'ctr' | 'position'

interface DataTableProps {
  queriesData: QueryData[]
  pagesData: PageData[]
  countriesData: CountryData[]
  devicesData: DeviceData[]
  searchAppearanceData: SearchAppearanceData[]
  datesData: DateRangeData[]
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================
function getDeviceLabel(device: string): string {
  const labels: Record<string, string> = {
    DESKTOP: 'Desktop',
    MOBILE: 'Mobile',
    TABLET: 'Tablet',
  }
  return labels[device] || device
}

// ============================================================
// SORT HEADER COMPONENT
// ============================================================
interface SortHeaderProps {
  label: string
  sortKey: SortKey
  currentSortKey: SortKey
  sortDirection: SortDirection
  onSort: (key: SortKey) => void
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
      {isActive && <ArrowDown className="h-3.5 w-3.5" />}
      {label}
    </button>
  )
}

// ============================================================
// EMPTY STATE COMPONENT
// ============================================================
function EmptyState() {
  return (
    <div className="flex items-center justify-center py-24">
      <span className="text-muted-foreground">No data</span>
    </div>
  )
}

// ============================================================
// PAGINATION COMPONENT
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
    <div className="flex items-center justify-end gap-4 px-4 py-3 border-t border-gray-200 dark:border-polar-800">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Rows per page:</span>
        <Select value={pageSize.toString()} onValueChange={(v) => onPageSizeChange(Number(v))}>
          <SelectTrigger className="w-[65px] h-8 border-0 bg-transparent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
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
// GENERIC TABLE COMPONENT
// ============================================================
interface TableRow {
  clicks: number
  impressions: number
  ctr: number
  position: number
}

interface GenericTableProps<T extends TableRow> {
  data: T[]
  renderPrimaryColumn: (item: T) => React.ReactNode
  primaryColumnHeader: string
  sortKey: SortKey
  sortDirection: SortDirection
  onSort: (key: SortKey) => void
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

function GenericTable<T extends TableRow>({
  data,
  renderPrimaryColumn,
  primaryColumnHeader,
  sortKey,
  sortDirection,
  onSort,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: GenericTableProps<T>) {
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aValue = a[sortKey]
      const bValue = b[sortKey]
      return sortDirection === 'desc' ? bValue - aValue : aValue - bValue
    })
  }, [data, sortKey, sortDirection])

  const totalPages = Math.ceil(sortedData.length / pageSize)
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  if (data.length === 0) {
    return <EmptyState />
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-polar-800">
              <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                {primaryColumnHeader}
              </th>
              <th className="px-6 py-4 text-right">
                <SortHeader
                  label="Clicks"
                  sortKey="clicks"
                  currentSortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={onSort}
                />
              </th>
              <th className="px-6 py-4 text-right">
                <SortHeader
                  label="Impressions"
                  sortKey="impressions"
                  currentSortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={onSort}
                />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-polar-800">
            {paginatedData.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-polar-800/50 transition-colors"
              >
                <td className="px-6 py-4">{renderPrimaryColumn(item)}</td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm text-foreground">
                    {item.clicks.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm text-muted-foreground">
                    {item.impressions.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {sortedData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={sortedData.length}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  )
}

// ============================================================
// MAIN DATA TABLE COMPONENT
// ============================================================
export function DataTable({
  queriesData,
  pagesData,
  countriesData,
  devicesData,
  searchAppearanceData,
  datesData,
}: DataTableProps) {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('queries')
  const [sortKey, setSortKey] = useState<SortKey>('clicks')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
    setCurrentPage(1)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as AnalyticsTab)
    // Reset sort and pagination when changing tabs
    setSortKey('clicks')
    setSortDirection('desc')
    setCurrentPage(1)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-polar-800 bg-white dark:bg-polar-900 overflow-hidden">
      <UnderlinedTabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-polar-800">
          <UnderlinedTabsList className="flex-1 overflow-x-auto px-2">
            <UnderlinedTabsTrigger value="queries" className="text-sm">
              Queries
            </UnderlinedTabsTrigger>
            <UnderlinedTabsTrigger value="pages" className="text-sm">
              Pages
            </UnderlinedTabsTrigger>
            <UnderlinedTabsTrigger value="countries" className="text-sm">
              Countries
            </UnderlinedTabsTrigger>
            <UnderlinedTabsTrigger value="devices" className="text-sm">
              Devices
            </UnderlinedTabsTrigger>
            <UnderlinedTabsTrigger value="searchAppearance" className="text-sm">
              Search Appearance
            </UnderlinedTabsTrigger>
            <UnderlinedTabsTrigger value="dates" className="text-sm">
              Days
            </UnderlinedTabsTrigger>
          </UnderlinedTabsList>
          
          <Button variant="ghost" size="icon" className="shrink-0 mr-2">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <UnderlinedTabsContent value="queries" className="mt-0">
          <GenericTable
            data={queriesData}
            primaryColumnHeader="Top queries"
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
            renderPrimaryColumn={(item: QueryData) => (
              <span className="text-sm">{item.query}</span>
            )}
          />
        </UnderlinedTabsContent>

        <UnderlinedTabsContent value="pages" className="mt-0">
          <GenericTable
            data={pagesData}
            primaryColumnHeader="Top pages"
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
            renderPrimaryColumn={(item: PageData) => (
              <span className="text-sm text-foreground hover:underline cursor-pointer">
                {item.page}
              </span>
            )}
          />
        </UnderlinedTabsContent>

        <UnderlinedTabsContent value="countries" className="mt-0">
          <GenericTable
            data={countriesData}
            primaryColumnHeader="Country"
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
            renderPrimaryColumn={(item: CountryData) => (
              <span className="text-sm">{item.country}</span>
            )}
          />
        </UnderlinedTabsContent>

        <UnderlinedTabsContent value="devices" className="mt-0">
          <GenericTable
            data={devicesData}
            primaryColumnHeader="Device"
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
            renderPrimaryColumn={(item: DeviceData) => (
              <span className="text-sm">{getDeviceLabel(item.device)}</span>
            )}
          />
        </UnderlinedTabsContent>

        <UnderlinedTabsContent value="searchAppearance" className="mt-0">
          <GenericTable
            data={searchAppearanceData}
            primaryColumnHeader="Search Appearance"
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
            renderPrimaryColumn={(item: SearchAppearanceData) => (
              <span className="text-sm">{item.searchAppearance}</span>
            )}
          />
        </UnderlinedTabsContent>

        <UnderlinedTabsContent value="dates" className="mt-0">
          <GenericTable
            data={datesData}
            primaryColumnHeader="Day"
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
            renderPrimaryColumn={(item: DateRangeData) => (
              <span className="text-sm">
                {new Date(item.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            )}
          />
        </UnderlinedTabsContent>
      </UnderlinedTabs>
    </div>
  )
}

// Helper function to get flag emoji from country code
function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}
