"use client"

import { usePathname } from "next/navigation"
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs"
import { WorkspaceSidebar } from "@/components/workspace-sidebar"
import { ProjectSidebar, ProjectSidebarProvider, ProjectSidebarToggle } from "@/components/project-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Show project sidebar only on project detail pages: /dashboard/projects/[id]
  const isProjectDetailPage = pathname.startsWith("/dashboard/projects/") && 
    pathname !== "/dashboard/projects" &&
    pathname !== "/dashboard/projects/new"

  return (
    <>
      <SignedIn>
        <div className="flex min-h-screen bg-[#F2F2F4]">
          {/* Fixed Workspace Sidebar - 80px, never collapses */}
          <WorkspaceSidebar />
          
          {/* Main content area */}
          <ProjectSidebarProvider>
            <div className="relative flex flex-1 m-2">
              <main className="flex flex-1 rounded-2xl border border-border bg-background overflow-hidden">
                {isProjectDetailPage && <ProjectSidebar />}
                <div className="flex flex-1 flex-col min-w-0">
                  {children}
                </div>
              </main>
              {/* Toggle button on main card edge when sidebar is closed */}
              {isProjectDetailPage && <ProjectSidebarToggle showWhenOpen={false} className="-left-3" />}
            </div>
          </ProjectSidebarProvider>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
