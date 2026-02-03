"use client";

import { trpc } from "@/lib/trpc/client";
import { useOrganization } from "@clerk/nextjs";
import { useWorkspaceByClerkOrgId } from "./use-workspace";
import { FEATURE_FLAGS } from "@/lib/feature-flags";

export type LimitType = "brands" | "apiCalls" | "aiCredits";

export interface UsageCheckResult {
  current: number;
  limit: number;
  isUnlimited: boolean;
  hasReachedLimit: boolean;
  remaining: number;
  isLoading: boolean;
  error: Error | null;
}

export interface BillingGuardResult {
  /** Whether the action is allowed (limit not reached) */
  canPerformAction: boolean;
  /** Current usage count */
  current: number;
  /** Maximum limit (-1 if unlimited) */
  limit: number;
  /** Whether this limit is unlimited */
  isUnlimited: boolean;
  /** Whether the limit has been reached */
  hasReachedLimit: boolean;
  /** Remaining quota before limit is reached */
  remaining: number;
  /** Loading state */
  isLoading: boolean;
  /** Error if any */
  error: Error | null;
  /** Refetch the limit check */
  refetch: () => void;
}

/**
 * Hook to check if a specific limit has been reached
 * 
 * @example
 * ```tsx
 * const { canPerformAction, hasReachedLimit, remaining } = useBillingGuard("brands");
 * 
 * if (!canPerformAction) {
 *   return <UpgradePrompt remaining={remaining} />;
 * }
 * ```
 */
export function useBillingGuard(limitType: LimitType): BillingGuardResult {
  const { organization } = useOrganization();
  const { data: workspace, isLoading: isWorkspaceLoading } = useWorkspaceByClerkOrgId(
    organization?.id || ""
  );

  const {
    data,
    isLoading: isLimitLoading,
    error,
    refetch,
  } = trpc.subscriptions.checkLimit.useQuery(
    {
      workspaceId: workspace?.id || "",
      limitType,
    },
    {
      enabled: !!workspace?.id,
    }
  );

  const isLoading = isWorkspaceLoading || isLimitLoading;

  if (!data) {
    return {
      canPerformAction: false,
      current: 0,
      limit: 0,
      isUnlimited: false,
      hasReachedLimit: false,
      remaining: 0,
      isLoading,
      error: error as Error | null,
      refetch,
    };
  }

  return {
    canPerformAction: !data.hasReachedLimit,
    current: data.current,
    limit: data.limit,
    isUnlimited: data.isUnlimited,
    hasReachedLimit: data.hasReachedLimit,
    remaining: data.remaining === Infinity ? -1 : data.remaining,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}

/**
 * Hook specifically for checking brand creation limits
 * 
 * @example
 * ```tsx
 * const { canCreateBrand, brandsRemaining } = useBrandLimit();
 * 
 * <Button disabled={!canCreateBrand} onClick={handleCreateBrand}>
 *   Create Brand {brandsRemaining > 0 && `(${brandsRemaining} remaining)`}
 * </Button>
 * ```
 */
export function useBrandLimit() {
  const guard = useBillingGuard("brands");

  // Bypass billing limits for demo mode
  const bypassLimits = FEATURE_FLAGS.BYPASS_BILLING_LIMITS;

  return {
    canCreateBrand: bypassLimits || guard.canPerformAction,
    currentBrands: guard.current,
    maxBrands: bypassLimits ? -1 : guard.limit,
    brandsRemaining: bypassLimits ? -1 : guard.remaining,
    isUnlimited: bypassLimits || guard.isUnlimited,
    hasReachedLimit: bypassLimits ? false : guard.hasReachedLimit,
    isLoading: guard.isLoading,
    error: guard.error,
    refetch: guard.refetch,
  };
}

/**
 * Hook for checking API call limits
 */
export function useApiCallLimit() {
  const guard = useBillingGuard("apiCalls");

  return {
    canMakeApiCall: guard.canPerformAction,
    currentCalls: guard.current,
    maxCalls: guard.limit,
    callsRemaining: guard.remaining,
    isUnlimited: guard.isUnlimited,
    hasReachedLimit: guard.hasReachedLimit,
    isLoading: guard.isLoading,
    error: guard.error,
    refetch: guard.refetch,
  };
}

/**
 * Hook for checking AI credit limits
 */
export function useAiCreditLimit() {
  const guard = useBillingGuard("aiCredits");

  return {
    canUseAiCredits: guard.canPerformAction,
    currentCredits: guard.current,
    maxCredits: guard.limit,
    creditsRemaining: guard.remaining,
    isUnlimited: guard.isUnlimited,
    hasReachedLimit: guard.hasReachedLimit,
    isLoading: guard.isLoading,
    error: guard.error,
    refetch: guard.refetch,
  };
}
