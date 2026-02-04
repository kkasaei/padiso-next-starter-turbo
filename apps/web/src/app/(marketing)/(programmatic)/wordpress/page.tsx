import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'WordPress SEO | SearchFIT',
  description: 'Supercharge your WordPress SEO with AI. Optimize content, track rankings, and outperform your competition.',
};

export default function WordPressPage() {
  return <ComingSoon title="WordPress SEO" description="AI-powered SEO tools designed for WordPress websites." />;
}
