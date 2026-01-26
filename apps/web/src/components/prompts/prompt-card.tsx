"use client";

import { format } from "date-fns";
import type { Prompt } from "@/lib/data/prompts";
import { getCategoryConfig, getAIProviderConfig } from "@/lib/data/prompts";
import { Lightning, Copy, DotsThree, Folder, Globe, PencilSimple, Trash } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@workspace/ui/lib/utils";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";

type PromptCardProps = {
  prompt: Prompt;
  onEdit?: (prompt: Prompt) => void;
  onDelete?: (prompt: Prompt) => void;
  onClick?: (prompt: Prompt) => void;
};

export function PromptCard({ prompt, onEdit, onDelete, onClick }: PromptCardProps) {
  const categoryConfig = getCategoryConfig(prompt.category);
  const providerConfig = getAIProviderConfig(prompt.aiProvider);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.content);
    toast.success("Prompt copied to clipboard");
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open prompt ${prompt.name}`}
      onClick={() => onClick?.(prompt)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(prompt);
        }
      }}
      className="rounded-2xl border border-border bg-background hover:shadow-lg/5 transition-shadow cursor-pointer focus:outline-none"
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-primary/80">
            <Lightning className="h-5 w-5" weight="fill" />
          </div>
          <div className="flex items-center gap-2">
            <div className={cn("flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium", providerConfig.color)}>
              {providerConfig.label}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DotsThree className="h-4 w-4" weight="bold" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </DropdownMenuItem>
                {onEdit && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(prompt); }}>
                    <PencilSimple className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={(e) => { e.stopPropagation(); onDelete(prompt); }}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-3">
          <p className="text-[15px] font-semibold text-foreground leading-6 line-clamp-1">
            {prompt.name}
          </p>
          {prompt.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{prompt.description}</p>
          )}
        </div>

        <div className="mt-3 p-2 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground line-clamp-3 font-mono">{prompt.content}</p>
        </div>

        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <div className={cn("flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium", categoryConfig.color)}>
            {categoryConfig.label}
          </div>
        </div>

        <div className="mt-3 border-t border-border/60" />

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            {prompt.isFromProject ? (
              <>
                <Folder className="h-3.5 w-3.5" />
                <span className="truncate max-w-[120px]">{prompt.projectName || "Project"}</span>
              </>
            ) : (
              <>
                <Globe className="h-3.5 w-3.5" />
                <span>Global</span>
              </>
            )}
          </div>
          <span>{format(new Date(prompt.createdAt), "MMM d, yyyy")}</span>
        </div>
      </div>
    </div>
  );
}
