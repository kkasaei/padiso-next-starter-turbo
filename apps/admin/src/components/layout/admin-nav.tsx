"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoIcon } from "@/components/layout/LogoIcon";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@workspace/ui/components/tooltip"
import {
  LayoutDashboard,
  Users,
  Layers,
  Settings,
  Activity,
  FileText,
  LifeBuoyIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { UserMenu } from "./UserMenu"

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { id: "workspaces", label: "Workspaces", icon: Layers, href: "/workspaces" },
  { id: "users", label: "Users", icon: Users, href: "/users" },
  { id: "public-reports", label: "Public Reports", icon: FileText, href: "/public-reports" },
  { id: "activity", label: "Activity", icon: Activity, href: "/activity" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
] as const

export function AdminSidebar() {
  const pathname = usePathname()

  const isItemActive = (id: string): boolean => {
    if (id === "dashboard") return pathname === "/"
    if (id === "users") return pathname.startsWith("/users")
    if (id === "workspaces") return pathname.startsWith("/workspaces")
    if (id === "public-reports") return pathname.startsWith("/public-reports")
    if (id === "activity") return pathname.startsWith("/activity")
    if (id === "settings") return pathname.startsWith("/settings")
    return false
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="sticky top-0 flex h-screen w-20 flex-col shrink-0">
        {/* Logo */}
        <div className="flex items-center justify-center p-4">
          <Link href="/">
            <LogoIcon size="md" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col items-center gap-1 p-2">
          {navItems.map((item) => {
            const isActive = isItemActive(item.id)
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
        </div>

        {/* User Avatar */}
        <div className="flex items-center justify-center p-4">
          <UserMenu variant="compact" />
        </div>
      </div>
    </TooltipProvider>
  )
}
