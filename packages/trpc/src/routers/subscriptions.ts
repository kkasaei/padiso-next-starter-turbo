import { z } from "zod";
import { eq, count } from "drizzle-orm";
import { workspaces, brands } from "@workspace/db/schema";
import { router, publicProcedure } from "../trpc";
import {
  createBillingPortalSession,
  getStripe,
  getPlanIdFromPriceId,
  getPlanById,
  getPlanLimits,
  getIntervalFromPriceId,
  PLANS,
  PLAN_LIMITS,
  type PlanId,
} from "@workspace/billing/server";

export const subscriptionsRouter = router({
  /**
   * Get subscription status from workspace table (quick check)
   * Auto-creates workspace if it doesn't exist for the Clerk org
   */
  getStatusByClerkOrgId: publicProcedure
    .input(z.object({ clerkOrgId: z.string() }))
    .query(async ({ ctx, input }) => {
      let [workspace] = await ctx.db
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

      // Auto-create workspace if it doesn't exist
      if (!workspace) {
        const [newWorkspace] = await ctx.db
          .insert(workspaces)
          .values({
            clerkOrgId: input.clerkOrgId,
            status: "active",
            hasCompletedWelcomeScreen: false,
            hasCompletedOnboarding: false,
          })
          .returning({
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
          });
        workspace = newWorkspace;
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
   * Always uses limits.json as source of truth for limits
   * Counts actual resources from database for usage
   */
  getUsage: publicProcedure
    .input(z.object({ workspaceId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [workspace] = await ctx.db
        .select({
          planId: workspaces.planId,
          // Usage counts (for non-countable resources)
          usageApiCallsCount: workspaces.usageApiCallsCount,
          usageAiCreditsUsed: workspaces.usageAiCreditsUsed,
          usageResetAt: workspaces.usageResetAt,
        })
        .from(workspaces)
        .where(eq(workspaces.id, input.workspaceId))
        .limit(1);

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      // Count actual brands from the brands table
      const [brandCount] = await ctx.db
        .select({ count: count() })
        .from(brands)
        .where(eq(brands.workspaceId, input.workspaceId));

      const planId = (workspace.planId as PlanId) || "growth";
      const planLimits = PLAN_LIMITS[planId] || PLAN_LIMITS.growth;

      return {
        planId,
        usage: {
          brands: brandCount?.count ?? 0,
          apiCalls: workspace.usageApiCallsCount ?? 0,
          aiCredits: workspace.usageAiCreditsUsed ?? 0,
        },
        limits: {
          // Always use limits.json as source of truth
          brands: planLimits.brands.max,
          apiCalls: planLimits.api.maxCalls,
          aiCredits: planLimits.visibility.maxInsightsQueries,
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
   * Counts actual resources and compares against limits.json
   */
  checkLimit: publicProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        limitType: z.enum(["brands", "apiCalls", "aiCredits"]),
      })
    )
    .query(async ({ ctx, input }) => {
      // Get workspace plan
      const [workspace] = await ctx.db
        .select({
          planId: workspaces.planId,
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
          // Count actual brands from the brands table
          const [brandCount] = await ctx.db
            .select({ count: count() })
            .from(brands)
            .where(eq(brands.workspaceId, input.workspaceId));
          current = brandCount?.count ?? 0;
          limit = planLimits.brands.max;
          break;
        case "apiCalls":
          // TODO: Count from API calls table when implemented
          current = 0;
          limit = planLimits.api.maxCalls;
          break;
        case "aiCredits":
          // TODO: Count from AI usage table when implemented
          current = 0;
          limit = planLimits.visibility.maxInsightsQueries;
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

  /**
   * Sync subscription from Stripe
   * Call this after checkout to ensure DB is updated
   */
  syncFromStripe: publicProcedure
    .input(z.object({ workspaceId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Get workspace
      const [workspace] = await ctx.db
        .select()
        .from(workspaces)
        .where(eq(workspaces.id, input.workspaceId))
        .limit(1);

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      if (!workspace.stripeCustomerId) {
        throw new Error("No Stripe customer found");
      }

      // Get subscription from Stripe
      const stripe = getStripe();
      const stripeSubscriptions = await stripe.subscriptions.list({
        customer: workspace.stripeCustomerId,
        limit: 1,
        status: "all",
      });

      const subscription = stripeSubscriptions.data[0];
      if (!subscription) {
        throw new Error("No subscription found in Stripe");
      }

      const firstItem = subscription.items.data[0];
      if (!firstItem) {
        throw new Error("No subscription items found");
      }

      // Get plan info
      const priceId = firstItem.price?.id || "";
      const planId = getPlanIdFromPriceId(priceId);
      const plan = getPlanById(planId);
      const interval = getIntervalFromPriceId(priceId);
      const limits = getPlanLimits(planId);

      type WorkspaceStatus = "active" | "trialing" | "past_due" | "canceled" | "unpaid" | "incomplete" | "incomplete_expired" | "paused";
      const statusMap: Record<string, WorkspaceStatus> = {
        active: "active",
        trialing: "trialing",
        past_due: "past_due",
        canceled: "canceled",
        unpaid: "unpaid",
        incomplete: "incomplete",
        incomplete_expired: "incomplete_expired",
        paused: "paused",
      };

      // Update workspace
      const [updated] = await ctx.db
        .update(workspaces)
        .set({
          status: statusMap[subscription.status] || "active",
          stripeSubscriptionId: subscription.id,
          planId,
          planName: plan?.name || "Growth",
          billingInterval: interval,
          priceAmount: String((firstItem.price?.unit_amount ?? 0) / 100),
          currency: subscription.currency,
          trialStartsAt: subscription.trial_start
            ? new Date(subscription.trial_start * 1000)
            : null,
          trialEndsAt: subscription.trial_end
            ? new Date(subscription.trial_end * 1000)
            : null,
          subscriptionPeriodStartsAt: new Date(
            (firstItem.current_period_start ?? 0) * 1000
          ),
          subscriptionPeriodEndsAt: new Date(
            (firstItem.current_period_end ?? 0) * 1000
          ),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          limitBrands: limits.brands.max === -1 ? null : limits.brands.max,
          limitApiCallsPerMonth:
            limits.api.maxCalls === -1 ? null : limits.api.maxCalls,
          limitAiCreditsPerMonth:
            limits.visibility.maxInsightsQueries === -1 ? null : limits.visibility.maxInsightsQueries,
          updatedAt: new Date(),
        })
        .where(eq(workspaces.id, input.workspaceId))
        .returning();

      return {
        success: true,
        workspace: updated,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          planId,
          trialEnd: subscription.trial_end
            ? new Date(subscription.trial_end * 1000)
            : null,
        },
      };
    }),

  /**
   * Provision a workspace after Stripe checkout completes.
   * Called AFTER Clerk org + DB workspace are created on the client.
   * Links the Stripe checkout session (customer + subscription) to the workspace.
   */
  provisionAfterCheckout: publicProcedure
    .input(
      z.object({
        stripeSessionId: z.string(),
        workspaceId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Verify workspace exists
      const [workspace] = await ctx.db
        .select()
        .from(workspaces)
        .where(eq(workspaces.id, input.workspaceId))
        .limit(1);

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      // 2. Retrieve Stripe checkout session with expanded subscription
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(input.stripeSessionId);

      if (!session) {
        throw new Error("Stripe session not found");
      }

      // Verify payment completed (paid for immediate charge, no_payment_required for trials)
      if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
        throw new Error("Payment not completed");
      }

      // 3. Get subscription
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;

      if (!subscriptionId) {
        throw new Error("No subscription found for this checkout session");
      }

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const firstItem = subscription.items.data[0];

      if (!firstItem) {
        throw new Error("No subscription items found");
      }

      // 4. Derive plan info from the price
      const priceId = firstItem.price?.id || "";
      const planId = getPlanIdFromPriceId(priceId);
      const plan = getPlanById(planId);
      const interval = getIntervalFromPriceId(priceId);
      const limits = getPlanLimits(planId);
      const customerId = (session.customer as string) || "";

      type WorkspaceStatus = "active" | "trialing" | "past_due" | "canceled" | "unpaid" | "incomplete" | "incomplete_expired" | "paused";
      const statusMap: Record<string, WorkspaceStatus> = {
        active: "active",
        trialing: "trialing",
        past_due: "past_due",
        canceled: "canceled",
        unpaid: "unpaid",
        incomplete: "incomplete",
        incomplete_expired: "incomplete_expired",
        paused: "paused",
      };

      // 5. Update workspace with all Stripe data
      const [updated] = await ctx.db
        .update(workspaces)
        .set({
          status: statusMap[subscription.status] || "active",
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId,
          planId,
          planName: plan?.name || "Growth",
          billingInterval: interval,
          priceAmount: String((firstItem.price?.unit_amount ?? 0) / 100),
          currency: subscription.currency,
          trialStartsAt: subscription.trial_start
            ? new Date(subscription.trial_start * 1000)
            : null,
          trialEndsAt: subscription.trial_end
            ? new Date(subscription.trial_end * 1000)
            : null,
          subscriptionPeriodStartsAt: new Date(
            (firstItem.current_period_start ?? 0) * 1000
          ),
          subscriptionPeriodEndsAt: new Date(
            (firstItem.current_period_end ?? 0) * 1000
          ),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          limitBrands: limits.brands.max === -1 ? null : limits.brands.max,
          limitApiCallsPerMonth:
            limits.api.maxCalls === -1 ? null : limits.api.maxCalls,
          limitAiCreditsPerMonth:
            limits.visibility.maxInsightsQueries === -1
              ? null
              : limits.visibility.maxInsightsQueries,
          updatedAt: new Date(),
        })
        .where(eq(workspaces.id, input.workspaceId))
        .returning();

      // 6. Update Stripe customer + subscription metadata to point to the real workspace ID
      // This ensures future webhooks can find the workspace
      if (customerId) {
        await stripe.customers.update(customerId, {
          metadata: { organizationId: input.workspaceId },
        });
      }
      await stripe.subscriptions.update(subscription.id, {
        metadata: { organizationId: input.workspaceId, planId },
      });

      return {
        success: true,
        workspace: updated,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          planId,
          trialEnd: subscription.trial_end
            ? new Date(subscription.trial_end * 1000)
            : null,
        },
      };
    }),
});
