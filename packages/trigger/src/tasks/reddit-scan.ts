import { task, schedules } from "@trigger.dev/sdk";

/**
 * Reddit Scan Task
 *
 * Scans Reddit for opportunities based on brand keywords.
 * Can be triggered manually or on a schedule.
 */
export const redditScanTask = task({
  id: "reddit-scan",
  // Use a larger machine for AI processing
  machine: "medium-1x",
  // Allow up to 5 minutes for scanning + AI analysis
  maxDuration: 300,
  retry: {
    maxAttempts: 2,
  },
  run: async (payload: { brandId: string }) => {
    // Dynamic imports to avoid bundling issues
    const { drizzle } = await import("drizzle-orm/postgres-js");
    const postgres = await import("postgres");
    const { eq, and } = await import("drizzle-orm");
    const { sql } = await import("drizzle-orm");

    // Import schema
    const {
      brands,
      redditKeywords,
      redditOpportunities,
      redditAgentSettings,
    } = await import("@workspace/db/schema");

    // Import Reddit client and AI scanner
    // Import directly from reddit submodule to avoid SVG bundling issues
    const { RedditClient } = await import("@workspace/integrations/reddit");
    const { scanRedditOpportunities } = await import("@workspace/ai");

    console.log(`🔍 Starting Reddit scan for brand: ${payload.brandId}`);

    // Create database connection
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL not configured");
    }

    const client = postgres.default(connectionString);
    const db = drizzle(client);

    try {
      // Get the brand
      const [brand] = await db
        .select()
        .from(brands)
        .where(eq(brands.id, payload.brandId))
        .limit(1);

      if (!brand) {
        throw new Error(`Brand not found: ${payload.brandId}`);
      }

      // Get active keywords
      const keywords = await db
        .select()
        .from(redditKeywords)
        .where(
          and(
            eq(redditKeywords.brandId, payload.brandId),
            eq(redditKeywords.isActive, true)
          )
        );

      if (keywords.length === 0) {
        console.log("No active keywords to scan");
        return { scanned: 0, found: 0, saved: 0 };
      }

      // Get settings
      const [settings] = await db
        .select()
        .from(redditAgentSettings)
        .where(eq(redditAgentSettings.brandId, payload.brandId))
        .limit(1);

      // Create Reddit client
      const redditClientId = process.env.INTEGRATION_REDDIT_CLIENT_ID;
      const redditClientSecret = process.env.INTEGRATION_REDDIT_CLIENT_SECRET;

      if (!redditClientId || !redditClientSecret) {
        throw new Error("Reddit API credentials not configured");
      }

      const redditClient = new RedditClient({
        clientId: redditClientId,
        clientSecret: redditClientSecret,
        userAgent: "SearchFit/1.0 (Social Listening Tool)",
      });

      // Build brand context
      const brandContext = {
        brandId: brand.id,
        brandName: brand.brandName || "",
        description: brand.description || "",
        websiteUrl: brand.websiteUrl || "",
        languages: brand.languages || [],
        targetAudiences: brand.targetAudiences || [],
        businessKeywords: brand.businessKeywords || [],
        competitors: brand.competitors || [],
      };

      // Run the scan
      const result = await scanRedditOpportunities(redditClient, {
        brandContext,
        keywords: keywords.map((k) => k.keyword),
        subreddits: (settings?.defaultSubreddits as string[]) || undefined,
        options: {
          maxPostsPerKeyword: 10,
          timeRange: "week",
          minRelevanceScore: settings?.minRelevanceScore || 50,
        },
      });

      // Save opportunities (skip duplicates)
      let savedCount = 0;
      for (const opp of result.opportunities) {
        try {
          await db.insert(redditOpportunities).values({
            brandId: payload.brandId,
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
          savedCount++;
        } catch (error) {
          // Likely duplicate, skip
          console.log(`Skipping duplicate post: ${opp.postId}`);
        }
      }

      // Update settings stats
      if (settings) {
        await db
          .update(redditAgentSettings)
          .set({
            totalScans: sql`${redditAgentSettings.totalScans} + 1`,
            totalOpportunities: sql`${redditAgentSettings.totalOpportunities} + ${savedCount}`,
            lastScanAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(redditAgentSettings.brandId, payload.brandId));
      }

      // Update keyword stats
      for (const keyword of keywords) {
        const matchingOpps = result.opportunities.filter((o) =>
          o.matchedKeywords.some((k) =>
            k.toLowerCase().includes(keyword.keyword.toLowerCase())
          )
        );

        if (matchingOpps.length > 0) {
          await db
            .update(redditKeywords)
            .set({
              totalOpportunities: sql`${redditKeywords.totalOpportunities} + ${matchingOpps.length}`,
              lastScanAt: new Date(),
              lastOpportunityAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(redditKeywords.id, keyword.id));
        } else {
          await db
            .update(redditKeywords)
            .set({
              lastScanAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(redditKeywords.id, keyword.id));
        }
      }

      console.log(
        `✅ Scan complete: ${result.totalPostsScanned} posts scanned, ${result.opportunities.length} opportunities found, ${savedCount} saved`
      );

      return {
        scanned: result.totalPostsScanned,
        found: result.opportunities.length,
        saved: savedCount,
        executionTimeMs: result.executionTimeMs,
      };
    } finally {
      // Close the database connection
      await client.end();
    }
  },
});

/**
 * Scheduled Reddit Scan
 *
 * Runs every 6 hours to scan all active brands for Reddit opportunities.
 * The schedule can be configured per-brand in settings.
 */
export const scheduledRedditScan = schedules.task({
  id: "scheduled-reddit-scan",
  // Run every 6 hours
  cron: "0 */6 * * *",
  machine: "small-1x",
  maxDuration: 60,
  run: async () => {
    // Dynamic imports
    const { drizzle } = await import("drizzle-orm/postgres-js");
    const postgres = await import("postgres");
    const { eq, and, lte, or, isNull } = await import("drizzle-orm");

    const { redditAgentSettings, brands } = await import("@workspace/db/schema");

    console.log("🕐 Running scheduled Reddit scan for all active brands");

    // Create database connection
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL not configured");
    }

    const client = postgres.default(connectionString);
    const db = drizzle(client);

    try {
      // Get all brands with active Reddit agent that are due for a scan
      const now = new Date();

      // Get all active settings
      const activeSettings = await db
        .select({
          brandId: redditAgentSettings.brandId,
          scanFrequencyHours: redditAgentSettings.scanFrequencyHours,
          lastScanAt: redditAgentSettings.lastScanAt,
        })
        .from(redditAgentSettings)
        .where(eq(redditAgentSettings.isEnabled, true));

      // Filter brands that are due for scanning
      const brandsToScan = activeSettings.filter((s) => {
        if (!s.lastScanAt) return true; // Never scanned
        const hoursSinceLastScan =
          (now.getTime() - new Date(s.lastScanAt).getTime()) / (1000 * 60 * 60);
        return hoursSinceLastScan >= s.scanFrequencyHours;
      });

      console.log(`Found ${brandsToScan.length} brands due for scanning`);

      // Trigger individual scans
      const results = [];
      for (const brand of brandsToScan) {
        try {
          // Trigger the scan task for each brand
          const handle = await redditScanTask.trigger({
            brandId: brand.brandId,
          });
          results.push({ brandId: brand.brandId, triggered: true, handle: handle.id });
          console.log(`Triggered scan for brand: ${brand.brandId}`);
        } catch (error) {
          console.error(`Failed to trigger scan for brand ${brand.brandId}:`, error);
          results.push({ brandId: brand.brandId, triggered: false, error: String(error) });
        }
      }

      return {
        brandsChecked: activeSettings.length,
        brandsTriggered: brandsToScan.length,
        results,
      };
    } finally {
      await client.end();
    }
  },
});

/**
 * Manual trigger helper - can be called from the API
 */
export async function triggerRedditScan(brandId: string) {
  return await redditScanTask.trigger({ brandId });
}
