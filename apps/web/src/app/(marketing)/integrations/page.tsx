import * as React from 'react';
import type { Metadata } from 'next';

import { IntegrationsHero } from '@/components/marketing/sections/IntegrationsHero';
import { createTitle } from '@workspace/common/lib';

export const metadata: Metadata = {
  title: createTitle('Integrations'),
  description: 'Connect SearchFIT with your favorite tools. Integrate with Google, WordPress, Webflow, Shopify, and 30+ more platforms.',
};

export default function IntegrationsPage(): React.JSX.Element {
  return (
    <>
      <IntegrationsHero />
    </>
  );
}
