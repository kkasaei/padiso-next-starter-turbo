import * as React from 'react';

import type { AEOReport } from '@/lib/shcmea/aeo-report';
import { ReportActions } from './ReportActions';
import { ScorePreviewCard } from './ScorePreviewCard';
import { calculateTotalQueries } from '@/lib/report-utils';

interface ReportHeroSectionProps {
  domain: string;
  data: AEOReport;
  averageScore: number;
  onShare: () => void;
  onDownload?: () => void;
  isDownloading?: boolean;
  isUnlocked?: boolean;
}

export function ReportHeroSection({
  domain,
  data,
  averageScore,
  onShare,
  onDownload,
  isDownloading = false,
  isUnlocked = false
}: ReportHeroSectionProps): React.JSX.Element {
  const totalQueries = calculateTotalQueries(data.marketCompetition);

  return (
    <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
      {/* Left side: Domain and description */}
      <div className="flex-1 space-y-6 text-center md:text-left">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            {decodeURIComponent(domain)}
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            Answer Engine Optimization Performance Analysis
          </p>
        </div>

        {/* Stats preview */}
        <div className="flex flex-wrap justify-center gap-6 md:justify-start">
          <StatItem
            value={data.llmProviders.length}
            label="AI Platforms"
          />
          <Divider />
          <StatItem
            value={totalQueries.toLocaleString()}
            label="Queries Analyzed"
          />
          <Divider />
          <StatItem
            value={data.contentIdeas.length}
            label="Recommendations"
          />
        </div>

        {/* Actions - Desktop & Mobile */}
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:justify-start">
          <ReportActions
            variant="mobile"
            onShare={onShare}
            onDownload={onDownload}
            isDownloading={isDownloading}
            isUnlocked={isUnlocked}
          />
          <ReportActions
            variant="desktop"
            onShare={onShare}
            onDownload={onDownload}
            isDownloading={isDownloading}
            isUnlocked={isUnlocked}
          />
        </div>
      </div>

      {/* Right side: Score preview card */}
      <ScorePreviewCard
        averageScore={averageScore}
        providers={data.llmProviders}
      />
    </div>
  );
}

function StatItem({ value, label }: { value: string | number; label: string }): React.JSX.Element {
  return (
    <div className="space-y-1">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Divider(): React.JSX.Element {
  return <div className="h-auto w-px bg-border" />;
}
