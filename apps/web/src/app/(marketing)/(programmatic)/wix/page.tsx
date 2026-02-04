import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Wix SEO | SearchFIT',
  description: 'Optimize your Wix website for search engines. AI-powered tools to improve rankings and drive organic traffic.',
};

export default function WixPage() {
  return <ComingSoon title="Wix SEO" description="AI-powered SEO optimization for Wix websites." />;
}
