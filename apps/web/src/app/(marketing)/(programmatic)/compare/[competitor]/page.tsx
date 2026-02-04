import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ComingSoon } from '@/components/marketing/ComingSoon';

const competitors: Record<string, { name: string; description: string }> = {
  ahrefs: {
    name: 'Ahrefs',
    description: 'See how SearchFIT compares to Ahrefs for SEO and AI visibility.',
  },
  semrush: {
    name: 'SEMrush',
    description: 'Compare SearchFIT vs SEMrush features and pricing.',
  },
  moz: {
    name: 'Moz',
    description: 'SearchFIT vs Moz - which SEO tool is right for you?',
  },
  surfer: {
    name: 'Surfer SEO',
    description: 'Compare SearchFIT and Surfer SEO for content optimization.',
  },
  clearscope: {
    name: 'Clearscope',
    description: 'SearchFIT vs Clearscope for content optimization.',
  },
  frase: {
    name: 'Frase',
    description: 'Compare SearchFIT and Frase for AI content creation.',
  },
  jasper: {
    name: 'Jasper',
    description: 'SearchFIT vs Jasper for AI-powered content.',
  },
  marketmuse: {
    name: 'MarketMuse',
    description: 'Compare SearchFIT and MarketMuse for content strategy.',
  },
  scalenut: {
    name: 'Scalenut',
    description: 'SearchFIT vs Scalenut for SEO content creation.',
  },
  writesonic: {
    name: 'Writesonic',
    description: 'Compare SearchFIT and Writesonic for AI writing.',
  },
};

interface PageProps {
  params: Promise<{ competitor: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { competitor } = await params;
  const data = competitors[competitor];

  if (!data) {
    return { title: 'Comparison Not Found | SearchFIT' };
  }

  return {
    title: `SearchFIT vs ${data.name} | SearchFIT`,
    description: data.description,
  };
}

export function generateStaticParams() {
  return Object.keys(competitors).map((competitor) => ({ competitor }));
}

export default async function ComparisonPage({ params }: PageProps) {
  const { competitor } = await params;
  const data = competitors[competitor];

  if (!data) {
    notFound();
  }

  return <ComingSoon title={`SearchFIT vs ${data.name}`} description={data.description} />;
}
