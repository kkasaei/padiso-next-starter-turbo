// ============================================================
// SITE DISCOVERY TYPES
// Types for llms.txt, sitemap.xml, and other site files discovery
// ============================================================

/**
 * Types of site files that can be discovered
 */
export type SiteFileType = 
  | 'llms.txt'
  | 'llms-full.txt'
  | 'sitemap.xml'
  | 'sitemap.txt'
  | 'robots.txt';

/**
 * Status of a site file
 */
export type SiteFileStatus = 
  | 'discovered'    // File exists at URL but not yet fetched
  | 'fetching'      // Currently fetching the file
  | 'processing'    // Processing/parsing the file
  | 'indexed'       // Successfully parsed and stored in vector DB
  | 'failed'        // Failed to fetch or process
  | 'not_found'     // File does not exist at expected URL
  | 'uploaded';     // User uploaded the file manually

/**
 * Source of the file (how it was obtained)
 */
export type SiteFileSource = 
  | 'auto_discovered'  // Found automatically at standard URL
  | 'custom_url'       // User provided custom URL
  | 'uploaded';        // User uploaded directly

/**
 * Represents a discovered/uploaded site file
 */
export interface SiteFile {
  /** Unique identifier */
  id: string;
  
  /** Type of file */
  type: SiteFileType;
  
  /** How the file was obtained */
  source: SiteFileSource;
  
  /** URL where the file was found (null for uploads) */
  url: string | null;
  
  /** Current status */
  status: SiteFileStatus;
  
  /** Error message if status is 'failed' */
  error?: string;
  
  /** File content (raw text) */
  content?: string;
  
  /** File size in bytes */
  size?: number;
  
  /** When the file was first discovered/uploaded */
  discoveredAt: string;
  
  /** When the file was last successfully fetched */
  lastFetchedAt?: string;
  
  /** When the file was last processed and indexed */
  lastIndexedAt?: string;
  
  /** Number of items extracted (pages from sitemap, sections from llms.txt) */
  itemsExtracted?: number;
  
  /** Checksum for change detection */
  contentHash?: string;
}

/**
 * Configuration for site discovery sync
 */
export interface SiteDiscoveryConfig {
  /** Whether automatic sync is enabled */
  syncEnabled: boolean;
  
  /** How often to sync files */
  syncFrequency: 'daily' | 'weekly' | 'monthly';
  
  /** When the last sync occurred */
  lastSyncAt?: string;
  
  /** When the next sync is scheduled */
  nextSyncAt?: string;
}

/**
 * Complete site discovery state for a project
 */
export interface SiteDiscoveryState {
  /** Discovery configuration */
  config: SiteDiscoveryConfig;
  
  /** All discovered/uploaded files */
  files: SiteFile[];
}

/**
 * Result from discovering files at a URL
 */
export interface DiscoverFilesResult {
  /** Base URL that was checked */
  baseUrl: string;
  
  /** Files that were discovered */
  discovered: SiteFile[];
  
  /** URLs that were checked but not found */
  notFound: string[];
}

/**
 * Result from processing a site file
 */
export interface ProcessFileResult {
  /** Whether processing was successful */
  success: boolean;
  
  /** Number of items extracted and indexed */
  itemsIndexed: number;
  
  /** Error message if failed */
  error?: string;
  
  /** Summary of what was extracted */
  summary?: {
    /** For sitemap: list of page URLs */
    pageUrls?: string[];
    
    /** For llms.txt: sections found */
    sections?: string[];
    
    /** For robots.txt: parsed directives */
    directives?: Record<string, string[]>;
  };
}

/**
 * Parsed content from llms.txt
 */
export interface LLMSTextContent {
  /** Raw content */
  raw: string;
  
  /** Title/name section */
  title?: string;
  
  /** Description section */
  description?: string;
  
  /** Key topics/keywords */
  topics?: string[];
  
  /** Products/services mentioned */
  products?: string[];
  
  /** Important URLs mentioned */
  urls?: string[];
  
  /** Custom sections found */
  sections: {
    heading: string;
    content: string;
  }[];
}

/**
 * Parsed content from sitemap.xml/txt
 */
export interface SitemapContent {
  /** Raw content */
  raw: string;
  
  /** All page URLs found */
  urls: {
    loc: string;
    lastmod?: string;
    changefreq?: string;
    priority?: string;
  }[];
  
  /** Nested sitemap URLs (for sitemap index files) */
  sitemapUrls?: string[];
  
  /** Total number of URLs */
  totalUrls: number;
}

/**
 * Parsed content from robots.txt
 */
export interface RobotsContent {
  /** Raw content */
  raw: string;
  
  /** User agent rules */
  rules: {
    userAgent: string;
    allow: string[];
    disallow: string[];
  }[];
  
  /** Sitemap URLs found */
  sitemapUrls: string[];
  
  /** Other directives */
  otherDirectives: Record<string, string>;
}

/**
 * Metadata for vector storage of site pages
 */
export interface SitePageMetadata {
  /** Project ID */
  projectId: string;
  
  /** Organization ID */
  organizationId: string;
  
  /** Page URL */
  url: string;
  
  /** Source file type that contained this page */
  sourceFileType: SiteFileType;
  
  /** When this page was indexed */
  indexedAt: string;
  
  /** Priority from sitemap (if available) */
  priority?: string;
  
  /** Last modified from sitemap (if available) */
  lastmod?: string;
}

/**
 * Default discovery configuration
 */
export const DEFAULT_SITE_DISCOVERY_CONFIG: SiteDiscoveryConfig = {
  syncEnabled: false,
  syncFrequency: 'weekly',
};

/**
 * Standard file paths to check during discovery
 */
export const STANDARD_FILE_PATHS: Record<SiteFileType, string[]> = {
  'llms.txt': ['/llms.txt', '/.well-known/llms.txt'],
  'llms-full.txt': ['/llms-full.txt', '/.well-known/llms-full.txt'],
  'sitemap.xml': ['/sitemap.xml', '/sitemap_index.xml'],
  'sitemap.txt': ['/sitemap.txt'],
  'robots.txt': ['/robots.txt'],
};
