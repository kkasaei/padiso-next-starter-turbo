import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/auth/sign-in(.*)',
  '/auth/sign-up(.*)',
  '/api/webhooks/(.*)',
  '/pricing(.*)',
  '/blog(.*)',
  '/docs(.*)',
  '/about(.*)',
  '/contact(.*)',
  '/legal(.*)',
  '/privacy(.*)',
  '/terms(.*)',
  '/integrations(.*)',
  '/story(.*)',
  '/sales(.*)',
  '/waitlist(.*)',
  // Feature pages
  '/ai-tracking(.*)',
  '/content(.*)',
  '/analytics(.*)',
  '/backlinks(.*)',
  '/technical-audit(.*)',
  '/social-listening(.*)',
  // Public report pages
  '/report(.*)',
  // OG image
  '/og-image(.*)',
  // Public API routes for reports
  '/api/reports/(.*)',
  // tRPC routes (needed for public report page to query unlock status)
  '/api/trpc/(.*)',
  '/sitemap.xml(.*)',
  '/robots.txt(.*)',
  '/llms.txt(.*)',
  '/llms-full.txt(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
