"use client"

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs"
import { AdminSidebar } from "@/components/admin/layout/admin-nav"
import { useIsSuperAdmin } from "@/hooks/use-is-super-admin"
import { ShieldAlert, ArrowLeft } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isSuperAdmin, isLoading } = useIsSuperAdmin()

  // Show loading state while checking admin access
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Verifying access...</div>
      </div>
    )
  }

  // Show unauthorized page if user is not a superadmin
  if (!isSuperAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6 text-center max-w-md px-4">
          <div className="rounded-full bg-destructive/10 p-4">
            <ShieldAlert className="h-12 w-12 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Access Denied</h1>
            <p className="text-muted-foreground">
              You are not authorized to access this page. This area is restricted to system administrators only.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    )
  }

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
