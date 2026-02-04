import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@workspace/ui/components/sonner"
import { Providers } from "@/components/layout/providers"
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css"


export const metadata: Metadata = {
  title: "SearchFIT",
  description: "SearchFit.ai - AI-powered search engine",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export const viewport: Viewport = {
  themeColor: "#3b82f6",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl="/auth/sign-in"
      signUpUrl="/auth/sign-up"
      afterSignInUrl="/workspace-setup"
      afterSignUpUrl="/workspace-setup"
      afterSignOutUrl="/"
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`font-sans antialiased`} suppressHydrationWarning>
          <Providers>
            {children}
            <Analytics />
            <Toaster position="top-right" richColors closeButton />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
