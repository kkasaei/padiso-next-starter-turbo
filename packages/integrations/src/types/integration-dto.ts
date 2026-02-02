/**
 * Integration DTOs (Data Transfer Objects)
 *
 * These types are used for API responses and client-side data.
 * They exclude sensitive data like tokens.
 */

import type {
  IntegrationProvider,
  IntegrationStatus,
  ServiceType,
  ServiceStatus,
  SyncStatus,
  ServiceConfig,
  TrackingTier,
  TrackedKeywordIntent,
} from './integration';

// ============================================================
// INTEGRATION DTOs
// ============================================================

/** Integration summary for list views */
export interface IntegrationSummaryDto {
  id: string;
  projectId: string;
  provider: IntegrationProvider;
  name: string;
  providerEmail: string | null;
  status: IntegrationStatus;
  serviceCount: number;
  activeServiceCount: number;
  lastSyncAt: string | null;
  createdAt: string;
}

/** Full integration details */
export interface IntegrationDetailDto {
  id: string;
  projectId: string;
  provider: IntegrationProvider;
  name: string;
  providerAccountId: string | null;
  providerEmail: string | null;
  status: IntegrationStatus;
  tokenScope: string[];
  lastSyncAt: string | null;
  lastError: string | null;
  errorCount: number;
  services: IntegrationServiceDto[];
  createdAt: string;
  updatedAt: string;
}

/** Integration service details */
export interface IntegrationServiceDto {
  id: string;
  integrationId: string;
  service: ServiceType;
  status: ServiceStatus;
  isEnabled: boolean;
  config: ServiceConfig | null;
  lastSyncAt: string | null;
  lastSyncStatus: SyncStatus | null;
  lastError: string | null;
  syncCount: number;
  usageThisMonth: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// TRACKED KEYWORD DTOs
// ============================================================

/** Tracked keyword summary for list views */
export interface TrackedKeywordSummaryDto {
  id: string;
  projectId: string;
  keyword: string;
  intent: TrackedKeywordIntent;
  isTracking: boolean;
  trackingTier: TrackingTier;
  lastPosition: number | null;
  lastClicks: number | null;
  lastImpressions: number | null;
  lastGscSync: string | null;
  lastSerpPosition: number | null;
  lastSerpCheck: string | null;
}

/** Full tracked keyword details */
export interface TrackedKeywordDetailDto {
  id: string;
  projectId: string;
  integrationServiceId: string | null;
  keyword: string;
  intent: TrackedKeywordIntent;
  isTracking: boolean;
  trackingTier: TrackingTier;
  // GSC data
  lastPosition: number | null;
  lastClicks: number | null;
  lastImpressions: number | null;
  lastCtr: number | null;
  lastGscSync: string | null;
  // SERP data
  lastSerpPosition: number | null;
  lastSerpFeatures: string[];
  lastSerpCheck: string | null;
  lastCompetitors: TrackedKeywordCompetitor[] | null;
  // Metrics
  searchVolume: number | null;
  difficulty: number | null;
  cpc: number | null;
  // Metadata
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Competitor data from SERP check */
export interface TrackedKeywordCompetitor {
  domain: string;
  position: number;
}

/** GSC ranking data (historical) */
export interface KeywordRankingDataPoint {
  date: string;
  position: number;
  clicks: number;
  impressions: number;
  ctr: number;
}

// ============================================================
// OAUTH CALLBACK DATA
// ============================================================

/** Data from OAuth callback */
export interface OAuthCallbackData {
  code: string;
  state: string;
  provider: IntegrationProvider;
  projectId: string;
  services: ServiceType[];
}

/** OAuth state (stored in Redis during auth flow) */
export interface OAuthStateData {
  projectId: string;
  provider: IntegrationProvider;
  services: ServiceType[];
  redirectUri: string;
  createdAt: number;
  expiresAt: number;
}

// ============================================================
// SERVICE CONFIGURATION DTOs
// ============================================================

/** GSC site list response */
export interface GSCSiteDto {
  siteUrl: string;
  permissionLevel: 'siteOwner' | 'siteFullUser' | 'siteRestrictedUser';
}

/** Drive folder response */
export interface DriveFolderDto {
  id: string;
  name: string;
  webViewLink?: string;
}

/** Drive file response */
export interface DriveFileDto {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  iconLink?: string;
  createdTime?: string;
  modifiedTime?: string;
}

// ============================================================
// INTEGRATION ACTIONS RESPONSE TYPES
// ============================================================

/** Response when connecting a new integration */
export interface ConnectIntegrationResponse {
  success: boolean;
  integration?: IntegrationDetailDto;
  authUrl?: string;
  error?: string;
}

/** Response when disconnecting an integration */
export interface DisconnectIntegrationResponse {
  success: boolean;
  error?: string;
}

/** Response when syncing an integration service */
export interface SyncServiceResponse {
  success: boolean;
  service?: IntegrationServiceDto;
  error?: string;
}

/** Response when configuring a service */
export interface ConfigureServiceResponse {
  success: boolean;
  service?: IntegrationServiceDto;
  error?: string;
}

// ============================================================
// LIST/PAGINATION TYPES
// ============================================================

/** Paginated list of integrations */
export interface IntegrationListDto {
  integrations: IntegrationSummaryDto[];
  total: number;
}

/** Paginated list of tracked keywords */
export interface TrackedKeywordListDto {
  keywords: TrackedKeywordSummaryDto[];
  total: number;
  hasGscIntegration: boolean;
}

/** Keyword ranking history response */
export interface KeywordRankingHistoryDto {
  keywordId: string;
  keyword: string;
  dataPoints: KeywordRankingDataPoint[];
  dateRange: {
    start: string;
    end: string;
  };
}

