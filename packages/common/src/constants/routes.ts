/**
 * Application routes and API endpoints
 */

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  BRANDS: '/dashboard/brands',
  TASKS: '/dashboard/tasks',
  AUTH: {
    SIGN_IN: '/auth/sign-in',
    SIGN_UP: '/auth/sign-up',
    SIGN_OUT: '/auth/sign-out',
  },
} as const

export const API_ROUTES = {
  BRANDS: '/api/brands',
  TASKS: '/api/tasks',
  WORKSPACES: '/api/workspaces',
  FILES: '/api/files',
  PROMPTS: '/api/prompts',
} as const
