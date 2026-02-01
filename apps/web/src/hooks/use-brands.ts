"use client";

import { trpc } from "@/lib/trpc/client";
import { useOrganization } from "@clerk/nextjs";
import { useWorkspaceByClerkOrgId } from "./use-workspace";

/**
 * Hooks for managing brands with tRPC
 */

export function useBrands(workspaceId?: string) {
  // Get workspace ID from Clerk organization if not provided
  const { organization } = useOrganization();
  const { data: workspace } = useWorkspaceByClerkOrgId(organization?.id || "");

  const effectiveWorkspaceId = workspaceId || workspace?.id || "";

  return trpc.brands.getAll.useQuery(
    { workspaceId: effectiveWorkspaceId },
    { enabled: !!effectiveWorkspaceId }
  );
}

export function useBrand(id: string) {
  return trpc.brands.getById.useQuery({ id }, { enabled: !!id });
}

export function useCreateBrand() {
  const utils = trpc.useUtils();

  return trpc.brands.create.useMutation({
    onSuccess: () => {
      utils.brands.getAll.invalidate();
    },
  });
}

export function useUpdateBrand() {
  const utils = trpc.useUtils();

  return trpc.brands.update.useMutation({
    onSuccess: (data) => {
      utils.brands.getAll.invalidate();
      utils.brands.getById.invalidate({ id: data.id });
    },
  });
}

export function useDeleteBrand() {
  const utils = trpc.useUtils();

  return trpc.brands.delete.useMutation({
    onSuccess: () => {
      utils.brands.getAll.invalidate();
    },
  });
}
