import * as React from 'react';
import Link from 'next/link';

import { FEATURE_FLAGS } from '@/feature_flags';
import { buttonVariants } from '@workspace/ui/components/button';
import { cn } from '@/lib/utils';

import { BlurFade } from '@/components/shared/fragments/blur-fade';
import { GridSection } from '@/components/shared/fragments/grid-section';
import { TextGenerateEffect } from '@/components/shared/fragments/text-generate-effect';

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
