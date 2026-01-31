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
export { ScoreCircle, ScoreCardsGrid, IssuesSummaryCards } from './score-cards';

// ============================================================
// COMPONENTS - Technical Audit Page
// ============================================================
export { AuditIntroSection } from './audit-intro-section';
export { AuditHeader } from './audit-header';
export { AuditProgressSection } from './audit-progress-section';
export { AuditPagesTable } from './audit-pages-table';
export { AuditScoreSummary } from './audit-score-summary';
export { AuditMetricsGrid } from './audit-metrics-grid';
export { AuditHistoryTable, type AuditHistoryEntry } from './audit-history-table';

// ============================================================
// COMPONENTS - Tab Contents (Page Detail)
// ============================================================
export { IssuesTabContent } from './issues-tab';
export { AnalysisTabContent } from './analysis-tab';
export { MetadataTabContent } from './metadata-tab';
export { ContentTabContent } from './content-tab';

// ============================================================
// COMPONENTS - Three-Column Layout Panels (Page Detail)
// ============================================================
export { IssuesListPanel, type AnalysisTab } from './issues-list-panel';
export { ContentPreviewPanel } from './content-preview-panel';
export { AuditEditorPanel } from './audit-editor-panel';
export { AuditAnalysisPanel } from './audit-analysis-panel';

// ============================================================
// MOCK DATA (Page Detail)
// ============================================================
export { getMockPageAudit, getMockPageContent } from '@/lib/mocks/audit';
