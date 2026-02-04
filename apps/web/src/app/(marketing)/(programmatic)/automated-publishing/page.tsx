import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Automated Publishing | SearchFIT',
  description: 'Publish content automatically to your CMS. Streamline your content workflow with automated publishing.',
};

export default function AutomatedPublishingPage() {
  return <ComingSoon title="Automated Publishing" description="Publish content directly to your CMS with one click." />;
}
