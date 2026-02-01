"use client"

import { Button } from "@workspace/ui/components/button"
import { FilterChip } from "@/components/filter-chip"
import { ViewOptionsPopover } from "@/components/view-options-popover"
import { FilterPopover } from "@/components/filter-popover"
import { ChipOverflow } from "@/components/chip-overflow"
import { Link as LinkIcon, Plus, Sparkles } from "lucide-react"
import type { FilterCounts } from "@/lib/data/projects"
import type { FilterChip as FilterChipType, ViewOptions } from "@/lib/view-options"

interface ProjectHeaderProps {
  filters: FilterChipType[]
  onRemoveFilter: (key: string, value: string) => void
  onFiltersChange: (chips: FilterChipType[]) => void
  counts?: FilterCounts
  viewOptions: ViewOptions
  onViewOptionsChange: (options: ViewOptions) => void
  onAddProject?: () => void
}

export function ProjectHeader({ filters, onRemoveFilter, onFiltersChange, counts, viewOptions, onViewOptionsChange, onAddProject }: ProjectHeaderProps) {
  return (
    <header className="flex flex-col border-b border-border/40">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <p className="text-base font-medium text-foreground">Brands</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onAddProject}>
            <Plus className="h-4 w-4 stroke-[3]" />
            Add brand
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 pb-3 pt-3">
        <div className="flex items-center gap-2">
          <FilterPopover
            initialChips={filters}
            onApply={onFiltersChange}
            onClear={() => onFiltersChange([])}
            counts={counts}
          />
          <ChipOverflow chips={filters} onRemove={onRemoveFilter} maxVisible={6} />
        </div>
        <div className="flex items-center gap-2">
          <ViewOptionsPopover options={viewOptions} onChange={onViewOptionsChange} />
        </div>
      </div>
    </header>
  )
}
