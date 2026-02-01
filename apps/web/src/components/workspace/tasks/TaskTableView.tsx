"use client";

import { format } from "date-fns";
import { Calendar, User as UserIcon, Tag as TagIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Badge } from "@workspace/ui/components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { cn } from "@workspace/ui/lib/utils";
import type { UITask } from "@/lib/types/tasks";
import { getTaskStatusConfig, getTaskPriorityConfig } from "./TaskConstants";

// Backward compatibility
type ProjectTask = UITask;

type TaskTableViewProps = {
  tasks: ProjectTask[];
  onToggleTask: (taskId: string) => void;
  onOpenTask: (task: ProjectTask) => void;
};

export function TaskTableView({ tasks, onToggleTask, onOpenTask }: TaskTableViewProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-8">
        <p className="text-muted-foreground mb-2">No tasks found</p>
        <p className="text-sm text-muted-foreground">Create your first task to get started</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-muted/30">
            <TableHead className="w-12"></TableHead>
            <TableHead>Task</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Tag</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-center">Assignee</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => {
            const isDone = task.status === "done";
            const statusConfig = getTaskStatusConfig(task.status);
            const priorityConfig = getTaskPriorityConfig(task.priority);
            const dueDate = task.startDate ? format(task.startDate, "MMM d, yyyy") : null;

            return (
              <TableRow
                key={task.id}
                onClick={() => onOpenTask(task)}
                className="cursor-pointer"
              >
                {/* Checkbox */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={isDone}
                    onCheckedChange={() => onToggleTask(task.id)}
                    className={cn(isDone && "data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600")}
                  />
                </TableCell>

                {/* Task Name */}
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className={cn(
                      "font-medium",
                      isDone && "line-through text-muted-foreground"
                    )}>
                      {task.name}
                    </span>
                    {task.description && (
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {task.description}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Brand */}
                <TableCell>
                  {task.projectName && (
                    <Badge variant="outline" className="font-normal">
                      {task.projectName}
                    </Badge>
                  )}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={cn("inline-block size-2 rounded-full", statusConfig.dot)} />
                    <span className="text-sm">{statusConfig.label}</span>
                  </div>
                </TableCell>

                {/* Priority */}
                <TableCell>
                  <span className={cn("text-sm font-medium", priorityConfig.className)}>
                    {priorityConfig.label}
                  </span>
                </TableCell>

                {/* Tag */}
                <TableCell>
                  {task.tag && (
                    <Badge variant="secondary" className="font-normal gap-1">
                      <TagIcon className="h-3 w-3" />
                      {task.tag}
                    </Badge>
                  )}
                </TableCell>

                {/* Due Date */}
                <TableCell>
                  {dueDate ? (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{dueDate}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>

                {/* Assignee */}
                <TableCell>
                  <div className="flex justify-center">
                    {task.assignee ? (
                      <Avatar className="size-7">
                        {task.assignee.avatarUrl ? (
                          <AvatarImage src={task.assignee.avatarUrl} alt={task.assignee.name} />
                        ) : (
                          <AvatarFallback className="text-xs">
                            {task.assignee.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    ) : (
                      <div className="size-7 rounded-full bg-muted flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
