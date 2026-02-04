import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'System Status | SearchFIT',
  description: 'Check the current status of SearchFIT services and view incident history.',
};

export default function StatusPage() {
  return <ComingSoon title="System Status" description="Monitor the uptime and performance of SearchFIT services." />;
}
