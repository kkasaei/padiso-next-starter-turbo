"use client";

import { trpc } from "@/lib/trpc/client";

/**
 * Hooks for managing subscriptions with tRPC
 */

export function useSubscriptionStatus(clerkOrgId: string | undefined) {
  return trpc.subscriptions.getStatusByClerkOrgId.useQuery(
    { clerkOrgId: clerkOrgId! },
    { enabled: !!clerkOrgId }
  );
}

export function useSubscriptionUsage(workspaceId: string | undefined) {
  return trpc.subscriptions.getUsage.useQuery(
    { workspaceId: workspaceId! },
    { enabled: !!workspaceId }
  );
}

export function useBillingPortal() {
  return trpc.subscriptions.getBillingPortalUrl.useMutation();
}

export function useCheckLimit(
  workspaceId: string | undefined,
  limitType: "brands" | "apiCalls" | "aiCredits"
) {
  return trpc.subscriptions.checkLimit.useQuery(
    { workspaceId: workspaceId!, limitType },
    { enabled: !!workspaceId }
  );
}
