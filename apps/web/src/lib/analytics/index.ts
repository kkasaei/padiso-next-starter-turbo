/**
 * Analytics utilities for tracking custom events with PostHog
 * 
 * @example
 * ```tsx
 * import { trackEvent } from '@/lib/analytics'
 * 
 * // Track a simple event
 * trackEvent('button_clicked', { button_name: 'signup' })
 * 
 * // Track user actions
 * trackEvent('search_performed', { 
 *   query: 'AI tools',
 *   results_count: 42 
 * })
 * ```
 */

import posthog from "posthog-js"

/**
 * Track a custom event with PostHog
 * @param eventName - The name of the event to track
 * @param properties - Optional properties to attach to the event
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== "undefined" && posthog) {
    posthog.capture(eventName, properties)
  }
}

/**
 * Identify a user with PostHog
 * @param userId - Unique user identifier
 * @param properties - User properties to attach
 */
export function identifyUser(userId: string, properties?: Record<string, any>) {
  if (typeof window !== "undefined" && posthog) {
    posthog.identify(userId, properties)
  }
}

/**
 * Reset user identity (useful for logout)
 */
export function resetUser() {
  if (typeof window !== "undefined" && posthog) {
    posthog.reset()
  }
}

/**
 * Set user properties
 * @param properties - Properties to set on the user
 */
export function setUserProperties(properties: Record<string, any>) {
  if (typeof window !== "undefined" && posthog) {
    posthog.setPersonProperties(properties)
  }
}

/**
 * Track feature flag usage
 * @param flagName - Name of the feature flag
 * @returns boolean indicating if the feature is enabled
 */
export function isFeatureEnabled(flagName: string): boolean {
  if (typeof window !== "undefined" && posthog) {
    return posthog.isFeatureEnabled(flagName) ?? false
  }
  return false
}

/**
 * Get the value of a feature flag
 * @param flagName - Name of the feature flag
 * @returns The value of the feature flag
 */
export function getFeatureFlag(flagName: string): string | boolean | undefined {
  if (typeof window !== "undefined" && posthog) {
    return posthog.getFeatureFlag(flagName)
  }
  return undefined
}
