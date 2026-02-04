"use client"

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs"
import { AdminSidebar } from "@/components/layout/admin-nav"

export const dynamic = 'force-dynamic'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SignedIn>
        <div className="flex min-h-screen bg-[#F2F2F4]">
          {/* Fixed Admin Sidebar - 80px */}
          <AdminSidebar />
          
          {/* Main content area */}
          <div className="relative flex flex-1 m-2">
            <main className="flex flex-1 rounded-2xl border border-border bg-background overflow-hidden">
              <div className="flex flex-1 flex-col min-w-0">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
