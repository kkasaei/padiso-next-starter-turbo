"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { Input } from "@workspace/ui/components/input"
import { Separator } from "@workspace/ui/components/separator"
import {
  ChevronsUpDown,
  Search,
  Check,
  Plus,
  Loader2,
} from "lucide-react"
import { useBrands } from "@/hooks/use-brands"
import { cn } from "@workspace/common/lib"
import { BrandWizard } from "./brand-wizard/BrandWizard"
import Image from "next/image"

/**
 * Get favicon URL from website URL using Google's favicon service
 */
function getFaviconUrl(websiteUrl: string | null | undefined): string | null {
  if (!websiteUrl) return null
  try {
    const url = new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`)
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`
  } catch {
    return null
  }
}

/**
 * Brand icon component with favicon support and fallback
 */
function BrandIcon({ 
  iconUrl, 
  websiteUrl, 
  brandName, 
  brandColor,
  size = "md"
}: { 
  iconUrl?: string | null
  websiteUrl?: string | null
  brandName?: string | null
  brandColor?: string | null
  size?: "sm" | "md"
}) {
  const [imgError, setImgError] = useState(false)
  
  const faviconUrl = iconUrl || getFaviconUrl(websiteUrl)
  const showFavicon = faviconUrl && !imgError
  
  const sizeClasses = size === "sm" 
    ? "w-6 h-6 rounded-md text-xs" 
    : "w-8 h-8 rounded-lg text-sm"
  
  const imgSize = size === "sm" ? 24 : 32
  
  if (showFavicon) {
    return (
      <div className={cn(sizeClasses, "flex items-center justify-center shrink-0 bg-muted overflow-hidden")}>
        <Image
          src={faviconUrl}
          alt={brandName || "Brand"}
          width={imgSize}
          height={imgSize}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    )
  }
  
  return (
    <div 
      className={cn(sizeClasses, "flex items-center justify-center text-white font-semibold shrink-0")}
      style={{ backgroundColor: brandColor || "#6366f1" }}
    >
      {(brandName || "B").charAt(0).toUpperCase()}
    </div>
  )
}

export function BrandSwitcher() {
  const params = useParams()
  const router = useRouter()
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const [wizardOpen, setWizardOpen] = useState(false)
  const [search, setSearch] = useState("")

  const { data: projects = [] } = useBrands()
  const currentProjectId = params.id as string
  const currentProject = projects.find((p) => p.id === currentProjectId)

  const filteredProjects = projects.filter((project) =>
    (project.brandName || "").toLowerCase().includes(search.toLowerCase())
  )

  const handleProjectSwitch = (projectId: string) => {
    setSwitcherOpen(false)
    router.push(`/dashboard/brands/${projectId}`)
  }

  const handleOpenWizard = () => {
    setSwitcherOpen(false)
    setWizardOpen(true)
  }

  return (
    <div className="h-[81px] flex items-center px-3">
      <Popover open={switcherOpen} onOpenChange={setSwitcherOpen}>
        <PopoverTrigger asChild>
          <button className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <BrandIcon
                iconUrl={currentProject?.iconUrl}
                websiteUrl={currentProject?.websiteUrl}
                brandName={currentProject?.brandName}
                brandColor={currentProject?.brandColor}
                size="md"
              />
              <div className="flex flex-col items-start min-w-0">
                <span className="text-sm font-medium truncate w-full">
                  {currentProject?.brandName ?? "Select Brand"}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                  {currentProject?.status === 'initializing' ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Setting up...</span>
                    </>
                  ) : (
                    (() => {
                      const raw = currentProject?.websiteUrl
                      if (!raw) return "Brand"
                      try {
                        return new URL(raw.startsWith("http") ? raw : `https://${raw}`).hostname.replace(/^www\./, "")
                      } catch {
                        return raw.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "")
                      }
                    })()
                  )}
                </span>
              </div>
            </div>
            <ChevronsUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[240px] p-0 rounded-xl shadow-lg"
          align="start"
          side="bottom"
          sideOffset={8}
        >
          {/* Search */}
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search brands..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-sm border-0 bg-muted/50 focus-visible:ring-0"
              />
            </div>
          </div>

          <Separator />

          {/* Brand List */}
          <div className="p-1 max-h-[200px] overflow-auto">
            {filteredProjects.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No brands found
              </div>
            ) : (
              filteredProjects.map((project) => {
                const isActive = project.id === currentProjectId
                const isInitializing = project.status === 'initializing'

                return (
                  <button
                    key={project.id}
                    onClick={() => handleProjectSwitch(project.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-accent",
                      isActive && "bg-accent/50"
                    )}
                  >
                    <div className="relative">
                      <BrandIcon
                        iconUrl={project.iconUrl}
                        websiteUrl={project.websiteUrl}
                        brandName={project.brandName}
                        brandColor={project.brandColor}
                        size="sm"
                      />
                      {isInitializing && (
                        <div className="absolute -right-1 -bottom-1 h-3 w-3 rounded-full bg-blue-500 flex items-center justify-center">
                          <Loader2 className="h-2 w-2 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <span className="truncate block">{project.brandName || "Untitled Brand"}</span>
                      {isInitializing && (
                        <span className="text-xs text-blue-600 dark:text-blue-400">Setting up...</span>
                      )}
                    </div>
                    {isActive && (
                      <Check className="h-4 w-4 text-primary shrink-0" strokeWidth={3} />
                    )}
                  </button>
                )
              })
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="p-1">
            <button
              onClick={handleOpenWizard}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-accent"
            >
              <Plus className="h-5 w-5 text-muted-foreground" />
              <span>Create new brand</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Brand Wizard Modal */}
      {wizardOpen && (
        <BrandWizard 
          onClose={() => setWizardOpen(false)}
        />
      )}
    </div>
  )
}
