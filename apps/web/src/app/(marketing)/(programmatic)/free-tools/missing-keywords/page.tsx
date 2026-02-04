import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Missing Keywords Tool | SearchFIT',
  description: 'Find missing keywords in your content. Free SEO tool to identify keyword gaps and improve your search rankings.',
};

export default function MissingKeywordsPage() {
  return <ComingSoon title="Missing Keywords Tool" description="Find the keywords your content is missing to improve your search rankings." />;
}
