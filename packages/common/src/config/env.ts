/**
 * Environment configuration helpers
 */

export function getEnv(key: string, fallback?: string): string {
  const value = process.env[key]
  if (!value && fallback === undefined) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value || fallback || ''
}

export function getEnvBoolean(key: string, fallback = false): boolean {
  const value = process.env[key]
  if (!value) return fallback
  return value.toLowerCase() === 'true' || value === '1'
}

export function getEnvNumber(key: string, fallback?: number): number {
  const value = process.env[key]
  if (!value && fallback === undefined) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  const parsed = parseInt(value || '', 10)
  return isNaN(parsed) ? (fallback ?? 0) : parsed
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

export function isTest(): boolean {
  return process.env.NODE_ENV === 'test'
}
