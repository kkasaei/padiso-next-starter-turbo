import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'SEO for Agencies | SearchFIT',
  description: 'SEO tools built for agencies. Manage multiple clients, automate reporting, and scale your agency.',
};

export default function SeoAgenciesPage() {
  return <ComingSoon title="SEO for Agencies" description="Powerful SEO tools designed to scale your agency business." />;
}
