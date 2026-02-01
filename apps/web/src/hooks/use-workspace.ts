"use client";

import { trpc } from "@/lib/trpc/client";

/**
 * Hooks for managing workspace with tRPC
 */

export function useWorkspaceByClerkOrgId(clerkOrgId: string) {
  return trpc.workspaces.getByClerkOrgId.useQuery(
    { clerkOrgId },
    { enabled: !!clerkOrgId }
  );
}

export function useWorkspace(id: string) {
  return trpc.workspaces.getById.useQuery({ id }, { enabled: !!id });
}

export function useUpdateWorkspace() {
  const utils = trpc.useUtils();

  return trpc.workspaces.update.useMutation({
    onSuccess: (data) => {
      utils.workspaces.getById.invalidate({ id: data.id });
      utils.workspaces.getByClerkOrgId.invalidate({
        clerkOrgId: data.clerkOrgId,
      });
    },
  });
}

export function useUpdateWorkspaceOnboarding() {
  const utils = trpc.useUtils();

  return trpc.workspaces.updateOnboarding.useMutation({
    onSuccess: (data) => {
      utils.workspaces.getById.invalidate({ id: data.id });
      utils.workspaces.getByClerkOrgId.invalidate({
        clerkOrgId: data.clerkOrgId,
      });
    },
  });
}
