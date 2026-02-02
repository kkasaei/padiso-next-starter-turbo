/**
 * Environment variable configuration for @workspace/trpc package
 * 
 * This module provides environment variables and utilities for tRPC configuration.
 */

// Vercel deployment URL (Server-side only)
export const VERCEL_URL = process.env.VERCEL_URL || '';

// Port configuration
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Environment object for easy access
export const env = {
  VERCEL_URL,
  PORT,
} as const;

/**
 * Get the base URL for tRPC requests
 * Works in both browser and server-side rendering
 */
export function getBaseUrl() {
  if (typeof window !== "undefined") {
    // Browser should use relative path
    return "";
  }
  if (VERCEL_URL) {
    // SSR should use vercel url
    return `https://${VERCEL_URL}`;
  }
  // dev SSR should use localhost
  return `http://localhost:${PORT}`;
}

/**
 * Validates that required environment variables are set
 * This is optional for tRPC - it will fall back to defaults
 */
export function validateEnv(): void {
  // No required variables - all have defaults
  // VERCEL_URL is automatically set in Vercel deployments
  // PORT defaults to 3000 for development
}

export default env;
