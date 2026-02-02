/**
 * Google Search Console Service
 *
 * Handles Google Search Console API interactions for:
 * - Listing verified sites
 * - Fetching keyword rankings (position, clicks, impressions, CTR)
 * - Fetching search analytics data
 */

import { google, searchconsole_v1 } from 'googleapis';
import { createAuthenticatedClient, type AuthenticatedClientOptions } from './oauth';
import type { GSCSiteDto } from '../types/integration-dto';

// ============================================================
// TYPES
// ============================================================

export interface GSCRankingData {
  keyword: string;
  position: number; // Average position (can be decimal)
  clicks: number;
  impressions: number;
  ctr: number; // Click-through rate (0-1)
}

export interface GSCSearchAnalyticsQuery {
  siteUrl: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  dimensions?: ('query' | 'page' | 'country' | 'device' | 'date')[];
  dimensionFilterGroups?: searchconsole_v1.Schema$ApiDimensionFilterGroup[];
  rowLimit?: number;
  startRow?: number;
}

export interface GSCSearchAnalyticsResponse {
  rows: GSCRankingData[];
  responseAggregationType?: string;
}

// ============================================================
// SEARCH CONSOLE CLIENT
// ============================================================

/** Create Search Console client */
export function createSearchConsoleClient(authOptions: AuthenticatedClientOptions) {
  const auth = createAuthenticatedClient(authOptions);
  return google.searchconsole({ version: 'v1', auth });
}

// ============================================================
// SITE MANAGEMENT
// ============================================================

/** List all verified sites for the authenticated user */
export async function listSites(
  authOptions: AuthenticatedClientOptions
): Promise<GSCSiteDto[]> {
  const searchconsole = createSearchConsoleClient(authOptions);

  const { data } = await searchconsole.sites.list();

  if (!data.siteEntry) {
    return [];
  }

  return data.siteEntry.map((site) => ({
    siteUrl: site.siteUrl || '',
    permissionLevel: mapPermissionLevel(site.permissionLevel),
  }));
}

/** Map Google permission level to our enum */
function mapPermissionLevel(
  level: string | null | undefined
): 'siteOwner' | 'siteFullUser' | 'siteRestrictedUser' {
  switch (level) {
    case 'siteOwner':
      return 'siteOwner';
    case 'siteFullUser':
      return 'siteFullUser';
    default:
      return 'siteRestrictedUser';
  }
}

/** Get site info */
export async function getSite(
  authOptions: AuthenticatedClientOptions,
  siteUrl: string
): Promise<GSCSiteDto | null> {
  const searchconsole = createSearchConsoleClient(authOptions);

  try {
    const { data } = await searchconsole.sites.get({ siteUrl });

    return {
      siteUrl: data.siteUrl || siteUrl,
      permissionLevel: mapPermissionLevel(data.permissionLevel),
    };
  } catch {
    return null;
  }
}

// ============================================================
// SEARCH ANALYTICS (KEYWORD RANKINGS)
// ============================================================

/** Fetch keyword rankings from Search Console */
export async function getKeywordRankings(
  authOptions: AuthenticatedClientOptions,
  query: GSCSearchAnalyticsQuery
): Promise<GSCSearchAnalyticsResponse> {
  const searchconsole = createSearchConsoleClient(authOptions);

  const { data } = await searchconsole.searchanalytics.query({
    siteUrl: query.siteUrl,
    requestBody: {
      startDate: query.startDate,
      endDate: query.endDate,
      dimensions: query.dimensions || ['query'],
      dimensionFilterGroups: query.dimensionFilterGroups,
      rowLimit: query.rowLimit || 1000,
      startRow: query.startRow || 0,
    },
  });

  if (!data.rows) {
    return { rows: [] };
  }

  const rows: GSCRankingData[] = data.rows.map((row) => ({
    keyword: row.keys?.[0] || '',
    position: row.position || 0,
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: row.ctr || 0,
  }));

  return {
    rows,
    responseAggregationType: data.responseAggregationType || undefined,
  };
}

/** Get rankings for specific keywords */
export async function getRankingsForKeywords(
  authOptions: AuthenticatedClientOptions,
  siteUrl: string,
  keywords: string[],
  dateRange: { startDate: string; endDate: string }
): Promise<Map<string, GSCRankingData>> {
  const result = new Map<string, GSCRankingData>();

  if (keywords.length === 0) {
    return result;
  }

  // GSC doesn't support "exact match" very well, so we fetch all and filter
  const { rows } = await getKeywordRankings(authOptions, {
    siteUrl,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    dimensions: ['query'],
    rowLimit: 5000, // Get more rows to increase match probability
  });

  // Create a map for O(1) lookup
  const keywordSet = new Set(keywords.map((k) => k.toLowerCase()));

  for (const row of rows) {
    const normalizedKeyword = row.keyword.toLowerCase();
    if (keywordSet.has(normalizedKeyword)) {
      result.set(normalizedKeyword, row);
    }
  }

  return result;
}

/** Get top keywords for a site */
export async function getTopKeywords(
  authOptions: AuthenticatedClientOptions,
  siteUrl: string,
  options: {
    startDate: string;
    endDate: string;
    limit?: number;
    minImpressions?: number;
  }
): Promise<GSCRankingData[]> {
  const { rows } = await getKeywordRankings(authOptions, {
    siteUrl,
    startDate: options.startDate,
    endDate: options.endDate,
    dimensions: ['query'],
    rowLimit: options.limit || 100,
  });

  // Filter by minimum impressions if specified
  if (options.minImpressions) {
    return rows.filter((row) => row.impressions >= options.minImpressions!);
  }

  return rows;
}

/** Get keyword rankings by date (for charts) */
export async function getKeywordRankingsByDate(
  authOptions: AuthenticatedClientOptions,
  siteUrl: string,
  keyword: string,
  dateRange: { startDate: string; endDate: string }
): Promise<Array<{ date: string } & GSCRankingData>> {
  const searchconsole = createSearchConsoleClient(authOptions);

  const { data } = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      dimensions: ['date', 'query'],
      dimensionFilterGroups: [
        {
          filters: [
            {
              dimension: 'query',
              expression: keyword,
              operator: 'equals',
            },
          ],
        },
      ],
      rowLimit: 500,
    },
  });

  if (!data.rows) {
    return [];
  }

  return data.rows.map((row) => ({
    date: row.keys?.[0] || '',
    keyword: row.keys?.[1] || keyword,
    position: row.position || 0,
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: row.ctr || 0,
  }));
}

// ============================================================
// PAGE ANALYTICS
// ============================================================

/** Get top pages for a site */
export async function getTopPages(
  authOptions: AuthenticatedClientOptions,
  siteUrl: string,
  options: {
    startDate: string;
    endDate: string;
    limit?: number;
  }
): Promise<
  Array<{
    page: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>
> {
  const searchconsole = createSearchConsoleClient(authOptions);

  const { data } = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate: options.startDate,
      endDate: options.endDate,
      dimensions: ['page'],
      rowLimit: options.limit || 50,
    },
  });

  if (!data.rows) {
    return [];
  }

  return data.rows.map((row) => ({
    page: row.keys?.[0] || '',
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: row.ctr || 0,
    position: row.position || 0,
  }));
}

// ============================================================
// HELPERS
// ============================================================

/** Get date range for last N days */
export function getDateRangeLastNDays(days: number): {
  startDate: string;
  endDate: string;
} {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 3); // GSC data has 3-day delay

  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - days);

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
}

/** Format date as YYYY-MM-DD */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// ============================================================
// SIMPLIFIED DATA FETCH (for trigger tasks)
// ============================================================

export interface SearchConsoleDataOptions {
  siteUrl: string;
  startDate: string;
  endDate: string;
  dimensions?: ('query' | 'page' | 'country' | 'device' | 'date')[];
  rowLimit?: number;
}

export interface SearchConsoleDataResponse {
  rows: Array<{
    keys?: string[];
    clicks?: number;
    impressions?: number;
    ctr?: number;
    position?: number;
  }>;
}

/**
 * Simplified function to get Search Console data
 * Used primarily by trigger tasks
 *
 * @deprecated Use getSearchConsoleDataWithRefresh for new code - it handles 401 errors automatically
 */
export async function getSearchConsoleData(
  accessToken: string,
  options: SearchConsoleDataOptions
): Promise<SearchConsoleDataResponse> {
  const { rows } = await getKeywordRankings(
    { accessToken },
    {
      siteUrl: options.siteUrl,
      startDate: options.startDate,
      endDate: options.endDate,
      dimensions: options.dimensions || ['query'],
      rowLimit: options.rowLimit || 5000,
    }
  );

  // Map back to raw format for trigger tasks
  return {
    rows: rows.map((row) => ({
      keys: [row.keyword],
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
    })),
  };
}

// ============================================================
// SIMPLIFIED DATA FETCH WITH TOKEN REFRESH (for trigger tasks)
// ============================================================

export interface SearchConsoleDataWithRefreshOptions extends SearchConsoleDataOptions {
  /** Encrypted access token from database */
  accessToken: string;
  /** Encrypted refresh token from database */
  refreshToken: string | null;
  /** Integration ID for updating tokens */
  integrationId: string;
  /** Callback to update tokens in database when refreshed */
  onTokenRefresh?: (
    integrationId: string,
    tokens: { accessToken: string; refreshToken: string | null; tokenExpiry: Date | null }
  ) => Promise<void>;
}

/**
 * Get Search Console data with automatic token refresh on 401 errors.
 *
 * This is the recommended function for trigger tasks and background jobs.
 * It handles:
 * - Decrypting tokens from database
 * - Making API calls
 * - Automatic token refresh on 401 errors
 * - Saving new tokens to database via callback
 *
 * @example
 * ```typescript
 * const data = await getSearchConsoleDataWithRefresh({
 *   accessToken: integration.accessToken,
 *   refreshToken: integration.refreshToken,
 *   integrationId: integration.id,
 *   siteUrl: 'https://example.com',
 *   startDate: '2024-01-01',
 *   endDate: '2024-01-31',
 *   onTokenRefresh: async (integrationId, tokens) => {
 *     await prisma.integration.update({
 *       where: { id: integrationId },
 *       data: {
 *         accessToken: tokens.accessToken,
 *         refreshToken: tokens.refreshToken,
 *         tokenExpiry: tokens.tokenExpiry,
 *       },
 *     });
 *   },
 * });
 * ```
 */
export async function getSearchConsoleDataWithRefresh(
  options: SearchConsoleDataWithRefreshOptions
): Promise<SearchConsoleDataResponse> {
  const { executeWithTokenRefresh } = await import('./oauth');

  return executeWithTokenRefresh(
    {
      accessToken: options.accessToken,
      refreshToken: options.refreshToken,
      integrationId: options.integrationId,
      onTokenRefresh: options.onTokenRefresh,
    },
    async (authOptions) => {
      const { rows } = await getKeywordRankings(authOptions, {
        siteUrl: options.siteUrl,
        startDate: options.startDate,
        endDate: options.endDate,
        dimensions: options.dimensions || ['query'],
        rowLimit: options.rowLimit || 5000,
      });

      // Map back to raw format for trigger tasks
      return {
        rows: rows.map((row) => ({
          keys: [row.keyword],
          clicks: row.clicks,
          impressions: row.impressions,
          ctr: row.ctr,
          position: row.position,
        })),
      };
    }
  );
}

// ============================================================
// URL HELPERS
// ============================================================

/** Normalize site URL for comparison */
export function normalizeSiteUrl(url: string): string {
  // Remove trailing slash
  let normalized = url.replace(/\/$/, '');

  // Ensure protocol
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = `https://${normalized}`;
  }

  return normalized.toLowerCase();
}

/** Check if URL matches a GSC site URL */
export function matchesSiteUrl(websiteUrl: string, gscSiteUrl: string): boolean {
  const normalizedWebsite = normalizeSiteUrl(websiteUrl);
  const normalizedGsc = gscSiteUrl.toLowerCase();

  // Handle domain property (sc-domain:example.com)
  if (normalizedGsc.startsWith('sc-domain:')) {
    const domain = normalizedGsc.replace('sc-domain:', '');
    const websiteHost = new URL(normalizedWebsite).hostname.replace(/^www\./, '');
    return websiteHost === domain || websiteHost.endsWith(`.${domain}`);
  }

  // Handle URL property
  return normalizedWebsite.startsWith(normalizedGsc);
}

