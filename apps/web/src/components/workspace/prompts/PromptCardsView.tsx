"use client";

import type { Prompt } from "@workspace/db/schema";
import { PromptCard } from "./PromptCard";
import { Plus, Zap } from "lucide-react";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { PromptsEmptyState } from "./PromptsEmptyState";

type PromptCardsViewProps = {
  prompts: Prompt[];
  brands?: Array<{ id: string; brandName: string | null }>;
  loading?: boolean;
  onCreatePrompt?: () => void;
  onEditPrompt?: (prompt: Prompt) => void;
  onDeletePrompt?: (prompt: Prompt) => void;
  onPromptClick?: (prompt: Prompt) => void;
};

export function PromptCardsView({
  prompts,
  brands = [],
  loading = false,
  onCreatePrompt,
  onEditPrompt,
  onDeletePrompt,
  onPromptClick,
}: PromptCardsViewProps) {
  const isEmpty = !loading && prompts.length === 0;

  return (
    <div>
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-2xl" />
          ))}
        </div>
      ) : isEmpty ? (
        <PromptsEmptyState
          description="Create your first prompt to get started"
          onCreatePrompt={() => onCreatePrompt?.()}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {prompts.map((p) => {
            const brand = brands.find(b => b.id === p.brandId);
            return (
              <PromptCard
                key={p.id}
                prompt={p}
                brandName={brand?.brandName || undefined}
                onEdit={() => onEditPrompt?.(p)}
                onDelete={() => onDeletePrompt?.(p)}
                onClick={() => onPromptClick?.(p)}
              />
            );
          })}
          <button
            className="rounded-2xl border border-dashed border-border/60 bg-background p-6 text-center text-sm text-muted-foreground hover:border-solid hover:border-border/80 hover:text-foreground transition-colors min-h-[200px] flex flex-col items-center justify-center cursor-pointer"
            onClick={onCreatePrompt}
          >
            <Plus className="mb-2 h-5 w-5" />
            Create new prompt
          </button>
        </div>
      )}
    </div>
  );
}
