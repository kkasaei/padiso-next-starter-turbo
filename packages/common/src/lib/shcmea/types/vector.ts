/**
 * Upstash Vector Types
 *
 * Type definitions for vector search operations including
 * upsert, query, fetch, delete, and index management.
 */

// ============================================================
// CORE VECTOR TYPES
// ============================================================

/**
 * Represents a vector with its ID, values, and optional metadata
 */
export type VectorRecord<TMetadata extends Record<string, unknown> = Record<string, unknown>> = {
  /** Unique identifier for the vector */
  id: string;
  /** Vector embedding values */
  vector?: number[];
  /** Optional metadata associated with the vector */
  metadata?: TMetadata;
  /** Optional raw data/content stored with the vector */
  data?: string;
};

/**
 * Input for upserting a single vector
 */
export type VectorUpsertInput<TMetadata extends Record<string, unknown> = Record<string, unknown>> = {
  /** Unique identifier for the vector */
  id: string;
  /** Vector embedding values (required unless using data with embedding model) */
  vector?: number[];
  /** Optional metadata to store with the vector */
  metadata?: TMetadata;
  /** Optional raw data/content - can be used for automatic embedding */
  data?: string;
};

/**
 * Result of a vector query/search operation
 */
export type VectorQueryResult<TMetadata extends Record<string, unknown> = Record<string, unknown>> = {
  /** Vector ID */
  id: string;
  /** Similarity score (0-1, higher is more similar) */
  score: number;
  /** Vector values (only included if requested) */
  vector?: number[];
  /** Metadata (only included if requested) */
  metadata?: TMetadata;
  /** Raw data (only included if requested) */
  data?: string;
};

// ============================================================
// QUERY OPTIONS
// ============================================================

/**
 * Options for vector query operations
 */
export type VectorQueryOptions<TMetadata extends Record<string, unknown> = Record<string, unknown>> = {
  /** Number of results to return (default: 10) */
  topK?: number;
  /** Whether to include vector values in results */
  includeVectors?: boolean;
  /** Whether to include metadata in results */
  includeMetadata?: boolean;
  /** Whether to include raw data in results */
  includeData?: boolean;
  /** Metadata filter for narrowing down results */
  filter?: string;
  /** Namespace to query within (for multi-tenant support) */
  namespace?: string;
};

/**
 * Input for querying by vector values
 */
export type VectorQueryByVectorInput<TMetadata extends Record<string, unknown> = Record<string, unknown>> = VectorQueryOptions<TMetadata> & {
  /** Vector values to search for similar vectors */
  vector: number[];
};

/**
 * Input for querying by text data (requires embedding model)
 */
export type VectorQueryByDataInput<TMetadata extends Record<string, unknown> = Record<string, unknown>> = VectorQueryOptions<TMetadata> & {
  /** Text data to search for similar content */
  data: string;
};

/**
 * Combined query input type
 */
export type VectorQueryInput<TMetadata extends Record<string, unknown> = Record<string, unknown>> =
  | VectorQueryByVectorInput<TMetadata>
  | VectorQueryByDataInput<TMetadata>;

// ============================================================
// FETCH OPTIONS
// ============================================================

/**
 * Options for fetching vectors by ID
 */
export type VectorFetchOptions = {
  /** Whether to include vector values */
  includeVectors?: boolean;
  /** Whether to include metadata */
  includeMetadata?: boolean;
  /** Whether to include raw data */
  includeData?: boolean;
  /** Namespace to fetch from */
  namespace?: string;
};

/**
 * Input for fetching vectors
 */
export type VectorFetchInput = VectorFetchOptions & {
  /** Vector ID(s) to fetch */
  ids: string | string[];
};

// ============================================================
// DELETE OPTIONS
// ============================================================

/**
 * Options for deleting vectors
 */
export type VectorDeleteInput = {
  /** Single ID or array of IDs to delete */
  ids?: string | string[];
  /** Delete all vectors in namespace */
  deleteAll?: boolean;
  /** Metadata filter for conditional delete */
  filter?: string;
  /** Namespace to delete from */
  namespace?: string;
};

// ============================================================
// UPDATE OPTIONS
// ============================================================

/**
 * Input for updating a vector's metadata
 */
export type VectorUpdateInput<TMetadata extends Record<string, unknown> = Record<string, unknown>> = {
  /** ID of vector to update */
  id: string;
  /** New vector values */
  vector?: number[];
  /** New or updated metadata */
  metadata?: TMetadata;
  /** Metadata update mode: 'PATCH' merges, 'OVERWRITE' replaces */
  metadataUpdateMode?: 'PATCH' | 'OVERWRITE';
  /** New raw data */
  data?: string;
  /** Namespace of the vector */
  namespace?: string;
};

// ============================================================
// RANGE QUERY OPTIONS
// ============================================================

/**
 * Options for range queries (paginated listing)
 */
export type VectorRangeOptions = {
  /** Cursor for pagination (empty string for first page) */
  cursor?: string;
  /** Number of results per page */
  limit?: number;
  /** Whether to include vector values */
  includeVectors?: boolean;
  /** Whether to include metadata */
  includeMetadata?: boolean;
  /** Whether to include raw data */
  includeData?: boolean;
  /** Optional prefix filter for IDs */
  prefix?: string;
  /** Namespace to query */
  namespace?: string;
};

/**
 * Result of a range query
 */
export type VectorRangeResult<TMetadata extends Record<string, unknown> = Record<string, unknown>> = {
  /** Cursor for next page (empty if no more results) */
  nextCursor: string;
  /** Vectors in this page */
  vectors: VectorRecord<TMetadata>[];
};

// ============================================================
// INDEX INFO
// ============================================================

/**
 * Information about the vector index
 */
export type VectorIndexInfo = {
  /** Total number of vectors in the index */
  vectorCount: number;
  /** Number of pending vectors (being indexed) */
  pendingVectorCount: number;
  /** Index size in bytes */
  indexSize: number;
  /** Vector dimension */
  dimension: number;
  /** Similarity function used */
  similarityFunction: 'COSINE' | 'EUCLIDEAN' | 'DOT_PRODUCT';
};

// ============================================================
// NAMESPACE TYPES
// ============================================================

/**
 * Namespace information
 */
export type VectorNamespaceInfo = {
  /** Namespace name */
  name: string;
  /** Number of vectors in namespace */
  vectorCount: number;
  /** Number of pending vectors */
  pendingVectorCount: number;
};

// ============================================================
// BATCH OPERATION TYPES
// ============================================================

/**
 * Result of a batch upsert operation
 */
export type VectorBatchUpsertResult = {
  /** Number of vectors successfully upserted */
  upsertedCount: number;
};

/**
 * Result of a batch delete operation
 */
export type VectorBatchDeleteResult = {
  /** Number of vectors deleted */
  deletedCount: number;
};

// ============================================================
// SEMANTIC SEARCH TYPES (Higher-level abstractions)
// ============================================================

/**
 * Document type for semantic search
 */
export type SemanticDocument<TMetadata extends Record<string, unknown> = Record<string, unknown>> = {
  /** Unique document ID */
  id: string;
  /** Text content for embedding */
  content: string;
  /** Document metadata */
  metadata?: TMetadata;
};

/**
 * Result of a semantic search
 */
export type SemanticSearchResult<TMetadata extends Record<string, unknown> = Record<string, unknown>> = {
  /** Document ID */
  id: string;
  /** Relevance score (0-1) */
  score: number;
  /** Document content */
  content?: string;
  /** Document metadata */
  metadata?: TMetadata;
};

/**
 * Options for semantic search
 */
export type SemanticSearchOptions<TMetadata extends Record<string, unknown> = Record<string, unknown>> = {
  /** Search query text */
  query: string;
  /** Number of results */
  topK?: number;
  /** Minimum score threshold (0-1) */
  minScore?: number;
  /** Metadata filter */
  filter?: string;
  /** Include content in results */
  includeContent?: boolean;
  /** Include metadata in results */
  includeMetadata?: boolean;
  /** Namespace to search */
  namespace?: string;
};

