"use client";

import { Button } from "@workspace/ui/components/button";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import { FilterPopover, type FilterChip as FilterChipType } from "./FilterPopover";
import { FilterChip } from "./FilterChip";
import { PromptsViewOptionsPopover } from "./PromptsViewOptionsPopover";

type ViewOptions = {
  viewType: "list" | "table";
  ordering: "alphabetical" | "date" | "provider" | "project" | "name";
  showClosedProjects: boolean;
};

interface PromptFilters {
  filterChips: FilterChipType[];
}

interface PromptHeaderProps {
  filters: PromptFilters;
  onFiltersChange: (filters: PromptFilters) => void;
  viewOptions?: ViewOptions;
  onViewOptionsChange?: (options: ViewOptions) => void;
  onAddPrompt?: () => void;
  totalCount: number;
  filteredCount: number;
  filterCounts?: {
    projects?: Record<string, number>;
    providers?: Record<string, number>;
  };
  projects?: Array<{ id: string; name: string }>;
  providers?: Array<{ value: string; label: string; color: string; icon: string }>;
}

export function PromptHeader({ 
  filters, 
  onFiltersChange,
  viewOptions,
  onViewOptionsChange,
  onAddPrompt,
  totalCount,
  filteredCount,
  filterCounts,
  projects = [],
  providers = [],
}: PromptHeaderProps) {
  const hasActiveFilters = filters.filterChips.length > 0;

  const clearFilters = () => {
    onFiltersChange({ filterChips: [] });
  };

  const handleFilterChipsApply = (chips: FilterChipType[]) => {
    onFiltersChange({ filterChips: chips });
  };

  const handleFilterChipRemove = (chip: FilterChipType) => {
    onFiltersChange({
      filterChips: filters.filterChips.filter(
        (c) => !(c.key === chip.key && c.value === chip.value)
      ),
    });
  };

  // Get display label for filter chips
  const getChipLabel = (chip: FilterChipType) => {
    const key = chip.key.toLowerCase();
    
    if (key === "project" || key === "projects") {
      const project = projects.find(p => p.id === chip.value);
      return `${chip.key}: ${project?.name || chip.value}`;
    }
    
    if (key === "provider" || key === "providers") {
      const provider = providers.find(p => p.value === chip.value);
      return `${chip.key}: ${provider?.label || chip.value}`;
    }
    
    return `${chip.key}: ${chip.value}`;
  };

  // Get provider icon for filter chips
  const getChipIcon = (chip: FilterChipType) => {
    const key = chip.key.toLowerCase();
    
    if (key === "provider" || key === "providers") {
      const provider = providers.find(p => p.value === chip.value);
      if (provider && provider.icon) {
        return (
          <Image
            src={provider.icon}
            alt={provider.label}
            width={12}
            height={12}
            className="flex-shrink-0"
          />
        );
      }
    }
    
    return undefined;
  };

  return (
    <header className="flex flex-col border-b border-border/40">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <p className="text-base font-medium text-foreground">Prompts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onAddPrompt}>
            <Plus className="h-4 w-4" strokeWidth={3} />
            Add Prompt
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 pb-3 pt-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter Popover */}
          <FilterPopover
            initialChips={filters.filterChips}
            onApply={handleFilterChipsApply}
            onClear={() => handleFilterChipsApply([])}
            counts={filterCounts}
            projects={projects}
            providers={providers}
          />

          {/* Filter Chips */}
          {filters.filterChips.map((chip, idx) => (
            <FilterChip
              key={`${chip.key}-${chip.value}-${idx}`}
              label={getChipLabel(chip)}
              icon={getChipIcon(chip)}
              onRemove={() => handleFilterChipRemove(chip)}
            />
          ))}

          {/* Clear All Filters */}
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="h-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {/* View Options */}
        <div className="flex items-center gap-2">
          {viewOptions && onViewOptionsChange && (
            <PromptsViewOptionsPopover 
              options={viewOptions} 
              onChange={onViewOptionsChange}
              allowedViewTypes={["list", "table"]}
            />
          )}
        </div>
      </div>
    </header>
  );
}
