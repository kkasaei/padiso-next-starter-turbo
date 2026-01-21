import { z } from "zod";
import { eq } from "drizzle-orm";
import { projects } from "@workspace/db/schema";
import { router, publicProcedure } from "../trpc";

// Transform database project to match component expectations
function transformProject(dbProject: typeof projects.$inferSelect) {
  return {
    id: dbProject.id,
    name: dbProject.name,
    taskCount: dbProject.taskCount,
    progress: dbProject.progress,
    startDate: new Date(dbProject.startDate),
    endDate: new Date(dbProject.endDate),
    status: dbProject.status as "backlog" | "planned" | "active" | "cancelled" | "completed",
    priority: dbProject.priority as "urgent" | "high" | "medium" | "low",
    tags: [], // TODO: Add tags from project-tags table
    members: [], // TODO: Add members from project-members table
    client: dbProject.client ?? undefined,
    typeLabel: dbProject.typeLabel ?? undefined,
    durationLabel: dbProject.durationLabel ?? undefined,
  };
}

export const projectRouter = router({
  /**
   * Get all projects
   */
  getAll: publicProcedure.query(async ({ ctx }) => {
    const dbProjects = await ctx.db.select().from(projects);
    return dbProjects.map(transformProject);
  }),

  /**
   * Get a project by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [project] = await ctx.db
        .select()
        .from(projects)
        .where(eq(projects.id, input.id))
        .limit(1);

      if (!project) {
        throw new Error("Project not found");
      }

      return transformProject(project);
    }),

  /**
   * Create a new project
   */
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        startDate: z.string(),
        endDate: z.string(),
        status: z.enum(["backlog", "planned", "active", "cancelled", "completed"]),
        priority: z.enum(["urgent", "high", "medium", "low"]),
        client: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [project] = await ctx.db
        .insert(projects)
        .values({
          name: input.name,
          description: input.description,
          startDate: input.startDate,
          endDate: input.endDate,
          status: input.status,
          priority: input.priority,
          client: input.client,
        })
        .returning();

      if (!project) {
        throw new Error("Failed to create project");
      }

      return transformProject(project);
    }),

  /**
   * Update a project
   */
  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        status: z
          .enum(["backlog", "planned", "active", "cancelled", "completed"])
          .optional(),
        priority: z.enum(["urgent", "high", "medium", "low"]).optional(),
        progress: z.number().min(0).max(100).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;

      const [project] = await ctx.db
        .update(projects)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(projects.id, id))
        .returning();

      if (!project) {
        throw new Error("Project not found");
      }

      return transformProject(project);
    }),

  /**
   * Delete a project
   */
  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(projects).where(eq(projects.id, input.id));
      return { success: true };
    }),
});
