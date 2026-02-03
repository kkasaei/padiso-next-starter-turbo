'use client'

import { useState } from 'react'
import { AnalyticsDatePicker } from '@workspace/ui/components/analytics-date-picker'
import { AnalyticsDateRangeProvider } from '@workspace/ui/hooks/use-analytics-date-range'
import { ExternalLink, Loader2 } from 'lucide-react'

// Local components
import { OrganicPerformance } from './OrganicPerformance'
import { DataTable } from './DataTable'
import { AuthorityBacklinks } from './AuthorityBacklinks'
import { SearchTypeFilter, type SearchType } from './SearchTypeFilter'

// Mock data
import {
  MOCK_PERFORMANCE_DATA_45_DAYS,
  MOCK_TOTAL_METRICS,
  MOCK_QUERIES_DATA,
  MOCK_PAGES_DATA,
  MOCK_COUNTRIES_DATA,
  MOCK_DEVICES_DATA,
  MOCK_SEARCH_APPEARANCE_DATA,
  MOCK_DATES_DATA,
  MOCK_AUTHORITY_METRICS,
  MOCK_AUTHORITY_METRICS_WITH_DATA,
  MOCK_REFERRING_DOMAINS,
  MOCK_BACKLINKS,
} from './mock-data'

// Hooks
import { useIntegrations } from '@/hooks/use-integrations'

interface AnalyticsPageProps {
  brandId: string
  brandName?: string
}

export function AnalyticsPage({ brandId, brandName = 'BabyLoveGrowth' }: AnalyticsPageProps) {
  const { data: integrations, isLoading: integrationsLoading } = useIntegrations(brandId)

  // Check if Google integration is connected (real integration)
  const googleIntegration = integrations?.find(
    (i) => i.type === 'google' && i.status === 'active'
  )
  const hasRealIntegration = !!googleIntegration

  // Mock connection state for demo purposes
  const [isMockConnected, setIsMockConnected] = useState(false)
  
  // Use either real integration or mock connection
  const isConnected = hasRealIntegration || isMockConnected

  // Local state
  const [searchType, setSearchType] = useState<SearchType>('web')

  // Handle connect action - simulate connection with mock data
  const handleConnect = () => {
    setIsMockConnected(true)
  }

  if (integrationsLoading) {
    return (
      <div className="flex flex-1 flex-col min-w-0">
        <div className="md:dark:bg-polar-900 dark:border-polar-700 w-full md:rounded-xl md:border md:border-gray-100 md:bg-gray-50 md:p-8 lg:rounded-4xl items-center justify-center gap-y-6 md:flex md:flex-col md:py-48">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <AnalyticsDateRangeProvider>
      <div className="flex flex-col gap-8 w-full">
        {/* Header with Filters + Date Range - only show when connected */}
        {isConnected && (
          <div className="flex items-center justify-between flex-wrap gap-4">
            <SearchTypeFilter value={searchType} onChange={setSearchType} />
            <AnalyticsDatePicker />
          </div>
        )}

        {/* Organic Performance Section */}
        <OrganicPerformance
          isConnected={isConnected}
          metrics={MOCK_TOTAL_METRICS}
          chartData={MOCK_PERFORMANCE_DATA_45_DAYS}
          onConnect={handleConnect}
          brandName={brandName}
        />

        {/* Data Table - only show when connected */}
        {isConnected && (
          <DataTable
            queriesData={MOCK_QUERIES_DATA}
            pagesData={MOCK_PAGES_DATA}
            countriesData={MOCK_COUNTRIES_DATA}
            devicesData={MOCK_DEVICES_DATA}
            searchAppearanceData={MOCK_SEARCH_APPEARANCE_DATA}
            datesData={MOCK_DATES_DATA}
          />
        )}

        {/* Authority & Backlinks Section */}
        <AuthorityBacklinks
          metrics={isConnected ? MOCK_AUTHORITY_METRICS_WITH_DATA : MOCK_AUTHORITY_METRICS}
          referringDomains={isConnected ? MOCK_REFERRING_DOMAINS : []}
          backlinks={isConnected ? MOCK_BACKLINKS : []}
        />

        {/* Link to Google Search Console */}
        {isConnected && (
          <div className="flex justify-center pb-4">
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              Open in Google Search Console
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </div>
    </AnalyticsDateRangeProvider>
  )
}

export default AnalyticsPage
