import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Keyword Clustering | SearchFIT',
  description: 'Group related keywords intelligently. Organize your keyword strategy with AI-powered clustering.',
};

export default function KeywordClusteringPage() {
  return <ComingSoon title="Keyword Clustering" description="Organize keywords into strategic clusters for better content planning." />;
}
