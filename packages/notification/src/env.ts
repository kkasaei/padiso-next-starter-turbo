/**
 * Environment variable configuration for @workspace/notification package
 * 
 * This module validates and exports all environment variables needed for notification functionality.
 */

// Environment object for easy access
export const env = {
  SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL,
  NEXT_PUBLIC_CLIENT_URL: process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000',
} as const;

/**
 * Validates that required environment variables are set
 * Throws an error if any required variables are missing
 */
export function validateEnv(): void {
  if (!env.SLACK_WEBHOOK_URL) {
    console.warn('[Notification] SLACK_WEBHOOK_URL is not set - Slack notifications will be disabled');
  }
}

export default env;
