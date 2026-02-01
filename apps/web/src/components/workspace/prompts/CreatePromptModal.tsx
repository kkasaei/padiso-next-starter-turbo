"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import type { Prompt } from "@workspace/db/schema";
import type { AIProvider, PromptCategory } from "./PromptTypes";
import { PROMPT_CATEGORIES, AI_PROVIDERS } from "./PromptConstants";
import { toast } from "sonner";

interface CreatePromptModalProps {
  onClose: () => void;
  onCreate: (prompt: Partial<Prompt> & { brandId: string; name: string; prompt: string }) => void;
  editPrompt?: Prompt | null;
  brands?: Array<{ id: string; brandName: string | null }>;
}

export function CreatePromptModal({ onClose, onCreate, editPrompt, brands = [] }: CreatePromptModalProps) {
  const [name, setName] = useState(editPrompt?.name ?? "");
  const [description, setDescription] = useState(editPrompt?.description ?? "");
  const [promptText, setPromptText] = useState(editPrompt?.prompt ?? "");
  const [aiProvider, setAiProvider] = useState<AIProvider | null>(editPrompt?.aiProvider ?? null);
  const [brandId, setBrandId] = useState<string>(editPrompt?.brandId ?? brands[0]?.id ?? "");

  const isEditing = !!editPrompt;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Please enter a prompt name");
      return;
    }
    
    if (!promptText.trim()) {
      toast.error("Please enter prompt content");
      return;
    }

    onCreate({
      brandId,
      name: name.trim(),
      description: description.trim() || undefined,
      prompt: promptText.trim(),
      aiProvider: aiProvider || undefined,
    });

    toast.success(isEditing ? "Prompt updated successfully" : "Prompt created successfully");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg rounded-2xl bg-background shadow-2xl"
      >
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold">
              {isEditing ? "Edit Prompt" : "Create New Prompt"}
            </h2>
            <Button
              type="button"
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
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g., SEO Meta Description Generator"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                placeholder="Brief description of what this prompt does"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Select value={brandId} onValueChange={(v) => setBrandId(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.brandName || "Unnamed Brand"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aiProvider">AI Provider (optional)</Label>
                <Select value={aiProvider || "none"} onValueChange={(v) => setAiProvider(v === "none" ? null : v as AIProvider)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No provider</SelectItem>
                    {AI_PROVIDERS.map((provider) => (
                      <SelectItem key={provider.value} value={provider.value}>
                        {provider.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="promptText">Prompt Content</Label>
              <Textarea
                id="promptText"
                placeholder="Enter your prompt here. Use {{variable}} for dynamic content."
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Tip: Use {"{{variable}}"} syntax for dynamic placeholders
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Save Changes" : "Create Prompt"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
