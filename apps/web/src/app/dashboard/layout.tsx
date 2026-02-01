"use client"

import { usePathname } from "next/navigation"
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs"
import { WorkspaceSidebar } from "@/components/layout/workspace-sidebar"
import { BrandSidebar, BrandSidebarProvider, BrandSidebarToggle } from "@/components/workspace/brands/brand-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Show project sidebar only on project detail pages: /dashboard/brands/[id]
  const isProjectDetailPage = pathname.startsWith("/dashboard/brands/") && 
    pathname !== "/dashboard/brands" &&
    pathname !== "/dashboard/brands/new"

  return (
    <>
      <SignedIn>
        <div className="flex min-h-screen bg-[#F2F2F4]">
          {/* Fixed Workspace Sidebar - 80px, never collapses */}
          <WorkspaceSidebar />
          
          {/* Main content area */}
          <BrandSidebarProvider>
            <div className="relative flex flex-1 m-2">
              <main className="flex flex-1 rounded-2xl border border-border bg-background overflow-hidden">
                {isProjectDetailPage && <BrandSidebar />}
                <div className="flex flex-1 flex-col min-w-0">
                  {children}
                </div>
              </main>
              {/* Toggle button on main card edge when sidebar is closed */}
              {isProjectDetailPage && <BrandSidebarToggle showWhenOpen={false} className="-left-3" />}
            </div>
          </BrandSidebarProvider>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
