"use client"

import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Users,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Building2,
  Shield,
  Trash2,
  ExternalLink,
  Loader2,
  Activity,
  UserPlus,
  CreditCard,
  AlertTriangle,
} from "lucide-react"
import { getUserById, deleteUser, banUser, type UserWithOrgs } from "@/lib/actions/users"
import { toast } from "sonner"

type ActivityItem = {
  id: string
  type: string
  title: string
  description: string
  timestamp: Date
}

// Generate mock activities for a user
function generateUserActivities(email: string): ActivityItem[] {
  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "login",
      title: "Signed in",
      description: "User signed in from Chrome on macOS",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: "2",
      type: "workspace_join",
      title: "Joined workspace",
      description: "Joined Acme Corp workspace as member",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      id: "3",
      type: "login",
      title: "Signed in",
      description: "User signed in from Safari on iOS",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    },
    {
      id: "4",
      type: "profile_update",
      title: "Profile updated",
      description: "Updated profile picture",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
    },
    {
      id: "5",
      type: "signup",
      title: "Account created",
      description: `Account created with ${email}`,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    },
  ]
  return activities
}

function getActivityIcon(type: string) {
  switch (type) {
    case "login":
      return { icon: Users, bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-600 dark:text-blue-400" }
    case "signup":
      return { icon: UserPlus, bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-600 dark:text-emerald-400" }
    case "workspace_join":
      return { icon: Building2, bg: "bg-purple-100 dark:bg-purple-950", text: "text-purple-600 dark:text-purple-400" }
    case "profile_update":
      return { icon: Users, bg: "bg-amber-100 dark:bg-amber-950", text: "text-amber-600 dark:text-amber-400" }
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
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function UserDetailsPage() {
  const params = useParams()
  const userId = params.id as string
  
  const [user, setUser] = useState<UserWithOrgs | null>(null)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true)
      try {
        const userData = await getUserById(userId)
        setUser(userData)
        if (userData) {
          setActivities(generateUserActivities(userData.email))
        }
      } catch (error) {
        console.error("Failed to load user:", error)
        toast.error("Failed to load user")
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [userId])

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }
    const result = await deleteUser(userId)
    if (result.success) {
      toast.success("User deleted")
      window.location.href = "/admin/users"
    } else {
      toast.error(result.error || "Failed to delete user")
    }
  }

  const handleBan = async () => {
    if (!confirm("Are you sure you want to ban this user?")) {
      return
    }
    const result = await banUser(userId)
    if (result.success) {
      toast.success("User banned")
    } else {
      toast.error(result.error || "Failed to ban user")
    }
  }

  if (isLoading) {
    return (
      <div className="mt-10 flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mt-10 p-6 md:p-8">
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Users className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">User not found</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/admin/users">Back to Users</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-10">
      <div className="flex flex-1 flex-col gap-8 overflow-y-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/users">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-4">
              {user.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt={user.fullName}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">{user.fullName}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{user.email}</span>
                  {user.emailVerified ? (
                    <CheckCircle className="h-4 w-4 text-emerald-500" title="Verified" />
                  ) : (
                    <XCircle className="h-4 w-4 text-amber-500" title="Not verified" />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://dashboard.clerk.com/apps/app_*/instances/ins_*/users/${user.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View in Clerk
              </a>
            </Button>
            <Button variant="outline" size="sm" onClick={handleBan}>
              <Shield className="h-4 w-4 mr-2" />
              Ban
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* User Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Joined</p>
                <p className="font-semibold">
                  {new Date(user.createdAt).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Sign In</p>
                <p className="font-semibold">
                  {user.lastSignInAt 
                    ? new Date(user.lastSignInAt).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })
                    : "Never"
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950">
                <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Workspaces</p>
                <p className="font-semibold">{user.organizations.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Workspace Memberships */}
          <div className="rounded-3xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Workspace Memberships
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Workspaces this user belongs to
              </p>
            </div>
            {user.organizations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Building2 className="h-10 w-10 mb-3 opacity-50" />
                <p>No workspace memberships</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {user.organizations.map((org) => (
                  <div
                    key={org.id}
                    className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950">
                        <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium">{org.name}</p>
                        <p className="text-sm text-muted-foreground">{org.slug || "no-slug"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        org.role === "org:admin" 
                          ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400"
                          : "bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400"
                      }`}>
                        {org.role.replace("org:", "")}
                      </span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/workspaces`}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="rounded-3xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                User's recent actions and events
              </p>
            </div>
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Activity className="h-10 w-10 mb-3 opacity-50" />
                <p>No recent activity</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {activities.map((activity) => {
                  const { icon: Icon, bg, text } = getActivityIcon(activity.type)
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${bg} shrink-0 mt-0.5`}>
                        <Icon className={`h-4 w-4 ${text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Additional Details */}
        <div className="rounded-3xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border p-6">
            <h2 className="text-lg font-semibold">User Details</h2>
          </div>
          <div className="p-6">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dt className="text-sm text-muted-foreground">User ID</dt>
                <dd className="font-mono text-sm mt-1">{user.id}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Email Address</dt>
                <dd className="text-sm mt-1 flex items-center gap-2">
                  {user.email}
                  {user.emailVerified ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-950 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                      Unverified
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">First Name</dt>
                <dd className="text-sm mt-1">{user.firstName || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Last Name</dt>
                <dd className="text-sm mt-1">{user.lastName || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Created At</dt>
                <dd className="text-sm mt-1">
                  {new Date(user.createdAt).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Last Sign In</dt>
                <dd className="text-sm mt-1">
                  {user.lastSignInAt 
                    ? new Date(user.lastSignInAt).toLocaleString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })
                    : "Never"
                  }
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
