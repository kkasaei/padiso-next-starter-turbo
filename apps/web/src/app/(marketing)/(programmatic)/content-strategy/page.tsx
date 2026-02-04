import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Content Strategy Platform | SearchFIT',
  description: 'Plan and execute your content strategy. AI-powered content planning for maximum SEO impact.',
};

export default function ContentStrategyPage() {
  return <ComingSoon title="Content Strategy Platform" description="Build a winning content strategy powered by data and AI." />;
}
