'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Link2, TrendingUp } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';
import { cn } from '@workspace/common/lib';

const BACKLINK_STATS = [
  { label: 'Total Backlinks', value: '2,847', change: '+124', trend: 'up' },
  { label: 'Referring Domains', value: '312', change: '+18', trend: 'up' },
  { label: 'Domain Authority', value: '54', change: '+3', trend: 'up' },
];

const RECENT_LINKS = [
  { domain: 'techcrunch.com', type: 'DoFollow', da: 94 },
  { domain: 'producthunt.com', type: 'DoFollow', da: 91 },
  { domain: 'medium.com', type: 'NoFollow', da: 96 },
];

const MotionCard = motion.create(Card);

export function BentoBacklinksCard({
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
        <CardTitle className="text-xl font-semibold">Backlinks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Monitor and analyze your backlink profile in real-time.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {BACKLINK_STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="rounded-lg border bg-muted/30 p-2 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="text-lg font-bold">{stat.value}</div>
              <div className="flex items-center justify-center gap-1 text-[10px] text-green-600">
                <TrendingUp className="h-2.5 w-2.5" />
                {stat.change}
              </div>
              <div className="text-[10px] text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Recent Links</div>
          {RECENT_LINKS.map((link, index) => (
            <motion.div
              key={link.domain}
              className="flex items-center justify-between rounded-md border px-2 py-1.5"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
            >
              <div className="flex items-center gap-2">
                <Link2 className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium">{link.domain}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded",
                  link.type === 'DoFollow' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                )}>
                  {link.type}
                </span>
                <span className="text-[10px] text-muted-foreground">DA {link.da}</span>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </MotionCard>
  );
}
