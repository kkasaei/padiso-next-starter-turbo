import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Content Automation | SearchFIT',
  description: 'Automate your content creation and publishing workflow. Scale your content marketing with AI.',
};

export default function ContentAutomationPage() {
  return <ComingSoon title="Content Automation" description="Scale your content production with intelligent automation." />;
}
