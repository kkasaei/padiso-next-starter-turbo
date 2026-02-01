import { z } from "zod";
import { eq, desc, sql, inArray } from "drizzle-orm";
import { prompts, brands } from "@workspace/db/schema";
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
        description: z.string().optional(),
        prompt: z.string().min(1),
        tags: z.array(z.string()).optional(),
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
          description: input.description,
          prompt: input.prompt,
          tags: input.tags || [],
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
        description: z.string().optional(),
        prompt: z.string().min(1).optional(),
        tags: z.array(z.string()).optional(),
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
});
