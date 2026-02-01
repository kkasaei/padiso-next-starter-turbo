"use client";

import { motion } from "motion/react";
import { X, Copy, Zap, Pencil } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { format } from "date-fns";
import type { Prompt } from "@workspace/db/schema";
import { toast } from "sonner";

interface PromptDetailModalProps {
  prompt: Prompt;
  brandName?: string;
  onClose: () => void;
  onEdit?: (prompt: Prompt) => void;
}

export function PromptDetailModal({ prompt, brandName, onClose, onEdit }: PromptDetailModalProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.prompt);
    toast.success("Prompt copied to clipboard");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl rounded-2xl bg-background shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="h-5 w-5 text-primary fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{prompt.name}</h2>
              {prompt.description && (
                <p className="text-sm text-muted-foreground mt-1">{prompt.description}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Metadata */}
          <div className="flex items-center gap-3 flex-wrap text-sm">
            {prompt.aiProvider && (
              <span className="px-2.5 py-1 bg-muted rounded-full capitalize">
                {prompt.aiProvider}
              </span>
            )}
            {brandName && (
              <span className="px-2.5 py-1 bg-muted rounded-full">
                {brandName}
              </span>
            )}
            {prompt.usageCount > 0 && (
              <span className="text-muted-foreground">
                Used {prompt.usageCount}x
              </span>
            )}
            <span className="text-muted-foreground ml-auto">
              Created {format(new Date(prompt.createdAt), "MMM d, yyyy")}
            </span>
          </div>

          {/* Prompt content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Prompt Content</span>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <div className="p-4 bg-muted/50 rounded-xl border border-border">
              <pre className="text-sm font-mono whitespace-pre-wrap text-foreground">
                {prompt.prompt}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button variant="outline" onClick={() => onEdit(prompt)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            <Button onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-2" />
              Copy to Clipboard
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
