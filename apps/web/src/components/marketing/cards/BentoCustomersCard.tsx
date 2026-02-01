'use client';

import * as React from 'react';
import { SearchIcon, TargetIcon, TrendingDownIcon, TrendingUpIcon, UsersIcon } from 'lucide-react';
import { motion } from 'framer-motion';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';
import { cn } from '@workspace/common/lib';

const STATS = [
  {
    id: 'prompts',
    label: 'AI Prompts',
    value: '25',
    change: '+12.5%',
    trend: 'up',
    icon: SearchIcon
  },
  {
    id: 'keywords',
    label: 'SEO Keywords',
    value: '123',
    change: '+8.2%',
    trend: 'up',
    icon: TargetIcon
  },
  {
    id: 'competitors',
    label: 'Your Competitors',
    value: '10',
    change: '-2.1%',
    trend: 'down',
    icon: UsersIcon
  }
] as const;

const MotionCard = motion.create(Card);

export function BentoCustomersCard({
  className,
  ...other
}: React.ComponentPropsWithoutRef<typeof MotionCard>): React.JSX.Element {
  return (
    <MotionCard
      className={cn(
        'relative h-[380px] max-h-[380px] overflow-hidden',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...other}
    >
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          Track your AI visibility performance with real-time analytics across all major AI platforms.
        </p>
        <div className="grid gap-3">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.id}
              className="flex items-center justify-between rounded-lg border p-3 shadow-xs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold">{stat.value}</span>
                <div className={cn(
                  "flex items-center gap-0.5 text-xs font-medium",
                  stat.trend === 'up' ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                  {stat.trend === 'up' ? (
                    <TrendingUpIcon className="h-3 w-3" />
                  ) : (
                    <TrendingDownIcon className="h-3 w-3" />
                  )}
                  {stat.change}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </MotionCard>
  );
}
