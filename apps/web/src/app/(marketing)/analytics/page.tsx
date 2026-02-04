import type { Metadata } from 'next';
import { AnalyticsHero } from '@/components/marketing/sections/AnalyticsHero';

export const metadata: Metadata = {
  title: 'Analytics | SearchFIT',
  description: 'AI-powered analytics and insights for your SEO performance. Track rankings, traffic, and visibility across all platforms.',
};

export default function AnalyticsPage() {
  return <AnalyticsHero />;
}
