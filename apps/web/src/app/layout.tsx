import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@workspace/ui/components/sonner"
import { Providers } from "@/components/layout/providers"
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css"
import { env } from "@/env"
import { APP_NAME, APP_DESCRIPTION, APP_TAGLINE } from "@workspace/common/constants"

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}


export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_CLIENT_URL),
  title: `${APP_NAME} - ${APP_TAGLINE}`,
  description: APP_DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: APP_NAME,
    title: `${APP_NAME} - ${APP_TAGLINE}`,
    description: APP_DESCRIPTION,
    url: env.NEXT_PUBLIC_CLIENT_URL,
    images: {
      url: `${env.NEXT_PUBLIC_CLIENT_URL}/og-image`,
      width: 1200,
      height: 630,
      alt: `${APP_NAME} - ${APP_TAGLINE}`
    }
  },
  robots: {
    index: true,
    follow: true
  }
};



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
