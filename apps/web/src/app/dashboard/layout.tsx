"use client"

import { usePathname } from "next/navigation"
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs"
import { WorkspaceSidebar } from "@/components/workspace-sidebar"
import { ProjectSidebar, ProjectSidebarProvider } from "@/components/project-sidebar"

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
            <main className="flex flex-1 m-2 rounded-2xl border border-border bg-background overflow-hidden">
              {isProjectDetailPage && <ProjectSidebar />}
              <div className="flex flex-1 flex-col min-w-0">
                {children}
              </div>
            </main>
          </ProjectSidebarProvider>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
