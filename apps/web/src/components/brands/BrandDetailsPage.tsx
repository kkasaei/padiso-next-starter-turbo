"use client"

import { useMemo } from "react"

import { useProject } from "@/hooks/use-projects"
import { Breadcrumbs } from "@/components/workspace/brands/Breadcrumbs"
import { BrandSidebarTrigger } from "@/components/workspace/brands/brand-sidebar"
import ProjectDetailsMain from "@/components/brands/project-details"
import { Skeleton } from "@workspace/ui/components/skeleton"

type BrandDetailsPageProps = {
  brandId: string
}

export function BrandDetailsPage({ brandId }: BrandDetailsPageProps) {
  const { data: projectData, isLoading, error } = useProject(brandId)

  const breadcrumbs = useMemo(
    () => [
      { label: "Projects", href: "/dashboard/brands" },
      { label: projectData?.name ?? "Project Details" },
    ],
    [projectData?.name]
  )

  if (isLoading) {
    return <ProjectDetailsSkeleton />
  }

  if (error || !projectData) {
    return (
      <div className="flex flex-1 flex-col min-w-0">
        <div className="h-[82px] flex items-center justify-between gap-4 px-4 border-b border-border">
          <div className="flex items-center gap-3">
            <BrandSidebarTrigger />
            <span className="text-sm text-destructive">
              {error?.message ?? "Project not found"}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col min-w-0">
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4">
        <ProjectDetailsMain />
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
