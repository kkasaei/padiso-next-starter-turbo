import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Ecommerce SEO | SearchFIT',
  description: 'Boost your online store visibility with AI-powered ecommerce SEO. Optimize product pages, category pages, and drive more organic sales.',
};

export default function EcommercePage() {
  return <ComingSoon title="Ecommerce SEO" description="Drive more organic sales with AI-powered ecommerce optimization." />;
}
