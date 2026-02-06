'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { gtagAnalyticsProvider } from '@/lib/analytics';

/**
 * Sends page views to Google Analytics on route change.
 * Only runs on production domain (searchfit.ai); no-op otherwise.
 */
export function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    void gtagAnalyticsProvider.trackPageView(pathname);
  }, [pathname]);

  return null;
}
