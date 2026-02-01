"use client";

import { format } from "date-fns";
import Image from "next/image";
import type { Prompt } from "@workspace/db/schema";
import { Zap, Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { getProviderIcon } from "./utils";

type PromptCardProps = {
  prompt: Prompt;
  brandName?: string;
  onEdit?: (prompt: Prompt) => void;
  onDelete?: (prompt: Prompt) => void;
  onClick?: (prompt: Prompt) => void;
};

export function PromptCard({ prompt, brandName, onEdit, onDelete, onClick }: PromptCardProps) {
  const providerIcon = getProviderIcon(prompt.aiProvider as string);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.prompt);
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
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <div className="flex items-center gap-2">
            {/* Provider Icon Only */}
            {prompt.aiProvider && (
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/50 border border-border/60">
                <Image
                  src={providerIcon}
                  alt={prompt.aiProvider}
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" strokeWidth={3} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </DropdownMenuItem>
                {onEdit && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(prompt); }}>
                    <Pencil className="h-4 w-4 mr-2" />
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
                      <Trash2 className="h-4 w-4 mr-2" />
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
        </div>

        <div className="mt-3 p-2 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground line-clamp-3 font-mono">{prompt.prompt}</p>
        </div>

        <div className="mt-3 border-t border-border/60" />

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {brandName && (
              <span className="font-medium">{brandName}</span>
            )}
            {prompt.usageCount > 0 && (
              <span>• Used {prompt.usageCount}x</span>
            )}
          </div>
          <span>{format(new Date(prompt.createdAt), "MMM d, yyyy")}</span>
        </div>
      </div>
    </div>
  );
}
