import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'AI Content Marketing | SearchFIT',
  description: 'Transform your content marketing with AI. Create, optimize, and distribute content at scale.',
};

export default function AiContentMarketingPage() {
  return <ComingSoon title="AI Content Marketing" description="Supercharge your content marketing with AI-powered tools." />;
}
