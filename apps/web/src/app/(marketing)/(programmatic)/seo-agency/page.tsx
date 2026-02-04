import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'SEO Agency Directory | SearchFIT',
  description: 'Find SEO services in your city. SearchFIT provides AI-powered SEO tools for businesses worldwide.',
};

export default function SeoAgencyPage() {
  return <ComingSoon title="SEO Agency Directory" description="Find AI-powered SEO services in your city." />;
}
