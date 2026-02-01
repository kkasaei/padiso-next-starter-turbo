/**
 * Task Constants
 * 
 * Centralized constants for the task management system.
 * Includes status options, priorities, tags, assignees, etc.
 */

import type { TaskStatus, TaskPriority, TaskTag, TaskAssignee, TaskWorkstream, TaskSprintType } from "./TaskTypes";

// ============================================================
// TASK STATUS OPTIONS
// ============================================================

export const TASK_STATUSES: TaskStatus[] = [
  { id: "backlog", label: "Backlog", dotClass: "bg-orange-600" },
  { id: "todo", label: "Todo", dotClass: "bg-neutral-300" },
  { id: "in-progress", label: "In Progress", dotClass: "bg-yellow-400" },
  { id: "done", label: "Done", dotClass: "bg-green-600" },
];

export const TASK_STATUS_CONFIG: Record<string, { label: string; dot: string }> = {
  done: { label: "Done", dot: "bg-teal-600" },
  "in-progress": { label: "In Progress", dot: "bg-blue-600" },
  todo: { label: "To Do", dot: "bg-gray-400" },
};

// ============================================================
// TASK PRIORITY OPTIONS
// ============================================================

export const TASK_PRIORITIES: TaskPriority[] = [
  { id: "no-priority", label: "No Priority", icon: "BarChart" },
  { id: "urgent", label: "Urgent", icon: "AlertCircle" },
  { id: "high", label: "High", icon: "ArrowUp" },
  { id: "medium", label: "Medium", icon: "ArrowRight" },
  { id: "low", label: "Low", icon: "ArrowDown" },
];

export const TASK_PRIORITY_CONFIG: Record<string, { label: string; className: string }> = {
  urgent: { label: "Urgent", className: "text-red-600" },
  high: { label: "High", className: "text-orange-600" },
  medium: { label: "Medium", className: "text-blue-600" },
  low: { label: "Low", className: "text-gray-600" },
  "no-priority": { label: "No Priority", className: "text-gray-400" },
};

// ============================================================
// TASK TAGS
// ============================================================

export const TASK_TAGS: TaskTag[] = [
  { id: "bug", label: "Bug", color: "var(--chart-5)" },
  { id: "feature", label: "Feature", color: "var(--chart-2)" },
  { id: "enhancement", label: "Enhancement", color: "var(--chart-4)" },
  { id: "docs", label: "Documentation", color: "var(--chart-3)" },
  { id: "design", label: "Design", color: "var(--chart-1)" },
  { id: "testing", label: "Testing", color: "var(--chart-6)" },
];

// ============================================================
// TASK ASSIGNEES (Mock - TODO: Fetch from Clerk/DB)
// ============================================================

export const MOCK_ASSIGNEES: TaskAssignee[] = [
  { id: "1", name: "Andrew S", avatar: "/placeholder-user.jpg" },
  { id: "2", name: "Sarah Connor", avatar: "" },
  { id: "3", name: "Alex Murphy", avatar: "" },
];

// ============================================================
// WORKSTREAMS
// ============================================================

export const TASK_WORKSTREAMS: TaskWorkstream[] = [
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "design", label: "Design" },
  { id: "qa", label: "QA" },
  { id: "devops", label: "DevOps" },
  { id: "marketing", label: "Marketing" },
];

// ============================================================
// SPRINT TYPES
// ============================================================

export const TASK_SPRINT_TYPES: TaskSprintType[] = [
  { id: "design", label: "Design Sprint" },
  { id: "dev", label: "Dev Sprint" },
  { id: "planning", label: "Planning Sprint" },
  { id: "review", label: "Review Sprint" },
];

// ============================================================
// KANBAN COLUMNS
// ============================================================

export const KANBAN_COLUMNS = [
  { id: "todo", label: "To Do", color: "bg-gray-100" },
  { id: "in-progress", label: "In Progress", color: "bg-blue-100" },
  { id: "done", label: "Done", color: "bg-teal-100" },
] as const;

// ============================================================
// FILTER CATEGORIES
// ============================================================

export const FILTER_CATEGORIES = [
  { id: "status", label: "Status" },
  { id: "priority", label: "Priority" },
  { id: "assignee", label: "Assignee" },
  { id: "tag", label: "Tag" },
] as const;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get status configuration by ID
 */
export function getTaskStatusConfig(status: string) {
  return TASK_STATUS_CONFIG[status] || { label: status, dot: "bg-gray-400" };
}

/**
 * Get priority configuration by ID
 */
export function getTaskPriorityConfig(priority?: string) {
  if (!priority) return TASK_PRIORITY_CONFIG["no-priority"];
  return TASK_PRIORITY_CONFIG[priority] || TASK_PRIORITY_CONFIG["no-priority"];
}

/**
 * Get tag by ID
 */
export function getTaskTag(tagId: string) {
  return TASK_TAGS.find(t => t.id === tagId);
}

/**
 * Get workstream by ID
 */
export function getTaskWorkstream(workstreamId: string) {
  return TASK_WORKSTREAMS.find(w => w.id === workstreamId);
}
