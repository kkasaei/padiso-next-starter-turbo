import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Auto Linking Tool | SearchFIT',
  description: 'Automate internal linking for better SEO. Build a strong link structure automatically.',
};

export default function AutoLinkingPage() {
  return <ComingSoon title="Auto Linking Tool" description="Automatically build a powerful internal linking structure." />;
}
