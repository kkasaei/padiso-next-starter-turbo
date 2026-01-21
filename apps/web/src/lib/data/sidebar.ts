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
    { id: "ai-learning", name: "AI Learning Platform", color: "var(--chart-5)" },
    { id: "fintech-app", name: "Fintech Mobile App", color: "var(--chart-3)" },
    { id: "ecommerce-admin", name: "E-commerce Admin", color: "var(--chart-1)" },
    { id: "healthcare-app", name: "Healthcare Booking App", color: "var(--chart-2)" },
]

export const footerItems: SidebarFooterItem[] = [
    { id: "roadmap", label: "Roadmap" },
    { id: "changelog", label: "Change Log" },
    { id: "support", label: "Support" },
    { id: "feedbacks", label: "Feedbacks" },
]
