import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Keyword Research Tool | SearchFIT',
  description: 'Discover high-value keywords for your content. AI-powered keyword research to find opportunities your competitors miss.',
};

export default function KeywordResearchPage() {
  return <ComingSoon title="Keyword Research Tool" description="Discover untapped keyword opportunities with AI-powered research." />;
}
