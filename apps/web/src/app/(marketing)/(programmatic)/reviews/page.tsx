import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Customer Reviews | SearchFIT',
  description: 'Read what customers say about SearchFIT. Real reviews from real users.',
};

export default function ReviewsPage() {
  return <ComingSoon title="Customer Reviews" description="See what our customers have to say about SearchFIT." />;
}
