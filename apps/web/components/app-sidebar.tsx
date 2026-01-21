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
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import {
  SquaresFour,
  CheckSquare,
  Folder,
  ChartBar,
  Lightning,
  Gear,
  MapTrifold,
  ClockCounterClockwise,
  Headset,
  PaperPlaneTilt,
  CaretRight,
} from "@phosphor-icons/react/dist/ssr"
import { favouriteProjects, footerItems, navItems, type NavItemId, type SidebarFooterItemId } from "@/lib/data/sidebar"
import { useUser } from "@clerk/nextjs"
import { SidebarHeaderContent } from "@/components/sidebar-header"

const navItemIcons: Record<NavItemId, React.ComponentType<{ className?: string }>> = {
  overview: SquaresFour,
  "my-tasks": CheckSquare,
  projects: Folder,
  analytics: ChartBar,
  prompts: Lightning,
  settings: Gear,
}

const footerItemIcons: Record<SidebarFooterItemId, React.ComponentType<{ className?: string }>> = {
  roadmap: MapTrifold,
  changelog: ClockCounterClockwise,
  support: Headset,
  feedbacks: PaperPlaneTilt,
}

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useUser()


  const getHrefForNavItem = (id: NavItemId): string => {
    const routes: Record<NavItemId, string> = {
      overview: "/dashboard",
      "my-tasks": "/tasks",
      projects: "/",
      analytics: "/analytics",
      prompts: "/prompts",
      settings: "/settings",
    }
    return routes[id] ?? "#"
  }

  const isItemActive = (id: NavItemId): boolean => {
    if (id === "overview") return pathname === "/dashboard"
    if (id === "projects") return pathname === "/" || pathname.startsWith("/projects")
    if (id === "my-tasks") return pathname.startsWith("/tasks")
    if (id === "analytics") return pathname.startsWith("/analytics")
    if (id === "prompts") return pathname.startsWith("/prompts")
    if (id === "settings") return pathname.startsWith("/settings")
    return false
  }

  return (
    <Sidebar className="border-border/40 border-r-0 shadow-none border-none">
      <SidebarHeaderContent />

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

        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-medium text-muted-foreground">
            Favourite Projects
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {favouriteProjects.map((project) => (
                <SidebarMenuItem key={project.name}>
                  <SidebarMenuButton className="h-9 rounded-lg px-3 group">
                    <span 
                      className="h-3 w-3 rounded-full shrink-0" 
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="flex-1 truncate text-sm">{project.name}</span>
                    <span className="opacity-0 group-hover:opacity-100 rounded p-0.5 hover:bg-accent">
                      <span className="text-muted-foreground text-lg">···</span>
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-2">
        <SidebarMenu>
          {footerItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton className="h-9 rounded-lg px-3 text-muted-foreground">
                {(() => {
                  const Icon = footerItemIcons[item.id]
                  return Icon ? <Icon className="h-[18px] w-[18px]" /> : null
                })()}
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <div className="mt-2 flex items-center gap-3 rounded-lg p-2 hover:bg-accent cursor-pointer">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-medium">{user?.fullName}</span>
            <span className="text-xs text-muted-foreground">{user?.emailAddresses[0]?.emailAddress ?? "No email"}</span>
          </div>
          <CaretRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
