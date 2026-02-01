'use client';

import * as React from 'react';
import {
  ArrowLeftRightIcon,
  CalendarIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';
import { cn } from '@/lib/utils';

function RedditIcon(
  props: React.SVGAttributes<SVGSVGElement>
): React.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.249c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.249 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  );
}

function TikTokIcon(
  props: React.SVGAttributes<SVGSVGElement>
): React.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const DATA_MAGIC_INBOX = [
  { icon: RedditIcon },
  { icon: TikTokIcon },
  { icon: CalendarIcon }
];

const MotionCard = motion.create(Card);

export function BentoMagicInboxCard({
  className,
  ...other
}: React.ComponentPropsWithoutRef<typeof MotionCard>): React.JSX.Element {
  const [active, setActive] = React.useState<number>(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % 3);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <MotionCard
      className={cn(
        'relative h-[300px] max-h-[300px] overflow-hidden',
        className
      )}
      {...other}
    >
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Workflows</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          Orchestrate all your trcking into powerful automations to produce volume.
        </p>
        <div
          aria-hidden="true"
          className="pointer-events-none relative h-[142px] flex-auto select-none overflow-hidden"
        >
          <div className="relative flex h-full flex-col items-center justify-center">
            {/* Rings */}
            <div className="absolute blur-[1px]">
              <div className="absolute left-1/2 top-1/2 ml-[calc(-216/2/16*1rem)] mt-[calc(-216/2/16*1rem)] size-[calc(216/16*1rem)] rounded-full border opacity-60 dark:opacity-100" />
              <div className="opacity-12.5 absolute left-1/2 top-1/2 ml-[calc(-280/2/16*1rem)] mt-[calc(-280/2/16*1rem)] size-[calc(280/16*1rem)] rounded-full border opacity-50 dark:opacity-90" />
              <div className="absolute left-1/2 top-1/2 ml-[calc(-344/2/16*1rem)] mt-[calc(-344/2/16*1rem)] size-[calc(344/16*1rem)] rounded-full border opacity-40 dark:opacity-80" />
              <div className="opacity-7.5 absolute left-1/2 top-1/2 ml-[calc(-408/2/16*1rem)] mt-[calc(-408/2/16*1rem)] size-[calc(408/16*1rem)] rounded-full border opacity-30 dark:opacity-70" />
            </div>
            {/* Icons */}
            <div className="flex flex-row gap-4">
              {DATA_MAGIC_INBOX.map(({ icon: Icon }, index) => (
                <div
                  key={index}
                  className={cn(
                    'transition duration-1000',
                    active === index ? 'opacity-100' : 'opacity-25'
                  )}
                >
                  <div className="size-10 rounded-full border-2 border-background ring-1 ring-border/80">
                    <Icon
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="relative aspect-128/55 w-32">
              {/* Connector */}
              <svg
                viewBox="0 0 128 55"
                fill="none"
                aria-hidden="true"
                className="absolute inset-0 size-full stroke-neutral-200 opacity-80 dark:stroke-neutral-800"
              >
                <path d="M64 0v25M8 0v8c0 8.837 7.163 16 16 16h24c8.837 0 16 7.163 16 16v15M120 0v8c0 8.837-7.163 16-16 16H80c-5.922 0-11.093 3.218-13.86 8" />
              </svg>
            </div>
            {/* Text */}
            <div className="mt-px flex flex-row items-center gap-2 whitespace-nowrap rounded-lg bg-secondary px-3 py-1.5 text-sm text-foreground">
              Social Media
              <ArrowLeftRightIcon className="size-3 shrink-0" />
              Communities
            </div>
          </div>
        </div>
      </CardContent>
    </MotionCard>
  );
}
