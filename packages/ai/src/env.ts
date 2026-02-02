/**
 * Environment variable configuration for @workspace/ai package
 * 
 * This module validates and exports all environment variables needed for AI functionality.
 */

// AI Gateway Configuration (Server-side only)
export const AI_GATEWAY_API_KEY = process.env.AI_GATEWAY_API_KEY || '';
export const AI_GATEWAY_BASE_URL = process.env.AI_GATEWAY_BASE_URL || '';

// Node environment
export const NODE_ENV = process.env.NODE_ENV || 'development';

// Environment object for easy access
export const env = {
  AI_GATEWAY_API_KEY,
  AI_GATEWAY_BASE_URL,
  NODE_ENV,
} as const;

/**
 * Validates that required environment variables are set
 * Throws an error if any required variables are missing
 * 
 * Note: This validation only runs in server context (where window is undefined)
 */
export function validateEnv(): void {
  const missingVars: string[] = [];

  // Check server-side required vars (only validate in server context)
  if (typeof window === 'undefined') {
    if (!AI_GATEWAY_API_KEY) {
      missingVars.push('AI_GATEWAY_API_KEY');
    }
  }

  // AI_GATEWAY_BASE_URL is optional - uses default if not set
  if (!AI_GATEWAY_BASE_URL) {
    console.warn('AI_GATEWAY_BASE_URL not set, using AI SDK defaults');
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required AI environment variables:\n  - ${missingVars.join('\n  - ')}`
    );
  }
}

export default env;
