import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Answer Engine Optimization (AEO) | SearchFIT',
  description: 'Optimize your content for AI answer engines. Get featured in ChatGPT, Perplexity, and other AI-powered search tools.',
};

export default function AnswerEngineOptimizationPage() {
  return <ComingSoon title="Answer Engine Optimization" description="Optimize your content to appear in AI-powered answer engines." />;
}
