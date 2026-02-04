import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'SEO Article Generator | SearchFIT',
  description: 'Generate SEO-optimized articles with AI. Create high-quality content that ranks and converts.',
};

export default function ArticleGeneratorPage() {
  return <ComingSoon title="SEO Article Generator" description="Generate ranking-ready articles with AI in minutes." />;
}
