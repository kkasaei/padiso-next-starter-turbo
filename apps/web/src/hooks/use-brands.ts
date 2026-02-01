"use client";

import { trpc } from "@/lib/trpc/client";

/**
 * Hooks for managing brands with tRPC
 */

export function useBrands(workspaceId: string) {
  return trpc.brands.getAll.useQuery(
    { workspaceId },
    { enabled: !!workspaceId }
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
