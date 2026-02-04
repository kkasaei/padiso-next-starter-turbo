import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'AI Blog Writer | SearchFIT',
  description: 'Generate SEO-optimized blog posts with AI. Create high-quality content that ranks and drives organic traffic.',
};

export default function AiBlogWriterPage() {
  return <ComingSoon title="AI Blog Writer" description="Create SEO-optimized blog content with the power of AI." />;
}
