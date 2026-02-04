import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Domain Authority | SearchFIT',
  description: 'Increase your domain authority. Track and improve your website authority metrics.',
};

export default function DomainAuthorityPage() {
  return <ComingSoon title="Domain Authority" description="Track and improve your domain authority for better rankings." />;
}
