import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ComingSoon } from '@/components/marketing/ComingSoon';

const industries: Record<string, { title: string; description: string }> = {
  restaurants: {
    title: 'SEO for Restaurants',
    description: 'Attract more diners with local SEO and AI visibility.',
  },
  dentists: {
    title: 'SEO for Dentists',
    description: 'Grow your dental practice with targeted SEO strategies.',
  },
  lawyers: {
    title: 'SEO for Lawyers',
    description: 'Attract more clients with legal industry SEO.',
  },
  'real-estate': {
    title: 'SEO for Real Estate',
    description: 'Generate more leads with real estate SEO.',
  },
  healthcare: {
    title: 'SEO for Healthcare',
    description: 'Reach more patients with healthcare SEO strategies.',
  },
  ecommerce: {
    title: 'SEO for Ecommerce',
    description: 'Drive more sales with ecommerce SEO optimization.',
  },
  gyms: {
    title: 'SEO for Gyms',
    description: 'Attract more members with fitness industry SEO.',
  },
  plumbers: {
    title: 'SEO for Plumbers',
    description: 'Get more service calls with local plumber SEO.',
  },
  accountants: {
    title: 'SEO for Accountants',
    description: 'Grow your accounting practice with targeted SEO.',
  },
  photographers: {
    title: 'SEO for Photographers',
    description: 'Book more clients with photography SEO.',
  },
};

interface PageProps {
  params: Promise<{ industry: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { industry } = await params;
  const data = industries[industry];

  if (!data) {
    return { title: 'Industry Not Found | SearchFIT' };
  }

  return {
    title: `${data.title} | SearchFIT`,
    description: `${data.description} Track your AI visibility and dominate search results.`,
  };
}

export function generateStaticParams() {
  return Object.keys(industries).map((industry) => ({ industry }));
}

export default async function IndustryPage({ params }: PageProps) {
  const { industry } = await params;
  const data = industries[industry];

  if (!data) {
    notFound();
  }

  return <ComingSoon title={data.title} description={data.description} />;
}
