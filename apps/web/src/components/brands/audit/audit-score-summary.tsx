'use client';

import type { WebsiteAuditDto } from '@/lib/shcmea/types/dtos/audit-dto';
import { ScoreCardsGrid, IssuesSummaryCards } from './score-cards';

// ============================================================
// PROPS
// ============================================================
interface AuditScoreSummaryProps {
  audit: WebsiteAuditDto;
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export function AuditScoreSummary({ audit }: AuditScoreSummaryProps) {
  return (
    <>
      {/* Score Cards Grid */}
      <ScoreCardsGrid
        overallScore={audit.overallScore}
        seoScore={audit.seoScore}
        aeoScore={audit.accessibilityScore}
        contentScore={audit.contentScore}
        technicalScore={audit.performanceScore}
      />

      {/* Issues Summary */}
      <IssuesSummaryCards
        critical={audit.criticalIssues ?? 0}
        warning={audit.warningIssues ?? 0}
        info={audit.infoIssues ?? 0}
      />
    </>
  );
}
