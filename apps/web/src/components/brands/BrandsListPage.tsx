"use client"

import { useState, useMemo } from "react"
import { useOrganization, useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import type { Brand } from "@workspace/db/schema"
import { BrandHeader } from "./brand-header"
import { BrandCardsView } from "./brand-cards-view"
import { BrandTableView } from "./brand-table-view"
import { BrandWizard } from "./brand-wizard/BrandWizard"
import { DEFAULT_VIEW_OPTIONS, type ViewOptions } from "@/lib/view-options"
import { useBrands, useCreateBrand } from "@/hooks/use-brands"
import { useWorkspaceByClerkOrgId } from "@/hooks/use-workspace"
import type { BusinessData } from "./brand-wizard/types"

export function BrandsListPage() {
  // Get organization and workspace
  const { organization } = useOrganization()
  const { user } = useUser()
  const { data: workspace } = useWorkspaceByClerkOrgId(organization?.id || "")

  const { data: brandsData = [], isLoading } = useBrands()
  const createBrand = useCreateBrand()
  
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

  const handleBrandCreated = async (data: BusinessData) => {
    if (!workspace?.id) {
      toast.error("No workspace found. Please create or select an organization first.")
      return
    }

    try {
      await createBrand.mutateAsync({
        workspaceId: workspace.id,
        brandName: data.brandName || "Untitled Brand",
        websiteUrl: data.websiteUrl || undefined,
        brandColor: data.brandColor || undefined,
        languages: data.languages?.length ? data.languages : undefined,
        targetAudiences: data.targetAudiences?.length ? data.targetAudiences : undefined,
        businessKeywords: data.businessKeywords?.length ? data.businessKeywords : undefined,
        competitors: data.competitors?.length ? data.competitors : undefined,
        status: "active",
        createdByUserId: user?.id,
      })

      toast.success("Brand created successfully!")
      setIsWizardOpen(false)
    } catch (error) {
      console.error("Failed to create brand:", error)
      toast.error("Failed to create brand. Please try again.")
    }
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
          onCreate={handleBrandCreated} 
        />
      )}
    </div>
  )
}
