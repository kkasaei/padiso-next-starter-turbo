"use client";

import { trpc } from "@/lib/trpc/client";

/**
 * Hooks for managing prompts with tRPC
 */

export function usePromptsByWorkspace(workspaceId: string) {
  return trpc.prompts.getByWorkspace.useQuery(
    { workspaceId },
    { enabled: !!workspaceId }
  );
}

export function usePromptsByBrand(brandId: string) {
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
    onSuccess: () => {
      // Invalidate all prompt queries to refetch
      utils.prompts.invalidate();
    },
  });
}

export function useUpdatePrompt() {
  const utils = trpc.useUtils();
  
  return trpc.prompts.update.useMutation({
    onSuccess: () => {
      utils.prompts.invalidate();
    },
  });
}

export function useDeletePrompt() {
  const utils = trpc.useUtils();
  
  return trpc.prompts.delete.useMutation({
    onSuccess: () => {
      utils.prompts.invalidate();
    },
  });
}

export function useIncrementPromptUsage() {
  const utils = trpc.useUtils();
  
  return trpc.prompts.incrementUsage.useMutation({
    onSuccess: () => {
      utils.prompts.invalidate();
    },
  });
}
