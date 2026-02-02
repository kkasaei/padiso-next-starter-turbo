/**
 * Environment variable configuration for @workspace/db package
 * 
 * This module validates and exports all environment variables needed for database functionality.
 */

// Database Configuration (Server-side only)
export const DATABASE_URL = process.env.DATABASE_URL || '';

// Clerk Organization ID (for seed scripts)
export const CLERK_ORG_ID = process.env.CLERK_ORG_ID || '';

// Environment object for easy access
export const env = {
  DATABASE_URL,
  CLERK_ORG_ID,
} as const;

/**
 * Helper to get an environment variable or throw an error
 * Used by db.ts for DATABASE_URL
 */
export function getEnvVariable(name: string): string {
  const value = process.env[name];
  if (value == null) {
    throw new Error(`environment variable ${name} not found`);
  }
  return value;
}

/**
 * Validates that required environment variables are set
 * Throws an error if any required variables are missing
 */
export function validateEnv(): void {
  const missingVars: string[] = [];

  if (!DATABASE_URL) {
    missingVars.push('DATABASE_URL');
  }

  // CLERK_ORG_ID is optional (only needed for seeding)
  if (!CLERK_ORG_ID) {
    console.warn('CLERK_ORG_ID not set, some seed scripts may use defaults');
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required database environment variables:\n  - ${missingVars.join('\n  - ')}`
    );
  }
}

export default env;
