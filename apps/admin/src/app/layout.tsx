import type React from "react"
import type { Metadata, Viewport } from "next"
import { Toaster } from "@workspace/ui/components/sonner"
import { Providers } from "@/components/layout/providers"
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css"

export const metadata: Metadata = {
  title: "SearchFIT Admin",
  description: "SearchFIT Administration Dashboard",
}

export const viewport: Viewport = {
  themeColor: "#3b82f6",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ""
  
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl="/auth/sign-in"
      signUpUrl="/auth/sign-up"
      afterSignOutUrl="/"
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`font-sans antialiased`} suppressHydrationWarning>
          <Providers>
            {children}
            <Toaster richColors closeButton />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
