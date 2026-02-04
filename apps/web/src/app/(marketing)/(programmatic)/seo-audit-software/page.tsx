import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'SEO Audit Software | SearchFIT',
  description: 'Comprehensive SEO audits for your website. Identify issues and opportunities to improve your search rankings.',
};

export default function SeoAuditSoftwarePage() {
  return <ComingSoon title="SEO Audit Software" description="Get comprehensive SEO audits with actionable recommendations." />;
}
