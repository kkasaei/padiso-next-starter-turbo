"use client"

import { useState, useEffect } from 'react';

interface AdminCheckResult {
    isSuperAdmin: boolean;
    isLoading: boolean;
    error?: string;
}

/**
 * Client-side hook to check if current user has superadmin access
 * 
 * @example
 * ```tsx
 * const { isSuperAdmin, isLoading } = useIsSuperAdmin();
 * 
 * if (isLoading) return <Spinner />;
 * if (!isSuperAdmin) return <Redirect to="/dashboard" />;
 * 
 * return <AdminPanel />;
 * ```
 */
export function useIsSuperAdmin(): AdminCheckResult {
    const [state, setState] = useState<AdminCheckResult>({
        isSuperAdmin: false,
        isLoading: true,
    });

    useEffect(() => {
        let mounted = true;

        async function checkAdmin() {
            try {
                const response = await fetch('/api/security/check-admin');
                const data = await response.json();

                if (mounted) {
                    setState({
                        isSuperAdmin: data.isSuperAdmin ?? false,
                        isLoading: false,
                        error: data.error,
                    });
                }
            } catch (error) {
                if (mounted) {
                    setState({
                        isSuperAdmin: false,
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Failed to check admin access',
                    });
                }
            }
        }

        checkAdmin();

        return () => {
            mounted = false;
        };
    }, []);

    return state;
}
