'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';
import { cn } from '@workspace/common/lib';

const DATA = [
  {
    id: 'excellent',
    label: 'Excellent (90-100)',
    count: 124,
    value: 32,
    color: '#10b981'
  },
  {
    id: 'good',
    label: 'Good (75-89)',
    count: 187,
    value: 48,
    color: '#22c55e'
  },
  {
    id: 'needs-improvement',
    label: 'Needs Improvement (50-74)',
    count: 65,
    value: 17,
    color: '#3b82f6'
  },
  {
    id: 'poor',
    label: 'Poor (25-49)',
    count: 12,
    value: 3,
    color: '#f59e0b'
  },
  {
    id: 'critical',
    label: 'Critical (0-24)',
    count: 0,
    value: 0,
    color: '#ef4444'
  }
];

const MotionCard = motion.create(Card);

export function BentoPipelinesCard({
  className,
  ...other
}: React.ComponentPropsWithoutRef<typeof MotionCard>): React.JSX.Element {
  return (
    <MotionCard
      className={cn(
        'relative h-[380px] max-h-[380px] overflow-hidden',
        className
      )}
      {...other}
    >
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Content Optimization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Real-time SEO scoring and suggestions for keywords, meta descriptions, readability
        </p>
        <div className="space-y-3 pt-2">
          {DATA.map((stage, index) => (
            <motion.div
              key={stage.id}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <span className="w-[140px] shrink-0 text-xs text-muted-foreground">
                {stage.label}
              </span>
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ backgroundColor: stage.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${stage.value}%` }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                />
              </div>
              <span className="w-8 text-right text-sm font-medium">
                {stage.count}
              </span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </MotionCard>
  );
}
