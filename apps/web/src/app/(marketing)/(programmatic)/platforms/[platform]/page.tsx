import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ComingSoon } from '@/components/marketing/ComingSoon';

const platforms: Record<string, { title: string; description: string }> = {
  shopify: {
    title: 'Shopify SEO',
    description: 'Optimize your Shopify store for search engines and AI.',
  },
  woocommerce: {
    title: 'WooCommerce SEO',
    description: 'Boost your WooCommerce store visibility in search results.',
  },
  wordpress: {
    title: 'WordPress SEO',
    description: 'Comprehensive SEO tools for WordPress websites.',
  },
  webflow: {
    title: 'Webflow SEO',
    description: 'Optimize your Webflow site for maximum search visibility.',
  },
  wix: {
    title: 'Wix SEO',
    description: 'SEO optimization tools designed for Wix websites.',
  },
  squarespace: {
    title: 'Squarespace SEO',
    description: 'Improve your Squarespace site search rankings.',
  },
  bigcommerce: {
    title: 'BigCommerce SEO',
    description: 'SEO solutions for BigCommerce stores.',
  },
  magento: {
    title: 'Magento SEO',
    description: 'Enterprise-grade SEO for Magento ecommerce.',
  },
  ghost: {
    title: 'Ghost SEO',
    description: 'SEO optimization for Ghost publishing platform.',
  },
  drupal: {
    title: 'Drupal SEO',
    description: 'SEO tools for Drupal content management.',
  },
};

interface PageProps {
  params: Promise<{ platform: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { platform } = await params;
  const data = platforms[platform];

  if (!data) {
    return { title: 'Platform Not Found | SearchFIT' };
  }

  return {
    title: `${data.title} | SearchFIT`,
    description: `${data.description} Track your AI visibility and optimize for search engines.`,
  };
}

export function generateStaticParams() {
  return Object.keys(platforms).map((platform) => ({ platform }));
}

export default async function PlatformPage({ params }: PageProps) {
  const { platform } = await params;
  const data = platforms[platform];

  if (!data) {
    notFound();
  }

  return <ComingSoon title={data.title} description={data.description} />;
}
