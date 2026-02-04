import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'ROI Calculator | SearchFIT',
  description: 'Calculate the potential ROI of using SearchFIT for your SEO and AI visibility efforts.',
};

export default function RoiCalculatorPage() {
  return <ComingSoon title="ROI Calculator" description="See how much value SearchFIT can bring to your business." />;
}
