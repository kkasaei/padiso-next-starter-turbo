/**
 * Reddit API Types
 *
 * Type definitions for Reddit API responses and client configuration
 */

// ============================================================
// Configuration Types
// ============================================================

export interface RedditAuthConfig {
  clientId: string;
  clientSecret: string;
  userAgent: string;
}

// ============================================================
// Reddit API Response Types
// ============================================================

export interface RedditPost {
  id: string;
  name: string; // Fullname (e.g., "t3_abc123")
  title: string;
  selftext: string;
  selftext_html: string | null;
  subreddit: string;
  subreddit_id: string;
  subreddit_name_prefixed: string;
  author: string;
  author_fullname?: string;
  url: string;
  permalink: string;
  score: number;
  upvote_ratio: number;
  num_comments: number;
  created: number;
  created_utc: number;
  is_self: boolean;
  is_video: boolean;
  over_18: boolean;
  spoiler: boolean;
  stickied: boolean;
  locked: boolean;
  archived: boolean;
  link_flair_text: string | null;
  link_flair_css_class: string | null;
  distinguished: string | null;
  domain: string;
  thumbnail: string;
}

export interface RedditComment {
  id: string;
  name: string; // Fullname (e.g., "t1_abc123")
  body: string;
  body_html: string;
  author: string;
  author_fullname?: string;
  subreddit: string;
  subreddit_id: string;
  link_id: string; // Parent post fullname
  parent_id: string; // Parent comment or post fullname
  score: number;
  created_utc: number;
  edited: boolean | number;
  is_submitter: boolean;
  stickied: boolean;
  distinguished: string | null;
  depth: number;
  replies?: RedditListingResponse<RedditComment> | string;
}

export interface RedditSubreddit {
  id: string;
  name: string;
  display_name: string;
  display_name_prefixed: string;
  title: string;
  public_description: string;
  description: string;
  subscribers: number;
  active_user_count: number;
  created_utc: number;
  over18: boolean;
  url: string;
  icon_img: string;
  banner_img: string;
  subreddit_type: "public" | "private" | "restricted" | "gold_restricted" | "archived";
}

// ============================================================
// Reddit API Listing Types
// ============================================================

export interface RedditListingChild<T> {
  kind: string;
  data: T;
}

export interface RedditListingData<T> {
  after: string | null;
  before: string | null;
  dist: number | null;
  modhash: string;
  geo_filter: string | null;
  children: RedditListingChild<T>[];
}

export interface RedditListingResponse<T> {
  kind: "Listing";
  data: RedditListingData<T>;
}

// ============================================================
// Search Options
// ============================================================

export interface RedditSearchOptions {
  subreddit?: string;
  sort?: "relevance" | "hot" | "top" | "new" | "comments";
  time?: "hour" | "day" | "week" | "month" | "year" | "all";
  limit?: number;
  after?: string;
  before?: string;
  restrictSr?: boolean;
  includeOver18?: boolean;
}

export interface SubredditListOptions {
  sort?: "hot" | "new" | "top" | "rising" | "controversial";
  time?: "hour" | "day" | "week" | "month" | "year" | "all";
  limit?: number;
  after?: string;
  before?: string;
}

// ============================================================
// Client Response Types
// ============================================================

export interface RedditSearchResult {
  posts: RedditPost[];
  after: string | null;
  before: string | null;
}

export interface RedditPostWithComments {
  post: RedditPost;
  comments: RedditComment[];
}
