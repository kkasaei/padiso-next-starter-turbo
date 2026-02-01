import * as React from 'react';

import { Footer } from '@/components/marketing/footer';
import { CookieBanner } from '@/components/shared/fragments/cookie-banner';
import { Navbar } from '@/components/marketing/navbar';
// import GoogleAnalytics from '@/components/modules/analytics/analytics';

export default function MarketingLayout({
  children
}: React.PropsWithChildren): React.JSX.Element {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
      <CookieBanner />
      {/* <GoogleAnalytics /> */}
    </div>
  );
}






