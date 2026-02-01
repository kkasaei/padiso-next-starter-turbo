import { z } from "zod";
import { eq, desc, sql, inArray } from "drizzle-orm";
import { prompts, brands, promptTags } from "@workspace/db/schema";
import { router, publicProcedure } from "../trpc";

export const promptsRouter = router({
  /**
   * Get all prompts for a workspace (across all brands in workspace)
   */
  getByWorkspace: publicProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      // First get all brands in this workspace
      const workspaceBrands = await ctx.db
        .select({ id: brands.id })
        .from(brands)
        .where(eq(brands.workspaceId, input.workspaceId));

      if (workspaceBrands.length === 0) {
        return [];
      }

      const brandIds = workspaceBrands.map((b) => b.id);

      // Then get all prompts for those brands
      return await ctx.db
        .select()
        .from(prompts)
        .where(inArray(prompts.brandId, brandIds))
        .orderBy(desc(prompts.createdAt));
    }),

  /**
   * Get all prompts for a brand
   */
  getByBrand: publicProcedure
    .input(
      z.object({
        brandId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(prompts)
        .where(eq(prompts.brandId, input.brandId))
        .orderBy(desc(prompts.createdAt));
    }),

  /**
   * Get a prompt by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [prompt] = await ctx.db
        .select()
        .from(prompts)
        .where(eq(prompts.id, input.id))
        .limit(1);

      if (!prompt) {
        throw new Error("Prompt not found");
      }

      return prompt;
    }),

  /**
   * Create a new prompt
   */
  create: publicProcedure
    .input(
      z.object({
        brandId: z.string().uuid(),
        name: z.string().min(1),
        prompt: z.string().min(1),
        aiProvider: z.enum(["claude", "openai", "perplexity", "gemini", "grok", "mistral", "llama"]).optional(),
        tagId: z.string().uuid().optional(),
        config: z.record(z.unknown()).optional(),
        createdByUserId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [prompt] = await ctx.db
        .insert(prompts)
        .values({
          brandId: input.brandId,
          name: input.name,
          prompt: input.prompt,
          aiProvider: input.aiProvider,
          tagId: input.tagId,
          config: input.config,
          createdByUserId: input.createdByUserId,
        })
        .returning();

      if (!prompt) {
        throw new Error("Failed to create prompt");
      }

      return prompt;
    }),

  /**
   * Update a prompt
   */
  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        prompt: z.string().min(1).optional(),
        aiProvider: z.enum(["claude", "openai", "perplexity", "gemini", "grok", "mistral", "llama"]).optional(),
        tagId: z.string().uuid().nullable().optional(),
        config: z.record(z.unknown()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;

      const [prompt] = await ctx.db
        .update(prompts)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(prompts.id, id))
        .returning();

      if (!prompt) {
        throw new Error("Prompt not found");
      }

      return prompt;
    }),

  /**
   * Increment usage count when a prompt is used
   */
  incrementUsage: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [prompt] = await ctx.db
        .update(prompts)
        .set({
          usageCount: sql`${prompts.usageCount} + 1`,
          lastUsedAt: new Date(),
        })
        .where(eq(prompts.id, input.id))
        .returning();

      if (!prompt) {
        throw new Error("Prompt not found");
      }

      return prompt;
    }),

  /**
   * Delete a prompt
   */
  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(prompts).where(eq(prompts.id, input.id));
      return { success: true };
    }),

  // ============================================================
  // PROMPT TAGS ENDPOINTS
  // ============================================================

  /**
   * Get all tags for a brand
   */
  getTags: publicProcedure
    .input(z.object({ brandId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(promptTags)
        .where(eq(promptTags.brandId, input.brandId))
        .orderBy(desc(promptTags.createdAt));
    }),

  /**
   * Create a new prompt tag
   */
  createTag: publicProcedure
    .input(
      z.object({
        brandId: z.string().uuid(),
        name: z.string().min(1),
        color: z.string().optional(),
        description: z.string().optional(),
        createdByUserId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [tag] = await ctx.db
        .insert(promptTags)
        .values({
          brandId: input.brandId,
          name: input.name,
          color: input.color,
          description: input.description,
          createdByUserId: input.createdByUserId,
        })
        .returning();

      if (!tag) {
        throw new Error("Failed to create tag");
      }

      return tag;
    }),

  /**
   * Update a prompt tag
   */
  updateTag: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        color: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;

      const [tag] = await ctx.db
        .update(promptTags)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(promptTags.id, id))
        .returning();

      if (!tag) {
        throw new Error("Tag not found");
      }

      return tag;
    }),

  /**
   * Delete a prompt tag
   */
  deleteTag: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Note: This will set tagId to null on prompts due to "set null" cascade
      await ctx.db.delete(promptTags).where(eq(promptTags.id, input.id));
      return { success: true };
    }),
});
