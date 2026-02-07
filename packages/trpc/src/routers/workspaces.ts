import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { workspaces } from "@workspace/db/schema";
import { router, publicProcedure } from "../trpc";

export const workspacesRouter = router({
  /**
   * Check if a Clerk organization slug is available.
   * Uses the Clerk REST API directly to avoid adding @clerk/nextjs dependency.
   */
  checkSlugAvailability: publicProcedure
    .input(z.object({ slug: z.string().min(1).max(48) }))
    .query(async ({ input }) => {
      const clerkSecretKey = process.env.CLERK_SECRET_KEY;
      if (!clerkSecretKey) {
        throw new Error("CLERK_SECRET_KEY not configured");
      }

      try {
        // Clerk allows looking up an organization by slug directly
        const response = await fetch(
          `https://api.clerk.com/v1/organizations/${encodeURIComponent(input.slug)}`,
          {
            headers: {
              Authorization: `Bearer ${clerkSecretKey}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 404 || response.status === 400) {
          // 404 = not found, slug is available
          return { available: true, slug: input.slug };
        }

        if (response.ok) {
          // Org with this slug exists
          return { available: false, slug: input.slug };
        }

        // Unexpected status - treat as unavailable for safety
        return { available: false, slug: input.slug };
      } catch {
        throw new Error("Failed to check slug availability");
      }
    }),

  /**
   * Get all workspaces (admin only)
   */
  getAll: publicProcedure.query(async ({ ctx }) => {
    const allWorkspaces = await ctx.db
      .select()
      .from(workspaces)
      .orderBy(desc(workspaces.createdAt));

    return allWorkspaces;
  }),

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

  /**
   * Save onboarding survey responses and mark onboarding as completed.
   */
  saveOnboardingSurvey: publicProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        survey: z.object({
          websiteUrl: z.string().optional(),
          role: z.string().optional(),
          teamSize: z.string().optional(),
          cms: z.string().optional(),
          referralSource: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [workspace] = await ctx.db
        .update(workspaces)
        .set({
          onboardingSurvey: input.survey,
          updatedAt: new Date(),
        })
        .where(eq(workspaces.id, input.workspaceId))
        .returning();

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      return workspace;
    }),
});
