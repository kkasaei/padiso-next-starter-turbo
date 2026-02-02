import { z } from "zod";
import { eq } from "drizzle-orm";
import { workspaces, subscriptions } from "@workspace/db/schema";
import { router, publicProcedure } from "../trpc";
import {
  createBillingPortalSession,
  PLANS,
  PLAN_LIMITS,
  type PlanId,
} from "@workspace/billing/server";

export const subscriptionsRouter = router({
  /**
   * Get subscription status for a workspace
   */
  getByWorkspaceId: publicProcedure
    .input(z.object({ workspaceId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [subscription] = await ctx.db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.workspaceId, input.workspaceId))
        .limit(1);

      return subscription ?? null;
    }),

  /**
   * Get subscription status from workspace table (quick check)
   */
  getStatusByClerkOrgId: publicProcedure
    .input(z.object({ clerkOrgId: z.string() }))
    .query(async ({ ctx, input }) => {
      const [workspace] = await ctx.db
        .select({
          id: workspaces.id,
          status: workspaces.status,
          planId: workspaces.planId,
          planName: workspaces.planName,
          stripeSubscriptionId: workspaces.stripeSubscriptionId,
          stripeCustomerId: workspaces.stripeCustomerId,
          billingInterval: workspaces.billingInterval,
          trialStartsAt: workspaces.trialStartsAt,
          trialEndsAt: workspaces.trialEndsAt,
          subscriptionPeriodStartsAt: workspaces.subscriptionPeriodStartsAt,
          subscriptionPeriodEndsAt: workspaces.subscriptionPeriodEndsAt,
          cancelAtPeriodEnd: workspaces.cancelAtPeriodEnd,
        })
        .from(workspaces)
        .where(eq(workspaces.clerkOrgId, input.clerkOrgId))
        .limit(1);

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      // Get plan limits
      const planId = (workspace.planId as PlanId) || "growth";
      const limits = PLAN_LIMITS[planId] || PLAN_LIMITS.growth;
      const plan = PLANS[planId] || PLANS.growth;

      return {
        ...workspace,
        plan,
        limits,
        isTrialing: workspace.status === "trialing",
        isActive:
          workspace.status === "active" || workspace.status === "trialing",
        isPastDue: workspace.status === "past_due",
        isCanceled: workspace.status === "canceled",
      };
    }),

  /**
   * Get usage limits and current usage for a workspace
   */
  getUsage: publicProcedure
    .input(z.object({ workspaceId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [workspace] = await ctx.db
        .select({
          planId: workspaces.planId,
          // Usage counts
          usageBrandsCount: workspaces.usageBrandsCount,
          usageApiCallsCount: workspaces.usageApiCallsCount,
          usageAiCreditsUsed: workspaces.usageAiCreditsUsed,
          usageResetAt: workspaces.usageResetAt,
          // Limits
          limitBrands: workspaces.limitBrands,
          limitApiCallsPerMonth: workspaces.limitApiCallsPerMonth,
          limitAiCreditsPerMonth: workspaces.limitAiCreditsPerMonth,
        })
        .from(workspaces)
        .where(eq(workspaces.id, input.workspaceId))
        .limit(1);

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      const planId = (workspace.planId as PlanId) || "growth";
      const planLimits = PLAN_LIMITS[planId] || PLAN_LIMITS.growth;

      return {
        planId,
        usage: {
          brands: workspace.usageBrandsCount ?? 0,
          apiCalls: workspace.usageApiCallsCount ?? 0,
          aiCredits: workspace.usageAiCreditsUsed ?? 0,
        },
        limits: {
          brands: workspace.limitBrands ?? planLimits.maxBrands,
          apiCalls: workspace.limitApiCallsPerMonth ?? planLimits.maxApiCalls,
          aiCredits:
            workspace.limitAiCreditsPerMonth ?? planLimits.maxInsightsQueries,
        },
        usageResetAt: workspace.usageResetAt,
      };
    }),

  /**
   * Get Stripe billing portal URL
   */
  getBillingPortalUrl: publicProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        returnUrl: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [workspace] = await ctx.db
        .select({
          stripeCustomerId: workspaces.stripeCustomerId,
        })
        .from(workspaces)
        .where(eq(workspaces.id, input.workspaceId))
        .limit(1);

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      if (!workspace.stripeCustomerId) {
        throw new Error("No Stripe customer found for this workspace");
      }

      const session = await createBillingPortalSession({
        customerId: workspace.stripeCustomerId,
        returnUrl: input.returnUrl,
      });

      return { url: session.url };
    }),

  /**
   * Check if a specific limit has been reached
   */
  checkLimit: publicProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        limitType: z.enum(["brands", "apiCalls", "aiCredits"]),
      })
    )
    .query(async ({ ctx, input }) => {
      const [workspace] = await ctx.db
        .select({
          planId: workspaces.planId,
          usageBrandsCount: workspaces.usageBrandsCount,
          usageApiCallsCount: workspaces.usageApiCallsCount,
          usageAiCreditsUsed: workspaces.usageAiCreditsUsed,
          limitBrands: workspaces.limitBrands,
          limitApiCallsPerMonth: workspaces.limitApiCallsPerMonth,
          limitAiCreditsPerMonth: workspaces.limitAiCreditsPerMonth,
        })
        .from(workspaces)
        .where(eq(workspaces.id, input.workspaceId))
        .limit(1);

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      const planId = (workspace.planId as PlanId) || "growth";
      const planLimits = PLAN_LIMITS[planId] || PLAN_LIMITS.growth;

      let current: number;
      let limit: number;

      switch (input.limitType) {
        case "brands":
          current = workspace.usageBrandsCount ?? 0;
          limit = workspace.limitBrands ?? planLimits.maxBrands;
          break;
        case "apiCalls":
          current = workspace.usageApiCallsCount ?? 0;
          limit = workspace.limitApiCallsPerMonth ?? planLimits.maxApiCalls;
          break;
        case "aiCredits":
          current = workspace.usageAiCreditsUsed ?? 0;
          limit =
            workspace.limitAiCreditsPerMonth ?? planLimits.maxInsightsQueries;
          break;
      }

      // -1 means unlimited
      const isUnlimited = limit === -1;
      const hasReachedLimit = !isUnlimited && current >= limit;

      return {
        current,
        limit,
        isUnlimited,
        hasReachedLimit,
        remaining: isUnlimited ? Infinity : Math.max(0, limit - current),
      };
    }),
});
