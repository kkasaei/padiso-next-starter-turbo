"use client"

import { format } from "date-fns"
import type { ProjectTask } from "@/lib/mocks/legacy-project-details"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { cn } from "@workspace/ui/lib/utils"
import { Calendar, User as UserIcon } from "lucide-react"

type TaskTableViewProps = {
  tasks: ProjectTask[]
  onToggleTask: (taskId: string) => void
  onOpenTask: (task: ProjectTask) => void
}

function taskStatusConfig(status: string) {
  switch (status) {
    case "done":
      return { label: "Done", dot: "bg-teal-600" }
    case "in-progress":
      return { label: "In Progress", dot: "bg-blue-600" }
    case "todo":
      return { label: "To Do", dot: "bg-gray-400" }
    default:
      return { label: status, dot: "bg-gray-400" }
  }
}

function taskPriorityConfig(priority?: string) {
  switch (priority) {
    case "urgent":
      return { label: "Urgent", color: "text-red-600" }
    case "high":
      return { label: "High", color: "text-orange-600" }
    case "medium":
      return { label: "Medium", color: "text-yellow-600" }
    case "low":
      return { label: "Low", color: "text-green-600" }
    case "no-priority":
      return { label: "No Priority", color: "text-gray-400" }
    default:
      return { label: "—", color: "text-gray-400" }
  }
}

export function TaskTableView({ tasks, onToggleTask, onOpenTask }: TaskTableViewProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-8">
        <p className="text-muted-foreground mb-2">No tasks found</p>
        <p className="text-sm text-muted-foreground">Create your first task to get started</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="rounded-lg border border-border bg-background overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="w-10 py-3 px-4"></th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Task</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Brand</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Priority</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Due Date</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground">Assignee</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const isDone = task.status === "done"
              const statusConfig = taskStatusConfig(task.status)
              const priorityConfig = taskPriorityConfig(task.priority)
              const dueDate = task.startDate ? format(task.startDate, "MMM d, yyyy") : "—"

              return (
                <tr 
                  key={task.id}
                  onClick={() => onOpenTask(task)}
                  className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  {/* Checkbox */}
                  <td className="py-3 px-4">
                    <Checkbox
                      checked={isDone}
                      onCheckedChange={() => onToggleTask(task.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>

                  {/* Task Name */}
                  <td className="py-3 px-4">
                    <span className={cn(
                      "text-sm font-medium",
                      isDone ? "line-through text-muted-foreground" : "text-foreground"
                    )}>
                      {task.name}
                    </span>
                  </td>

                  {/* Brand */}
                  <td className="py-3 px-4">
                    <span className="text-sm text-muted-foreground">{task.projectName}</span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className={cn("inline-block size-2 rounded-full", statusConfig.dot)} />
                      <span className="text-xs text-foreground">{statusConfig.label}</span>
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-4">
                    <span className={cn("text-xs font-medium", priorityConfig.color)}>
                      {priorityConfig.label}
                    </span>
                  </td>

                  {/* Due Date */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{dueDate}</span>
                    </div>
                  </td>

                  {/* Assignee */}
                  <td className="py-3 px-4">
                    <div className="flex justify-center">
                      <Avatar className="size-6">
                        {task.assignee?.avatarUrl ? (
                          <AvatarImage src={task.assignee.avatarUrl} alt={task.assignee.name} />
                        ) : (
                          <AvatarFallback className="text-xs bg-muted">
                            {task.assignee ? task.assignee.name.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
