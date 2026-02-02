"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { TRPCReactProvider } from "@/lib/trpc/react"
import { PostHogProvider } from "@/components/analytics/posthog-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
      <PostHogProvider>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          {children}
        </NextThemesProvider>
      </PostHogProvider>
    </TRPCReactProvider>
  )
}
