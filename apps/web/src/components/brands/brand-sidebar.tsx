"use client"

import { createContext, useContext, useState } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { Input } from "@workspace/ui/components/input"
import { Separator } from "@workspace/ui/components/separator"
import {
  PanelLeftClose,
  PanelLeftOpen,
  ChevronsUpDown,
  Search,
  Check,
  Plus,
} from "lucide-react"
import { useBrands } from "@/hooks/use-brands"
import { favouriteProjects } from "@/lib/data/sidebar"
import { cn } from "@/lib/utils"
import { brandNavItems } from "@/routes"
import { FavouriteBrands } from "./FavouriteBrands"

// Context for sidebar state
type BrandSidebarContextType = {
  isOpen: boolean
  toggle: () => void
}

const BrandSidebarContext = createContext<BrandSidebarContextType | null>(null)

export function useBrandSidebar() {
  const context = useContext(BrandSidebarContext)
  if (!context) {
    throw new Error("useBrandSidebar must be used within BrandSidebarProvider")
  }
  return context
}

export function BrandSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)
  const toggle = () => setIsOpen((prev) => !prev)

  return (
    <BrandSidebarContext.Provider value={{ isOpen, toggle }}>
      {children}
    </BrandSidebarContext.Provider>
  )
}

export function BrandSidebarTrigger({ className }: { className?: string }) {
  const { isOpen, toggle } = useBrandSidebar()

  return (
    <button
      onClick={toggle}
      className={cn(
        "h-8 w-8 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground transition-colors",
        className
      )}
    >
      {isOpen ? (
        <PanelLeftClose className="h-4 w-4" />
      ) : (
        <PanelLeftOpen className="h-4 w-4" />
      )}
    </button>
  )
}

interface BrandSidebarToggleProps {
  /** When true, only shows when sidebar is open. When false, only shows when sidebar is closed. */
  showWhenOpen?: boolean
  className?: string
}

export function BrandSidebarToggle({ showWhenOpen = true, className }: BrandSidebarToggleProps) {
  const { isOpen, toggle } = useBrandSidebar()

  // Only render based on showWhenOpen prop
  if (showWhenOpen && !isOpen) return null
  if (!showWhenOpen && isOpen) return null

  return (
    <button
      onClick={toggle}
      className={cn(
        "absolute top-[40px] -translate-y-1/2 z-50",
        "h-6 w-6 flex items-center justify-center",
        "rounded-full bg-background border border-border/40 shadow-sm",
        "text-muted-foreground hover:text-foreground hover:bg-accent",
        "transition-all duration-200",
        isOpen ? "-right-3" : "-left-3",
        className
      )}
    >
      {isOpen ? (
        <PanelLeftClose className="h-3 w-3" />
      ) : (
        <PanelLeftOpen className="h-3 w-3" />
      )}
    </button>
  )
}

export function BrandSidebar() {
  const { isOpen } = useBrandSidebar()
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const [switcherOpen, setSwitcherOpen] = useState(false)
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

  const isNavItemActive = (navPath: string) => {
    const basePath = `/dashboard/brands/${currentProjectId}`
    if (navPath === "") {
      return pathname === basePath
    }
    return pathname.startsWith(`${basePath}${navPath}`)
  }

  return (
    <div className="relative overflow-visible">
      <BrandSidebarToggle />
      
      <div
        className={cn(
          "flex flex-col border-r border-border/40 bg-background transition-all duration-200 ease-in-out overflow-hidden",
          isOpen ? "w-64" : "w-0"
        )}
      >
      <div className="flex flex-col flex-1 min-w-64">
        {/* Project Switcher */}
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
                      {currentProject?.status ?? "Project"}
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
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-8 pl-8 text-sm border-0 bg-muted/50 focus-visible:ring-0"
                  />
                </div>
              </div>

              <Separator />

              {/* Project List */}
              <div className="p-1 max-h-[200px] overflow-auto">
                {filteredProjects.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No projects found
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
                <Link
                  href="/dashboard/brands/new"
                  onClick={() => setSwitcherOpen(false)}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-accent"
                >
                  <Plus className="h-5 w-5 text-muted-foreground" />
                  <span>Create new brand</span>
                </Link>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Separator className="mx-3" />

        {/* Navigation Items */}
        <nav className="p-2">
          <ul className="flex flex-col gap-1">
            {brandNavItems.map((item) => {
              // Handle separator
              if ('isSeparator' in item && item.isSeparator) {
                return <Separator key={item.id} className="my-2" />
              }

              const Icon = item.icon
              const isActive = isNavItemActive(item.path)
              const href = `/dashboard/brands/${currentProjectId}${item.path}`

              return (
                <li key={item.id}>
                  <Link
                    href={href}
                    className={cn(
                      "flex w-full items-center gap-3 h-9 rounded-lg px-3 text-sm transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                    )}
                  >
                    {Icon && <Icon className="h-[18px] w-[18px]" />}
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {favouriteProjects.length > 0 && (
          <>
            <Separator className="mx-3" />
            <FavouriteBrands brands={favouriteProjects} />
          </>
        )}
      </div>
      </div>

    </div>
  )
}
