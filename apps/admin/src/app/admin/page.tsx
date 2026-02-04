"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import { Users, Layers, Plus, FileText } from "lucide-react"
import { trpc } from "@/lib/trpc/client"
import type { Workspace } from "@workspace/db"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

// Generate mock time series data
const generateData = (baseValue: number, variance: number): ChartDataPoint[] => {
  const data: ChartDataPoint[] = []
  const startDate = new Date("2026-01-19")

  for (let i = 0; i < 8; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    const randomValue = baseValue + Math.floor(Math.random() * variance)

    data.push({
      date: date.toISOString().split("T")[0] ?? "",
      displayDate: `${date.toLocaleDateString("en-US", { month: "short" })} ${date.getDate()}`,
      value: randomValue,
    })
  }

  return data
}

type ChartDataPoint = {
  date: string
  displayDate: string
  value: number
}

// Mock data for each metric
const projectsData = generateData(10, 4)
const visibilityData = generateData(68, 12)
const reportsData = generateData(130, 40)
const creditsData = generateData(700, 200)

// Area Chart Component
function MetricAreaChart({ data, color = "#2563eb" }: { data: ChartDataPoint[]; color?: string }) {
  return (
    <div className="flex w-full flex-col gap-y-2 rounded-3xl bg-white dark:bg-zinc-900 p-4">
      <div style={{ height: "200px", width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.025} />
                <stop offset="100%" stopColor={color} stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="6 6"
              stroke="#ccc"
              opacity={0.3}
              vertical={true}
              horizontal={false}
            />
            <XAxis
              dataKey="displayDate"
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#gradient-${color.replace("#", "")})`}
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Metric Card Component
function MetricCard({
  title,
  value,
  dateRange,
  data,
  color = "#2563eb",
}: {
  title: string
  value: string | number
  dateRange: string
  data: ChartDataPoint[]
  color?: string
}) {
  return (
    <div className="flex w-full flex-col justify-between p-2 bg-transparent border border-t-0 border-r border-b border-l-0 border-gray-200 dark:border-zinc-700 shadow-none">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between p-6">
        <div className="flex w-full flex-col gap-y-4">
          <div className="flex flex-row items-center gap-x-2">
            <h3 className="text-lg">{title}</h3>
          </div>
          <h2 className="text-5xl font-light">{value}</h2>
          <div className="flex flex-col gap-x-6 gap-y-2 md:flex-row md:items-center">
            <div className="flex flex-row items-center gap-x-2 text-sm">
              <span
                className="h-3 w-3 rounded-full border-2"
                style={{ borderColor: color }}
              />
              <span className="text-gray-500 dark:text-zinc-500">{dateRange}</span>
            </div>
          </div>
        </div>
      </div>
      <MetricAreaChart data={data} color={color} />
    </div>
  )
}

type AdminStats = {
  publicReports: number
  contactRequests: number
  waitlistRequests: number
}

function AnalyticsSection({ workspaces, adminStats }: { workspaces: Workspace[]; adminStats?: AdminStats }) {
  const [dateRange, setDateRange] = useState("7d")

  const totalWorkspaces = workspaces.length
  const trialingWorkspaces = workspaces.filter(w => w.status === "trialing").length
  const trialToSignupRatio = totalWorkspaces > 0 
    ? Math.round((trialingWorkspaces / totalWorkspaces) * 100) 
    : 0
  const growthPlanWorkspaces = workspaces.filter(w => w.planId === "growth").length
  const customPlanWorkspaces = workspaces.filter(w => w.planId === "custom" || w.planId === "enterprise").length

  const cards = [
    {
      title: "Total Workspaces",
      value: totalWorkspaces,
      dateRange: "Jan 19 – Jan 26, 2026",
      data: projectsData,
      color: "#3b82f6",
    },
    {
      title: "Trials to Signups",
      value: `${trialToSignupRatio}%`,
      dateRange: "Jan 19 – Jan 26, 2026",
      data: visibilityData,
      color: "#10b981",
    },
    {
      title: "Total Growth Plan",
      value: growthPlanWorkspaces,
      dateRange: "Jan 19 – Jan 26, 2026",
      data: projectsData,
      color: "#f59e0b",
    },
    {
      title: "Total Custom Plans",
      value: customPlanWorkspaces,
      dateRange: "Jan 19 – Jan 26, 2026",
      data: visibilityData,
      color: "#8b5cf6",
    },
    {
      title: "Public Reports",
      value: adminStats?.publicReports ?? 0,
      dateRange: "Jan 19 – Jan 26, 2026",
      data: reportsData,
      color: "#ec4899",
    },
    {
      title: "Waitlist Requests",
      value: adminStats?.waitlistRequests ?? 0,
      dateRange: "Jan 19 – Jan 26, 2026",
      data: creditsData,
      color: "#06b6d4",
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <p className="text-lg font-medium text-foreground">Analytics</p>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-zinc-700">
        <div className="grid grid-cols-1 md:grid-cols-2 [clip-path:inset(1px_1px_1px_1px)]">
          {cards.map((card, index) => (
            <MetricCard key={index} {...card} />
          ))}
        </div>
      </div>
    </div>
  )
}

function OverviewCard({ workspaces, adminStats }: { workspaces: Workspace[]; adminStats?: AdminStats }) {
  const totalWorkspaces = workspaces.length
  const activeWorkspaces = workspaces.filter(w => w.status === "active" || w.status === "trialing").length

  return (
    <div className="grid grid-cols-1 divide-y divide-border rounded-3xl border border-border bg-card lg:grid-cols-3 lg:divide-x lg:divide-y-0">
      {/* Workspaces - First */}
      <div className="flex flex-col gap-6 p-6 md:p-8 lg:p-10">
        <div className="shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950">
            <Layers className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between gap-6">
          <div className="flex flex-col gap-y-2">
            <h3 className="text-lg font-medium md:text-xl">Workspaces</h3>
            <p className="text-sm text-muted-foreground md:text-base">
              Manage client workspaces and their subscriptions
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Workspaces</span>
              <span className="font-semibold">{totalWorkspaces}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Active Subscriptions</span>
              <span className="font-semibold text-emerald-600">{activeWorkspaces}</span>
            </div>
            <div className="flex gap-2 mt-2">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/admin/workspaces">View All</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/admin/workspaces/new" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  New
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Users - Second */}
      <div className="flex flex-col gap-6 p-6 md:p-8 lg:p-10">
        <div className="shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between gap-6">
          <div className="flex flex-col gap-y-2">
            <h3 className="text-lg font-medium md:text-xl">Users</h3>
            <p className="text-sm text-muted-foreground md:text-base">
              Manage platform users and access controls
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Workspaces</span>
              <span className="font-semibold">{totalWorkspaces}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">With Subscriptions</span>
              <span className="font-semibold text-emerald-600">{activeWorkspaces}</span>
            </div>
            <Button asChild className="w-full mt-2">
              <Link href="/admin/users">Manage Users</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Public Reports - Third */}
      <div className="flex flex-col gap-6 p-6 md:p-8 lg:p-10">
        <div className="shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
            <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between gap-6">
          <div className="flex flex-col gap-y-2">
            <h3 className="text-lg font-medium md:text-xl">Public Reports</h3>
            <p className="text-sm text-muted-foreground md:text-base">
              Monitor reports, contacts, and waitlist
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Public Reports</span>
              <span className="font-semibold">{adminStats?.publicReports ?? 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Waitlist Requests</span>
              <span className="font-semibold text-blue-600">{adminStats?.waitlistRequests ?? 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Contact Requests</span>
              <span className="font-semibold text-emerald-600">{adminStats?.contactRequests ?? 0}</span>
            </div>
            <Button asChild className="w-full mt-2">
              <Link href="/admin/public-reports">View Reports</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { data: workspaces = [] } = trpc.workspaces.getAll.useQuery()
  const { data: adminStats } = trpc.admin.getStats.useQuery()

  return (
    <div className="mt-10">
      {/* Content */}
      <div className="flex flex-1 flex-col gap-8 overflow-y-auto p-6 md:p-8">
        <OverviewCard workspaces={workspaces} adminStats={adminStats} />
        <AnalyticsSection workspaces={workspaces} adminStats={adminStats} />
      </div>
    </div>
  )
}
