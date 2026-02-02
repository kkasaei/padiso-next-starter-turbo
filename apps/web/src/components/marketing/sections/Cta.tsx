import * as React from 'react';
import Link from 'next/link';

import { FEATURE_FLAGS } from '@workspace/common';
import { buttonVariants } from '@workspace/ui/components/button';
import { cn } from '@workspace/common/lib';

import { BlurFade } from '@workspace/ui/components/fragments/BlurFade';
import { GridSection } from '@workspace/ui/components/fragments/GridSection';
import { TextGenerateEffect } from '@workspace/ui/components/fragments/TextGenerateEffect';

export function CTA(): React.JSX.Element {
  const isWaitlist = FEATURE_FLAGS.IS_WAITLIST;
  const ctaLink = isWaitlist ? '/waitlist' : '/signup';
  const ctaText = isWaitlist ? 'Join Waitlist' : 'Get started';

  return (
    <GridSection className="bg-diagonal-lines">
      <div className="container flex flex-col items-center justify-between gap-6 bg-background py-16 text-center">
        <h3 className="m-0 max-w-fit text-3xl font-semibold md:text-4xl">
          <TextGenerateEffect words={isWaitlist ? 'Join the waitlist' : 'Ready to start?'} />
        </h3>
        <BlurFade
          inView
          delay={0.6}
        >
          <Link
            href={ctaLink}
            className={cn(buttonVariants({ variant: 'default' }), 'rounded-xl')}
          >
            {ctaText}
          </Link>
        </BlurFade>
      </div>
    </GridSection>
  );
}
