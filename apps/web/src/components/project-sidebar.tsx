"use client"

import { createContext, useContext, useState } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { Input } from "@workspace/ui/components/input"
import { Separator } from "@workspace/ui/components/separator"
import {
  CaretLineLeft,
  CaretLineRight,
  CaretUpDown,
  MagnifyingGlass,
  Check,
  Plus,
} from "@phosphor-icons/react/dist/ssr"
import { useProjects } from "@/hooks/use-projects"
import { favouriteProjects } from "@/lib/data/sidebar"
import { cn } from "@/lib/utils"
import { projectNavItems } from "@/routes"

// Context for sidebar state
type ProjectSidebarContextType = {
  isOpen: boolean
  toggle: () => void
}

const ProjectSidebarContext = createContext<ProjectSidebarContextType | null>(null)

export function useProjectSidebar() {
  const context = useContext(ProjectSidebarContext)
  if (!context) {
    throw new Error("useProjectSidebar must be used within ProjectSidebarProvider")
  }
  return context
}

export function ProjectSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)
  const toggle = () => setIsOpen((prev) => !prev)

  return (
    <ProjectSidebarContext.Provider value={{ isOpen, toggle }}>
      {children}
    </ProjectSidebarContext.Provider>
  )
}

export function ProjectSidebarTrigger({ className }: { className?: string }) {
  const { isOpen, toggle } = useProjectSidebar()

  return (
    <button
      onClick={toggle}
      className={cn(
        "h-8 w-8 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground transition-colors",
        className
      )}
    >
      {isOpen ? (
        <CaretLineLeft className="h-4 w-4" />
      ) : (
        <CaretLineRight className="h-4 w-4" />
      )}
    </button>
  )
}

interface ProjectSidebarToggleProps {
  /** When true, only shows when sidebar is open. When false, only shows when sidebar is closed. */
  showWhenOpen?: boolean
  className?: string
}

export function ProjectSidebarToggle({ showWhenOpen = true, className }: ProjectSidebarToggleProps) {
  const { isOpen, toggle } = useProjectSidebar()

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
        <CaretLineLeft className="h-3 w-3" />
      ) : (
        <CaretLineRight className="h-3 w-3" />
      )}
    </button>
  )
}

export function ProjectSidebar() {
  const { isOpen } = useProjectSidebar()
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const [search, setSearch] = useState("")

  const { data: projects = [] } = useProjects()
  const currentProjectId = params.id as string

  const currentProject = projects.find((p) => p.id === currentProjectId)

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleProjectSwitch = (projectId: string) => {
    setSwitcherOpen(false)
    router.push(`/dashboard/projects/${projectId}`)
  }

  const isNavItemActive = (navPath: string) => {
    const basePath = `/dashboard/projects/${currentProjectId}`
    if (navPath === "") {
      return pathname === basePath
    }
    return pathname.startsWith(`${basePath}${navPath}`)
  }

  return (
    <div className="relative overflow-visible">
      <ProjectSidebarToggle />
      
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
                    style={{ backgroundColor: currentProject?.tags?.[0] ? getColorFromTag(currentProject.tags[0]) : "#6366f1" }}
                  >
                    {currentProject?.name?.charAt(0).toUpperCase() ?? "P"}
                  </div>
                  <div className="flex flex-col items-start min-w-0">
                    <span className="text-sm font-medium truncate w-full">
                      {currentProject?.name ?? "Select Project"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {currentProject?.status ?? "Project"}
                    </span>
                  </div>
                </div>
                <CaretUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
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
                  <MagnifyingGlass className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                          style={{ backgroundColor: project.tags?.[0] ? getColorFromTag(project.tags[0]) : "#6366f1" }}
                        >
                          {project.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="flex-1 text-left truncate">{project.name}</span>
                        {isActive && (
                          <Check className="h-4 w-4 text-primary" weight="bold" />
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
                  href="/dashboard/projects/new"
                  onClick={() => setSwitcherOpen(false)}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-accent"
                >
                  <Plus className="h-5 w-5 text-muted-foreground" />
                  <span>Create new project</span>
                </Link>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Separator className="mx-3" />

        {/* Navigation Items */}
        <nav className="p-2">
          <ul className="flex flex-col gap-1">
            {projectNavItems.map((item) => {
              // Handle separator
              if ('isSeparator' in item && item.isSeparator) {
                return <Separator key={item.id} className="my-2" />
              }

              const Icon = item.icon
              const isActive = isNavItemActive(item.path)
              const href = `/dashboard/projects/${currentProjectId}${item.path}`

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

        <Separator className="mx-3" />

        {/* Favourite Projects */}
        <div className="flex-1 p-2 overflow-y-auto">
          <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
            Favourite Projects
          </p>
          <ul className="flex flex-col gap-1">
            {favouriteProjects.map((project) => (
              <li key={project.name}>
                <button className="flex w-full items-center gap-2 h-9 rounded-lg px-3 hover:bg-accent transition-colors group">
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="flex-1 truncate text-sm text-left">{project.name}</span>
                  <span className="opacity-0 group-hover:opacity-100 rounded p-0.5 hover:bg-accent">
                    <span className="text-muted-foreground text-lg">···</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      </div>

    </div>
  )
}

// Helper function to generate consistent colors from tags
function getColorFromTag(tag: string): string {
  const colors: Record<string, string> = {
    "web-app": "#6366f1",
    "mobile": "#10b981",
    "design": "#f59e0b",
    "marketing": "#ec4899",
    "development": "#3b82f6",
    "research": "#8b5cf6",
  }
  return colors[tag.toLowerCase()] ?? "#6366f1"
}
