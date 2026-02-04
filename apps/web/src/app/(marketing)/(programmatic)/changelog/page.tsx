import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Changelog | SearchFIT',
  description: 'Stay up to date with the latest SearchFIT features, improvements, and bug fixes.',
};

export default function ChangelogPage() {
  return <ComingSoon title="Changelog" description="Track all the latest updates and improvements to SearchFIT." />;
}
