import * as React from 'react';
import type { Metadata } from 'next';

import { TermsOfUse } from '@/components/marketing/sections/TermsOfUse';
import { createTitle } from '@workspace/common/lib';

export const metadata: Metadata = {
  title: createTitle('Terms of Use')
};

export default function TermsOfUsePage(): React.JSX.Element {
  return <TermsOfUse />;
}
