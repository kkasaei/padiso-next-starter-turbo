import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Whitelabel Solution | SearchFIT',
  description: 'Offer SearchFIT under your own brand. Whitelabel SEO and AI visibility platform for agencies and enterprises.',
};

export default function WhitelabelPage() {
  return <ComingSoon title="Whitelabel Solution" description="Offer our powerful SEO platform under your own brand." />;
}
