'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import {
  Card,
  CardHeader,
  CardContent,
} from '@workspace/ui/components/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@workspace/ui/components/tooltip'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/ui/components/accordion'
import { Switch } from '@workspace/ui/components/switch'
import { ScrollArea } from '@workspace/ui/components/scroll-area'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@workspace/ui/components/sidebar'
import {
  Copy,
  Search,
  ArrowLeft,
  HelpCircle,
  Sparkles,
  MoreVertical,
  FileText,
  Link2,
  CheckCircle2,
  AlertCircle,
  Info,
  ArrowRight,
  Bot,
  ImageIcon,
  Sparkle,
  Loader2,
  Star,
  Plus,
  Package,
  Settings,
  GraduationCap,
  BookOpen,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckIcon,
  Download,
  MessageSquare,
  ArrowUpRight,
  Users,
  BarChart,
  Lightbulb,
  ChevronRightIcon,
  ChevronsUpDown,
  MoreHorizontal,
  BadgeCheck,
  Bell,
  Building2,
  CreditCard,
  LogOut,
  User,
  Check,
  Calendar,
  FolderKanban,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import MDEditor from '@uiw/react-md-editor'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts'

import { ProviderSelector } from '../shared/provider-selector'
import { EmptyStateExample } from '../shared/empty-state-example'
import { OnboardingModal } from '../shared/onboarding-modal'
import { AnalyticsDatePicker } from '@workspace/ui/components/analytics-date-picker'
import { AnalyticsDateRangeProvider } from '@workspace/ui/hooks/use-analytics-date-range'

// Demo data for Competitor Mentions chart
const DEMO_COMPETITOR_DATA = [
  { name: 'PADISO', value: 26, color: '#3b82f6', domain: 'padiso.co', isYourBrand: true },
  { name: 'Samsung', value: 26, color: '#22c55e', domain: 'samsung.com' },
  { name: 'Dyson', value: 22, color: '#f97316', domain: 'dyson.com' },
  { name: 'Bosch', value: 16, color: '#0f172a', domain: 'bosch.com' },
  { name: 'Others', value: 10, color: '#94a3b8', domain: null },
]

// Market position data (simplified view)
const DEMO_MARKET_POSITION_DATA = [
  { name: 'PADISO', value: 26, color: '#3b82f6', domain: 'padiso.co', isYourBrand: true },
  { name: 'Samsung', value: 26, color: '#22c55e', domain: 'samsung.com' },
  { name: 'Others', value: 48, color: '#94a3b8', domain: null },
]

// Helper to get favicon URL
function getFaviconUrl(domain: string | null) {
  if (!domain) return null
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
}

interface ComponentsSectionProps {
  componentId: string | null
}

export function ComponentsSection({ componentId }: ComponentsSectionProps) {
  const { resolvedTheme } = useTheme()
  return (
    <div className="flex flex-col gap-y-8">
      {/* Buttons */}
      {(!componentId || componentId === 'buttons') && (
        <section id="buttons" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Buttons</h2>
          <div className="rounded-xl border border-border p-6 space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Variants</p>
              <div className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Sizes</p>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon"><Copy className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Badges */}
      {(!componentId || componentId === 'badges') && (
        <section id="badges" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Badges</h2>
          <div className="rounded-xl border border-border p-6">
            <div className="flex flex-wrap gap-4">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline" className="rounded-lg">Coming Soon</Badge>
            </div>
          </div>
        </section>
      )}

      {/* Inputs */}
      {(!componentId || componentId === 'inputs') && (
        <section id="inputs" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Inputs</h2>
          <div className="rounded-xl border border-border p-6 space-y-4">
            <div className="max-w-sm space-y-2">
              <p className="text-sm text-muted-foreground">Default</p>
              <Input placeholder="Enter text..." />
            </div>
            <div className="max-w-sm space-y-2">
              <p className="text-sm text-muted-foreground">Disabled</p>
              <Input placeholder="Disabled input" disabled />
            </div>
            <div className="max-w-sm space-y-2">
              <p className="text-sm text-muted-foreground">With Search Icon</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-9" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats Cards */}
      {(!componentId || componentId === 'stats-cards') && (
        <section id="stats-cards" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Stats Cards</h2>
          <p className="text-sm text-muted-foreground">Simple metric cards used in project overview dashboards.</p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="rounded-2xl border border-transparent bg-gray-100 text-gray-950 shadow-none dark:border-transparent dark:bg-polar-800 dark:text-white">
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <span className="text-gray-500 dark:text-polar-500">Tracked Prompts</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-gray-400 hover:text-gray-600 dark:text-polar-500 dark:hover:text-polar-300 transition-colors">
                      <HelpCircle className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-sm">Tooltip description goes here.</p>
                  </TooltipContent>
                </Tooltip>
              </CardHeader>
              <CardContent className="pt-0">
                <h3 className="text-2xl">24</h3>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border border-transparent bg-gray-100 text-gray-950 shadow-none dark:border-transparent dark:bg-polar-800 dark:text-white">
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <span className="text-gray-500 dark:text-polar-500">Active Keywords</span>
              </CardHeader>
              <CardContent className="pt-0">
                <h3 className="text-2xl">12</h3>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border border-transparent bg-gray-100 text-gray-950 shadow-none dark:border-transparent dark:bg-polar-800 dark:text-white">
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <span className="text-gray-500 dark:text-polar-500">Open Opportunities</span>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline gap-x-2">
                  <h3 className="text-2xl">7</h3>
                  <span className="text-sm text-amber-600 dark:text-amber-400">action items</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Metric Cards */}
      {(!componentId || componentId === 'metric-cards') && (
        <section id="metric-cards" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Metric Cards</h2>
          <p className="text-sm text-muted-foreground">Larger metric cards with trends and charts for analytics dashboards.</p>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Metric Card with Data */}
            <div className="group flex w-full flex-col justify-between rounded-xl border border-transparent bg-gray-50 p-2 shadow-xs transition-all hover:shadow-md dark:border-polar-700 dark:bg-polar-800 lg:rounded-4xl">
              <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
                <div className="flex w-full flex-col gap-y-4">
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-x-2">
                      <h3 className="text-lg">AI Visibility Score</h3>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-gray-400 hover:text-gray-600 dark:text-polar-500 dark:hover:text-polar-300 transition-colors">
                            <HelpCircle className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p className="text-sm">Measures how often your brand appears in AI-generated responses.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-baseline gap-x-2">
                    <h2 className="text-5xl font-light">85</h2>
                    <span className="text-2xl text-gray-400 dark:text-polar-500">/100</span>
                  </div>
                  <div className="flex flex-row items-center gap-x-2 text-sm">
                    <span className="h-3 w-3 rounded-full border-2" style={{ borderColor: '#3b82f6' }} />
                    <span className="text-gray-500 dark:text-polar-500">Last 7 days</span>
                    <span className="font-medium text-green-600 dark:text-green-400">+5%</span>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col gap-y-2 rounded-3xl bg-white p-4 dark:bg-polar-900">
                <div className="h-[120px] w-full bg-linear-to-r from-blue-50 to-blue-100 dark:from-polar-800 dark:to-polar-700 rounded-xl flex items-center justify-center text-muted-foreground text-sm">
                  Chart Area
                </div>
              </div>
            </div>

            {/* Metric Card with No Data */}
            <div className="group flex w-full flex-col justify-between rounded-xl border border-transparent bg-gray-50 p-2 shadow-xs dark:border-polar-700 dark:bg-polar-800 lg:rounded-4xl">
              <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
                <div className="flex w-full flex-col gap-y-4">
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-x-2">
                      <h3 className="text-lg">Brand Health</h3>
                      <HelpCircle className="h-4 w-4 text-gray-400 dark:text-polar-500" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center py-4 text-center">
                    <div className="mb-3 rounded-full bg-gray-200 p-3 dark:bg-polar-700">
                      <Sparkles className="h-6 w-6 text-gray-400 dark:text-polar-500" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-polar-500">No data yet</p>
                    <p className="text-xs text-gray-400 dark:text-polar-600 mt-1">Data will appear once tracking starts</p>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col items-center justify-center rounded-3xl bg-white p-8 dark:bg-polar-900">
                <div className="flex h-[120px] w-full items-center justify-center">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="h-12 w-full rounded-lg bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-polar-800 dark:via-polar-700 dark:to-polar-800 animate-pulse" />
                    <p className="text-xs text-gray-400 dark:text-polar-600">Chart will display here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Data Table */}
      {(!componentId || componentId === 'data-table') && (
        <section id="data-table" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Data Table (Analytics Style)</h2>
          <p className="text-sm text-muted-foreground">Full-featured data table with search, sorting, and pagination.</p>
          <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
            <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
              <div className="flex w-full flex-col gap-y-2">
                <span className="text-lg font-semibold">AI Mentions</span>
                <p className="text-sm text-muted-foreground">Track brand mentions across AI platforms.</p>
              </div>
              <div className="flex shrink-0 flex-row items-center gap-2">
                <Button variant="outline" size="sm">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Suggestions
                </Button>
                <Button size="sm">Add New</Button>
              </div>
            </div>
            <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="text" placeholder="Search mentions..." className="pl-9 h-9" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <div className="flex items-center gap-1.5">Date<span className="text-primary">↓</span></div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Prompt</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">AI Response</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Position</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Sentiment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Dec 28, 2025</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground line-clamp-1">Best project management tools</td>
                      <td className="px-6 py-4 text-sm line-clamp-2">SearchFit is highly recommended...</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">#1</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">Positive</Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col gap-4 px-6 py-4 border-t border-border bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">Showing 1–3 of 24 mentions</div>
                <div className="flex items-center gap-4">
                  <Select defaultValue="10">
                    <SelectTrigger className="w-[70px] h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" className="h-8 px-2" disabled><ArrowLeft className="h-4 w-4" /></Button>
                    <span className="px-2 text-sm text-muted-foreground">1 / 3</span>
                    <Button variant="outline" size="sm" className="h-8 px-2"><ArrowLeft className="h-4 w-4 rotate-180" /></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Dropdown Menu */}
      {(!componentId || componentId === 'dropdown-menu') && (
        <section id="dropdown-menu" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Dropdown Menu</h2>
          <p className="text-sm text-muted-foreground">Context menus for actions on items.</p>
          <div className="rounded-xl border border-border p-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Edit Project</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem>Archive</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {(!componentId || componentId === 'empty-state') && (
        <section id="empty-state" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Empty State</h2>
          <p className="text-sm text-muted-foreground">Used when a list or section has no items, or for coming soon placeholders.</p>

          {/* Empty State with Action */}
          <div className="space-y-2">
            <p className="text-sm font-medium">With Action Button</p>
            <EmptyStateExample
              title="No projects found"
              description="Start tracking your SEO projects today"
              icon={<FolderKanban className="h-16 w-16" />}
              actionLabel="Create Project"
            />
          </div>

          {/* Coming Soon Placeholder */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Coming Soon Variant</p>
            <EmptyStateExample
              title="Communities Tracking"
              description="Track your brand mentions across Reddit, Twitter, LinkedIn, and other community platforms."
              icon={<MessageSquare className="h-12 w-12" />}
              variant="coming-soon"
            />
          </div>

          {/* Code Example */}
          <div className="rounded-xl border border-border bg-muted/30 p-6 overflow-x-auto">
            <p className="text-sm font-medium mb-3">Usage</p>
            <pre className="text-sm">
              <code>{`<div className="md:dark:bg-polar-900 dark:border-polar-700 w-full md:rounded-xl md:border md:border-gray-100 md:bg-gray-50 md:p-8 lg:rounded-4xl items-center justify-center gap-y-6 md:flex md:flex-col md:py-48">
  <div className="text-gray-300 dark:text-gray-600">{icon}</div>
  <div className="flex flex-col items-center gap-y-6">
    <div className="flex flex-col items-center gap-y-2">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="dark:text-polar-500 text-gray-500 text-center max-w-md">
        {description}
      </p>
    </div>
    <Button variant="outline" className="rounded-lg">
      {actionLabel}
    </Button>
  </div>
</div>`}</code>
            </pre>
          </div>
        </section>
      )}

      {/* Provider Selector */}
      {(!componentId || componentId === 'provider-selector') && (
        <section id="provider-selector" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Provider Selector Tabs</h2>
          <p className="text-sm text-muted-foreground">Tab buttons with logos for switching between AI providers.</p>
          <div className="rounded-xl border border-border p-6">
            <ProviderSelector />
          </div>
        </section>
      )}

      {/* Bar Chart */}
      {(!componentId || componentId === 'bar-chart') && (
        <section id="bar-chart" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Bar Chart (Opportunities Resolved)</h2>
          <p className="text-sm text-muted-foreground">Vertical bar chart with day labels for time-series data.</p>
          <div className="flex w-full flex-col gap-y-8 rounded-4xl border border-transparent bg-gray-50 p-6 text-gray-950 shadow-none dark:border-transparent dark:bg-polar-800 dark:text-white">
            <div className="flex flex-col gap-y-4">
              <h2 className="text-lg text-gray-500 dark:text-polar-500">Last 7 Days</h2>
              <div className="flex items-center gap-x-3">
                <h3 className="text-4xl font-light">Opportunities Resolved</h3>
                <HelpCircle className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="grid gap-4 lg:gap-6 grid-cols-4 lg:grid-cols-7">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                // Random resolved counts between 1-20
                const resolvedCounts = [8, 15, 3, 12, 18, 6, 14]
                const maxResolved = Math.max(...resolvedCounts)
                const heights = resolvedCounts.map(r => (r / maxResolved) * 100)
                const isLast = index === 6
                return (
                  <div key={day} className="flex flex-col gap-y-2">
                    <div className="relative h-48 overflow-hidden rounded-2xl bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.05),rgba(0,0,0,0.05)_2px,transparent_2px,transparent_8px)] dark:bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.03),rgba(255,255,255,0.03)_2px,transparent_2px,transparent_8px)]">
                      <div
                        className={`absolute bottom-0 w-full rounded-2xl transition-all ${isLast ? 'bg-amber-400 dark:bg-amber-500' : 'bg-gray-300 dark:bg-polar-600'}`}
                        style={{ height: `${heights[index]}%` }}
                      />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm lg:text-base">{day}</span>
                      <span className="text-sm text-gray-500 dark:text-polar-500">{resolvedCounts[index]} resolved</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Donut Charts */}
      {(!componentId || componentId === 'donut-charts') && (
        <section id="donut-charts" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Donut Charts (Competitor Mentions)</h2>
          <p className="text-sm text-muted-foreground">Side-by-side donut charts for share of voice visualization with real Recharts.</p>
          <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
            <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
              <div className="flex w-full flex-col gap-y-2">
                <span className="text-lg font-semibold">Competitor Mentions</span>
                <p className="text-sm text-muted-foreground">Share of voice when this prompt is asked.</p>
              </div>
              <ProviderSelector />
            </div>
            <div className="flex w-full flex-col gap-y-2 rounded-3xl bg-card p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pie Chart 1 - Full Distribution */}
                <div className="flex flex-col">
                  <h4 className="text-sm font-medium mb-4 text-muted-foreground">Full Distribution</h4>
                  <div className="flex flex-col items-center gap-6">
                    <div style={{ width: '280px', height: '280px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={DEMO_COMPETITOR_DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {DEMO_COMPETITOR_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--popover))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              padding: '8px 12px',
                            }}
                            formatter={(value, name) => [`${value}%`, name]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Legend */}
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                      {DEMO_COMPETITOR_DATA.map((item) => {
                        const faviconUrl = getFaviconUrl(item.domain)
                        return (
                          <div key={item.name} className="flex items-center gap-2">
                            {faviconUrl ? (
                              <div className="relative h-4 w-4 shrink-0 overflow-hidden rounded">
                                <Image
                                  src={faviconUrl}
                                  alt={item.name}
                                  fill
                                  className="object-contain"
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <div
                                className="h-3 w-3 rounded-full shrink-0"
                                style={{ backgroundColor: item.color }}
                              />
                            )}
                            <span className={cn(
                              "text-sm",
                              item.isYourBrand && "font-medium text-primary"
                            )}>
                              {item.name}
                            </span>
                            <span className={cn(
                              "text-sm font-medium",
                              item.isYourBrand && "text-primary"
                            )}>
                              {item.value}%
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Pie Chart 2 - Your Brand vs Competition */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Your Brand vs Competition</h4>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <HelpCircle className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-xs p-3">
                        <div className="space-y-2 text-sm">
                          <p className="font-medium">What does this chart show?</p>
                          <p className="text-muted-foreground">
                            A simplified view of your market position showing your brand vs the top competitor and all others combined.
                          </p>
                          <p className="font-medium pt-1">Center Number</p>
                          <p className="text-muted-foreground">
                            Shows your share of voice gap vs the top competitor.
                            <span className="text-green-600"> Positive (+)</span> means you&apos;re leading,
                            <span className="text-red-600"> negative (-)</span> means you&apos;re behind.
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative" style={{ width: '280px', height: '280px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={DEMO_MARKET_POSITION_DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {DEMO_MARKET_POSITION_DATA.map((entry, index) => (
                              <Cell key={`cell-market-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--popover))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              padding: '8px 12px',
                            }}
                            formatter={(value, name) => [`${value}%`, name]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Center Label - Gap vs Top Competitor */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-bold text-green-600">+0%</span>
                        <span className="text-xs text-muted-foreground">vs Samsung</span>
                      </div>
                    </div>
                    {/* Legend */}
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                      {DEMO_MARKET_POSITION_DATA.map((item) => {
                        const faviconUrl = getFaviconUrl(item.domain)
                        return (
                          <div key={item.name} className="flex items-center gap-2">
                            {faviconUrl ? (
                              <div className="relative h-4 w-4 shrink-0 overflow-hidden rounded">
                                <Image
                                  src={faviconUrl}
                                  alt={item.name}
                                  fill
                                  className="object-contain"
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <div
                                className="h-3 w-3 rounded-full shrink-0"
                                style={{ backgroundColor: item.color }}
                              />
                            )}
                            <span className={cn(
                              "text-sm",
                              item.isYourBrand && "font-medium text-primary"
                            )}>
                              {item.name}
                            </span>
                            <span className={cn(
                              "text-sm font-medium",
                              item.isYourBrand && "text-primary"
                            )}>
                              {item.value}%
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sentiment Bars */}
      {(!componentId || componentId === 'sentiment-bars') && (
        <section id="sentiment-bars" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Sentiment Analysis Progress Bars</h2>
          <p className="text-sm text-muted-foreground">Horizontal progress bars showing sentiment distribution.</p>
          <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
            <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
              <div className="flex w-full flex-col gap-y-2">
                <span className="text-lg font-semibold">Sentiment Analysis</span>
                <p className="text-sm text-muted-foreground">How AI responses characterize your brand.</p>
              </div>
              <ProviderSelector />
            </div>
            <div className="flex w-full flex-col gap-y-4 rounded-3xl bg-card p-6">
              {[
                { label: 'Positive', value: 63, color: 'bg-green-500' },
                { label: 'Neutral', value: 24, color: 'bg-gray-400' },
                { label: 'Negative', value: 13, color: 'bg-red-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <span className="w-16 text-sm text-muted-foreground">{item.label}</span>
                  <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.value}%` }} />
                  </div>
                  <span className="w-12 text-right text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Two-Column Layout */}
      {(!componentId || componentId === 'two-column-layout') && (
        <section id="two-column-layout" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Two-Column Layout (Sidebar + Detail)</h2>
          <p className="text-sm text-muted-foreground">Master-detail layout with a sidebar list and detail content area.</p>
          <div className="flex h-[400px] w-full flex-row gap-x-2">
            <div className="dark:bg-polar-900 dark:border-polar-800 h-full w-full overflow-y-hidden rounded-2xl border border-gray-200 bg-white md:max-w-[250px] md:shadow-xs">
              <div className="flex h-full flex-col divide-y divide-gray-200 dark:divide-polar-800">
                <div className="flex flex-row items-center justify-between gap-6 px-4 py-4">
                  <div className="font-medium">Agents</div>
                  <div className="flex flex-row items-center gap-4">
                    <button className="flex h-6 w-6 items-center justify-center rounded-xl hover:bg-gray-200 dark:hover:bg-polar-700">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="flex h-6 w-6 items-center justify-center rounded-xl bg-primary text-white">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex h-full grow flex-col divide-y divide-gray-50 dark:divide-polar-800 overflow-y-auto">
                  {[
                    { name: 'Content Optimizer', status: 'active' },
                    { name: 'Keyword Bot', status: 'paused' },
                  ].map((agent, idx) => (
                    <button
                      key={idx}
                      className={cn(
                        "flex flex-col gap-y-2 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-polar-800",
                        idx === 0 && "bg-gray-50 dark:bg-polar-800"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Bot className="h-4 w-4 shrink-0 text-gray-400" />
                          <span className="font-medium text-sm truncate">{agent.name}</span>
                        </div>
                        {agent.status === 'active' && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                        {agent.status === 'paused' && <Clock className="h-3 w-3 text-yellow-500" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="dark:md:bg-polar-900 dark:border-polar-800 relative flex w-full flex-col items-center rounded-2xl border-gray-200 px-4 md:overflow-y-auto md:border md:bg-white md:px-8 md:shadow-xs">
              <div className="flex h-full flex-col items-center justify-center pt-8">
                <Bot className="h-12 w-12 text-gray-400 dark:text-polar-500" />
                <h3 className="text-xl font-medium mt-4">Select an Agent</h3>
                <p className="text-gray-500 text-center mt-2">Choose from the sidebar</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Instruction Cards */}
      {(!componentId || componentId === 'instruction-cards') && (
        <section id="instruction-cards" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Instruction Cards</h2>
          <p className="text-sm text-muted-foreground">Feature introduction cards with left description and right features list.</p>
          <div className="dark:bg-polar-800 flex w-full flex-col gap-12 rounded-4xl bg-gray-100 p-4 md:flex-row">
            <div className="flex w-full flex-col gap-6 p-6 md:max-w-sm">
              <div className="flex items-center gap-2">
                <Link2 className="h-6 w-6 text-blue-500" />
                <h2 className="text-2xl dark:text-white">Link Audit</h2>
              </div>
              <p className="dark:text-polar-300 text-gray-700">
                Analyze your website&apos;s linking structure to optimize for AI search engines.
              </p>
              <Button className="gap-2 rounded-xl">
                Start Audit
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="dark:bg-polar-900 flex flex-1 shrink flex-col gap-y-4 overflow-auto rounded-3xl bg-white p-6">
              <h3 className="mb-2 text-lg font-semibold dark:text-white">What We Audit</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <div>
                    <h4 className="mb-1 font-semibold dark:text-white">Internal Links</h4>
                    <p className="text-sm text-gray-600 dark:text-polar-400">Link depth and navigation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
                  <div>
                    <h4 className="mb-1 font-semibold dark:text-white">Broken Links</h4>
                    <p className="text-sm text-gray-600 dark:text-polar-400">404 errors and redirects</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                  <div>
                    <h4 className="mb-1 font-semibold dark:text-white">Opportunities</h4>
                    <p className="text-sm text-gray-600 dark:text-polar-400">Citation opportunities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Form Fields */}
      {(!componentId || componentId === 'form-fields') && (
        <section id="form-fields" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Form Fields with Generate with AI</h2>
          <p className="text-sm text-muted-foreground">Form sections with AI-powered content generation.</p>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="relative flex flex-col gap-8 p-8 bg-card">
              <div className="flex flex-col gap-y-2">
                <h2 className="text-lg font-medium">Project Information</h2>
                <p className="dark:text-polar-500 text-gray-500">Basic project information</p>
              </div>
              <div className="flex w-full flex-col gap-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name-example">Name</Label>
                  <Input id="name-example" name="name" defaultValue="PADISO" className="h-10 rounded-lg" />
                </div>
                <div className="space-y-2 flex flex-col gap-2">
                  <div className="flex flex-row items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      <Label htmlFor="description-example">Description</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-5 w-5 p-0 hover:bg-transparent" type="button">
                              <HelpCircle className="h-4 w-4 text-gray-400" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>AI context description</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Button variant="outline" type="button">
                      <Sparkle className="h-4 w-4" />
                      <span>Generate with AI</span>
                    </Button>
                  </div>
                  <div data-color-mode={resolvedTheme === 'dark' ? 'dark' : 'light'}>
                    <MDEditor
                      id="description-example"
                      className="min-h-32 resize-none rounded-2xl"
                      value="Project description goes here..."
                      height={150}
                      preview="preview"
                      hideToolbar={false}
                      enableScroll={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border p-6 space-y-4">
            <p className="text-sm text-muted-foreground">Generate with AI Button States</p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="outline" type="button">
                <Sparkle className="h-4 w-4" />
                <span>Generate with AI</span>
              </Button>
              <Button variant="outline" type="button" disabled>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating...</span>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Project List */}
      {(!componentId || componentId === 'project-list') && (
        <section id="project-list" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Project List with Filters</h2>
          <p className="text-sm text-muted-foreground">List view with search, status filter, sort, and action menu.</p>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex flex-1 flex-row">
                <Search className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3 text-gray-500 h-full w-10" />
                <Input type="text" placeholder="Search Projects" className="pl-10 w-full md:max-w-64 h-10 rounded-lg" />
              </div>
              <Select defaultValue="active">
                <SelectTrigger className="w-full md:w-fit h-10 rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Plus className="h-4 w-4" />
              <span>New Project</span>
            </Button>
          </div>
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">PA</div>
                <span className="font-medium">PADISO</span>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-muted-foreground hover:text-foreground"><Star className="h-5 w-5" /></button>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">ACTIVE</Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Onboarding Cards */}
      {(!componentId || componentId === 'onboarding-cards') && (
        <section id="onboarding-cards" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Onboarding Cards</h2>
          <p className="text-sm text-muted-foreground">Three-column onboarding grid with progress states.</p>
          <div className="grid grid-cols-1 divide-y divide-border rounded-3xl border border-border bg-card lg:grid-cols-3 lg:divide-x lg:divide-y-0">

            {/* Create a Project */}
            <div className="flex flex-col gap-6 p-6 md:p-8 lg:p-10">
              <div className="shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                  <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between gap-6">
                <div className="flex flex-col gap-y-2">
                  <h3 className="text-lg font-medium md:text-xl">Create a Project</h3>
                  <p className="text-sm text-muted-foreground md:text-base">
                    Create your first project to start tracking your AEO performance
                  </p>
                </div>
                <Button variant="secondary" className="w-full" disabled>
                  Completed
                </Button>
              </div>
            </div>

            {/* Connect with Us */}
            <div className="flex flex-col gap-6 p-6 md:p-8 lg:p-10">
              <div className="shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted">
                  <Settings className="h-5 w-5" />
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between gap-6">
                <div className="flex flex-col gap-y-8">
                  <div className="flex flex-col gap-y-2">
                    <h3 className="text-lg font-medium md:text-xl">Connect with Us</h3>
                    <p className="text-sm text-muted-foreground md:text-base">
                      We are humans and we are here to help you.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <Link
                      href="https://discord.gg/W6Za2Yja"
                      className="flex items-start gap-3 rounded-xl bg-muted p-4 transition-all hover:bg-muted/50"
                      target="_blank"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#5865F2]/10 dark:bg-[#5865F2]/20">
                        <svg className="h-5 w-5 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                        </svg>
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-y-1">
                        <div className="flex items-center">
                          <h4 className="text-sm font-medium">Join the community</h4>
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Join our Discord server to get help from the community.
                        </p>
                      </div>
                    </Link>
                    <Link
                      href="https://x.com/searchfitai"
                      className="flex items-start gap-3 rounded-xl bg-muted p-4 transition-all hover:bg-muted/50"
                      target="_blank"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/10">
                        <svg className="h-5 w-5 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-y-1">
                        <div className="flex items-center">
                          <h4 className="text-sm font-medium">Follow us on X</h4>
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Follow us on X to get the latest news and updates.
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Learn how to use the platform */}
            <div className="flex flex-col gap-6 p-6 md:p-8 lg:p-10">
              <div className="shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted">
                  <GraduationCap className="h-5 w-5" />
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between gap-6">
                <div className="flex flex-col gap-y-2">
                  <h3 className="text-lg font-medium md:text-xl">Learn how to use the platform</h3>
                  <p className="text-sm text-muted-foreground md:text-base">
                    5 Minutes to get you started with SearchFit.
                  </p>
                </div>
                <Button className="w-full">
                  Watch the video
                </Button>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Onboarding Modal */}
      {(!componentId || componentId === 'onboarding-modal') && (
        <OnboardingModalSection />
      )}

      {/* Welcome Card */}
      {(!componentId || componentId === 'welcome-card') && (
        <section id="welcome-card" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Welcome Card</h2>
          <p className="text-sm text-muted-foreground">Initial onboarding setup completion card with trial info and feature checklist.</p>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Complete State */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
              {/* Header - Complete */}
              <div className="border-b border-border bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 px-6 py-8 text-center">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
                  <Check className="size-6 text-primary" strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Welcome to SearchFit!
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your workspace is ready to use.
                </p>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                {/* Trial Info */}
                <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        Enjoy the trial till
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-primary" />
                      <span className="text-sm font-semibold text-foreground">
                        Jan 14, 2025
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="mb-6 space-y-2.5">
                  {[
                    'Track AI visibility across all platforms',
                    'Monitor competitors and get insights',
                    'Generate AI-optimized content'
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-2.5">
                      <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check className="size-2.5 text-primary" strokeWidth={3} />
                      </div>
                      <p className="text-sm text-foreground">{feature}</p>
                    </div>
                  ))}
                </div>

                <Button size="lg" className="w-full">
                  Continue to Dashboard
                </Button>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  No credit card required
                </p>
              </div>
            </div>

            {/* Loading State */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
              {/* Header - Loading */}
              <div className="border-b border-border bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 px-6 py-8 text-center">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
                  <Loader2 className="size-6 animate-spin text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Setting up your workspace...
                </h3>
              </div>

              {/* Content - Loading */}
              <div className="px-6 py-6">
                <div className="py-6 text-center">
                  <div className="mx-auto mb-3 flex items-center justify-center gap-1.5">
                    <div className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                    <div className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                    <div className="size-1.5 animate-bounce rounded-full bg-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This will only take a moment...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Training Cards */}
      {(!componentId || componentId === 'training-cards') && (
        <TrainingCardsSection />
      )}

      {/* Trial Alerts */}
      {(!componentId || componentId === 'trial-alerts') && (
        <section id="trial-alerts" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Trial Days Alert Banner</h2>
          <p className="text-sm text-muted-foreground">Contextual alerts showing trial status with urgency levels. Color scheme changes based on days remaining.</p>

          {/* Normal state (8+ days) - Blue */}
          <div className="flex items-start gap-3 rounded-2xl border p-4 border-blue-100 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/20">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            </div>
            <div className="flex flex-1 flex-col gap-y-1">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">10 days left in your free trial</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Enjoying SearchFit? Upgrade anytime to unlock unlimited access.</p>
            </div>
            <Button asChild size="sm" className="shrink-0">
              <Link href="/plans">Upgrade Now</Link>
            </Button>
          </div>

          {/* Warning state (4-7 days) - Amber */}
          <div className="flex items-start gap-3 rounded-2xl border p-4 border-amber-100 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            </div>
            <div className="flex flex-1 flex-col gap-y-1">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">5 days left in your free trial</p>
              <p className="text-sm text-amber-700 dark:text-amber-300">Your trial is ending soon. Upgrade to continue accessing all features.</p>
            </div>
            <Button asChild size="sm" className="shrink-0">
              <Link href="/plans">Upgrade Now</Link>
            </Button>
          </div>

          {/* Urgent state (1-3 days) - Red */}
          <div className="flex items-start gap-3 rounded-2xl border p-4 border-red-100 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
              <Clock className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden="true" />
            </div>
            <div className="flex flex-1 flex-col gap-y-1">
              <p className="text-sm font-semibold text-red-900 dark:text-red-100">1 day left in your free trial</p>
              <p className="text-sm text-red-700 dark:text-red-300">Your trial is ending soon. Subscribe now to keep your data and continue tracking.</p>
            </div>
            <Button asChild size="sm" className="shrink-0">
              <Link href="/plans">Upgrade Now</Link>
            </Button>
          </div>
        </section>
      )}

      {/* Pricing Cards */}
      {(!componentId || componentId === 'pricing-cards') && (
        <PricingCardsSection />
      )}

      {/* Pricing FAQ */}
      {(!componentId || componentId === 'pricing-faq') && (
        <PricingFAQSection />
      )}

      {/* Subscription Settings */}
      {(!componentId || componentId === 'subscription-settings') && (
        <SubscriptionSettingsSection />
      )}

      {/* Project Switcher */}
      {(!componentId || componentId === 'project-switcher') && (
        <ProjectSwitcherSection />
      )}

      {/* Organization Nav */}
      {(!componentId || componentId === 'organization-nav') && (
        <OrganizationNavSection />
      )}

      {/* Tabs */}
      {(!componentId || componentId === 'tabs') && (
        <section id="tabs" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Tabs</h2>
          <p className="text-sm text-muted-foreground">Tab components for organizing content into sections.</p>
          <div className="rounded-xl border border-border p-6 space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Default Style</p>
              <Tabs defaultValue="tab1" className="w-full">
                <TabsList>
                  <TabsTrigger value="tab1">Overview</TabsTrigger>
                  <TabsTrigger value="tab2">Analytics</TabsTrigger>
                  <TabsTrigger value="tab3">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1" className="mt-4">
                  <p className="text-sm text-muted-foreground">Overview tab content.</p>
                </TabsContent>
                <TabsContent value="tab2" className="mt-4">
                  <p className="text-sm text-muted-foreground">Analytics tab content.</p>
                </TabsContent>
                <TabsContent value="tab3" className="mt-4">
                  <p className="text-sm text-muted-foreground">Settings tab content.</p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <div className="rounded-xl border border-border p-6 space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Dashboard Style (Transparent Background)</p>
              <Tabs defaultValue="prompts" className="w-full">
                <TabsList className="bg-transparent ring-0 dark:bg-transparent dark:ring-0 p-1 gap-2">
                  <TabsTrigger
                    value="prompts"
                    className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4"
                  >
                    Prompts
                  </TabsTrigger>
                  <TabsTrigger
                    value="keywords"
                    className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4"
                  >
                    Keywords
                  </TabsTrigger>
                  <TabsTrigger
                    value="competitors"
                    className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4"
                  >
                    Competitors
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="prompts" className="mt-4">
                  <p className="text-sm text-muted-foreground">Prompts tab content.</p>
                </TabsContent>
                <TabsContent value="keywords" className="mt-4">
                  <p className="text-sm text-muted-foreground">Keywords tab content.</p>
                </TabsContent>
                <TabsContent value="competitors" className="mt-4">
                  <p className="text-sm text-muted-foreground">Competitors tab content.</p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      )}

      {/* Date Picker */}
      {(!componentId || componentId === 'date-picker') && (
        <section id="date-picker" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Analytics Date Picker</h2>
          <p className="text-sm text-muted-foreground">Google Search Console style date range picker with presets and custom range.</p>

          {/* Live Example */}
          <div className="rounded-xl border border-border p-6 space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Live Example</p>
              <AnalyticsDateRangeProvider>
                <AnalyticsDatePicker />
              </AnalyticsDateRangeProvider>
            </div>
          </div>

          {/* Features */}
          <div className="rounded-xl border border-border p-6 space-y-4">
            <h3 className="text-sm font-medium">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Quick access presets: 24h, 7d, 28d, 3m
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                &quot;More&quot; dropdown: 6m, 12m, 16m
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Custom date range with calendar
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Active state highlighting
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Syncs with useAnalyticsDateRange hook
              </li>
            </ul>
          </div>

          {/* Props */}
          <div className="rounded-xl border border-border p-6 space-y-4">
            <h3 className="text-sm font-medium">Props</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-medium">Prop</th>
                    <th className="text-left py-2 pr-4 font-medium">Type</th>
                    <th className="text-left py-2 pr-4 font-medium">Default</th>
                    <th className="text-left py-2 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-xs">className</td>
                    <td className="py-2 pr-4">string</td>
                    <td className="py-2 pr-4">-</td>
                    <td className="py-2">Additional CSS classes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-xs">disabled</td>
                    <td className="py-2 pr-4">boolean</td>
                    <td className="py-2 pr-4">false</td>
                    <td className="py-2">Disable interaction</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-xs">allowCustom</td>
                    <td className="py-2 pr-4">boolean</td>
                    <td className="py-2 pr-4">true</td>
                    <td className="py-2">Show custom date range option</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-xs">presets</td>
                    <td className="py-2 pr-4">DatePreset[]</td>
                    <td className="py-2 pr-4">DATE_PRESETS</td>
                    <td className="py-2">Custom preset options</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Code Example */}
          <div className="rounded-xl border border-border bg-muted/30 p-6 overflow-x-auto">
            <p className="text-sm font-medium mb-3">Usage</p>
            <pre className="text-sm">
              <code>{`import { AnalyticsDatePicker } from '@/components/ui/analytics-date-picker'
import { useAnalyticsDateRange } from '@/hooks/use-analytics-date-range'

function MyComponent() {
  // Hook provides dateRange state that syncs with picker
  const { dateRange, presetId } = useAnalyticsDateRange()

  return (
    <div>
      <AnalyticsDatePicker />
      <p>Selected: {presetId}</p>
    </div>
  )
}`}</code>
            </pre>
          </div>
        </section>
      )}
    </div>
  )
}

// Training Cards Carousel Component
function TrainingCardsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const trainingTopics = [
    {
      id: 1,
      icon: BookOpen,
      title: 'Introduction to AEO',
      description: 'Learn the fundamentals of Answer Engine Optimization and how it differs from traditional SEO',
      duration: '10 min read',
      difficulty: 'Beginner',
      color: 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400',
    },
    {
      id: 2,
      icon: TrendingUp,
      title: 'Keyword Research for AI',
      description: 'Discover how to identify and target keywords that AI systems prioritize',
      duration: '15 min read',
      difficulty: 'Beginner',
      color: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 3,
      icon: FileText,
      title: 'Content Structure',
      description: 'Master the art of structuring content to maximize visibility in AI responses',
      duration: '12 min read',
      difficulty: 'Intermediate',
      color: 'bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400',
    },
    {
      id: 4,
      icon: Users,
      title: 'Entity Recognition',
      description: 'Understand how AI identifies and connects entities in your content',
      duration: '20 min read',
      difficulty: 'Intermediate',
      color: 'bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400',
    },
    {
      id: 5,
      icon: BarChart,
      title: 'Measuring AEO Success',
      description: 'Track and analyze your AEO performance with key metrics and KPIs',
      duration: '18 min read',
      difficulty: 'Advanced',
      color: 'bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400',
    },
    {
      id: 6,
      icon: Lightbulb,
      title: 'Advanced AEO Strategies',
      description: 'Implement cutting-edge techniques to dominate AI search results',
      duration: '25 min read',
      difficulty: 'Advanced',
      color: 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400',
    },
  ]

  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  const scrollLeft = () => {
    if (!scrollContainerRef.current) return
    const cardWidth = scrollContainerRef.current.clientWidth / 3
    scrollContainerRef.current.scrollBy({
      left: -cardWidth * 3,
      behavior: 'smooth'
    })
  }

  const scrollRight = () => {
    if (!scrollContainerRef.current) return
    const cardWidth = scrollContainerRef.current.clientWidth / 3
    scrollContainerRef.current.scrollBy({
      left: cardWidth * 3,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    updateScrollButtons()
    container.addEventListener('scroll', updateScrollButtons)
    window.addEventListener('resize', updateScrollButtons)

    return () => {
      container.removeEventListener('scroll', updateScrollButtons)
      window.removeEventListener('resize', updateScrollButtons)
    }
  }, [])

  return (
    <section id="training-cards" className="space-y-4 scroll-mt-8">
      <h2 className="text-lg font-semibold">Training Cards Carousel</h2>
      <p className="text-sm text-muted-foreground">Horizontal scroll carousel showing learning modules.</p>
      <div className="relative rounded-3xl border border-border bg-card">
        {/* Left Arrow Button - sits on the border */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-lg transition-all hover:bg-muted"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {/* Right Arrow Button - sits on the border */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 z-10 flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-lg transition-all hover:bg-muted"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        {/* Scrollable container - shows 3 cards at a time */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto divide-x divide-border scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 snap-x snap-mandatory rounded-3xl"
        >
          {trainingTopics.map((topic) => {
            const Icon = topic.icon
            return (
              <div
                key={topic.id}
                className="flex min-w-[calc(100%/3)] max-w-[calc(100%/3)] flex-col gap-6 p-6 snap-start md:p-8 lg:p-10"
              >
                {/* Icon & Badge */}
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${topic.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    {topic.difficulty}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between gap-6">
                  <div className="flex flex-col gap-y-2">
                    <h3 className="text-lg font-medium md:text-xl">{topic.title}</h3>
                    <p className="text-sm text-muted-foreground md:text-base">
                      {topic.description}
                    </p>
                  </div>

                  {/* Footer with duration and button */}
                  <div className="flex flex-col gap-3">
                    <span className="text-xs text-muted-foreground">{topic.duration}</span>
                    <Button asChild className="w-full">
                      <Link href="#">
                        Start Learning
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Pricing Cards Section Component
function PricingCardsSection() {
  const [selectedInterval, setSelectedInterval] = useState<'month' | 'year'>('month')

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Track and learn - For solo marketers starting their AI visibility journey.',
      trialDays: 7,
      recommended: false,
      isEnterprise: false,
      prices: {
        month: { amount: 49, currency: 'USD' },
        year: { amount: 468, currency: 'USD' },
      },
      features: [
        '1 brand',
        '25 prompts tracked',
        { text: '3 competitors', badge: 'Coming soon' },
        'Weekly Opportunities Report (10)',
        'Weekly visibility refresh',
        'Email support (48hr)',
      ],
    },
    {
      id: 'growth',
      name: 'Growth',
      description: 'Monitor and optimize - For growing brands ready to take action.',
      trialDays: 7,
      recommended: true,
      isEnterprise: false,
      prices: {
        month: { amount: 199, currency: 'USD' },
        year: { amount: 1908, currency: 'USD' },
      },
      features: [
        '5 brands',
        '150 prompts tracked',
        { text: '10 competitors', badge: 'Coming soon' },
        'Weekly Opportunities Report (30)',
        'Site audit (25 pages/mo)',
        'Email support (24hr)',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Full platform - For serious teams and small agencies.',
      trialDays: 7,
      recommended: false,
      isEnterprise: false,
      prices: {
        month: { amount: 499, currency: 'USD' },
        year: { amount: 4788, currency: 'USD' },
      },
      features: [
        '10 brands',
        '300 prompts tracked',
        { text: '100 competitors', badge: 'Coming soon' },
        'Weekly Opportunities Report (100)',
        'Content generation (50/mo)',
        'Ask AI Assistant',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Unlimited scale - For agencies and large brands with custom needs.',
      recommended: false,
      isEnterprise: true,
      prices: {
        month: { amount: 1500, currency: 'USD' },
        year: { amount: 18000, currency: 'USD' },
      },
      features: [
        'Unlimited brands',
        'Unlimited prompts',
        'Daily visibility refresh',
        'Custom integrations',
        'Dedicated Customer Success Manager',
        'SLA guarantee (99.9% uptime)',
      ],
    },
  ]

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <section id="pricing-cards" className="space-y-4 scroll-mt-8">
      <h2 className="text-lg font-semibold">Pricing Cards</h2>
      <p className="text-sm text-muted-foreground">Subscription plan cards with interval selector. Shows 4 plans with monthly/yearly toggle.</p>

      {/* Interval Selector */}
      <div className="flex justify-center">
        <div className="flex h-10 w-fit shrink-0 items-center rounded-md bg-muted p-1 text-lg">
          <button
            onClick={() => setSelectedInterval('month')}
            className={cn(
              'h-full rounded-md px-5 font-semibold transition-all',
              selectedInterval === 'month'
                ? 'bg-background text-primary shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Billed Monthly
          </button>
          <button
            onClick={() => setSelectedInterval('year')}
            className={cn(
              'h-full rounded-md px-5 font-semibold transition-all',
              selectedInterval === 'year'
                ? 'bg-background text-primary shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Billed Yearly
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
        {plans.map((plan) => {
          const price = plan.prices[selectedInterval]
          const formattedPrice = formatPrice(price.amount, price.currency)

          return (
            <div
              key={plan.id}
              className={cn(
                'w-full relative flex flex-1 grow flex-col items-stretch justify-between self-stretch rounded-lg border px-6 py-5',
                plan.recommended ? 'border-primary' : 'border-border'
              )}
            >
              {plan.recommended && (
                <div className="absolute -top-2.5 left-0 flex w-full justify-center">
                  <Badge>Recommended</Badge>
                </div>
              )}

              <div className="flex flex-col gap-y-5">
                {/* Product Details */}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  {plan.trialDays && (
                    <p className="text-xs text-muted-foreground">{plan.trialDays}-day free trial</p>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-1">
                  {plan.isEnterprise ? (
                    <div className="text-3xl font-bold">Custom</div>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">{formattedPrice}</span>
                        <span className="text-muted-foreground">/{selectedInterval === 'month' ? 'mo' : 'yr'}</span>
                      </div>
                      {selectedInterval === 'year' && (
                        <p className="text-xs text-muted-foreground">
                          ${Math.round(price.amount / 12)}/mo billed annually
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* CTA Button */}
                {plan.isEnterprise ? (
                  <Button asChild variant="default" className="group flex items-center justify-center gap-1">
                    <Link href="/sales">
                      Contact Sales
                      <ChevronRightIcon className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                ) : (
                  <Button variant="default">
                    Start Free Trial
                  </Button>
                )}

                <div className="h-px w-full border border-dashed" />

                {/* Features */}
                <ul className="space-y-2">
                  {plan.features.map((feature: string | { text: string; badge: string }) => {
                    const featureText = typeof feature === 'string' ? feature : feature.text;
                    const featureBadge = typeof feature === 'string' ? null : feature.badge;
                    return (
                      <li key={featureText} className="flex items-start gap-2">
                        <CheckIcon className="size-4 shrink-0 mt-0.5 text-primary" />
                        <span className="text-sm">{featureText}</span>
                        {featureBadge && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                            {featureBadge}
                          </Badge>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// Pricing FAQ Section Component
function PricingFAQSection() {
  const faqData = [
    {
      question: 'What pricing plans does SearchFit offer?',
      answer: (
        <div>
          We offer four plans designed to scale with your AI search visibility needs:
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li><strong>Starter ($49/mo):</strong> Track and learn - For solo marketers starting their AI visibility journey</li>
            <li><strong>Growth ($199/mo):</strong> Monitor and optimize - For growing brands ready to take action</li>
            <li><strong>Pro ($499/mo):</strong> Full platform - For serious teams and small agencies</li>
            <li><strong>Enterprise (Custom):</strong> Unlimited scale - For agencies and large brands with custom needs</li>
          </ul>
          <p className="mt-2">All plans include a 7-day free trial. No credit card required to start.</p>
        </div>
      ),
    },
    {
      question: "What's included in the Starter plan?",
      answer: (
        <div>
          The Starter plan ($49/mo) includes everything you need to start tracking AI search visibility:
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>1 brand with 25 prompts tracked</li>
            <li>3 competitors and 3 keywords monitoring (coming soon)</li>
            <li>Weekly Opportunities Report (10 opportunities)</li>
            <li>Visibility dashboard with weekly refresh</li>
            <li>Webhook support and weekly email digest</li>
            <li>Email support (48hr response time)</li>
          </ul>
        </div>
      ),
    },
    {
      question: 'What features are in the Growth plan?',
      answer: (
        <div>
          The Growth plan ($199/mo) is our most popular option, perfect for scaling brands:
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>5 brands with 150 prompts tracked</li>
            <li>10 competitors and 10 keywords monitoring (coming soon)</li>
            <li>Weekly Opportunities Report (30 opportunities)</li>
            <li>Site audit (25 pages/mo per brand)</li>
            <li>Visibility dashboard with weekly refresh</li>
            <li>Email support (24hr response time)</li>
          </ul>
        </div>
      ),
    },
    {
      question: 'What makes the Pro plan different?',
      answer: (
        <div>
          The Pro plan ($499/mo) is our full-featured option for serious teams and agencies:
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>10 brands with 300 prompts tracked</li>
            <li>100 competitors and 100 keywords monitoring (coming soon)</li>
            <li>Weekly Opportunities Report (100 opportunities)</li>
            <li>Site audit (100 pages/mo per brand)</li>
            <li>Content generation (50 pieces/mo per brand)</li>
            <li>Ask AI Assistant for insights</li>
            <li>Priority live chat support (4hr) and email support (12hr)</li>
          </ul>
        </div>
      ),
    },
    {
      question: 'How do payments work?',
      answer: (
        <div>
          We use <strong>Stripe</strong> to process all payments securely. Stripe is a PCI-compliant payment processor trusted by millions of businesses worldwide.
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Accept all major credit cards (Visa, Mastercard, Amex, Discover)</li>
            <li>Secure payment processing with bank-level encryption</li>
            <li>Automatic recurring billing for subscriptions</li>
            <li>Easy-to-access invoices and billing history</li>
            <li>We never store your full card details on our servers</li>
          </ul>
        </div>
      ),
    },
    {
      question: 'Can I change plans or cancel anytime?',
      answer: 'Yes! You can upgrade, downgrade, or cancel your subscription at any time through your account settings. When you upgrade, you\'ll be charged the prorated difference immediately. When you downgrade, the new rate takes effect at your next billing cycle. Cancellations are effective at the end of your current billing period.',
    },
    {
      question: 'Do you offer annual billing discounts?',
      answer: (
        <div>
          Yes! We offer significant savings with annual billing:
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li><strong>Starter:</strong> $39/mo when billed annually (save $120/year)</li>
            <li><strong>Growth:</strong> $159/mo when billed annually (save $480/year)</li>
            <li><strong>Pro:</strong> $399/mo when billed annually (save $1,200/year)</li>
          </ul>
          <p className="mt-2">That&apos;s up to 20% savings compared to monthly billing!</p>
        </div>
      ),
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 7-day free trial on Starter, Growth, and Pro plans so you can test the platform risk-free. After your trial ends, we don\'t offer refunds on subscription fees. However, you can cancel anytime and continue using the service until the end of your billing period. For Enterprise customers, please contact us to discuss terms.',
    },
    {
      question: 'Is my data secure?',
      answer: (
        <div>
          Absolutely. We take security seriously:
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>All data encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
            <li>Payment processing via Stripe (PCI DSS Level 1 compliant)</li>
            <li>SOC 2 Type II compliant infrastructure</li>
            <li>Regular security audits and penetration testing</li>
            <li>Enterprise plans include SLA guarantee (99.9% uptime)</li>
          </ul>
        </div>
      ),
    },
    {
      question: 'What support options are available?',
      answer: (
        <div>
          Support varies by plan:
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li><strong>Starter:</strong> Email support (48hr response)</li>
            <li><strong>Growth:</strong> Email support (24hr response)</li>
            <li><strong>Pro:</strong> Priority live chat (4hr) + Email (12hr)</li>
            <li><strong>Enterprise:</strong> Dedicated Customer Success Manager, Slack Connect, and custom training</li>
          </ul>
          <p className="mt-2">All plans include access to our documentation and community Discord.</p>
        </div>
      ),
    },
  ]

  return (
    <section id="pricing-faq" className="space-y-4 scroll-mt-8">
      <h2 className="text-lg font-semibold">Pricing FAQ</h2>
      <p className="text-sm text-muted-foreground">Frequently asked questions about pricing and plans using the Accordion component.</p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 rounded-xl border border-border p-6">
        {/* Left side: Title and description */}
        <div className="text-center lg:text-left">
          <h3 className="mb-2.5 text-2xl font-semibold md:text-3xl">
            Frequently Asked Questions
          </h3>
          <p className="mt-4 text-muted-foreground lg:max-w-[75%]">
            Have questions about our pricing or plans?{' '}
            <Link
              href="/sales"
              className="font-normal text-inherit underline hover:text-foreground"
            >
              Contact us
            </Link>{' '}
            - we&apos;re here to help you find the perfect fit for your needs.
          </p>
        </div>

        {/* Right side: FAQ Accordion */}
        <div className="mx-auto flex w-full max-w-xl flex-col">
          <Accordion type="single" collapsible>
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={index.toString()}>
                <AccordionTrigger className="text-left text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

// Subscription Settings Section Component
function SubscriptionSettingsSection() {
  const [allowMeteredUsage, setAllowMeteredUsage] = useState(true)

  // Demo data for showcase
  const subscription = {
    planName: 'Pro Plan',
    status: 'Active',
    priceAmount: 99.00,
    currency: 'USD',
    interval: 'month',
    daysLeft: 23,
    renewalDate: 'January 23, 2025',
  }

  const creditsBalance = 1250
  const currentUsage = { reports: 45, pdfs: 82, apiCalls: 3420 }
  const limits = { reports: 100, pdfs: 200, apiCalls: 10000 }

  return (
    <section id="subscription-settings" className="space-y-4 scroll-mt-8">
      <h2 className="text-lg font-semibold">Subscription Settings</h2>
      <p className="text-sm text-muted-foreground">Billing and subscription management components with usage tracking and settings rows.</p>

      <div className="flex flex-col gap-6">
        {/* Group 1: Subscription */}
        <div className="dark:ring-polar-700 dark:bg-polar-900 dark:divide-polar-700 w-full flex-col divide-y divide-gray-200 overflow-hidden rounded-2xl bg-transparent ring-1 ring-gray-200 dark:ring-1">
          <div className="flex flex-col gap-y-4 p-4">
            <div className="flex w-full flex-col">
              <h3 className="text-sm font-medium">Subscription</h3>
              <p className="dark:text-polar-500 text-xs text-gray-500 mt-0.5">
                {subscription.planName} - ${subscription.priceAmount} {subscription.currency} / {subscription.interval}
              </p>
            </div>

            <div className="space-y-3">
              {/* Current Billing */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white font-medium">Current billing period</p>
                  <p className="text-xs text-gray-500 dark:text-polar-400 mt-0.5">
                    {subscription.daysLeft} days remaining
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Manage Plan
                </Button>
              </div>

              {/* Next Billing Date */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-900 dark:text-white font-medium">Next billing date</p>
                <span className="text-sm text-gray-600 dark:text-polar-400">
                  {subscription.renewalDate}
                </span>
              </div>

              {/* Cancel Subscription */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-polar-700">
                <p className="text-sm text-gray-900 dark:text-white font-medium">Cancel subscription</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 dark:text-red-400"
                >
                  Cancel Plan
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Group 2: Credits & Usage */}
        <div className="dark:ring-polar-700 dark:bg-polar-900 dark:divide-polar-700 w-full flex-col divide-y divide-gray-200 overflow-hidden rounded-2xl bg-transparent ring-1 ring-gray-200 dark:ring-1">
          {/* Credits Balance */}
          <div className="flex items-center justify-between p-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Credits Balance</span>
              <span className="text-xs text-gray-500 dark:text-polar-500">For metered usage beyond plan limits</span>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {creditsBalance.toLocaleString()}
              </span>
              <Button size="sm" variant="outline">
                Purchase Credits
              </Button>
            </div>
          </div>

          {/* Current Usage */}
          <div className="flex flex-col gap-y-4 p-4">
            <div className="flex w-full flex-col">
              <h3 className="text-sm font-medium">Current Usage</h3>
              <p className="dark:text-polar-500 text-xs text-gray-500 mt-0.5">This billing cycle</p>
            </div>

            <div className="space-y-4">
              {/* Reports Generated */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-900 dark:text-white font-medium">Reports Generated</span>
                  <span className="text-sm text-gray-600 dark:text-polar-400">
                    {currentUsage.reports} / {limits.reports}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-polar-700">
                  <div
                    className="h-2 rounded-full bg-gray-900 dark:bg-white"
                    style={{ width: `${(currentUsage.reports / limits.reports) * 100}%` }}
                  />
                </div>
              </div>

              {/* PDF Downloads */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-900 dark:text-white font-medium">PDF Downloads</span>
                  <span className="text-sm text-gray-600 dark:text-polar-400">
                    {currentUsage.pdfs} / {limits.pdfs}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-polar-700">
                  <div
                    className="h-2 rounded-full bg-gray-900 dark:bg-white"
                    style={{ width: `${(currentUsage.pdfs / limits.pdfs) * 100}%` }}
                  />
                </div>
              </div>

              {/* API Calls */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-900 dark:text-white font-medium">API Calls</span>
                  <span className="text-sm text-gray-600 dark:text-polar-400">
                    {currentUsage.apiCalls.toLocaleString()} / {limits.apiCalls.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-polar-700">
                  <div
                    className="h-2 rounded-full bg-gray-900 dark:bg-white"
                    style={{ width: `${(currentUsage.apiCalls / limits.apiCalls) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Metered Usage Toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Allow metered usage</span>
              <span className="text-xs text-gray-500 dark:text-polar-500">Use credits when exceeding plan limits</span>
            </div>
            <Switch
              checked={allowMeteredUsage}
              onCheckedChange={setAllowMeteredUsage}
            />
          </div>
        </div>

        {/* Group 3: Billing History */}
        <div className="dark:ring-polar-700 dark:bg-polar-900 rounded-2xl bg-transparent ring-1 ring-gray-200 dark:ring-1">
          <div className="flex items-center justify-between p-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Billing History</span>
              <span className="text-xs text-gray-500 dark:text-polar-500">View past invoices and payment history</span>
            </div>
            <Button size="sm" variant="outline">
              View Invoices
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

// Project Switcher Section Component
function ProjectSwitcherSection() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeProjectId, setActiveProjectId] = useState('proj-1')

  // Demo projects data
  const projects = [
    { id: 'proj-1', name: 'SearchFit', websiteUrl: 'searchfit.io', iconUrl: null },
    { id: 'proj-2', name: 'Acme Corp', websiteUrl: 'acme.com', iconUrl: null },
    { id: 'proj-3', name: 'TechStart', websiteUrl: 'techstart.io', iconUrl: null },
    { id: 'proj-4', name: 'GlobalBrand', websiteUrl: 'globalbrand.com', iconUrl: null },
    { id: 'proj-5', name: 'InnovateLabs', websiteUrl: 'innovatelabs.co', iconUrl: null },
  ]

  const activeProject = projects.find((p) => p.id === activeProjectId)

  const filteredProjects = searchTerm.trim()
    ? projects.filter((project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.websiteUrl?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : projects

  const handleSelectProject = (projectId: string) => {
    setActiveProjectId(projectId)
    setDropdownOpen(false)
    setSearchTerm('')
  }

  return (
    <section id="project-switcher" className="space-y-4 scroll-mt-8">
      <h2 className="text-lg font-semibold">Project Switcher</h2>
      <p className="text-sm text-muted-foreground">Dropdown component for switching between projects with search, avatar fallbacks, and action items.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Demo Component */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Interactive Demo</p>
          <div className="w-full max-w-[240px]">
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <SidebarMenu>
                <SidebarMenuItem>
                  <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton className="w-full p-1.5">
                        <Avatar className="aspect-square size-6 rounded-md">
                          <AvatarImage className="rounded-md" src={activeProject?.iconUrl || undefined} />
                          <AvatarFallback className="flex size-6 items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 font-medium text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900">
                            {activeProject?.name.charAt(0).toUpperCase() || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-1 flex-row items-center gap-1 overflow-hidden">
                          <span className="truncate text-sm font-semibold leading-tight">
                            {activeProject?.name || 'Select project'}
                          </span>
                          <ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
                        </div>
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 min-w-56 rounded-lg" align="center" side="bottom" sideOffset={4}>
                      {/* Search Input */}
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search projects..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full border-none pl-8 shadow-none outline-none"
                        />
                      </div>
                      <DropdownMenuSeparator />

                      {/* Project List */}
                      {filteredProjects.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          {searchTerm ? 'No projects found' : 'No projects yet'}
                        </div>
                      ) : (
                        <ScrollArea className="-mr-1 pr-1 max-h-[200px]">
                          {filteredProjects.map((project) => (
                            <DropdownMenuItem
                              key={project.id}
                              className="cursor-pointer gap-2 p-2"
                              onClick={() => handleSelectProject(project.id)}
                            >
                              <Avatar className="aspect-square size-4 rounded-xs">
                                <AvatarImage className="rounded-xs" src={project.iconUrl || undefined} />
                                <AvatarFallback className="flex size-4 items-center justify-center rounded-xs border border-neutral-200 bg-neutral-100 text-xs font-medium text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900">
                                  {project.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="flex-1 truncate">{project.name}</span>
                              {activeProjectId === project.id && (
                                <div className="ml-auto flex size-4 items-center justify-center rounded-full bg-blue-500 text-primary-foreground">
                                  <CheckIcon className="text-current size-3 shrink-0" />
                                </div>
                              )}
                            </DropdownMenuItem>
                          ))}
                        </ScrollArea>
                      )}

                      {/* View All Projects */}
                      <DropdownMenuItem className="cursor-pointer gap-2 p-2 text-muted-foreground">
                        <MoreHorizontal className="size-4 shrink-0" />
                        All projects
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {/* Project Settings */}
                      <DropdownMenuItem className="cursor-pointer gap-2 p-2">
                        <Settings className="size-4 shrink-0 text-muted-foreground" />
                        Project settings
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {/* Add Project */}
                      <DropdownMenuItem className="cursor-pointer gap-2 p-2">
                        <Plus className="size-4 shrink-0 text-muted-foreground" />
                        Add project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Features</p>
          <div className="rounded-xl border border-border p-4 space-y-3">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckIcon className="size-4 shrink-0 mt-0.5 text-primary" />
                <span>Search filter for project list</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="size-4 shrink-0 mt-0.5 text-primary" />
                <span>Avatar with image or fallback initial</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="size-4 shrink-0 mt-0.5 text-primary" />
                <span>Active project indicator (blue checkmark)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="size-4 shrink-0 mt-0.5 text-primary" />
                <span>Scrollable list for many projects</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="size-4 shrink-0 mt-0.5 text-primary" />
                <span>Quick actions: All projects, Settings, Add new</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="size-4 shrink-0 mt-0.5 text-primary" />
                <span>Empty state handling</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="size-4 shrink-0 mt-0.5 text-primary" />
                <span>Loading state with spinner</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* States Preview */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Component States</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Normal State */}
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">Normal</span>
            <div className="w-full max-w-[200px] bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-1.5">
              <div className="flex items-center gap-2">
                <Avatar className="aspect-square size-6 rounded-md">
                  <AvatarFallback className="flex size-6 items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 font-medium text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900">
                    S
                  </AvatarFallback>
                </Avatar>
                <span className="truncate text-sm font-semibold">SearchFit</span>
                <ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Loading State */}
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">Loading</span>
            <div className="w-full max-w-[200px] bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-1.5">
              <div className="flex items-center gap-2">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
                <span className="truncate text-sm font-semibold text-muted-foreground">Loading...</span>
                <ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">No Project Selected</span>
            <div className="w-full max-w-[200px] bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-1.5">
              <div className="flex items-center gap-2">
                <Avatar className="aspect-square size-6 rounded-md">
                  <AvatarFallback className="flex size-6 items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 font-medium text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900">
                    ?
                  </AvatarFallback>
                </Avatar>
                <span className="truncate text-sm font-semibold text-muted-foreground">Select project</span>
                <ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Organization Nav Section Component
function OrganizationNavSection() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [activeOrgId, setActiveOrgId] = useState('org-1')

  // Demo data
  const user = {
    name: 'John Doe',
    email: 'john@searchfit.io',
    imageUrl: null,
  }

  const organizations = [
    { id: 'org-1', name: 'SearchFit', slug: 'searchfit', imageUrl: null },
    { id: 'org-2', name: 'Acme Corp', slug: 'acme-corp', imageUrl: null },
    { id: 'org-3', name: 'Tech Startup', slug: 'tech-startup', imageUrl: null },
  ]

  const activeOrg = organizations.find((o) => o.id === activeOrgId) || organizations[0]

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleSwitchOrg = (orgId: string) => {
    setActiveOrgId(orgId)
  }

  return (
    <section id="organization-nav" className="space-y-4 scroll-mt-8">
      <h2 className="text-lg font-semibold">Organization Nav</h2>
      <p className="text-sm text-muted-foreground">User and organization dropdown with account settings, organization switcher, and quick actions.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Demo Component */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Interactive Demo</p>
          <div className="w-full max-w-[280px]">
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={activeOrg?.imageUrl || undefined} alt={activeOrg?.name || ''} />
                        <AvatarFallback className="rounded-lg">{getInitials(activeOrg?.name || '')}</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{activeOrg?.name || 'No Organization'}</span>
                        <span className="truncate text-xs">{activeOrg?.slug || ''}</span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 min-w-56 rounded-lg" side="bottom" align="start" sideOffset={4}>
                    {/* User Info Header */}
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage src={user.imageUrl || undefined} alt={user.name} />
                          <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-medium">{user.name}</span>
                          <span className="truncate text-xs">{user.email}</span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* Organizations Section */}
                    <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      Organizations
                    </DropdownMenuLabel>
                    <DropdownMenuGroup>
                      {organizations.map((org) => (
                        <DropdownMenuItem
                          key={org.id}
                          onClick={() => handleSwitchOrg(org.id)}
                          className="flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 rounded-md">
                              <AvatarImage src={org.imageUrl || undefined} alt={org.name} />
                              <AvatarFallback className="rounded-md text-xs">{getInitials(org.name)}</AvatarFallback>
                            </Avatar>
                            <span className="truncate text-sm">{org.name}</span>
                          </div>
                          {activeOrgId === org.id && (
                            <CheckIcon className="h-4 w-4 text-primary" />
                          )}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem className="cursor-pointer">
                        <Plus className="h-4 w-4" />
                        Create Organization
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />

                    {/* Organization Actions */}
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="cursor-pointer">
                        <Building2 className="h-4 w-4" />
                        Manage Organization
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />

                    {/* Account Actions */}
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="cursor-pointer">
                        <BadgeCheck className="h-4 w-4" />
                        Account
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <CreditCard className="h-4 w-4" />
                        Billing
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Bell className="h-4 w-4" />
                        Notifications
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />

                    {/* Logged in User Section */}
                    <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      Logged in as
                    </DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="h-4 w-4" />
                        <div className="flex flex-col flex-1 min-w-0 ml-2">
                          <span className="truncate text-sm font-medium">{user.name}</span>
                          <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-destructive">
                      <LogOut className="h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Features</p>
          <div className="rounded-xl border border-border p-4 space-y-3">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckIcon className="size-4 shrink-0 mt-0.5 text-primary" />
                <span>User profile header with avatar</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="size-4 shrink-0 mt-0.5 text-primary" />
                <span>Organization switcher with list</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="size-4 shrink-0 mt-0.5 text-primary" />
                <span>Active organization indicator</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="size-4 shrink-0 mt-0.5 text-primary" />
                <span>Create organization action</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="size-4 shrink-0 mt-0.5 text-primary" />
                <span>Quick links: Account, Billing, Notifications</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="size-4 shrink-0 mt-0.5 text-primary" />
                <span>Logged-in user info section</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="size-4 shrink-0 mt-0.5 text-primary" />
                <span>Sign out action</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Menu Sections Preview */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Dropdown Menu Sections</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* User Header */}
          <div className="rounded-xl border border-border p-4 space-y-2">
            <span className="text-xs font-medium text-muted-foreground">User Header</span>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">JD</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">John Doe</span>
                <span className="truncate text-xs text-muted-foreground">john@searchfit.io</span>
              </div>
            </div>
          </div>

          {/* Organization Item */}
          <div className="rounded-xl border border-border p-4 space-y-2">
            <span className="text-xs font-medium text-muted-foreground">Organization Item</span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6 rounded-md">
                  <AvatarFallback className="rounded-md text-xs">SF</AvatarFallback>
                </Avatar>
                <span className="text-sm">SearchFit</span>
              </div>
              <CheckIcon className="h-4 w-4 text-primary" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-border p-4 space-y-2">
            <span className="text-xs font-medium text-muted-foreground">Quick Actions</span>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                <span>Account</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span>Billing</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span>Notifications</span>
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <div className="rounded-xl border border-border p-4 space-y-2">
            <span className="text-xs font-medium text-muted-foreground">Sign Out Action</span>
            <div className="flex items-center gap-2 text-sm text-destructive">
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Onboarding Modal Section Component
function OnboardingModalSection() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section id="onboarding-modal" className="space-y-4 scroll-mt-8">
      <h2 className="text-lg font-semibold">Onboarding Modal</h2>
      <p className="text-sm text-muted-foreground">Multi-step wizard modal for collecting user preferences and context during onboarding.</p>

      {/* Live Demo */}
      <div className="rounded-xl border border-border p-6 space-y-4">
        <p className="text-sm font-medium">Live Demo</p>
        <Button onClick={() => setIsOpen(true)}>
          Open Onboarding Modal
        </Button>
        <OnboardingModal
          open={isOpen}
          onOpenChange={setIsOpen}
          onComplete={(data) => {
            console.log('Onboarding completed:', data)
            setIsOpen(false)
          }}
          onSkip={() => {
            console.log('Onboarding skipped')
            setIsOpen(false)
          }}
        />
      </div>

      {/* Features */}
      <div className="rounded-xl border border-border p-6 space-y-4">
        <h3 className="text-sm font-medium">Features</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            7-step wizard with progress indicator
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Single-select and multi-select questions
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Clickable progress steps for navigation
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Skip option with graceful handling
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Continue button disabled until selection made
          </li>
        </ul>
      </div>

      {/* Question Types */}
      <div className="rounded-xl border border-border p-6 space-y-4">
        <h3 className="text-sm font-medium">Question Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Single Select (Card Style)</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Role selection</li>
              <li>• Business type</li>
              <li>• Team size</li>
              <li>• How you found us</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Multi Select (Pill Style)</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Primary goals</li>
              <li>• Help needed</li>
              <li>• Support channels</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Code Example */}
      <div className="rounded-xl border border-border bg-muted/30 p-6 overflow-x-auto">
        <p className="text-sm font-medium mb-3">Usage</p>
        <pre className="text-sm">
          <code>{`import { OnboardingModal } from '@/components/modules/hub'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Start Onboarding
      </Button>
      <OnboardingModal
        open={isOpen}
        onOpenChange={setIsOpen}
        onComplete={(data) => {
          // Handle completed data
          console.log(data)
          setIsOpen(false)
        }}
        onSkip={() => {
          // Handle skip action
          setIsOpen(false)
        }}
      />
    </>
  )
}`}</code>
        </pre>
      </div>
    </section>
  )
}

