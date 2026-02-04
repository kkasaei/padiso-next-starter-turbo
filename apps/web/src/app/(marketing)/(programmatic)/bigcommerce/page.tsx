import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'BigCommerce SEO | SearchFIT',
  description: 'Grow your BigCommerce store with AI-powered SEO. Optimize product pages and increase organic visibility.',
};

export default function BigCommercePage() {
  return <ComingSoon title="BigCommerce SEO" description="AI-powered SEO tools for BigCommerce stores." />;
}
