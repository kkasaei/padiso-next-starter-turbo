/**
 * Google Integration Services
 *
 * Exports all Google-related integration services:
 * - OAuth (authentication)
 * - Search Console (keyword rankings)
 * - Drive (file storage)
 */

// OAuth
export {
  getOAuth2Client,
  getScopesForServices,
  generateAuthUrl,
  exchangeCodeForTokens,
  refreshAccessToken,
  revokeAccess,
  getUserInfo,
  createAuthenticatedClient,
  encryptTokens,
  decryptTokens,
  encodeOAuthState,
  decodeOAuthState,
  isUnauthorizedError,
  executeWithTokenRefresh,
  type GenerateAuthUrlOptions,
  type TokenResponse,
  type GoogleUserInfo,
  type AuthenticatedClientOptions,
  type OAuthState,
  type OAuthApiCallOptions,
} from './oauth';

// Search Console
export {
  createSearchConsoleClient,
  listSites,
  getSite,
  getKeywordRankings,
  getRankingsForKeywords,
  getTopKeywords,
  getKeywordRankingsByDate,
  getTopPages,
  getDateRangeLastNDays,
  normalizeSiteUrl,
  matchesSiteUrl,
  getSearchConsoleData,
  getSearchConsoleDataWithRefresh,
  type GSCRankingData,
  type GSCSearchAnalyticsQuery,
  type GSCSearchAnalyticsResponse,
  type SearchConsoleDataOptions,
  type SearchConsoleDataResponse,
  type SearchConsoleDataWithRefreshOptions,
} from './search-console';

// Drive
export {
  createDriveClient,
  createFolder,
  getOrCreateSearchFitFolder,
  getFolder,
  listFiles,
  uploadFile,
  downloadFile,
  getFile,
  deleteFile,
  trashFile,
  createGoogleDoc,
  updateGoogleDocContent,
  GOOGLE_MIME_TYPES,
  EXPORT_MIME_TYPES,
  type CreateFolderOptions,
  type ListFilesOptions,
  type UploadFileOptions,
  type CreateDocOptions,
} from './drive';

// Docs (export/conversion)
export {
  exportDocAsHtml,
  exportDocAsPlainText,
  exportDocAsMarkdown,
  batchExportDocsAsMarkdown,
  htmlToMarkdown,
  type ExportedDocument,
} from './docs';

