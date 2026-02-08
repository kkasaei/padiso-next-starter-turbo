'use client';

import * as React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

import { buttonVariants } from '@workspace/ui/components/button';
import { cn } from '@workspace/common/lib';

import { BlurFade } from '@workspace/ui/components/fragments/BlurFade';
import { GridSection } from '@workspace/ui/components/fragments/GridSection';

interface CTAClientProps {
  isWaitlistMode: boolean;
}

export function CTAClient({ isWaitlistMode }: CTAClientProps): React.JSX.Element {
  return (
    <GridSection className="bg-diagonal-lines">
      <div className="container flex flex-col items-center justify-between gap-6 bg-background py-16 text-center">
        <BlurFade inView>
          <h3 className="m-0 max-w-fit text-3xl font-semibold md:text-4xl">
            {isWaitlistMode ? 'Join the waitlist' : 'Ready to get started?'}
          </h3>
        </BlurFade>
        <BlurFade
          inView
          delay={0.6}
        >
          {isWaitlistMode ? (
            <Link
              href="/waitlist"
              className={cn(buttonVariants({ variant: 'default' }), 'rounded-full')}
            >
              Join Waitlist
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/pricing"
                className={cn(
                  buttonVariants({ variant: 'default', size: 'lg' }),
                  'rounded-full px-8 shadow-lg shadow-primary/25'
                )}
              >
                <Sparkles className="mr-2 size-4" />
                Start 7-Day Free Trial
              </Link>
              <Link
                href="/sales"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'rounded-full px-8'
                )}
              >
                Need a Custom Solution?
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </div>
          )}
        </BlurFade>
      </div>
    </GridSection>
  );
}
