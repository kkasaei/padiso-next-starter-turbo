"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { Input } from "@workspace/ui/components/input"
import { Separator } from "@workspace/ui/components/separator"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@workspace/ui/components/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import {
  Search,
  Check,
  MoreHorizontal,
  Settings,
  Plus,
  Map,
  History,
  Headphones,
  Send,
} from "lucide-react"
import { 
  BriefcaseBusiness,
  LayoutDashboardIcon,
  SquareCheckBigIcon,
  ChartLineIcon,
  ZapIcon,
  SettingsIcon
} from "lucide-react"
import { useOrganization, useOrganizationList, useUser } from "@clerk/nextjs"
import { cn } from "@/lib/utils"

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboardIcon, href: "/dashboard" },
  { id: "my-tasks", label: "My Tasks", icon: SquareCheckBigIcon, href: "/dashboard/tasks" },
  { id: "brands", label: "Brands", icon: BriefcaseBusiness, href: "/dashboard/brands" },
  { id: "analytics", label: "Analytics", icon: ChartLineIcon, href: "/dashboard/analytics" },
  { id: "prompts", label: "Prompts", icon: ZapIcon, href: "/dashboard/prompts" },
  { id: "settings", label: "Settings", icon: SettingsIcon, href: "/dashboard/settings" },
] as const

const footerItems = [
  { id: "roadmap", label: "Roadmap", icon: Map, href: "#" },
  { id: "changelog", label: "Change Log", icon: History, href: "#" },
  { id: "support", label: "Support", icon: Headphones, href: "#" },
  { id: "feedbacks", label: "Feedbacks", icon: Send, href: "#" },
] as const

export function WorkspaceSidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const [orgSwitcherOpen, setOrgSwitcherOpen] = useState(false)
  const [search, setSearch] = useState("")

  const { organization: activeOrg } = useOrganization()
  const { userMemberships, setActive, isLoaded } = useOrganizationList({
    userMemberships: { infinite: true },
  })

  const filteredOrgs = userMemberships.data?.filter((membership) =>
    membership.organization.name.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  const handleOrgSwitch = async (orgId: string) => {
    await setActive?.({ organization: orgId })
    setOrgSwitcherOpen(false)
  }

  const isItemActive = (id: string): boolean => {
    if (id === "overview") return pathname === "/dashboard"
    if (id === "brands") return pathname.startsWith("/dashboard/brands")
    if (id === "my-tasks") return pathname.startsWith("/dashboard/tasks")
    if (id === "analytics") return pathname.startsWith("/dashboard/analytics")
    if (id === "prompts") return pathname.startsWith("/dashboard/prompts")
    if (id === "settings") return pathname.startsWith("/dashboard/settings")
    return false
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="sticky top-0 flex h-screen w-20 flex-col shrink-0">
        {/* Workspace Switcher */}
        <div className="flex items-center justify-center p-4">
          <Popover open={orgSwitcherOpen} onOpenChange={setOrgSwitcherOpen}>
            <PopoverTrigger asChild>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-[inset_0_-5px_6.6px_0_rgba(0,0,0,0.25)] hover:opacity-90 transition-opacity">
                {activeOrg?.imageUrl ? (
                  <img
                    src={activeOrg.imageUrl}
                    alt={activeOrg.name}
                    className="h-10 w-10 rounded-xl object-cover"
                  />
                ) : (
                  activeOrg?.name?.charAt(0).toUpperCase() ?? "W"
                )}
              </button>
            </PopoverTrigger>

            <PopoverContent
              className="w-[240px] p-0 rounded-xl shadow-lg"
              align="start"
              side="right"
              sideOffset={12}
            >
              {/* Search */}
              <div className="p-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search workspaces..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-8 pl-8 text-sm border-0 bg-muted/50 focus-visible:ring-0"
                  />
                </div>
              </div>

              <Separator />

              {/* Organization List */}
              <div className="p-1 max-h-[200px] overflow-auto">
                {!isLoaded ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    Loading...
                  </div>
                ) : filteredOrgs.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No workspaces found
                  </div>
                ) : (
                  filteredOrgs.map((membership) => {
                    const org = membership.organization
                    const isActive = org.id === activeOrg?.id

                    return (
                      <button
                        key={org.id}
                        onClick={() => handleOrgSwitch(org.id)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-accent",
                          isActive && "bg-accent/50"
                        )}
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-semibold">
                          {org.imageUrl ? (
                            <img
                              src={org.imageUrl}
                              alt={org.name}
                              className="h-6 w-6 rounded-md object-cover"
                            />
                          ) : (
                            org.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <span className="flex-1 text-left truncate">{org.name}</span>
                        {isActive && (
                          <Check className="h-4 w-4 text-primary" strokeWidth={3} />
                        )}
                      </button>
                    )
                  })
                )}

                {/* All Workspaces */}
                <button
                  onClick={() => setOrgSwitcherOpen(false)}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-accent"
                >
                  <MoreHorizontal className="h-6 w-6 text-muted-foreground" strokeWidth={3} />
                  <span>All workspaces</span>
                </button>
              </div>

              <Separator />

              {/* Actions */}
              <div className="p-1">
                <button
                  onClick={() => {
                    setOrgSwitcherOpen(false)
                    window.location.href = `/organization/${activeOrg?.slug ?? "settings"}`
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-accent"
                >
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <span>Workspace settings</span>
                </button>

                <button
                  onClick={() => {
                    setOrgSwitcherOpen(false)
                    window.location.href = "/create-organization"
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-accent"
                >
                  <Plus className="h-5 w-5 text-muted-foreground" />
                  <span>Add workspace</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
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
