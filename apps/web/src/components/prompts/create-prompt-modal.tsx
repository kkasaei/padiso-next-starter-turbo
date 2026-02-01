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
import { PROMPT_CATEGORIES, AI_PROVIDERS, mockProjects, type Prompt, type PromptCategory, type AIProvider } from "@/lib/data/prompts";
import { toast } from "sonner";

interface CreatePromptModalProps {
  onClose: () => void;
  onCreate: (prompt: Omit<Prompt, "id" | "createdAt" | "updatedAt">) => void;
  editPrompt?: Prompt | null;
}

export function CreatePromptModal({ onClose, onCreate, editPrompt }: CreatePromptModalProps) {
  const [name, setName] = useState(editPrompt?.name ?? "");
  const [description, setDescription] = useState(editPrompt?.description ?? "");
  const [content, setContent] = useState(editPrompt?.content ?? "");
  const [category, setCategory] = useState<PromptCategory>(editPrompt?.category ?? "general");
  const [aiProvider, setAiProvider] = useState<AIProvider>(editPrompt?.aiProvider ?? "claude");
  const [projectId, setProjectId] = useState<string | null>(editPrompt?.projectId ?? null);
  const [isGlobal, setIsGlobal] = useState(editPrompt?.isGlobal ?? true);

  const isEditing = !!editPrompt;

  const selectedProject = projectId ? mockProjects.find(p => p.id === projectId) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Please enter a prompt name");
      return;
    }
    
    if (!content.trim()) {
      toast.error("Please enter prompt content");
      return;
    }

    onCreate({
      name: name.trim(),
      description: description.trim() || undefined,
      content: content.trim(),
      category,
      aiProvider,
      projectId: projectId || undefined,
      projectName: selectedProject?.name,
      isGlobal,
      isFromProject: !!projectId,
      tags: [],
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
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as PromptCategory)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROMPT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aiProvider">AI Provider</Label>
                <Select value={aiProvider} onValueChange={(v) => setAiProvider(v as AIProvider)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
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
              <Label htmlFor="project">Project (optional)</Label>
              <Select value={projectId || "none"} onValueChange={(v) => setProjectId(v === "none" ? null : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="No project (global prompt)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No project (global prompt)</SelectItem>
                  {mockProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Assign to a project or leave empty for a global prompt
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Prompt Content</Label>
              <Textarea
                id="content"
                placeholder="Enter your prompt here. Use {{variable}} for dynamic content."
                value={content}
                onChange={(e) => setContent(e.target.value)}
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
