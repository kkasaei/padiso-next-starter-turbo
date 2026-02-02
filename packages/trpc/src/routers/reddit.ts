/**
 * Reddit tRPC Router
 *
 * API routes for the Reddit social listening agent
 */

import { z } from "zod";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  brands,
  redditKeywords,
  redditOpportunities,
  redditAgentSettings,
} from "@workspace/db/schema";
import { router, publicProcedure } from "../trpc";
import {
  RedditClient,
  type RedditAuthConfig,
} from "@workspace/integrations";
import {
  scanRedditOpportunities,
  generateRedditComment,
  type BrandContext,
} from "@workspace/ai";

// ============================================================
// Helper: Create Reddit Client
// ============================================================

function createRedditClient(): RedditClient {
  const config: RedditAuthConfig = {
    clientId: process.env.INTEGRATION_REDDIT_CLIENT_ID || "",
    clientSecret: process.env.INTEGRATION_REDDIT_CLIENT_SECRET || "",
    userAgent: "SearchFit/1.0 (Social Listening Tool)",
  };

  if (!config.clientId || !config.clientSecret) {
    throw new Error("Reddit API credentials not configured");
  }

  return new RedditClient(config);
}

// ============================================================
// Helper: Get Brand Context
// ============================================================

function toBrandContext(brand: typeof brands.$inferSelect): BrandContext {
  return {
    brandId: brand.id,
    brandName: brand.brandName || "",
    description: brand.description || "",
    websiteUrl: brand.websiteUrl || "",
    languages: brand.languages || [],
    targetAudiences: brand.targetAudiences || [],
    businessKeywords: brand.businessKeywords || [],
    competitors: brand.competitors || [],
  };
}

// ============================================================
// Router
// ============================================================

export const redditRouter = router({
  // ============================================================
  // Opportunities
  // ============================================================

  /**
   * Get opportunities for a brand
   */
  getOpportunities: publicProcedure
    .input(
      z.object({
        brandId: z.string().uuid(),
        status: z
          .enum(["pending", "completed", "dismissed", "expired"])
          .optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(redditOpportunities.brandId, input.brandId)];

      if (input.status) {
        conditions.push(eq(redditOpportunities.status, input.status));
      }

      const opportunities = await ctx.db
        .select()
        .from(redditOpportunities)
        .where(and(...conditions))
        .orderBy(desc(redditOpportunities.relevanceScore))
        .limit(input.limit)
        .offset(input.offset);

      // Get total count
      const [{ count }] = await ctx.db
        .select({ count: sql<number>`count(*)::int` })
        .from(redditOpportunities)
        .where(and(...conditions));

      return {
        opportunities,
        total: count,
        hasMore: input.offset + opportunities.length < count,
      };
    }),

  /**
   * Get a single opportunity by ID
   */
  getOpportunity: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [opportunity] = await ctx.db
        .select()
        .from(redditOpportunities)
        .where(eq(redditOpportunities.id, input.id))
        .limit(1);

      if (!opportunity) {
        throw new Error("Opportunity not found");
      }

      return opportunity;
    }),

  /**
   * Generate a comment for an opportunity
   */
  generateComment: publicProcedure
    .input(z.object({ opportunityId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Get the opportunity
      const [opportunity] = await ctx.db
        .select()
        .from(redditOpportunities)
        .where(eq(redditOpportunities.id, input.opportunityId))
        .limit(1);

      if (!opportunity) {
        throw new Error("Opportunity not found");
      }

      // Get the brand
      const [brand] = await ctx.db
        .select()
        .from(brands)
        .where(eq(brands.id, opportunity.brandId))
        .limit(1);

      if (!brand) {
        throw new Error("Brand not found");
      }

      // Generate the comment
      const generated = await generateRedditComment(toBrandContext(brand), {
        postId: opportunity.postId,
        postTitle: opportunity.postTitle,
        postUrl: opportunity.postUrl,
        postBody: opportunity.postBody,
        subreddit: opportunity.subreddit,
        author: opportunity.author || "",
        upvotes: opportunity.upvotes || 0,
        commentCount: opportunity.commentCount || 0,
        postedAt: opportunity.postedAt || new Date(),
        relevanceScore: opportunity.relevanceScore || 0,
        matchedKeywords: (opportunity.matchedKeywords as string[]) || [],
        opportunityType: (opportunity.opportunityType as any) || "other",
      });

      // Update the opportunity with the generated comment
      await ctx.db
        .update(redditOpportunities)
        .set({
          suggestedComment: generated.comment,
          commentTone: generated.tone,
          commentConfidence: generated.confidence,
          commentGeneratedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(redditOpportunities.id, input.opportunityId));

      return generated;
    }),

  /**
   * Update opportunity status (complete, dismiss)
   */
  updateOpportunityStatus: publicProcedure
    .input(
      z.object({
        opportunityId: z.string().uuid(),
        status: z.enum(["completed", "dismissed"]),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updates: Record<string, any> = {
        status: input.status,
        updatedAt: new Date(),
      };

      if (input.status === "completed") {
        updates.completedAt = new Date();
      } else if (input.status === "dismissed") {
        updates.dismissedAt = new Date();
        updates.dismissReason = input.reason;
      }

      const [updated] = await ctx.db
        .update(redditOpportunities)
        .set(updates)
        .where(eq(redditOpportunities.id, input.opportunityId))
        .returning();

      return updated;
    }),

  // ============================================================
  // Keywords
  // ============================================================

  /**
   * Get keywords for a brand
   */
  getKeywords: publicProcedure
    .input(z.object({ brandId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(redditKeywords)
        .where(eq(redditKeywords.brandId, input.brandId))
        .orderBy(desc(redditKeywords.createdAt));
    }),

  /**
   * Add a keyword
   */
  addKeyword: publicProcedure
    .input(
      z.object({
        brandId: z.string().uuid(),
        keyword: z.string().min(2).max(100),
        subreddits: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [keyword] = await ctx.db
        .insert(redditKeywords)
        .values({
          brandId: input.brandId,
          keyword: input.keyword,
          subreddits: input.subreddits,
        })
        .returning();

      return keyword;
    }),

  /**
   * Update a keyword
   */
  updateKeyword: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        keyword: z.string().min(2).max(100).optional(),
        subreddits: z.array(z.string()).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;

      const [keyword] = await ctx.db
        .update(redditKeywords)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(redditKeywords.id, id))
        .returning();

      return keyword;
    }),

  /**
   * Delete a keyword
   */
  deleteKeyword: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(redditKeywords)
        .where(eq(redditKeywords.id, input.id));

      return { success: true };
    }),

  // ============================================================
  // Agent Settings
  // ============================================================

  /**
   * Get agent settings for a brand
   */
  getSettings: publicProcedure
    .input(z.object({ brandId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [settings] = await ctx.db
        .select()
        .from(redditAgentSettings)
        .where(eq(redditAgentSettings.brandId, input.brandId))
        .limit(1);

      // Return default settings if none exist
      if (!settings) {
        return {
          brandId: input.brandId,
          isEnabled: true,
          scanFrequencyHours: 6,
          maxKeywords: 5,
          minRelevanceScore: 50,
          defaultSubreddits: null,
          excludedSubreddits: null,
          autoGenerateComments: true,
          preferredTone: "helpful",
          includeBrandMention: true,
          emailNotifications: false,
          slackNotifications: false,
          slackWebhookUrl: null,
          totalScans: 0,
          totalOpportunities: 0,
          totalCommentsGenerated: 0,
          lastScanAt: null,
          nextScanAt: null,
        };
      }

      return settings;
    }),

  /**
   * Update agent settings
   */
  updateSettings: publicProcedure
    .input(
      z.object({
        brandId: z.string().uuid(),
        isEnabled: z.boolean().optional(),
        scanFrequencyHours: z.number().min(1).max(168).optional(),
        maxKeywords: z.number().min(1).max(20).optional(),
        minRelevanceScore: z.number().min(0).max(100).optional(),
        defaultSubreddits: z.array(z.string()).optional(),
        excludedSubreddits: z.array(z.string()).optional(),
        autoGenerateComments: z.boolean().optional(),
        preferredTone: z.string().optional(),
        includeBrandMention: z.boolean().optional(),
        emailNotifications: z.boolean().optional(),
        slackNotifications: z.boolean().optional(),
        slackWebhookUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { brandId, ...updates } = input;

      // Check if settings exist
      const [existing] = await ctx.db
        .select()
        .from(redditAgentSettings)
        .where(eq(redditAgentSettings.brandId, brandId))
        .limit(1);

      if (existing) {
        // Update existing
        const [settings] = await ctx.db
          .update(redditAgentSettings)
          .set({
            ...updates,
            updatedAt: new Date(),
          })
          .where(eq(redditAgentSettings.brandId, brandId))
          .returning();

        return settings;
      } else {
        // Create new
        const [settings] = await ctx.db
          .insert(redditAgentSettings)
          .values({
            brandId,
            ...updates,
          })
          .returning();

        return settings;
      }
    }),

  // ============================================================
  // Scanning
  // ============================================================

  /**
   * Trigger a manual scan for a brand
   */
  triggerScan: publicProcedure
    .input(z.object({ brandId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Get the brand
      const [brand] = await ctx.db
        .select()
        .from(brands)
        .where(eq(brands.id, input.brandId))
        .limit(1);

      if (!brand) {
        throw new Error("Brand not found");
      }

      // Get keywords
      const keywords = await ctx.db
        .select()
        .from(redditKeywords)
        .where(
          and(
            eq(redditKeywords.brandId, input.brandId),
            eq(redditKeywords.isActive, true)
          )
        );

      if (keywords.length === 0) {
        throw new Error("No active keywords to scan");
      }

      // Get settings for subreddit configuration
      const [settings] = await ctx.db
        .select()
        .from(redditAgentSettings)
        .where(eq(redditAgentSettings.brandId, input.brandId))
        .limit(1);

      // Create Reddit client and scan
      const client = createRedditClient();

      const result = await scanRedditOpportunities(client, {
        brandContext: toBrandContext(brand),
        keywords: keywords.map((k) => k.keyword),
        subreddits: (settings?.defaultSubreddits as string[]) || undefined,
        options: {
          maxPostsPerKeyword: 10,
          timeRange: "week",
          minRelevanceScore: settings?.minRelevanceScore || 50,
        },
      });

      // Save opportunities (skip duplicates)
      let newCount = 0;
      for (const opp of result.opportunities) {
        try {
          await ctx.db.insert(redditOpportunities).values({
            brandId: input.brandId,
            postId: opp.postId,
            postTitle: opp.postTitle,
            postUrl: opp.postUrl,
            postBody: opp.postBody,
            subreddit: opp.subreddit,
            author: opp.author,
            upvotes: opp.upvotes,
            commentCount: opp.commentCount,
            postedAt: opp.postedAt,
            relevanceScore: opp.relevanceScore,
            matchedKeywords: opp.matchedKeywords,
            opportunityType: opp.opportunityType,
          });
          newCount++;
        } catch (error) {
          // Likely duplicate, skip
          console.log(`Skipping duplicate post: ${opp.postId}`);
        }
      }

      // Update settings stats
      if (settings) {
        await ctx.db
          .update(redditAgentSettings)
          .set({
            totalScans: sql`${redditAgentSettings.totalScans} + 1`,
            totalOpportunities: sql`${redditAgentSettings.totalOpportunities} + ${newCount}`,
            lastScanAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(redditAgentSettings.brandId, input.brandId));
      }

      return {
        scanned: result.totalPostsScanned,
        found: result.opportunities.length,
        saved: newCount,
        executionTimeMs: result.executionTimeMs,
      };
    }),

  // ============================================================
  // Stats
  // ============================================================

  /**
   * Get stats for the Reddit agent
   */
  getStats: publicProcedure
    .input(z.object({ brandId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      // Count opportunities by status
      const opportunityCounts = await ctx.db
        .select({
          status: redditOpportunities.status,
          count: sql<number>`count(*)::int`,
        })
        .from(redditOpportunities)
        .where(eq(redditOpportunities.brandId, input.brandId))
        .groupBy(redditOpportunities.status);

      // Count keywords
      const [keywordCount] = await ctx.db
        .select({ count: sql<number>`count(*)::int` })
        .from(redditKeywords)
        .where(eq(redditKeywords.brandId, input.brandId));

      // Get total search volume estimate (placeholder - could be calculated from upvotes/comments)
      const [volumeStats] = await ctx.db
        .select({
          totalUpvotes: sql<number>`coalesce(sum(${redditOpportunities.upvotes}), 0)::int`,
          totalComments: sql<number>`coalesce(sum(${redditOpportunities.commentCount}), 0)::int`,
        })
        .from(redditOpportunities)
        .where(eq(redditOpportunities.brandId, input.brandId));

      // Map counts to object
      const statusCounts = opportunityCounts.reduce(
        (acc, { status, count }) => {
          acc[status] = count;
          return acc;
        },
        {} as Record<string, number>
      );

      return {
        totalOpportunities:
          (statusCounts.pending || 0) +
          (statusCounts.completed || 0) +
          (statusCounts.dismissed || 0) +
          (statusCounts.expired || 0),
        pendingOpportunities: statusCounts.pending || 0,
        completedOpportunities: statusCounts.completed || 0,
        dismissedOpportunities: statusCounts.dismissed || 0,
        monitoredKeywords: keywordCount?.count || 0,
        searchVolume: volumeStats?.totalUpvotes || 0,
        totalComments: volumeStats?.totalComments || 0,
      };
    }),

  // ============================================================
  // Reddit API Direct Access (for UI features)
  // ============================================================

  /**
   * Search subreddits (for autocomplete)
   */
  searchSubreddits: publicProcedure
    .input(
      z.object({
        query: z.string().min(2),
        limit: z.number().min(1).max(25).default(10),
      })
    )
    .query(async ({ input }) => {
      const client = createRedditClient();
      return await client.searchSubreddits(input.query, { limit: input.limit });
    }),

  /**
   * Test Reddit connection
   */
  testConnection: publicProcedure.query(async () => {
    try {
      const client = createRedditClient();
      const success = await client.testConnection();
      return { success, message: success ? "Connected" : "Failed to connect" };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }),
});
