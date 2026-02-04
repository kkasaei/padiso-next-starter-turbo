import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ComingSoon } from '@/components/marketing/ComingSoon';

const integrations: Record<string, { name: string; description: string }> = {
  'google-search-console': {
    name: 'Google Search Console',
    description: 'Connect Google Search Console to track rankings and performance.',
  },
  'google-analytics': {
    name: 'Google Analytics',
    description: 'Integrate Google Analytics for comprehensive traffic insights.',
  },
  'shopify': {
    name: 'Shopify',
    description: 'Connect your Shopify store for ecommerce SEO optimization.',
  },
  'wordpress': {
    name: 'WordPress',
    description: 'Seamlessly integrate with WordPress for content optimization.',
  },
  'webflow': {
    name: 'Webflow',
    description: 'Connect Webflow for automatic SEO updates.',
  },
  'slack': {
    name: 'Slack',
    description: 'Get SEO alerts and updates directly in Slack.',
  },
  'zapier': {
    name: 'Zapier',
    description: 'Connect SearchFIT to 5000+ apps via Zapier.',
  },
  'notion': {
    name: 'Notion',
    description: 'Sync your SEO tasks and content plans with Notion.',
  },
  'airtable': {
    name: 'Airtable',
    description: 'Manage SEO data in Airtable with our integration.',
  },
  'hubspot': {
    name: 'HubSpot',
    description: 'Connect HubSpot for unified marketing and SEO.',
  },
  'semrush': {
    name: 'SEMrush',
    description: 'Import data from SEMrush for enhanced analysis.',
  },
  'ahrefs': {
    name: 'Ahrefs',
    description: 'Connect Ahrefs for comprehensive backlink data.',
  },
};

interface PageProps {
  params: Promise<{ integration: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { integration } = await params;
  const data = integrations[integration];

  if (!data) {
    return { title: 'Integration Not Found | SearchFIT' };
  }

  return {
    title: `${data.name} Integration | SearchFIT`,
    description: data.description,
  };
}

export function generateStaticParams() {
  return Object.keys(integrations).map((integration) => ({ integration }));
}

export default async function IntegrationPage({ params }: PageProps) {
  const { integration } = await params;
  const data = integrations[integration];

  if (!data) {
    notFound();
  }

  return <ComingSoon title={`${data.name} Integration`} description={data.description} />;
}
