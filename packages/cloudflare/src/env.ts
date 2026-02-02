/**
 * Environment variable configuration for @workspace/cloudflare package
 * 
 * This module validates and exports all environment variables needed for Cloudflare R2 storage.
 */

// Cloudflare R2 API credentials (Server-side only)
export const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
export const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
export const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';

// Cloudflare R2 bucket configuration
export const R2_BUCKET = process.env.R2_BUCKET || 'cdn-searchfit-ai';

// CDN URL (Public - safe to expose to client)
export const NEXT_PUBLIC_CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || 'https://cdn.searchfit.ai';

// Environment object for easy access
export const env = {
  // Server-side credentials
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  
  // Configuration
  R2_BUCKET,
  NEXT_PUBLIC_CDN_URL,
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
    if (!R2_ACCOUNT_ID) missingVars.push('R2_ACCOUNT_ID');
    if (!R2_ACCESS_KEY_ID) missingVars.push('R2_ACCESS_KEY_ID');
    if (!R2_SECRET_ACCESS_KEY) missingVars.push('R2_SECRET_ACCESS_KEY');
  }

  // Bucket and CDN URL have defaults, but you might want to warn if not set
  if (!R2_BUCKET) {
    console.warn('R2_BUCKET not set, using default: cdn-searchfit-ai');
  }
  
  if (!NEXT_PUBLIC_CDN_URL) {
    console.warn('NEXT_PUBLIC_CDN_URL not set, using default: https://cdn.searchfit.ai');
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Cloudflare R2 environment variables:\n  - ${missingVars.join('\n  - ')}`
    );
  }
}

export default env;
