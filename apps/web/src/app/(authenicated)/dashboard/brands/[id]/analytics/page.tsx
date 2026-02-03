"use client"

import { BarChart3, Bell } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { toast } from "sonner"
import { FEATURE_FLAGS } from "@/lib/feature-flags"
import { AnalyticsPage as AnalyticsPageComponent } from "@/components/brands/analytics"
import { useParams } from "next/navigation"

export default function AnalyticsPage() {
  const params = useParams()
  const brandId = params.id as string

  if (!FEATURE_FLAGS.ANALYTICS_COMING_SOON) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col gap-2 px-4 justify-center h-[82px] border-b border-border">
          <h1 className="text-2xl font-semibold tracking-tight px-4">Analytics</h1>
        </div>
        <div className="flex flex-1 p-6">
          <AnalyticsPageComponent brandId={brandId} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-2 px-4 justify-center h-[82px] border-b border-border">
        <h1 className="text-2xl font-semibold tracking-tight px-4">Analytics</h1>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Coming Soon</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Track your content performance, monitor traffic, and gain insights into your audience engagement.
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
