/**
 * Example Component: PostHog Analytics Usage
 * 
 * This file demonstrates various ways to use PostHog analytics in your components.
 * You can copy these patterns into your own components.
 */

'use client'

import { usePostHog } from 'posthog-js/react'
import { trackEvent, isFeatureEnabled } from '@/lib/analytics'
import { useEffect } from 'react'

export function ExampleAnalyticsComponent() {
  const posthog = usePostHog()

  // Track component mount
  useEffect(() => {
    trackEvent('component_viewed', {
      component_name: 'ExampleAnalyticsComponent'
    })
  }, [])

  // Example 1: Track button clicks
  const handleButtonClick = () => {
    trackEvent('button_clicked', {
      button_id: 'example_button',
      timestamp: Date.now()
    })
  }

  // Example 2: Track form submissions
  const handleFormSubmit = (formData: { email: string; name: string }) => {
    trackEvent('form_submitted', {
      form_type: 'contact',
      has_email: !!formData.email,
      has_name: !!formData.name
    })
  }

  // Example 3: Track errors
  const handleError = (error: Error) => {
    trackEvent('error_occurred', {
      error_message: error.message,
      error_stack: error.stack,
      page: window.location.pathname
    })
  }

  // Example 4: Use feature flags
  const showNewFeature = isFeatureEnabled('new_dashboard_redesign')

  // Example 5: Track with timing
  const handleSearch = async (query: string) => {
    const startTime = Date.now()
    
    try {
      // Perform search...
      const results = await fetch(`/api/search?q=${query}`)
      const data = await results.json()
      
      trackEvent('search_completed', {
        query,
        results_count: data.length,
        duration_ms: Date.now() - startTime,
        success: true
      })
    } catch (error) {
      trackEvent('search_failed', {
        query,
        duration_ms: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Example 6: Track user interactions with detailed context
  const handleProductView = (productId: string, productName: string, price: number) => {
    trackEvent('product_viewed', {
      product_id: productId,
      product_name: productName,
      price,
      currency: 'USD',
      page_path: window.location.pathname,
      referrer: document.referrer
    })
  }

  // Example 7: Using PostHog hook directly for more control
  const handleAdvancedTracking = () => {
    posthog.capture('custom_complex_event', {
      custom_property: 'value',
      timestamp: new Date().toISOString()
    })

    // You can also use PostHog for A/B testing
    const variant = posthog.getFeatureFlag('experiment_variant')
    console.log('User is in variant:', variant)
  }

  return (
    <div>
      <h2>PostHog Analytics Examples</h2>
      
      <button onClick={handleButtonClick}>
        Track Button Click
      </button>

      {showNewFeature && (
        <div>
          <p>This is a new feature controlled by a feature flag!</p>
        </div>
      )}

      <button onClick={handleAdvancedTracking}>
        Advanced Tracking Example
      </button>
    </div>
  )
}

/**
 * Example: Track page performance
 */
export function usePagePerformance() {
  const posthog = usePostHog()

  useEffect(() => {
    // Track Core Web Vitals
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            posthog.capture('page_performance', {
              load_time: entry.duration,
              page: window.location.pathname
            })
          }
        }
      })

      observer.observe({ entryTypes: ['navigation'] })

      return () => observer.disconnect()
    }
  }, [posthog])
}

/**
 * Example: Track scroll depth
 */
export function useScrollTracking() {
  useEffect(() => {
    let maxScroll = 0

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent

        // Track at 25%, 50%, 75%, 100% milestones
        if (maxScroll >= 25 && maxScroll % 25 === 0) {
          trackEvent('scroll_depth', {
            percent: maxScroll,
            page: window.location.pathname
          })
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
}
