import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Resources | SearchFIT',
  description: 'SEO guides, ebooks, whitepapers, and educational resources to grow your organic traffic.',
};

export default function ResourcesPage() {
  return <ComingSoon title="Resources" description="Guides, ebooks, and resources to master SEO and AI visibility." />;
}
