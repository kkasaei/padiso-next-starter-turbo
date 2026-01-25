'use client';

import {
  Sparkles,
  CheckCircle,
  Lightbulb,
} from 'lucide-react';
import { Badge } from '@workspace/ui/components/badge';
import { cn } from '@/lib/utils';
import type { PageAnalysis } from './types';

// ============================================================
// HELPERS
// ============================================================
function getStatusColor(status: string) {
  switch (status) {
    case 'excellent':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'good':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'needs-improvement':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'poor':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
}

function getImpactBadge(impact?: 'high' | 'medium' | 'low') {
  if (!impact) return null;
  const colors = {
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  };
  return <Badge className={cn('capitalize', colors[impact])}>{impact} impact</Badge>;
}

// ============================================================
// AEO READINESS CARD
// ============================================================
interface AEOReadinessCardProps {
  aeoReadiness: PageAnalysis['aeoReadiness'];
}

function AEOReadinessCard({ aeoReadiness }: AEOReadinessCardProps) {
  const factors = [
    { key: 'structuredData', label: 'Structured Data' },
    { key: 'contentClarity', label: 'Content Clarity' },
    { key: 'answerability', label: 'Answerability' },
    { key: 'semanticMarkup', label: 'Semantic Markup' },
  ] as const;

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <span className="text-lg font-semibold">AEO Readiness</span>
        </div>
        <p className="text-sm text-muted-foreground">
          How well optimized this page is for AI search engines
        </p>
      </div>
      <div className="flex w-full flex-col rounded-3xl bg-card p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center justify-center h-20 w-20 rounded-full bg-purple-100 dark:bg-purple-900/30">
            <span className="text-3xl font-semibold text-purple-700 dark:text-purple-400">
              {aeoReadiness.score}
            </span>
          </div>
          <Badge className={getStatusColor(aeoReadiness.status)}>
            {aeoReadiness.status.replace('-', ' ')}
          </Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {factors.map((factor) => (
            <div key={factor.key} className="space-y-2">
              <span className="text-xs text-muted-foreground">{factor.label}</span>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${aeoReadiness.factors[factor.key]}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-8 text-right">
                  {aeoReadiness.factors[factor.key]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// STRENGTHS CARD
// ============================================================
interface StrengthsCardProps {
  strengths: PageAnalysis['strengths'];
}

function StrengthsCard({ strengths }: StrengthsCardProps) {
  if (!strengths || strengths.length === 0) return null;

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-lg font-semibold">Strengths</span>
        </div>
      </div>
      <div className="flex w-full flex-col rounded-3xl bg-card divide-y divide-border">
        {strengths.map((item, index) => (
          <div key={index} className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{item.title}</span>
                  {getImpactBadge(item.impact)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// RECOMMENDATIONS CARD
// ============================================================
interface RecommendationsCardProps {
  recommendations: PageAnalysis['recommendations'];
}

function RecommendationsCard({ recommendations }: RecommendationsCardProps) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <span className="text-lg font-semibold">Recommendations</span>
        </div>
      </div>
      <div className="flex w-full flex-col rounded-3xl bg-card divide-y divide-border">
        {recommendations.map((item, index) => (
          <div key={index} className="p-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-4 w-4 text-yellow-500 mt-1 shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{item.title}</span>
                  {getImpactBadge(item.impact)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// ANALYSIS TAB CONTENT
// ============================================================
interface AnalysisTabContentProps {
  analysis: PageAnalysis | null;
}

export function AnalysisTabContent({ analysis }: AnalysisTabContentProps) {
  if (!analysis) {
    return (
      <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
        <div className="flex w-full flex-col items-center justify-center rounded-3xl bg-card p-12">
          <Sparkles className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No Analysis Available</h3>
          <p className="text-sm text-muted-foreground mt-2 text-center max-w-md">
            AI analysis has not been completed for this page yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {analysis.aeoReadiness && (
        <AEOReadinessCard aeoReadiness={analysis.aeoReadiness} />
      )}
      {analysis.strengths && analysis.strengths.length > 0 && (
        <StrengthsCard strengths={analysis.strengths} />
      )}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <RecommendationsCard recommendations={analysis.recommendations} />
      )}
    </div>
  );
}

