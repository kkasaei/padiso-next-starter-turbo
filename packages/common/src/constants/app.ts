/**
 * Application-wide constants
 */

export const APP_NAME = 'SearchFIT' as const

export const APP_DESCRIPTION = 'Track your brand presence in AI search, Generate content that ranks in AI search results, and Understand your performance through intelligent analytics' as const

export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  ARCHIVED: 'archived',
} as const

export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const

export const DATE_FORMAT = {
  SHORT: 'MMM d, yyyy',
  LONG: 'MMMM d, yyyy',
  FULL: 'MMMM d, yyyy h:mm a',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const
