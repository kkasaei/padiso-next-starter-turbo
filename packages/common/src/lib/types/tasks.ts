import type { Task as DBTask } from "@workspace/db/schema";

/**
 * UI-friendly task type that matches legacy ProjectTask interface
 * Maps database fields to UI expectations
 */
export type UITask = {
  id: string;
  brandId: string;
  projectId: string; // Alias for brandId for UI compatibility
  projectName?: string; // Brand name for display
  name: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority?: "no-priority" | "low" | "medium" | "high" | "urgent";
  tag?: string;
  assigneeId?: string;
  assignee?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  startDate?: Date;
  endDate?: Date;
  dueLabel?: string;
  dueTone?: "danger" | "warning" | "muted";
  createdAt: Date;
  updatedAt: Date;
  // Legacy fields for compatibility
  workstreamId?: string;
  workstreamName?: string;
};

/**
 * Convert database task to UI task
 * @param dbTask - Task from database
 * @param brandName - Optional brand name for display
 */
export function dbTaskToUI(dbTask: any, brandName?: string): UITask {
  return {
    id: dbTask.id,
    brandId: dbTask.brandId,
    projectId: dbTask.brandId, // Map brandId to projectId for UI
    projectName: brandName,
    name: dbTask.name,
    description: dbTask.description ?? undefined,
    status: dbTask.status,
    priority: dbTask.priority ?? undefined,
    tag: dbTask.tag ?? undefined,
    assigneeId: dbTask.assigneeId ?? undefined,
    // Handle date serialization from tRPC
    startDate: dbTask.startDate 
      ? (typeof dbTask.startDate === 'string' ? new Date(dbTask.startDate) : new Date(dbTask.startDate))
      : undefined,
    endDate: dbTask.endDate
      ? (typeof dbTask.endDate === 'string' ? new Date(dbTask.endDate) : new Date(dbTask.endDate))
      : undefined,
    dueLabel: dbTask.dueLabel ?? undefined,
    dueTone: (dbTask.dueTone as UITask["dueTone"]) ?? undefined,
    createdAt: typeof dbTask.createdAt === 'string' ? new Date(dbTask.createdAt) : dbTask.createdAt,
    updatedAt: typeof dbTask.updatedAt === 'string' ? new Date(dbTask.updatedAt) : dbTask.updatedAt,
    // TODO: Fetch assignee data from Clerk or user table
    assignee: undefined,
    workstreamId: undefined,
    workstreamName: undefined,
  };
}

/**
 * Convert UI task data to database format for creation
 */
export function uiTaskToCreateDB(uiTask: Partial<UITask> & { brandId: string; name: string; status: UITask["status"] }) {
  return {
    brandId: uiTask.brandId,
    name: uiTask.name,
    description: uiTask.description,
    status: uiTask.status,
    priority: uiTask.priority,
    tag: uiTask.tag,
    assigneeId: uiTask.assigneeId,
    startDate: uiTask.startDate?.toISOString(),
    endDate: uiTask.endDate?.toISOString(),
  };
}

/**
 * Convert UI task data to database format for updates
 */
export function uiTaskToUpdateDB(uiTask: Partial<UITask>) {
  return {
    name: uiTask.name,
    description: uiTask.description,
    status: uiTask.status,
    priority: uiTask.priority,
    tag: uiTask.tag,
    assigneeId: uiTask.assigneeId,
    startDate: uiTask.startDate?.toISOString(),
    endDate: uiTask.endDate?.toISOString(),
  };
}
