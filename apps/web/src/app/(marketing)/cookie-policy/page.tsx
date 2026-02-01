import * as React from 'react';
import type { Metadata } from 'next';

import { CookiePolicy } from '@/components/marketing/sections/CookiePolicy';
import { createTitle } from '@workspace/common/lib';

export const metadata: Metadata = {
  title: createTitle('Cookie Policy')
};

export default function CookiePolicyPage(): React.JSX.Element {
  return <CookiePolicy />;
}
