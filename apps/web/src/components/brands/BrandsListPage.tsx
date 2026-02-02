"use client"

import { useState, useMemo } from "react"
import { useOrganization, useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import type { Brand } from "@workspace/db/schema"
import { BrandHeader } from "./BrandHeaderAlt"
import { BrandCardsView } from "./BrandCardsView"
import { BrandTableView } from "./BrandTableView"
import { BrandWizard } from "./brand-wizard/BrandWizard"
import { DEFAULT_VIEW_OPTIONS, type ViewOptions } from "@workspace/common/lib"
import { useBrands } from "@/hooks/use-brands"

export function BrandsListPage() {
  const { data: brandsData = [], isLoading } = useBrands()
  
  // Cast to proper Brand type (tRPC serializes dates as strings)
  const brands = brandsData as unknown as Brand[]

  const [viewOptions, setViewOptions] = useState<ViewOptions>(DEFAULT_VIEW_OPTIONS)
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  const openWizard = () => {
    setIsWizardOpen(true)
  }

  const closeWizard = () => {
    setIsWizardOpen(false)
  }

  const filteredBrands = useMemo(() => {
    if (isLoading) return []
    let list = [...brands]

    // Apply showClosedProjects toggle
    if (!viewOptions.showClosedProjects) {
      list = list.filter((b) => b.status !== "completed" && b.status !== "cancelled")
    }

    // Ordering
    if (viewOptions.ordering === "alphabetical") {
      list.sort((a, b) => (a.brandName || "").localeCompare(b.brandName || ""))
    }
    if (viewOptions.ordering === "date") {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    
    return list
  }, [viewOptions, isLoading, brands])

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col min-w-0">
        <div className="p-6">
          <div className="text-sm text-muted-foreground">Loading brands...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col min-w-0">
      <BrandHeader
        viewOptions={viewOptions}
        onViewOptionsChange={setViewOptions}
        onAddBrand={openWizard}
      />
      {viewOptions.viewType === "list" && (
        <BrandCardsView 
          brands={filteredBrands as Brand[]} 
          loading={isLoading} 
          onCreateBrand={openWizard} 
        />
      )}
      {viewOptions.viewType === "table" && (
        <BrandTableView 
          brands={filteredBrands as Brand[]} 
          loading={isLoading} 
        />
      )}
      {isWizardOpen && (
        <BrandWizard 
          onClose={closeWizard}
        />
      )}
    </div>
  )
}
