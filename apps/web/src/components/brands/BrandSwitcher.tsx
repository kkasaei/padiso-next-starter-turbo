"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useOrganization, useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { Input } from "@workspace/ui/components/input"
import { Separator } from "@workspace/ui/components/separator"
import {
  ChevronsUpDown,
  Search,
  Check,
  Plus,
} from "lucide-react"
import { useBrands } from "@/hooks/use-brands"
import { cn } from "@workspace/common/lib"
import { BrandWizard } from "./brand-wizard/BrandWizard"

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
              <div 
                className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-sm font-semibold shrink-0"
                style={{ backgroundColor: currentProject?.brandColor || "#6366f1" }}
              >
                {currentProject?.brandName?.charAt(0).toUpperCase() ?? "B"}
              </div>
              <div className="flex flex-col items-start min-w-0">
                <span className="text-sm font-medium truncate w-full">
                  {currentProject?.brandName ?? "Select Brand"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {currentProject?.status ?? "Brand"}
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

                return (
                  <button
                    key={project.id}
                    onClick={() => handleProjectSwitch(project.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-accent",
                      isActive && "bg-accent/50"
                    )}
                  >
                    <div 
                      className="h-6 w-6 rounded-md flex items-center justify-center text-white text-xs font-semibold"
                      style={{ backgroundColor: project.brandColor || "#6366f1" }}
                    >
                      {(project.brandName || "B").charAt(0).toUpperCase()}
                    </div>
                    <span className="flex-1 text-left truncate">{project.brandName || "Untitled Brand"}</span>
                    {isActive && (
                      <Check className="h-4 w-4 text-primary" strokeWidth={3} />
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
