/**
 * Feature Flags Configuration
 * 
 * Toggle features on/off by changing the boolean values.
 * Set to `true` to show "Coming Soon" state, `false` to show the actual feature.
 */

export const FEATURE_FLAGS = {
  // Brand pages - Coming Soon toggles
  ANALYTICS_COMING_SOON: true,
  BACKLINKS_COMING_SOON: true,
  TECHNICAL_AUDIT_COMING_SOON: true,
  
  // AI Tracking - hide Keywords & Competitors tabs
  AI_TRACKING_TABS_COMING_SOON: true,
} as const

export type FeatureFlag = keyof typeof FEATURE_FLAGS
