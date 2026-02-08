import { trpc } from "@/lib/trpc/client"

/**
 * Client-side hook to check if waitlist mode is enabled
 * Returns { isWaitlistMode: boolean, isLoading: boolean }
 */
export function useIsWaitlistMode() {
  const { data: authModeSetting, isLoading } = trpc.adminSettings.getByKey.useQuery(
    { key: "auth_mode" },
    {
      staleTime: 60 * 1000, // Cache for 1 minute
      refetchOnWindowFocus: true,
    }
  )

  const isWaitlistMode = authModeSetting?.value 
    ? (authModeSetting.value as any).use_waitlist_mode === true
    : false

  return {
    isWaitlistMode,
    isLoading,
  }
}
