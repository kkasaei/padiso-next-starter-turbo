import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Generative Engine Optimization (GEO) | SearchFIT',
  description: 'Optimize for generative AI search. Ensure your brand appears in AI-generated responses and recommendations.',
};

export default function GenerativeEngineOptimizationPage() {
  return <ComingSoon title="Generative Engine Optimization" description="Get your brand featured in AI-generated search results." />;
}
