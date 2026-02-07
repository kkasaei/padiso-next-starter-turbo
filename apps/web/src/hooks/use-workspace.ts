"use client";

import { trpc } from "@/lib/trpc/client";

/**
 * Hooks for managing workspace with tRPC
 */

export function useCreateWorkspace() {
  const utils = trpc.useUtils();

  return trpc.workspaces.create.useMutation({
    onSuccess: (data) => {
      utils.workspaces.getById.invalidate({ id: data.id });
      utils.workspaces.getByClerkOrgId.invalidate({
        clerkOrgId: data.clerkOrgId,
      });
    },
  });
}

export function useCheckSlugAvailability(slug: string) {
  return trpc.workspaces.checkSlugAvailability.useQuery(
    { slug },
    {
      enabled: slug.length >= 3,
      // Don't refetch automatically - only on slug change
      staleTime: 30_000,
      retry: false,
    }
  );
}

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
