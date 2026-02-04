import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Organic Traffic Tool | SearchFIT',
  description: 'Grow your organic traffic with AI. Data-driven strategies to increase search visibility.',
};

export default function OrganicTrafficPage() {
  return <ComingSoon title="Organic Traffic Tool" description="Grow your organic traffic with AI-powered insights and strategies." />;
}
