import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Geo Audit Tool | SearchFIT',
  description: 'Audit your local SEO performance. Free geo audit tool to analyze location-based search visibility.',
};

export default function GeoAuditPage() {
  return <ComingSoon title="Geo Audit Tool" description="Analyze your local SEO performance across different locations." />;
}
