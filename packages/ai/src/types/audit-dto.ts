/**
 * Internal Audit DTO Types
 * 
 * These types define the structure of audit-related data transfer objects.
 */

// ============================================================
// Issue Types
// ============================================================

export type IssueSeverity = 'critical' | 'warning' | 'info';

export type IssueType =
  | 'seo'
  | 'aeo'
  | 'content'
  | 'technical'
  | 'performance'
  | 'accessibility'
  | 'security'
  | 'missing_title'
  | 'missing_description'
  | 'missing_h1'
  | 'missing_alt_text'
  | 'missing_canonical'
  | 'missing_og_tags'
  | 'missing_structured_data'
  | 'thin_content'
  | 'broken_link';

export interface PageIssue {
  type: IssueType;
  severity: IssueSeverity;
  title: string;
  description: string;
  recommendation: string;
  message?: string;
  fix?: string;
  affectedElements?: string[];
  estimatedImpact?: 'high' | 'medium' | 'low';
}

// ============================================================
// Link and Image Info
// ============================================================

export interface LinkInfo {
  href: string;
  text: string;
  isInternal: boolean;
  isNofollow: boolean;
  isExternal?: boolean;
  isBroken?: boolean;
  rel?: string;
  target?: string;
}

export interface ImageInfo {
  src: string;
  alt: string;
  width: number | null;
  height: number | null;
  loading: string | null;
  srcset?: string;
  sizes?: string;
}

// ============================================================
// Structured Data
// ============================================================

export interface StructuredDataItem {
  type: string;
  data: any;
}

// ============================================================
// Page Metadata
// ============================================================

export interface PageMetadata {
  // Basic SEO
  title: string | null;
  description: string | null;
  keywords: string | null;
  
  // Headings
  h1: string | null;
  h2s: string[];
  h3s: string[];
  
  // Links
  links: LinkInfo[];
  internalLinks: number;
  externalLinks: number;
  
  // Images
  images: ImageInfo[];
  imagesWithoutAlt: number;
  totalImages: number;
  
  // OpenGraph
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  ogType: string | null;
  
  // Twitter Card
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  
  // Technical
  canonical: string | null;
  canonicalUrl?: string | null; // Alias for compatibility
  robots: string | null;
  viewport: string | null;
  lang: string | null;
  charset: string | null;
  
  // Structured Data
  structuredData: StructuredDataItem[];
  hasStructuredData: boolean;
  structuredDataTypes: string[];
  
  // Content
  wordCount: number;
  readingTime: number;
  
  // Other
  hasOgTags: boolean;
  hasCanonical: boolean;
}

// ============================================================
// Page Analysis
// ============================================================

export interface PageAnalysis {
  // SEO Analysis
  seo: {
    titleOptimization: string;
    descriptionOptimization: string;
    headingStructure: string;
    keywordUsage: string;
    urlStructure: string;
    internalLinking: string;
  };
  
  // AEO (Answer Engine Optimization) Analysis
  aeo: {
    answerRelevance: string;
    structuredDataUsage: string;
    contentClarity: string;
    entityRecognition: string;
    conversationalAlignment: string;
  };
  
  // Content Analysis
  content: {
    quality: string;
    readability: string;
    engagement: string;
    comprehensiveness: string;
    uniqueness: string;
  };
  
  // Technical Analysis
  technical: {
    performance: string;
    mobileFriendliness: string;
    coreWebVitals: string;
    security: string;
    markup: string;
  };
  
  // Overall Summary
  summary: string;
  strengths: string[];
  weaknesses: string[];
  quickWins: string[];
  issues?: PageIssue[]; // Optional issues array for compatibility
  recommendations?: string[]; // Optional recommendations for compatibility
}
