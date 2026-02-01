export interface MetricDataPoint {
  label: string
  value: number
}

export interface MetricCardData {
  title: string
  description: string
  value: string | number
  unit?: string
  trend: 'up' | 'down' | 'stable'
  trendValue?: string
  data: MetricDataPoint[]
  color: string
  href?: string
  hasData?: boolean
}

export interface DashboardStats {
  trackedPrompts: number
  openOpportunities: number
  websiteHealth: number | null
}

export interface AnalyticsData {
  overallScore: number
  brandMentions: number
  sentimentScore: number
  visibilityTrend: 'up' | 'down' | 'stable'
  competitorCount: number
  visibilityChartData: Array<{
    date: string
    chatgpt: number
    perplexity: number
    gemini: number
  }>
}

export interface ContentItem {
  id: string
  title: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface Activity {
  id: string
  type: string
  createdAt: string
  performedByUserId: string | null
  metadata: Record<string, string> | null
}
