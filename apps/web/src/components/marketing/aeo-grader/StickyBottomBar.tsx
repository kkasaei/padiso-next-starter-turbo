'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';

import { FEATURE_FLAGS } from '@/feature_flags';
import { Button } from '@workspace/ui/components/button';

interface StickyBottomBarProps {
  userScore?: number;
  topCompetitorScore?: number;
  triggerScrollDepth?: number;
}

export function StickyBottomBar({
  userScore = 25,
  topCompetitorScore = 65,
  triggerScrollDepth = 500
}: StickyBottomBarProps): React.JSX.Element | null {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isDismissed, setIsDismissed] = React.useState(false);
  const isWaitlist = FEATURE_FLAGS.IS_WAITLIST;
  const ctaLink = isWaitlist ? '/waitlist' : '/auth/sign-up';
  const ctaText = isWaitlist ? 'Join Waitlist' : 'See how to close the gap';
  const subText = isWaitlist ? 'Early access' : '7-day free trial • No payment required';

  React.useEffect(() => {
    // Check localStorage for dismissal
    const dismissed = localStorage.getItem('stickyBarDismissed');
    const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (dismissed && now - dismissedTime < twentyFourHours) {
      setIsDismissed(true);
      return;
    }

    const handleScroll = (): void => {
      const scrolled = window.scrollY > triggerScrollDepth;
      setIsVisible(scrolled);
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [triggerScrollDepth]);

  const handleDismiss = (): void => {
    setIsDismissed(true);
    localStorage.setItem('stickyBarDismissed', Date.now().toString());
  };

  if (isDismissed || !isVisible) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-5 duration-300"
      style={{
        boxShadow: '0px -2px 10px rgba(0,0,0,0.1)'
      }}
    >
      <div className="border-t bg-background">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <div className="text-center text-sm md:text-left">
              <span className="font-medium">Your score: {userScore}/100</span>
              <span className="mx-2 text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                Top competitor: {topCompetitorScore}/100
              </span>
            </div>
            <div className="flex w-full items-center gap-3 md:w-auto">
              <Button
                asChild
                size="default"
                className="flex-1 md:flex-initial"
              >
                <Link href={ctaLink}>
                  {ctaText}
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <span className="hidden text-xs text-muted-foreground md:inline">
                {subText}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="shrink-0"
                aria-label="Dismiss"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

