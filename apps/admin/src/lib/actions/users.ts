"use server"

import { clerkClient } from "@clerk/nextjs/server"

export type UserWithOrgs = {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  fullName: string
  imageUrl: string
  createdAt: Date
  lastSignInAt: Date | null
  emailVerified: boolean
  organizations: {
    id: string
    name: string
    slug: string | null
    role: string
  }[]
}

export async function getUsers(): Promise<UserWithOrgs[]> {
  const clerk = await clerkClient()
  
  // Get all users from Clerk
  const clerkUsers = await clerk.users.getUserList({
    limit: 100,
    orderBy: "-created_at",
  })

  // Get organization memberships for each user
  const result: UserWithOrgs[] = await Promise.all(
    clerkUsers.data.map(async (user) => {
      // Get user's organization memberships
      const memberships = await clerk.users.getOrganizationMembershipList({
        userId: user.id,
      })

      const organizations = memberships.data.map((m) => ({
        id: m.organization.id,
        name: m.organization.name,
        slug: m.organization.slug,
        role: m.role,
      }))

      const primaryEmail = user.emailAddresses.find(
        (e) => e.id === user.primaryEmailAddressId
      )

      return {
        id: user.id,
        email: primaryEmail?.emailAddress ?? "",
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown",
        imageUrl: user.imageUrl,
        createdAt: new Date(user.createdAt),
        lastSignInAt: user.lastSignInAt ? new Date(user.lastSignInAt) : null,
        emailVerified: primaryEmail?.verification?.status === "verified",
        organizations,
      }
    })
  )

  return result
}

export async function getUserById(userId: string): Promise<UserWithOrgs | null> {
  const clerk = await clerkClient()
  
  try {
    const user = await clerk.users.getUser(userId)
    
    const memberships = await clerk.users.getOrganizationMembershipList({
      userId: user.id,
    })

    const organizations = memberships.data.map((m) => ({
      id: m.organization.id,
      name: m.organization.name,
      slug: m.organization.slug,
      role: m.role,
    }))

    const primaryEmail = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId
    )

    return {
      id: user.id,
      email: primaryEmail?.emailAddress ?? "",
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown",
      imageUrl: user.imageUrl,
      createdAt: new Date(user.createdAt),
      lastSignInAt: user.lastSignInAt ? new Date(user.lastSignInAt) : null,
      emailVerified: primaryEmail?.verification?.status === "verified",
      organizations,
    }
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export async function deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const clerk = await clerkClient()
    await clerk.users.deleteUser(userId)
    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function banUser(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const clerk = await clerkClient()
    await clerk.users.banUser(userId)
    return { success: true }
  } catch (error) {
    console.error("Error banning user:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function unbanUser(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const clerk = await clerkClient()
    await clerk.users.unbanUser(userId)
    return { success: true }
  } catch (error) {
    console.error("Error unbanning user:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
