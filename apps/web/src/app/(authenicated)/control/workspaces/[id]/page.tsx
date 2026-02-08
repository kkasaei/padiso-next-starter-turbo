"use client"

import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect, useTransition } from "react"
import {
  ArrowLeft,
  Layers,
  Users,
  Calendar,
  Clock,
  CreditCard,
  ExternalLink,
  CheckCircle,
  XCircle,
  Building2,
  Activity,
  Package,
  Zap,
  Loader2,
  RefreshCw,
  PlayCircle,
  Shield,
} from "lucide-react"
import {
  getWorkspaceByClerkOrgId,
  getWorkspaceMembers,
  extendTrial,
  cancelSubscription,
  reactivateSubscription,
  updateWorkspaceStatus,
  updateWorkspacePlanLimits,
  setTrialEndDate,
  addBonusCredits,
  resetUsage,
  updateUsage,
  createDbRecordForClerkOrg,
  type WorkspaceWithClerk,
  type WorkspaceMember,
  type PlanLimitsUpdate,
} from "@/lib/admin-actions/workspaces"
import { toast } from "sonner"

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-400", label: "Active" },
    trialing: { bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-400", label: "Trial" },
    past_due: { bg: "bg-amber-100 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-400", label: "Past Due" },
    canceled: { bg: "bg-red-100 dark:bg-red-950", text: "text-red-700 dark:text-red-400", label: "Canceled" },
    unpaid: { bg: "bg-red-100 dark:bg-red-950", text: "text-red-700 dark:text-red-400", label: "Unpaid" },
    incomplete: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-400", label: "Incomplete" },
    paused: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-400", label: "Paused" },
    admin_suspended: { bg: "bg-red-100 dark:bg-red-950", text: "text-red-700 dark:text-red-400", label: "Suspended" },
    no_db_record: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400", label: "No DB Record" },
    no_billing: { bg: "bg-amber-100 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-400", label: "No Billing" },
    no_subscription: { bg: "bg-amber-100 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-400", label: "No Subscription" },
  }
  const variant = variants[status] || variants.incomplete
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${variant.bg} ${variant.text}`}>
      {variant.label}
    </span>
  )
}

function SyncIndicator({ hasDbRecord, hasStripeCustomer, hasStripeSubscription }: {
  hasDbRecord: boolean
  hasStripeCustomer: boolean
  hasStripeSubscription: boolean
}) {
  return (
    <div className="flex items-center gap-1" title={`DB: ${hasDbRecord ? '✓' : '✗'} | Stripe Customer: ${hasStripeCustomer ? '✓' : '✗'} | Subscription: ${hasStripeSubscription ? '✓' : '✗'}`}>
      <div className={`w-2 h-2 rounded-full ${hasDbRecord ? 'bg-emerald-500' : 'bg-gray-300'}`} title="Database Record" />
      <div className={`w-2 h-2 rounded-full ${hasStripeCustomer ? 'bg-emerald-500' : 'bg-gray-300'}`} title="Stripe Customer" />
      <div className={`w-2 h-2 rounded-full ${hasStripeSubscription ? 'bg-emerald-500' : 'bg-gray-300'}`} title="Stripe Subscription" />
    </div>
  )
}

function InfoCard({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon: React.ElementType }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      {children}
    </div>
  )
}

export default function WorkspaceDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const clerkOrgId = params.id as string // This is the Clerk org ID

  const [workspace, setWorkspace] = useState<WorkspaceWithClerk | null>(null)
  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  // Edit mode states
  const [isEditingLimits, setIsEditingLimits] = useState(false)
  const [isEditingTrial, setIsEditingTrial] = useState(false)
  const [isEditingUsage, setIsEditingUsage] = useState(false)
  const [editLimits, setEditLimits] = useState<PlanLimitsUpdate>({})
  const [trialEndInput, setTrialEndInput] = useState("")
  const [bonusCreditsInput, setBonusCreditsInput] = useState("")
  const [editUsage, setEditUsage] = useState({
    usageAiCreditsUsed: 0,
    usageApiCallsCount: 0,
  })

  const loadWorkspace = async () => {
    setIsLoading(true)
    try {
      const data = await getWorkspaceByClerkOrgId(clerkOrgId)
      if (data) {
        setWorkspace(data)
        const membersData = await getWorkspaceMembers(data.clerkOrgId)
        setMembers(membersData)
      }
    } catch (error) {
      console.error("Failed to load workspace:", error)
      toast.error("Failed to load workspace details")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadWorkspace()
  }, [clerkOrgId])

  const ensureDbRecord = async (): Promise<string | null> => {
    if (workspace?.id) return workspace.id
    // Create DB record if it doesn't exist
    const result = await createDbRecordForClerkOrg(clerkOrgId)
    if (result.success && result.workspaceId) {
      await loadWorkspace()
      return result.workspaceId
    }
    toast.error("Failed to create workspace record")
    return null
  }

  const handleExtendTrial = async (days: number) => {
    startTransition(async () => {
      const workspaceId = await ensureDbRecord()
      if (!workspaceId) return

      const result = await extendTrial(workspaceId, days)
      if (result.success) {
        toast.success(`Trial extended by ${days} days`)
        loadWorkspace()
      } else {
        toast.error(result.error || "Failed to extend trial")
      }
    })
  }

  const handleCancelSubscription = async (immediately: boolean) => {
    startTransition(async () => {
      const workspaceId = await ensureDbRecord()
      if (!workspaceId) return

      const result = await cancelSubscription(workspaceId, immediately)
      if (result.success) {
        toast.success(immediately ? "Subscription canceled" : "Subscription will cancel at period end")
        loadWorkspace()
      } else {
        toast.error(result.error || "Failed to cancel subscription")
      }
    })
  }

  const handleReactivate = async () => {
    startTransition(async () => {
      const workspaceId = await ensureDbRecord()
      if (!workspaceId) return

      const result = await reactivateSubscription(workspaceId)
      if (result.success) {
        toast.success("Subscription reactivated")
        loadWorkspace()
      } else {
        toast.error(result.error || "Failed to reactivate subscription")
      }
    })
  }

  const handleSuspend = async () => {
    startTransition(async () => {
      const workspaceId = await ensureDbRecord()
      if (!workspaceId) return

      const result = await updateWorkspaceStatus(workspaceId, "admin_suspended")
      if (result.success) {
        toast.success("Workspace suspended")
        loadWorkspace()
      } else {
        toast.error(result.error || "Failed to suspend workspace")
      }
    })
  }

  const handleUnsuspend = async () => {
    startTransition(async () => {
      const workspaceId = await ensureDbRecord()
      if (!workspaceId) return

      const result = await updateWorkspaceStatus(workspaceId, "active")
      if (result.success) {
        toast.success("Workspace reactivated")
        loadWorkspace()
      } else {
        toast.error(result.error || "Failed to reactivate workspace")
      }
    })
  }

  const handleStartEditLimits = () => {
    if (!workspace) return
    setEditLimits({
      planName: workspace.planName,
      billingInterval: workspace.billingInterval,
      limitBrands: workspace.limitBrands,
      limitMembers: workspace.limitMembers,
      limitStorageGb: workspace.limitStorageGb,
      limitApiCallsPerMonth: workspace.limitApiCallsPerMonth,
      limitAiCreditsPerMonth: workspace.limitAiCreditsPerMonth,
    })
    setIsEditingLimits(true)
  }

  const handleSaveLimits = async () => {
    startTransition(async () => {
      const workspaceId = await ensureDbRecord()
      if (!workspaceId) return

      const result = await updateWorkspacePlanLimits(workspaceId, editLimits)
      if (result.success) {
        toast.success("Plan limits updated")
        setIsEditingLimits(false)
        loadWorkspace()
      } else {
        toast.error(result.error || "Failed to update limits")
      }
    })
  }

  const handleStartEditTrial = () => {
    if (!workspace) return
    // Format date for input: YYYY-MM-DD
    const currentDate = workspace.trialEndsAt
      ? new Date(workspace.trialEndsAt).toISOString().split('T')[0]
      : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    setTrialEndInput(currentDate)
    setIsEditingTrial(true)
  }

  const handleSaveTrialEnd = async () => {
    if (!trialEndInput) {
      toast.error("Please select a date")
      return
    }
    startTransition(async () => {
      const workspaceId = await ensureDbRecord()
      if (!workspaceId) return

      const trialEndDate = new Date(trialEndInput + 'T23:59:59')
      const result = await setTrialEndDate(workspaceId, trialEndDate)
      if (result.success) {
        toast.success("Trial end date updated")
        setIsEditingTrial(false)
        loadWorkspace()
      } else {
        toast.error(result.error || "Failed to update trial end date")
      }
    })
  }

  const handleAddBonusCredits = async () => {
    const credits = parseInt(bonusCreditsInput)
    if (isNaN(credits) || credits <= 0) {
      toast.error("Please enter a valid number of credits")
      return
    }
    startTransition(async () => {
      const workspaceId = await ensureDbRecord()
      if (!workspaceId) return

      const result = await addBonusCredits(workspaceId, credits)
      if (result.success) {
        toast.success(`Added ${credits.toLocaleString()} bonus credits`)
        setBonusCreditsInput("")
        loadWorkspace()
      } else {
        toast.error(result.error || "Failed to add bonus credits")
      }
    })
  }

  const handleResetUsage = async (type: "credits" | "api" | "all") => {
    startTransition(async () => {
      const workspaceId = await ensureDbRecord()
      if (!workspaceId) return

      const result = await resetUsage(workspaceId, type)
      if (result.success) {
        toast.success(`Usage ${type === "all" ? "counters" : type} reset successfully`)
        loadWorkspace()
      } else {
        toast.error(result.error || "Failed to reset usage")
      }
    })
  }

  const handleStartEditUsage = () => {
    if (!workspace) return
    setEditUsage({
      usageAiCreditsUsed: workspace.usageAiCreditsUsed,
      usageApiCallsCount: workspace.usageApiCallsCount,
    })
    setIsEditingUsage(true)
  }

  const handleSaveUsage = async () => {
    startTransition(async () => {
      const workspaceId = await ensureDbRecord()
      if (!workspaceId) return

      const result = await updateUsage(workspaceId, editUsage)
      if (result.success) {
        toast.success("Usage updated")
        setIsEditingUsage(false)
        loadWorkspace()
      } else {
        toast.error(result.error || "Failed to update usage")
      }
    })
  }

  const handleCreateDbRecord = async () => {
    startTransition(async () => {
      const result = await createDbRecordForClerkOrg(clerkOrgId)
      if (result.success) {
        toast.success("Database record created successfully")
        loadWorkspace()
      } else {
        toast.error(result.error || "Failed to create database record")
      }
    })
  }

  if (isLoading) {
    return (
      <div className="mt-10 flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!workspace) {
    return (
      <div className="mt-10 flex flex-col items-center justify-center py-20">
        <Layers className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Workspace not found</h2>
        <p className="text-muted-foreground mb-4">The workspace you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/control/workspaces">Back to Workspaces</Link>
        </Button>
      </div>
    )
  }

  const hasDbRecord = !!workspace.id
  const hasStripeCustomer = !!workspace.stripeCustomerId
  const hasStripeSubscription = !!workspace.stripeSubscriptionId

  return (
    <div className="mt-10">
      <div className={`flex flex-1 flex-col gap-8 overflow-y-auto p-6 md:p-8 ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/control/workspaces">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-4">
              {workspace.logoUrl ? (
                <img
                  src={workspace.logoUrl}
                  alt={workspace.name}
                  className="h-16 w-16 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950">
                  <Layers className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">{workspace.name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-muted-foreground">{workspace.slug || "no-slug"}</span>
                  <StatusBadge status={workspace.status} />
                  {workspace.cancelAtPeriodEnd && (
                    <span className="text-xs text-amber-600 font-medium">Canceling</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={loadWorkspace}
              disabled={isPending}
            >
              <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://dashboard.clerk.com/apps/app_*/instances/ins_*/organizations/${workspace.clerkOrgId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View in Clerk
              </a>
            </Button>
            {workspace.stripeCustomerId && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`https://dashboard.stripe.com/customers/${workspace.stripeCustomerId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  View in Stripe
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Users className="h-4 w-4" />
              Members
            </div>
            <p className="text-2xl font-semibold">{workspace.membersCount}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Package className="h-4 w-4" />
              Brands
            </div>
            <p className="text-2xl font-semibold">{workspace.usageBrandsCount}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Zap className="h-4 w-4" />
              API Calls
            </div>
            <p className="text-2xl font-semibold">{workspace.usageApiCallsCount.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Activity className="h-4 w-4" />
              AI Credits
            </div>
            <p className="text-2xl font-semibold">{workspace.usageAiCreditsUsed.toLocaleString()}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Subscription & Billing */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subscription Info */}
            <InfoCard title="Subscription" icon={CreditCard}>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Sync Status</span>
                  <SyncIndicator
                    hasDbRecord={hasDbRecord}
                    hasStripeCustomer={hasStripeCustomer}
                    hasStripeSubscription={hasStripeSubscription}
                  />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium capitalize">{workspace.planName || "None"}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Billing Interval</span>
                  <span className="capitalize">{workspace.billingInterval || "-"}</span>
                </div>
                {workspace.priceAmount && (
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-medium">
                      ${parseFloat(workspace.priceAmount).toFixed(2)}/{workspace.billingInterval === "year" ? "yr" : "mo"}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Billing Email</span>
                  <span>{workspace.billingEmail || "-"}</span>
                </div>
                {workspace.status === "trialing" && workspace.trialEndsAt && (
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Trial Ends</span>
                    <span className="text-blue-600 font-medium">
                      {new Date(workspace.trialEndsAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
                {workspace.subscriptionPeriodEndsAt && workspace.status !== "trialing" && (
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Period Ends</span>
                    <span>
                      {new Date(workspace.subscriptionPeriodEndsAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}

                {/* Subscription Actions - Cancel/Reactivate */}
                {hasStripeSubscription && (
                  <div className="pt-4 space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">Subscription Actions</p>
                    <div className="flex flex-wrap gap-2">
                      {workspace.cancelAtPeriodEnd ? (
                        <Button variant="outline" size="sm" className="text-emerald-600" onClick={handleReactivate}>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Reactivate Subscription
                        </Button>
                      ) : (
                        <>
                          <Button variant="outline" size="sm" className="text-amber-600" onClick={() => handleCancelSubscription(false)}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel at Period End
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleCancelSubscription(true)}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Immediately
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </InfoCard>

            {/* Plan & Limits */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium">Plan & Limits</h3>
                </div>
                {!isEditingLimits && (
                  <Button variant="outline" size="sm" onClick={handleStartEditLimits}>
                    Edit Limits
                  </Button>
                )}
              </div>

              {isEditingLimits ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Plan Name</label>
                      <input
                        type="text"
                        value={editLimits.planName || ""}
                        onChange={(e) => setEditLimits(prev => ({ ...prev, planName: e.target.value || null }))}
                        placeholder="e.g. Growth, Pro, Enterprise"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Billing Interval</label>
                      <select
                        value={editLimits.billingInterval || ""}
                        onChange={(e) => setEditLimits(prev => ({ ...prev, billingInterval: e.target.value || null }))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Not set</option>
                        <option value="month">Monthly</option>
                        <option value="year">Yearly</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Max Brands</label>
                      <input
                        type="number"
                        value={editLimits.limitBrands ?? ""}
                        onChange={(e) => setEditLimits(prev => ({ ...prev, limitBrands: e.target.value ? parseInt(e.target.value) : null }))}
                        placeholder="Unlimited"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Max Members</label>
                      <input
                        type="number"
                        value={editLimits.limitMembers ?? ""}
                        onChange={(e) => setEditLimits(prev => ({ ...prev, limitMembers: e.target.value ? parseInt(e.target.value) : null }))}
                        placeholder="Unlimited"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">API Calls / Month</label>
                      <input
                        type="number"
                        value={editLimits.limitApiCallsPerMonth ?? ""}
                        onChange={(e) => setEditLimits(prev => ({ ...prev, limitApiCallsPerMonth: e.target.value ? parseInt(e.target.value) : null }))}
                        placeholder="Unlimited"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">AI Credits / Month</label>
                      <input
                        type="number"
                        value={editLimits.limitAiCreditsPerMonth ?? ""}
                        onChange={(e) => setEditLimits(prev => ({ ...prev, limitAiCreditsPerMonth: e.target.value ? parseInt(e.target.value) : null }))}
                        placeholder="Unlimited"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Storage (GB)</label>
                      <input
                        type="number"
                        value={editLimits.limitStorageGb ?? ""}
                        onChange={(e) => setEditLimits(prev => ({ ...prev, limitStorageGb: e.target.value ? parseInt(e.target.value) : null }))}
                        placeholder="Unlimited"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditingLimits(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveLimits} disabled={isPending}>
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Limits"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Plan Info */}
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="font-medium capitalize">{workspace.planName || "Not set"}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Billing</span>
                    <span className="capitalize">{workspace.billingInterval || "Not set"}</span>
                  </div>
                  {/* Usage vs Limits */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Brands</p>
                      <p className="text-lg font-semibold">
                        {workspace.usageBrandsCount}
                        <span className="text-muted-foreground font-normal"> / {workspace.limitBrands ?? "∞"}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Members</p>
                      <p className="text-lg font-semibold">
                        {workspace.usageMembersCount}
                        <span className="text-muted-foreground font-normal"> / {workspace.limitMembers ?? "∞"}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">API Calls</p>
                      <p className="text-lg font-semibold">
                        {workspace.usageApiCallsCount.toLocaleString()}
                        <span className="text-muted-foreground font-normal"> / {workspace.limitApiCallsPerMonth?.toLocaleString() ?? "∞"}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">AI Credits</p>
                      <p className="text-lg font-semibold">
                        {workspace.usageAiCreditsUsed.toLocaleString()}
                        <span className="text-muted-foreground font-normal"> / {workspace.limitAiCreditsPerMonth?.toLocaleString() ?? "∞"}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Trial Management */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-medium">Trial Management</h3>
                </div>
              </div>

              {isEditingTrial ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Trial End Date</label>
                    <input
                      type="date"
                      value={trialEndInput}
                      onChange={(e) => setTrialEndInput(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditingTrial(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveTrialEnd} disabled={isPending}>
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Set Trial End"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Current Status</span>
                    <StatusBadge status={workspace.status} />
                  </div>
                  {workspace.trialEndsAt && (
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Trial Ends</span>
                      <span className="text-blue-600 font-medium">
                        {new Date(workspace.trialEndsAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">Quick Actions</p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleExtendTrial(7)}>
                        +7 Days
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleExtendTrial(14)}>
                        +14 Days
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleExtendTrial(30)}>
                        +30 Days
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleStartEditTrial}>
                        Set Custom Date
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Credits & Usage Management */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950">
                    <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-medium">Credits & Usage</h3>
                </div>
                {!isEditingUsage && (
                  <Button variant="outline" size="sm" onClick={handleStartEditUsage}>
                    Edit Usage
                  </Button>
                )}
              </div>

              {isEditingUsage ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">AI Credits Used</label>
                      <input
                        type="number"
                        value={editUsage.usageAiCreditsUsed}
                        onChange={(e) => setEditUsage(prev => ({ ...prev, usageAiCreditsUsed: parseInt(e.target.value) || 0 }))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">API Calls Used</label>
                      <input
                        type="number"
                        value={editUsage.usageApiCallsCount}
                        onChange={(e) => setEditUsage(prev => ({ ...prev, usageApiCallsCount: parseInt(e.target.value) || 0 }))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditingUsage(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveUsage} disabled={isPending}>
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Usage"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Current Usage */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">AI Credits</p>
                      <p className="text-xl font-semibold">
                        {workspace.usageAiCreditsUsed.toLocaleString()}
                        <span className="text-muted-foreground font-normal text-sm"> / {workspace.limitAiCreditsPerMonth?.toLocaleString() ?? "∞"}</span>
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">API Calls</p>
                      <p className="text-xl font-semibold">
                        {workspace.usageApiCallsCount.toLocaleString()}
                        <span className="text-muted-foreground font-normal text-sm"> / {workspace.limitApiCallsPerMonth?.toLocaleString() ?? "∞"}</span>
                      </p>
                    </div>
                  </div>

                  {/* Add Bonus Credits */}
                  <div className="pt-2 border-t border-border">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Add Bonus Credits</p>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={bonusCreditsInput}
                        onChange={(e) => setBonusCreditsInput(e.target.value)}
                        placeholder="Enter amount"
                        className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <Button size="sm" onClick={handleAddBonusCredits} disabled={isPending || !bonusCreditsInput}>
                        Add Credits
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      This increases the monthly credit limit by the specified amount
                    </p>
                  </div>

                  {/* Quick Actions */}
                  <div className="pt-2 border-t border-border">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Quick Add</p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setBonusCreditsInput("100"); }}>
                        +100
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => { setBonusCreditsInput("500"); }}>
                        +500
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => { setBonusCreditsInput("1000"); }}>
                        +1,000
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => { setBonusCreditsInput("5000"); }}>
                        +5,000
                      </Button>
                    </div>
                  </div>

                  {/* Reset Usage */}
                  <div className="pt-2 border-t border-border">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Reset Usage</p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="text-amber-600" onClick={() => handleResetUsage("credits")}>
                        Reset Credits
                      </Button>
                      <Button variant="outline" size="sm" className="text-amber-600" onClick={() => handleResetUsage("api")}>
                        Reset API Calls
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleResetUsage("all")}>
                        Reset All Usage
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Members */}
            <InfoCard title={`Members (${members.length})`} icon={Users}>
              {members.length === 0 ? (
                <p className="text-muted-foreground text-sm">No members in this workspace.</p>
              ) : (
                <div className="space-y-3">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between py-2 hover:bg-muted/30 rounded-lg px-2 -mx-2 cursor-pointer transition-colors"
                      onClick={() => router.push(`/control/users/${member.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        {member.imageUrl ? (
                          <img
                            src={member.imageUrl}
                            alt={member.fullName}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            <Users className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm">{member.fullName}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-medium capitalize bg-muted px-2 py-1 rounded-full">
                          {member.role.replace("org:", "")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </InfoCard>
          </div>

          {/* Right Column - Info & Actions */}
          <div className="space-y-6">
            {/* Workspace Info */}
            <InfoCard title="Details" icon={Building2}>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Workspace ID</p>
                  <p className="font-mono text-xs mt-0.5 break-all">{workspace.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Clerk Org ID</p>
                  <p className="font-mono text-xs mt-0.5 break-all">{workspace.clerkOrgId}</p>
                </div>
                {workspace.stripeCustomerId && (
                  <div>
                    <p className="text-muted-foreground">Stripe Customer ID</p>
                    <p className="font-mono text-xs mt-0.5 break-all">{workspace.stripeCustomerId}</p>
                  </div>
                )}
                {workspace.stripeSubscriptionId && (
                  <div>
                    <p className="text-muted-foreground">Stripe Subscription ID</p>
                    <p className="font-mono text-xs mt-0.5 break-all">{workspace.stripeSubscriptionId}</p>
                  </div>
                )}
              </div>
            </InfoCard>

            {/* Timestamps */}
            <InfoCard title="Timestamps" icon={Calendar}>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created (Clerk)</span>
                  <span>{workspace.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created (DB)</span>
                  <span>{workspace.dbCreatedAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated (DB)</span>
                  <span>{workspace.dbUpdatedAt.toLocaleDateString()}</span>
                </div>
                {workspace.lastActivityAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Activity</span>
                    <span>{workspace.lastActivityAt.toLocaleDateString()}</span>
                  </div>
                )}
                {workspace.canceledAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Canceled At</span>
                    <span className="text-red-600">{workspace.canceledAt.toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </InfoCard>

            {/* Admin Actions */}
            <InfoCard title="Admin Actions" icon={Shield}>
              <div className="space-y-3">
                {workspace.status === "admin_suspended" ? (
                  <Button
                    variant="outline"
                    className="w-full text-emerald-600"
                    onClick={handleUnsuspend}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Unsuspend Workspace
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full text-red-600"
                    onClick={handleSuspend}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Suspend Workspace
                  </Button>
                )}
              </div>
            </InfoCard>
          </div>
        </div>
      </div>
    </div>
  )
}
