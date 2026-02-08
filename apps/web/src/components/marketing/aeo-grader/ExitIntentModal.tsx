'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, X } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { useIsWaitlistMode } from '@/hooks/use-is-waitlist-mode';

export function ExitIntentModal(): React.JSX.Element | null {
  const [isVisible, setIsVisible] = React.useState(false);
  const { isWaitlistMode } = useIsWaitlistMode();
  const ctaLink = isWaitlistMode ? '/waitlist' : '/auth/sign-up';
  const ctaText = isWaitlistMode ? 'Join Waitlist' : 'Start 7-Day Free Trial';

  React.useEffect(() => {
    // Check if modal was already shown in this session
    const hasShown = sessionStorage.getItem('exitIntentShown');
    if (hasShown) {
      console.log('Exit intent modal already shown in this session');
      return;
    }

    console.log('Exit intent modal will show in 10 seconds...');

    // Show modal after 10 seconds
    const timer = setTimeout(() => {
      console.log('Showing exit intent modal now!');
      setIsVisible(true);
      sessionStorage.setItem('exitIntentShown', 'true');
    }, 10000); // 10 seconds delay

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl rounded-2xl border border-border/50 bg-background shadow-2xl animate-in zoom-in-95 duration-300">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3 z-10 size-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-muted"
          onClick={() => setIsVisible(false)}
          aria-label="Close"
        >
          <X className="size-4" />
        </Button>

        <div className="grid md:grid-cols-2">
          {/* Left Column - Content */}
          <div className="flex flex-col justify-between p-8 md:p-10 lg:p-12">
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-3">
                <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
                  <TrendingUp className="size-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
                  Grow Your Brand Performance
                </h2>
                <p className="text-base text-muted-foreground">
                  Track historical trends and optimize your AEO strategy with SearchFit.ai
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-lg">📈</span>
                  </div>
                  <div>
                    <p className="font-semibold">Historical Trend Analysis</p>
                    <p className="text-sm text-muted-foreground">
                      Monitor your AEO score changes and identify patterns over time
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-lg">🔔</span>
                  </div>
                  <div>
                    <p className="font-semibold">Instant Score Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified of score drops before they impact your traffic
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-lg">🎯</span>
                  </div>
                  <div>
                    <p className="font-semibold">Competitor Benchmarking</p>
                    <p className="text-sm text-muted-foreground">
                      Compare your performance against all 19 competitors
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 space-y-4">
              <Button
                asChild
                size="lg"
                className="w-full text-base font-semibold shadow-md"
              >
                <Link href={ctaLink}>
                  {ctaText}
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                {isWaitlistMode ? 'Be the first to know when we launch' : 'No payment required • Cancel anytime'}
              </p>
              <button
                onClick={() => setIsVisible(false)}
                className="w-full text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Maybe later
              </button>
            </div>
          </div>

          {/* Right Column - Image/Visual */}
          <div className="relative hidden overflow-hidden rounded-r-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background md:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />

            {/* Placeholder for actual image/chart */}
            <div className="flex h-full items-center justify-center p-8">
              <div className="relative w-full max-w-md space-y-4">
                {/* Mock chart/graph visual */}
                <div className="rounded-xl border border-primary/20 bg-background p-6 shadow-lg">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-semibold">AEO Score Trend</span>
                    <span className="text-xs text-muted-foreground">Last 90 days</span>
                  </div>

                  {/* Simple line chart visualization */}
                  <div className="space-y-2">
                    <div className="flex items-end gap-1 h-32">
                      {[45, 52, 48, 58, 65, 62, 70, 75, 78, 82, 85, 88].map((height, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t bg-gradient-to-t from-primary/60 to-primary transition-all hover:from-primary/80 hover:to-primary/90"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2">
                    <TrendingUp className="size-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">+43% growth</span>
                  </div>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  See your brand&apos;s growth over time
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

