import {
  Home,
  SearchCheck,
  Settings,
  Link2,
  Sparkles,
  Map,
  History,
  Headphones,
  Send,
} from "lucide-react"
import { 
  ChartNoAxesCombinedIcon, 
  TowerControlIcon, 
  GlobeIcon, 
  SquareCheckBigIcon,
  BriefcaseBusiness,
  LayoutDashboardIcon,
  ChartLineIcon,
  ZapIcon,
  SettingsIcon
} from "lucide-react"

export const baseURL = process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000';

export const routes = {
  marketing: {
    Home: '/',
    Pricing: '/pricing',
    Blog: '/blog',
    Story: '/story',
    Contact: '/contact',
    Docs: '/docs',
    Waitlist: '/waitlist',
  },
  dashboard: {
    Home: '/dashboard',
    Brands: '/dashboard/brands',
    Tasks: '/dashboard/tasks',
    Prompts: '/dashboard/prompts',
    Analytics: '/dashboard/analytics',
    Settings: '/dashboard/settings',
    WorkspaceSetup: '/workspace-setup',
    auth: {
      SignIn: '/auth/sign-in',
      SignUp: '/auth/sign-up',
    },
  },
  footer: {
    Roadmap: 'https://searchfit.canny.io/',
    Changelog: 'https://searchfit.canny.io/changelog',
    Support: 'https://searchfit.canny.io/support',
    Feedback: 'https://searchfit.canny.io/feature-requests'
  },



} as const;

// Navigation items for workspace sidebar
export const workspaceSidebarNavItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboardIcon, href: routes.dashboard.Home },
  { id: "brands", label: "Brands", icon: BriefcaseBusiness, href: routes.dashboard.Brands },
  { id: "my-tasks", label: "My Tasks", icon: SquareCheckBigIcon, href: routes.dashboard.Tasks },
  { id: "prompts", label: "Prompts", icon: ZapIcon, href: routes.dashboard.Prompts },
  { id: "analytics", label: "Analytics", icon: ChartLineIcon, href: routes.dashboard.Analytics },
  { id: "settings", label: "Settings", icon: SettingsIcon, href: routes.dashboard.Settings },
] as const;

// Footer items for workspace sidebar
export const workspaceSidebarFooterItems = [
  { id: "roadmap", label: "Roadmap", icon: Map, href: routes.footer.Roadmap },
  { id: "changelog", label: "Change Log", icon: History, href: routes.footer.Changelog },
  { id: "support", label: "Support", icon: Headphones, href: routes.footer.Support },
  { id: "feedbacks", label: "Feedbacks", icon: Send, href: routes.footer.Feedback },
] as const;

// Navigation items for brand detail pages
export const brandNavItems = [
  { id: "overview", label: "Overview", icon: Home, path: "" },
  { id: "content", label: "Content", icon: Sparkles, path: "/content" },
  { id: "analytics", label: "Analytics", icon: ChartNoAxesCombinedIcon, path: "/analytics" },
  { id: "ai-tracking", label: "AI Tracking", icon: TowerControlIcon, path: "/ai-tracking" },
  { id: "backlinks", label: "Backlinks", icon: Link2, path: "/backlinks" },
  { id: "technical-audit", label: "Technical Audit", icon: SearchCheck, path: "/technical-audit" },
  { id: "reddit", label: "Reddit", icon: GlobeIcon, path: "/reddit" },
  { id: "separator", label: "", icon: null, path: "", isSeparator: true },
  { id: "tasks", label: "Tasks", icon: SquareCheckBigIcon, path: "/tasks" },
  { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
] as const;

export function getPathname(route: string, base: string = baseURL): string {
  // Handle anchor-only links or empty routes
  if (!route || route === '#' || route.startsWith('#')) {
    return route || '/';
  }

  // If route is already an absolute URL, parse it directly
  if (route.startsWith('http://') || route.startsWith('https://')) {
    return new URL(route).pathname;
  }

  // Use a fallback base if the provided one is invalid
  const validBase = base || 'http://localhost:3000';
  return new URL(route, validBase).pathname;
}