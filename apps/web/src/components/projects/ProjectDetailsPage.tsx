"use client"

import { useCallback, useMemo } from "react"
import { LinkSimple } from "@phosphor-icons/react/dist/ssr"
import { toast } from "sonner"

import type { ProjectDetails } from "@/lib/data/project-details"
import { baseDetailsFromListItem } from "@/lib/data/project-details"
import { useProject } from "@/hooks/use-projects"
import { Breadcrumbs } from "@/components/projects/Breadcrumbs"
import { ProjectSidebarTrigger } from "@/components/project-sidebar"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"

type ProjectDetailsPageProps = {
  projectId: string
}

export function ProjectDetailsPage({ projectId }: ProjectDetailsPageProps) {
  const { data: projectData, isLoading, error } = useProject(projectId)

  // Transform tRPC project data to ProjectDetails format
  const project = useMemo<ProjectDetails | null>(() => {
    if (!projectData) return null
    
    const projectListItem = {
      id: projectData.id,
      name: projectData.name,
      taskCount: projectData.taskCount,
      progress: projectData.progress,
      startDate: new Date(projectData.startDate),
      endDate: new Date(projectData.endDate),
      status: projectData.status,
      priority: projectData.priority,
      tags: projectData.tags || [],
      members: projectData.members || [],
      client: projectData.client,
      typeLabel: projectData.typeLabel,
      durationLabel: projectData.durationLabel,
      tasks: [],
    }
    
    return baseDetailsFromListItem(projectListItem)
  }, [projectData])

  const copyLink = useCallback(async () => {
    if (!navigator.clipboard) {
      toast.error("Clipboard not available")
      return
    }

    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied")
    } catch {
      toast.error("Failed to copy link")
    }
  }, [])

  const breadcrumbs = useMemo(
    () => [
      { label: "Projects", href: "/dashboard/projects" },
      { label: project?.name ?? "Project Details" },
    ],
    [project?.name]
  )

  if (isLoading) {
    return <ProjectDetailsSkeleton />
  }

  if (error || !project) {
    return (
      <div className="flex flex-1 flex-col min-w-0">
        <div className="h-[73px] flex items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3">
            <ProjectSidebarTrigger />
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
      <div className="h-[82px] flex items-center justify-between gap-4 px-4 border-b border-border">
        <div className="flex items-center gap-3">
          <ProjectSidebarTrigger />
          <div className="hidden sm:block">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectDetailsSkeleton() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <div className="h-[73px] flex items-center gap-4 px-4">
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  )
}
