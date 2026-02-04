import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Developers & API | SearchFIT',
  description: 'SearchFIT API documentation for developers. Build integrations and automate your SEO workflows.',
};

export default function DevelopersPage() {
  return <ComingSoon title="Developers & API" description="Build powerful integrations with the SearchFIT API." />;
}
