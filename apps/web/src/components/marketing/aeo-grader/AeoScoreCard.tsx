'use client';

import * as React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Image from 'next/image';

import { Badge } from '@workspace/ui/components/badge';
import { cn } from '@workspace/common/lib';

interface LLMProvider {
  name: string;
  logo: string;
  score: number;
  status: 'excellent' | 'good' | 'average' | 'needs-improvement';
  trend?: 'up' | 'down' | 'stable';
}

interface AEOScoreCardProps {
  providers: LLMProvider[];
}

const getStatusColor = (
  status: LLMProvider['status']
): {
  bg: string;
  text: string;
  progress: string;
} => {
  switch (status) {
    case 'excellent':
      return {
        bg: 'bg-green-50 dark:bg-green-950',
        text: 'text-green-700 dark:text-green-400',
        progress: 'bg-green-500'
      };
    case 'good':
      return {
        bg: 'bg-blue-50 dark:bg-blue-950',
        text: 'text-blue-700 dark:text-blue-400',
        progress: 'bg-blue-500'
      };
    case 'average':
      return {
        bg: 'bg-yellow-50 dark:bg-yellow-950',
        text: 'text-yellow-700 dark:text-yellow-400',
        progress: 'bg-yellow-500'
      };
    case 'needs-improvement':
      return {
        bg: 'bg-red-50 dark:bg-red-950',
        text: 'text-red-700 dark:text-red-400',
        progress: 'bg-red-500'
      };
    default:
      // Fallback for undefined or unexpected status values
      return {
        bg: 'bg-gray-50 dark:bg-gray-950',
        text: 'text-gray-700 dark:text-gray-400',
        progress: 'bg-gray-500'
      };
  }
};

const getStatusLabel = (status: LLMProvider['status']): string => {
  switch (status) {
    case 'excellent':
      return 'Excellent';
    case 'good':
      return "You're on the right track";
    case 'average':
      return 'Average Performance';
    case 'needs-improvement':
      return 'Needs Improvement';
    default:
      return 'Status Unknown';
  }
};

const TrendIcon = ({ trend }: { trend?: LLMProvider['trend'] }) => {
  if (trend === 'up')
    return <TrendingUp className="size-4 text-green-500" />;
  if (trend === 'down')
    return <TrendingDown className="size-4 text-red-500" />;
  if (trend === 'stable')
    return <Minus className="size-4 text-muted-foreground" />;
  return null;
};

export function AEOScoreCard({
  providers
}: AEOScoreCardProps): React.JSX.Element {
  // Calculate average score
  const averageScore = React.useMemo(() => {
    if (!Array.isArray(providers) || providers.length === 0) return 0;
    const sum = providers.reduce((acc, provider) => acc + provider.score, 0);
    return Math.round(sum / providers.length);
  }, [providers]);

  // Dynamic messaging based on score
  const getScoreMessage = () => {
    if (averageScore >= 70) {
      return {
        title: "You're performing well",
        description: "Your brand has strong visibility in AI search engines. Review the report below to maintain your competitive edge and identify opportunities to further enhance your answer engine performance."
      };
    } else if (averageScore >= 50) {
      return {
        title: "You're on the right track",
        description: "There's room to further optimize for AEO. Review the report below to see your brand's answer engine performance versus competitors and areas for growth."
      };
    } else {
      return {
        title: "Significant opportunity for growth",
        description: "Your brand has substantial room for improvement in AI search visibility. Review the detailed analysis below to understand where you stand versus competitors and discover actionable strategies to boost your answer engine presence."
      };
    }
  };

  const scoreMessage = getScoreMessage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">AEO Score (Overall)</h2>
        <p className="text-muted-foreground">
          Your Answer Engine Optimization performance across major AI platforms
        </p>
      </div>

      {/* Score Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {Array.isArray(providers) && providers.map((provider) => {
          const colors = getStatusColor(provider.status);
          const circumference = 2 * Math.PI * 54;
          const offset = circumference - (provider.score / 100) * circumference;

          return (
            <div
              key={provider.name}
              className="group relative overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:shadow-2xl"
            >
              {/* Gradient Background */}
              <div className={cn(
                'absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100',
                colors.bg
              )} />

              <div className="relative p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 rounded-xl bg-background p-2 shadow-sm">
                      <Image
                        src={provider.logo}
                        alt={provider.name}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <span className="font-semibold">{provider.name}</span>
                  </div>
                  {provider.trend && (
                    <div className="rounded-full bg-background/80 p-2 backdrop-blur-sm">
                      <TrendIcon trend={provider.trend} />
                    </div>
                  )}
                </div>

                {/* Circular Progress */}
                <div className="relative mb-6 flex justify-center">
                  <svg className="size-40 -rotate-90 transform">
                    {/* Background circle */}
                    <circle
                      cx="80"
                      cy="80"
                      r="54"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      className="text-muted/20"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="80"
                      cy="80"
                      r="54"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      className={cn('transition-all duration-1000', colors.text)}
                    />
                  </svg>

                  {/* Center text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={cn('text-5xl font-bold', colors.text)}>
                      {provider.score}
                    </div>
                    <div className="text-sm text-muted-foreground">/100</div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-center">
                  <Badge
                    variant="secondary"
                    className={cn(
                      'px-4 py-1.5 text-sm font-medium',
                      colors.text,
                      colors.bg
                    )}
                  >
                    {getStatusLabel(provider.status)}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note */}
      <div className="relative overflow-hidden rounded-xl border bg-linear-to-br from-card to-card/50 p-6 backdrop-blur-sm">
        <div className="absolute right-0 top-0 size-32 translate-x-16 -translate-y-16 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <TrendingUp className="size-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{scoreMessage.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {scoreMessage.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



