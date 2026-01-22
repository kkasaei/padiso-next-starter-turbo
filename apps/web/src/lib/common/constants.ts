/**
 * Status display configuration
 */
export const CONTENT_STATUS_CONFIG: Record<any, {
    label: string
    description: string
    color: string
    bgColor: string
    order: number
  }> = {
    IDEA: {
      label: 'Idea',
      description: 'Content idea captured',
      color: 'text-gray-400 dark:text-polar-500',
      bgColor: 'bg-gray-100 dark:bg-polar-800',
      order: 1,
    },
    OUTLINE: {
      label: 'Outline',
      description: 'Structure being planned',
      color: 'text-blue-500 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      order: 2,
    },
    DRAFT: {
      label: 'Draft',
      description: 'Content is being written',
      color: 'text-gray-400 dark:text-polar-500',
      bgColor: 'bg-gray-100 dark:bg-polar-800',
      order: 3,
    },
    REVIEW: {
      label: 'Review',
      description: 'Pending approval',
      color: 'text-yellow-500 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      order: 4,
    },
    APPROVED: {
      label: 'Approved',
      description: 'Ready to publish',
      color: 'text-green-500 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      order: 5,
    },
    PUBLISHED: {
      label: 'Published',
      description: 'Live on website',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      order: 6,
    },
    ARCHIVED: {
      label: 'Archived',
      description: 'No longer active',
      color: 'text-gray-400 dark:text-polar-500',
      bgColor: 'bg-gray-100 dark:bg-polar-800',
      order: 7,
    },
  }


export const ACTIVITY_TYPE_LABELS: Record<any, string> = {
PROJECT_CREATED: 'Project Created',
PROJECT_UPDATED: 'Project Updated',
PROJECT_DELETED: 'Project Deleted',
PROJECT_FAVORITED: 'Project Favorited',
PROJECT_UNFAVORITED: 'Project Unfavorited',
}