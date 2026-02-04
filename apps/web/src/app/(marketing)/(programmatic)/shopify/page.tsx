import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Shopify SEO | SearchFIT',
  description: 'Grow your Shopify store with AI-powered SEO. Optimize product listings, improve rankings, and increase organic sales.',
};

export default function ShopifyPage() {
  return <ComingSoon title="Shopify SEO" description="Boost your Shopify store visibility with AI-powered SEO." />;
}
