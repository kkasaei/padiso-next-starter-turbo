"use client";

import { trpc } from "@/lib/trpc/client";

/**
 * Example hook demonstrating tRPC usage with TanStack Query
 * 
 * Usage in a component:
 * ```tsx
 * const { data: projects, isLoading } = useProjects();
 * ```
 */
export function useProjects() {
  return trpc.project.getAll.useQuery();
}

export function useProject(id: string) {
  return trpc.project.getById.useQuery({ id }, { enabled: !!id });
}

export function useCreateProject() {
  const utils = trpc.useUtils();
  
  return trpc.project.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch projects after creating a new one
      utils.project.getAll.invalidate();
    },
  });
}

export function useUpdateProject() {
  const utils = trpc.useUtils();
  
  return trpc.project.update.useMutation({
    onSuccess: () => {
      utils.project.getAll.invalidate();
    },
  });
}

export function useDeleteProject() {
  const utils = trpc.useUtils();
  
  return trpc.project.delete.useMutation({
    onSuccess: () => {
      utils.project.getAll.invalidate();
    },
  });
}
