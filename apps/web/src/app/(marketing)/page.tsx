import * as React from 'react';

import { CTA } from '@/components/modules/marketing/sections/cta';
import { FAQ } from '@/components/modules/marketing/sections/faq';
import { Hero } from '@/components/modules/marketing/sections/hero';
import { Logos } from '@/components/modules/marketing/sections/logos';
import { Problem } from '@/components/modules/marketing/sections/problem';
import { Solution } from '@/components/modules/marketing/sections/solution';
import { Stats } from '@/components/modules/marketing/sections/stats';
import { Testimonials } from '@/components/modules/marketing/sections/testimonials';

export default function IndexPage(): React.JSX.Element {
  return (
    <>
      <Hero />
      <Logos />
      <Problem />
      <Solution />
      <Stats />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
}
