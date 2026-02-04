import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'AI SEO Agent | SearchFIT',
  description: 'Automate your SEO with AI. Our intelligent SEO agent handles keyword research, content optimization, and technical fixes.',
};

export default function AiSeoAgentPage() {
  return <ComingSoon title="AI SEO Agent" description="Let AI handle your SEO tasks automatically and intelligently." />;
}
