"use client"

import { useEffect, useState, useRef, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { BrandHeader } from "./brand-header"
import { BrandTimeline } from "./brand-timeline"
import { BrandCardsView } from "./brand-cards-view"
import { BrandBoardView } from "./brand-board-view"
import { BrandWizard } from "./brand-wizard/BrandWizard"
import { computeFilterCounts, type Project } from "@/lib/mocks/legacy-projects"
import { DEFAULT_VIEW_OPTIONS, type FilterChip, type ViewOptions } from "@/lib/view-options"
import { chipsToParams, paramsToChips } from "@/lib/url/filters"
import { useBrands } from "@/hooks/use-brands"

export function BrandsContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { data: projects = [], isLoading } = useBrands()

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

  const handleProjectCreated = () => {
    setIsWizardOpen(false)
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
  const filteredProjects = useMemo(() => {
    if (isLoading) return []
    let list = (projects as Project[]).slice()

    // Apply showClosedProjects toggle
    if (!viewOptions.showClosedProjects) {
      list = list.filter((p) => p.status !== "completed" && p.status !== "cancelled")
    }

    // Build filter buckets from chips
    const statusSet = new Set<string>()
    const prioritySet = new Set<string>()
    const tagSet = new Set<string>()
    const memberSet = new Set<string>()

    for (const { key, value } of filters) {
      const k = key.trim().toLowerCase()
      const v = value.trim().toLowerCase()
      if (k.startsWith("status")) statusSet.add(v)
      else if (k.startsWith("priority")) prioritySet.add(v)
      else if (k.startsWith("tag")) tagSet.add(v)
      else if (k === "pic" || k.startsWith("member")) memberSet.add(v)
    }

    if (statusSet.size) list = list.filter((p) => statusSet.has(p.status.toLowerCase()))
    if (prioritySet.size) list = list.filter((p) => prioritySet.has(p.priority.toLowerCase()))
    if (tagSet.size) list = list.filter((p) => p.tags.some((t) => tagSet.has(t.toLowerCase())))
    if (memberSet.size) {
      const members = Array.from(memberSet)
      list = list.filter((p) => p.members.some((m) => members.some((mv) => m.toLowerCase().includes(mv))))
    }

    // Ordering
    const sorted = list.slice()
    if (viewOptions.ordering === "alphabetical") sorted.sort((a, b) => a.name.localeCompare(b.name))
    if (viewOptions.ordering === "date") sorted.sort((a, b) => (a.endDate?.getTime() || 0) - (b.endDate?.getTime() || 0))
    return sorted
  }, [filters, viewOptions, projects, isLoading])

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col min-w-0">
        <div className="p-6">
          <div className="text-sm text-muted-foreground">Loading projects...</div>
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
        counts={computeFilterCounts(filteredProjects)}
        viewOptions={viewOptions}
        onViewOptionsChange={setViewOptions}
        onAddProject={openWizard}
      />
      {viewOptions.viewType === "timeline" && <BrandTimeline />}
      {viewOptions.viewType === "list" && <BrandCardsView projects={filteredProjects} onCreateProject={openWizard} />}
      {viewOptions.viewType === "board" && <BrandBoardView projects={filteredProjects} onAddProject={openWizard} />}
      {isWizardOpen && (
        <BrandWizard onClose={closeWizard} onCreate={handleProjectCreated} />
      )}
    </div>
  )
}
