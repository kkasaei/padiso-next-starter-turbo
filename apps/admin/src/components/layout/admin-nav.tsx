"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@workspace/ui/components/logo"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@workspace/ui/components/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  BarChart3,
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
  { id: "users", label: "Users", icon: Users, href: "/admin/users" },
  { id: "organizations", label: "Organizations", icon: Building2, href: "/admin/organizations" },
  { id: "analytics", label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { id: "reports", label: "Reports", icon: FileText, href: "/admin/reports" },
  { id: "settings", label: "Settings", icon: Settings, href: "/admin/settings" },
] as const

const footerItems = [
  { id: "roadmap", label: "Roadmap", icon: Map, href: "#" },
  { id: "changelog", label: "Change Log", icon: History, href: "#" },
  { id: "support", label: "Support", icon: Headphones, href: "#" },
  { id: "feedbacks", label: "Feedbacks", icon: Send, href: "#" },
] as const

export function AdminSidebar() {
  const pathname = usePathname()
  const { user } = useUser()

  const isItemActive = (id: string): boolean => {
    if (id === "dashboard") return pathname === "/admin"
    if (id === "users") return pathname.startsWith("/admin/users")
    if (id === "organizations") return pathname.startsWith("/admin/organizations")
    if (id === "analytics") return pathname.startsWith("/admin/analytics")
    if (id === "reports") return pathname.startsWith("/admin/reports")
    if (id === "settings") return pathname.startsWith("/admin/settings")
    return false
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="sticky top-0 flex h-screen w-20 flex-col shrink-0">
        {/* Logo */}
        <div className="flex items-center justify-center p-4">
          <Link href="/admin">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[inset_0_-5px_6.6px_0_rgba(0,0,0,0.25)] hover:opacity-90 transition-opacity">
              <Logo className="h-6 w-6" />
            </div>
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
                  <Link
                    href={item.href}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground transition-colors"
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
