"use client"

import { useEffect, useRef } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useOrganization } from "@clerk/nextjs"
import { useBrands } from "@/hooks/use-brands"
import { Loader2 } from "lucide-react"

/**
 * Guards brand detail pages.
 * - Verifies the current brand belongs to the active workspace.
 * - If it doesn't (e.g. user just switched workspace), redirects to the
 *   first brand the workspace owns, or to /dashboard if no brands exist.
 */
export function BrandAccessGuard({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const { organization } = useOrganization()
  const { data: brands, isLoading } = useBrands()
  const hasRedirected = useRef(false)

  const brandId = params.id as string | undefined

  // Not on a brand detail page — nothing to guard
  const isBrandDetailPage =
    pathname.startsWith("/dashboard/brands/") &&
    pathname !== "/dashboard/brands" &&
    pathname !== "/dashboard/brands/new"

  useEffect(() => {
    // Only run on brand detail pages
    if (!isBrandDetailPage) {
      hasRedirected.current = false
      return
    }

    // Wait for data
    if (isLoading || !brands || !organization) return

    // Prevent double-redirect
    if (hasRedirected.current) return

    const belongsToWorkspace = brands.some((b) => b.id === brandId)

    if (!belongsToWorkspace) {
      hasRedirected.current = true

      if (brands.length > 0) {
        // Redirect to the first brand in this workspace
        router.replace(`/dashboard/brands/${brands[0].id}`)
      } else {
        // No brands at all — go to the dashboard (welcome modal will show)
        router.replace("/dashboard")
      }
    }
  }, [isBrandDetailPage, isLoading, brands, brandId, organization, router])

  // Reset the redirect flag when org changes so the guard can fire again
  const orgId = organization?.id
  useEffect(() => {
    hasRedirected.current = false
  }, [orgId])

  // While loading or mid-redirect on a brand page, show a spinner
  if (isBrandDetailPage && (isLoading || !brands)) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (
    isBrandDetailPage &&
    brands &&
    brandId &&
    !brands.some((b) => b.id === brandId)
  ) {
    // Brand doesn't belong — show spinner while redirect happens
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <>{children}</>
}
