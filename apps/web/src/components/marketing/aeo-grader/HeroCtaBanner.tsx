'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Unlock } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { useIsWaitlistMode } from '@/hooks/use-is-waitlist-mode';

export function HeroCTABanner(): React.JSX.Element {
  const { isWaitlistMode } = useIsWaitlistMode();
  const ctaLink = isWaitlistMode ? '/waitlist' : '/auth/sign-up';
  const ctaText = isWaitlistMode ? 'Join Waitlist for Early Access' : 'Sign up free - No credit card required';

  return (
    <div className="mb-8 rounded-lg border-l-[3px] border-l-blue-500 bg-blue-50 p-4 dark:bg-blue-950/20 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Unlock className="size-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base font-semibold md:text-lg">
            {isWaitlistMode ? 'Get notified when we launch' : 'You\'re viewing a limited report'}
          </h3>
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <span className="mt-0.5 text-green-600 dark:text-green-400">
                ✓
              </span>
              <span>Full competitor analysis (19 brands)</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="mt-0.5 text-green-600 dark:text-green-400">
                ✓
              </span>
              <span>Historical trends &amp; weekly tracking</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="mt-0.5 text-green-600 dark:text-green-400">
                ✓
              </span>
              <span>Alerts when your score changes</span>
            </p>
          </div>
        </div>
        <Button
          asChild
          size="lg"
          className="w-full transition-transform hover:scale-[1.02] md:w-auto"
        >
          <Link href={ctaLink}>
            {ctaText}
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

