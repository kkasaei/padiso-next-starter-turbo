import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { tasks } from "@workspace/db/schema";
import { router, publicProcedure } from "../trpc";

export const tasksRouter = router({
  /**
   * Get all tasks for a brand
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
        .from(tasks)
        .where(eq(tasks.brandId, input.brandId))
        .orderBy(desc(tasks.createdAt));
    }),

  /**
   * Get a task by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [task] = await ctx.db
        .select()
        .from(tasks)
        .where(eq(tasks.id, input.id))
        .limit(1);

      if (!task) {
        throw new Error("Task not found");
      }

      return task;
    }),

  /**
   * Create a new task
   */
  create: publicProcedure
    .input(
      z.object({
        brandId: z.string().uuid(),
        name: z.string().min(1),
        description: z.string().optional(),
        status: z.enum(["todo", "in-progress", "done"]),
        priority: z.enum(["no-priority", "low", "medium", "high", "urgent"]).optional(),
        tag: z.string().optional(),
        assigneeId: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [task] = await ctx.db
        .insert(tasks)
        .values({
          brandId: input.brandId,
          name: input.name,
          description: input.description,
          status: input.status,
          priority: input.priority,
          tag: input.tag,
          assigneeId: input.assigneeId,
          startDate: input.startDate,
          endDate: input.endDate,
        })
        .returning();

      if (!task) {
        throw new Error("Failed to create task");
      }

      return task;
    }),

  /**
   * Update a task
   */
  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        status: z.enum(["todo", "in-progress", "done"]).optional(),
        priority: z.enum(["no-priority", "low", "medium", "high", "urgent"]).optional(),
        tag: z.string().optional(),
        assigneeId: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;

      const [task] = await ctx.db
        .update(tasks)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(tasks.id, id))
        .returning();

      if (!task) {
        throw new Error("Task not found");
      }

      return task;
    }),

  /**
   * Delete a task
   */
  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(tasks).where(eq(tasks.id, input.id));
      return { success: true };
    }),
});
