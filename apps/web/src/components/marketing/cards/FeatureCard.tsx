'use client';

import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';
import { cn } from '@/lib/utils';

const MotionCard = motion.create(Card);

interface FeatureCardProps
  extends React.ComponentPropsWithoutRef<typeof MotionCard> {
  icon: LucideIcon;
  title: string;
  description: string;
  stats?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  stats,
  className,
  ...other
}: FeatureCardProps): React.JSX.Element {
  return (
    <MotionCard
      className={cn('relative h-full overflow-hidden', className)}
      {...other}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <Icon className="size-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {stats && (
          <p className="text-sm font-semibold text-foreground">{stats}</p>
        )}
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </MotionCard>
  );
}

