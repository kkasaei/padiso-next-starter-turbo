/**
 * Environment variable configuration for @workspace/email package
 * 
 * This module validates and exports all environment variables needed for email functionality.
 */

// Email provider configuration (Server-side only)
export const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@searchfit.ai';
export const EMAIL_RESEND_API_KEY = process.env.EMAIL_RESEND_API_KEY || '';
export const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO || '';

// Environment object for easy access
export const env = {
  EMAIL_FROM,
  EMAIL_RESEND_API_KEY,
  EMAIL_REPLY_TO,
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
    if (!EMAIL_RESEND_API_KEY) {
      missingVars.push('EMAIL_RESEND_API_KEY');
    }
  }

  // EMAIL_FROM has a default, but warn if not set
  if (!process.env.EMAIL_FROM) {
    console.warn('EMAIL_FROM not set, using default: noreply@searchfit.ai');
  }

  // EMAIL_REPLY_TO is optional
  if (!EMAIL_REPLY_TO) {
    console.warn('EMAIL_REPLY_TO not set, replies will not be handled');
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required email environment variables:\n  - ${missingVars.join('\n  - ')}`
    );
  }
}

export default env;
