import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Press & Media Kit | SearchFIT',
  description: 'SearchFIT press resources, media kit, brand assets, and company information for journalists.',
};

export default function PressPage() {
  return <ComingSoon title="Press & Media Kit" description="Brand assets and company information for media inquiries." />;
}
