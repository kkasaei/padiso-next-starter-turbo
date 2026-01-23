/**
 * Type definitions for Organization.config JSON field
 * Stores various configuration and onboarding data
 */

export interface DashboardOnboardingConfig {
  role: string | null;
  businessType: string | null;
  teamSize: string | null;
  primaryGoal: string[];
  helpNeeded: string[];
  findSource: string | null;
  supportChannels: string[];
  completedAt: string | null;
  lastSkippedAt: string | null;
  skipped?: boolean;
}

export interface OrganizationConfig {
  onboarding?: DashboardOnboardingConfig;
  // Add other config properties here as they are created
  [key: string]: unknown;
}

