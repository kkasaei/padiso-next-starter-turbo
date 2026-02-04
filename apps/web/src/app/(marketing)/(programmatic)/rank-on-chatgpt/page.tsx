import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Rank on ChatGPT | SearchFIT',
  description: 'Get your brand recommended by ChatGPT. Track and improve your visibility in AI conversations.',
};

export default function RankOnChatGptPage() {
  return <ComingSoon title="Rank on ChatGPT" description="Get your brand recommended when users ask ChatGPT for solutions." />;
}
