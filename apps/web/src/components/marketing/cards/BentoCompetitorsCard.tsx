'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, Users } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';
import { cn } from '@workspace/common/lib';

const COMPETITORS = [
  { name: 'competitor-a.com', visibility: 72, change: -5, trend: 'down' },
  { name: 'competitor-b.com', visibility: 68, change: +3, trend: 'up' },
  { name: 'competitor-c.com', visibility: 54, change: -2, trend: 'down' },
  { name: 'your-brand.com', visibility: 87, change: +12, trend: 'up', isYou: true },
];

const MotionCard = motion.create(Card);

export function BentoCompetitorsCard({
  className,
  ...other
}: React.ComponentPropsWithoutRef<typeof MotionCard>): React.JSX.Element {
  return (
    <MotionCard
      className={cn(
        'relative h-[300px] max-h-[300px] overflow-hidden',
        className
      )}
      {...other}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <Users className="size-5 text-primary" />
          Competitor Tracking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Monitor how you stack up against competitors in AI visibility.
        </p>
        <div className="space-y-3">
          {COMPETITORS.sort((a, b) => b.visibility - a.visibility).map((competitor, index) => (
            <motion.div
              key={competitor.name}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-2.5",
                competitor.isYou && "border-primary bg-primary/5"
              )}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                index === 0 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-muted text-muted-foreground"
              )}>
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-sm font-medium",
                    competitor.isYou && "text-primary"
                  )}>
                    {competitor.isYou ? 'You' : competitor.name}
                  </span>
                  {competitor.isYou && (
                    <span className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-medium text-primary-foreground">
                      #1
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-full",
                      competitor.isYou ? "bg-primary" : "bg-muted-foreground/50"
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${competitor.visibility}%` }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  />
                </div>
                <span className="w-8 text-right text-xs font-semibold">{competitor.visibility}%</span>
                <div className={cn(
                  "flex items-center gap-0.5 text-[10px] font-medium",
                  competitor.trend === 'up' ? "text-green-600" : "text-red-600"
                )}>
                  {competitor.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {competitor.change > 0 ? '+' : ''}{competitor.change}%
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </MotionCard>
  );
}
