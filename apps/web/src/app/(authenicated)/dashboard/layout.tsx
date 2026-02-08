"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { SignedIn, SignedOut, RedirectToSignIn, useOrganization, useOrganizationList } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"
import { Logo } from "@workspace/ui/components/logo"
import { WorkspaceSidebar } from "@/components/layout/WorkspaceSidebar"
import { BrandSidebar, BrandSidebarProvider, BrandSidebarToggle } from "@/components/brands/BrandSidebar"
import { BrandAccessGuard } from "@/components/brands/BrandAccessGuard"

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { organization: activeOrg, isLoaded: isOrgLoaded } = useOrganization()
  const { userMemberships, setActive, isLoaded: isListLoaded } = useOrganizationList({
    userMemberships: { pageSize: 50 },
  })

  // Auto-select the first organization if Clerk loaded but none is active
  useEffect(() => {
    if (
      isOrgLoaded &&
      isListLoaded &&
      !activeOrg &&
      userMemberships.data &&
      userMemberships.data.length > 0
    ) {
      setActive?.({ organization: userMemberships.data[0]!.organization.id })
    }
  }, [isOrgLoaded, isListLoaded, activeOrg, userMemberships.data, setActive])

  // Show brand sidebar only on brand detail pages: /dashboard/brands/[id]
  const isBrandDetailPage =
    pathname.startsWith("/dashboard/brands/") &&
    pathname !== "/dashboard/brands" &&
    pathname !== "/dashboard/brands/new"

  // Full-page loader while Clerk is initialising or auto-selecting an org
  const isReady = isOrgLoaded && isListLoaded && activeOrg
  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sidebar">
        <div className="flex flex-col items-center gap-4">
          <Logo className="h-8 w-auto opacity-80" />
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-sidebar">
      {/* Fixed Workspace Sidebar - 80px, never collapses */}
      <WorkspaceSidebar />

      {/* Main content area */}
      <BrandSidebarProvider>
        <div className="relative flex flex-1 m-2">
          <main className="flex flex-1 rounded-2xl border border-border bg-background overflow-hidden">
            <BrandAccessGuard>
              {isBrandDetailPage && <BrandSidebar />}
              <div className="flex flex-1 flex-col min-w-0">
                {children}
              </div>
            </BrandAccessGuard>
          </main>
          {/* Toggle button on main card edge when sidebar is closed */}
          {isBrandDetailPage && <BrandSidebarToggle showWhenOpen={false} className="-left-3" />}
        </div>
      </BrandSidebarProvider>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SignedIn>
        <DashboardShell>{children}</DashboardShell>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
