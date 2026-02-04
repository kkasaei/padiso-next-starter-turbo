import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Backlink Exchange | SearchFIT',
  description: 'Find quality backlink exchange opportunities. Build your link profile with relevant, high-authority sites.',
};

export default function BacklinkExchangePage() {
  return <ComingSoon title="Backlink Exchange" description="Connect with quality sites for mutually beneficial backlink exchanges." />;
}
