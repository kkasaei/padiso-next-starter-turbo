"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import type { Brand } from "@workspace/db/schema"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { useUser } from "@clerk/nextjs"
import { ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@workspace/ui/lib/utils"
import Image from "next/image"

type BrandTableViewProps = {
  brands?: Brand[]
  loading?: boolean
}

export function BrandTableView({ brands = [], loading = false }: BrandTableViewProps) {
  const router = useRouter()

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-sm text-muted-foreground">Loading brands...</div>
      </div>
    )
  }

  if (brands.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-8">
        <p className="text-muted-foreground mb-2">No brands found</p>
        <p className="text-sm text-muted-foreground">Create your first brand to get started</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="rounded-lg border border-border bg-background overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Brand</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Website</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground">AI Score</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Last Scan</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Next Scan</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground">Owner</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <BrandTableRow key={brand.id} brand={brand} onClick={() => router.push(`/dashboard/brands/${brand.id}`)} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function statusConfig(status: Brand["status"]) {
  switch (status) {
    case "active":
      return { label: "Active", dot: "bg-teal-600" }
    case "planned":
      return { label: "Planned", dot: "bg-zinc-600" }
    case "backlog":
      return { label: "Backlog", dot: "bg-orange-600" }
    case "completed":
      return { label: "Completed", dot: "bg-blue-600" }
    case "cancelled":
      return { label: "Cancelled", dot: "bg-rose-600" }
    default:
      return { label: status, dot: "bg-zinc-400" }
  }
}

function BrandTableRow({ brand, onClick }: { brand: Brand; onClick: () => void }) {
  const { user } = useUser()
  const [faviconError, setFaviconError] = useState(false)

  const userName = user?.fullName || user?.firstName || "User"
  const userImage = user?.imageUrl
  const initials = userName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const brandName = brand.brandName || "Untitled Brand"
  const score = brand.visibilityScore || 0
  const s = statusConfig(brand.status)

  // Get favicon URL
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

  // Last scan date label
  const lastScanDate = brand.lastScanAt 
    ? (typeof brand.lastScanAt === 'string' ? new Date(brand.lastScanAt) : brand.lastScanAt)
    : null
  const lastScanLabel = lastScanDate 
    ? formatDistanceToNow(lastScanDate, { addSuffix: true })
    : "Never"
  
  // Next scan date label
  const nextScanDate = brand.nextScanAt 
    ? (typeof brand.nextScanAt === 'string' ? new Date(brand.nextScanAt) : brand.nextScanAt)
    : null
  const nextScanLabel = nextScanDate 
    ? formatDistanceToNow(nextScanDate, { addSuffix: true })
    : "—"

  return (
    <tr 
      onClick={onClick}
      className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
    >
      {/* Brand */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center rounded-full w-8 h-8 shrink-0 bg-muted overflow-hidden">
            {faviconUrl && !faviconError ? (
              <Image
                src={faviconUrl}
                alt={brandName}
                width={32}
                height={32}
                className="w-full h-full object-cover"
                onError={() => setFaviconError(true)}
              />
            ) : (
              <div 
                className="flex items-center justify-center w-full h-full"
                style={{ backgroundColor: brand.brandColor || '#e5e7eb' }}
              >
                <span className="text-xs font-semibold text-white">
                  {brandName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <span className="text-sm font-medium text-foreground">{brandName}</span>
        </div>
      </td>

      {/* Website */}
      <td className="py-3 px-4">
        {brand.websiteUrl && (
          <a
            href={brand.websiteUrl.startsWith('http') ? brand.websiteUrl : `https://${brand.websiteUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="truncate max-w-[200px]">{brand.websiteUrl.replace(/^https?:\/\//, '')}</span>
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        )}
      </td>

      {/* AI Score */}
      <td className="py-3 px-4 text-center">
        <span className="text-sm font-semibold text-foreground">{score}</span>
      </td>

      {/* Last Scan */}
      <td className="py-3 px-4">
        <span className="text-sm text-muted-foreground">{lastScanLabel}</span>
      </td>

      {/* Next Scan */}
      <td className="py-3 px-4">
        <span className="text-sm text-muted-foreground">{nextScanLabel}</span>
      </td>

      {/* Status */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-1.5">
          <span className={cn("inline-block size-2 rounded-full", s.dot)} />
          <span className="text-xs text-foreground">{s.label}</span>
        </div>
      </td>

      {/* Owner */}
      <td className="py-3 px-4">
        <div className="flex justify-center">
          <Avatar className="size-6">
            <AvatarImage alt={userName} src={userImage} />
            <AvatarFallback className="text-xs bg-muted">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </td>
    </tr>
  )
}
