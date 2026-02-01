import * as React from 'react';

import type { AEOReport } from '@/lib/shcmea/aeo-report';
import { AEOScoreCard } from '@/components/marketing/aeo-grader/AeoScoreCard';
import { BrandRecognition } from '@/components/marketing/aeo-grader/BrandRecognition';
import { BrandPositioningChart } from '@/components/marketing/aeo-grader/BrandPositioningChart';
import { InlineCTACard } from '@/components/marketing/aeo-grader/InlineCtaCard';
import { SentimentAnalysis } from '@/components/marketing/aeo-grader/SentimentAnalysis';
import { MegaUnlockOverlay } from '@/components/marketing/aeo-grader/MegaUnlockOverlay';
import { MarketCompetition } from '@/components/marketing/aeo-grader/MarketCompetition';
import { AnalysisSummary } from '@/components/marketing/aeo-grader/AnalysisSummary';
import { ContextualAnalysis } from '@/components/marketing/aeo-grader/ContextualAnalysis';
import { ContentIdeasLimited } from '@/components/marketing/aeo-grader/ContentIdeasLimited';
import { PREMIUM_SECTIONS, REPORT_CONFIG } from '@workspace/common/constants';

interface ReportContentSectionsProps {
  data: AEOReport;
  domain: string;
  isUnlocked?: boolean;
  onUnlockSuccess?: () => void;
}

/**
 * Main content sections of the report
 * Organized in a logical flow with premium sections protected by unlock overlay
 */
export function ReportContentSections({
  data,
  domain,
  isUnlocked = false,
  onUnlockSuccess
}: ReportContentSectionsProps): React.JSX.Element {
  return (
    <div className="space-y-16">
      {/* Free Sections */}
      <AEOScoreCard providers={data.llmProviders} />
      <BrandRecognition providers={data.brandRecognition} />
      <BrandPositioningChart
        xAxisLabel={data.brandPositioning.xAxisLabel}
        yAxisLabel={data.brandPositioning.yAxisLabel}
        providers={data.brandPositioning.providers}
      />

      {/* Inline CTA Card */}
      <InlineCTACard brandArchetype="Innovator" />

      <SentimentAnalysis providers={data.sentimentAnalysis} />

      {/* Premium Sections with Mega Unlock */}
      <MegaUnlockOverlay
        sections={PREMIUM_SECTIONS}
        domain={domain}
        unlocked={isUnlocked}
        onUnlockSuccess={onUnlockSuccess}
      >
        <div className="space-y-16">
          <MarketCompetition segments={data.marketCompetition} />
          <AnalysisSummary
            strengths={data.analysisSummary.strengths}
            opportunities={data.analysisSummary.opportunities}
            marketTrajectory={data.analysisSummary.marketTrajectory}
          />
          <ContextualAnalysis narrativeThemes={data.narrativeThemes} />
          <ContentIdeasLimited
            ideas={data.contentIdeas}
            visibleCount={REPORT_CONFIG.VISIBLE_CONTENT_IDEAS}
          />
        </div>
      </MegaUnlockOverlay>
    </div>
  );
}
