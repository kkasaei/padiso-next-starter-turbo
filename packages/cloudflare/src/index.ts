/**
 * Cloudflare R2 Storage Library
 *
 * Provides utilities for uploading, downloading, and managing files
 * on Cloudflare R2 (S3-compatible object storage)
 */

// Environment configuration
export { env, validateEnv } from './env';
export type * from './env';

// R2 Client and Configuration
export { getR2Client, R2_CONFIG } from './r2-client';
export {
  uploadPDFToR2,
  checkPDFExists,
  generatePDFUrl,
  uploadOGImageToR2,
  checkOGImageExists,
  generateOGImageUrl,
} from './r2-upload';
export {
  normalizeDomain,
  sanitizeDomainForFilename,
  formatFileSize,
  isFileSizeAcceptable,
  parsePDFUrl,
} from './r2-utils';

// Project Assets (CDN storage for project media)
export {
  // Constants & Types
  ASSET_BASE_PATH,
  ASSET_MIME_TYPES,
  ASSET_SIZE_LIMITS,
  type AssetMediaType,
  // Helper functions
  getExtensionFromMimeType,
  getAssetTypeFromMimeType,
  isValidAssetMimeType,
  generateAssetR2Key,
  generateThumbnailR2Key,
  generateCdnUrl,
  // Upload functions
  uploadAssetToR2,
  uploadThumbnailToR2,
  uploadAIGeneratedImageToR2,
  type UploadAssetOptions,
  type UploadAssetResult,
  type UploadAIGeneratedImageOptions,
  // Delete functions
  deleteAssetFromR2,
  deleteAssetsFromR2,
  // Check/Query functions
  checkAssetExists,
  getSignedAssetUrl,
} from './r2-assets';
