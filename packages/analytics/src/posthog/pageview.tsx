"use client"
import { useEffect } from "react"
import { usePostHog } from "posthog-js/react"

export function PostHogPageView({ pathname, searchParams }: { pathname: string, searchParams: string }) {
  const posthog = usePostHog()

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      posthog.capture("$pageview", {
        $current_url: url,
      })
    }
  }, [pathname, searchParams, posthog])

  return null
}
