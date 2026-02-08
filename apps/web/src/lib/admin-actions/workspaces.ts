"use server"

import { clerkClient, auth } from "@clerk/nextjs/server"
import { db, workspaces, eq } from "@workspace/db"
import { getStripe } from "@workspace/billing/server"

export type ClerkOrganization = {
  id: string
  name: string
  slug: string | null
  imageUrl: string | null
  membersCount: number
  createdAt: Date
}

export type WorkspaceWithClerk = {
  id: string
  clerkOrgId: string
  name: string
  slug: string | null
  logoUrl: string | null
  membersCount: number
  createdAt: Date
  status: string
  planId: string | null
  planName: string | null
  billingInterval: string | null
  billingEmail: string | null
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  stripePriceId: string | null
  trialStartsAt: Date | null
  trialEndsAt: Date | null
  subscriptionPeriodStartsAt: Date | null
  subscriptionPeriodEndsAt: Date | null
  cancelAtPeriodEnd: boolean
  canceledAt: Date | null
  cancelReason: string | null
  priceAmount: string | null
  currency: string | null
  // Limits
  limitBrands: number | null
  limitMembers: number | null
  limitStorageGb: number | null
  limitApiCallsPerMonth: number | null
  limitAiCreditsPerMonth: number | null
  // Usage
  usageBrandsCount: number
  usageMembersCount: number
  usageStorageBytes: number
  usageApiCallsCount: number
  usageAiCreditsUsed: number
  // Timestamps
  lastActivityAt: Date | null
  dbCreatedAt: Date
  dbUpdatedAt: Date
}

export type WorkspaceMember = {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  fullName: string
  imageUrl: string
  role: string
  joinedAt: Date
}

/**
 * Get all Clerk organizations with member counts
 */
export async function getClerkOrganizations(): Promise<ClerkOrganization[]> {
  const clerk = await clerkClient()
  
  // Get all organizations from Clerk
  const clerkOrgs = await clerk.organizations.getOrganizationList({
    limit: 100,
  })

  // Get member counts for each org
  const result: ClerkOrganization[] = await Promise.all(
    clerkOrgs.data.map(async (org) => {
      const members = await clerk.organizations.getOrganizationMembershipList({
        organizationId: org.id,
        limit: 1,
      })
      
      return {
        id: org.id,
        name: org.name,
        slug: org.slug,
        imageUrl: org.imageUrl,
        membersCount: members.totalCount,
        createdAt: new Date(org.createdAt),
      }
    })
  )

  return result
}

export async function getWorkspaceById(workspaceId: string): Promise<WorkspaceWithClerk | null> {
  const clerk = await clerkClient()
  
  // Get workspace from DB
  const [dbWorkspace] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId))
  
  if (!dbWorkspace) {
    return null
  }

  // Get Clerk org
  const org = await clerk.organizations.getOrganization({
    organizationId: dbWorkspace.clerkOrgId,
  })

  // Get member count
  const members = await clerk.organizations.getOrganizationMembershipList({
    organizationId: org.id,
    limit: 1,
  })

  return {
    id: dbWorkspace.id,
    clerkOrgId: org.id,
    name: org.name,
    slug: org.slug,
    logoUrl: org.imageUrl,
    membersCount: members.totalCount,
    createdAt: new Date(org.createdAt),
    status: dbWorkspace.status,
    planId: dbWorkspace.planId,
    planName: dbWorkspace.planName,
    billingInterval: dbWorkspace.billingInterval,
    billingEmail: dbWorkspace.billingEmail,
    stripeCustomerId: dbWorkspace.stripeCustomerId,
    stripeSubscriptionId: dbWorkspace.stripeSubscriptionId,
    stripePriceId: dbWorkspace.stripePriceId,
    trialStartsAt: dbWorkspace.trialStartsAt,
    trialEndsAt: dbWorkspace.trialEndsAt,
    subscriptionPeriodStartsAt: dbWorkspace.subscriptionPeriodStartsAt,
    subscriptionPeriodEndsAt: dbWorkspace.subscriptionPeriodEndsAt,
    cancelAtPeriodEnd: dbWorkspace.cancelAtPeriodEnd,
    canceledAt: dbWorkspace.canceledAt,
    cancelReason: dbWorkspace.cancelReason,
    priceAmount: dbWorkspace.priceAmount,
    currency: dbWorkspace.currency,
    // Limits
    limitBrands: dbWorkspace.limitBrands,
    limitMembers: dbWorkspace.limitMembers,
    limitStorageGb: dbWorkspace.limitStorageGb,
    limitApiCallsPerMonth: dbWorkspace.limitApiCallsPerMonth,
    limitAiCreditsPerMonth: dbWorkspace.limitAiCreditsPerMonth,
    // Usage
    usageBrandsCount: dbWorkspace.usageBrandsCount,
    usageMembersCount: dbWorkspace.usageMembersCount,
    usageStorageBytes: dbWorkspace.usageStorageBytes,
    usageApiCallsCount: dbWorkspace.usageApiCallsCount,
    usageAiCreditsUsed: dbWorkspace.usageAiCreditsUsed,
    // Timestamps
    lastActivityAt: dbWorkspace.lastActivityAt,
    dbCreatedAt: dbWorkspace.createdAt,
    dbUpdatedAt: dbWorkspace.updatedAt,
  }
}

/**
 * Get workspace by Clerk organization ID
 * Returns workspace data even if no DB record exists (Clerk-only)
 */
export async function getWorkspaceByClerkOrgId(clerkOrgId: string): Promise<WorkspaceWithClerk | null> {
  const clerk = await clerkClient()
  
  try {
    // Get Clerk org
    const org = await clerk.organizations.getOrganization({
      organizationId: clerkOrgId,
    })

    // Get member count
    const members = await clerk.organizations.getOrganizationMembershipList({
      organizationId: org.id,
      limit: 1,
    })

    // Try to get workspace from DB (may not exist)
    const [dbWorkspace] = await db.select().from(workspaces).where(eq(workspaces.clerkOrgId, clerkOrgId))

    // Return combined data (handle case where no DB record exists)
    return {
      id: dbWorkspace?.id ?? "",
      clerkOrgId: org.id,
      name: org.name,
      slug: org.slug,
      logoUrl: org.imageUrl,
      membersCount: members.totalCount,
      createdAt: new Date(org.createdAt),
      status: dbWorkspace?.status ?? "no_db_record",
      planId: dbWorkspace?.planId ?? null,
      planName: dbWorkspace?.planName ?? null,
      billingInterval: dbWorkspace?.billingInterval ?? null,
      billingEmail: dbWorkspace?.billingEmail ?? null,
      stripeCustomerId: dbWorkspace?.stripeCustomerId ?? null,
      stripeSubscriptionId: dbWorkspace?.stripeSubscriptionId ?? null,
      stripePriceId: dbWorkspace?.stripePriceId ?? null,
      trialStartsAt: dbWorkspace?.trialStartsAt ?? null,
      trialEndsAt: dbWorkspace?.trialEndsAt ?? null,
      subscriptionPeriodStartsAt: dbWorkspace?.subscriptionPeriodStartsAt ?? null,
      subscriptionPeriodEndsAt: dbWorkspace?.subscriptionPeriodEndsAt ?? null,
      cancelAtPeriodEnd: dbWorkspace?.cancelAtPeriodEnd ?? false,
      canceledAt: dbWorkspace?.canceledAt ?? null,
      cancelReason: dbWorkspace?.cancelReason ?? null,
      priceAmount: dbWorkspace?.priceAmount ?? null,
      currency: dbWorkspace?.currency ?? null,
      // Limits
      limitBrands: dbWorkspace?.limitBrands ?? null,
      limitMembers: dbWorkspace?.limitMembers ?? null,
      limitStorageGb: dbWorkspace?.limitStorageGb ?? null,
      limitApiCallsPerMonth: dbWorkspace?.limitApiCallsPerMonth ?? null,
      limitAiCreditsPerMonth: dbWorkspace?.limitAiCreditsPerMonth ?? null,
      // Usage
      usageBrandsCount: dbWorkspace?.usageBrandsCount ?? 0,
      usageMembersCount: dbWorkspace?.usageMembersCount ?? 0,
      usageStorageBytes: dbWorkspace?.usageStorageBytes ?? 0,
      usageApiCallsCount: dbWorkspace?.usageApiCallsCount ?? 0,
      usageAiCreditsUsed: dbWorkspace?.usageAiCreditsUsed ?? 0,
      // Timestamps
      lastActivityAt: dbWorkspace?.lastActivityAt ?? null,
      dbCreatedAt: dbWorkspace?.createdAt ?? new Date(),
      dbUpdatedAt: dbWorkspace?.updatedAt ?? new Date(),
    }
  } catch (error) {
    console.error("Error fetching workspace by Clerk org ID:", error)
    return null
  }
}

export async function getWorkspaceMembers(clerkOrgId: string): Promise<WorkspaceMember[]> {
  const clerk = await clerkClient()
  
  const memberships = await clerk.organizations.getOrganizationMembershipList({
    organizationId: clerkOrgId,
    limit: 100,
  })

  const members: WorkspaceMember[] = memberships.data.map((membership) => {
    const user = membership.publicUserData
    return {
      id: user?.userId ?? "",
      email: user?.identifier ?? "",
      firstName: user?.firstName ?? null,
      lastName: user?.lastName ?? null,
      fullName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Unknown",
      imageUrl: user?.imageUrl ?? "",
      role: membership.role,
      joinedAt: new Date(membership.createdAt),
    }
  })

  return members
}

export async function extendTrial(workspaceId: string, additionalDays: number): Promise<{ success: boolean; error?: string; newTrialEnd?: Date }> {
  try {
    // Get workspace
    const [workspace] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId))
    
    if (!workspace) {
      return { success: false, error: "Workspace not found" }
    }

    if (!workspace.stripeSubscriptionId) {
      return { success: false, error: "No active subscription found" }
    }

    const stripe = getStripe()
    
    // Get current subscription
    const subscription = await stripe.subscriptions.retrieve(workspace.stripeSubscriptionId)
    
    // Calculate new trial end
    let newTrialEnd: number
    
    if (subscription.trial_end && subscription.trial_end > Math.floor(Date.now() / 1000)) {
      // Extend existing trial
      newTrialEnd = subscription.trial_end + (additionalDays * 24 * 60 * 60)
    } else {
      // Start new trial from now
      newTrialEnd = Math.floor(Date.now() / 1000) + (additionalDays * 24 * 60 * 60)
    }

    // Update subscription in Stripe
    await stripe.subscriptions.update(workspace.stripeSubscriptionId, {
      trial_end: newTrialEnd,
    })

    // Update workspace in DB
    const newTrialEndDate = new Date(newTrialEnd * 1000)
    await db.update(workspaces)
      .set({ 
        trialEndsAt: newTrialEndDate,
        status: "trialing",
        updatedAt: new Date(),
      })
      .where(eq(workspaces.id, workspaceId))

    return { success: true, newTrialEnd: newTrialEndDate }
  } catch (error) {
    console.error("Error extending trial:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function cancelSubscription(workspaceId: string, immediately: boolean = false): Promise<{ success: boolean; error?: string }> {
  try {
    const [workspace] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId))
    
    if (!workspace) {
      return { success: false, error: "Workspace not found" }
    }

    if (!workspace.stripeSubscriptionId) {
      return { success: false, error: "No active subscription found" }
    }

    const stripe = getStripe()

    if (immediately) {
      // Cancel immediately
      await stripe.subscriptions.cancel(workspace.stripeSubscriptionId)
      
      await db.update(workspaces)
        .set({ 
          status: "canceled",
          canceledAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(workspaces.id, workspaceId))
    } else {
      // Cancel at period end
      await stripe.subscriptions.update(workspace.stripeSubscriptionId, {
        cancel_at_period_end: true,
      })
      
      await db.update(workspaces)
        .set({ 
          cancelAtPeriodEnd: true,
          updatedAt: new Date(),
        })
        .where(eq(workspaces.id, workspaceId))
    }

    return { success: true }
  } catch (error) {
    console.error("Error canceling subscription:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function reactivateSubscription(workspaceId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const [workspace] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId))
    
    if (!workspace) {
      return { success: false, error: "Workspace not found" }
    }

    if (!workspace.stripeSubscriptionId) {
      return { success: false, error: "No subscription found" }
    }

    const stripe = getStripe()

    // Remove cancel_at_period_end
    await stripe.subscriptions.update(workspace.stripeSubscriptionId, {
      cancel_at_period_end: false,
    })
    
    await db.update(workspaces)
      .set({ 
        cancelAtPeriodEnd: false,
        updatedAt: new Date(),
      })
      .where(eq(workspaces.id, workspaceId))

    return { success: true }
  } catch (error) {
    console.error("Error reactivating subscription:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function updateWorkspaceStatus(workspaceId: string, status: string): Promise<{ success: boolean; error?: string }> {
  try {
    await db.update(workspaces)
      .set({ 
        status: status as "active" | "trialing" | "past_due" | "canceled" | "unpaid" | "incomplete" | "incomplete_expired" | "paused" | "admin_suspended" | "deleted",
        updatedAt: new Date(),
      })
      .where(eq(workspaces.id, workspaceId))

    return { success: true }
  } catch (error) {
    console.error("Error updating workspace status:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export type PlanLimitsUpdate = {
  planName?: string | null
  billingInterval?: string | null
  limitBrands?: number | null
  limitMembers?: number | null
  limitStorageGb?: number | null
  limitApiCallsPerMonth?: number | null
  limitAiCreditsPerMonth?: number | null
}

export async function updateWorkspacePlanLimits(
  workspaceId: string, 
  limits: PlanLimitsUpdate
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.update(workspaces)
      .set({ 
        ...limits,
        updatedAt: new Date(),
      })
      .where(eq(workspaces.id, workspaceId))

    return { success: true }
  } catch (error) {
    console.error("Error updating workspace plan limits:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function setTrialEndDate(
  workspaceId: string, 
  trialEndsAt: Date
): Promise<{ success: boolean; error?: string }> {
  try {
    const [workspace] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId))
    
    if (!workspace) {
      return { success: false, error: "Workspace not found" }
    }

    // Update Stripe if subscription exists
    if (workspace.stripeSubscriptionId) {
      const stripe = getStripe()
      const trialEndTimestamp = Math.floor(trialEndsAt.getTime() / 1000)
      
      await stripe.subscriptions.update(workspace.stripeSubscriptionId, {
        trial_end: trialEndTimestamp,
      })
    }

    // Update DB
    await db.update(workspaces)
      .set({ 
        trialEndsAt,
        status: "trialing",
        updatedAt: new Date(),
      })
      .where(eq(workspaces.id, workspaceId))

    return { success: true }
  } catch (error) {
    console.error("Error setting trial end date:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export type UsageUpdate = {
  usageAiCreditsUsed?: number
  usageApiCallsCount?: number
  usageStorageBytes?: number
}

export async function addBonusCredits(
  workspaceId: string, 
  bonusCredits: number
): Promise<{ success: boolean; error?: string; newTotal?: number }> {
  try {
    const [workspace] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId))
    
    if (!workspace) {
      return { success: false, error: "Workspace not found" }
    }

    // Increase the limit by bonus amount (effectively giving them more credits)
    const currentLimit = workspace.limitAiCreditsPerMonth ?? 0
    const newLimit = currentLimit + bonusCredits

    await db.update(workspaces)
      .set({ 
        limitAiCreditsPerMonth: newLimit,
        updatedAt: new Date(),
      })
      .where(eq(workspaces.id, workspaceId))

    return { success: true, newTotal: newLimit }
  } catch (error) {
    console.error("Error adding bonus credits:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function resetUsage(
  workspaceId: string,
  resetType: "credits" | "api" | "storage" | "all"
): Promise<{ success: boolean; error?: string }> {
  try {
    const updates: UsageUpdate = {}
    
    if (resetType === "credits" || resetType === "all") {
      updates.usageAiCreditsUsed = 0
    }
    if (resetType === "api" || resetType === "all") {
      updates.usageApiCallsCount = 0
    }
    if (resetType === "storage" || resetType === "all") {
      updates.usageStorageBytes = 0
    }

    await db.update(workspaces)
      .set({ 
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(workspaces.id, workspaceId))

    return { success: true }
  } catch (error) {
    console.error("Error resetting usage:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function updateUsage(
  workspaceId: string, 
  usage: UsageUpdate
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.update(workspaces)
      .set({ 
        ...usage,
        updatedAt: new Date(),
      })
      .where(eq(workspaces.id, workspaceId))

    return { success: true }
  } catch (error) {
    console.error("Error updating usage:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function getStripeSubscriptionDetails(subscriptionId: string) {
  try {
    const stripe = getStripe()
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['default_payment_method', 'customer'],
    })
    return subscription
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return null
  }
}

export async function getStripeCustomerPortalUrl(customerId: string, returnUrl: string): Promise<string | null> {
  try {
    const stripe = getStripe()
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })
    return session.url
  } catch (error) {
    console.error("Error creating portal session:", error)
    return null
  }
}

export async function createDbRecordForClerkOrg(clerkOrgId: string): Promise<{ success: boolean; error?: string; workspaceId?: string }> {
  try {
    const clerk = await clerkClient()
    
    // Get the Clerk organization
    const org = await clerk.organizations.getOrganization({
      organizationId: clerkOrgId,
    })

    // Check if DB record already exists
    const [existing] = await db.select().from(workspaces).where(eq(workspaces.clerkOrgId, clerkOrgId))
    
    if (existing) {
      return { success: true, workspaceId: existing.id }
    }

    // Create workspace in database
    const [newWorkspace] = await db.insert(workspaces).values({
      clerkOrgId: org.id,
      status: "trialing",
      planId: "free",
      planName: "Free",
      limitBrands: 1,
      limitMembers: 2,
      limitAiCreditsPerMonth: 100,
      limitApiCallsPerMonth: 1000,
      limitStorageGb: 1,
    }).returning()

    return { 
      success: true, 
      workspaceId: newWorkspace.id,
    }
  } catch (error) {
    console.error("Error creating DB record for Clerk org:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function createWorkspace(data: {
  name: string
  slug: string
  plan: string
  inviteEmails?: string[]
  memberRoles?: Record<string, "org:admin" | "org:member">
  stripeCustomerId?: string
  stripeSubscriptionId?: string
}): Promise<{ success: boolean; error?: string; workspaceId?: string; clerkOrgId?: string }> {
  try {
    const clerk = await clerkClient()
    const { userId } = await auth()
    
    if (!userId) {
      return { success: false, error: "User not authenticated" }
    }
    
    // Create organization in Clerk with the authenticated user as creator
    const org = await clerk.organizations.createOrganization({
      name: data.name,
      slug: data.slug,
      createdBy: userId, // Set the authenticated admin as the creator/owner
    })

    // Create workspace in database
    const [newWorkspace] = await db.insert(workspaces).values({
      clerkOrgId: org.id,
      status: "active",
      planId: data.plan,
      planName: data.plan,
    }).returning()

    const stripe = getStripe()
    let customerId = data.stripeCustomerId

    // Create or use existing Stripe customer
    if (customerId) {
      // Verify the customer exists in Stripe
      try {
        await stripe.customers.retrieve(customerId)
      } catch (error) {
        console.error("Invalid Stripe Customer ID provided:", error)
        customerId = undefined // Will create new customer below
      }
    }
    
    if (!customerId) {
      // Create new Stripe customer - use workspace name as placeholder
      const customer = await stripe.customers.create({
        name: data.name,
        email: undefined, // No email for now, can be updated later
        metadata: {
          workspaceId: newWorkspace.id,
          clerkOrgId: org.id,
          organizationName: data.name,
        },
      })
      customerId = customer.id
    }

    // Update workspace with Stripe customer ID and subscription ID if provided
    await db.update(workspaces)
      .set({ 
        stripeCustomerId: customerId,
        stripeSubscriptionId: data.stripeSubscriptionId || null,
        billingEmail: null, // No owner email anymore
        updatedAt: new Date(),
      })
      .where(eq(workspaces.id, newWorkspace.id))

    // If subscription ID is provided, sync subscription details from Stripe
    if (data.stripeSubscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(data.stripeSubscriptionId)
        
        // Update workspace with subscription details
        await db.update(workspaces)
          .set({
            status: subscription.status as any,
            stripePriceId: subscription.items.data[0]?.price.id || null,
            subscriptionPeriodStartsAt: new Date(subscription.current_period_start * 1000),
            subscriptionPeriodEndsAt: new Date(subscription.current_period_end * 1000),
            trialStartsAt: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
            trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            updatedAt: new Date(),
          })
          .where(eq(workspaces.id, newWorkspace.id))
      } catch (error) {
        console.error("Failed to sync subscription from Stripe:", error)
        // Don't fail the whole operation if subscription sync fails
      }
    }

    // Invite team members with their roles
    if (data.inviteEmails && data.inviteEmails.length > 0) {
      for (const email of data.inviteEmails) {
        try {
          const role = data.memberRoles?.[email] || "org:member"
          await clerk.organizations.createOrganizationInvitation({
            organizationId: org.id,
            emailAddress: email,
            role: role,
            inviterUserId: userId, // Set the authenticated admin as inviter
          })
        } catch (inviteError) {
          console.error(`Failed to send invitation to ${email}:`, inviteError)
          // Continue with other invitations even if one fails
        }
      }
    }

    return { 
      success: true, 
      workspaceId: newWorkspace.id,
      clerkOrgId: org.id,
    }
  } catch (error) {
    console.error("Error creating workspace:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
