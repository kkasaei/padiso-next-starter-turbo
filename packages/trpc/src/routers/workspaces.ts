import { z } from "zod";
import { eq } from "drizzle-orm";
import { workspaces } from "@workspace/db/schema";
import { router, publicProcedure } from "../trpc";

export const workspacesRouter = router({
  /**
   * Create a new workspace from Clerk organization
   */
  create: publicProcedure
    .input(
      z.object({
        clerkOrgId: z.string(),
        status: z.enum(["active", "trialing"]).optional().default("active"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if workspace already exists for this Clerk org
      const [existing] = await ctx.db
        .select()
        .from(workspaces)
        .where(eq(workspaces.clerkOrgId, input.clerkOrgId))
        .limit(1);

      if (existing) {
        return existing;
      }

      // Create new workspace
      const [workspace] = await ctx.db
        .insert(workspaces)
        .values({
          clerkOrgId: input.clerkOrgId,
          status: input.status,
          hasCompletedWelcomeScreen: false,
          hasCompletedOnboarding: false,
        })
        .returning();

      return workspace;
    }),

  /**
   * Get workspace by Clerk organization ID
   */
  getByClerkOrgId: publicProcedure
    .input(z.object({ clerkOrgId: z.string() }))
    .query(async ({ ctx, input }) => {
      const [workspace] = await ctx.db
        .select()
        .from(workspaces)
        .where(eq(workspaces.clerkOrgId, input.clerkOrgId))
        .limit(1);

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      return workspace;
    }),

  /**
   * Get workspace by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [workspace] = await ctx.db
        .select()
        .from(workspaces)
        .where(eq(workspaces.id, input.id))
        .limit(1);

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      return workspace;
    }),

  /**
   * Update workspace settings
   * Note: name, slug, logoUrl are managed by Clerk
   */
  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        config: z.record(z.unknown()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;

      const [workspace] = await ctx.db
        .update(workspaces)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(workspaces.id, id))
        .returning();

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      return workspace;
    }),

  /**
   * Update onboarding status
   */
  updateOnboarding: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        hasCompletedWelcomeScreen: z.boolean().optional(),
        hasCompletedOnboarding: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;

      const [workspace] = await ctx.db
        .update(workspaces)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(workspaces.id, id))
        .returning();

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      return workspace;
    }),
});
