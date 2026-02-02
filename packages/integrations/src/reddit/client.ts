/**
 * Reddit API Client
 *
 * A client for interacting with the Reddit API using OAuth2 client credentials.
 * This client is designed for server-side use (reading public data).
 *
 * @see https://www.reddit.com/dev/api/
 */

import type {
  RedditAuthConfig,
  RedditPost,
  RedditComment,
  RedditSubreddit,
  RedditListingResponse,
  RedditSearchOptions,
  SubredditListOptions,
  RedditSearchResult,
  RedditPostWithComments,
} from "./types";

// ============================================================
// Constants
// ============================================================

const REDDIT_AUTH_URL = "https://www.reddit.com/api/v1/access_token";
const REDDIT_API_URL = "https://oauth.reddit.com";
const TOKEN_BUFFER_MS = 60000; // Refresh token 1 minute before expiry

// ============================================================
// Reddit Client
// ============================================================

export class RedditClient {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private config: RedditAuthConfig;

  constructor(config: RedditAuthConfig) {
    this.config = config;
  }

  // ============================================================
  // Authentication
  // ============================================================

  /**
   * Authenticate with Reddit using client credentials grant
   * This grants read-only access to public data
   */
  private async authenticate(): Promise<void> {
    // Return if token is still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return;
    }

    const auth = Buffer.from(
      `${this.config.clientId}:${this.config.clientSecret}`
    ).toString("base64");

    const response = await fetch(REDDIT_AUTH_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": this.config.userAgent,
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Reddit authentication failed: ${response.status} - ${error}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + data.expires_in * 1000 - TOKEN_BUFFER_MS;
  }

  /**
   * Make an authenticated request to the Reddit API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    await this.authenticate();

    const url = endpoint.startsWith("http")
      ? endpoint
      : `${REDDIT_API_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "User-Agent": this.config.userAgent,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Reddit API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // ============================================================
  // Search Methods
  // ============================================================

  /**
   * Search Reddit for posts matching a query
   */
  async searchPosts(
    query: string,
    options: RedditSearchOptions = {}
  ): Promise<RedditSearchResult> {
    const params = new URLSearchParams({
      q: query,
      sort: options.sort || "relevance",
      t: options.time || "week",
      limit: String(options.limit || 25),
      restrict_sr: String(options.restrictSr ?? !!options.subreddit),
      include_over_18: String(options.includeOver18 ?? false),
      raw_json: "1",
    });

    if (options.after) params.append("after", options.after);
    if (options.before) params.append("before", options.before);

    const endpoint = options.subreddit
      ? `/r/${options.subreddit}/search.json?${params}`
      : `/search.json?${params}`;

    const data = await this.request<RedditListingResponse<RedditPost>>(endpoint);

    return {
      posts: data.data.children.map((child) => child.data),
      after: data.data.after,
      before: data.data.before,
    };
  }

  /**
   * Search for posts mentioning specific keywords across multiple subreddits
   */
  async searchMultipleSubreddits(
    query: string,
    subreddits: string[],
    options: Omit<RedditSearchOptions, "subreddit"> = {}
  ): Promise<RedditSearchResult> {
    // Reddit supports searching multiple subreddits with +
    const multiSubreddit = subreddits.join("+");

    return this.searchPosts(query, {
      ...options,
      subreddit: multiSubreddit,
      restrictSr: true,
    });
  }

  // ============================================================
  // Subreddit Methods
  // ============================================================

  /**
   * Get posts from a subreddit
   */
  async getSubredditPosts(
    subreddit: string,
    options: SubredditListOptions = {}
  ): Promise<RedditSearchResult> {
    const params = new URLSearchParams({
      limit: String(options.limit || 25),
      raw_json: "1",
    });

    if (options.time && (options.sort === "top" || options.sort === "controversial")) {
      params.append("t", options.time);
    }
    if (options.after) params.append("after", options.after);
    if (options.before) params.append("before", options.before);

    const sort = options.sort || "hot";
    const data = await this.request<RedditListingResponse<RedditPost>>(
      `/r/${subreddit}/${sort}.json?${params}`
    );

    return {
      posts: data.data.children.map((child) => child.data),
      after: data.data.after,
      before: data.data.before,
    };
  }

  /**
   * Get information about a subreddit
   */
  async getSubredditInfo(subreddit: string): Promise<RedditSubreddit> {
    const data = await this.request<{ kind: string; data: RedditSubreddit }>(
      `/r/${subreddit}/about.json?raw_json=1`
    );
    return data.data;
  }

  /**
   * Search for subreddits by name
   */
  async searchSubreddits(
    query: string,
    options: { limit?: number; includeOver18?: boolean } = {}
  ): Promise<RedditSubreddit[]> {
    const params = new URLSearchParams({
      query,
      limit: String(options.limit || 10),
      include_over_18: String(options.includeOver18 ?? false),
      raw_json: "1",
    });

    const data = await this.request<{ subreddits: RedditSubreddit[] }>(
      `/api/search_subreddits?${params}`,
      { method: "POST" }
    );

    return data.subreddits || [];
  }

  // ============================================================
  // Post Methods
  // ============================================================

  /**
   * Get a specific post by ID
   */
  async getPost(postId: string, subreddit?: string): Promise<RedditPost> {
    // Remove t3_ prefix if present
    const id = postId.replace(/^t3_/, "");

    const endpoint = subreddit
      ? `/r/${subreddit}/comments/${id}.json?raw_json=1`
      : `/comments/${id}.json?raw_json=1`;

    const data = await this.request<[RedditListingResponse<RedditPost>, RedditListingResponse<RedditComment>]>(
      endpoint
    );

    return data[0].data.children[0].data;
  }

  /**
   * Get a post with its comments
   */
  async getPostWithComments(
    postId: string,
    options: { subreddit?: string; sort?: "confidence" | "top" | "new" | "controversial" | "old" | "qa"; limit?: number } = {}
  ): Promise<RedditPostWithComments> {
    // Remove t3_ prefix if present
    const id = postId.replace(/^t3_/, "");

    const params = new URLSearchParams({
      sort: options.sort || "confidence",
      limit: String(options.limit || 100),
      raw_json: "1",
    });

    const endpoint = options.subreddit
      ? `/r/${options.subreddit}/comments/${id}.json?${params}`
      : `/comments/${id}.json?${params}`;

    const data = await this.request<[RedditListingResponse<RedditPost>, RedditListingResponse<RedditComment>]>(
      endpoint
    );

    const flattenComments = (
      listing: RedditListingResponse<RedditComment>
    ): RedditComment[] => {
      const comments: RedditComment[] = [];

      for (const child of listing.data.children) {
        if (child.kind === "t1") {
          comments.push(child.data);

          // Recursively flatten replies
          if (child.data.replies && typeof child.data.replies !== "string") {
            comments.push(...flattenComments(child.data.replies));
          }
        }
      }

      return comments;
    };

    return {
      post: data[0].data.children[0].data,
      comments: flattenComments(data[1]),
    };
  }

  // ============================================================
  // Utility Methods
  // ============================================================

  /**
   * Check if the client can authenticate successfully
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.authenticate();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get the full Reddit URL for a post
   */
  static getPostUrl(post: RedditPost): string {
    return `https://reddit.com${post.permalink}`;
  }

  /**
   * Get the full Reddit URL for a subreddit
   */
  static getSubredditUrl(subreddit: string): string {
    return `https://reddit.com/r/${subreddit}`;
  }

  /**
   * Parse a Reddit post ID from various formats
   * Handles: "abc123", "t3_abc123", "https://reddit.com/r/sub/comments/abc123/..."
   */
  static parsePostId(input: string): string | null {
    // Already a clean ID
    if (/^[a-z0-9]+$/i.test(input)) {
      return input;
    }

    // t3_ prefixed
    if (input.startsWith("t3_")) {
      return input.slice(3);
    }

    // URL format
    const urlMatch = input.match(/\/comments\/([a-z0-9]+)/i);
    if (urlMatch) {
      return urlMatch[1];
    }

    return null;
  }
}
