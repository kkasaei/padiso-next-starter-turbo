import {
  House,
  MagnifyingGlassPlus,
  GearSix,
  Wrench,
  SparkleIcon,
} from "@phosphor-icons/react/dist/ssr"
import { BotIcon, ChartColumnBigIcon } from "lucide-react"

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
  { id: "tracking", label: "Tracking", icon: ChartColumnBigIcon, path: "/tracking" },
  { id: "website-audit", label: "Website Audit", icon: MagnifyingGlassPlus, path: "/audit" },
  { id: "agents", label: "Agents", icon: BotIcon, path: "/agents" },
  { id: "studio", label: "Studio", icon: SparkleIcon, path: "/studio" },
  { id: "tools", label: "Tools", icon: Wrench, path: "/tools" },
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