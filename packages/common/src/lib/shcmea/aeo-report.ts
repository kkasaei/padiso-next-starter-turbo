import { z } from 'zod';

// ============================================================
// LLM Provider Schemas
// ============================================================

export const llmProviderStatusSchema = z.enum(['excellent', 'good', 'average', 'needs-improvement']);
export const trendSchema = z.enum(['up', 'down', 'stable']);

export const llmProviderSchema = z.object({
  name: z.string().min(1),
  logo: z.string().url().or(z.string().startsWith('/')),
  score: z.number().min(0).max(100),
  status: llmProviderStatusSchema,
  trend: trendSchema
});

export type LLMProvider = z.infer<typeof llmProviderSchema>;

// ============================================================
// Brand Recognition Schemas
// ============================================================

export const brandRecognitionSchema = z.object({
  provider: z.string().min(1),
  logo: z.string().url().or(z.string().startsWith('/')),
  score: z.number().min(0).max(100),
  marketPosition: z.string().min(1),
  brandArchetype: z.string().min(1),
  confidenceLevel: z.number().min(0).max(100),
  mentionDepth: z.number().min(0),
  sourceQuality: z.number().min(0).max(10),
  dataRichness: z.number().min(0).max(10)
});

export type BrandRecognition = z.infer<typeof brandRecognitionSchema>;

// ============================================================
// Market Competition Schemas
// ============================================================

export const competitorDataPointSchema = z.object({
  name: z.string().min(1),
  value: z.number().min(0),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/) // Hex color validation
});

export const marketCompetitionSegmentSchema = z.object({
  title: z.string().min(1),
  queries: z.number().min(0),
  totalMentions: z.number().min(0),
  data: z.array(competitorDataPointSchema).min(1),
  keyFactors: z.array(z.string().min(1)).min(1)
});

export type MarketCompetitionSegment = z.infer<typeof marketCompetitionSegmentSchema>;

// ============================================================
// Analysis Summary Schemas
// ============================================================

export const strengthOpportunitySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1)
});

export const marketTrajectoryStatusSchema = z.enum(['positive', 'negative', 'neutral']);

export const marketTrajectorySchema = z.object({
  status: marketTrajectoryStatusSchema,
  description: z.string().min(1)
});

export const analysisSummarySchema = z.object({
  strengths: z.array(strengthOpportunitySchema).length(4), // EXACTLY 4 required
  opportunities: z.array(strengthOpportunitySchema).length(4), // EXACTLY 4 required
  marketTrajectory: marketTrajectorySchema
});

export type AnalysisSummary = z.infer<typeof analysisSummarySchema>;

// ============================================================
// Sentiment Analysis Schemas
// ============================================================

export const sentimentMetricSchema = z.object({
  category: z.string().min(1),
  score: z.number().min(0).max(100),
  description: z.string().min(1),
  keyFactors: z.array(z.string().min(1)).min(1)
});

export const sentimentAnalysisSchema = z.object({
  provider: z.string().min(1),
  totalScore: z.number().min(0).max(100),
  polarization: z.number().min(0).max(100),
  reliableData: z.boolean(),
  metrics: z.array(sentimentMetricSchema).min(1)
});

export type SentimentAnalysis = z.infer<typeof sentimentAnalysisSchema>;

// ============================================================
// Content Ideas Schemas
// ============================================================

export const contentCategorySchema = z.enum([
  'Blog Post',
  'Video',
  'Case Study',
  'Guide',
  'Social Media'
]);

export const contentPrioritySchema = z.enum(['high', 'medium', 'low']);

export const contentIdeaSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: contentCategorySchema,
  priority: contentPrioritySchema,
  topics: z.array(z.string().min(1)).min(1)
});

export type ContentIdea = z.infer<typeof contentIdeaSchema>;

// ============================================================
// Brand Positioning Schemas
// ============================================================

export const axisLabelSchema = z.object({
  low: z.string().min(1),
  high: z.string().min(1)
});

export const brandPositionSchema = z.object({
  name: z.string().min(1),
  domain: z.string().optional(), // Domain to fetch favicon from (e.g., "example.com")
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  isYourBrand: z.boolean().optional()
});

export const brandPositioningProviderSchema = z.object({
  provider: z.string().min(1),
  logo: z.string().url().or(z.string().startsWith('/')),
  positions: z.array(brandPositionSchema).min(1)
});

export const brandPositioningSchema = z.object({
  xAxisLabel: axisLabelSchema,
  yAxisLabel: axisLabelSchema,
  providers: z.array(brandPositioningProviderSchema).min(1)
});

export type BrandPositioning = z.infer<typeof brandPositioningSchema>;

// ============================================================
// Complete Report Schema
// ============================================================

export const aeoReportSchema = z.object({
  llmProviders: z.array(llmProviderSchema).min(1),
  brandRecognition: z.array(brandRecognitionSchema).min(1),
  marketCompetition: z.array(marketCompetitionSegmentSchema).min(1),
  analysisSummary: analysisSummarySchema,
  sentimentAnalysis: z.array(sentimentAnalysisSchema).min(1),
  narrativeThemes: z.array(z.string().min(1)).min(1),
  contentIdeas: z.array(contentIdeaSchema).min(1),
  brandPositioning: brandPositioningSchema
});

export type AEOReport = z.infer<typeof aeoReportSchema>;

// ============================================================
// Report Metadata Schema
// ============================================================

export const reportMetadataSchema = z.object({
  domain: z.string().min(1),
  timestamp: z.string().optional(),
  generatedAt: z.date().or(z.string().datetime()),
  version: z.string().default('1.0'),
  status: z.enum(['pending', 'processing', 'completed', 'failed']).default('completed')
});

export type ReportMetadata = z.infer<typeof reportMetadataSchema>;

// ============================================================
// Complete Report with Metadata
// ============================================================

export const completeReportSchema = z.object({
  metadata: reportMetadataSchema,
  data: aeoReportSchema
});

export type CompleteReport = z.infer<typeof completeReportSchema>;

// ============================================================
// API Response Schema
// ============================================================

export const reportApiResponseSchema = z.object({
  success: z.boolean(),
  report: completeReportSchema.optional(),
  error: z.string().optional()
});

export type ReportApiResponse = z.infer<typeof reportApiResponseSchema>;

