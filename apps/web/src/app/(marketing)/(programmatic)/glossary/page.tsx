import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'SEO Glossary | SearchFIT',
  description: 'Learn SEO terminology with our comprehensive glossary. Definitions for SEO, AEO, GEO, and more.',
};

export default function GlossaryPage() {
  return <ComingSoon title="SEO Glossary" description="Your comprehensive guide to SEO and AI visibility terminology." />;
}
