/**
 * Reddit Integration
 *
 * Client and types for interacting with the Reddit API
 */

export { RedditClient } from "./client";
export * from "./types";

// Re-export commonly used types
export type {
  RedditPost,
  RedditComment,
  RedditSubreddit,
  RedditSearchOptions,
  RedditSearchResult,
  RedditAuthConfig,
} from "./types";
