import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'JSON-LD Schema Markup | SearchFIT',
  description: 'Implement structured data for better search visibility. Generate and manage JSON-LD schema markup easily.',
};

export default function JsonLdSchemaPage() {
  return <ComingSoon title="JSON-LD Schema Markup" description="Enhance your search appearance with structured data." />;
}
