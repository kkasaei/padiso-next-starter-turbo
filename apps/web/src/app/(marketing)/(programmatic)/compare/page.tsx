import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Compare SEO Tools | SearchFIT',
  description: 'Compare SearchFIT with other SEO tools. See how we stack up against Ahrefs, SEMrush, Moz, and more.',
};

export default function ComparePage() {
  return <ComingSoon title="Compare SEO Tools" description="See how SearchFIT compares to other SEO and AI visibility tools." />;
}
