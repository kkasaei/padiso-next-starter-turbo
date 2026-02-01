import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';

/**
 * Get authenticated user context
 * Note: Assumes middleware has already protected the route
 */
export async function getAuthContext() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized - middleware not configured correctly');
  }

  const user = await currentUser();
  if (!user) {
    throw new Error('User not found');
  }

  return {
    session: {
      user: {
        id: userId,
        clerkId: userId,
        email: user.emailAddresses[0]?.emailAddress ?? '',
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        image: user.imageUrl,
      }
    }
  };
}

/**
 * Get authenticated user + organization context
 * Returns null if user hasn't selected/created an organization yet
 * Note: Assumes middleware has already protected the route
 */
export async function getAuthOrganizationContext() {
  const { userId, orgId, orgRole } = await auth();

  if (!userId) {
    throw new Error('Unauthorized - middleware not configured correctly');
  }

  // User is authenticated but hasn't selected an org yet
  // This is a VALID state during onboarding - return null
  if (!orgId) {
    return null;
  }

  // Fetch Clerk user and org
  const clerk = await clerkClient();
  const [user, org] = await Promise.all([
    currentUser(),
    clerk.organizations.getOrganization({ organizationId: orgId }),
  ]);

  if (!user || !org) {
    throw new Error('User or organization not found');
  }

  // Mock organization data (replaces Prisma DB lookup)
  const mockDbOrganization = {
    id: `mock-db-${orgId}`,
    hasCompletedWelcomeScreen: true,
    hasCompletedOnboarding: true,
    config: null as Record<string, unknown> | null,
  };

  return {
    session: {
      user: {
        id: userId,
        clerkId: userId,
        email: user.emailAddresses[0]?.emailAddress ?? '',
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        image: user.imageUrl,
        orgRole: orgRole || null
      }
    },
    organization: {
      // Clerk organization identity (used across the app)
      id: org.id,
      clerkId: org.id,
      // Database organization identity for mutations
      dbId: mockDbOrganization.id,
      name: org.name,
      slug: org.slug,
      logo: org.imageUrl || undefined,
      createdAt: new Date(org.createdAt),
      // Onboarding flags
      hasCompletedWelcomeScreen: mockDbOrganization.hasCompletedWelcomeScreen,
      hasCompletedOnboarding: mockDbOrganization.hasCompletedOnboarding,
      config: mockDbOrganization.config
    }
  };
}
