// ============================================================
// ANALYTICS TYPES
// ============================================================

export interface GSCProperty {
  id: string
  siteUrl: string
  permissionLevel: 'siteOwner' | 'siteFullUser' | 'siteRestrictedUser' | 'siteUnverifiedUser'
}

export interface PerformanceMetrics {
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export interface PerformanceDataPoint {
  date: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export interface QueryData {
  query: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export interface PageData {
  page: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export interface CountryData {
  country: string
  countryCode: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export interface DeviceData {
  device: 'DESKTOP' | 'MOBILE' | 'TABLET'
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export interface SearchAppearanceData {
  searchAppearance: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export interface DateRangeData {
  date: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export interface AuthorityMetrics {
  domainRating: number
  referringDomains: number
  currentBacklinks: number
  domainRatingHistory: { date: string; value: number }[]
  referringDomainsHistory: { date: string; value: number }[]
  backlinksHistory: { date: string; value: number }[]
}

export interface ReferringDomain {
  domain: string
  domainRating: number
  backlinks: number
  firstSeen: string
  lastSeen: string
}

export interface Backlink {
  sourceUrl: string
  sourceDomain: string
  targetUrl: string
  anchorText: string
  domainRating: number
  firstSeen: string
  lastSeen: string
  isDoFollow: boolean
}

export type AnalyticsTab = 'queries' | 'pages' | 'countries' | 'devices' | 'searchAppearance' | 'dates'

export type DateRange = '7d' | '28d' | '3m' | '6m' | '12m' | '16m' | 'custom'

export type MetricType = 'clicks' | 'impressions' | 'ctr' | 'position'

export interface DateRangeOption {
  label: string
  value: DateRange
  days: number
}

export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { label: 'Last 7 days', value: '7d', days: 7 },
  { label: 'Last 28 days', value: '28d', days: 28 },
  { label: 'Last 3 months', value: '3m', days: 90 },
  { label: 'Last 6 months', value: '6m', days: 180 },
  { label: 'Last 12 months', value: '12m', days: 365 },
  { label: 'Last 16 months', value: '16m', days: 480 },
]

export interface FilterState {
  searchType: 'web' | 'image' | 'video' | 'news'
  dateRange: DateRange
  compareMode: boolean
}
