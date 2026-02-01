// ============================================================
// CONTEXT FILES TYPES
// Types for document uploads used in RAG (Retrieval Augmented Generation)
// ============================================================

/**
 * Supported file types for context documents
 */
export type ContextFileType = 'pdf' | 'docx' | 'txt' | 'md';

/**
 * Status of a context file
 */
export type ContextFileStatus =
  | 'uploading'      // File is being uploaded
  | 'processing'     // Text is being extracted and chunked
  | 'indexing'       // Chunks are being indexed to vector DB
  | 'indexed'        // Successfully indexed
  | 'failed';        // Processing failed

/**
 * A single context file uploaded by the user
 */
export interface ContextFile {
  id: string;
  name: string;
  type: ContextFileType;
  size: number;
  status: ContextFileStatus;
  uploadedAt: string;
  indexedAt?: string;
  chunksCount?: number;        // Number of chunks indexed
  error?: string;              // Error message if failed
}

/**
 * State for all context files in a project
 */
export interface ContextFilesState {
  files: ContextFile[];
}

/**
 * Result of processing a context file
 */
export interface ProcessContextFileResult {
  success: boolean;
  chunksIndexed?: number;
  error?: string;
}

/**
 * Default empty state for context files
 */
export const DEFAULT_CONTEXT_FILES_STATE: ContextFilesState = {
  files: [],
};

/**
 * Maximum file size (10MB)
 */
export const MAX_CONTEXT_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Supported file extensions
 */
export const SUPPORTED_CONTEXT_FILE_EXTENSIONS = ['.pdf', '.docx', '.txt', '.md'];

/**
 * MIME types for supported files
 */
export const SUPPORTED_CONTEXT_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
];
