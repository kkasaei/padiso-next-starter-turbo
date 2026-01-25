import { auth as clerkAuth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { cache } from 'react';

/**
 * Redirect to sign in page
 */
export function redirectToSignIn(): never {
  redirect('/auth/sign-in');
}

/**
 * Redirect to sign up page
 */
export function redirectToSignUp(): never {
  redirect('/auth/sign-up');
}

// Deduplicated server-side auth call - use this to get userId, orgId, orgRole
export const dedupedAuth = cache(clerkAuth);

// Deduplicated user fetch - use this to get full user details
export const dedupedCurrentUser = cache(currentUser);

// Alias for backward compatibility
export const auth = dedupedAuth;

// Re-export Clerk types
export type { User } from '@clerk/nextjs/server';

// Re-export admin utilities
export {
  isSuperAdmin,
  getPlatformRole,
  getSuperAdminContext,
  type PlatformRole,
} from './admin';
