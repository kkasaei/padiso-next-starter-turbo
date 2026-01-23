/**
 * Project Asset Types
 *
 * Type definitions for project-based CDN assets (images, videos, audio).
 */

// ============================================================
// Database Types (mirrors database enums/models)
// ============================================================

// Asset media type enum
export type ProjectAssetMediaType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT'

// Asset status enum
export type ProjectAssetStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED'

// ProjectAsset type (mirrors database model)
export interface ProjectAsset {
  id: string
  projectId: string
  name: string
  type: ProjectAssetMediaType
  status: ProjectAssetStatus
  cdnUrl: string | null
  thumbnailUrl: string | null
  size: number
  mimeType: string
  width: number | null
  height: number | null
  duration: number | null
  aiGenerated: boolean
  aiPrompt: string | null
  altText: string | null
  caption: string | null
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

// ============================================================
// DTO Types (for API responses)
// ============================================================

export interface ProjectAssetDto {
  id: string;
  projectId: string;
  name: string;
  type: ProjectAssetMediaType;
  status: ProjectAssetStatus;

  // URLs
  cdnUrl: string;
  thumbnailUrl: string | null;

  // File metadata
  size: number;
  mimeType: string;
  width: number | null;
  height: number | null;
  duration: number | null;

  // AI Generation
  aiGenerated: boolean;
  aiPrompt: string | null;

  // SEO/Content
  altText: string | null;
  caption: string | null;
  tags: string[];

  // Timestamps
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface ProjectAssetListDto {
  assets: ProjectAssetDto[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================================
// Form/Input Types
// ============================================================

export interface UploadAssetInput {
  projectId: string;
  file: {
    name: string;
    type: string;
    size: number;
    base64: string; // File content as base64
  };
  altText?: string;
  caption?: string;
  tags?: string[];
}

export interface GenerateAIImageInput {
  projectId: string;
  prompt: string;
  size?: 'square' | 'landscape' | 'portrait' | 'wide' | 'tall';
  style?:
    | 'photorealistic'
    | 'illustration'
    | '3d-render'
    | 'icon'
    | 'abstract'
    | 'minimal'
    | 'vibrant'
    | 'professional';
  altText?: string;
  caption?: string;
  tags?: string[];
}

export interface UpdateAssetInput {
  assetId: string;
  name?: string;
  altText?: string;
  caption?: string;
  tags?: string[];
}

export interface DeleteAssetInput {
  assetId: string;
}

export interface BulkDeleteAssetsInput {
  assetIds: string[];
}

export interface GetProjectAssetsInput {
  projectId: string;
  type?: ProjectAssetMediaType | 'all';
  status?: ProjectAssetStatus | 'all';
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'name' | 'size' | 'type';
  sortDirection?: 'asc' | 'desc';
}

// ============================================================
// Helper Types
// ============================================================

export type AssetTypeFilter = ProjectAssetMediaType | 'all';
export type AssetStatusFilter = ProjectAssetStatus | 'all';

// ============================================================
// Conversion Helpers
// ============================================================

/**
 * Convert a Prisma ProjectAsset to a DTO
 */
export function toProjectAssetDto(asset: ProjectAsset): ProjectAssetDto {
  return {
    id: asset.id,
    projectId: asset.projectId,
    name: asset.name,
    type: asset.type,
    status: asset.status,
    cdnUrl: asset.cdnUrl || '', // Fallback to empty string for pending assets
    thumbnailUrl: asset.thumbnailUrl,
    size: asset.size,
    mimeType: asset.mimeType,
    width: asset.width,
    height: asset.height,
    duration: asset.duration,
    aiGenerated: asset.aiGenerated,
    aiPrompt: asset.aiPrompt,
    altText: asset.altText,
    caption: asset.caption,
    tags: asset.tags,
    createdAt: asset.createdAt.toISOString(),
    updatedAt: asset.updatedAt.toISOString(),
  };
}

/**
 * Convert multiple Prisma ProjectAssets to DTOs
 */
export function toProjectAssetDtoList(assets: ProjectAsset[]): ProjectAssetDto[] {
  return assets.map(toProjectAssetDto);
}

