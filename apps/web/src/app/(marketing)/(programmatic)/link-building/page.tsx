import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Link Building | SearchFIT',
  description: 'Strategic link building for SEO success. Build authority with quality backlinks.',
};

export default function LinkBuildingPage() {
  return <ComingSoon title="Link Building" description="Build authority and rankings with strategic link acquisition." />;
}
