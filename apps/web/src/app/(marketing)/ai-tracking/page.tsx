import type { Metadata } from 'next';

import { AITrackingHero } from '@/components/marketing/sections/AITrackingHero';

export const metadata: Metadata = {
  title: 'AI Tracking | SearchFIT',
  description: 'Track your brand visibility across AI platforms like ChatGPT, Perplexity, Claude, and Gemini. Monitor how AI recommends your business.',
};

export default function AITrackingPage() {
  return <AITrackingHero />;
}
