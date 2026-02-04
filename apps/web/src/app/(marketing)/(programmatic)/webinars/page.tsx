import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Webinars | SearchFIT',
  description: 'Join our SEO webinars and learn from industry experts. Live sessions and on-demand recordings.',
};

export default function WebinarsPage() {
  return <ComingSoon title="Webinars" description="Learn SEO and AI visibility strategies from industry experts." />;
}
