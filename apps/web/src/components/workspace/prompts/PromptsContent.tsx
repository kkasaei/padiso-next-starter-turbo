"use client";

import { useState, useMemo } from "react";
import { useOrganization } from "@clerk/nextjs";
import { toast } from "sonner";

// Hooks
import { useWorkspaceByClerkOrgId } from "@/hooks/use-workspace";
import { useBrands } from "@/hooks/use-brands";
import { 
  usePromptsByWorkspace, 
  useCreatePrompt, 
  useUpdatePrompt, 
  useDeletePrompt 
} from "@/hooks/use-prompts";

// Types
import type { Prompt } from "@workspace/db/schema";
import type { FilterChip as FilterChipType, PromptFilters } from "./PromptTypes";
import { AI_PROVIDERS } from "./PromptConstants";

// Components
import { PromptHeader } from "./PromptHeader";
import { PromptCardsView } from "./PromptCardsView";
import { PromptPagination } from "./PromptPagination";
import { CreatePromptModal } from "./CreatePromptModal";
import { PromptDetailModal } from "./PromptDetailModal";

const DEFAULT_ITEMS_PER_PAGE = 20;

export function PromptsContent() {
  // ============================================================
  // DATA FETCHING
  // ============================================================
  const { organization } = useOrganization();
  const { data: workspace } = useWorkspaceByClerkOrgId(organization?.id || "");
  const { data: brands = [] } = useBrands(workspace?.id);
  const { data: dbPrompts = [], isLoading } = usePromptsByWorkspace(workspace?.id || "");
  
  // Convert tRPC serialized dates to Date objects
  const prompts = useMemo(() => {
    return dbPrompts.map((p: any) => ({
      ...p,
      createdAt: typeof p.createdAt === 'string' ? new Date(p.createdAt) : p.createdAt,
      updatedAt: typeof p.updatedAt === 'string' ? new Date(p.updatedAt) : p.updatedAt,
      lastUsedAt: p.lastUsedAt ? (typeof p.lastUsedAt === 'string' ? new Date(p.lastUsedAt) : p.lastUsedAt) : null,
    }));
  }, [dbPrompts]);
  
  // Mutations
  const createPromptMutation = useCreatePrompt();
  const updatePromptMutation = useUpdatePrompt();
  const deletePromptMutation = useDeletePrompt();
  
  // ============================================================
  // STATE MANAGEMENT
  // ============================================================
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [viewingPrompt, setViewingPrompt] = useState<Prompt | null>(null);
  const [filters, setFilters] = useState<PromptFilters>({
    filterChips: [],
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

  // ============================================================
  // COMPUTED VALUES
  // ============================================================
  
  // Filter prompts based on active filter chips
  const filteredPrompts = useMemo(() => {
    let result = prompts;

    if (filters.filterChips.length > 0) {
      result = result.filter((prompt) => {
        return filters.filterChips.every((chip) => {
          const key = chip.key.toLowerCase();
          const value = chip.value;

          // Project/Brand filter
          if (key === "project" || key === "projects") {
            return prompt.brandId === value;
          }

          // Provider filter
          if (key === "provider" || key === "providers") {
            return prompt.aiProvider === value;
          }

          return true;
        });
      });
    }

    return result;
  }, [prompts, filters]);

  // Compute filter counts for the filter popover
  const filterCounts = useMemo(() => {
    const counts: { projects?: Record<string, number>; providers?: Record<string, number> } = {
      projects: {},
      providers: {},
    };

    prompts.forEach((prompt) => {
      // Count by brand
      if (prompt.brandId) {
        counts.projects![prompt.brandId] = (counts.projects![prompt.brandId] || 0) + 1;
      }

      // Count by AI provider
      if (prompt.aiProvider) {
        counts.providers![prompt.aiProvider] = (counts.providers![prompt.aiProvider] || 0) + 1;
      }
    });

    return counts;
  }, [prompts]);

  // Prepare projects and providers for filter popover
  const projectsForFilter = useMemo(() => 
    brands.map(b => ({ id: b.id, name: b.brandName || 'Unnamed Project' })),
    [brands]
  );

  const providersForFilter = useMemo(() => AI_PROVIDERS, []);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPrompts.length / itemsPerPage);
  
  // Get paginated prompts
  const paginatedPrompts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPrompts.slice(startIndex, endIndex);
  }, [filteredPrompts, currentPage, itemsPerPage]);

  // ============================================================
  // EVENT HANDLERS
  // ============================================================
  
  // Reset to page 1 when filters change
  const handleFiltersChange = (newFilters: PromptFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handleCreatePrompt = async (promptData: Partial<Prompt> & { brandId: string; name: string; prompt: string }) => {
    try {
      if (editingPrompt) {
        // Update existing prompt
        await updatePromptMutation.mutateAsync({
          id: editingPrompt.id,
          name: promptData.name,
          description: promptData.description || undefined,
          prompt: promptData.prompt,
          aiProvider: promptData.aiProvider || undefined,
          tagId: promptData.tagId || undefined,
          config: promptData.config || undefined,
        });
        toast.success("Prompt updated");
        setEditingPrompt(null);
      } else {
        // Create new prompt
        await createPromptMutation.mutateAsync({
          brandId: promptData.brandId,
          name: promptData.name,
          description: promptData.description || undefined,
          prompt: promptData.prompt,
          aiProvider: promptData.aiProvider || undefined,
          tagId: promptData.tagId || undefined,
          config: promptData.config || undefined,
        });
        toast.success("Prompt created");
        setCurrentPage(1);
      }
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error saving prompt:", error);
      toast.error("Failed to save prompt");
    }
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsCreateModalOpen(true);
    setViewingPrompt(null);
  };

  const handleDeletePrompt = async (prompt: Prompt) => {
    try {
      await deletePromptMutation.mutateAsync({ id: prompt.id });
      toast.success("Prompt deleted");
      
      // Adjust page if needed after deletion
      const newTotal = filteredPrompts.length - 1;
      const newTotalPages = Math.ceil(newTotal / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      console.error("Error deleting prompt:", error);
      toast.error("Failed to delete prompt");
    }
  };

  const handlePromptClick = (prompt: Prompt) => {
    setViewingPrompt(prompt);
  };

  const openCreateModal = () => {
    setEditingPrompt(null);
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setEditingPrompt(null);
  };

  // ============================================================
  // RENDER - Loading & Empty States
  // ============================================================
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-w-0">
        <div className="text-muted-foreground">Loading prompts...</div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-w-0">
        <div className="text-muted-foreground">No workspace found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col min-w-0">
      <PromptHeader 
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onAddPrompt={openCreateModal}
        totalCount={prompts.length}
        filteredCount={filteredPrompts.length}
        filterCounts={filterCounts}
        projects={projectsForFilter}
        providers={providersForFilter}
      />
      
      <div className="flex-1 overflow-auto">
        <PromptCardsView
          prompts={paginatedPrompts}
          brands={brands}
          onCreatePrompt={openCreateModal}
          onEditPrompt={handleEditPrompt}
          onDeletePrompt={handleDeletePrompt}
          onPromptClick={handlePromptClick}
        />
      </div>

      <PromptPagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredPrompts.length}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {isCreateModalOpen && (
        <CreatePromptModal
          onClose={closeCreateModal}
          onCreate={handleCreatePrompt}
          editPrompt={editingPrompt}
          brands={brands}
        />
      )}

      {viewingPrompt && (
        <PromptDetailModal
          prompt={viewingPrompt}
          brandName={brands.find(b => b.id === viewingPrompt.brandId)?.brandName || undefined}
          onClose={() => setViewingPrompt(null)}
          onEdit={handleEditPrompt}
        />
      )}
    </div>
  );
}
