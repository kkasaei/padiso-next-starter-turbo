"use client";

import { trpc } from "@/lib/trpc/client";

/**
 * Hooks for managing tasks with tRPC
 */

export function useTasksByWorkspace(workspaceId: string) {
  return trpc.tasks.getByWorkspace.useQuery(
    { workspaceId },
    { enabled: !!workspaceId }
  );
}

export function useTasksByBrand(brandId: string) {
  return trpc.tasks.getByBrand.useQuery(
    { brandId },
    { enabled: !!brandId }
  );
}

export function useTask(id: string) {
  return trpc.tasks.getById.useQuery({ id }, { enabled: !!id });
}

export function useCreateTask() {
  const utils = trpc.useUtils();

  return trpc.tasks.create.useMutation({
    onSuccess: () => {
      // Invalidate all task queries to refetch
      utils.tasks.invalidate();
    },
  });
}

export function useUpdateTask() {
  const utils = trpc.useUtils();

  return trpc.tasks.update.useMutation({
    onSuccess: () => {
      utils.tasks.invalidate();
    },
  });
}

export function useDeleteTask() {
  const utils = trpc.useUtils();

  return trpc.tasks.delete.useMutation({
    onSuccess: () => {
      utils.tasks.invalidate();
    },
  });
}

export function useToggleTaskStatus() {
  const utils = trpc.useUtils();

  return trpc.tasks.update.useMutation({
    onSuccess: () => {
      utils.tasks.invalidate();
    },
  });
}
