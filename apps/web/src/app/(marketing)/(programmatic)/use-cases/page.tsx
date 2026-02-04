import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'Use Cases | SearchFIT',
  description: 'Discover how different teams and businesses use SearchFIT to grow their organic traffic and AI visibility.',
};

export default function UseCasesPage() {
  return <ComingSoon title="Use Cases" description="See how teams of all sizes use SearchFIT to achieve their goals." />;
}
