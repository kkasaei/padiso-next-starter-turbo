/**
 * Environment variables for @workspace/integrations package
 *
 * This package uses its own env configuration separate from apps.
 * All integration-related environment variables should be defined here.
 */

import { z } from 'zod';

// Define the schema for environment variables
const envSchema = z.object({
  // Node environment
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  // Google OAuth Configuration
  INTEGRATION_GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  INTEGRATION_GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),

  // Encryption Key for sensitive data (OAuth tokens, API keys)
  INTEGRATION_ENCRYPTION_KEY: z
    .string()
    .length(64, 'INTEGRATION_ENCRYPTION_KEY must be a 32-byte hex string (64 characters)')
    .regex(/^[0-9a-f]+$/i, 'INTEGRATION_ENCRYPTION_KEY must be a valid hex string')
    .optional(),

  // Client URL for OAuth callbacks
  NEXT_PUBLIC_CLIENT_URL: z.string().url().optional(),

  // Add other integration-specific environment variables here
  // INTEGRATION_SLACK_CLIENT_ID: z.string().optional(),
  // INTEGRATION_SLACK_CLIENT_SECRET: z.string().optional(),
});

// Type for the environment variables
type Env = z.infer<typeof envSchema>;

/**
 * Validate and parse environment variables
 * This runs at import time to fail fast if env vars are misconfigured
 */
function createEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      '❌ Invalid environment variables in @workspace/integrations:',
      parsed.error.flatten().fieldErrors
    );
    throw new Error('Invalid environment variables in @workspace/integrations');
  }

  return parsed.data;
}

/**
 * Validated and type-safe environment variables
 */
export const env = createEnv();

/**
 * Helper to check if an environment variable is set
 */
export function hasEnv(key: keyof Env): boolean {
  return env[key] !== undefined && env[key] !== '';
}

/**
 * Helper to require an environment variable (throws if not set)
 */
export function requireEnv(key: keyof Env, message?: string): string {
  const value = env[key];
  if (!value) {
    throw new Error(
      message || `Required environment variable ${key} is not set in @workspace/integrations`
    );
  }
  return value as string;
}
