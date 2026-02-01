"use client";

import { trpc } from "@/lib/trpc/client";

/**
 * Hooks for managing tasks with tRPC
 */

export function useTasks(brandId: string) {
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
    onSuccess: (data) => {
      utils.tasks.getByBrand.invalidate({ brandId: data.brandId });
    },
  });
}

export function useUpdateTask() {
  const utils = trpc.useUtils();

  return trpc.tasks.update.useMutation({
    onSuccess: (data) => {
      utils.tasks.getByBrand.invalidate({ brandId: data.brandId });
      utils.tasks.getById.invalidate({ id: data.id });
    },
  });
}

export function useDeleteTask() {
  const utils = trpc.useUtils();

  return trpc.tasks.delete.useMutation({
    onSuccess: () => {
      utils.tasks.getByBrand.invalidate();
    },
  });
}
