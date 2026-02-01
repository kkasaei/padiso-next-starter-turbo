'use client';

import { cn } from '@workspace/common/lib';
import type { ScoreCardProps } from './types';

// ============================================================
// HELPERS
// ============================================================
function getScoreColor(score: number | null): string {
  if (score === null) return '#9CA3AF';
  if (score >= 80) return '#22C55E';
  if (score >= 60) return '#EAB308';
  if (score >= 40) return '#F97316';
  return '#EF4444';
}

function getScoreTextColor(score: number | null): string {
  if (score === null) return 'text-gray-400';
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
  if (score >= 40) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

// ============================================================
// SCORE CIRCLE
// ============================================================
export function ScoreCircle({ score, label, size = 'md' }: ScoreCardProps) {
  const displayScore = score ?? 0;
  const sizeConfig = {
    sm: { container: 'h-16 w-16', radius: 28, stroke: 5, text: 'text-lg' },
    md: { container: 'h-20 w-20', radius: 36, stroke: 6, text: 'text-2xl' },
    lg: { container: 'h-28 w-28', radius: 50, stroke: 8, text: 'text-3xl' },
  };
  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;
  const svgSize = (config.radius + config.stroke) * 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative ${config.container}`}>
        <svg className={`${config.container} -rotate-90 transform`} viewBox={`0 0 ${svgSize} ${svgSize}`}>
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={config.radius}
            stroke="currentColor"
            strokeWidth={config.stroke}
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={config.radius}
            stroke={getScoreColor(score)}
            strokeWidth={config.stroke}
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: score === null ? circumference : strokeDashoffset,
              transition: 'stroke-dashoffset 0.5s ease-in-out',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(config.text, 'font-semibold', getScoreTextColor(score))}>
            {score ?? '-'}
          </span>
        </div>
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

// ============================================================
// SCORE CARDS GRID
// ============================================================
interface ScoreCardsGridProps {
  overallScore: number | null;
  seoScore: number | null;
  aeoScore: number | null;
  contentScore: number | null;
  technicalScore: number | null;
}

export function ScoreCardsGrid({
  overallScore,
  seoScore,
  aeoScore,
  contentScore,
  technicalScore,
}: ScoreCardsGridProps) {
  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      <div className="flex w-full flex-col rounded-3xl bg-card">
        <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-border">
          {/* Overall Score - Larger */}
          <div className="flex flex-col items-center justify-center py-6 px-4 col-span-2 md:col-span-1">
            <ScoreCircle score={overallScore} label="Overall" size="lg" />
          </div>
          
          {/* SEO Score */}
          <div className="flex flex-col items-center justify-center py-6 px-4">
            <ScoreCircle score={seoScore} label="SEO" size="md" />
          </div>
          
          {/* AEO Score */}
          <div className="flex flex-col items-center justify-center py-6 px-4">
            <ScoreCircle score={aeoScore} label="AEO" size="md" />
          </div>
          
          {/* Content Score */}
          <div className="flex flex-col items-center justify-center py-6 px-4">
            <ScoreCircle score={contentScore} label="Content" size="md" />
          </div>
          
          {/* Technical Score */}
          <div className="flex flex-col items-center justify-center py-6 px-4">
            <ScoreCircle score={technicalScore} label="Technical" size="md" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ISSUES SUMMARY CARDS
// ============================================================
interface IssuesSummaryCardsProps {
  critical: number;
  warning: number;
  info: number;
}

export function IssuesSummaryCards({ critical, warning, info }: IssuesSummaryCardsProps) {
  if (critical === 0 && warning === 0 && info === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Critical */}
      <div className={cn(
        'flex flex-col rounded-xl p-4',
        critical > 0
          ? 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900'
          : 'bg-muted/30 border border-transparent'
      )}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-red-700 dark:text-red-400">Critical</span>
          <div className="h-2 w-2 rounded-full bg-red-500" />
        </div>
        <span className="text-3xl font-light text-red-700 dark:text-red-400 mt-2">
          {critical}
        </span>
      </div>

      {/* Warning */}
      <div className={cn(
        'flex flex-col rounded-xl p-4',
        warning > 0
          ? 'bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900'
          : 'bg-muted/30 border border-transparent'
      )}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Warnings</span>
          <div className="h-2 w-2 rounded-full bg-yellow-500" />
        </div>
        <span className="text-3xl font-light text-yellow-700 dark:text-yellow-400 mt-2">
          {warning}
        </span>
      </div>

      {/* Info */}
      <div className={cn(
        'flex flex-col rounded-xl p-4',
        info > 0
          ? 'bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900'
          : 'bg-muted/30 border border-transparent'
      )}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Info</span>
          <div className="h-2 w-2 rounded-full bg-blue-500" />
        </div>
        <span className="text-3xl font-light text-blue-700 dark:text-blue-400 mt-2">
          {info}
        </span>
      </div>
    </div>
  );
}

