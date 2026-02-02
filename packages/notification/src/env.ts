/**
 * Environment variable configuration for @workspace/notification package
 * 
 * This module validates and exports all environment variables needed for notification functionality.
 */

// Notification configuration (placeholder for future implementation)
// Add your notification service environment variables here when implemented
// Examples:
// export const NOTIFICATION_SERVICE_API_KEY = process.env.NOTIFICATION_SERVICE_API_KEY || '';
// export const NOTIFICATION_WEBHOOK_URL = process.env.NOTIFICATION_WEBHOOK_URL || '';

// Environment object for easy access
export const env = {
  // Add environment variables here when needed
} as const;

/**
 * Validates that required environment variables are set
 * Throws an error if any required variables are missing
 */
export function validateEnv(): void {
  // No required variables yet - placeholder for future implementation
  // Add validation logic when notification service is implemented
}

export default env;
