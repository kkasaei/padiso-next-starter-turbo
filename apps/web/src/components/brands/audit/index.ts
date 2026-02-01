/**
 * Audit Module Components
 *
 * Page audit and technical audit functionality.
 */

// ============================================================
// TYPES
// ============================================================
export * from './types';

// ============================================================
// CONSTANTS
// ============================================================
export {
  POLL_INTERVAL,
  PAGE_SIZE_OPTIONS,
  DEFAULT_PAGE_SIZE,
  AUDIT_STATUS_CONFIG,
  PAGE_STATUS_CONFIG,
  TABLE_COLUMNS,
  AUDIT_FEATURES,
  type AuditStatus,
  type PageStatus,
  type SortKey,
  type SortDirection,
} from './constants';

// ============================================================
// UTILITIES
// ============================================================
export {
  getScoreColor,
  getScoreTextColor,
  getScoreBgColor,
  sortPages,
  filterPagesBySearch,
  paginateItems,
  getPageNumbers,
  calculatePageStats,
  type PaginationResult,
  type PageStats,
} from './utils';

// ============================================================
// COMPONENTS - Score Cards
// ============================================================
export { ScoreCircle, ScoreCardsGrid, IssuesSummaryCards } from './ScoreCards';

// ============================================================
// COMPONENTS - Technical Audit Page
// ============================================================
export { AuditIntroSection } from './AuditIntroSection';
export { AuditHeader } from './AuditHeader';
export { AuditProgressSection } from './AuditProgressSection';
export { AuditPagesTable } from './AuditPagesTable';
export { AuditScoreSummary } from './AuditScoreSummary';
export { AuditMetricsGrid } from './AuditMetricsGrid';
export { AuditHistoryTable, type AuditHistoryEntry } from './AuditHistoryTable';

// ============================================================
// COMPONENTS - Tab Contents (Page Detail)
// ============================================================
export { IssuesTabContent } from './IssuesTab';
export { AnalysisTabContent } from './AnalysisTab';
export { MetadataTabContent } from './MetadataTab';
export { ContentTabContent } from './ContentTab';

// ============================================================
// COMPONENTS - Three-Column Layout Panels (Page Detail)
// ============================================================
export { IssuesListPanel, type AnalysisTab } from './IssuesListPanel';
export { ContentPreviewPanel } from './ContentPreviewPanel';
export { AuditEditorPanel } from './AuditEditorPanel';
export { AuditAnalysisPanel } from './AuditAnalysisPanel';

// ============================================================
// MOCK DATA (Page Detail)
// ============================================================
export { getMockPageAudit, getMockPageContent } from '@/lib/mocks/audit';
