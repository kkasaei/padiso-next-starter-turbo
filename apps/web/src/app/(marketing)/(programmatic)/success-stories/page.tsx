import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Success Stories | SearchFIT',
  description: 'See how businesses have grown their organic traffic and AI visibility with SearchFIT. Real results from real customers.',
};

export default function SuccessStoriesPage() {
  return <ComingSoon title="Success Stories" description="Discover how businesses are achieving remarkable results with SearchFIT." />;
}
