"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/common/lib"
import { isNavItemActive } from "@workspace/common/lib"
import { WorkspaceSwitcher } from "./WorkspaceSwitcher"
import { workspaceSidebarNavItems } from "@workspace/common"
import { UserMenu } from "./UserMenu"
import { LifeBuoyIcon, Gift } from "lucide-react"

export function WorkspaceSidebar() {
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <div className="sticky top-0 flex h-screen w-20 flex-col shrink-0">
        {/* Workspace Switcher */}
        <WorkspaceSwitcher />

        {/* Navigation */}
        <nav className="flex flex-col items-center gap-1 p-2">
          {workspaceSidebarNavItems.map((item) => {
            const isActive = isNavItemActive(item.href, pathname)
            const Icon = item.icon

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={12}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Docs & Referral */}
        <div className="flex flex-col items-center gap-1 p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/docs"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground transition-colors"
              >
                <LifeBuoyIcon className="h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={12}>
              Docs
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/referral"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground transition-colors"
              >
                <Gift className="h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={12}>
              Referral
            </TooltipContent>
          </Tooltip>
        </div>

        {/* User Avatar */}
        <div className="flex items-center justify-center p-4">
          <UserMenu variant="compact" />
        </div>
      </div>
    </TooltipProvider>
  )
}
