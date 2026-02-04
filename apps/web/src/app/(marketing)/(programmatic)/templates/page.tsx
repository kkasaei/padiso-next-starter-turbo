import type { Metadata } from 'next';

import { ComingSoon } from '@/components/marketing/ComingSoon';

export const metadata: Metadata = {
  title: 'SEO Templates | SearchFIT',
  description: 'Free SEO templates, checklists, and frameworks to optimize your search strategy.',
};

export default function TemplatesPage() {
  return <ComingSoon title="SEO Templates" description="Free templates and checklists to accelerate your SEO success." />;
}
