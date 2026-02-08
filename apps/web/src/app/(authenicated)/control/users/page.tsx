"use client"

import { Button } from "@workspace/ui/components/button"
import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Users,
  Search,
  MoreHorizontal,
  Mail,
  Calendar,
  Building2,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Trash2,
  ExternalLink,
  ChevronRight,
} from "lucide-react"
import {
  getUsers,
  deleteUser,
  banUser,
  type UserWithOrgs,
} from "@/lib/admin-actions/users"
import { toast } from "sonner"

function UserActionsMenu({ 
  user, 
  onDelete,
  onBan,
}: { 
  user: UserWithOrgs
  onDelete: () => void
  onBan: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-border bg-card shadow-lg py-1">
            <a
              href={`https://dashboard.clerk.com/apps/app_*/instances/ins_*/users/${user.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              <ExternalLink className="h-4 w-4" />
              View in Clerk
            </a>
            <div className="my-1 border-t border-border" />
            <button
              onClick={() => { onBan(); setIsOpen(false) }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-amber-600 hover:bg-muted"
            >
              <Shield className="h-4 w-4" />
              Ban User
            </button>
            <button
              onClick={() => { onDelete(); setIsOpen(false) }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-muted"
            >
              <Trash2 className="h-4 w-4" />
              Delete User
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function UsersPage() {
  const router = useRouter()
  const [usersList, setUsersList] = useState<UserWithOrgs[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isPending, startTransition] = useTransition()

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const data = await getUsers()
      setUsersList(data)
    } catch (error) {
      console.error("Failed to load users:", error)
      toast.error("Failed to load users")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }
    
    startTransition(async () => {
      const result = await deleteUser(userId)
      if (result.success) {
        toast.success("User deleted")
        loadUsers()
      } else {
        toast.error(result.error || "Failed to delete user")
      }
    })
  }

  const handleBan = async (userId: string) => {
    if (!confirm("Are you sure you want to ban this user?")) {
      return
    }
    
    startTransition(async () => {
      const result = await banUser(userId)
      if (result.success) {
        toast.success("User banned")
        loadUsers()
      } else {
        toast.error(result.error || "Failed to ban user")
      }
    })
  }

  const filteredUsers = usersList.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Stats
  const totalUsers = usersList.length
  const verifiedUsers = usersList.filter(u => u.emailVerified).length
  const usersWithOrgs = usersList.filter(u => u.organizations.length > 0).length

  return (
    <div className="mt-10">
      <div className="flex flex-1 flex-col gap-8 overflow-y-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
            <p className="text-muted-foreground mt-1">
              Manage platform users and their access
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={loadUsers}
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
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{totalUsers}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{verifiedUsers}</p>
                <p className="text-sm text-muted-foreground">Verified Emails</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950">
                <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{usersWithOrgs}</p>
                <p className="text-sm text-muted-foreground">In Workspaces</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="rounded-3xl border border-border bg-card overflow-hidden">
          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Users className="h-10 w-10 mb-3 opacity-50" />
              <p>No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground" style={{ width: '28%' }}>User</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground" style={{ width: '22%' }}>Email</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground" style={{ width: '20%' }}>Workspaces</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground" style={{ width: '12%' }}>Last Sign In</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground" style={{ width: '10%' }}>Joined</th>
                    <th className="px-4 py-4 text-right text-sm font-medium text-muted-foreground" style={{ width: '8%' }}></th>
                  </tr>
                </thead>
                <tbody className={`divide-y divide-border ${isPending ? 'opacity-50' : ''}`}>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-muted/30 transition-colors cursor-pointer group"
                      onClick={() => router.push(`/users/${user.id}`)}
                    >
                      {/* User Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.imageUrl ? (
                            <img 
                              src={user.imageUrl} 
                              alt={user.fullName}
                              className="h-10 w-10 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950 shrink-0">
                              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium truncate group-hover:text-primary transition-colors">{user.fullName}</p>
                            <p className="text-xs text-muted-foreground truncate">ID: {user.id.slice(0, 12)}...</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm truncate">{user.email}</span>
                          {user.emailVerified ? (
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" title="Verified" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" title="Not verified" />
                          )}
                        </div>
                      </td>

                      {/* Workspaces */}
                      <td className="px-4 py-4">
                        {user.organizations.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {user.organizations.slice(0, 2).map((org) => (
                              <span 
                                key={org.id}
                                className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-950 px-2 py-0.5 text-xs font-medium text-purple-700 dark:text-purple-400"
                                title={`${org.name} (${org.role})`}
                              >
                                {org.name.length > 15 ? `${org.name.slice(0, 15)}...` : org.name}
                              </span>
                            ))}
                            {user.organizations.length > 2 && (
                              <span className="text-xs text-muted-foreground">
                                +{user.organizations.length - 2} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>

                      {/* Last Sign In */}
                      <td className="px-4 py-4 text-sm">
                        {user.lastSignInAt ? (
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="text-xs">
                              {new Date(user.lastSignInAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">Never</span>
                        )}
                      </td>

                      {/* Joined */}
                      <td className="px-4 py-4 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="text-xs">
                            {new Date(user.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: '2-digit'
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <UserActionsMenu
                            user={user}
                            onDelete={() => handleDelete(user.id)}
                            onBan={() => handleBan(user.id)}
                          />
                          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
