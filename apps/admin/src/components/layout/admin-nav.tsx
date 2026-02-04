"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoIcon } from "@/components/layout/LogoIcon";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@workspace/ui/components/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import {
  LayoutDashboard,
  Users,
  Layers,
  Settings,
  Activity,
  FileText,
  Map,
  History,
  Headphones,
  Send,
} from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { cn } from "@/lib/utils"

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { id: "workspaces", label: "Workspaces", icon: Layers, href: "/admin/workspaces" },
  { id: "users", label: "Users", icon: Users, href: "/admin/users" },
  { id: "public-reports", label: "Public Reports", icon: FileText, href: "/admin/public-reports" },
  { id: "activity", label: "Activity", icon: Activity, href: "/admin/activity" },
  { id: "settings", label: "Settings", icon: Settings, href: "/admin/settings" },
] as const

const footerItems = [
  { id: "roadmap", label: "Roadmap", icon: Map, href: "https://searchfit.canny.io/" },
  { id: "changelog", label: "Change Log", icon: History, href: "https://searchfit.canny.io/changelog" },
  { id: "support", label: "Support", icon: Headphones, href: "https://searchfit.canny.io/support" },
  { id: "feedbacks", label: "Feedbacks", icon: Send, href: "https://searchfit.canny.io/feature-requests" },
] as const

export function AdminSidebar() {
  const pathname = usePathname()
  const { user } = useUser()

  const isItemActive = (id: string): boolean => {
    if (id === "dashboard") return pathname === "/admin"
    if (id === "users") return pathname.startsWith("/admin/users")
    if (id === "workspaces") return pathname.startsWith("/admin/workspaces")
    if (id === "public-reports") return pathname.startsWith("/admin/public-reports")
    if (id === "activity") return pathname.startsWith("/admin/activity")
    if (id === "settings") return pathname.startsWith("/admin/settings")
    return false
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="sticky top-0 flex h-screen w-20 flex-col shrink-0">
        {/* Logo */}
        <div className="flex items-center justify-center p-4">
          <Link href="/admin">
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

        {/* Footer Items */}
        <nav className="flex flex-col items-center gap-1 p-2">
          {footerItems.map((item) => {
            const Icon = item.icon

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={12}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </nav>

        {/* User Avatar */}
        <div className="flex items-center justify-center p-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="rounded-full ring-2 ring-transparent hover:ring-accent transition-all">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
                </Avatar>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={12}>
              <div className="flex flex-col">
                <span className="font-medium">{user?.fullName}</span>
                <span className="text-xs text-muted-foreground">
                  {user?.emailAddresses[0]?.emailAddress}
                </span>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
