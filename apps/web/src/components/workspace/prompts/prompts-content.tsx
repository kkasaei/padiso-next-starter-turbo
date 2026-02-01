"use client";

import { useState, useMemo } from "react";
import { PromptHeader } from "@/components/prompts/prompt-header";
import { PromptCardsView } from "@/components/prompts/prompt-cards-view";
import { PromptPagination } from "@/components/prompts/prompt-pagination";
import { CreatePromptModal } from "@/components/prompts/create-prompt-modal";
import { PromptDetailModal } from "@/components/prompts/prompt-detail-modal";
import { mockPrompts, type Prompt, type AIProvider } from "@/lib/data/prompts";
import { toast } from "sonner";

interface PromptFilters {
  projectId: string | null;
  aiProvider: AIProvider | null;
}

const DEFAULT_ITEMS_PER_PAGE = 20;

export function PromptsContent() {
  const [prompts, setPrompts] = useState<Prompt[]>(mockPrompts);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [viewingPrompt, setViewingPrompt] = useState<Prompt | null>(null);
  const [filters, setFilters] = useState<PromptFilters>({
    projectId: null,
    aiProvider: null,
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

  // Filter prompts based on active filters
  const filteredPrompts = useMemo(() => {
    let result = prompts;

    if (filters.projectId) {
      result = result.filter((p) => p.projectId === filters.projectId);
    }

    if (filters.aiProvider) {
      result = result.filter((p) => p.aiProvider === filters.aiProvider);
    }

    return result;
  }, [prompts, filters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPrompts.length / itemsPerPage);
  
  // Get paginated prompts
  const paginatedPrompts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPrompts.slice(startIndex, endIndex);
  }, [filteredPrompts, currentPage, itemsPerPage]);

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

  const handleCreatePrompt = (promptData: Omit<Prompt, "id" | "createdAt" | "updatedAt">) => {
    if (editingPrompt) {
      // Update existing prompt
      setPrompts((prev) =>
        prev.map((p) =>
          p.id === editingPrompt.id
            ? { ...p, ...promptData, updatedAt: new Date() }
            : p
        )
      );
      setEditingPrompt(null);
    } else {
      // Create new prompt
      const newPrompt: Prompt = {
        ...promptData,
        id: `${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setPrompts((prev) => [newPrompt, ...prev]);
      setCurrentPage(1); // Go to first page to see new prompt
    }
    setIsCreateModalOpen(false);
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsCreateModalOpen(true);
    setViewingPrompt(null);
  };

  const handleDeletePrompt = (prompt: Prompt) => {
    setPrompts((prev) => prev.filter((p) => p.id !== prompt.id));
    toast.success("Prompt deleted");
    
    // Adjust page if needed after deletion
    const newTotal = filteredPrompts.length - 1;
    const newTotalPages = Math.ceil(newTotal / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
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

  return (
    <div className="flex flex-1 flex-col min-w-0">
      <PromptHeader 
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onAddPrompt={openCreateModal}
        totalCount={prompts.length}
        filteredCount={filteredPrompts.length}
      />
      
      <div className="flex-1 overflow-auto">
        <PromptCardsView
          prompts={paginatedPrompts}
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
        />
      )}

      {viewingPrompt && (
        <PromptDetailModal
          prompt={viewingPrompt}
          onClose={() => setViewingPrompt(null)}
          onEdit={handleEditPrompt}
        />
      )}
    </div>
  );
}
