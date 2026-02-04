import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'WooCommerce SEO | SearchFIT',
  description: 'Optimize your WooCommerce store for search engines. AI-powered SEO tools to drive more organic traffic and sales.',
};

export default function WooCommercePage() {
  return <ComingSoon title="WooCommerce SEO" description="AI-powered SEO optimization for WooCommerce stores." />;
}
