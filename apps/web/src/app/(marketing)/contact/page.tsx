import * as React from 'react';
import type { Metadata } from 'next';

import { Contact } from '@/components/marketing/sections/Contact';
import { FAQ } from '@/components/marketing/sections/Faq';
import { createTitle } from '@/lib/formatters';

export const metadata: Metadata = {
  title: createTitle('Contact')
};

export default function ContactPage(): React.JSX.Element {
  return (
    <>
      <Contact />
      <FAQ />
    </>
  );
}
