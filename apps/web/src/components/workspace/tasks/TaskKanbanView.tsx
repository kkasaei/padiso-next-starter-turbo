"use client"

import { useMemo, useState } from "react"
import { format } from "date-fns"
import type { UITask } from "@/lib/types/tasks";

// Backward compatibility
type ProjectTask = UITask;
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import { Plus, Calendar, User as UserIcon } from "lucide-react"
import type { CreateTaskContext } from "./TaskQuickCreateModal"

type TaskKanbanViewProps = {
  tasks: ProjectTask[]
  onToggleTask: (taskId: string) => void
  onOpenTask: (task: ProjectTask) => void
  onAddTask?: (context?: CreateTaskContext) => void
}

const COLUMNS = [
  { id: "todo", label: "To Do", color: "bg-gray-100" },
  { id: "in-progress", label: "In Progress", color: "bg-blue-50" },
  { id: "done", label: "Done", color: "bg-teal-50" },
] as const

export function TaskKanbanView({ tasks, onToggleTask, onOpenTask, onAddTask }: TaskKanbanViewProps) {
  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    const groups = new Map<string, ProjectTask[]>()
    
    // Initialize columns
    COLUMNS.forEach(col => groups.set(col.id, []))
    
    // Group tasks
    tasks.forEach(task => {
      const status = task.status || "todo"
      const existing = groups.get(status) || []
      groups.set(status, [...existing, task])
    })
    
    return groups
  }, [tasks])

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-4">
        {COLUMNS.map(column => (
          <div key={column.id} className="flex flex-col min-h-[600px]">
            {/* Column Header */}
            <div className="mb-3 px-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  {column.label}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {tasksByStatus.get(column.id)?.length || 0}
                </span>
              </div>
            </div>

            {/* Column Content */}
            <div className="flex-1 space-y-3 rounded-lg border border-border bg-muted/20 p-3">
              {tasksByStatus.get(column.id)?.map(task => (
                <KanbanTaskCard
                  key={task.id}
                  task={task}
                  onOpen={() => onOpenTask(task)}
                />
              ))}
              
              {/* Add Task Button */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={() => onAddTask?.()}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add task
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function KanbanTaskCard({
  task,
  onOpen,
}: {
  task: ProjectTask
  onOpen: () => void
}) {
  const dueDate = task.startDate ? format(task.startDate, "MMM d") : null

  return (
    <div
      className="rounded-lg border border-border bg-background p-3 hover:shadow-sm transition-shadow cursor-pointer"
      onClick={onOpen}
    >
      {/* Top Row: Brand Badge */}
      {task.projectName && (
        <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground mb-2">
          {task.projectName}
        </Badge>
      )}

      {/* Task Title */}
      <p className="text-sm font-medium mb-3 text-foreground">
        {task.name}
      </p>

      {/* Bottom Row: Date + Assignee */}
      <div className="flex items-center justify-between">
        {dueDate ? (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{dueDate}</span>
          </div>
        ) : (
          <div />
        )}
        
        <Avatar className="size-5">
          {task.assignee?.avatarUrl ? (
            <AvatarImage src={task.assignee.avatarUrl} alt={task.assignee.name} />
          ) : (
            <AvatarFallback className="text-xs bg-muted">
              {task.assignee ? task.assignee.name.charAt(0).toUpperCase() : <UserIcon className="h-3 w-3" />}
            </AvatarFallback>
          )}
        </Avatar>
      </div>
    </div>
  )
}
