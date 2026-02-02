/**
 * @workspace/ai package
 * 
 * Self-contained AI module for SearchFit
 * All dependencies are internal - no external database or schema dependencies
 */

// ============================================================
// Gateway
// ============================================================
export { gateway } from './gateway';

// ============================================================
// AEO Report
// ============================================================
export * from './aeo-report';
export type * from './aeo-report/types';

// ============================================================
// Audit
// ============================================================
export * from './audit';
export type * from './audit/types';

// ============================================================
// Project Scanner
// ============================================================
export * from './project-scanner';
export type * from './project-scanner/types';

// ============================================================
// Project Generators
// ============================================================
export * from './project';

// ============================================================
// Prompt Generator
// ============================================================
export * from './prompt/prompt-generator';

// ============================================================
// Image Generation
// ============================================================
export * from './image-generation';

// ============================================================
// Types (selective exports to avoid conflicts)
// ============================================================
export type {
  AEOReport,
  LLMProviderData,
  BrandRecognitionData,
  SentimentAnalysisData,
  SentimentMetric,
  MarketCompetitionData,
  MarketCompetitionDataItem,
  BrandPosition,
  StrengthOpportunity,
  MarketTrajectory,
  ContentIdea,
} from './types/aeo-report';

export type * from './types/audit-dto';

// ============================================================
// Mock Database (for testing/development)
// ============================================================
export {
  mockPrisma,
  mockVectorAnalytics,
  addMockProject,
  addMockWebsiteAudit,
  clearMockData,
} from './mock-db';
