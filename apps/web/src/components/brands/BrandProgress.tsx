"use client"

import { ListChecks } from "lucide-react"
import type { Project } from "@/lib/mocks/legacy-projects"
import { ProgressCircle } from "@/components/shared/ProgressCircle"
import { cn } from "@workspace/ui/lib/utils"

export type BrandProgressProps = {
  project: Project
  className?: string
  /**
   * Progress circle size in pixels, default 18px (matches sidebar Active Projects)
   */
  size?: number
  /**
   * Whether to show the "done / total Tasks" summary text
   */
  showTaskSummary?: boolean
}

function computeBrandProgress(project: Project) {
  const totalTasks = project.tasks?.length ?? project.taskCount ?? 0
  const doneTasks = project.tasks
    ? project.tasks.filter((t) => t.status === "done").length
    : Math.round(((project.progress ?? 0) / 100) * totalTasks)

  const percent = typeof project.progress === "number"
    ? project.progress
    : totalTasks
      ? Math.round((doneTasks / totalTasks) * 100)
      : 0

  return {
    totalTasks,
    doneTasks,
    percent: Math.max(0, Math.min(100, percent)),
  }
}

function getProgressColor(percent: number): string {
  // Simple threshold-based mapping, aligned with the sidebar palette
  if (percent >= 80) return "var(--chart-3)" // success
  if (percent >= 50) return "var(--chart-4)" // mid / warning
  if (percent > 0) return "var(--chart-5)" // low / risk
  return "var(--chart-2)" // neutral for 0%
}

export function BrandProgress({ project, className, size = 18, showTaskSummary = true }: ProjectProgressProps) {
  const { totalTasks, doneTasks, percent } = computeBrandProgress(project)
  const color = getProgressColor(percent)

  return (
    <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <ProgressCircle progress={percent} color={color} size={size} />
      <div className="flex items-center gap-4">
        <span>{percent}%</span>
        {showTaskSummary && totalTasks > 0 && (
          <span className="flex items-center gap-1 text-sm">
            <ListChecks className="h-4 w-4" />
            {doneTasks} / {totalTasks} Tasks
          </span>
        )}
      </div>
    </div>
  )
}
