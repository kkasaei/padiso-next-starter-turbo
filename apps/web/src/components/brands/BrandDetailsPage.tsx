"use client"

import { useBrand } from "@/hooks/use-brands"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Globe, Calendar, Palette } from "lucide-react"
import { format } from "date-fns"

type BrandDetailsPageProps = {
  brandId: string
}

export function BrandDetailsPage({ brandId }: BrandDetailsPageProps) {
  const { data: brandData, isLoading, error } = useBrand(brandId)

  if (isLoading) {
    return <ProjectDetailsSkeleton />
  }

  if (error || !brandData) {
    return (
      <div className="flex flex-1 flex-col min-w-0">
        <div className="h-[82px] flex items-center justify-between gap-4 px-4 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="text-sm text-destructive">
              {error?.message ?? "Brand not found"}
            </span>
          </div>
        </div>
      </div>
    )
  }

  const createdDate = typeof brandData.createdAt === 'string' 
    ? new Date(brandData.createdAt) 
    : brandData.createdAt

  return (
    <div className="flex flex-1 flex-col min-w-0">
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Brand Header */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{brandData.brandName || "Untitled Brand"}</h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {brandData.websiteUrl && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <a 
                    href={brandData.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-foreground underline"
                  >
                    {brandData.websiteUrl}
                  </a>
                </div>
              )}
              {brandData.brandColor && (
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span className="flex items-center gap-2">
                    <span 
                      className="h-4 w-4 rounded border border-border" 
                      style={{ backgroundColor: brandData.brandColor }}
                    />
                    {brandData.brandColor}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Created {format(createdDate, "MMM d, yyyy")}</span>
              </div>
            </div>
          </div>

          {/* Brand Details Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {brandData.languages && brandData.languages.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="font-semibold mb-2">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {brandData.languages.map((lang) => (
                    <span key={lang} className="px-2 py-1 bg-muted rounded text-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {brandData.targetAudiences && brandData.targetAudiences.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="font-semibold mb-2">Target Audiences</h3>
                <div className="flex flex-wrap gap-2">
                  {brandData.targetAudiences.map((audience) => (
                    <span key={audience} className="px-2 py-1 bg-muted rounded text-sm">
                      {audience}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {brandData.businessKeywords && brandData.businessKeywords.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="font-semibold mb-2">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {brandData.businessKeywords.map((keyword) => (
                    <span key={keyword} className="px-2 py-1 bg-muted rounded text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {brandData.competitors && brandData.competitors.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="font-semibold mb-2">Competitors</h3>
                <div className="flex flex-wrap gap-2">
                  {brandData.competitors.map((competitor) => (
                    <span key={competitor} className="px-2 py-1 bg-muted rounded text-sm">
                      {competitor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectDetailsSkeleton() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <div className="h-[82px] flex items-center gap-4 px-4 border-b border-border">
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
