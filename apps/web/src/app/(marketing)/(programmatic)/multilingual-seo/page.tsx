import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Multilingual SEO | SearchFIT',
  description: 'Optimize your content for multiple languages. Reach global audiences with multilingual SEO strategies.',
};

export default function MultilingualSeoPage() {
  return <ComingSoon title="Multilingual SEO" description="Expand your reach with SEO content in multiple languages." />;
}
