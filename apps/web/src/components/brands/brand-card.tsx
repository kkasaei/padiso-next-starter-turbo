"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import type { Brand } from "@workspace/db/schema"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { useUser } from "@clerk/nextjs"
import { ArrowRight, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

type BrandCardProps = {
  brand: Brand
}

export function BrandCard({ brand }: BrandCardProps) {
  const router = useRouter()
  const { user } = useUser() // Get current logged-in user from Clerk
  const [faviconError, setFaviconError] = useState(false)

  // For now, use the current logged-in user's info (since we don't fetch other users)
  // TODO: Fetch user by createdByUserId when we need to show multiple users
  const userName = user?.fullName || user?.firstName || "User"
  const userImage = user?.imageUrl
  const initials = userName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const brandName = brand.brandName || "Untitled Brand"
  
  // Get favicon URL from website
  const getFaviconUrl = (websiteUrl: string | null) => {
    if (!websiteUrl) return null
    try {
      const url = new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`)
      return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`
    } catch {
      return null
    }
  }

  const faviconUrl = getFaviconUrl(brand.websiteUrl)
  
  // AI Visibility Score
  const score = brand.visibilityScore || 0
  
  // Last scan date label
  const lastScanDate = brand.lastScanAt 
    ? (typeof brand.lastScanAt === 'string' ? new Date(brand.lastScanAt) : brand.lastScanAt)
    : null
  const lastScanLabel = lastScanDate 
    ? formatDistanceToNow(lastScanDate, { addSuffix: true })
    : "Never scanned"
  
  // Next scan date label
  const nextScanDate = brand.nextScanAt 
    ? (typeof brand.nextScanAt === 'string' ? new Date(brand.nextScanAt) : brand.nextScanAt)
    : null
  const nextScanLabel = nextScanDate 
    ? formatDistanceToNow(nextScanDate, { addSuffix: true })
    : "—"

  const goToDetails = () => router.push(`/dashboard/brands/${brand.id}`)

  const onKeyNavigate: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      goToDetails()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open brand ${brandName}`}
      onClick={goToDetails}
      onKeyDown={onKeyNavigate}
      className="group relative rounded-xl border border-border bg-background hover:shadow-sm transition-all cursor-pointer focus:outline-none"
    >
      <div className="p-5">
        {/* Header with Icon */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Brand Icon - Favicon or Initial */}
            <div className="relative flex items-center justify-center rounded-full w-10 h-10 shrink-0 bg-muted overflow-hidden">
              {faviconUrl && !faviconError ? (
                <Image
                  src={faviconUrl}
                  alt={brandName}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  onError={() => setFaviconError(true)}
                />
              ) : (
                <div 
                  className="flex items-center justify-center w-full h-full"
                  style={{ backgroundColor: brand.brandColor || '#e5e7eb' }}
                >
                  <span className="text-sm font-semibold text-white">
                    {brandName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Brand Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-foreground mb-1 truncate">
                {brandName}
              </h3>
              {brand.websiteUrl && (
                <a
                  href={brand.websiteUrl.startsWith('http') ? brand.websiteUrl : `https://${brand.websiteUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="group/link inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors truncate max-w-full"
                >
                  <span className="truncate">{brand.websiteUrl.replace(/^https?:\/\//, '')}</span>
                  <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                </a>
              )}
            </div>
          </div>

          {/* AI Score Box - Top Right */}
          <div className="flex flex-col items-center gap-0.5 shrink-0">
            <div className="flex items-center justify-center rounded-lg w-12 h-12 border border-border bg-muted/30">
              <span className="text-xl font-bold text-foreground">
                {score}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground">AI Score</span>
          </div>
        </div>

        {/* Scan Info - Minimal */}
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Last scan</span>
            <span className="text-foreground">{lastScanLabel}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Next scan</span>
            <span className="text-foreground">{nextScanLabel}</span>
          </div>
        </div>

        {/* Footer with Avatar */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
          <Avatar className="size-6">
            <AvatarImage alt={userName} src={userImage} />
            <AvatarFallback className="text-xs bg-muted">
              {initials}
            </AvatarFallback>
          </Avatar>
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </div>
  )
}
