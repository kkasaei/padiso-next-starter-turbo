/**
 * Internal AEO Report Types
 * 
 * These types define the structure of AEO (Answer Engine Optimization) reports.
 */

// ============================================================
// LLM Provider Data
// ============================================================

export interface LLMProviderData {
  name: string;
  logo: string;
  score: number;
  status: 'excellent' | 'good' | 'average' | 'needs-improvement';
  trend: 'up' | 'down' | 'stable';
}

// ============================================================
// Brand Recognition
// ============================================================

export interface BrandRecognitionData {
  provider: string;
  logo: string;
  score: number;
  marketPosition: string;
  brandArchetype: string;
  confidenceLevel: number;
  mentionDepth: number;
  sourceQuality: number;
  dataRichness: number;
}

// ============================================================
// Sentiment Analysis
// ============================================================

export interface SentimentMetric {
  category: string;
  score: number;
  description: string;
  keyFactors: string[];
}

export interface SentimentAnalysisData {
  provider: string;
  totalScore: number;
  polarization: number;
  reliableData: boolean;
  metrics: SentimentMetric[];
}

// ============================================================
// Market Competition
// ============================================================

export interface MarketCompetitionDataItem {
  name: string;
  value: number;
  color: string;
}

export interface MarketCompetitionData {
  title: string;
  queries: number;
  totalMentions: number;
  data: MarketCompetitionDataItem[];
  keyFactors: string[];
}

// ============================================================
// Brand Positioning
// ============================================================

export interface BrandPosition {
  name: string;
  domain?: string;
  x: number;
  y: number;
  isYourBrand?: boolean;
}

export interface BrandPositioningData {
  xAxisLabel: {
    low: string;
    high: string;
  };
  yAxisLabel: {
    low: string;
    high: string;
  };
  positions?: BrandPosition[];
  providers?: Array<{
    provider: string;
    logo: string;
    positions: BrandPosition[];
  }>;
}

// ============================================================
// Analysis Summary
// ============================================================

export interface StrengthOpportunity {
  title: string;
  description: string;
}

export interface MarketTrajectory {
  status: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface AnalysisSummaryData {
  strengths: StrengthOpportunity[];
  opportunities: StrengthOpportunity[];
  marketTrajectory: MarketTrajectory;
}

// ============================================================
// Content Ideas
// ============================================================

export interface ContentIdea {
  title: string;
  description: string;
  category: 'Blog Post' | 'Video' | 'Case Study' | 'Guide' | 'Social Media';
  priority: 'high' | 'medium' | 'low';
  topics: string[];
}

// ============================================================
// Main AEO Report Type
// ============================================================

export interface AEOReport {
  domain: string;
  generatedAt: string;
  
  // LLM Provider Visibility
  llmProviders: LLMProviderData[];
  
  // Brand Recognition across providers
  brandRecognition: BrandRecognitionData[];
  
  // Sentiment Analysis
  sentimentAnalysis: SentimentAnalysisData[];
  
  // Market Competition (Perplexity-specific)
  marketCompetition?: MarketCompetitionData[];
  
  // Brand Positioning Map
  brandPositioning: BrandPositioningData;
  
  // Analysis Summary (Gemini-specific)
  analysisSummary?: AnalysisSummaryData;
  
  // Narrative Themes (Gemini-specific)
  narrativeThemes?: string[];
  
  // Content Ideas (Gemini-specific)
  contentIdeas?: ContentIdea[];
  
  // Metadata
  cacheExpiresAt?: string;
  totalQueries?: number;
  averageConfidence?: number;
}
