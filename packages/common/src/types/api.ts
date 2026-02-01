/**
 * API-related types
 */

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  message: string
  code?: string
  statusCode?: number
  details?: unknown
}

export type SortOrder = 'asc' | 'desc'

export interface SortParams {
  field: string
  order: SortOrder
}

export interface PaginationParams {
  page?: number
  pageSize?: number
}

export interface FilterParams {
  search?: string
  status?: string
  [key: string]: unknown
}

export interface ListParams extends PaginationParams {
  sort?: SortParams
  filters?: FilterParams
}
