"use client"

import { Button } from "@workspace/ui/components/button"
import { ViewOptionsPopover } from "@/components/brands/view-options-popover"
import { Plus } from "lucide-react"
import type { ViewOptions } from "@/lib/view-options"

interface BrandHeaderProps {
  viewOptions: ViewOptions
  onViewOptionsChange: (options: ViewOptions) => void
  onAddBrand?: () => void
}

export function BrandHeader({ 
  viewOptions, 
  onViewOptionsChange, 
  onAddBrand 
}: BrandHeaderProps) {
  return (
    <header className="flex flex-col border-b border-border/40">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <p className="text-base font-medium text-foreground">Brands</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onAddBrand}>
            <Plus className="h-4 w-4 stroke-[3]" />
            Add brand
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-end px-4 pb-3 pt-3 ">
        <div className="flex items-center gap-2">
          <ViewOptionsPopover options={viewOptions} onChange={onViewOptionsChange} />
        </div>
      </div>
    </header>
  )
}
