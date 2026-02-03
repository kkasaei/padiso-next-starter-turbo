"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Separator } from "@workspace/ui/components/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip"
import {
  PanelLeftClose,
  PanelLeftOpen,
  Loader2,
} from "lucide-react"
import { useBrands, useBrand } from "@/hooks/use-brands"
import { cn } from "@workspace/common/lib"
import { brandNavItems } from "@workspace/common"
import { FavouriteBrands } from "./FavouriteBrands"
import { BrandSwitcher } from "./BrandSwitcher"

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
  const searchParams = useSearchParams()

  const { data: projects = [] } = useBrands()
  const currentProjectId = params.id as string
  
  // Get current brand to check if it's initializing
  const { data: currentBrand } = useBrand(currentProjectId)
  
  // Debug: Add ?debug=initializing to URL to test the setup loading state
  const debugInitializing = searchParams.get('debug') === 'initializing'
  const isInitializing = currentBrand?.status === 'initializing' || debugInitializing

  const favouriteBrands = projects.filter((project) => project.isFavourite)

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
        {/* Brand Switcher - Always enabled so users can switch to other brands */}
        <BrandSwitcher />

        <Separator className="mx-3" />

        {/* Initializing indicator */}
        {isInitializing && (
          <div className="px-3 py-2">
            <div className="flex items-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 px-3 py-2 text-xs text-blue-700 dark:text-blue-300">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Setting up...</span>
            </div>
          </div>
        )}

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
              
              // Disable navigation when brand is initializing (except Overview)
              const isDisabled = isInitializing && item.path !== ""

              if (isDisabled) {
                return (
                  <li key={item.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "flex w-full items-center gap-3 h-9 rounded-lg px-3 text-sm",
                            "text-muted-foreground/50 cursor-not-allowed"
                          )}
                        >
                          {Icon && <Icon className="h-[18px] w-[18px]" />}
                          <span>{item.label}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="text-sm">Available after setup completes</p>
                      </TooltipContent>
                    </Tooltip>
                  </li>
                )
              }

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

        {favouriteBrands.length > 0 && (
          <>
            <Separator className="mx-3" />
            <FavouriteBrands brands={favouriteBrands} />
          </>
        )}
      </div>
      </div>

    </div>
  )
}
