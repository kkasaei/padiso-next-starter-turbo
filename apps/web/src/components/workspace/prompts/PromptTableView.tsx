"use client";

import { format } from "date-fns";
import Image from "next/image";
import { Copy } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import type { Prompt } from "@workspace/db/schema";
import { getProviderIcon } from "./PromptConstants";
import { toast } from "sonner";

type PromptTableViewProps = {
  prompts: Prompt[];
  brands?: Array<{ id: string; brandName: string | null }>;
  onOpenPrompt?: (prompt: Prompt) => void;
  onEditPrompt?: (prompt: Prompt) => void;
};

export function PromptTableView({ 
  prompts, 
  brands = [], 
  onOpenPrompt,
  onEditPrompt 
}: PromptTableViewProps) {
  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-8">
        <p className="text-muted-foreground mb-2">No prompts found</p>
        <p className="text-sm text-muted-foreground">Create your first prompt to get started</p>
      </div>
    );
  }

  const handleCopy = (e: React.MouseEvent, promptText: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(promptText);
    toast.success("Prompt copied to clipboard");
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prompts.map((prompt) => {
            const brand = brands.find(b => b.id === prompt.brandId);
            const createdDate = typeof prompt.createdAt === 'string' 
              ? new Date(prompt.createdAt) 
              : prompt.createdAt;

            return (
              <TableRow
                key={prompt.id}
                onClick={() => onOpenPrompt?.(prompt)}
                className="cursor-pointer"
              >
                {/* Provider Icon */}
                <TableCell>
                  {prompt.aiProvider && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/50 border border-border/60">
                      <Image
                        src={getProviderIcon(prompt.aiProvider)}
                        alt={prompt.aiProvider}
                        width={16}
                        height={16}
                        className="object-contain"
                      />
                    </div>
                  )}
                </TableCell>

                {/* Name */}
                <TableCell>
                  <span className="font-medium">{prompt.name}</span>
                </TableCell>

                {/* Description */}
                <TableCell>
                  {prompt.description ? (
                    <span className="text-sm text-muted-foreground line-clamp-1">
                      {prompt.description}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>

                {/* Brand */}
                <TableCell>
                  {brand?.brandName ? (
                    <Badge variant="outline" className="font-normal">
                      {brand.brandName}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>

                {/* Provider */}
                <TableCell>
                  {prompt.aiProvider ? (
                    <span className="text-sm capitalize">{prompt.aiProvider}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>

                {/* Usage Count */}
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {prompt.usageCount > 0 ? `${prompt.usageCount}x` : '—'}
                  </span>
                </TableCell>

                {/* Created Date */}
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {format(createdDate, "MMM d, yyyy")}
                  </span>
                </TableCell>

                {/* Actions */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleCopy(e, prompt.prompt)}
                      className="h-8"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    {onEditPrompt && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditPrompt(prompt);
                        }}
                        className="h-8"
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
