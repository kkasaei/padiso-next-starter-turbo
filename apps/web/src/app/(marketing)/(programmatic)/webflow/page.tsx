import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Webflow SEO | SearchFIT',
  description: 'Optimize your Webflow website for search engines and AI. Track rankings, improve visibility, and grow organic traffic.',
};

export default function WebflowPage() {
  return <ComingSoon title="Webflow SEO" description="Powerful SEO tools built for Webflow websites." />;
}
