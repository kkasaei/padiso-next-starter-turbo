import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Squarespace SEO | SearchFIT',
  description: 'Improve your Squarespace website SEO with AI. Track rankings, optimize content, and grow your organic traffic.',
};

export default function SquarespacePage() {
  return <ComingSoon title="Squarespace SEO" description="SEO tools designed for Squarespace websites." />;
}
