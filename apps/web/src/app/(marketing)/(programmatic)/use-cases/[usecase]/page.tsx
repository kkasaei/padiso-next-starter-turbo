import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ComingSoon } from '@/components/marketing/ComingSoon';

const useCases: Record<string, { title: string; description: string }> = {
  'marketing-teams': {
    title: 'For Marketing Teams',
    description: 'Empower your marketing team with AI-powered SEO and visibility tracking.',
  },
  'agencies': {
    title: 'For Agencies',
    description: 'Scale your agency with white-label SEO tools and client management.',
  },
  'startups': {
    title: 'For Startups',
    description: 'Grow your startup with affordable, powerful SEO automation.',
  },
  'enterprises': {
    title: 'For Enterprises',
    description: 'Enterprise-grade SEO and AI visibility for large organizations.',
  },
  'ecommerce': {
    title: 'For Ecommerce',
    description: 'Boost your online store visibility with AI-powered SEO.',
  },
  'saas': {
    title: 'For SaaS',
    description: 'Drive organic growth for your SaaS with smart SEO tools.',
  },
  'publishers': {
    title: 'For Publishers',
    description: 'Maximize content reach with AI visibility and SEO optimization.',
  },
  'freelancers': {
    title: 'For Freelancers',
    description: 'Professional SEO tools at freelancer-friendly pricing.',
  },
  'content-creators': {
    title: 'For Content Creators',
    description: 'Create content that ranks with AI-powered optimization.',
  },
  'local-business': {
    title: 'For Local Business',
    description: 'Dominate local search with targeted SEO strategies.',
  },
};

interface PageProps {
  params: Promise<{ usecase: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { usecase } = await params;
  const data = useCases[usecase];

  if (!data) {
    return { title: 'Use Case Not Found | SearchFIT' };
  }

  return {
    title: `${data.title} | SearchFIT`,
    description: data.description,
  };
}

export function generateStaticParams() {
  return Object.keys(useCases).map((usecase) => ({ usecase }));
}

export default async function UseCasePage({ params }: PageProps) {
  const { usecase } = await params;
  const data = useCases[usecase];

  if (!data) {
    notFound();
  }

  return <ComingSoon title={data.title} description={data.description} />;
}
