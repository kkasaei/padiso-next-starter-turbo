"use client";

import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import Image from "next/image";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import type { Prompt } from "@workspace/db/schema";
import type { AIProvider } from "./PromptTypes";
import { AI_PROVIDERS, getProviderIcon } from "./PromptConstants";
import { QuickCreateModalLayout } from "./QuickCreateModalLayout";
import { GenericPicker } from "./PromptPickers";
import { PromptDescriptionEditor } from "./PromptDescriptionEditor";
import { toast } from "sonner";

interface CreatePromptModalProps {
  onClose: () => void;
  onCreate: (prompt: Partial<Prompt> & { brandId: string; name: string; prompt: string }) => void;
  editPrompt?: Prompt | null;
  brands?: Array<{ id: string; brandName: string | null }>;
}

export function CreatePromptModal({ onClose, onCreate, editPrompt, brands = [] }: CreatePromptModalProps) {
  const [name, setName] = useState(editPrompt?.name || "");
  const [promptText, setPromptText] = useState(editPrompt?.prompt || "");
  const [aiProvider, setAiProvider] = useState<AIProvider | null>(editPrompt?.aiProvider || null);
  const [brandId, setBrandId] = useState<string>(editPrompt?.brandId || brands[0]?.id || "");
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);

  const isEditing = !!editPrompt;

  // Reset form when modal opens/closes
  useEffect(() => {
    if (editPrompt) {
      setName(editPrompt.name);
      setPromptText(editPrompt.prompt);
      setAiProvider(editPrompt.aiProvider || null);
      setBrandId(editPrompt.brandId);
    } else {
      setName("");
      setPromptText("");
      setAiProvider(null);
      setBrandId(brands[0]?.id || "");
    }
  }, [editPrompt, brands]);

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Please enter a prompt name");
      return;
    }
    
    if (!promptText.trim()) {
      toast.error("Please enter prompt content");
      return;
    }

    if (!brandId) {
      toast.error("Please select a brand");
      return;
    }

    onCreate({
      brandId,
      name: name.trim(),
      prompt: promptText.trim(),
      aiProvider: aiProvider || undefined,
    });

    onClose();
  };

  const brandOptions = brands.map(b => ({ 
    id: b.id, 
    label: b.brandName || 'Untitled Brand' 
  }));

  const selectedBrand = brandOptions.find(b => b.id === brandId);

  return (
    <QuickCreateModalLayout
      open={true}
      onClose={onClose}
      isDescriptionExpanded={isPromptExpanded}
      onSubmitShortcut={handleSubmit}
    >
      {/* Close Button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute right-4 top-3 opacity-70 hover:opacity-100 rounded-xl z-10"
      >
        <X className="size-4 text-muted-foreground" />
      </Button>

      {/* Title Input */}
      <div className="flex flex-col gap-2 w-full shrink-0 mt-2">
        <div className="flex gap-1 h-10 items-center w-full">
          <input
            id="prompt-title"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={isEditing ? "Edit prompt name" : "Prompt name (e.g., SEO Meta Generator)"}
            className="w-full font-normal leading-7 text-foreground placeholder:text-muted-foreground text-xl outline-none bg-transparent border-none p-0"
            autoComplete="off"
            autoFocus
          />
        </div>
      </div>

      {/* Main Prompt Content Editor */}
      <PromptDescriptionEditor
        value={promptText}
        onChange={setPromptText}
        onExpandChange={setIsPromptExpanded}
        placeholder="Enter your prompt here. Use {{variable}} for dynamic content..."
        showTemplates={false}
      />

      {/* Property Pickers */}
      <div className="flex flex-wrap gap-2.5 items-start w-full shrink-0">
        {/* Brand Picker */}
        <GenericPicker
          items={brandOptions}
          onSelect={(brand) => setBrandId(brand.id)}
          selectedId={brandId}
          placeholder="Select brand..."
          renderItem={(item, isSelected) => (
            <div className="flex items-center gap-2 w-full">
              <span className="flex-1">{item.label}</span>
              {isSelected && <span>✓</span>}
            </div>
          )}
          trigger={
            <button className="bg-muted flex gap-2 h-9 items-center px-3 py-2 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <Sparkles className="size-4 text-muted-foreground" />
              <span className="font-medium text-foreground text-sm leading-5">
                {selectedBrand?.label || "Select Brand"}
              </span>
            </button>
          }
        />

        {/* AI Provider Picker */}
        <GenericPicker
          items={AI_PROVIDERS.map(p => ({ id: p.value, label: p.label, icon: p.icon }))}
          onSelect={(provider) => setAiProvider(provider.id as AIProvider)}
          selectedId={aiProvider || undefined}
          placeholder="Select AI provider..."
          renderItem={(item: any, isSelected) => (
            <div className="flex items-center gap-2 w-full">
              <Image
                src={item.icon}
                alt={item.label}
                width={16}
                height={16}
                className="flex-shrink-0"
              />
              <span className="flex-1">{item.label}</span>
              {isSelected && <span>✓</span>}
            </div>
          )}
          trigger={
            <button className="bg-background flex gap-2 h-9 items-center px-3 py-2 rounded-lg border border-border hover:border-primary/50 transition-colors">
              {aiProvider ? (
                <>
                  <Image
                    src={getProviderIcon(aiProvider)}
                    alt={aiProvider}
                    width={16}
                    height={16}
                    className="flex-shrink-0"
                  />
                  <span className="font-medium text-foreground text-sm leading-5">
                    {AI_PROVIDERS.find(p => p.value === aiProvider)?.label}
                  </span>
                </>
              ) : (
                <span className="font-medium text-muted-foreground text-sm leading-5">
                  No Provider
                </span>
              )}
            </button>
          }
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 w-full pt-4 shrink-0 border-t border-border/40">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {isEditing ? "Save Changes" : "Create Prompt"}
        </Button>
      </div>
    </QuickCreateModalLayout>
  );
}
