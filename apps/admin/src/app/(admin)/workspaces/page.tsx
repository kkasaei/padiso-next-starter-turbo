"use client"

import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect, useTransition, useMemo } from "react"
import {
  Layers,
  Plus,
  Search,
  MoreHorizontal,
  Users,
  Calendar,
  ExternalLink,
  Clock,
  RefreshCw,
  CreditCard,
  XCircle,
  PlayCircle,
  Loader2,
  ChevronRight,
} from "lucide-react"
import {
  getClerkOrganizations,
  extendTrial,
  cancelSubscription,
  reactivateSubscription,
  type ClerkOrganization,
} from "@/lib/actions/workspaces"
import { trpc } from "@/lib/trpc/client"
import { toast } from "sonner"

type WorkspaceWithClerk = {
  id: string
  clerkOrgId: string
  name: string
  slug: string | null
  logoUrl: string | null
  membersCount: number
  createdAt: Date
  hasDbRecord: boolean
  hasStripeCustomer: boolean
  hasStripeSubscription: boolean
  status: string
  planId: string | null
  planName: string | null
  billingInterval: string | null
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  trialEndsAt: Date | null
  trialStartsAt: Date | null
  subscriptionPeriodEndsAt: Date | null
  subscriptionPeriodStartsAt: Date | null
  cancelAtPeriodEnd: boolean
  usageBrandsCount: number
  usageMembersCount: number
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-400", label: "Active" },
    trialing: { bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-400", label: "Trial" },
    past_due: { bg: "bg-amber-100 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-400", label: "Past Due" },
    canceled: { bg: "bg-red-100 dark:bg-red-950", text: "text-red-700 dark:text-red-400", label: "Canceled" },
    unpaid: { bg: "bg-red-100 dark:bg-red-950", text: "text-red-700 dark:text-red-400", label: "Unpaid" },
    paused: { bg: "bg-slate-100 dark:bg-slate-950", text: "text-slate-700 dark:text-slate-400", label: "Paused" },
    admin_suspended: { bg: "bg-red-100 dark:bg-red-950", text: "text-red-700 dark:text-red-400", label: "Suspended" },
    no_db_record: { bg: "bg-orange-100 dark:bg-orange-950", text: "text-orange-700 dark:text-orange-400", label: "No DB Record" },
    no_billing: { bg: "bg-slate-100 dark:bg-slate-950", text: "text-slate-700 dark:text-slate-400", label: "No Billing" },
    no_subscription: { bg: "bg-yellow-100 dark:bg-yellow-950", text: "text-yellow-700 dark:text-yellow-400", label: "No Subscription" },
  }

  const config = statusConfig[status] || statusConfig.no_billing

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}

function SyncIndicator({ hasDbRecord, hasStripeCustomer, hasStripeSubscription }: { 
  hasDbRecord: boolean
  hasStripeCustomer: boolean
  hasStripeSubscription: boolean 
}) {
  return (
    <div className="flex items-center gap-1">
      <div 
        className={`h-2 w-2 rounded-full ${hasDbRecord ? 'bg-emerald-500' : 'bg-red-500'}`} 
        title={hasDbRecord ? 'DB Record: Yes' : 'DB Record: No'}
      />
      <div 
        className={`h-2 w-2 rounded-full ${hasStripeCustomer ? 'bg-emerald-500' : 'bg-slate-300'}`} 
        title={hasStripeCustomer ? 'Stripe Customer: Yes' : 'Stripe Customer: No'}
      />
      <div 
        className={`h-2 w-2 rounded-full ${hasStripeSubscription ? 'bg-emerald-500' : 'bg-slate-300'}`} 
        title={hasStripeSubscription ? 'Subscription: Yes' : 'Subscription: No'}
      />
    </div>
  )
}

function WorkspaceActionsMenu({ 
  workspace, 
  onExtendTrial,
  onCancelSubscription,
  onReactivate,
}: { 
  workspace: WorkspaceWithClerk
  onExtendTrial: (days: number) => void
  onCancelSubscription: (immediately: boolean) => void
  onReactivate: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const hasSubscription = workspace.stripeSubscriptionId
  const isTrial = workspace.status === "trialing"
  const isCanceling = workspace.cancelAtPeriodEnd

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
            {hasSubscription && (
              <>
                {(isTrial || workspace.status === "active") && (
                  <>
                    <button
                      onClick={() => { onExtendTrial(7); setIsOpen(false) }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                    >
                      <Clock className="h-4 w-4" />
                      Extend Trial +7 days
                    </button>
                    <button
                      onClick={() => { onExtendTrial(14); setIsOpen(false) }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                    >
                      <Clock className="h-4 w-4" />
                      Extend Trial +14 days
                    </button>
                    <button
                      onClick={() => { onExtendTrial(30); setIsOpen(false) }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                    >
                      <Clock className="h-4 w-4" />
                      Extend Trial +30 days
                    </button>
                    <div className="my-1 border-t border-border" />
                  </>
                )}
                
                {isCanceling ? (
                  <button
                    onClick={() => { onReactivate(); setIsOpen(false) }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-emerald-600 hover:bg-muted"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Reactivate Subscription
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => { onCancelSubscription(false); setIsOpen(false) }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-amber-600 hover:bg-muted"
                    >
                      <XCircle className="h-4 w-4" />
                      Cancel at Period End
                    </button>
                    <button
                      onClick={() => { onCancelSubscription(true); setIsOpen(false) }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-muted"
                    >
                      <XCircle className="h-4 w-4" />
                      Cancel Immediately
                    </button>
                  </>
                )}
              </>
            )}
            
            {workspace.stripeCustomerId && (
              <>
                <div className="my-1 border-t border-border" />
                <a
                  href={`https://dashboard.stripe.com/customers/${workspace.stripeCustomerId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                  onClick={() => setIsOpen(false)}
                >
                  <CreditCard className="h-4 w-4" />
                  View in Stripe
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default function WorkspacesPage() {
  const router = useRouter()
  const [clerkOrgs, setClerkOrgs] = useState<ClerkOrganization[]>([])
  const [isLoadingClerk, setIsLoadingClerk] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isPending, startTransition] = useTransition()

  // Fetch DB workspaces via tRPC
  const { data: dbWorkspaces, isLoading: isLoadingDb, refetch: refetchDb } = trpc.workspaces.getAll.useQuery()

  // Fetch Clerk organizations
  const loadClerkOrgs = async () => {
    setIsLoadingClerk(true)
    try {
      const data = await getClerkOrganizations()
      setClerkOrgs(data)
    } catch (error) {
      console.error("Failed to load Clerk organizations:", error)
      toast.error("Failed to load organizations")
    } finally {
      setIsLoadingClerk(false)
    }
  }

  useEffect(() => {
    loadClerkOrgs()
  }, [])

  // Combine Clerk orgs with DB workspaces
  const workspacesList = useMemo<WorkspaceWithClerk[]>(() => {
    if (!dbWorkspaces) return []
    
    // Create a map of clerkOrgId -> dbWorkspace
    const dbWorkspaceMap = new Map(
      dbWorkspaces.map(w => [w.clerkOrgId, w])
    )

    // Map Clerk orgs to combined data
    return clerkOrgs.map((org) => {
      const dbWorkspace = dbWorkspaceMap.get(org.id)
      
      const hasDbRecord = !!dbWorkspace
      const hasStripeCustomer = !!dbWorkspace?.stripeCustomerId
      const hasStripeSubscription = !!dbWorkspace?.stripeSubscriptionId

      // Determine status based on sync state
      let status = "no_db_record"
      if (hasDbRecord) {
        if (hasStripeSubscription) {
          status = dbWorkspace.status
        } else if (hasStripeCustomer) {
          status = "no_subscription"
        } else {
          status = "no_billing"
        }
      }

      return {
        id: dbWorkspace?.id ?? "",
        clerkOrgId: org.id,
        name: org.name,
        slug: org.slug,
        logoUrl: org.imageUrl,
        membersCount: org.membersCount,
        createdAt: org.createdAt,
        hasDbRecord,
        hasStripeCustomer,
        hasStripeSubscription,
        status,
        planId: dbWorkspace?.planId ?? null,
        planName: dbWorkspace?.planName ?? null,
        billingInterval: dbWorkspace?.billingInterval ?? null,
        stripeCustomerId: dbWorkspace?.stripeCustomerId ?? null,
        stripeSubscriptionId: dbWorkspace?.stripeSubscriptionId ?? null,
        trialEndsAt: dbWorkspace?.trialEndsAt ?? null,
        trialStartsAt: dbWorkspace?.trialStartsAt ?? null,
        subscriptionPeriodEndsAt: dbWorkspace?.subscriptionPeriodEndsAt ?? null,
        subscriptionPeriodStartsAt: dbWorkspace?.subscriptionPeriodStartsAt ?? null,
        cancelAtPeriodEnd: dbWorkspace?.cancelAtPeriodEnd ?? false,
        usageBrandsCount: dbWorkspace?.usageBrandsCount ?? 0,
        usageMembersCount: dbWorkspace?.usageMembersCount ?? 0,
      }
    })
  }, [clerkOrgs, dbWorkspaces])

  const isLoading = isLoadingClerk || isLoadingDb

  const loadWorkspaces = async () => {
    await Promise.all([loadClerkOrgs(), refetchDb()])
  }

  const handleExtendTrial = async (workspaceId: string, days: number) => {
    startTransition(async () => {
      const result = await extendTrial(workspaceId, days)
      if (result.success) {
        toast.success(`Trial extended by ${days} days`)
        loadWorkspaces()
      } else {
        toast.error(result.error || "Failed to extend trial")
      }
    })
  }

  const handleCancelSubscription = async (workspaceId: string, immediately: boolean) => {
    startTransition(async () => {
      const result = await cancelSubscription(workspaceId, immediately)
      if (result.success) {
        toast.success(immediately ? "Subscription canceled" : "Subscription will cancel at period end")
        loadWorkspaces()
      } else {
        toast.error(result.error || "Failed to cancel subscription")
      }
    })
  }

  const handleReactivate = async (workspaceId: string) => {
    startTransition(async () => {
      const result = await reactivateSubscription(workspaceId)
      if (result.success) {
        toast.success("Subscription reactivated")
        loadWorkspaces()
      } else {
        toast.error(result.error || "Failed to reactivate subscription")
      }
    })
  }

  const filteredWorkspaces = workspacesList.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.slug?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Stats
  const totalWorkspaces = workspacesList.length
  const activeWorkspaces = workspacesList.filter(w => w.status === "active" || w.status === "trialing").length
  const trialWorkspaces = workspacesList.filter(w => w.status === "trialing").length

  return (
    <div className="mt-10">
      <div className="flex flex-1 flex-col gap-8 overflow-y-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Workspaces</h1>
            <p className="text-muted-foreground mt-1">
              Manage client workspaces and their subscriptions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={loadWorkspaces}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button asChild>
              <Link href="/workspaces/new" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Workspace
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{totalWorkspaces}</p>
                <p className="text-sm text-muted-foreground">Total Workspaces</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                <PlayCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{activeWorkspaces}</p>
                <p className="text-sm text-muted-foreground">Active Subscriptions</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950">
                <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{trialWorkspaces}</p>
                <p className="text-sm text-muted-foreground">On Trial</p>
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
              placeholder="Search workspaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Workspaces List */}
        <div className="rounded-3xl border border-border bg-card overflow-hidden">
          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredWorkspaces.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Layers className="h-10 w-10 mb-3 opacity-50" />
              <p>No workspaces found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground" style={{ width: '25%' }}>Workspace</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground" style={{ width: '8%' }}>Members</th>
                    <th className="px-4 py-4 text-center text-sm font-medium text-muted-foreground" style={{ width: '8%' }} title="DB | Stripe | Sub">Sync</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground" style={{ width: '12%' }}>Plan</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground" style={{ width: '18%' }}>Trial / Period</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground" style={{ width: '14%' }}>Status</th>
                    <th className="px-4 py-4 text-right text-sm font-medium text-muted-foreground" style={{ width: '8%' }}></th>
                  </tr>
                </thead>
                <tbody className={`divide-y divide-border ${isPending ? 'opacity-50' : ''}`}>
                  {filteredWorkspaces.map((workspace) => (
                    <tr
                      key={workspace.clerkOrgId}
                      className="hover:bg-muted/30 transition-colors cursor-pointer group"
                      onClick={() => router.push(`/workspaces/${workspace.clerkOrgId}`)}
                    >
                      {/* Workspace Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {workspace.logoUrl ? (
                            <img 
                              src={workspace.logoUrl} 
                              alt={workspace.name}
                              className="h-10 w-10 rounded-lg object-cover shrink-0"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950 shrink-0">
                              <Layers className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium truncate">{workspace.name}</p>
                            <p className="text-sm text-muted-foreground truncate">{workspace.slug || "no-slug"}</p>
                          </div>
                        </div>
                      </td>

                      {/* Members */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                          {workspace.membersCount}
                        </div>
                      </td>

                      {/* Sync Status */}
                      <td className="px-4 py-4">
                        <div className="flex justify-center">
                          <SyncIndicator 
                            hasDbRecord={workspace.hasDbRecord}
                            hasStripeCustomer={workspace.hasStripeCustomer}
                            hasStripeSubscription={workspace.hasStripeSubscription}
                          />
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="px-4 py-4 text-sm">
                        {workspace.planName ? (
                          <div>
                            <p className="font-medium capitalize">{workspace.planName}</p>
                            <p className="text-xs text-muted-foreground capitalize">{workspace.billingInterval || '-'}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>

                      {/* Trial / Period */}
                      <td className="px-4 py-4 text-sm">
                        {workspace.trialEndsAt ? (
                          <div>
                            <div className="flex items-center gap-1.5 text-blue-600">
                              <Clock className="h-3.5 w-3.5 shrink-0" />
                              <span className="text-xs font-medium">Trial ends:</span>
                              <span className="text-xs">
                                {new Date(workspace.trialEndsAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        ) : workspace.subscriptionPeriodEndsAt ? (
                          <div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <span className="text-xs text-muted-foreground">Renews:</span>
                              <span className="text-xs">
                                {new Date(workspace.subscriptionPeriodEndsAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <div>
                          <StatusBadge status={workspace.status} />
                          {workspace.cancelAtPeriodEnd && (
                            <p className="text-xs text-amber-600 mt-1">Canceling</p>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <WorkspaceActionsMenu
                            workspace={workspace}
                            onExtendTrial={(days) => handleExtendTrial(workspace.id, days)}
                            onCancelSubscription={(immediately) => handleCancelSubscription(workspace.id, immediately)}
                            onReactivate={() => handleReactivate(workspace.id)}
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
