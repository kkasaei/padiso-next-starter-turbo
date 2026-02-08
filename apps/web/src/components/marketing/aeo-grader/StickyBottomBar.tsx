'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, X, Sparkles } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { useIsWaitlistMode } from '@/hooks/use-is-waitlist-mode';

interface StickyBottomBarProps {
  userScore: number;
  triggerScrollDepth?: number;
}

export function StickyBottomBar({
  userScore,
  triggerScrollDepth = 500
}: StickyBottomBarProps): React.JSX.Element | null {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isDismissed, setIsDismissed] = React.useState(false);
  const { isWaitlistMode } = useIsWaitlistMode();
  const ctaLink = isWaitlistMode ? '/waitlist' : '/auth/sign-up';
  const ctaText = isWaitlistMode ? 'Join Waitlist' : 'Improve Your Score';

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
      className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-5 duration-500"
    >
      <div className="border-t bg-background/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="container mx-auto px-4 py-4 md:px-6 md:py-5">
          <div className="flex items-center justify-between gap-4">

            {/* Left: Score + message */}
            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-bold sm:flex dark:border-blue-800 dark:bg-blue-950">
                <span className="text-blue-600 dark:text-blue-400">{userScore}</span>
                <span className="text-blue-400 dark:text-blue-500">/100</span>
              </div>
              <div>
                <p className="text-sm font-semibold md:text-base">Your AEO score needs work</p>
                <p className="hidden text-sm text-muted-foreground md:block">Get actionable insights to rank higher in AI answers</p>
              </div>
            </div>

            {/* Right: CTA + trial + dismiss */}
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-blue-600 px-8 text-base font-semibold shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30"
                >
                  <Link href={ctaLink}>
                    <Sparkles className="mr-2 size-4" />
                    {ctaText}
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <span className="hidden text-center text-xs text-muted-foreground lg:block">
                  7-day free trial · No payment required
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="size-8 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
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
