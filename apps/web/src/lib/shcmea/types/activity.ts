// ============================================================
// ACTIVITY TYPES & DTOs
// ============================================================

// Activity type enum (mirrors database enum)
export type ActivityType =
  | 'PROJECT_CREATED'
  | 'PROJECT_UPDATED'
  | 'PROJECT_DELETED'
  | 'PROJECT_FAVORITED'
  | 'PROJECT_UNFAVORITED'

// ============================================================
// ACTIVITY DTO TYPE
// ============================================================
export interface ProjectActivityDto {
  id: string
  type: ActivityType
  performedByUserId: string | null
  metadata: Record<string, string> | null
  createdAt: Date
}

// ============================================================
// ACTIVITY TYPE LABELS
// ============================================================
export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  PROJECT_CREATED: 'Project Created',
  PROJECT_UPDATED: 'Project Updated',
  PROJECT_DELETED: 'Project Deleted',
  PROJECT_FAVORITED: 'Project Favorited',
  PROJECT_UNFAVORITED: 'Project Unfavorited',
}

