import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Affiliate Program | SearchFIT',
  description: 'Join the SearchFIT affiliate program. Earn commissions by referring customers to our AI-powered SEO platform.',
};

export default function AffiliatePage() {
  return <ComingSoon title="Affiliate Program" description="Partner with us and earn commissions for every customer you refer." />;
}
