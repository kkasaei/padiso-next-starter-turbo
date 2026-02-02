"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import {
  Grid2x2,
  CheckSquare,
  Folder,
  BarChart3,
  Zap,
  Settings,
} from "lucide-react"
import { favouriteProjects, navItems, type NavItemId } from "@workspace/common"
import { WorkspaceSwitcher } from "./WorkspaceSwitcher"
import { UserMenu } from "./UserMenu"

const navItemIcons: Record<NavItemId, React.ComponentType<{ className?: string }>> = {
  overview: Grid2x2,
  "my-tasks": CheckSquare,
  brands: Folder,
  analytics: BarChart3,
  prompts: Zap,
  settings: Settings,
}

export function AppSidebar() {
  const pathname = usePathname()

  const getHrefForNavItem = (id: NavItemId): string => {
    const routes: Record<NavItemId, string> = {
      overview: "/dashboard",
      "my-tasks": "/dashboard/tasks",
      brands: "/dashboard/brands",
      analytics: "/dashboard/analytics",
      prompts: "/dashboard/prompts",
      settings: "/dashboard/settings",
    }
    return routes[id] ?? "#"
  }

  const isItemActive = (id: NavItemId): boolean => {
    if (id === "overview") return pathname === "/dashboard"
    if (id === "brands") return pathname.startsWith("/dashboard/brands")
    if (id === "my-tasks") return pathname.startsWith("/dashboard/tasks")
    if (id === "analytics") return pathname.startsWith("/dashboard/analytics")
    if (id === "prompts") return pathname.startsWith("/dashboard/prompts")
    if (id === "settings") return pathname.startsWith("/dashboard/settings")
    return false
  }

  return (
    <Sidebar className="border-border/40 border-r-0 shadow-none border-none">
      <WorkspaceSwitcher />

      <SidebarContent className="px-0 gap-0">


        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const href = getHrefForNavItem(item.id)
                const active = isItemActive(item.id)

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="h-9 rounded-lg px-3 font-normal text-muted-foreground"
                    >
                      <Link href={href}>
                        {(() => {
                          const Icon = navItemIcons[item.id]
                          return Icon ? <Icon className="h-[18px] w-[18px]" /> : null
                        })()}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge className="bg-muted text-muted-foreground rounded-full px-2">
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-2">
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  )
}
