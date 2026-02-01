import {
  Home,
  SearchCheck,
  Settings,
  Wrench,
  Sparkles,
} from "lucide-react"
import { ChartNoAxesCombinedIcon, TowerControlIcon, GlobeIcon, SquareCheckBigIcon } from "lucide-react"

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
    auth: {
      SignIn: '/auth/sign-in',
      SignUp: '/auth/sign-up',
    },
  },
} as const;

// Navigation items for brand detail pages
export const brandNavItems = [
  { id: "overview", label: "Overview", icon: Home, path: "" },
  { id: "content", label: "Content", icon: Sparkles, path: "/content" },
  { id: "analytics", label: "Analytics", icon: ChartNoAxesCombinedIcon, path: "/analytics" },
  { id: "ai-tracking", label: "AI Tracking", icon: TowerControlIcon, path: "/ai-tracking" },
  { id: "backlinks", label: "Backlinks", icon: Wrench, path: "/backlinks" },
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