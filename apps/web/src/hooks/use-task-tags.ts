"use client";

import { trpc } from "@/lib/trpc/client";

/**
 * Hooks for managing task tags with tRPC
 */

export function useTaskTagsByWorkspace(workspaceId: string) {
  return trpc.taskTags.getByWorkspace.useQuery(
    { workspaceId },
    { enabled: !!workspaceId }
  );
}

export function useTaskTagsByBrand(brandId: string) {
  return trpc.taskTags.getByBrand.useQuery(
    { brandId },
    { enabled: !!brandId }
  );
}

export function useCreateTaskTag() {
  const utils = trpc.useUtils();

  return trpc.taskTags.create.useMutation({
    onSuccess: () => {
      utils.taskTags.invalidate();
    },
  });
}

export function useUpdateTaskTag() {
  const utils = trpc.useUtils();

  return trpc.taskTags.update.useMutation({
    onSuccess: () => {
      utils.taskTags.invalidate();
    },
  });
}

export function useDeleteTaskTag() {
  const utils = trpc.useUtils();

  return trpc.taskTags.delete.useMutation({
    onSuccess: () => {
      utils.taskTags.invalidate();
    },
  });
}
