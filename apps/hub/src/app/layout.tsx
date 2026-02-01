import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import { APP_NAME } from "@workspace/common/constants"

export const metadata: Metadata = {
  title: `${APP_NAME} Hub`,
  description: "The UI Library of SearchFIT",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
