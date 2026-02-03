"use client"

import { FileSearch, Bell } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { toast } from "sonner"
import { FEATURE_FLAGS } from "@/lib/feature-flags"
import { default as AuditPageComponent } from "@/components/brands/audit/AuditPage"

export default function TechnicalAuditPage() {
  if (!FEATURE_FLAGS.TECHNICAL_AUDIT_COMING_SOON) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col gap-2 px-4 justify-center h-[82px] border-b border-border">
          <h1 className="text-2xl font-semibold tracking-tight px-4">Technical Audit</h1>
        </div>
        <div className="flex flex-1 p-4">
          <AuditPageComponent />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-2 px-4 justify-center h-[82px] border-b border-border">
        <h1 className="text-2xl font-semibold tracking-tight px-4">Technical Audit</h1>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <FileSearch className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Coming Soon</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Analyze your website&apos;s technical SEO health, identify issues, and get actionable recommendations.
            </p>
          </div>
          <Button 
            variant="outline" 
            className="rounded-full mt-2"
            onClick={() => toast("We'll email you once this is ready!")}
          >
            <Bell className="h-4 w-4 mr-2" />
            Notify me!
          </Button>
        </div>
      </div>
    </div>
  )
}
