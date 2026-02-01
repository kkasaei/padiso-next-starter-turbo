'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Area, AreaChart } from 'recharts';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@workspace/ui/components/chart';
import { cn } from '@/lib/utils';

const DATA = [
  { name: 'January', value: 400 },
  { name: 'February', value: 300 },
  { name: 'March', value: 600 },
  { name: 'April', value: 400 },
  { name: 'May', value: 500 },
  { name: 'June', value: 350 }
];

const MotionCard = motion.create(Card);

export function BentoAnalyticsCard({
  className,
  ...other
}: React.ComponentPropsWithoutRef<typeof MotionCard>): React.JSX.Element {
  return (
    <MotionCard
      className={cn(
        'relative h-[300px] max-h-[300px] overflow-hidden pb-0',
        className
      )}
      {...other}
    >
      <CardHeader>
        <CardTitle className="text-xl font-semibold">AEO Tracking</CardTitle>
      </CardHeader>
      <CardContent className="overflow-hidden p-0 pb-6">
        <p className="mb-6 line-clamp-2 px-6 text-sm text-muted-foreground">
          Get instant insights into your SEO performance across OpenAI, Claude, Gemini, and Perplexity.
        </p>
        <div className="w-full max-w-md">
          <ChartContainer
            config={{}}
            className="h-[150px] min-w-full overflow-hidden"
          >
            <AreaChart
              data={DATA}
              margin={{ top: 5, right: 0, left: 0, bottom: -5 }}
            >
              <defs>
                <linearGradient
                  id="gradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--primary)"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--primary)"
                fill="url(#gradient)"
                strokeWidth={2}
                isAnimationActive={false}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    labelFormatter={(_: unknown, payload: any) => payload[0]?.payload?.name ?? ''}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => (
                      <>
                        <strong>{value ?? 0}</strong> Leads
                      </>
                    )}
                  />
                }
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </MotionCard>
  );
}
