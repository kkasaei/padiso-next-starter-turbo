import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Keyword Discovery | SearchFIT',
  description: 'Find new keyword opportunities automatically. AI discovers keywords you never knew existed.',
};

export default function KeywordDiscoveryPage() {
  return <ComingSoon title="Keyword Discovery" description="Uncover hidden keyword opportunities your competitors are missing." />;
}
