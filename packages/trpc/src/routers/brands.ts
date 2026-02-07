import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { brands, workspaces } from "@workspace/db/schema";
import { router, publicProcedure } from "../trpc";
import { analyzeBrandWebsite } from "@workspace/ai";

export const brandsRouter = router({
  /**
   * Get all brands for a workspace
   */
  getAll: publicProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(brands)
        .where(eq(brands.workspaceId, input.workspaceId))
        .orderBy(desc(brands.createdAt));
    }),

  /**
   * Get a brand by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [brand] = await ctx.db
        .select()
        .from(brands)
        .where(eq(brands.id, input.id))
        .limit(1);

      if (!brand) {
        throw new Error("Brand not found");
      }

      return brand;
    }),

  /**
   * Create a new brand
   */
  create: publicProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        brandName: z.string().min(1),
        websiteUrl: z.string().optional(),
        description: z.string().optional(),
        brandColor: z.string().optional(),
        languages: z.array(z.string()).optional(),
        targetAudiences: z.array(z.string()).optional(),
        businessKeywords: z.array(z.string()).optional(),
        competitors: z.array(z.string()).optional(),
        sitemapUrl: z.string().optional(),
        referralSource: z.enum(["facebook", "instagram", "google", "email", "reddit", "linkedin", "other"]).optional(),
        status: z.enum(["backlog", "planned", "active", "cancelled", "completed"]),
        createdByUserId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [brand] = await ctx.db
        .insert(brands)
        .values({
          workspaceId: input.workspaceId,
          brandName: input.brandName,
          websiteUrl: input.websiteUrl,
          description: input.description,
          brandColor: input.brandColor,
          languages: input.languages,
          targetAudiences: input.targetAudiences,
          businessKeywords: input.businessKeywords,
          competitors: input.competitors,
          sitemapUrl: input.sitemapUrl,
          referralSource: input.referralSource,
          status: input.status,
          createdByUserId: input.createdByUserId,
        })
        .returning();

      if (!brand) {
        throw new Error("Failed to create brand");
      }

      // Mark onboarding as completed when the first brand is created
      const existingBrands = await ctx.db
        .select()
        .from(brands)
        .where(eq(brands.workspaceId, input.workspaceId))
        .limit(2);

      if (existingBrands.length === 1) {
        await ctx.db
          .update(workspaces)
          .set({ hasCompletedOnboarding: true, updatedAt: new Date() })
          .where(eq(workspaces.id, input.workspaceId));
      }

      return brand;
    }),

  /**
   * Update a brand
   */
  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        brandName: z.string().min(1).optional(),
        websiteUrl: z.string().optional(),
        description: z.string().optional(),
        brandColor: z.string().optional(),
        status: z
          .enum(["backlog", "planned", "active", "cancelled", "completed"])
          .optional(),
        languages: z.array(z.string()).optional(),
        targetAudiences: z.array(z.string()).optional(),
        businessKeywords: z.array(z.string()).optional(),
        competitors: z.array(z.string()).optional(),
        sitemapUrl: z.string().optional(),
        iconUrl: z.string().optional().nullable(),
        isFavourite: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;

      const [brand] = await ctx.db
        .update(brands)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(brands.id, id))
        .returning();

      if (!brand) {
        throw new Error("Brand not found");
      }

      return brand;
    }),

  /**
   * Delete a brand
   */
  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(brands).where(eq(brands.id, input.id));
      return { success: true };
    }),

  /**
   * Check if a sitemap URL exists and is reachable
   */
  checkSitemap: publicProcedure
    .input(z.object({ url: z.string().min(1) }))
    .query(async ({ input }) => {
      let url = input.url;
      if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
      }

      try {
        const response = await fetch(url, {
          method: "HEAD",
          signal: AbortSignal.timeout(5000),
          headers: { "User-Agent": "SearchFit-SitemapChecker/1.0" },
          redirect: "follow",
        });

        return { exists: response.ok, status: response.status };
      } catch {
        return { exists: false, status: 0 };
      }
    }),

  /**
   * Analyze a website using AI to extract brand information
   */
  analyzeWebsite: publicProcedure
    .input(
      z.object({
        websiteUrl: z.string().min(1), // Allow URLs without protocol
        brandName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await analyzeBrandWebsite({
          websiteUrl: input.websiteUrl,
          brandName: input.brandName,
        });
        
        return result;
      } catch (error) {
        throw new Error(
          `Failed to analyze website: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }),
});
