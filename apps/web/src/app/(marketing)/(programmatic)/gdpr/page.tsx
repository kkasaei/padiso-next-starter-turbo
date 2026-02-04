import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'GDPR Compliance | SearchFIT',
  description: 'SearchFIT GDPR compliance information. How we protect your data and respect your privacy.',
};

export default function GdprPage() {
  return <ComingSoon title="GDPR Compliance" description="How we protect your data and ensure GDPR compliance." />;
}
