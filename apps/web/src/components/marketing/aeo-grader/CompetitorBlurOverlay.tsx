'use client';

import * as React from 'react';
import Link from 'next/link';
import { Lock, ArrowRight } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';

interface CompetitorBlurOverlayProps {
  visibleCount?: number;
  totalCount?: number;
}

export function CompetitorBlurOverlay({
  visibleCount = 5,
  totalCount = 19
}: CompetitorBlurOverlayProps): React.JSX.Element {
  const hiddenCount = totalCount - visibleCount;

  return (
    <div className="relative mt-8">
      {/* Blurred content placeholder */}
      <div className="pointer-events-none relative overflow-hidden rounded-lg border py-10">
        <div className="space-y-4 p-4 blur-sm">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded bg-muted" />
                  <div className="h-3 w-24 rounded bg-muted" />
                </div>
              </div>
              <div className="h-8 w-16 rounded bg-muted" />
            </div>
          ))}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/40" />

        {/* CTA content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-md space-y-6 px-12 py-10 text-center">
            <div className="flex justify-center">
              <Lock className="size-12 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold md:text-xl">
                See all competitors
              </h3>
              <p className="text-sm text-muted-foreground">
                Discover who&apos;s winning AI search in your market and their
                exact strategies
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="w-full md:w-auto"
            >
              <Link href="/auth/sign-up">
                Unlock full competitor analysis
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

