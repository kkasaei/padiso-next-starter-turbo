/**
 * Reddit Opportunity Scanner
 *
 * Scans Reddit for posts that represent engagement opportunities for a brand.
 * Uses AI to analyze posts and determine relevance.
 */

import { generateText } from "ai";
import { gateway, DEFAULT_MODEL } from "../gateway";
import type {
  BrandContext,
  RedditOpportunity,
  RedditScanInput,
  RedditScanResult,
  OpportunityAnalysisResponse,
} from "./types";
import { getOpportunityAnalysisPrompt } from "./prompts";
import type { RedditPost, RedditClient } from "@workspace/integrations";

// ============================================================
// Configuration
// ============================================================

const MAX_POSTS_PER_BATCH = 10; // Process posts in batches for AI analysis
const DEFAULT_MIN_RELEVANCE = 50; // Minimum relevance score to be considered an opportunity

// ============================================================
// JSON Parsing Helper
// ============================================================

function safeJSONParse<T>(text: string, fallback: T | null = null): T | null {
  try {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;

    // Clean up common issues
    let cleaned = jsonText
      .replace(/,(\s*[}\]])/g, "$1") // Remove trailing commas
      .replace(/```/g, "") // Remove any remaining backticks
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return fallback;
  }
}

// ============================================================
// Opportunity Analysis
// ============================================================

/**
 * Analyze a batch of Reddit posts to find opportunities
 */
async function analyzePostBatch(
  brand: BrandContext,
  posts: RedditPost[],
  minRelevanceScore: number
): Promise<RedditOpportunity[]> {
  if (posts.length === 0) return [];

  const prompt = getOpportunityAnalysisPrompt(
    brand,
    posts.map((p) => ({
      title: p.title,
      body: p.selftext,
      subreddit: p.subreddit,
      score: p.score,
      numComments: p.num_comments,
    }))
  );

  try {
    const result = await generateText({
      model: gateway(DEFAULT_MODEL),
      prompt,
      temperature: 0.3,
    });

    const parsed = safeJSONParse<OpportunityAnalysisResponse>(result.text);

    if (!parsed || !parsed.results) {
      console.error("Failed to parse opportunity analysis response");
      return [];
    }

    // Filter and map to opportunities
    return parsed.results
      .filter((r) => r.isOpportunity && r.relevanceScore >= minRelevanceScore)
      .map((r) => {
        const post = posts[r.postIndex];
        if (!post) return null;

        return {
          postId: `t3_${post.id}`,
          postTitle: post.title,
          postUrl: `https://reddit.com${post.permalink}`,
          postBody: post.selftext || null,
          subreddit: post.subreddit,
          author: post.author,
          upvotes: post.score,
          commentCount: post.num_comments,
          postedAt: new Date(post.created_utc * 1000),
          relevanceScore: r.relevanceScore,
          matchedKeywords: r.matchedKeywords,
          opportunityType: r.opportunityType,
        };
      })
      .filter((opp): opp is RedditOpportunity => opp !== null);
  } catch (error) {
    console.error("Error analyzing post batch:", error);
    return [];
  }
}

// ============================================================
// Main Scanner Function
// ============================================================

/**
 * Scan Reddit for opportunities based on brand context and keywords
 */
export async function scanRedditOpportunities(
  redditClient: RedditClient,
  input: RedditScanInput
): Promise<RedditScanResult> {
  const startTime = Date.now();
  const { brandContext, keywords, subreddits = [], options = {} } = input;

  const {
    maxPostsPerKeyword = 10,
    timeRange = "week",
    minRelevanceScore = DEFAULT_MIN_RELEVANCE,
  } = options;

  console.log(`🔍 Starting Reddit scan for ${brandContext.brandName}`);
  console.log(`   Keywords: ${keywords.length}, Subreddits: ${subreddits.length || "all"}`);

  const allPosts: RedditPost[] = [];
  const seenPostIds = new Set<string>();

  // Search for each keyword
  for (const keyword of keywords) {
    try {
      const searchOptions = {
        sort: "relevance" as const,
        time: timeRange,
        limit: maxPostsPerKeyword,
      };

      let searchResult;

      if (subreddits.length > 0) {
        // Search within specific subreddits
        searchResult = await redditClient.searchMultipleSubreddits(
          keyword,
          subreddits,
          searchOptions
        );
      } else {
        // Search all of Reddit
        searchResult = await redditClient.searchPosts(keyword, searchOptions);
      }

      // Add unique posts
      for (const post of searchResult.posts) {
        if (!seenPostIds.has(post.id)) {
          seenPostIds.add(post.id);
          allPosts.push(post);
        }
      }
    } catch (error) {
      console.error(`Error searching for keyword "${keyword}":`, error);
    }
  }

  console.log(`   Found ${allPosts.length} unique posts`);

  // Analyze posts in batches
  const opportunities: RedditOpportunity[] = [];

  for (let i = 0; i < allPosts.length; i += MAX_POSTS_PER_BATCH) {
    const batch = allPosts.slice(i, i + MAX_POSTS_PER_BATCH);
    const batchOpportunities = await analyzePostBatch(
      brandContext,
      batch,
      minRelevanceScore
    );
    opportunities.push(...batchOpportunities);
  }

  // Sort by relevance score (highest first)
  opportunities.sort((a, b) => b.relevanceScore - a.relevanceScore);

  const executionTimeMs = Date.now() - startTime;
  console.log(`✅ Scan complete: ${opportunities.length} opportunities found in ${executionTimeMs}ms`);

  return {
    brandId: brandContext.brandId,
    scanDate: new Date(),
    opportunities,
    totalPostsScanned: allPosts.length,
    keywordsUsed: keywords,
    subredditsSearched: subreddits.length > 0 ? subreddits : ["all"],
    executionTimeMs,
  };
}

// ============================================================
// Single Post Analysis (for on-demand analysis)
// ============================================================

/**
 * Analyze a single post for opportunity
 */
export async function analyzePost(
  brand: BrandContext,
  post: RedditPost
): Promise<RedditOpportunity | null> {
  const opportunities = await analyzePostBatch(brand, [post], 0);
  return opportunities[0] || null;
}
