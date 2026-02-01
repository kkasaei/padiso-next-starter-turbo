import * as React from 'react';

import { CTA } from '@/components/marketing/sections/Cta';
import { FAQ } from '@/components/marketing/sections/Faq';
import { Hero } from '@/components/marketing/sections/Hero';
import { Logos } from '@/components/marketing/sections/Logos';
import { Problem } from '@/components/marketing/sections/Problem';
import { Solution } from '@/components/marketing/sections/Solution';
import { Stats } from '@/components/marketing/sections/Stats';
import { Testimonials } from '@/components/marketing/sections/Testimonials';

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
