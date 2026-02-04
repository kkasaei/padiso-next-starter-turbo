import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'JSON-LD Schema Generator | SearchFIT',
  description: 'Generate structured data markup for your website. Free JSON-LD schema generator for better search visibility.',
};

export default function JsonLdSchemaPage() {
  return <ComingSoon title="JSON-LD Schema Generator" description="Generate structured data markup to enhance your search appearance." />;
}
