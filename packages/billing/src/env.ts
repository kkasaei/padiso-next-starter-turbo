/**
 * Environment variable configuration for @workspace/billing package
 * 
 * This module validates and exports all environment variables needed for billing functionality.
 * 
 * New 2-tier pricing model:
 * - Growth Plan: For growing brands ready to take action
 * - Custom Plan: For agencies and large brands with custom needs
 */

// Stripe API Keys (Server-side only)
export const STRIPE_SECRET_KEY = process.env.BILLING_STRIPE_SECRET_KEY || '';
export const STRIPE_WEBHOOK_SECRET = process.env.BILLING_STRIPE_WEBHOOK_SECRET || '';

// Stripe Price IDs (Public - safe to expose to client)
// Growth Plan
export const NEXT_PUBLIC_BILLING_PRICE_GROWTH_PLAN_MONTHLY_ID = 
  process.env.NEXT_PUBLIC_BILLING_PRICE_GRWOTH_PLAN_MONTHLY_ID || '';
export const NEXT_PUBLIC_BILLING_PRICE_GROWTH_PLAN_YEARLY_ID = 
  process.env.NEXT_PUBLIC_BILLING_PRICE_GRWOTH_PLAN_YEARLY_ID || '';

// Environment object (compatible with the existing usage pattern)
export const env = {
  // Server-side keys
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
  
  // Public price IDs - Growth Plan
  NEXT_PUBLIC_BILLING_PRICE_GROWTH_PLAN_MONTHLY_ID,
  NEXT_PUBLIC_BILLING_PRICE_GROWTH_PLAN_YEARLY_ID,
} as const;

/**
 * Validates that required environment variables are set
 * Throws an error if any required variables are missing
 */
export function validateEnv(): void {
  const missingVars: string[] = [];

  // Check server-side required vars (only validate in server context)
  if (typeof window === 'undefined') {
    if (!STRIPE_SECRET_KEY) missingVars.push('STRIPE_SECRET_KEY');
    if (!STRIPE_WEBHOOK_SECRET) missingVars.push('STRIPE_WEBHOOK_SECRET');
  }

  // Price IDs are optional - they'll fall back to placeholder values if not set
  // This allows the app to run in development without all price IDs configured

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables:\n  - ${missingVars.join('\n  - ')}`
    );
  }
}

export default env;
