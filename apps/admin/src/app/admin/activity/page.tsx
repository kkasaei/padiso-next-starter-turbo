"use client"

import { Button } from "@workspace/ui/components/button"
import { useState, useEffect, useMemo } from "react"
import {
  Activity,
  Users,
  Layers,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Loader2,
  Filter,
  UserPlus,
  UserMinus,
  Building2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

type ActivityType = "user_signup" | "user_deleted" | "workspace_created" | "subscription_started" | "subscription_canceled" | "trial_extended" | "payment_failed" | "payment_succeeded"

type ActivityItem = {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: Date
  metadata?: Record<string, string>
}

// Mock activity data - in production, this would come from a database/API
const generateMockActivities = (): ActivityItem[] => {
  const types: ActivityType[] = ["user_signup", "user_deleted", "workspace_created", "subscription_started", "subscription_canceled", "trial_extended", "payment_failed", "payment_succeeded"]
  const activities: ActivityItem[] = []
  
  const workspaces = ["Acme Corp", "TechStart Inc", "Global Media", "Enterprise Solutions", "Startup Labs", "Demo Company", "New Client LLC", "Beta Testers", "Alpha Group", "Omega Systems"]
  const emails = ["john.doe@example.com", "sarah.smith@company.com", "mike.wilson@startup.io", "anna.jones@enterprise.com", "test.user@demo.com", "new.user@beta.co", "admin@alpha.io"]
  
  for (let i = 0; i < 75; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    const workspace = workspaces[Math.floor(Math.random() * workspaces.length)]
    const email = emails[Math.floor(Math.random() * emails.length)]
    const hoursAgo = Math.floor(Math.random() * 720) // Up to 30 days
    
    let title = ""
    let description = ""
    let metadata: Record<string, string> = {}
    
    switch (type) {
      case "user_signup":
        title = "New user registered"
        description = `${email} signed up`
        metadata = { email }
        break
      case "user_deleted":
        title = "User deleted"
        description = `${email} account was deleted`
        metadata = { email }
        break
      case "workspace_created":
        title = "New workspace created"
        description = `${workspace} workspace was created`
        metadata = { workspace }
        break
      case "subscription_started":
        title = "Subscription started"
        description = `${workspace} started a Growth plan subscription`
        metadata = { workspace, plan: "Growth" }
        break
      case "subscription_canceled":
        title = "Subscription canceled"
        description = `${workspace} canceled their subscription`
        metadata = { workspace }
        break
      case "trial_extended":
        const days = [7, 14, 30][Math.floor(Math.random() * 3)]
        title = "Trial extended"
        description = `Trial extended by ${days} days for ${workspace}`
        metadata = { workspace, days: String(days) }
        break
      case "payment_succeeded":
        const amount = ["$99.00", "$149.00", "$990.00"][Math.floor(Math.random() * 3)]
        title = "Payment successful"
        description = `${amount} payment received from ${workspace}`
        metadata = { workspace, amount }
        break
      case "payment_failed":
        title = "Payment failed"
        description = `Payment failed for ${workspace} - card declined`
        metadata = { workspace, reason: "card_declined" }
        break
    }
    
    activities.push({
      id: String(i + 1),
      type,
      title,
      description,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * hoursAgo),
      metadata,
    })
  }
  
  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

function getActivityIcon(type: ActivityType) {
  switch (type) {
    case "user_signup":
      return { icon: UserPlus, bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-600 dark:text-blue-400" }
    case "user_deleted":
      return { icon: UserMinus, bg: "bg-red-100 dark:bg-red-950", text: "text-red-600 dark:text-red-400" }
    case "workspace_created":
      return { icon: Building2, bg: "bg-purple-100 dark:bg-purple-950", text: "text-purple-600 dark:text-purple-400" }
    case "subscription_started":
      return { icon: CheckCircle, bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-600 dark:text-emerald-400" }
    case "subscription_canceled":
      return { icon: XCircle, bg: "bg-amber-100 dark:bg-amber-950", text: "text-amber-600 dark:text-amber-400" }
    case "trial_extended":
      return { icon: Clock, bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-600 dark:text-blue-400" }
    case "payment_succeeded":
      return { icon: CreditCard, bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-600 dark:text-emerald-400" }
    case "payment_failed":
      return { icon: AlertTriangle, bg: "bg-red-100 dark:bg-red-950", text: "text-red-600 dark:text-red-400" }
    default:
      return { icon: Activity, bg: "bg-slate-100 dark:bg-slate-950", text: "text-slate-600 dark:text-slate-400" }
  }
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  
  if (seconds < 60) return "Just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const ITEMS_PER_PAGE = 15

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "users" | "workspaces" | "billing">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const loadActivities = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    setActivities(generateMockActivities())
    setIsLoading(false)
  }

  useEffect(() => {
    loadActivities()
  }, [])

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [filter, searchQuery])

  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      // Filter by type
      let matchesFilter = true
      if (filter === "users") matchesFilter = activity.type.startsWith("user_")
      else if (filter === "workspaces") matchesFilter = activity.type === "workspace_created"
      else if (filter === "billing") matchesFilter = ["subscription_started", "subscription_canceled", "trial_extended", "payment_succeeded", "payment_failed"].includes(activity.type)
      
      // Filter by search
      const matchesSearch = searchQuery === "" || 
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesFilter && matchesSearch
    })
  }, [activities, filter, searchQuery])

  // Pagination
  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE)
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Stats
  const todayActivities = activities.filter(a => 
    new Date(a.timestamp).toDateString() === new Date().toDateString()
  ).length
  const newUsersToday = activities.filter(a => 
    a.type === "user_signup" && new Date(a.timestamp).toDateString() === new Date().toDateString()
  ).length
  const paymentsToday = activities.filter(a => 
    a.type === "payment_succeeded" && new Date(a.timestamp).toDateString() === new Date().toDateString()
  ).length

  return (
    <div className="mt-10">
      <div className="flex flex-1 flex-col gap-8 overflow-y-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Recent Activity</h1>
            <p className="text-muted-foreground mt-1">
              Monitor platform events and actions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={loadActivities}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{todayActivities}</p>
                <p className="text-sm text-muted-foreground">Events Today</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                <UserPlus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{newUsersToday}</p>
                <p className="text-sm text-muted-foreground">New Users Today</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950">
                <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{paymentsToday}</p>
                <p className="text-sm text-muted-foreground">Payments Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-1">
              {[
                { id: "all", label: "All" },
                { id: "users", label: "Users" },
                { id: "workspaces", label: "Workspaces" },
                { id: "billing", label: "Billing" },
              ].map((f) => (
                <Button
                  key={f.id}
                  variant={filter === f.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter(f.id as typeof filter)}
                >
                  {f.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="rounded-3xl border border-border bg-card overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Activity className="h-10 w-10 mb-3 opacity-50" />
              <p>No activity found</p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground" style={{ width: '5%' }}></th>
                      <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground" style={{ width: '20%' }}>Event</th>
                      <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground" style={{ width: '45%' }}>Description</th>
                      <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground" style={{ width: '15%' }}>Type</th>
                      <th className="px-4 py-4 text-right text-sm font-medium text-muted-foreground" style={{ width: '15%' }}>Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginatedActivities.map((activity) => {
                      const { icon: Icon, bg, text } = getActivityIcon(activity.type)
                      return (
                        <tr
                          key={activity.id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${bg}`}>
                              <Icon className={`h-4 w-4 ${text}`} />
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-medium text-sm">{activity.title}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${bg} ${text}`}>
                              {activity.type.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="text-sm text-muted-foreground">
                              {formatTimeAgo(activity.timestamp)}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-border px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredActivities.length)} of {filteredActivities.length} results
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "ghost"}
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
