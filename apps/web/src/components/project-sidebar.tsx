"use client"

import { createContext, useContext, useState } from "react"
import {
  CaretLineLeft,
  CaretLineRight,
} from "@phosphor-icons/react/dist/ssr"
import { favouriteProjects } from "@/lib/data/sidebar"
import { cn } from "@/lib/utils"

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

export function ProjectSidebar() {
  const { isOpen } = useProjectSidebar()

  return (
    <div
      className={cn(
        "flex flex-col border-r border-border/40 bg-background transition-all duration-200 ease-in-out overflow-hidden",
        isOpen ? "w-64" : "w-0"
      )}
    >
      <div className="flex flex-col flex-1 min-w-64">
        {/* Favourite Projects */}
        <div className="flex-1 p-2 pt-3">
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
  )
}
