'use client';

import * as React from 'react';
import {
  Lightbulb,
  Target,
  TrendingUp,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

import { Badge } from '@workspace/ui/components/badge';

interface AnalysisItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface AnalysisSummaryProps {
  strengths: AnalysisItem[];
  opportunities: AnalysisItem[];
  marketTrajectory?: {
    status: 'positive' | 'neutral' | 'negative';
    description: string;
  };
}

export function AnalysisSummary({
  strengths,
  opportunities,
  marketTrajectory
}: AnalysisSummaryProps): React.JSX.Element {
  const trajectoryColor =
    marketTrajectory?.status === 'positive'
      ? 'text-green-600 dark:text-green-400'
      : marketTrajectory?.status === 'negative'
        ? 'text-red-600 dark:text-red-400'
        : 'text-yellow-600 dark:text-yellow-400';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analysis Summary</h2>
        <p className="text-muted-foreground">
          Identifies strengths and growth opportunities for your brand based on
          sentiment analysis, customer feedback, and industry benchmarks.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {/* Key Strengths */}
        <div>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-2.5 shadow-lg">
              <CheckCircle2 className="size-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold">Key Strengths</h3>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {strengths.map((strength, index) => (
              <div
                key={index}
                className="group/strength rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50/50 p-5 shadow-md transition-all duration-300 hover:scale-105 hover:border-green-400 hover:shadow-xl dark:border-green-900 dark:from-green-950/30 dark:to-emerald-950/20"
              >
                <div className="mb-3 flex items-start gap-3">
                  <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/50">
                    {strength.icon || (
                      <Sparkles className="size-5 shrink-0 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <h4 className="font-bold text-green-900 dark:text-green-100">
                    {strength.title}
                  </h4>
                </div>
                <p className="text-sm font-medium leading-relaxed text-green-800/90 dark:text-green-200/80">
                  {strength.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Opportunities */}
        <div>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 p-2.5 shadow-lg">
              <Target className="size-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold">Growth Opportunities</h3>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {opportunities.map((opportunity, index) => (
              <div
                key={index}
                className="group/opportunity rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50/50 p-5 shadow-md transition-all duration-300 hover:scale-105 hover:border-blue-400 hover:shadow-xl dark:border-blue-900 dark:from-blue-950/30 dark:to-cyan-950/20"
              >
                <div className="mb-3 flex items-start gap-3">
                  <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/50">
                    {opportunity.icon || (
                      <Lightbulb className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <h4 className="font-bold text-blue-900 dark:text-blue-100">
                    {opportunity.title}
                  </h4>
                </div>
                <p className="text-sm font-medium leading-relaxed text-blue-800/90 dark:text-blue-200/80">
                  {opportunity.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Market Trajectory */}
        {marketTrajectory && (
          <div className="rounded-2xl border-2 bg-gradient-to-br from-muted/50 to-muted/30 p-6 shadow-lg">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 p-2">
                <TrendingUp className={`size-6 ${trajectoryColor}`} />
              </div>
              <h4 className="text-xl font-bold">Market Trajectory</h4>
              <Badge
                variant="secondary"
                className="ml-auto font-bold capitalize shadow-sm"
              >
                {marketTrajectory.status} growth
              </Badge>
            </div>
            <p className="text-sm font-medium leading-relaxed text-muted-foreground">
              {marketTrajectory.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}



