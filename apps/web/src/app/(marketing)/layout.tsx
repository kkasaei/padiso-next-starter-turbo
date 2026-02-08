import * as React from 'react';

import { Footer } from '@/components/marketing/Footer';
import { CookieBanner } from '@workspace/ui/components/fragments/CookieBanner';
import { Navbar } from '@/components/marketing/Navbar';
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/marketing/JsonLd';
// import GoogleAnalytics from '@/components/modules/analytics/analytics';

export default function MarketingLayout({
  children
}: React.PropsWithChildren): React.JSX.Element {
  return (
    <div>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <Navbar />
      {children}
      <Footer />
      <CookieBanner />
      {/* <GoogleAnalytics /> */}
    </div>
  );
}






