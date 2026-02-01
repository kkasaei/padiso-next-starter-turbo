import * as React from 'react';

import type { AEOReport } from '@/lib/shcmea/aeo-report';
import { AEOScoreCard } from '@/components/marketing/aeo-grader/aeo-score-card';
import { BrandRecognition } from '@/components/marketing/aeo-grader/brand-recognition';
import { BrandPositioningChart } from '@/components/marketing/aeo-grader/brand-positioning-chart';
import { InlineCTACard } from '@/components/marketing/aeo-grader/inline-cta-card';
import { SentimentAnalysis } from '@/components/marketing/aeo-grader/sentiment-analysis';
import { MegaUnlockOverlay } from '@/components/marketing/aeo-grader/mega-unlock-overlay';
import { MarketCompetition } from '@/components/marketing/aeo-grader/market-competition';
import { AnalysisSummary } from '@/components/marketing/aeo-grader/analysis-summary';
import { ContextualAnalysis } from '@/components/marketing/aeo-grader/contextual-analysis';
import { ContentIdeasLimited } from '@/components/marketing/aeo-grader/content-ideas-limited';
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
