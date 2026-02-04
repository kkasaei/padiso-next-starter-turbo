import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Security | SearchFIT',
  description: 'Learn about SearchFIT security practices, data protection, and compliance certifications.',
};

export default function SecurityPage() {
  return <ComingSoon title="Security" description="Enterprise-grade security to protect your data." />;
}
