import { z } from "zod";
import { eq, inArray } from "drizzle-orm";
import { taskTags, brands } from "@workspace/db/schema";
import { router, publicProcedure } from "../trpc";

export const taskTagsRouter = router({
  /**
   * Get all task tags for a workspace (across all brands)
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

      // Then get all tags for those brands
      return await ctx.db
        .select()
        .from(taskTags)
        .where(inArray(taskTags.brandId, brandIds));
    }),

  /**
   * Get all task tags for a brand
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
        .from(taskTags)
        .where(eq(taskTags.brandId, input.brandId));
    }),

  /**
   * Create a new task tag
   */
  create: publicProcedure
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
        .insert(taskTags)
        .values({
          brandId: input.brandId,
          name: input.name,
          color: input.color,
          description: input.description,
          createdByUserId: input.createdByUserId,
        })
        .returning();

      if (!tag) {
        throw new Error("Failed to create task tag");
      }

      return tag;
    }),

  /**
   * Update a task tag
   */
  update: publicProcedure
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
        .update(taskTags)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(taskTags.id, id))
        .returning();

      if (!tag) {
        throw new Error("Task tag not found");
      }

      return tag;
    }),

  /**
   * Delete a task tag
   */
  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(taskTags).where(eq(taskTags.id, input.id));
      return { success: true };
    }),
});
