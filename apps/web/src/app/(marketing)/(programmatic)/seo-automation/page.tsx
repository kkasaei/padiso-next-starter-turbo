import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'SEO Automation | SearchFIT',
  description: 'Automate repetitive SEO tasks. Save time with intelligent automation for audits, reporting, and optimization.',
};

export default function SeoAutomationPage() {
  return <ComingSoon title="SEO Automation" description="Automate your SEO workflow and focus on what matters most." />;
}
