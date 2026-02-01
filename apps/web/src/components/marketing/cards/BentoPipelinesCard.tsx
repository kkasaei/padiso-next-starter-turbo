'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

import { Badge } from '@workspace/ui/components/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';
import { Progress } from '@workspace/ui/components/progress';
import { cn } from '@workspace/common/lib';

const DATA = [
  {
    id: 'excellent',
    label: 'Excellent (90-100)',
    deals: 124,
    value: 32
  },
  {
    id: 'good',
    label: 'Good (75-89)',
    deals: 187,
    value: 48
  },
  {
    id: 'needs-improvement',
    label: 'Needs Improvement (50-74)',
    deals: 65,
    value: 17
  },
  {
    id: 'poor',
    label: 'Poor (25-49)',
    deals: 12,
    value: 3
  },
  {
    id: 'critical',
    label: 'Critical (0-24)',
    deals: 0,
    value: 0
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
        <p className="line-clamp-2 text-sm text-muted-foreground lg:max-w-[55%]">
          Real-time SEO scoring and Live suggestions for keywords, meta descriptions, readability
        </p>
        <div className="relative min-h-[200px] overflow-hidden">
          <div className="group absolute inset-0 top-2 flex flex-col justify-between">
            {DATA.map((stage, index) => (
              <div
                key={stage.id}
                className="hover:opacity-100! group-hover:opacity-40"
              >
                <motion.div
                  className="flex items-center space-x-2 rounded-md pr-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Badge
                    id={`stage-${stage.label}`}
                    variant="secondary"
                    className="w-44 shrink-0 justify-center text-xs"
                  >
                    {stage.label}
                  </Badge>
                  <Progress
                    aria-labelledby={`stage-${stage.label}`}
                    value={stage.value}
                    className="flex-1"
                  />
                  <span className="w-8 text-right text-sm font-medium">
                    {stage.deals}
                  </span>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </MotionCard>
  );
}
