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


/**
 * Constants for report page configuration
 */

export const REPORT_CONFIG = {
  /** Scroll depth threshold (in pixels) to trigger sticky bottom bar */
  STICKY_BAR_TRIGGER_DEPTH: 500,

  /** Number of visible content ideas in limited view */
  VISIBLE_CONTENT_IDEAS: 2,

  /** Confetti animation particle count */
  CONFETTI_PARTICLE_COUNT: 200,

  /** Confetti gravity value */
  CONFETTI_GRAVITY: 0.3,

  /** Confetti color palette */
  CONFETTI_COLORS: ['#3b82f6', '#a855f7', '#ec4899', '#fbbf24', '#22c55e'],
} as const;

/**
 * Premium sections that require unlock
 */
export const PREMIUM_SECTIONS = [
  'Full Competitor Analysis',
  'Strategic Insights & Recommendations',
  'Brand Narrative Themes',
  'AI-Powered Content Ideas'
] as const;

/**
 * Animation configuration for motion components
 */
export const ANIMATIONS = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 }
  },
  scaleRotate: {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
      delay: 0.1
    }
  },
  blob: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 1 }
  }
} as const;
