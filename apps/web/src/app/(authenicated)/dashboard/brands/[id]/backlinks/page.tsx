"use client"

import { Link2, Bell } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { toast } from "sonner"
import { FEATURE_FLAGS } from "@/lib/feature-flags"
import BacklinkPage from "@/components/brands/backlinks/BacklinkPage"
import { BacklinkPageHeader } from "@/components/brands/backlinks/BacklinkPageHeader"

export default function BacklinksPage() {
  if (!FEATURE_FLAGS.BACKLINKS_COMING_SOON) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between px-8 h-[82px] border-b border-border">
          <h1 className="text-2xl font-semibold tracking-tight">Backlink Exchange</h1>
          <BacklinkPageHeader />
        </div>
        <div className="flex flex-1 px-4">
          <BacklinkPage />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between px-8 h-[82px] border-b border-border">
        <h1 className="text-2xl font-semibold tracking-tight">Backlinks</h1>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Link2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Coming Soon</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Discover backlink opportunities, track your link profile, and exchange links with other brands.
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
