import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Careers | SearchFIT',
  description: 'Join the SearchFIT team. We are hiring talented people to help businesses grow their online visibility.',
};

export default function CareersPage() {
  return <ComingSoon title="Careers" description="Join our mission to revolutionize SEO with AI." />;
}
