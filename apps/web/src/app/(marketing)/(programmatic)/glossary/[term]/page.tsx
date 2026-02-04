import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ComingSoon } from '@/components/marketing/ComingSoon';

const glossaryTerms: Record<string, { term: string; definition: string }> = {
  'seo': {
    term: 'SEO (Search Engine Optimization)',
    definition: 'The practice of optimizing websites to rank higher in search engine results.',
  },
  'aeo': {
    term: 'AEO (Answer Engine Optimization)',
    definition: 'Optimizing content to appear in AI-powered answer engines.',
  },
  'geo': {
    term: 'GEO (Generative Engine Optimization)',
    definition: 'Optimizing for generative AI search results and recommendations.',
  },
  'backlink': {
    term: 'Backlink',
    definition: 'A link from one website to another, important for SEO authority.',
  },
  'domain-authority': {
    term: 'Domain Authority',
    definition: 'A metric predicting how well a website will rank in search results.',
  },
  'keyword': {
    term: 'Keyword',
    definition: 'Words or phrases users type into search engines.',
  },
  'serp': {
    term: 'SERP (Search Engine Results Page)',
    definition: 'The page displayed by search engines in response to a query.',
  },
  'crawling': {
    term: 'Crawling',
    definition: 'The process by which search engines discover web pages.',
  },
  'indexing': {
    term: 'Indexing',
    definition: 'The process of adding web pages to a search engine database.',
  },
  'organic-traffic': {
    term: 'Organic Traffic',
    definition: 'Visitors who find your website through unpaid search results.',
  },
  'meta-tags': {
    term: 'Meta Tags',
    definition: 'HTML tags that provide information about a web page to search engines.',
  },
  'schema-markup': {
    term: 'Schema Markup',
    definition: 'Structured data that helps search engines understand page content.',
  },
  'canonical-url': {
    term: 'Canonical URL',
    definition: 'The preferred URL for a page when duplicate content exists.',
  },
  'bounce-rate': {
    term: 'Bounce Rate',
    definition: 'The percentage of visitors who leave after viewing only one page.',
  },
  'long-tail-keywords': {
    term: 'Long-tail Keywords',
    definition: 'Specific, longer keyword phrases with lower search volume but higher intent.',
  },
};

interface PageProps {
  params: Promise<{ term: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { term } = await params;
  const data = glossaryTerms[term];

  if (!data) {
    return { title: 'Term Not Found | SearchFIT Glossary' };
  }

  return {
    title: `${data.term} | SEO Glossary | SearchFIT`,
    description: data.definition,
  };
}

export function generateStaticParams() {
  return Object.keys(glossaryTerms).map((term) => ({ term }));
}

export default async function GlossaryTermPage({ params }: PageProps) {
  const { term } = await params;
  const data = glossaryTerms[term];

  if (!data) {
    notFound();
  }

  return <ComingSoon title={data.term} description={data.definition} />;
}
