// ============================================================
// PROMPT ANALYTICS MOCK DATA
// Mock data generators and static data for prompt analytics
// ============================================================

import type {
  VisibilityDataPoint,
  CompetitorData,
  MarketSegmentData,
  ProviderSentimentData,
  BrandPositioningData,
  AnalysisSnapshot,
  AIMention,
  InsightItem,
  RecommendationItem,
} from '@/lib/shcmea/types/dtos/prompt-analytics-dto'

// ============================================================
// VISIBILITY TREND DATA GENERATOR
// Generates 6 months (180 days) of visibility score data
// ============================================================
export function generateVisibilityTrendData(): VisibilityDataPoint[] {
  const data: VisibilityDataPoint[] = []
  const now = new Date()
  const startDate = new Date(now)
  startDate.setDate(startDate.getDate() - 180)

  for (let i = 0; i < 180; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)

    const baseScore = 65
    const seasonality = Math.sin(i * 0.05) * 10
    const trend = (i / 180) * 8

    data.push({
      date: date.toISOString().split('T')[0]!,
      displayDate: `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getDate()}`,
      chatgpt: Math.floor(baseScore + seasonality + trend + (Math.random() - 0.5) * 15),
      perplexity: Math.floor(baseScore + 5 + seasonality + trend + (Math.random() - 0.5) * 12),
      gemini: Math.floor(baseScore - 3 + seasonality + trend + (Math.random() - 0.5) * 18),
    })
  }

  return data
}

// ============================================================
// PROVIDER MENTION DATA GENERATOR
// ============================================================
export function generateProviderMentionData(): Array<{ date: string; provider: string; mentions: number }> {
  const data: Array<{ date: string; provider: string; mentions: number }> = []
  const now = new Date()

  for (let i = 0; i < 180; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]!

    data.push({ date: dateStr, provider: 'ChatGPT', mentions: Math.floor(8 + Math.random() * 6) })
    data.push({ date: dateStr, provider: 'Perplexity', mentions: Math.floor(6 + Math.random() * 5) })
    data.push({ date: dateStr, provider: 'Gemini', mentions: Math.floor(4 + Math.random() * 4) })
  }

  return data
}

// ============================================================
// PROVIDER MENTION AGGREGATOR
// ============================================================
export function aggregateProviderMentions(
  data: Array<{ date: string; provider: string; mentions: number }>,
  fromDate: Date | undefined,
  toDate: Date | undefined
) {
  const filtered = data.filter((item) => {
    const itemDate = new Date(item.date)
    if (fromDate && itemDate < fromDate) return false
    if (toDate && itemDate > toDate) return false
    return true
  })

  const totals: Record<string, number> = { ChatGPT: 0, Perplexity: 0, Gemini: 0 }
  filtered.forEach((item) => {
    totals[item.provider] = (totals[item.provider] || 0) + item.mentions
  })

  const total = Object.values(totals).reduce((sum, v) => sum + v, 0)

  return [
    { name: 'ChatGPT', value: total > 0 ? Math.round(((totals.ChatGPT ?? 0) / total) * 100) : 45, color: '#10b981' },
    { name: 'Perplexity', value: total > 0 ? Math.round(((totals.Perplexity ?? 0) / total) * 100) : 35, color: '#8b5cf6' },
    { name: 'Gemini', value: total > 0 ? Math.round(((totals.Gemini ?? 0) / total) * 100) : 20, color: '#3b82f6' },
  ]
}

// ============================================================
// COMPETITOR SNAPSHOT GENERATOR
// ============================================================
function generateCompetitorSnapshots(baseData: CompetitorData[]): CompetitorData[] {
  const snapshots: CompetitorData[] = []
  const now = new Date()

  for (let i = 0; i < 30; i++) {
    const snapshotDate = new Date(now)
    snapshotDate.setDate(snapshotDate.getDate() - (i * 6))
    const dateStr = snapshotDate.toISOString().split('T')[0]

    baseData.forEach((competitor, idx) => {
      const timeVariation = Math.sin(i * 0.3 + idx) * 5
      const randomVariation = (Math.random() - 0.5) * 4

      snapshots.push({
        ...competitor,
        value: Math.max(1, Math.round(competitor.value + timeVariation + randomVariation)),
        position: competitor.position + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0),
        dateFound: dateStr,
      })
    })
  }

  return snapshots
}

// ============================================================
// BASE COMPETITOR DATA
// ============================================================
const BASE_COMPETITOR_DATA: Record<string, CompetitorData[]> = {
  ChatGPT: [
    { name: 'PADISO', value: 28, color: '#3b82f6', position: 1, dateFound: '2025-12-10', domain: 'padiso.co', isYourBrand: true },
    { name: 'Samsung', value: 22, color: '#1428a0', position: 2, dateFound: '2025-12-08', domain: 'samsung.com', isYourBrand: false },
    { name: 'Dyson', value: 18, color: '#ff6900', position: 3, dateFound: '2025-12-12', domain: 'dyson.com', isYourBrand: false },
    { name: 'Bosch', value: 15, color: '#e20015', position: 4, dateFound: '2025-12-14', domain: 'bosch-home.com', isYourBrand: false },
    { name: 'Electrolux', value: 10, color: '#041e42', position: 5, dateFound: '2025-12-16', domain: 'electrolux.com', isYourBrand: false },
    { name: 'Fisher & Paykel', value: 7, color: '#00263a', position: 6, dateFound: '2025-12-18', domain: 'fisherpaykel.com', isYourBrand: false },
  ],
  Perplexity: [
    { name: 'PADISO', value: 32, color: '#3b82f6', position: 1, dateFound: '2025-12-09', domain: 'padiso.co', isYourBrand: true },
    { name: 'Samsung', value: 24, color: '#1428a0', position: 2, dateFound: '2025-12-07', domain: 'samsung.com', isYourBrand: false },
    { name: 'Bosch', value: 18, color: '#e20015', position: 3, dateFound: '2025-12-11', domain: 'bosch-home.com', isYourBrand: false },
    { name: 'Siemens', value: 12, color: '#009999', position: 4, dateFound: '2025-12-13', domain: 'siemens-home.bsh-group.com', isYourBrand: false },
    { name: 'Electrolux', value: 8, color: '#041e42', position: 5, dateFound: '2025-12-15', domain: 'electrolux.com', isYourBrand: false },
    { name: 'Whirlpool', value: 6, color: '#1d4370', position: 6, dateFound: '2025-12-17', domain: 'whirlpool.com', isYourBrand: false },
  ],
  Gemini: [
    { name: 'Samsung', value: 30, color: '#1428a0', position: 1, dateFound: '2025-12-06', domain: 'samsung.com', isYourBrand: false },
    { name: 'PADISO', value: 26, color: '#3b82f6', position: 2, dateFound: '2025-12-08', domain: 'padiso.co', isYourBrand: true },
    { name: 'Bosch', value: 20, color: '#e20015', position: 3, dateFound: '2025-12-10', domain: 'bosch-home.com', isYourBrand: false },
    { name: 'Fisher & Paykel', value: 24, color: '#00263a', position: 4, dateFound: '2025-12-12', domain: 'fisherpaykel.com', isYourBrand: false },
  ],
}

// Generate competitor data with historical snapshots
export const COMPETITOR_DATA_BY_PROVIDER: Record<string, CompetitorData[]> = {
  ChatGPT: generateCompetitorSnapshots(BASE_COMPETITOR_DATA['ChatGPT']!),
  Perplexity: generateCompetitorSnapshots(BASE_COMPETITOR_DATA['Perplexity']!),
  Gemini: generateCompetitorSnapshots(BASE_COMPETITOR_DATA['Gemini']!),
}

// ============================================================
// COMPETITOR DATA AGGREGATOR
// ============================================================
export function aggregateCompetitorData(
  data: CompetitorData[],
  fromDate: Date | undefined,
  toDate: Date | undefined
): CompetitorData[] {
  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.dateFound)
    if (fromDate && itemDate < fromDate) return false
    if (toDate && itemDate > toDate) return false
    return true
  })

  if (filteredData.length === 0) return []

  const aggregated = new Map<string, {
    name: string
    totalValue: number
    totalPosition: number
    count: number
    color: string
    domain: string | null
    isYourBrand: boolean
    earliestDate: string
  }>()

  filteredData.forEach((item) => {
    const existing = aggregated.get(item.name)
    if (existing) {
      existing.totalValue += item.value
      existing.totalPosition += item.position
      existing.count += 1
      if (item.dateFound < existing.earliestDate) {
        existing.earliestDate = item.dateFound
      }
    } else {
      aggregated.set(item.name, {
        name: item.name,
        totalValue: item.value,
        totalPosition: item.position,
        count: 1,
        color: item.color,
        domain: item.domain,
        isYourBrand: item.isYourBrand,
        earliestDate: item.dateFound,
      })
    }
  })

  return Array.from(aggregated.values()).map((item) => ({
    name: item.name,
    value: Math.round(item.totalValue / item.count),
    color: item.color,
    position: Math.round(item.totalPosition / item.count),
    dateFound: item.earliestDate,
    domain: item.domain,
    isYourBrand: item.isYourBrand,
  }))
}

// ============================================================
// MARKET SEGMENTS DATA
// ============================================================
export const MARKET_SEGMENTS_BY_PROVIDER: Record<string, MarketSegmentData[]> = {
  ChatGPT: [
    {
      title: 'Premium Home Appliances',
      queries: 150,
      totalMentions: 1200,
      data: [
        { name: 'PADISO', value: 25, color: '#3b82f6', domain: 'padiso.co' },
        { name: 'Bosch', value: 20, color: '#e20015', domain: 'bosch-home.com' },
        { name: 'Siemens', value: 18, color: '#009999', domain: 'siemens-home.bsh-group.com' },
        { name: 'Electrolux', value: 15, color: '#041e42', domain: 'electrolux.com' },
        { name: 'Whirlpool', value: 12, color: '#f59e0b', domain: 'whirlpool.com' },
        { name: 'Other', value: 10, color: '#9ca3af', domain: null },
      ],
      keyFactors: ['AI-enabled features', 'Durability reputation', 'Premium pricing'],
      lastUpdated: '2025-12-15',
    },
    {
      title: 'Smart Kitchen Appliances',
      queries: 100,
      totalMentions: 850,
      data: [
        { name: 'PADISO', value: 28, color: '#3b82f6', domain: 'padiso.co' },
        { name: 'Thermador', value: 22, color: '#6366f1', domain: 'thermador.com' },
        { name: 'Wolf', value: 19, color: '#8b5cf6', domain: 'subzero-wolf.com' },
        { name: 'Viking', value: 14, color: '#10b981', domain: 'vikingrange.com' },
        { name: 'Gaggenau', value: 11, color: '#f59e0b', domain: 'gaggenau.com' },
        { name: 'Other', value: 6, color: '#9ca3af', domain: null },
      ],
      keyFactors: ['Connected smart features', 'Energy efficiency', 'Design aesthetics'],
      lastUpdated: '2025-12-10',
    },
    {
      title: 'Laundry Appliances',
      queries: 80,
      totalMentions: 650,
      data: [
        { name: 'PADISO', value: 30, color: '#3b82f6', domain: 'padiso.co' },
        { name: 'LG', value: 21, color: '#a21caf', domain: 'lg.com' },
        { name: 'Samsung', value: 18, color: '#1428a0', domain: 'samsung.com' },
        { name: 'Speed Queen', value: 13, color: '#f59e0b', domain: 'speedqueen.com' },
        { name: 'Maytag', value: 10, color: '#ef4444', domain: 'maytag.com' },
        { name: 'Other', value: 8, color: '#9ca3af', domain: null },
      ],
      keyFactors: ['Longevity and reliability', 'AI optimization', 'Water/energy savings'],
      lastUpdated: '2025-11-25',
    },
  ],
  Perplexity: [
    {
      title: 'Premium Home Appliances',
      queries: 180,
      totalMentions: 1450,
      data: [
        { name: 'PADISO', value: 32, color: '#3b82f6', domain: 'padiso.co' },
        { name: 'Bosch', value: 22, color: '#e20015', domain: 'bosch-home.com' },
        { name: 'Siemens', value: 16, color: '#009999', domain: 'siemens-home.bsh-group.com' },
        { name: 'Electrolux', value: 12, color: '#041e42', domain: 'electrolux.com' },
        { name: 'Whirlpool', value: 10, color: '#f59e0b', domain: 'whirlpool.com' },
        { name: 'Other', value: 8, color: '#9ca3af', domain: null },
      ],
      keyFactors: ['Research citations', 'Expert reviews', 'Quality benchmarks'],
      lastUpdated: '2025-12-18',
    },
    {
      title: 'Smart Kitchen Appliances',
      queries: 120,
      totalMentions: 980,
      data: [
        { name: 'PADISO', value: 35, color: '#3b82f6', domain: 'padiso.co' },
        { name: 'Thermador', value: 20, color: '#6366f1', domain: 'thermador.com' },
        { name: 'Wolf', value: 18, color: '#8b5cf6', domain: 'subzero-wolf.com' },
        { name: 'Viking', value: 12, color: '#10b981', domain: 'vikingrange.com' },
        { name: 'Gaggenau', value: 10, color: '#f59e0b', domain: 'gaggenau.com' },
        { name: 'Other', value: 5, color: '#9ca3af', domain: null },
      ],
      keyFactors: ['Technical specifications', 'Professional endorsements', 'Innovation awards'],
      lastUpdated: '2025-12-05',
    },
    {
      title: 'Laundry Appliances',
      queries: 95,
      totalMentions: 720,
      data: [
        { name: 'PADISO', value: 28, color: '#3b82f6', domain: 'padiso.co' },
        { name: 'LG', value: 24, color: '#a21caf', domain: 'lg.com' },
        { name: 'Samsung', value: 20, color: '#1428a0', domain: 'samsung.com' },
        { name: 'Speed Queen', value: 12, color: '#f59e0b', domain: 'speedqueen.com' },
        { name: 'Maytag', value: 9, color: '#ef4444', domain: 'maytag.com' },
        { name: 'Other', value: 7, color: '#9ca3af', domain: null },
      ],
      keyFactors: ['Consumer reports', 'Efficiency ratings', 'Brand trust'],
      lastUpdated: '2025-11-20',
    },
  ],
  Gemini: [
    {
      title: 'Premium Home Appliances',
      queries: 140,
      totalMentions: 1100,
      data: [
        { name: 'PADISO', value: 22, color: '#3b82f6', domain: 'padiso.co' },
        { name: 'Bosch', value: 24, color: '#e20015', domain: 'bosch-home.com' },
        { name: 'Samsung', value: 20, color: '#1428a0', domain: 'samsung.com' },
        { name: 'Electrolux', value: 14, color: '#041e42', domain: 'electrolux.com' },
        { name: 'LG', value: 12, color: '#a21caf', domain: 'lg.com' },
        { name: 'Other', value: 8, color: '#9ca3af', domain: null },
      ],
      keyFactors: ['Google ecosystem', 'Smart home integration', 'Voice control'],
      lastUpdated: '2025-12-12',
    },
    {
      title: 'Smart Kitchen Appliances',
      queries: 110,
      totalMentions: 890,
      data: [
        { name: 'PADISO', value: 26, color: '#3b82f6', domain: 'padiso.co' },
        { name: 'Samsung', value: 24, color: '#1428a0', domain: 'samsung.com' },
        { name: 'LG', value: 18, color: '#a21caf', domain: 'lg.com' },
        { name: 'Bosch', value: 14, color: '#e20015', domain: 'bosch-home.com' },
        { name: 'Whirlpool', value: 10, color: '#f59e0b', domain: 'whirlpool.com' },
        { name: 'Other', value: 8, color: '#9ca3af', domain: null },
      ],
      keyFactors: ['YouTube reviews', 'Google Shopping data', 'User ratings'],
      lastUpdated: '2025-11-28',
    },
    {
      title: 'Laundry Appliances',
      queries: 75,
      totalMentions: 580,
      data: [
        { name: 'Samsung', value: 26, color: '#1428a0', domain: 'samsung.com' },
        { name: 'PADISO', value: 24, color: '#3b82f6', domain: 'padiso.co' },
        { name: 'LG', value: 22, color: '#a21caf', domain: 'lg.com' },
        { name: 'Whirlpool', value: 14, color: '#f59e0b', domain: 'whirlpool.com' },
        { name: 'Maytag', value: 8, color: '#ef4444', domain: 'maytag.com' },
        { name: 'Other', value: 6, color: '#9ca3af', domain: null },
      ],
      keyFactors: ['Knowledge panel', 'Shopping reviews', 'Video tutorials'],
      lastUpdated: '2025-12-01',
    },
  ],
}

// ============================================================
// SENTIMENT DATA
// ============================================================
export const PROMPT_SENTIMENT_DATA: ProviderSentimentData[] = [
  {
    provider: 'ChatGPT',
    logo: '/icons/openai.svg',
    totalScore: 74,
    polarization: 40,
    reliableData: true,
    metrics: [
      {
        category: 'General',
        score: 78,
        description: 'Described as a premium brand known for high build quality, longevity and premium pricing.',
        keyFactors: ['Premium build quality', 'Durability/longevity', 'Higher price point'],
      },
      {
        category: 'Professional',
        score: 72,
        description: 'Framed as an established player in the premium segment with strong service/warranty positioning.',
        keyFactors: ['Premium market positioning', 'Service and warranty network', 'Professional-grade product lines'],
      },
      {
        category: 'Technical',
        score: 70,
        description: 'Seen as technically competent with well-engineered products and energy-efficient designs.',
        keyFactors: ['Engineering and reliability', 'Energy efficiency/features', 'Smart connectivity'],
      },
    ],
  },
  {
    provider: 'Perplexity',
    logo: '/icons/perplexity.svg',
    totalScore: 94,
    polarization: 12,
    reliableData: true,
    metrics: [
      {
        category: 'Search Results',
        score: 95,
        description: 'Appears prominently in AI search results as a premium brand with innovative integrations.',
        keyFactors: ['High citation frequency', 'Positive innovation mentions', 'Trusted source status'],
      },
      {
        category: 'Source Quality',
        score: 96,
        description: 'Sources are high-quality, including official brand content and industry analysis sites.',
        keyFactors: ['Official brand content', 'Industry analysis sites', 'AI tracking platforms'],
      },
      {
        category: 'Recency',
        score: 90,
        description: 'Recent mentions highlight AI features and smart capabilities with up-to-date innovation focus.',
        keyFactors: ['2025 AI feature developments', 'Ongoing visibility tracking', 'Current market analyses'],
      },
    ],
  },
  {
    provider: 'Gemini',
    logo: '/icons/gemini.svg',
    totalScore: 95,
    polarization: 10,
    reliableData: true,
    metrics: [
      {
        category: 'General',
        score: 96,
        description: 'Consistently described as premium, high-quality, and reliable with exceptional durability.',
        keyFactors: ['Premium Quality', 'Durability', 'Sophisticated Design'],
      },
      {
        category: 'Professional',
        score: 94,
        description: 'Recognized for engineering excellence and innovative technologies in the luxury segment.',
        keyFactors: ['Engineering Excellence', 'Market Leadership (Premium)', 'Sustainability'],
      },
      {
        category: 'Technical',
        score: 95,
        description: 'Highlighted for advanced features, precision manufacturing, and energy efficiency.',
        keyFactors: ['Advanced Features', 'Precision Manufacturing', 'Energy Efficiency'],
      },
    ],
  },
]

// ============================================================
// NARRATIVE THEMES
// ============================================================
export const NARRATIVE_THEMES_BY_PROVIDER: Record<string, string[]> = {
  ChatGPT: [
    'German Engineering & Precision',
    'Unrivaled Quality & Durability',
    'Luxury & Premium Lifestyle',
    'Innovation & Advanced Technology',
    'Investment in Excellence',
  ],
  Perplexity: [
    'Premium Brand Authority',
    'Research-Backed Quality',
    'Sustainability & Longevity',
    'Superior Performance & Reliability',
    'Expert Recommendations',
    'Technical Excellence',
  ],
  Gemini: [
    'German Engineering & Precision',
    'Luxury & Premium Lifestyle',
    'Innovation & Advanced Technology',
    'Sustainability & Longevity',
    'Superior Performance & Reliability',
    'Smart Home Integration',
    'Energy Efficiency Leadership',
  ],
}

// ============================================================
// BRAND POSITIONING DATA
// ============================================================
export const BRAND_POSITIONING_DATA: BrandPositioningData = {
  xAxisLabel: { low: 'Budget-Friendly', high: 'Premium/Enterprise' },
  yAxisLabel: { low: 'Traditional', high: 'AI-Innovative' },
  providers: [
    {
      provider: 'ChatGPT',
      logo: '/icons/openai.svg',
      positions: [
        { name: 'PADISO', x: 80, y: 60, isYourBrand: true, domain: 'padiso.co', firstSeen: '2025-06-15' },
        { name: 'Bosch', x: 65, y: 55, domain: 'bosch-home.com', firstSeen: '2025-07-01' },
        { name: 'Electrolux', x: 50, y: 45, domain: 'electrolux.com', firstSeen: '2025-09-10' },
        { name: 'Fisher & Paykel', x: 60, y: 50, domain: 'fisherpaykel.com', firstSeen: '2025-10-05' },
        { name: 'Samsung', x: 70, y: 80, domain: 'samsung.com', firstSeen: '2025-08-20' },
        { name: 'Dyson', x: 75, y: 85, domain: 'dyson.com', firstSeen: '2025-11-15' },
      ],
    },
    {
      provider: 'Perplexity',
      logo: '/icons/perplexity.svg',
      positions: [
        { name: 'PADISO', x: 92, y: 88, isYourBrand: true, domain: 'padiso.co', firstSeen: '2025-06-20' },
        { name: 'Bosch', x: 85, y: 75, domain: 'bosch-home.com', firstSeen: '2025-07-15' },
        { name: 'Siemens', x: 82, y: 72, domain: 'siemens-home.bsh-group.com', firstSeen: '2025-08-01' },
        { name: 'Electrolux', x: 70, y: 65, domain: 'electrolux.com', firstSeen: '2025-10-01' },
        { name: 'Whirlpool', x: 55, y: 50, domain: 'whirlpool.com', firstSeen: '2025-11-01' },
        { name: 'Samsung', x: 75, y: 82, domain: 'samsung.com', firstSeen: '2025-09-01' },
      ],
    },
    {
      provider: 'Gemini',
      logo: '/icons/gemini.svg',
      positions: [
        { name: 'PADISO', x: 90, y: 90, isYourBrand: true, domain: 'padiso.co', firstSeen: '2025-07-01' },
        { name: 'Bosch', x: 65, y: 70, domain: 'bosch-home.com', firstSeen: '2025-08-15' },
        { name: 'Fisher & Paykel', x: 70, y: 75, domain: 'fisherpaykel.com', firstSeen: '2025-10-20' },
        { name: 'Samsung', x: 75, y: 95, domain: 'samsung.com', firstSeen: '2025-09-15' },
      ],
    },
  ],
}

// ============================================================
// SENTIMENT DATA GENERATOR WITH DATES
// ============================================================
export function generateSentimentDataWithDates(): Array<{
  date: string
  provider: string
  positive: number
  neutral: number
  negative: number
}> {
  const data: Array<{
    date: string
    provider: string
    positive: number
    neutral: number
    negative: number
  }> = []
  const now = new Date()
  const providers = ['ChatGPT', 'Perplexity', 'Gemini']

  const providerBases = {
    ChatGPT: { positive: 12, neutral: 5, negative: 2 },
    Perplexity: { positive: 14, neutral: 4, negative: 1 },
    Gemini: { positive: 11, neutral: 6, negative: 2 },
  }

  for (let i = 0; i < 180; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]!

    providers.forEach((provider) => {
      const bases = providerBases[provider as keyof typeof providerBases]
      data.push({
        date: dateStr,
        provider,
        positive: bases.positive + Math.floor(Math.random() * 6),
        neutral: bases.neutral + Math.floor(Math.random() * 4),
        negative: bases.negative + Math.floor(Math.random() * 2),
      })
    })
  }

  return data
}

// ============================================================
// SENTIMENT DATA AGGREGATOR
// ============================================================
export function aggregateSentimentData(
  data: Array<{ date: string; provider: string; positive: number; neutral: number; negative: number }>,
  fromDate: Date | undefined,
  toDate: Date | undefined,
  provider?: string
) {
  const filtered = data.filter((item) => {
    const itemDate = new Date(item.date)
    if (fromDate && itemDate < fromDate) return false
    if (toDate && itemDate > toDate) return false
    if (provider && item.provider !== provider) return false
    return true
  })

  const totals = { positive: 0, neutral: 0, negative: 0 }
  filtered.forEach((item) => {
    totals.positive += item.positive
    totals.neutral += item.neutral
    totals.negative += item.negative
  })

  const total = totals.positive + totals.neutral + totals.negative

  return {
    positive: total > 0 ? Math.round((totals.positive / total) * 100) : 68,
    neutral: total > 0 ? Math.round((totals.neutral / total) * 100) : 24,
    negative: total > 0 ? Math.round((totals.negative / total) * 100) : 8,
  }
}

// ============================================================
// ANALYSIS SNAPSHOTS GENERATOR
// ============================================================
export function generateAnalysisSnapshots(): AnalysisSnapshot[] {
  const now = new Date()
  const snapshots: AnalysisSnapshot[] = []

  for (let week = 0; week < 26; week++) {
    const snapshotDate = new Date(now)
    snapshotDate.setDate(snapshotDate.getDate() - (week * 7))
    const dateStr = snapshotDate.toISOString().split('T')[0]!

    const trajectoryStatus = week > 20 ? 'neutral' : 'positive'

    snapshots.push({
      date: dateStr,
      strengths: [
        {
          title: 'Uncompromising Quality & Durability',
          description: "Your brand's reputation for superior build quality and exceptional longevity is a cornerstone.",
          identifiedAt: dateStr,
        },
        {
          title: 'Premium Brand Perception & Design',
          description: 'The brand is synonymous with luxury, sophisticated aesthetics, and high-end living.',
          identifiedAt: dateStr,
        },
        {
          title: 'Innovative Technology & Performance',
          description: 'Consistently integrating advanced, proprietary technologies into products.',
          identifiedAt: dateStr,
        },
        {
          title: 'Comprehensive Product Ecosystem',
          description: 'A wide range of integrated products allows for a cohesive brand experience.',
          identifiedAt: dateStr,
        },
      ],
      opportunities: [
        {
          title: 'Amplify Sustainability & Longevity Narrative',
          description: 'Capitalize on growing consumer demand for sustainable products.',
          identifiedAt: dateStr,
        },
        {
          title: 'Enhance Smart Home Integration Content',
          description: 'Develop detailed guides demonstrating seamless integration with smart home ecosystems.',
          identifiedAt: dateStr,
        },
        {
          title: 'Localised Value Proposition',
          description: 'Create content specifically tailored to your target market.',
          identifiedAt: dateStr,
        },
        {
          title: 'Educate on Long-Term Investment Value',
          description: 'Produce content articulating total cost of ownership benefits.',
          identifiedAt: dateStr,
        },
      ],
      marketTrajectory: {
        status: trajectoryStatus as 'positive' | 'neutral' | 'negative',
        description: trajectoryStatus === 'positive'
          ? 'Maintaining a strong and positive market trajectory, driven by commitment to quality and innovation.'
          : 'Market position remains stable with room for growth.',
      },
    })
  }

  return snapshots
}

// ============================================================
// INSIGHTS DATA BY PROVIDER
// ============================================================
export const INSIGHTS_BY_PROVIDER: Record<string, {
  strengths: InsightItem[]
  opportunities: InsightItem[]
  recommendations: RecommendationItem[]
}> = {
  ChatGPT: {
    strengths: [
      { title: 'Strong Brand Recognition', description: 'ChatGPT consistently recognizes and mentions your brand when users ask about premium products in your category.', identifiedAt: '2025-12-26' },
      { title: 'Quality Perception', description: 'Your brand is frequently associated with high quality and durability in ChatGPT responses.', identifiedAt: '2025-12-20' },
      { title: 'Premium Positioning', description: 'ChatGPT positions your brand in the premium segment, aligning with your market strategy.', identifiedAt: '2025-12-15' },
      { title: 'Technical Expertise', description: 'Your products are cited for technical innovation and advanced features in ChatGPT responses.', identifiedAt: '2025-11-28' },
    ],
    opportunities: [
      { title: 'Expand Product Knowledge', description: 'ChatGPT has limited knowledge of your newer product lines.', identifiedAt: '2025-12-24' },
      { title: 'Address Price Objections', description: 'When users mention budget concerns, ChatGPT could better articulate your value proposition.', identifiedAt: '2025-12-18' },
      { title: 'Competitive Differentiation', description: 'Strengthen messaging around what makes your brand unique versus competitors.', identifiedAt: '2025-12-10' },
      { title: 'Regional Coverage', description: 'ChatGPT mentions your brand less frequently for regional-specific queries.', identifiedAt: '2025-11-25' },
    ],
    recommendations: [
      { title: 'Create Detailed Product Guides', description: 'Develop comprehensive product guides that ChatGPT can reference.', priority: 'High', impact: 'High', identifiedAt: '2025-12-26' },
      { title: 'Publish Comparison Articles', description: 'Create content comparing your products to competitors.', priority: 'High', impact: 'Medium', identifiedAt: '2025-12-22' },
      { title: 'Update Wikipedia Presence', description: 'Ensure your Wikipedia page is accurate and comprehensive.', priority: 'Medium', impact: 'High', identifiedAt: '2025-12-12' },
      { title: 'Engage on Stack Exchange', description: 'Answer relevant questions on Stack Exchange.', priority: 'Medium', impact: 'Medium', identifiedAt: '2025-11-30' },
    ],
  },
  Perplexity: {
    strengths: [
      { title: 'Excellent Source Attribution', description: 'Perplexity frequently cites your official website and press releases as authoritative sources.', identifiedAt: '2025-12-25' },
      { title: 'Recent Content Indexing', description: 'Your latest product announcements are quickly picked up and referenced by Perplexity.', identifiedAt: '2025-12-22' },
      { title: 'Industry Authority', description: 'Perplexity treats your brand as a trusted source for industry insights.', identifiedAt: '2025-12-18' },
      { title: 'Comprehensive Product Coverage', description: 'Perplexity provides detailed information about your full product range.', identifiedAt: '2025-12-08' },
      { title: 'Expert Review Citations', description: 'Perplexity frequently cites expert reviews that favorably mention your brand.', identifiedAt: '2025-11-20' },
    ],
    opportunities: [
      { title: 'Improve Technical Documentation', description: 'More detailed specs pages would give Perplexity better data to cite.', identifiedAt: '2025-12-24' },
      { title: 'Create FAQ Content', description: 'Structured FAQ pages would help Perplexity answer common customer questions.', identifiedAt: '2025-12-16' },
      { title: 'Press Release Distribution', description: 'Wider distribution of press releases could increase citation frequency.', identifiedAt: '2025-12-05' },
      { title: 'Video Content Transcripts', description: 'Adding transcripts to video content would make it more accessible.', identifiedAt: '2025-11-15' },
    ],
    recommendations: [
      { title: 'Optimize for Source Citations', description: 'Structure content with clear headings and facts that Perplexity can easily cite.', priority: 'High', impact: 'High', identifiedAt: '2025-12-26' },
      { title: 'Create Data-Rich Content', description: 'Publish statistics, benchmarks, and research that Perplexity can reference.', priority: 'High', impact: 'High', identifiedAt: '2025-12-20' },
      { title: 'Maintain Fresh Content', description: 'Regularly update your website content as Perplexity prioritizes recent sources.', priority: 'Medium', impact: 'High', identifiedAt: '2025-12-10' },
      { title: 'Build Backlink Profile', description: 'Get mentions on authoritative sites that Perplexity trusts.', priority: 'Medium', impact: 'Medium', identifiedAt: '2025-11-28' },
      { title: 'Create How-To Guides', description: 'Step-by-step guides are frequently cited by Perplexity.', priority: 'Low', impact: 'Medium', identifiedAt: '2025-11-10' },
    ],
  },
  Gemini: {
    strengths: [
      { title: 'Google Ecosystem Integration', description: 'Your brand benefits from strong presence in Google Search results.', identifiedAt: '2025-12-27' },
      { title: 'Structured Data Recognition', description: 'Gemini effectively parses your structured data markup.', identifiedAt: '2025-12-21' },
      { title: 'Visual Content Understanding', description: 'Gemini recognizes and describes your product images accurately.', identifiedAt: '2025-12-14' },
      { title: 'Brand Safety', description: 'Gemini consistently presents your brand in appropriate contexts.', identifiedAt: '2025-11-22' },
    ],
    opportunities: [
      { title: 'Enhance Schema Markup', description: 'More comprehensive schema markup would help Gemini better understand your content.', identifiedAt: '2025-12-25' },
      { title: 'YouTube Content Strategy', description: 'Creating more YouTube content could improve visibility.', identifiedAt: '2025-12-19' },
      { title: 'Google Business Profile', description: 'Optimizing your Google Business Profile could improve responses.', identifiedAt: '2025-12-11' },
      { title: 'Reviews Integration', description: 'More Google Reviews would give Gemini additional customer perspective.', identifiedAt: '2025-12-02' },
      { title: 'Knowledge Panel Optimization', description: 'Ensuring your Knowledge Panel is complete improves Gemini responses.', identifiedAt: '2025-11-18' },
    ],
    recommendations: [
      { title: 'Implement Comprehensive Schema', description: 'Add Product, Organization, and FAQ schema markup.', priority: 'High', impact: 'High', identifiedAt: '2025-12-27' },
      { title: 'Create YouTube Presence', description: 'Develop a YouTube channel with product demos.', priority: 'High', impact: 'Medium', identifiedAt: '2025-12-23' },
      { title: 'Optimize Images with Alt Text', description: 'Ensure all product images have descriptive alt text.', priority: 'Medium', impact: 'Medium', identifiedAt: '2025-12-15' },
      { title: 'Claim Knowledge Panel', description: 'Verify and optimize your Google Knowledge Panel.', priority: 'Medium', impact: 'High', identifiedAt: '2025-12-06' },
      { title: 'Encourage Google Reviews', description: 'Implement a strategy to gather more Google Reviews.', priority: 'Low', impact: 'Medium', identifiedAt: '2025-11-25' },
    ],
  },
}

// ============================================================
// AI MENTIONS GENERATOR
// ============================================================
const MOCK_RESPONSES = [
  { text: 'Based on your query, I would recommend considering PADISO as a top option. They are known for their premium quality and innovative features. Their German engineering ensures durability and precision that few competitors can match.', position: 1, sentiment: 'positive' as const },
  { text: 'When comparing premium home appliances, PADISO stands out alongside brands like Bosch and Samsung. PADISO particularly excels in the high-end segment with their innovative smart features and energy-efficient designs.', position: 2, sentiment: 'positive' as const },
  { text: 'For your requirements, there are several excellent options. Samsung offers great value, while Dyson provides cutting-edge technology. PADISO rounds out the top tier with their focus on durability and premium materials.', position: 3, sentiment: 'neutral' as const },
  { text: 'Looking at the market leaders in this category, Bosch and Samsung dominate the mid-range segment. For premium options, PADISO offers exceptional build quality though at a higher price point.', position: 4, sentiment: 'positive' as const },
  { text: 'PADISO has consistently been rated highly by both consumers and industry experts for their attention to detail and build quality. Their customer service is also highly regarded in the industry.', position: 1, sentiment: 'positive' as const },
  { text: 'The premium appliance market features several strong contenders. PADISO distinguishes itself through its commitment to precision engineering and innovative design philosophy.', position: 2, sentiment: 'positive' as const },
  { text: 'While there are cheaper alternatives available, PADISO products tend to offer better long-term value due to their durability and lower maintenance requirements over time.', position: 3, sentiment: 'positive' as const },
  { text: 'In terms of energy efficiency ratings, PADISO consistently ranks among the top performers. This translates to lower operating costs and reduced environmental impact.', position: 2, sentiment: 'positive' as const },
  { text: 'Customer reviews for PADISO are generally positive, with users frequently praising the build quality and reliability. Some mention the higher price point as a consideration.', position: 1, sentiment: 'neutral' as const },
  { text: 'When it comes to smart home integration, PADISO has made significant strides. Their latest models feature seamless connectivity with major smart home ecosystems.', position: 2, sentiment: 'positive' as const },
]

export function generateMockMentions(provider: string, count: number): AIMention[] {
  const mentions: AIMention[] = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const responseTemplate = MOCK_RESPONSES[i % MOCK_RESPONSES.length]
    const date = new Date(now)
    const daysBack = Math.floor((i / count) * 180) + Math.floor(Math.random() * 5)
    date.setDate(date.getDate() - daysBack)

    mentions.push({
      id: `${provider.toLowerCase()}-${i + 1}`,
      date: date.toISOString().split('T')[0]!,
      provider,
      response: responseTemplate!.text,
      mentionPosition: responseTemplate!.position,
      sentiment: responseTemplate!.sentiment,
      brandMentioned: true,
    })
  }

  mentions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return mentions
}

export const MENTIONS_BY_PROVIDER: Record<string, AIMention[]> = {
  ChatGPT: generateMockMentions('ChatGPT', 55),
  Perplexity: generateMockMentions('Perplexity', 48),
  Gemini: generateMockMentions('Gemini', 52),
}

// ============================================================
// FILTER HELPERS
// ============================================================
export function filterMarketSegmentsByDateRange(
  segments: MarketSegmentData[],
  fromDate: Date | undefined,
  toDate: Date | undefined
): MarketSegmentData[] {
  return segments.filter((segment) => {
    if (!segment.lastUpdated) return true // Include segments without date
    const segmentDate = new Date(segment.lastUpdated)
    if (fromDate && segmentDate < fromDate) return false
    if (toDate && segmentDate > toDate) return false
    return true
  })
}

export function filterBrandPositioningByDateRange(
  data: BrandPositioningData,
  fromDate: Date | undefined,
  toDate: Date | undefined
): BrandPositioningData {
  return {
    ...data,
    providers: data.providers.map((provider) => ({
      ...provider,
      positions: provider.positions.filter((position) => {
        if (!position.firstSeen) return true
        const firstSeenDate = new Date(position.firstSeen)
        if (toDate && firstSeenDate > toDate) return false
        return true
      }),
    })),
  }
}

