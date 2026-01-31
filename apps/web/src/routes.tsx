import {
  House,
  MagnifyingGlassPlus,
  GearSix,
  Wrench,
  SparkleIcon,
} from "@phosphor-icons/react/dist/ssr"
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

// Navigation items for project detail pages
export const projectNavItems = [
  { id: "overview", label: "Overview", icon: House, path: "" },
  { id: "content", label: "Content", icon: SparkleIcon, path: "/content" },
  { id: "analytics", label: "Analytics", icon: ChartNoAxesCombinedIcon, path: "/analytics" },
  { id: "ai-tracking", label: "AI Tracking", icon: TowerControlIcon, path: "/ai-tracking" },
  { id: "backlinks", label: "Backlinks", icon: Wrench, path: "/backlinks" },
  { id: "technical-audit", label: "Technical Audit", icon: MagnifyingGlassPlus, path: "/technical-audit" },
  { id: "reddit", label: "Reddit", icon: GlobeIcon, path: "/reddit" },
  { id: "separator", label: "", icon: null, path: "", isSeparator: true },
  { id: "tasks", label: "Tasks", icon: SquareCheckBigIcon, path: "/tasks" },
  { id: "settings", label: "Settings", icon: GearSix, path: "/settings" },
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