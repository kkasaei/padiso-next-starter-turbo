/**
 * Security API Route - Check Superadmin Role
 * 
 * Checks if the authenticated user has "superadmin" role in their Clerk metadata.
 * Used to control access to the /control admin panel.
 * 
 * GET /api/security/check-admin
 * Returns: { isSuperAdmin: boolean, userId?: string }
 */

import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';

export const runtime = 'nodejs';

export async function GET(): Promise<Response> {
    try {
        // Verify authentication
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { isSuperAdmin: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get current user with metadata
        const user = await currentUser();

        if (!user) {
            return NextResponse.json(
                { isSuperAdmin: false, error: 'User not found' },
                { status: 404 }
            );
        }

        // Check if user has superadmin role in private metadata
        const privateMetadata = user.privateMetadata as { roles?: string[] } | undefined;

        console.log('User ID:', user.id);
        const isSuperAdmin = privateMetadata?.roles?.includes('superadmin') ?? false;

        console.log('Is Superadmin:', isSuperAdmin);

        return NextResponse.json({
            isSuperAdmin,
            userId: user.id,
        });
    } catch (error) {
        console.error('Error checking superadmin role:', error);
        return NextResponse.json(
            { isSuperAdmin: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
