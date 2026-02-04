import type { Metadata } from 'next';

import { ContentHero } from '@/components/marketing/sections/ContentHero';

export const metadata: Metadata = {
  title: 'Content | SearchFIT',
  description: 'Generate SEO-optimized content with AI assistance. Create blog posts, landing pages, and more that rank on search engines and AI platforms.',
};

export default function ContentPage() {
  return <ContentHero />;
}
