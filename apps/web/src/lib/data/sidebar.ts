export type NavItemId = "overview" | "my-tasks" | "projects" | "analytics" | "prompts" | "settings"

export type SidebarFooterItemId = "roadmap" | "changelog" | "support" | "feedbacks"

export type NavItem = {
    id: NavItemId
    label: string
    badge?: number
    isActive?: boolean
}

export type FavouriteProject = {
    id: string
    name: string
    color: string
}

export type SidebarFooterItem = {
    id: SidebarFooterItemId
    label: string
}

export const navItems: NavItem[] = [
    { id: "overview", label: "Overview" },
    { id: "my-tasks", label: "My task" },
    { id: "projects", label: "Projects", isActive: true },
    { id: "analytics", label: "Analytics" },
    { id: "prompts", label: "Prompts" },
    { id: "settings", label: "Settings" },
]

export const favouriteProjects: FavouriteProject[] = [
    { id: "padiso-co", name: "PADISO.co", color: "var(--chart-5)" },
    { id: "fintech-app", name: "Capitaly.vc", color: "var(--chart-3)" },
    { id: "ecommerce-admin", name: "Mailable.dev", color: "var(--chart-1)" },
    { id: "healthcare-app", name: "Brightlume.ai", color: "var(--chart-2)" },
]

export const footerItems: SidebarFooterItem[] = [
    { id: "roadmap", label: "Roadmap" },
    { id: "changelog", label: "Change Log" },
    { id: "support", label: "Support" },
    { id: "feedbacks", label: "Feedbacks" },
]
