'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { env } from '@/env';
import { isProductionDomain } from '@/lib/analytics-domain';

/**
 * Loads Google Analytics via next/script and tracks page views on route change.
 * Only activates on the production domain (searchfit.ai); renders nothing otherwise.
 */
export function GoogleAnalytics() {
  const pathname = usePathname();
  const measurementId = env.NEXT_PUBLIC_ANALYTICS_GA_MEASUREMENT_ID;
  const [isActive, setIsActive] = useState(false);
  const prevPathnameRef = useRef<string | null>(null);

  // Activate only on production domain (client-side check avoids hydration mismatch)
  useEffect(() => {
    if (measurementId && isProductionDomain()) {
      setIsActive(true);
    }
  }, [measurementId]);

  // Track client-side route changes
  useEffect(() => {
    if (!isActive || !pathname || !measurementId) return;
    if (env.NEXT_PUBLIC_ANALYTICS_GA_DISABLE_PAGE_VIEWS_TRACKING) return;

    // Skip the very first call — the initial page view is sent automatically
    // by gtag('config', ...) when the inline script runs
    if (prevPathnameRef.current === null) {
      prevPathnameRef.current = pathname;
      return;
    }

    if (prevPathnameRef.current === pathname) return;
    prevPathnameRef.current = pathname;

    window.gtag?.('event', 'page_view', {
      page_location: new URL(pathname, window.location.href).href,
      page_path: pathname,
    });
  }, [pathname, isActive, measurementId]);

  if (!isActive || !measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
