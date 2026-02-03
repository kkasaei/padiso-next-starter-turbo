import type {
  GSCProperty,
  PerformanceDataPoint,
  QueryData,
  PageData,
  CountryData,
  DeviceData,
  SearchAppearanceData,
  DateRangeData,
  AuthorityMetrics,
} from './types'

// ============================================================
// MOCK GSC PROPERTIES
// ============================================================
export const MOCK_GSC_PROPERTIES: GSCProperty[] = [
  { id: '1', siteUrl: 'https://example.com', permissionLevel: 'siteOwner' },
  { id: '2', siteUrl: 'https://shop.example.com', permissionLevel: 'siteFullUser' },
  { id: '3', siteUrl: 'sc-domain:example.com', permissionLevel: 'siteOwner' },
]

// ============================================================
// MOCK PERFORMANCE DATA
// ============================================================
function generatePerformanceData(days: number): PerformanceDataPoint[] {
  const data: PerformanceDataPoint[] = []
  const today = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Add some variance to make the data look realistic
    const baseClicks = Math.floor(Math.random() * 5) + 1
    const baseImpressions = Math.floor(Math.random() * 40) + 10
    
    data.push({
      date: date.toISOString().split('T')[0],
      clicks: baseClicks,
      impressions: baseImpressions,
      ctr: baseImpressions > 0 ? (baseClicks / baseImpressions) * 100 : 0,
      position: Math.random() * 10 + 3,
    })
  }
  
  return data
}

export const MOCK_PERFORMANCE_DATA_45_DAYS = generatePerformanceData(45)

export const MOCK_TOTAL_METRICS = {
  clicks: 28,
  impressions: 621,
  ctr: 4.5,
  position: 7.1,
}

// ============================================================
// MOCK QUERIES DATA
// ============================================================
export const MOCK_QUERIES_DATA: QueryData[] = [
  { query: 'searchfit', clicks: 16, impressions: 98, ctr: 16.33, position: 1.2 },
  { query: 'search fit', clicks: 1, impressions: 10, ctr: 10.0, position: 2.4 },
  { query: 'shopify ai search optimization', clicks: 0, impressions: 34, ctr: 0, position: 8.3 },
  { query: 'seo fit', clicks: 0, impressions: 20, ctr: 0, position: 12.5 },
  { query: 'specialneedsusa.com', clicks: 0, impressions: 10, ctr: 0, position: 9.8 },
  { query: 'neil patel seo tool for shopify', clicks: 0, impressions: 8, ctr: 0, position: 15.2 },
  { query: 'fit search', clicks: 0, impressions: 5, ctr: 0, position: 18.4 },
  { query: 'ai seo for ecommerce', clicks: 2, impressions: 45, ctr: 4.44, position: 6.7 },
  { query: 'shopify seo app', clicks: 3, impressions: 89, ctr: 3.37, position: 9.1 },
  { query: 'ecommerce search optimization', clicks: 1, impressions: 34, ctr: 2.94, position: 11.3 },
  { query: 'ai product search', clicks: 2, impressions: 56, ctr: 3.57, position: 7.8 },
  { query: 'search relevance shopify', clicks: 0, impressions: 23, ctr: 0, position: 14.6 },
]

// ============================================================
// MOCK PAGES DATA
// ============================================================
export const MOCK_PAGES_DATA: PageData[] = [
  { page: 'https://www.searchfit.ai/', clicks: 21, impressions: 392, ctr: 5.36, position: 4.2 },
  { page: 'https://searchfit.ai/', clicks: 6, impressions: 113, ctr: 5.31, position: 3.8 },
  { page: 'https://searchfit.ai/blog', clicks: 1, impressions: 99, ctr: 1.01, position: 12.3 },
  { page: 'https://searchfit.ai/blog/how-ai-powered-seo-helped-special-needs-usa-reach-more-families', clicks: 1, impressions: 39, ctr: 2.56, position: 8.9 },
  { page: 'https://searchfit.ai/story', clicks: 0, impressions: 129, ctr: 0, position: 15.7 },
  { page: 'https://searchfit.ai/pricing', clicks: 0, impressions: 93, ctr: 0, position: 5.1 },
  { page: 'https://searchfit.ai/auth/sign-in', clicks: 0, impressions: 45, ctr: 0, position: 18.2 },
]

// ============================================================
// MOCK COUNTRIES DATA
// ============================================================
export const MOCK_COUNTRIES_DATA: CountryData[] = [
  { country: 'United States', countryCode: 'US', clicks: 7, impressions: 348, ctr: 2.01, position: 5.8 },
  { country: 'Australia', countryCode: 'AU', clicks: 6, impressions: 18, ctr: 33.33, position: 6.9 },
  { country: 'Cameroon', countryCode: 'CM', clicks: 3, impressions: 64, ctr: 4.69, position: 8.1 },
  { country: 'United Kingdom', countryCode: 'GB', clicks: 2, impressions: 20, ctr: 10.0, position: 6.2 },
  { country: 'Hong Kong', countryCode: 'HK', clicks: 2, impressions: 4, ctr: 50.0, position: 4.5 },
  { country: 'India', countryCode: 'IN', clicks: 1, impressions: 31, ctr: 3.23, position: 11.8 },
  { country: 'Canada', countryCode: 'CA', clicks: 1, impressions: 12, ctr: 8.33, position: 7.1 },
]

// ============================================================
// MOCK DEVICES DATA
// ============================================================
export const MOCK_DEVICES_DATA: DeviceData[] = [
  { device: 'DESKTOP', clicks: 21, impressions: 506, ctr: 4.15, position: 6.5 },
  { device: 'MOBILE', clicks: 8, impressions: 140, ctr: 5.71, position: 7.8 },
  { device: 'TABLET', clicks: 0, impressions: 6, ctr: 0, position: 8.2 },
]

// ============================================================
// MOCK SEARCH APPEARANCE DATA
// ============================================================
// Empty array to show "No data" state as seen in the GSC screenshots
export const MOCK_SEARCH_APPEARANCE_DATA: SearchAppearanceData[] = []

// Uncomment below for testing with data:
// export const MOCK_SEARCH_APPEARANCE_DATA: SearchAppearanceData[] = [
//   { searchAppearance: 'Web Light Results', clicks: 15, impressions: 312, ctr: 4.81, position: 6.2 },
//   { searchAppearance: 'Rich Results', clicks: 8, impressions: 189, ctr: 4.23, position: 5.8 },
//   { searchAppearance: 'FAQ Rich Results', clicks: 3, impressions: 67, ctr: 4.48, position: 4.1 },
//   { searchAppearance: 'Sitelinks', clicks: 2, impressions: 53, ctr: 3.77, position: 1.2 },
// ]

// ============================================================
// MOCK DATE RANGE DATA
// ============================================================
export const MOCK_DATES_DATA: DateRangeData[] = MOCK_PERFORMANCE_DATA_45_DAYS.slice(-14).map(d => ({
  date: d.date,
  clicks: d.clicks,
  impressions: d.impressions,
  ctr: d.ctr,
  position: d.position,
}))

// ============================================================
// MOCK AUTHORITY & BACKLINKS DATA
// ============================================================
function generateHistoryData(days: number, baseValue: number, variance: number): { date: string; value: number }[] {
  const data: { date: string; value: number }[] = []
  const today = new Date()
  let currentValue = baseValue - Math.floor(variance * days * 0.01)
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Gradually increase with some variance
    currentValue += Math.random() * variance * 0.05
    currentValue = Math.max(0, currentValue)
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(currentValue * 10) / 10,
    })
  }
  
  return data
}

export const MOCK_AUTHORITY_METRICS: AuthorityMetrics = {
  domainRating: 0,
  referringDomains: 0,
  currentBacklinks: 0,
  domainRatingHistory: generateHistoryData(90, 0, 5),
  referringDomainsHistory: generateHistoryData(90, 0, 10),
  backlinksHistory: generateHistoryData(90, 0, 20),
}

// For a connected domain with actual data
export const MOCK_AUTHORITY_METRICS_WITH_DATA: AuthorityMetrics = {
  domainRating: 42,
  referringDomains: 156,
  currentBacklinks: 892,
  domainRatingHistory: generateHistoryData(90, 42, 5),
  referringDomainsHistory: generateHistoryData(90, 156, 15),
  backlinksHistory: generateHistoryData(90, 892, 50),
}

// ============================================================
// MOCK REFERRING DOMAINS DATA
// ============================================================
import type { ReferringDomain, Backlink } from './types'

export const MOCK_REFERRING_DOMAINS: ReferringDomain[] = [
  { domain: 'techcrunch.com', domainRating: 92, backlinks: 3, firstSeen: '2024-06-15', lastSeen: '2025-01-28' },
  { domain: 'producthunt.com', domainRating: 89, backlinks: 5, firstSeen: '2024-08-22', lastSeen: '2025-02-01' },
  { domain: 'medium.com', domainRating: 95, backlinks: 12, firstSeen: '2024-03-10', lastSeen: '2025-01-30' },
  { domain: 'dev.to', domainRating: 78, backlinks: 8, firstSeen: '2024-07-05', lastSeen: '2025-01-25' },
  { domain: 'hackernews.com', domainRating: 91, backlinks: 2, firstSeen: '2024-09-18', lastSeen: '2025-01-20' },
  { domain: 'reddit.com', domainRating: 97, backlinks: 15, firstSeen: '2024-04-12', lastSeen: '2025-02-02' },
  { domain: 'twitter.com', domainRating: 98, backlinks: 28, firstSeen: '2024-02-08', lastSeen: '2025-02-03' },
  { domain: 'linkedin.com', domainRating: 99, backlinks: 7, firstSeen: '2024-05-20', lastSeen: '2025-01-29' },
  { domain: 'github.com', domainRating: 96, backlinks: 4, firstSeen: '2024-06-30', lastSeen: '2025-01-15' },
  { domain: 'indiehackers.com', domainRating: 72, backlinks: 6, firstSeen: '2024-08-01', lastSeen: '2025-01-22' },
  { domain: 'saastr.com', domainRating: 68, backlinks: 2, firstSeen: '2024-10-05', lastSeen: '2025-01-18' },
  { domain: 'shopify.com', domainRating: 94, backlinks: 1, firstSeen: '2024-11-12', lastSeen: '2025-01-10' },
]

// ============================================================
// MOCK BACKLINKS DATA
// ============================================================
export const MOCK_BACKLINKS: Backlink[] = [
  { sourceUrl: 'https://techcrunch.com/2024/best-seo-tools', sourceDomain: 'techcrunch.com', targetUrl: '/features', anchorText: 'SearchFit SEO', domainRating: 92, firstSeen: '2024-06-15', lastSeen: '2025-01-28', isDoFollow: true },
  { sourceUrl: 'https://medium.com/@seoexpert/top-tools-2024', sourceDomain: 'medium.com', targetUrl: '/', anchorText: 'SearchFit', domainRating: 95, firstSeen: '2024-03-10', lastSeen: '2025-01-30', isDoFollow: true },
  { sourceUrl: 'https://dev.to/webdev/seo-automation', sourceDomain: 'dev.to', targetUrl: '/pricing', anchorText: 'affordable SEO tool', domainRating: 78, firstSeen: '2024-07-05', lastSeen: '2025-01-25', isDoFollow: true },
  { sourceUrl: 'https://producthunt.com/posts/searchfit', sourceDomain: 'producthunt.com', targetUrl: '/', anchorText: 'SearchFit - AI SEO', domainRating: 89, firstSeen: '2024-08-22', lastSeen: '2025-02-01', isDoFollow: true },
  { sourceUrl: 'https://reddit.com/r/SEO/comments/abc123', sourceDomain: 'reddit.com', targetUrl: '/blog/seo-tips', anchorText: 'this guide', domainRating: 97, firstSeen: '2024-04-12', lastSeen: '2025-02-02', isDoFollow: false },
  { sourceUrl: 'https://twitter.com/seoinfluencer/status/123', sourceDomain: 'twitter.com', targetUrl: '/', anchorText: 'searchfit.io', domainRating: 98, firstSeen: '2024-02-08', lastSeen: '2025-02-03', isDoFollow: false },
  { sourceUrl: 'https://linkedin.com/pulse/seo-trends-2024', sourceDomain: 'linkedin.com', targetUrl: '/features', anchorText: 'SearchFit platform', domainRating: 99, firstSeen: '2024-05-20', lastSeen: '2025-01-29', isDoFollow: true },
  { sourceUrl: 'https://github.com/awesome-seo/readme', sourceDomain: 'github.com', targetUrl: '/', anchorText: 'SearchFit', domainRating: 96, firstSeen: '2024-06-30', lastSeen: '2025-01-15', isDoFollow: true },
  { sourceUrl: 'https://indiehackers.com/post/my-seo-stack', sourceDomain: 'indiehackers.com', targetUrl: '/pricing', anchorText: 'SearchFit pricing', domainRating: 72, firstSeen: '2024-08-01', lastSeen: '2025-01-22', isDoFollow: true },
  { sourceUrl: 'https://hackernews.com/item?id=456789', sourceDomain: 'hackernews.com', targetUrl: '/', anchorText: 'Show HN: SearchFit', domainRating: 91, firstSeen: '2024-09-18', lastSeen: '2025-01-20', isDoFollow: false },
]
