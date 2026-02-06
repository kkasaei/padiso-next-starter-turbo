'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';
import { cn } from '@workspace/common/lib';

const AUDIT_ITEMS = [
  { label: 'Critical Issues', count: 3, icon: XCircle, color: '#ef4444' },
  { label: 'Warnings', count: 12, icon: AlertTriangle, color: '#f59e0b' },
  { label: 'Passed', count: 87, icon: CheckCircle2, color: '#10b981' },
];

const HEALTH_SCORE = 78;

const MotionCard = motion.create(Card);

export function BentoTechnicalAuditCard({
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
        <CardTitle className="text-xl font-semibold">Technical Audit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Comprehensive SEO analysis and optimization recommendations.
        </p>
        <div className="flex items-center gap-4">
          {/* Health Score Circle */}
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
            <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#10b981"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={251.2}
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * HEALTH_SCORE) / 100 }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold">{HEALTH_SCORE}</span>
              <span className="text-[10px] text-muted-foreground">Health</span>
            </div>
          </div>
          {/* Stats */}
          <div className="flex-1 space-y-2">
            {AUDIT_ITEMS.map((item, index) => (
              <motion.div
                key={item.label}
                className="flex items-center justify-between"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" style={{ color: item.color }} />
                  <span className="text-xs">{item.label}</span>
                </div>
                <span className="text-sm font-semibold">{item.count}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="text-xs font-medium text-muted-foreground">Top Issues</div>
          <div className="flex flex-wrap gap-1.5">
            {['Missing meta descriptions', 'Slow page speed', 'Broken links'].map((issue, i) => (
              <span key={i} className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] text-red-700 dark:bg-red-900/30 dark:text-red-400">
                {issue}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </MotionCard>
  );
}
