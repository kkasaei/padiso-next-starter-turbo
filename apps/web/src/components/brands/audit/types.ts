/**
 * Audit Module Types
 */

import type { PageAuditDto, PageIssue, PageAnalysis, PageMetadata } from '@workspace/common/lib/shcmea/types/dtos/audit-dto';

export type { PageAuditDto, PageIssue, PageAnalysis, PageMetadata };

export interface ScoreCardProps {
  score: number | null;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface IssuesSummary {
  critical: number;
  warning: number;
  info: number;
}

