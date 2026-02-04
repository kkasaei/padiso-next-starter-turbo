import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Partners | SearchFIT',
  description: 'Partner with SearchFIT. Technology partners, agency partners, and integration partnerships.',
};

export default function PartnersPage() {
  return <ComingSoon title="Partners" description="Explore partnership opportunities with SearchFIT." />;
}
