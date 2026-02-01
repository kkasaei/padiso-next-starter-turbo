/**
 * Task Types & Interfaces
 * 
 * Centralized type definitions for the task management system.
 * All task-related components should import types from this file.
 */

import type { UITask } from "@/lib/types/tasks";

// ============================================================
// CORE TASK TYPES
// ============================================================

/**
 * Legacy compatibility - ProjectTask is an alias for UITask
 * @deprecated Use UITask directly
 */
export type ProjectTask = UITask;

/**
 * Re-export UITask for convenience
 */
export type { UITask };

// ============================================================
// TASK STATUS & PRIORITY
// ============================================================

export type TaskStatusId = "todo" | "in-progress" | "done";

export type TaskPriorityId = "no-priority" | "low" | "medium" | "high" | "urgent";

export type TaskStatus = {
  id: TaskStatusId;
  label: string;
  dotClass: string;
};

export type TaskPriority = {
  id: TaskPriorityId;
  label: string;
  icon: string;
};

// ============================================================
// TASK PROPERTIES
// ============================================================

export type TaskTag = {
  id: string;
  label: string;
  color: string;
};

export type TaskAssignee = {
  id: string;
  name: string;
  avatar?: string;
  avatarUrl?: string;
};

export type TaskWorkstream = {
  id: string;
  label: string;
};

export type TaskSprintType = {
  id: string;
  label: string;
};

// ============================================================
// TASK GROUPING & FILTERS
// ============================================================

export type ProjectTaskGroup = {
  project: {
    id: string;
    name: string;
    status: string;
    [key: string]: any;
  };
  tasks: UITask[];
};

export type FilterCounts = {
  status?: Record<string, number>;
  languages?: Record<string, number>;
  members?: Record<string, number>;
  [key: string]: Record<string, number> | undefined;
};

export type FilterChip = {
  key: string;
  value: string;
};

// ============================================================
// VIEW OPTIONS
// ============================================================

export type TaskViewType = "list" | "table" | "kanban" | "board";

export type TaskSortOrder = "alphabetical" | "date";

export type TaskViewOptions = {
  viewType: TaskViewType;
  ordering: TaskSortOrder;
  showClosedProjects: boolean;
};

// ============================================================
// MODAL & CONTEXT TYPES
// ============================================================

export type CreateTaskContext = {
  brandId?: string;
  projectId?: string;
  status?: TaskStatusId;
  startDate?: Date;
};

export type TaskModalMode = "create" | "edit";

// ============================================================
// PICKER PROPS
// ============================================================

export interface GenericPickerProps<T> {
  trigger: React.ReactNode;
  items: T[];
  onSelect: (item: T) => void;
  selectedId?: string;
  placeholder?: string;
  renderItem: (item: T, isSelected: boolean) => React.ReactNode;
}

export interface DatePickerProps {
  date?: Date;
  onSelect: (date: Date | undefined) => void;
  trigger: React.ReactNode;
}

// ============================================================
// COMPONENT PROPS
// ============================================================

export interface TaskRowBaseProps {
  checked: boolean;
  title: string;
  onCheckedChange: (checked: boolean) => void;
  titleAriaLabel: string;
  titleSuffix?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
}

export interface TaskBoardCardProps {
  task?: UITask;
  variant?: "default" | "completed" | "empty";
  isDragging?: boolean;
  onClick?: () => void;
  onToggle?: () => void;
}

export interface TaskTableViewProps {
  tasks: UITask[];
  onToggleTask: (taskId: string) => void;
  onOpenTask: (task: UITask) => void;
}

export interface TaskKanbanViewProps {
  tasks: UITask[];
  onToggleTask: (taskId: string) => void;
  onOpenTask: (task: UITask) => void;
  onAddTask: (context?: CreateTaskContext) => void;
}

export interface TaskQuickCreateModalProps {
  open: boolean;
  onClose: () => void;
  context?: CreateTaskContext;
  onTaskCreated: (task: Partial<UITask>) => void;
  editingTask?: UITask;
  onTaskUpdated: (task: UITask) => void;
}
