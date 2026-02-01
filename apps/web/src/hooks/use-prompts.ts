"use client";

import { trpc } from "@/lib/trpc/client";

/**
 * Hooks for managing prompts with tRPC
 */

export function usePrompts(brandId: string) {
  return trpc.prompts.getByBrand.useQuery(
    { brandId },
    { enabled: !!brandId }
  );
}

export function usePrompt(id: string) {
  return trpc.prompts.getById.useQuery({ id }, { enabled: !!id });
}

export function useCreatePrompt() {
  const utils = trpc.useUtils();

  return trpc.prompts.create.useMutation({
    onSuccess: (data) => {
      utils.prompts.getByBrand.invalidate({ brandId: data.brandId });
    },
  });
}

export function useUpdatePrompt() {
  const utils = trpc.useUtils();

  return trpc.prompts.update.useMutation({
    onSuccess: (data) => {
      utils.prompts.getByBrand.invalidate({ brandId: data.brandId });
      utils.prompts.getById.invalidate({ id: data.id });
    },
  });
}

export function useIncrementPromptUsage() {
  const utils = trpc.useUtils();

  return trpc.prompts.incrementUsage.useMutation({
    onSuccess: (data) => {
      utils.prompts.getByBrand.invalidate({ brandId: data.brandId });
      utils.prompts.getById.invalidate({ id: data.id });
    },
  });
}

export function useDeletePrompt() {
  const utils = trpc.useUtils();

  return trpc.prompts.delete.useMutation({
    onSuccess: () => {
      utils.prompts.getByBrand.invalidate();
    },
  });
}
