"use client"

import { useEffect, useState, useRef, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useOrganization, useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import type { Brand } from "@workspace/db/schema"
import { BrandHeader } from "./BrandHeaderAlt"
import { BrandCardsView } from "./BrandCardsView"
import { BrandBoardView } from "./BrandBoardView"
import { BrandWizard } from "./brand-wizard/BrandWizard"
import { DEFAULT_VIEW_OPTIONS, type FilterChip, type ViewOptions } from "@workspace/common/lib"
import { chipsToParams, paramsToChips } from "@/lib/url/filters"
import { useBrands, useCreateBrand } from "@/hooks/use-brands"
import { useWorkspaceByClerkOrgId } from "@/hooks/use-workspace"
import type { BusinessData } from "./BrandWizard/types"

export function BrandsListPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get organization and workspace
  const { organization } = useOrganization()
  const { user } = useUser()
  const { data: workspace } = useWorkspaceByClerkOrgId(organization?.id || "")

  const { data: brandsData = [], isLoading } = useBrands()
  const createBrand = useCreateBrand()
  
  // Cast to proper Brand type (tRPC serializes dates as strings)
  const brands = brandsData as unknown as Brand[]

  const [viewOptions, setViewOptions] = useState<ViewOptions>(DEFAULT_VIEW_OPTIONS)

  const [filters, setFilters] = useState<FilterChip[]>([])

  const [isWizardOpen, setIsWizardOpen] = useState(false)

  const isSyncingRef = useRef(false)
  const prevParamsRef = useRef<string>("")

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

  const removeFilter = (key: string, value: string) => {
    const next = filters.filter((f) => !(f.key === key && f.value === value))
    setFilters(next)
    replaceUrlFromChips(next)
  }

  const applyFilters = (chips: FilterChip[]) => {
    setFilters(chips)
    replaceUrlFromChips(chips)
  }

  useEffect(() => {
    const currentParams = searchParams.toString()

    // Only sync if this is the first load or if params actually changed (not from our own update)
    if (prevParamsRef.current === currentParams) return

    // If we just made an update, skip this sync to avoid feedback loop
    if (isSyncingRef.current) {
      isSyncingRef.current = false
      return
    }

    prevParamsRef.current = currentParams
    const params = new URLSearchParams(searchParams.toString())
    const chips = paramsToChips(params)
    setFilters(chips)
  }, [searchParams])

  const replaceUrlFromChips = (chips: FilterChip[]) => {
    const params = chipsToParams(chips)
    const qs = params.toString()
    const url = qs ? `${pathname}?${qs}` : pathname

    isSyncingRef.current = true
    prevParamsRef.current = qs
    router.replace(url, { scroll: false })
  }
  const filteredBrands = useMemo(() => {
    if (isLoading) return []
    let list = [...brands]

    // Apply showClosedProjects toggle
    if (!viewOptions.showClosedProjects) {
      list = list.filter((b) => b.status !== "completed" && b.status !== "cancelled")
    }

    // Build filter buckets from chips
    const statusSet = new Set<string>()

    for (const { key, value } of filters) {
      const k = key.trim().toLowerCase()
      const v = value.trim().toLowerCase()
      if (k.startsWith("status")) statusSet.add(v)
    }

    if (statusSet.size) {
      list = list.filter((b) => statusSet.has(b.status.toLowerCase()))
    }

    // Ordering
    if (viewOptions.ordering === "alphabetical") {
      list.sort((a, b) => (a.brandName || "").localeCompare(b.brandName || ""))
    }
    if (viewOptions.ordering === "date") {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    
    return list
  }, [filters, viewOptions, isLoading, brands])

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
        filters={filters}
        onRemoveFilter={removeFilter}
        onFiltersChange={applyFilters}
        counts={{}}
        viewOptions={viewOptions}
        onViewOptionsChange={setViewOptions}
        onAddProject={openWizard}
      />
      {viewOptions.viewType === "list" && (
        <BrandCardsView 
          brands={filteredBrands as Brand[]} 
          loading={isLoading} 
          onCreateBrand={openWizard} 
        />
      )}
      {viewOptions.viewType === "table" && (
        <div className="flex flex-col items-center justify-center h-64 text-center p-8">
          <p className="text-muted-foreground mb-2">Table view coming soon</p>
          <p className="text-sm text-muted-foreground">We&apos;re working on a table view for brands</p>
        </div>
      )}
      {viewOptions.viewType === "board" && (
        <BrandBoardView 
          brands={filteredBrands as Brand[]} 
          onAddBrand={openWizard} 
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
