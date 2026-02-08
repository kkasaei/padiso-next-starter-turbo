/**
 * Security helpers for checking superadmin access
 * Server-side utility functions
 */

import { auth, currentUser } from '@clerk/nextjs/server';

/**
 * Check if the current user has superadmin role
 * Use this in server components or API routes
 */
export async function isSuperAdmin(): Promise<boolean> {
    try {
        const { userId } = await auth();

        if (!userId) {
            return false;
        }

        const user = await currentUser();

        if (!user) {
            return false;
        }

        // Check private metadata for superadmin role
        const privateMetadata = user.privateMetadata as { roles?: string[] } | undefined;
        return privateMetadata?.roles?.includes('superadmin') ?? false;
    } catch (error) {
        console.error('Error checking superadmin role:', error);
        return false;
    }
}

/**
 * Require superadmin access - throws if user is not a superadmin
 * Use this to protect server actions or API routes
 */
export async function requireSuperAdmin(): Promise<void> {
    const isAdmin = await isSuperAdmin();

    if (!isAdmin) {
        throw new Error('Unauthorized: Superadmin access required');
    }
}

/**
 * Get user roles from Clerk metadata
 */
export async function getUserRoles(): Promise<string[]> {
    try {
        const user = await currentUser();

        if (!user) {
            return [];
        }

        // Get roles from private metadata only
        const privateMetadata = user.privateMetadata as { roles?: string[] } | undefined;
        return privateMetadata?.roles ?? [];
    } catch (error) {
        console.error('Error getting user roles:', error);
        return [];
    }
}
