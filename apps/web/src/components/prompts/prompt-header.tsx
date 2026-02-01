"use client";

import { Button } from "@workspace/ui/components/button";
import { Link as LinkIcon, Plus, Sparkles, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { AI_PROVIDERS, mockProjects, type AIProvider } from "@/lib/data/prompts";
import { cn } from "@workspace/ui/lib/utils";

interface PromptFilters {
  projectId: string | null;
  aiProvider: AIProvider | null;
}

interface PromptHeaderProps {
  filters: PromptFilters;
  onFiltersChange: (filters: PromptFilters) => void;
  onAddPrompt?: () => void;
  totalCount: number;
  filteredCount: number;
}

export function PromptHeader({ 
  filters, 
  onFiltersChange, 
  onAddPrompt,
  totalCount,
  filteredCount,
}: PromptHeaderProps) {
  const hasActiveFilters = filters.projectId || filters.aiProvider;

  const clearFilters = () => {
    onFiltersChange({ projectId: null, aiProvider: null });
  };

  return (
    <header className="flex flex-col border-b border-border/40">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <p className="text-base font-medium text-foreground">Prompts</p>
          <span className="text-sm text-muted-foreground">
            {hasActiveFilters ? `${filteredCount} of ${totalCount}` : totalCount}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onAddPrompt}>
            <Plus className="h-4 w-4" strokeWidth={3} />
            Add Prompt
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 pb-3 pt-3">
        <div className="flex items-center gap-3">
          {/* Project Filter */}
          <Select 
            value={filters.projectId || "all"} 
            onValueChange={(v) => onFiltersChange({ ...filters, projectId: v === "all" ? null : v })}
          >
            <SelectTrigger className="h-8 w-[180px] text-sm">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {mockProjects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* AI Provider Filter */}
          <Select 
            value={filters.aiProvider || "all"} 
            onValueChange={(v) => onFiltersChange({ ...filters, aiProvider: v === "all" ? null : v as AIProvider })}
          >
            <SelectTrigger className="h-8 w-[150px] text-sm">
              <SelectValue placeholder="All Providers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              {AI_PROVIDERS.map((provider) => (
                <SelectItem key={provider.value} value={provider.value}>
                  <div className="flex items-center gap-2">
                    <span>{provider.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="h-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="relative rounded-xl border border-border bg-card/80 shadow-sm overflow-hidden">
              <Button className="h-8 gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 relative z-10 px-3">
                <Sparkles className="h-4 w-4 fill-current" />
                Ask AI
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
