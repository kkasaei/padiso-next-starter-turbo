'use client';

import * as React from 'react';
import Link from 'next/link';
import { Lightbulb, ArrowRight } from 'lucide-react';

import { FEATURE_FLAGS } from '@workspace/common';

interface InlineCTACardProps {
  brandArchetype?: string;
}

export function InlineCTACard({
  brandArchetype = 'Innovator'
}: InlineCTACardProps): React.JSX.Element {
  const isWaitlist = FEATURE_FLAGS.IS_WAITLIST;
  const ctaLink = isWaitlist ? '/waitlist' : '/auth/sign-up';
  const ctaText = isWaitlist ? 'Join Waitlist' : 'Start 7-Day Free Trial';
  const subText = isWaitlist ? 'Be notified when we launch' : 'See their exact positioning strategies • No payment required';

  return (
    <div className="group relative my-8 overflow-hidden rounded-2xl border-2 bg-gradient-to-br from-card via-card to-card/50 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl">
      {/* Animated Background Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 size-64 rounded-full bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-yellow-500/10 blur-3xl transition-all duration-1000 group-hover:scale-150" />
        <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-gradient-to-tr from-blue-500/10 via-cyan-500/10 to-teal-500/10 blur-3xl transition-all duration-1000 group-hover:scale-150" />
      </div>

      <div className="relative p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
          {/* Icon */}
          <div className="shrink-0">
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 opacity-20 blur-xl transition-opacity duration-300 group-hover:opacity-40" />

              {/* Icon Container */}
              <div className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
                <Lightbulb className="size-8 text-white" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">💡</span>
                <h3 className="text-2xl font-bold tracking-tight">Pro Tip</h3>
              </div>
              <p className="text-base text-muted-foreground md:text-lg">
                Your brand archetype shows &quot;{brandArchetype}&quot; positioning,
                but competitors are using different strategies that rank higher.
              </p>
            </div>

            <div className="space-y-2">
              <Link
                href={ctaLink}
                className="group/link inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                {ctaText}
                <ArrowRight className="size-4 transition-transform group-hover/link:translate-x-1" />
              </Link>
              <p className="text-xs text-muted-foreground">
                {subText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

