import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Autoblog | SearchFIT',
  description: 'Automated blog content generation and publishing. Keep your blog fresh with AI-generated SEO content.',
};

export default function AutoblogPage() {
  return <ComingSoon title="Autoblog" description="Automatically generate and publish SEO-optimized blog content." />;
}
