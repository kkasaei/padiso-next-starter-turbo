/**
 * Reddit Agent Types
 *
 * Type definitions for the Reddit social listening agent
 */

// ============================================================
// Brand Context
// ============================================================

/**
 * Brand context used for analyzing opportunities and generating comments
 * This is the "brand awareness" that drives AI decisions
 */
export interface BrandContext {
  brandId: string;
  brandName: string;
  description: string;
  websiteUrl: string;
  languages: string[];
  targetAudiences: string[];
  businessKeywords: string[];
  competitors: string[];
}

// ============================================================
// Opportunity Types
// ============================================================

/**
 * A Reddit post that represents a potential engagement opportunity
 */
export interface RedditOpportunity {
  postId: string;
  postTitle: string;
  postUrl: string;
  postBody: string | null;
  subreddit: string;
  author: string;
  upvotes: number;
  commentCount: number;
  postedAt: Date;
  relevanceScore: number;
  matchedKeywords: string[];
  opportunityType: OpportunityType;
}

/**
 * Types of opportunities based on how the brand can engage
 */
export type OpportunityType =
  | "recommendation_request" // User asking for product recommendations
  | "problem_discussion" // User discussing a problem the brand solves
  | "competitor_mention" // Competitor is mentioned, opportunity to compare
  | "industry_discussion" // General industry discussion
  | "question" // Direct question that brand expertise can answer
  | "review_thread" // Review/comparison thread
  | "other";

// ============================================================
// Comment Generation Types
// ============================================================

/**
 * A generated comment suggestion
 */
export interface GeneratedComment {
  comment: string;
  tone: CommentTone;
  mentionsBrand: boolean;
  confidence: number;
  rationale: string;
}

/**
 * The tone of the generated comment
 */
export type CommentTone =
  | "helpful" // Providing help/advice
  | "informative" // Sharing knowledge
  | "casual" // Friendly conversation
  | "professional" // Business-like
  | "enthusiastic"; // Excited/passionate

// ============================================================
// Scanner Types
// ============================================================

/**
 * Input for scanning Reddit
 */
export interface RedditScanInput {
  brandContext: BrandContext;
  keywords: string[];
  subreddits?: string[];
  options?: {
    maxPostsPerKeyword?: number;
    timeRange?: "hour" | "day" | "week" | "month";
    minRelevanceScore?: number;
  };
}

/**
 * Result of a Reddit scan
 */
export interface RedditScanResult {
  brandId: string;
  scanDate: Date;
  opportunities: RedditOpportunity[];
  totalPostsScanned: number;
  keywordsUsed: string[];
  subredditsSearched: string[];
  executionTimeMs: number;
}

// ============================================================
// Analysis Response Types (from AI)
// ============================================================

/**
 * Raw AI response for opportunity analysis
 */
export interface OpportunityAnalysisResponse {
  results: Array<{
    postIndex: number;
    relevanceScore: number;
    matchedKeywords: string[];
    isOpportunity: boolean;
    opportunityType: OpportunityType;
    reason: string;
  }>;
}

/**
 * Raw AI response for comment generation
 */
export interface CommentGenerationResponse {
  comment: string;
  tone: CommentTone;
  mentionsBrand: boolean;
  confidence: number;
  rationale: string;
}
