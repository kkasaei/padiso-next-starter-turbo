import * as React from 'react';
import type { Metadata } from 'next';

import { PricingFAQ } from '@/components/marketing/sections/PricingFaq';
import { PricingHero } from '@/components/marketing/sections/PricingHero';
import { createTitle } from '@/lib/formatters';

export const metadata: Metadata = {
  title: createTitle('Pricing')
};

export default function PricingPage(): React.JSX.Element {
  return (
    <>
      <PricingHero />
      <PricingFAQ />
    </>
  );
}
