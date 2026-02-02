/**
 * Reddit Agent
 *
 * AI-powered Reddit social listening and engagement tool.
 * Helps brands find opportunities and generate authentic comments.
 */

// Types
export * from "./types";

// Scanner
export {
  scanRedditOpportunities,
  analyzePost,
} from "./scanner";

// Comment Generator
export {
  generateRedditComment,
  generateCommentVariations,
  formatForReddit,
  validateComment,
  getTemplateComment,
} from "./comment-generator";

// Prompts (exported for testing/customization)
export {
  getOpportunityAnalysisPrompt,
  getCommentGenerationPrompt,
  getSubredditDiscoveryPrompt,
  getKeywordSuggestionPrompt,
} from "./prompts";
