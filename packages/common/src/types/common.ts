/**
 * Common shared types
 */

export type Status = 'active' | 'inactive' | 'pending' | 'archived'

export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export interface WithId {
  id: string
}

export interface WithTimestamps {
  createdAt: Date
  updatedAt: Date
}

export interface WithStatus {
  status: Status
}

export interface BaseEntity extends WithId, WithTimestamps {
  // Base entity fields that most models share
}

/**
 * Utility type to make all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/**
 * Utility type to make specific keys required
 */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Utility type to make specific keys optional
 */
export type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
