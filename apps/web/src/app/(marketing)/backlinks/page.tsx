import type { Metadata } from 'next';
import { BacklinksHero } from '@/components/marketing/sections/BacklinksHero';

export const metadata: Metadata = {
  title: 'Backlinks | SearchFIT',
  description: 'Monitor and analyze your backlink profile. Track new and lost links, analyze competitors, and build a stronger link profile.',
};

export default function BacklinksPage() {
  return <BacklinksHero />;
}
