"use client"

import { useState, useMemo } from "react"
import type { Brand } from "@workspace/db/schema"
import { BrandHeader } from "./BrandHeaderAlt"
import { BrandCardsView } from "./BrandCardsView"
import { BrandTableView } from "./BrandTableView"
import { BrandWizard } from "./brand-wizard/BrandWizard"
import { DEFAULT_VIEW_OPTIONS, type ViewOptions } from "@workspace/common/lib"
import { useBrands } from "@/hooks/use-brands"
import { useBrandLimit } from "@/hooks/use-billing-guard"
import { UpgradePlanModal } from "@/components/shared/UpgradePlanModal"

// Generate a consistent hash from brand ID for deterministic mock data
function getHashFromId(brandId: string): number {
  let hash = 0
  for (let i = 0; i < brandId.length; i++) {
    hash = ((hash << 5) - hash) + brandId.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash)
}

// Generate mock data for each brand
function getMockBrandData(brandId: string) {
  const hash = getHashFromId(brandId)
  const now = new Date()
  
  // AI Score: 66-95
  const aiScore = 66 + (hash % 30)
  
  // Last scan: random time in the past 48 hours (0-48 hours ago)
  const lastScanHoursAgo = (hash % 48) + 1
  const lastScanAt = new Date(now.getTime() - lastScanHoursAgo * 60 * 60 * 1000)
  
  // Next scan: ~7 days from now (5-9 days, randomized)
  const nextScanDays = 5 + (hash % 5)
  const nextScanAt = new Date(now.getTime() + nextScanDays * 24 * 60 * 60 * 1000)
  
  return { aiScore, lastScanAt, nextScanAt }
}

export function BrandsListPage() {
  const { data: brandsData = [], isLoading } = useBrands()
  const { canCreateBrand, currentBrands, maxBrands, hasReachedLimit } = useBrandLimit()
  
  // Cast to proper Brand type (tRPC serializes dates as strings)
  // Add mock data (AI scores, scan dates) to each brand
  const brands = (brandsData as unknown as Brand[]).map(brand => {
    const mockData = getMockBrandData(brand.id)
    return {
      ...brand,
      visibilityScore: brand.visibilityScore || mockData.aiScore,
      lastScanAt: brand.lastScanAt || mockData.lastScanAt,
      nextScanAt: brand.nextScanAt || mockData.nextScanAt,
    }
  })

  const [viewOptions, setViewOptions] = useState<ViewOptions>(DEFAULT_VIEW_OPTIONS)
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)

  const openWizard = () => {
    if (!canCreateBrand) {
      setIsUpgradeModalOpen(true)
      return
    }
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
        currentBrands={currentBrands}
        maxBrands={maxBrands}
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
      <UpgradePlanModal
        open={isUpgradeModalOpen}
        onOpenChange={setIsUpgradeModalOpen}
        resourceType="brand"
        current={currentBrands}
        limit={maxBrands}
      />
    </div>
  )
}
