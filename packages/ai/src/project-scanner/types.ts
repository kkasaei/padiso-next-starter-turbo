/**
 * Types for Project AEO Scanner
 *
 * Inspired by aeo-report/types.ts but adapted for project-based scanning
 */

// ============================================================
// LLM Provider Types
// ============================================================

export type ScannerLLMProvider = 'chatgpt' | 'perplexity' | 'gemini' | 'claude';

export interface ScannerProviderConfig {
  name: string;
  model: string;
  enabled: boolean;
}

// ============================================================
// Scan Query Types
// ============================================================

export interface ProjectScanContext {
  projectId: string;
  organizationId: string;
  brandName: string;
  websiteUrl: string;
  trackedPrompts: TrackedPromptInput[];
  competitors: string[];
  industry: string;
  targetAudience: string;
  // Context keywords (for AI understanding, not for scanning)
  contextKeywords?: string[];
}

export interface TrackedPromptInput {
  id: string;
  prompt: string;
  targetLocation?: string;
}

export interface KeywordQuery {
  keyword: string;
  queryType: 'informational' | 'transactional' | 'navigational' | 'commercial';
}

// ============================================================
// Scan Results Types
// ============================================================

export interface BrandMentionResult {
  provider: ScannerLLMProvider;
  keyword: string;
  queryText: string;

  // Was the brand mentioned?
  brandMentioned: boolean;
  mentionPosition: number | null; // Position in response (1 = first mention, null = not mentioned)
  mentionContext: string | null; // The sentence/context where brand was mentioned

  // Full response text (for Mentions tab)
  fullResponse?: string;

  // Competitor mentions
  competitorMentions: Array<{
    name: string;
    position: number;
    context: string;
    domain?: string;
    shareOfVoice?: number;
  }>;

  // Sentiment
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number; // 0-100

  // Rich sentiment analysis (from rich prompts)
  richSentimentAnalysis?: RichSentimentAnalysis;
  brandRecognition?: BrandRecognitionData;
  brandPositioning?: BrandPositioningData;
  marketCompetition?: MarketCompetitionData[];
  analysisSummary?: AnalysisSummaryData;
  narrativeThemes?: string[];

  // Metadata
  responseLength: number;
  executionTimeMs: number;
  tokensUsed: number;
  cost: number;
}

export interface ProviderScanResult {
  provider: ScannerLLMProvider;
  status: 'success' | 'error' | 'timeout';

  // Aggregated scores
  visibilityScore: number; // 0-100
  mentionRate: number; // % of queries where brand was mentioned
  averagePosition: number | null; // Average position when mentioned

  // Individual results
  mentionResults: BrandMentionResult[];

  // Errors
  error?: string;

  // Cost tracking
  totalCost: number;
  totalTokens: number;
  executionTimeMs: number;
}

export interface ProjectScanResult {
  projectId: string;
  organizationId: string;
  scanDate: string;

  // Overall metrics
  overallVisibilityScore: number; // Average across all providers
  totalKeywordsScanned: number;
  totalQueriesExecuted: number;

  // Per-provider results
  providerResults: ProviderScanResult[];

  // Top insights
  topMentionedKeywords: Array<{ keyword: string; mentionCount: number }>;
  topCompetitors: Array<{ name: string; mentionCount: number; averagePosition: number }>;

  // Opportunities identified
  opportunitiesIdentified: OpportunityInsight[];

  // Cost tracking
  totalCost: number;
  totalExecutionTimeMs: number;
}

// ============================================================
// Opportunity Types
// ============================================================

export interface OpportunityInsight {
  // Two types: CONTENT (blog posts) or ACTION (page updates/tasks)
  type: 'CONTENT' | 'ACTION';
  title: string;
  priority: number; // 1-10
  impact: 'critical' | 'high' | 'medium' | 'low';

  // Related data
  relatedKeywords: string[];

  // Instructions (markdown format)
  // For CONTENT type: includes content title (H1 headline) at the beginning
  // For ACTION type: step-by-step implementation guide
  instructions: string;
}

// ============================================================
// LLM Response Types (Raw JSON from prompts)
// ============================================================

export interface KeywordAnalysisResponse {
  keyword: string;
  brandMentioned: boolean;
  mentionPosition: number | null;
  mentionContext: string | null;
  competitors: Array<{
    name: string;
    position: number;
    context: string;
  }>;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  responseQuality: number;
}

export interface OpportunityGenerationResponse {
  opportunities: Array<{
    type: string;
    title: string;
    priority: number;
    impact: string;
    relatedKeywords: string[];
    instructions: string;
  }>;
}

// ============================================================
// Rich Response Types (AEO-Report Style)
// ============================================================

export interface RichSentimentAnalysis {
  provider: string;
  totalScore: number;
  polarization: number;
  reliableData: boolean;
  metrics: Array<{
    category: string;
    score: number;
    description: string;
    keyFactors: string[];
  }>;
}

export interface BrandRecognitionData {
  provider: string;
  logo: string;
  score: number;
  marketPosition: 'Niche' | 'Emerging' | 'Established' | 'Leader';
  brandArchetype: string;
  confidenceLevel: number;
  mentionDepth: number;
  sourceQuality: number;
  dataRichness: number;
}

export interface BrandPositioningData {
  xAxisLabel: { low: string; high: string };
  yAxisLabel: { low: string; high: string };
  positions: Array<{
    name: string;
    x: number;
    y: number;
    isYourBrand?: boolean;
  }>;
}

export interface MarketCompetitionData {
  title: string;
  queries: number;
  totalMentions: number;
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  keyFactors: string[];
}

export interface AnalysisSummaryData {
  strengths: Array<{
    title: string;
    description: string;
  }>;
  opportunities: Array<{
    title: string;
    description: string;
  }>;
  marketTrajectory: {
    status: 'positive' | 'negative' | 'neutral';
    description: string;
  };
}

export interface RichPromptAnalysisResponse {
  prompt: string;
  fullResponse: string;
  brandMentioned: boolean;
  mentionPosition: number | null;
  mentionContext: string | null;
  llmProvider: {
    name: string;
    logo: string;
    score: number;
    status: 'excellent' | 'good' | 'average' | 'needs-improvement';
    trend: 'up' | 'down' | 'stable';
  };
  brandRecognition: BrandRecognitionData;
  sentimentAnalysis: RichSentimentAnalysis;
  brandPositioning: BrandPositioningData;
  competitors: Array<{
    name: string;
    domain?: string | null;
    position: number;
    context: string;
    shareOfVoice: number;
  }>;
  marketCompetition: MarketCompetitionData[];
  analysisSummary: AnalysisSummaryData;
  narrativeThemes: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
}

