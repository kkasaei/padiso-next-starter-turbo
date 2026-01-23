/**
 * AI Visibility Tracking Data Types
 * These types represent the data structure for the AI Search Visibility dashboard
 */

// ============================================================
// LLM Provider Types
// ============================================================

export type ProviderStatus = 'excellent' | 'good' | 'average' | 'needs-improvement'
export type TrendDirection = 'up' | 'down' | 'stable'

export interface LLMProviderScore {
  name: string
  logo: string
  score: number
  status: ProviderStatus
  trend?: TrendDirection
}

// ============================================================
// Brand Recognition Types
// ============================================================

export interface BrandRecognitionProvider {
  provider: string
  logo: string
  score: number
  marketPosition: string
  brandArchetype: string
  confidenceLevel: number
  mentionDepth: number
  sourceQuality: number
  dataRichness: number
}

// ============================================================
// Market Competition Types
// ============================================================

export interface CompetitorData {
  name: string
  value: number
  color: string
}

export interface MarketSegment {
  title: string
  queries: number
  totalMentions: number
  data: CompetitorData[]
  keyFactors: string[]
}

// ============================================================
// Sentiment Analysis Types
// ============================================================

export interface SentimentMetric {
  category: string
  score: number
  description: string
  keyFactors: string[]
}

export interface SentimentProvider {
  provider: string
  logo: string
  totalScore: number
  polarization: number
  reliableData: boolean
  metrics: SentimentMetric[]
}

// ============================================================
// Analysis Summary Types
// ============================================================

export interface AnalysisItem {
  title: string
  description: string
}

export interface MarketTrajectory {
  status: 'positive' | 'neutral' | 'negative'
  description: string
}

export interface AnalysisSummary {
  strengths: AnalysisItem[]
  opportunities: AnalysisItem[]
  marketTrajectory: MarketTrajectory
}

// ============================================================
// Brand Positioning Types
// ============================================================

export interface BrandPosition {
  name: string
  x: number // 0-100
  y: number // 0-100
  isYourBrand?: boolean
  favicon?: string // URL to brand favicon (e.g., from their website)
  domain?: string // Brand website domain for favicon lookup
}

export interface PositioningProvider {
  provider: string
  logo: string
  positions: BrandPosition[]
}

export interface BrandPositioning {
  xAxisLabel: { low: string; high: string }
  yAxisLabel: { low: string; high: string }
  providers: PositioningProvider[]
}

// ============================================================
// Content Ideas Types
// ============================================================

export interface ContentIdea {
  title: string
  description: string
  category: string
  priority: 'high' | 'medium' | 'low'
  topics: string[]
}

// ============================================================
// Complete AI Visibility Data
// ============================================================

export interface AIVisibilityData {
  llmProviders: LLMProviderScore[]
  brandRecognition: BrandRecognitionProvider[]
  marketCompetition: MarketSegment[]
  analysisSummary: AnalysisSummary
  sentimentAnalysis: SentimentProvider[]
  narrativeThemes: string[]
  contentIdeas: ContentIdea[]
  brandPositioning: BrandPositioning
}

// ============================================================
// Overview Stats (Computed)
// ============================================================

export interface AIVisibilityStats {
  overallScore: number
  brandMentions: number
  competitorGap: number // Percentage difference vs top competitor
  aiEnginesTracked: number
  visibilityTrend: TrendDirection
  sentimentScore: number
}

