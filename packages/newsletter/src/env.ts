/**
 * Environment variable configuration for @workspace/newsletter package
 */

export const env = {
  EMAIL_RESEND_API_KEY: process.env.EMAIL_RESEND_API_KEY,
  NEWSLETTER_SEGMENT_ID: process.env.NEWSLETTER_SEGMENT_ID,
} as const;

export function validateEnv(): void {
  if (!env.EMAIL_RESEND_API_KEY) {
    console.warn('[Newsletter] EMAIL_RESEND_API_KEY is not set - Newsletter functionality will be disabled');
  }
  if (!env.NEWSLETTER_SEGMENT_ID) {
    console.warn('[Newsletter] NEWSLETTER_SEGMENT_ID is not set - Newsletter functionality will be disabled');
  }
}
