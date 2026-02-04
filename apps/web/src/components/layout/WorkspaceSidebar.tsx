"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/common/lib"
import { isNavItemActive } from "@workspace/common/lib"
import { WorkspaceSwitcher } from "./WorkspaceSwitcher"
import { workspaceSidebarNavItems } from "@workspace/common"
import { UserMenu } from "./UserMenu"
import { LifeBuoyIcon, Gift, SunIcon, MoonIcon, MonitorIcon } from "lucide-react"

export function WorkspaceSidebar() {
  const pathname = usePathname()
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light')
    else if (theme === 'light') setTheme('dark')
    else setTheme('system')
  }

  const getThemeIcon = () => {
    if (!mounted) return <SunIcon className="h-5 w-5" />
    if (theme === 'light') return <SunIcon className="h-5 w-5" />
    if (theme === 'dark') return <MoonIcon className="h-5 w-5" />
    return <MonitorIcon className="h-5 w-5" />
  }

  const getThemeLabel = () => {
    if (!mounted) return 'Theme'
    if (theme === 'light') return 'Light mode'
    if (theme === 'dark') return 'Dark mode'
    return 'System theme'
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="sticky top-0 flex h-screen w-20 flex-col shrink-0 bg-sidebar">
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

        {/* Theme Toggle, Docs & Referral */}
        <div className="flex flex-col items-center gap-1 p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={cycleTheme}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground transition-colors"
              >
                {getThemeIcon()}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={12}>
              {getThemeLabel()}
            </TooltipContent>
          </Tooltip>
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
              <button
                disabled
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground/50 cursor-not-allowed transition-colors"
              >
                <Gift className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={12}>
              Referral — Coming Soon
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
