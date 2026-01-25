/**
 * Audit Mocks - Central Export
 *
 * All audit mock data is consolidated here for easy importing.
 * Usage: import { generateMockAudit, MOCK_PERFORMANCE_LIST } from '@/mocks/audit';
 */

// ============================================================
// COMMON UTILITIES
// ============================================================
export {
  MOCK_COMPANY,
  MOCK_PAGES,
  buildUrl,
  getRecentTimestamp,
  getRandomScore,
  getScoreStatus,
  type IssueSeverity,
  type AuditIssue,
} from './common';

// ============================================================
// PAGE AUDITS
// ============================================================
export {
  generateMockAudit,
  generateMockPages,
  getMockPageAudits,
  MOCK_AUDIT_HISTORY,
} from './pages';

// ============================================================
// PAGE AUDIT DETAILS
// ============================================================
export {
  getMockPageContent,
  getMockPageAuditDetail,
  getMockPageAudit, // Alias for backward compatibility
} from './page-detail';

// ============================================================
// PERFORMANCE AUDITS
// ============================================================
export {
  MOCK_PERFORMANCE_LIST,
  getMockPerformanceDetail,
  getMockPerformanceDetailByDevice,
  type PerformanceAuditItem,
  type PerformanceDetailData,
} from './performance';

// ============================================================
// ASSET AUDITS
// ============================================================
export {
  MOCK_ASSETS_LIST,
  getMockAssetDetail,
  type AssetAuditItem,
  type AssetDetailData,
} from './assets';

// ============================================================
// LINK AUDITS
// ============================================================
export {
  MOCK_LINKS_LIST,
  getMockLinkDetail,
  type LinkAuditItem,
  type LinkDetailData,
} from './links';

