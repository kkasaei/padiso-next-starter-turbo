import { currentUser } from '@clerk/nextjs/server';

/**
 * Platform-level admin roles (distinct from Clerk org-level roles)
 * - admin: Full platform access (manage all orgs, users, billing)
 * - support: Read access + limited actions (view orgs, help users)
 * - viewer: Read-only platform access
 */
export type PlatformRole = 'admin' | 'support' | 'viewer';

/**
 * Admin emails whitelist (fallback for bootstrapping)
 * These users get admin access even without Clerk metadata set
 */
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

/**
 * Check if the current user is a platform super admin
 *
 * A user is considered a super admin if:
 * 1. Their Clerk publicMetadata.platformRole is 'admin', OR
 * 2. Their email is in the ADMIN_EMAILS whitelist
 *
 * This is ORGANIZATION-INDEPENDENT - super admins manage the entire platform.
 */
export async function isSuperAdmin(): Promise<boolean> {
  const user = await currentUser();

  if (!user) {
    return false;
  }

  // Check Clerk publicMetadata for platformRole
  const platformRole = user.publicMetadata?.platformRole as PlatformRole | undefined;
  if (platformRole === 'admin') {
    return true;
  }

  // Fallback: Check email whitelist
  const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (userEmail && ADMIN_EMAILS.includes(userEmail)) {
    return true;
  }

  return false;
}

/**
 * Get the platform role of the current user
 * Returns null if user is not a platform admin
 */
export async function getPlatformRole(): Promise<PlatformRole | null> {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  // Check Clerk publicMetadata for platformRole
  const platformRole = user.publicMetadata?.platformRole as PlatformRole | undefined;
  if (platformRole && ['admin', 'support', 'viewer'].includes(platformRole)) {
    return platformRole;
  }

  // Fallback: Email whitelist users get full admin role
  const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (userEmail && ADMIN_EMAILS.includes(userEmail)) {
    return 'admin';
  }

  return null;
}

/**
 * Get super admin context for admin pages
 * Throws if user is not a super admin
 */
export async function getSuperAdminContext() {
  const user = await currentUser();

  if (!user) {
    throw new Error('Unauthorized - Not authenticated');
  }

  const role = await getPlatformRole();

  if (!role) {
    throw new Error('Forbidden - Not a platform admin');
  }

  return {
    user: {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress ?? '',
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Admin',
      image: user.imageUrl,
    },
    role,
  };
}
