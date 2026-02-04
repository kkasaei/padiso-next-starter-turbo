import type { Metadata } from 'next';
import { SocialListeningHero } from '@/components/marketing/sections/SocialListeningHero';

export const metadata: Metadata = {
  title: 'Social Listening | SearchFIT',
  description: 'Monitor brand mentions across social platforms and communities. Track conversations about your brand on Reddit, Twitter, LinkedIn, and more.',
};

export default function SocialListeningPage() {
  return <SocialListeningHero />;
}
