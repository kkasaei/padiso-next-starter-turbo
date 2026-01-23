// ============================================================
// PROMPT ANALYTICS DTOs
// Types for prompt-level analytics data
// ============================================================

// ============================================================
// PROVIDER TYPES
// ============================================================
export interface ProviderConfig {
  id: string
  name: string
  logo: string
  color: string
}

// ============================================================
// VISIBILITY DATA
// ============================================================
export interface VisibilityDataPoint {
  date: string
  displayDate?: string
  chatgpt: number
  perplexity: number
  gemini: number
}

// ============================================================
// COMPETITOR DATA
// ============================================================
export interface CompetitorData {
  name: string
  value: number
  color: string
  position: number
  dateFound: string
  domain: string | null
  isYourBrand: boolean
}

// ============================================================
// MARKET SEGMENT DATA
// ============================================================
export interface MarketSegmentBrand {
  name: string
  value: number
  color: string
  domain: string | null
}

export interface MarketSegmentData {
  provider?: string
  title: string
  queries: number
  totalMentions: number
  data: MarketSegmentBrand[]
  keyFactors: string[]
  lastUpdated?: string
}

// ============================================================
// SENTIMENT DATA
// ============================================================
export interface SentimentMetric {
  category: string
  score: number
  description: string
  keyFactors: string[]
}

export interface ProviderSentimentData {
  provider: string
  logo: string
  totalScore: number
  polarization: number
  reliableData: boolean
  metrics: SentimentMetric[]
}

export interface SentimentBreakdown {
  positive: number
  neutral: number
  negative: number
}

// ============================================================
// INSIGHT DATA
// ============================================================
export interface InsightItem {
  title: string
  description: string
  identifiedAt: string
}

export interface RecommendationItem extends InsightItem {
  priority: string
  impact: string
}

export interface InsightsData {
  strengths: InsightItem[]
  opportunities: InsightItem[]
  recommendations: RecommendationItem[]
}

// ============================================================
// AI MENTION DATA
// ============================================================
export interface AIMention {
  id: string
  date: string
  provider?: string
  response: string
  mentionPosition: number | null
  sentiment: 'positive' | 'neutral' | 'negative'
  sentimentScore?: number
  brandMentioned: boolean
}

// ============================================================
// BRAND POSITIONING DATA
// ============================================================
export interface BrandPosition {
  name: string
  x: number
  y: number
  isYourBrand?: boolean
  domain?: string
  firstSeen?: string
}

export interface ProviderPositioning {
  provider: string
  logo: string
  positions: BrandPosition[]
}

export interface BrandPositioningData {
  xAxisLabel: { low: string; high: string }
  yAxisLabel: { low: string; high: string }
  providers: ProviderPositioning[]
}

// ============================================================
// ANALYTICS ANALYSIS DATA
// ============================================================
export interface AnalysisSnapshot {
  date: string
  strengths: InsightItem[]
  opportunities: InsightItem[]
  marketTrajectory: {
    status: 'positive' | 'neutral' | 'negative'
    description: string
  }
}

// ============================================================
// COMPETITOR ITEM (for tables)
// ============================================================
export interface CompetitorItem {
  name: string
  domain: string
  isYourBrand: boolean
  mentionPercentage: number
  totalMentions: number
  contextType: string
}

// ============================================================
// MARKET SEGMENT (alias for use in components)
// ============================================================
export type MarketSegment = MarketSegmentData

// ============================================================
// SENTIMENT METRIC ITEM (for tables)
// ============================================================
export interface SentimentMetricItem {
  category: string
  score: number
  description: string
  keyFactors: string[]
}

// ============================================================
// MAIN ANALYTICS DATA TYPE
// Used for fetching real data from the server
// ============================================================
// Per-provider insight data
export interface ProviderInsightData {
  trajectory: { status: string; description: string }
  strengths: string[]
  opportunities: string[]
}

export interface PromptAnalyticsData {
  visibilityTrend: VisibilityDataPoint[]
  providerBreakdown: Array<{ provider: string; score: number; count: number }>
  sentimentBreakdown: Array<{ provider: string; score: number; polarization: number }>
  competitors: CompetitorItem[]
  marketSegments?: MarketSegmentData[]
  positioning: Array<{
    provider: string
    xAxisLabel: { low: string; high: string }
    yAxisLabel: { low: string; high: string }
    positions: BrandPosition[]
  }>
  insights: {
    trajectory: { status: string; description: string }
    strengths: string[]
    opportunities: string[]
    narrativeThemes: string[]
  } | null
  mentions: AIMention[]
  sentimentMetricsByProvider: Record<string, SentimentMetricItem[]>
  narrativeThemesByProvider?: Record<string, string[]> // Per-provider narrative themes for Contextual Analysis
  insightsByProvider?: Record<string, ProviderInsightData> // Per-provider trajectory, strengths, opportunities
}

// ============================================================
// TABLE SORTING TYPES
// ============================================================
export type SortDirection = 'asc' | 'desc'
export type CompetitorSortKey = 'name' | 'value' | 'position' | 'dateFound'
export type MentionSortKey = 'date' | 'mentionPosition' | 'sentiment'
export type InsightSortKey = 'title' | 'description' | 'priority' | 'impact'
export type InsightsTabType = 'strengths' | 'opportunities' | 'recommendations'

