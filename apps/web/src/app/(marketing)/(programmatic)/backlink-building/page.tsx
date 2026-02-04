import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Backlink Building Software | SearchFIT',
  description: 'Build high-quality backlinks at scale. Find link opportunities and track your backlink profile.',
};

export default function BacklinkBuildingPage() {
  return <ComingSoon title="Backlink Building Software" description="Discover and acquire high-quality backlinks to boost your authority." />;
}
