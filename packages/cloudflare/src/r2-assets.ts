import {
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getR2Client, R2_CONFIG } from './r2-client';

// ============================================================
// Constants
// ============================================================

export const ASSET_BASE_PATH = 'assets';

// Supported file types and their categories
export const ASSET_MIME_TYPES = {
  // Images
  'image/jpeg': 'image',
  'image/jpg': 'image',
  'image/png': 'image',
  'image/webp': 'image',
  'image/gif': 'image',
  'image/svg+xml': 'image',
  // Videos
  'video/mp4': 'video',
  'video/webm': 'video',
  'video/quicktime': 'video', // .mov
  // Audio
  'audio/mpeg': 'audio', // .mp3
  'audio/wav': 'audio',
  'audio/ogg': 'audio',
  'audio/mp4': 'audio', // .m4a
} as const;

export type AssetMediaType = 'image' | 'video' | 'audio';

// File size limits (in bytes)
export const ASSET_SIZE_LIMITS = {
  image: 25 * 1024 * 1024, // 25 MB
  video: 500 * 1024 * 1024, // 500 MB
  audio: 50 * 1024 * 1024, // 50 MB
} as const;

// ============================================================
// Helper Functions
// ============================================================

/**
 * Get the file extension from a MIME type
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/quicktime': 'mov',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'audio/ogg': 'ogg',
    'audio/mp4': 'm4a',
  };

  return mimeToExt[mimeType] || 'bin';
}

/**
 * Get the asset media type from a MIME type
 */
export function getAssetTypeFromMimeType(
  mimeType: string
): AssetMediaType | null {
  const type = ASSET_MIME_TYPES[mimeType as keyof typeof ASSET_MIME_TYPES];
  return type || null;
}

/**
 * Validate if a MIME type is supported
 */
export function isValidAssetMimeType(mimeType: string): boolean {
  return mimeType in ASSET_MIME_TYPES;
}

/**
 * Generate the R2 key path for an asset
 * Format: assets/{orgId}/{projectId}/{assetId}/original.{ext}
 */
export function generateAssetR2Key(
  orgId: string,
  projectId: string,
  assetId: string,
  mimeType: string
): string {
  const ext = getExtensionFromMimeType(mimeType);
  return `${ASSET_BASE_PATH}/${orgId}/${projectId}/${assetId}/original.${ext}`;
}

/**
 * Generate the R2 key path for a thumbnail
 * Format: assets/{orgId}/{projectId}/{assetId}/thumbnail.webp
 */
export function generateThumbnailR2Key(
  orgId: string,
  projectId: string,
  assetId: string
): string {
  return `${ASSET_BASE_PATH}/${orgId}/${projectId}/${assetId}/thumbnail.webp`;
}

/**
 * Generate the public CDN URL for an R2 key
 */
export function generateCdnUrl(r2Key: string): string {
  return `${R2_CONFIG.CDN_URL}/${r2Key}`;
}

// ============================================================
// Upload Functions
// ============================================================

export interface UploadAssetOptions {
  orgId: string;
  projectId: string;
  assetId: string;
  buffer: Buffer;
  mimeType: string;
  fileName: string;
  metadata?: Record<string, string>;
}

export interface UploadAssetResult {
  r2Key: string;
  cdnUrl: string;
  size: number;
}

/**
 * Upload an asset file to Cloudflare R2
 */
export async function uploadAssetToR2(
  options: UploadAssetOptions
): Promise<UploadAssetResult> {
  const { orgId, projectId, assetId, buffer, mimeType, fileName, metadata } =
    options;

  // Validate MIME type
  if (!isValidAssetMimeType(mimeType)) {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }

  // Check file size
  const assetType = getAssetTypeFromMimeType(mimeType);
  if (assetType && buffer.length > ASSET_SIZE_LIMITS[assetType]) {
    const limitMB = ASSET_SIZE_LIMITS[assetType] / (1024 * 1024);
    throw new Error(
      `File too large. Maximum size for ${assetType} is ${limitMB}MB`
    );
  }

  // Generate R2 key
  const r2Key = generateAssetR2Key(orgId, projectId, assetId, mimeType);

  console.log(`[R2] Uploading asset to: ${r2Key}`);

  try {
    await getR2Client().send(
      new PutObjectCommand({
        Bucket: R2_CONFIG.BUCKET,
        Key: r2Key,
        Body: buffer,
        ContentType: mimeType,
        ContentLength: buffer.length,
        CacheControl: 'public, max-age=31536000, immutable', // Cache for 1 year
        Metadata: {
          'x-asset-id': assetId,
          'x-project-id': projectId,
          'x-org-id': orgId,
          'x-original-filename': fileName,
          'x-uploaded-at': new Date().toISOString(),
          ...metadata,
        },
      })
    );

    const cdnUrl = generateCdnUrl(r2Key);
    console.log(`[R2] Asset uploaded successfully: ${cdnUrl}`);

    return {
      r2Key,
      cdnUrl,
      size: buffer.length,
    };
  } catch (error) {
    console.error('[R2] Failed to upload asset:', error);
    throw new Error(
      `Failed to upload asset to R2: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Upload a thumbnail image to R2
 */
export async function uploadThumbnailToR2(
  orgId: string,
  projectId: string,
  assetId: string,
  thumbnailBuffer: Buffer
): Promise<{ r2Key: string; cdnUrl: string }> {
  const r2Key = generateThumbnailR2Key(orgId, projectId, assetId);

  console.log(`[R2] Uploading thumbnail to: ${r2Key}`);

  try {
    await getR2Client().send(
      new PutObjectCommand({
        Bucket: R2_CONFIG.BUCKET,
        Key: r2Key,
        Body: thumbnailBuffer,
        ContentType: 'image/webp',
        ContentLength: thumbnailBuffer.length,
        CacheControl: 'public, max-age=31536000, immutable',
        Metadata: {
          'x-asset-id': assetId,
          'x-is-thumbnail': 'true',
          'x-generated-at': new Date().toISOString(),
        },
      })
    );

    const cdnUrl = generateCdnUrl(r2Key);
    console.log(`[R2] Thumbnail uploaded successfully: ${cdnUrl}`);

    return { r2Key, cdnUrl };
  } catch (error) {
    console.error('[R2] Failed to upload thumbnail:', error);
    throw new Error(
      `Failed to upload thumbnail to R2: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// ============================================================
// Delete Functions
// ============================================================

/**
 * Delete a single object from R2
 */
async function deleteR2Object(key: string): Promise<void> {
  try {
    await getR2Client().send(
      new DeleteObjectCommand({
        Bucket: R2_CONFIG.BUCKET,
        Key: key,
      })
    );
    console.log(`[R2] Deleted: ${key}`);
  } catch (error) {
    console.error(`[R2] Failed to delete ${key}:`, error);
    // Don't throw - deletion failures shouldn't break the flow
  }
}

/**
 * Delete an asset and its thumbnail from R2
 */
export async function deleteAssetFromR2(
  orgId: string,
  projectId: string,
  assetId: string,
  mimeType: string
): Promise<void> {
  const assetKey = generateAssetR2Key(orgId, projectId, assetId, mimeType);
  const thumbnailKey = generateThumbnailR2Key(orgId, projectId, assetId);

  console.log(`[R2] Deleting asset and thumbnail: ${assetId}`);

  // Delete both in parallel
  await Promise.all([deleteR2Object(assetKey), deleteR2Object(thumbnailKey)]);

  console.log(`[R2] Asset deleted successfully: ${assetId}`);
}

/**
 * Delete multiple assets from R2 (batch operation)
 */
export async function deleteAssetsFromR2(
  assets: Array<{
    orgId: string;
    projectId: string;
    assetId: string;
    mimeType: string;
  }>
): Promise<void> {
  console.log(`[R2] Bulk deleting ${assets.length} assets`);

  // Process in parallel (with some concurrency limit)
  const BATCH_SIZE = 10;
  for (let i = 0; i < assets.length; i += BATCH_SIZE) {
    const batch = assets.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map((asset) =>
        deleteAssetFromR2(
          asset.orgId,
          asset.projectId,
          asset.assetId,
          asset.mimeType
        )
      )
    );
  }

  console.log(`[R2] Bulk delete completed`);
}

// ============================================================
// Check/Query Functions
// ============================================================

/**
 * Check if an asset exists in R2
 */
export async function checkAssetExists(r2Key: string): Promise<boolean> {
  try {
    await getR2Client().send(
      new HeadObjectCommand({
        Bucket: R2_CONFIG.BUCKET,
        Key: r2Key,
      })
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Get a signed URL for temporary access to an asset
 * Useful for private assets or downloads
 */
export async function getSignedAssetUrl(
  r2Key: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: R2_CONFIG.BUCKET,
    Key: r2Key,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const signedUrl = await getSignedUrl(getR2Client() as any, command as any, { expiresIn });
  return signedUrl;
}

// ============================================================
// AI-Generated Image Upload
// ============================================================

export interface UploadAIGeneratedImageOptions {
  orgId: string;
  projectId: string;
  assetId: string;
  imageBuffer: Buffer;
  prompt: string;
  model: string;
}

/**
 * Upload an AI-generated image to R2
 * Includes AI generation metadata
 */
export async function uploadAIGeneratedImageToR2(
  options: UploadAIGeneratedImageOptions
): Promise<UploadAssetResult> {
  const { orgId, projectId, assetId, imageBuffer, prompt, model } = options;

  // AI-generated images are PNG by default
  const mimeType = 'image/png';
  const r2Key = generateAssetR2Key(orgId, projectId, assetId, mimeType);

  console.log(`[R2] Uploading AI-generated image to: ${r2Key}`);

  try {
    await getR2Client().send(
      new PutObjectCommand({
        Bucket: R2_CONFIG.BUCKET,
        Key: r2Key,
        Body: imageBuffer,
        ContentType: mimeType,
        ContentLength: imageBuffer.length,
        CacheControl: 'public, max-age=31536000, immutable',
        Metadata: {
          'x-asset-id': assetId,
          'x-project-id': projectId,
          'x-org-id': orgId,
          'x-ai-generated': 'true',
          'x-ai-model': model,
          'x-ai-prompt': prompt.substring(0, 500), // Truncate long prompts
          'x-generated-at': new Date().toISOString(),
        },
      })
    );

    const cdnUrl = generateCdnUrl(r2Key);
    console.log(`[R2] AI-generated image uploaded successfully: ${cdnUrl}`);

    return {
      r2Key,
      cdnUrl,
      size: imageBuffer.length,
    };
  } catch (error) {
    console.error('[R2] Failed to upload AI-generated image:', error);
    throw new Error(
      `Failed to upload AI-generated image to R2: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

