'use client'

import { useState, useEffect } from 'react'
import { AnalyticsDatePicker } from '@/components/analytics-date-picker'
import { AnalyticsDateRangeProvider, useAnalyticsDateRange } from '@/hooks/use-analytics-date-range'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { Input } from '@workspace/ui/components/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip'
import {
  ExternalLink,
  ArrowLeft,
  Search,
  HelpCircle,
  Tag,
  TrendingUp,
  BarChart3,
  Loader2,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from 'recharts'
import {
  OverviewStats,
  ProviderScores,
  BrandPositioningSection,
  SentimentSection,
} from '@/components/modules/ai-visibility'
import { VisibilityTrendChart } from '@/components/modules/prompts/analytics/visibility-trend-chart'
import { cn } from '@/lib/utils'

// ============================================================
// TYPE DEFINITIONS
// ============================================================
interface LLMProvider {
  name: string
  logo: string
  score: number
  status: 'excellent' | 'good' | 'needs-improvement'
  trend: 'up' | 'down' | 'stable'
}

interface BrandRecognition {
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

interface MarketCompetition {
  title: string
  queries: number
  totalMentions: number
  data: Array<{ name: string; value: number; color: string }>
  keyFactors: string[]
}

interface SentimentMetric {
  category: string
  score: number
  description: string
  keyFactors: string[]
}

interface SentimentAnalysis {
  provider: string
  logo: string
  totalScore: number
  polarization: number
  reliableData: boolean
  metrics: SentimentMetric[]
}

interface AnalysisSummary {
  strengths: Array<{ title: string; description: string }>
  opportunities: Array<{ title: string; description: string }>
  marketTrajectory: {
    status: 'positive' | 'neutral' | 'negative'
    description: string
  }
}

interface BrandPosition {
  name: string
  x: number
  y: number
  isYourBrand?: boolean
  domain?: string
}

interface BrandPositioningProvider {
  provider: string
  logo: string
  positions: BrandPosition[]
}

interface BrandPositioning {
  xAxisLabel: { low: string; high: string }
  yAxisLabel: { low: string; high: string }
  providers: BrandPositioningProvider[]
}

// Mention type for analytics
interface AIMention {
  id: string
  date: string
  provider: string
  response: string
  brandMentioned: boolean
  mentionPosition: number | null
  sentiment: string
  sentimentScore: number
}

// Competitor type for analytics
interface Competitor {
  name: string
  domain: string
  isYourBrand: boolean
  mentionPercentage: number
  totalMentions: number
  contextType: string
}

interface AIVisibilityData {
  llmProviders: LLMProvider[]
  brandRecognition: BrandRecognition[]
  marketCompetition: MarketCompetition[]
  analysisSummary: AnalysisSummary
  sentimentAnalysis: SentimentAnalysis[]
  narrativeThemes: string[]
  narrativeThemesByProvider?: Record<string, string[]>
  contentIdeas: string[]
  brandPositioning: BrandPositioning
  mentions?: AIMention[]
  competitors?: Competitor[]
}

interface AIVisibilityStats {
  overallScore: number
  brandMentions: number
  competitorGap: number
  aiEnginesTracked: number
  visibilityTrend: 'up' | 'down' | 'stable'
  sentimentScore: number
}

// ============================================================
// COST TRACKER MOCK DATA
// ============================================================
type CostChartDataPoint = {
  date: string
  displayDate: string
  value: number
}

const generateCostData = (baseValue: number, variance: number): CostChartDataPoint[] => {
  const data: CostChartDataPoint[] = []
  const startDate = new Date('2024-11-21')

  for (let i = 0; i < 31; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    const randomValue = baseValue + Math.floor(Math.random() * variance)

    data.push({
      date: date.toISOString().split('T')[0]!,
      displayDate: `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getDate()}`,
      value: randomValue,
    })
  }

  return data
}

const apiCallsData = generateCostData(50, 100)
const tokensUsedData = generateCostData(10000, 50000)

// ============================================================
// COST TRACKER COMPONENTS
// ============================================================
function CostAreaChart({ data, color = '#2563eb' }: { data: CostChartDataPoint[]; color?: string }) {
  return (
    <div className="dark:bg-polar-900 flex w-full flex-col gap-y-2 rounded-3xl bg-white p-4">
      <div style={{ height: '200px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`cost-gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.025} />
                <stop offset="100%" stopColor={color} stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="6 6" stroke="#ccc" opacity={0.3} vertical={true} horizontal={false} />
            <XAxis
              dataKey="displayDate"
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#cost-gradient-${color})`}
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function CostMetricCard({
  title,
  value,
  dateRange,
  data,
  color = '#2563eb',
  span = 1,
  icon,
}: {
  title: string
  value: string | number
  dateRange: string
  data: CostChartDataPoint[]
  color?: string
  span?: 1 | 2
  icon?: string
}) {
  return (
    <div
      className={`group flex w-full flex-col justify-between p-2 bg-transparent dark:bg-transparent border ${
        span === 2 ? 'lg:col-span-2' : ''
      } dark:border-polar-700 border-t-0 border-r border-b border-l-0 border-gray-200 shadow-none`}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between p-6">
        <div className="flex w-full flex-col gap-y-4">
          <div className="flex flex-row items-center gap-x-2">
            {icon && (
              <Image src={icon} alt={title} width={20} height={20} className="shrink-0" />
            )}
            <h3 className="text-lg">{title}</h3>
          </div>
          <h2 className="text-5xl font-light">{value}</h2>
          <div className="flex flex-col gap-x-6 gap-y-2 md:flex-row md:items-center">
            <div className="flex flex-row items-center gap-x-2 text-sm">
              <span className="h-3 w-3 rounded-full border-2 border-blue-500"></span>
              <span className="text-gray-500 dark:text-polar-500">{dateRange}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="hidden rounded-full opacity-0 transition-opacity group-hover:opacity-100 md:block h-8 w-8"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CostAreaChart data={data} color={color} />
    </div>
  )
}

function _CostTrackerGrid() {
  const cards = [
    {
      title: 'Total API Calls',
      value: apiCallsData.reduce((acc, d) => acc + d.value, 0).toLocaleString(),
      dateRange: 'Nov 21 – Dec 21, 2025',
      data: apiCallsData,
      color: '#2563eb',
      span: 2 as const,
    },
    {
      title: 'Tokens Used',
      value: `${(tokensUsedData.reduce((acc, d) => acc + d.value, 0) / 1000).toFixed(1)}K`,
      dateRange: 'Nov 21 – Dec 21, 2025',
      data: tokensUsedData,
      color: '#10b981',
      span: 1 as const,
    },
  ]

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-y-6">
        <div className="dark:border-polar-700 flex flex-col overflow-hidden rounded-2xl border border-gray-200">
          <div className="grid grid-cols-1 flex-col [clip-path:inset(1px_1px_1px_1px)] md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card, index) => (
              <CostMetricCard key={index} {...card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Provider usage mock data
const chatGptUsageData = generateCostData(20, 40)
const perplexityUsageData = generateCostData(15, 30)
const geminiUsageData = generateCostData(18, 35)

function _ProviderUsageGrid() {
  const providerCards = [
    {
      title: 'ChatGPT',
      value: chatGptUsageData.reduce((acc, d) => acc + d.value, 0).toLocaleString(),
      dateRange: 'Nov 21 – Dec 21, 2025',
      data: chatGptUsageData,
      color: '#10b981',
      span: 1 as const,
      icon: '/icons/openai.svg',
    },
    {
      title: 'Perplexity',
      value: perplexityUsageData.reduce((acc, d) => acc + d.value, 0).toLocaleString(),
      dateRange: 'Nov 21 – Dec 21, 2025',
      data: perplexityUsageData,
      color: '#8b5cf6',
      span: 1 as const,
      icon: '/icons/perplexity.svg',
    },
    {
      title: 'Gemini',
      value: geminiUsageData.reduce((acc, d) => acc + d.value, 0).toLocaleString(),
      dateRange: 'Nov 21 – Dec 21, 2025',
      data: geminiUsageData,
      color: '#3b82f6',
      span: 1 as const,
      icon: '/icons/gemini.svg',
    },
  ]

  return (
    <div className="flex flex-col gap-y-6">
      <h3 className="text-lg font-medium">Usage by Provider</h3>
      <div className="dark:border-polar-700 flex flex-col overflow-hidden rounded-2xl border border-gray-200">
        <div className="grid grid-cols-1 flex-col [clip-path:inset(1px_1px_1px_1px)] md:grid-cols-2 lg:grid-cols-3">
          {providerCards.map((card, index) => (
            <CostMetricCard key={index} {...card} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// MOCK DATA - This will be replaced with real data from API
// ============================================================
const MOCK_AI_VISIBILITY_DATA: AIVisibilityData = {
  llmProviders: [
    {
      name: 'ChatGPT',
      logo: '/icons/openai.svg',
      score: 72,
      status: 'good',
      trend: 'stable',
    },
    {
      name: 'Perplexity',
      logo: '/icons/perplexity.svg',
      score: 92,
      status: 'excellent',
      trend: 'up',
    },
    {
      name: 'Gemini',
      logo: '/icons/gemini.svg',
      score: 90,
      status: 'excellent',
      trend: 'stable',
    },
  ],
  brandRecognition: [
    {
      provider: 'ChatGPT',
      logo: '/icons/openai.svg',
      score: 70,
      marketPosition: 'Established',
      brandArchetype: 'Expert',
      confidenceLevel: 65,
      mentionDepth: 6,
      sourceQuality: 7,
      dataRichness: 6,
    },
    {
      provider: 'Perplexity',
      logo: '/icons/perplexity.svg',
      score: 88,
      marketPosition: 'Established',
      brandArchetype: 'Expert',
      confidenceLevel: 95,
      mentionDepth: 8,
      sourceQuality: 9,
      dataRichness: 8,
    },
    {
      provider: 'Gemini',
      logo: '/icons/gemini.svg',
      score: 92,
      marketPosition: 'Leader',
      brandArchetype: 'Expert',
      confidenceLevel: 95,
      mentionDepth: 9,
      sourceQuality: 9,
      dataRichness: 9,
    },
  ],
  marketCompetition: [
    {
      title: 'Premium Home Appliances',
      queries: 150,
      totalMentions: 1200,
      data: [
        { name: 'Miele', value: 25, color: '#3b82f6' },
        { name: 'Bosch', value: 20, color: '#8b5cf6' },
        { name: 'Siemens', value: 18, color: '#ec4899' },
        { name: 'Electrolux', value: 15, color: '#f59e0b' },
        { name: 'Whirlpool', value: 12, color: '#10b981' },
        { name: 'Other', value: 10, color: '#6b7280' },
      ],
      keyFactors: ['AI-enabled features', 'Durability reputation', 'Premium pricing'],
    },
    {
      title: 'Smart Kitchen Appliances',
      queries: 100,
      totalMentions: 850,
      data: [
        { name: 'Miele', value: 28, color: '#3b82f6' },
        { name: 'Thermador', value: 22, color: '#8b5cf6' },
        { name: 'Wolf', value: 19, color: '#ec4899' },
        { name: 'Viking', value: 14, color: '#f59e0b' },
        { name: 'Gaggenau', value: 11, color: '#10b981' },
        { name: 'Other', value: 6, color: '#6b7280' },
      ],
      keyFactors: ['Connected smart features', 'Energy efficiency', 'Design aesthetics'],
    },
    {
      title: 'Laundry Appliances',
      queries: 80,
      totalMentions: 650,
      data: [
        { name: 'Miele', value: 30, color: '#3b82f6' },
        { name: 'LG', value: 21, color: '#8b5cf6' },
        { name: 'Samsung', value: 18, color: '#ec4899' },
        { name: 'Speed Queen', value: 13, color: '#f59e0b' },
        { name: 'Maytag', value: 10, color: '#10b981' },
        { name: 'Other', value: 8, color: '#6b7280' },
      ],
      keyFactors: ['Longevity and reliability', 'AI optimization', 'Water/energy savings'],
    },
  ],
  analysisSummary: {
    strengths: [
      {
        title: 'Uncompromising Quality & Durability',
        description:
          "Your brand's reputation for superior build quality and exceptional longevity is a cornerstone. This translates into high customer satisfaction and strong word-of-mouth referral.",
      },
      {
        title: 'Premium Brand Perception & Design',
        description:
          'The brand is synonymous with luxury, sophisticated aesthetics, and high-end living. This perception allows commanding premium pricing and attracts a discerning customer base.',
      },
      {
        title: 'Innovative Technology & Performance',
        description:
          'Consistently integrating advanced, proprietary technologies into products, offering superior performance, efficiency, and user experience.',
      },
      {
        title: 'Comprehensive Product Ecosystem',
        description:
          'A wide range of integrated products allows for a cohesive brand experience, encouraging repeat purchases and cross-selling.',
      },
    ],
    opportunities: [
      {
        title: 'Amplify Sustainability & Longevity Narrative',
        description:
          "Capitalize on growing consumer demand for sustainable products by creating content that links durability and repairability to environmental benefits.",
      },
      {
        title: 'Enhance Smart Home Integration Content',
        description:
          'Develop detailed guides and tutorials demonstrating seamless integration with smart home ecosystems to attract tech-savvy customers.',
      },
      {
        title: 'Localised Value Proposition',
        description:
          'Create content specifically tailored to your target market, featuring local testimonials, service network advantages, and lifestyle fit.',
      },
      {
        title: 'Educate on Long-Term Investment Value',
        description:
          'Produce content articulating total cost of ownership benefits, contrasting initial prices with long-term savings from durability and efficiency.',
      },
    ],
    marketTrajectory: {
      status: 'positive',
      description:
        'Maintaining a strong and positive market trajectory, driven by commitment to quality, innovation, and premium brand image. Position in the luxury segment is robust with consistent demand.',
    },
  },
  sentimentAnalysis: [
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
  ],
  narrativeThemes: [
    'German Engineering & Precision',
    'Unrivaled Quality & Durability',
    'Luxury & Premium Lifestyle',
    'Innovation & Advanced Technology',
    'Sustainability & Longevity',
    'Investment in Excellence',
    'Superior Performance & Reliability',
  ],
  narrativeThemesByProvider: {
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
  },
  contentIdeas: [],
  brandPositioning: {
    xAxisLabel: { low: 'Budget-Friendly', high: 'Premium/Enterprise' },
    yAxisLabel: { low: 'Traditional', high: 'AI-Innovative' },
    providers: [
      {
        provider: 'ChatGPT',
        logo: '/icons/openai.svg',
        positions: [
          { name: 'Your Brand', x: 80, y: 60, isYourBrand: true, domain: 'miele.com' },
          { name: 'Bosch', x: 65, y: 55, domain: 'bosch-home.com' },
          { name: 'Electrolux', x: 50, y: 45, domain: 'electrolux.com' },
          { name: 'Fisher & Paykel', x: 60, y: 50, domain: 'fisherpaykel.com' },
          { name: 'Samsung', x: 70, y: 80, domain: 'samsung.com' },
          { name: 'Dyson', x: 75, y: 85, domain: 'dyson.com' },
        ],
      },
      {
        provider: 'Perplexity',
        logo: '/icons/perplexity.svg',
        positions: [
          { name: 'Your Brand', x: 92, y: 88, isYourBrand: true, domain: 'miele.com' },
          { name: 'Bosch', x: 85, y: 75, domain: 'bosch-home.com' },
          { name: 'Siemens', x: 82, y: 72, domain: 'siemens-home.bsh-group.com' },
          { name: 'Electrolux', x: 70, y: 65, domain: 'electrolux.com' },
          { name: 'Whirlpool', x: 55, y: 50, domain: 'whirlpool.com' },
          { name: 'LG', x: 65, y: 85, domain: 'lg.com' },
          { name: 'Samsung', x: 75, y: 82, domain: 'samsung.com' },
          { name: 'Thermador', x: 95, y: 70, domain: 'thermador.com' },
          { name: 'Gaggenau', x: 98, y: 78, domain: 'gaggenau.com' },
        ],
      },
      {
        provider: 'Gemini',
        logo: '/icons/gemini.svg',
        positions: [
          { name: 'Your Brand', x: 90, y: 90, isYourBrand: true, domain: 'miele.com' },
          { name: 'Gaggenau', x: 95, y: 80, domain: 'gaggenau.com' },
          { name: 'Sub-Zero/Wolf', x: 92, y: 75, domain: 'subzero-wolf.com' },
          { name: 'Bosch', x: 65, y: 70, domain: 'bosch-home.com' },
          { name: 'Fisher & Paykel', x: 70, y: 75, domain: 'fisherpaykel.com' },
          { name: 'Samsung', x: 75, y: 95, domain: 'samsung.com'         },
      ],
    },
  ],
  },
}

// ============================================================
// COMPETITION TAB MOCK DATA
// ============================================================
const PROVIDERS = [
  { id: 'chatgpt', name: 'ChatGPT', logo: '/icons/openai.svg', color: '#10a37f' },
  { id: 'perplexity', name: 'Perplexity', logo: '/icons/perplexity.svg', color: '#8b5cf6' },
  { id: 'gemini', name: 'Gemini', logo: '/icons/gemini.svg', color: '#4285f4' },
] as const

type CompetitorData = {
  name: string
  value: number
  color: string
  position: number
  dateFound: string
  domain: string | null
  isYourBrand: boolean
}

// Helper to get favicon URL from domain
function getFaviconUrl(domain: string | null): string | null {
  if (!domain) return null
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
}

const competitorDataByProvider: Record<string, CompetitorData[]> = {
  ChatGPT: [
    { name: 'Your Brand', value: 28, color: '#3b82f6', position: 1, dateFound: '2025-12-10', domain: 'miele.com', isYourBrand: true },
    { name: 'Samsung', value: 22, color: '#1428a0', position: 2, dateFound: '2025-12-08', domain: 'samsung.com', isYourBrand: false },
    { name: 'Dyson', value: 18, color: '#ff6900', position: 3, dateFound: '2025-12-12', domain: 'dyson.com', isYourBrand: false },
    { name: 'Bosch', value: 15, color: '#e20015', position: 4, dateFound: '2025-12-14', domain: 'bosch-home.com', isYourBrand: false },
    { name: 'Electrolux', value: 10, color: '#041e42', position: 5, dateFound: '2025-12-16', domain: 'electrolux.com', isYourBrand: false },
    { name: 'Fisher & Paykel', value: 7, color: '#00263a', position: 6, dateFound: '2025-12-18', domain: 'fisherpaykel.com', isYourBrand: false },
  ],
  Perplexity: [
    { name: 'Your Brand', value: 32, color: '#3b82f6', position: 1, dateFound: '2025-12-09', domain: 'miele.com', isYourBrand: true },
    { name: 'Samsung', value: 24, color: '#1428a0', position: 2, dateFound: '2025-12-07', domain: 'samsung.com', isYourBrand: false },
    { name: 'Bosch', value: 18, color: '#e20015', position: 3, dateFound: '2025-12-11', domain: 'bosch-home.com', isYourBrand: false },
    { name: 'Siemens', value: 12, color: '#009999', position: 4, dateFound: '2025-12-13', domain: 'siemens-home.bsh-group.com', isYourBrand: false },
    { name: 'Electrolux', value: 8, color: '#041e42', position: 5, dateFound: '2025-12-15', domain: 'electrolux.com', isYourBrand: false },
    { name: 'Whirlpool', value: 6, color: '#1d4370', position: 6, dateFound: '2025-12-17', domain: 'whirlpool.com', isYourBrand: false },
  ],
  Gemini: [
    { name: 'Samsung', value: 30, color: '#1428a0', position: 1, dateFound: '2025-12-06', domain: 'samsung.com', isYourBrand: false },
    { name: 'Your Brand', value: 26, color: '#3b82f6', position: 2, dateFound: '2025-12-08', domain: 'miele.com', isYourBrand: true },
    { name: 'Bosch', value: 20, color: '#e20015', position: 3, dateFound: '2025-12-10', domain: 'bosch-home.com', isYourBrand: false },
    { name: 'Fisher & Paykel', value: 24, color: '#00263a', position: 4, dateFound: '2025-12-12', domain: 'fisherpaykel.com', isYourBrand: false },
  ],
}

// Market segment data per provider
type MarketSegmentData = {
  title: string
  queries: number
  totalMentions: number
  data: Array<{ name: string; value: number; color: string; domain: string | null }>
  keyFactors: string[]
  lastUpdated: string
}

const marketSegmentsDataByProvider: Record<string, MarketSegmentData[]> = {
  ChatGPT: [
    {
      title: 'Premium Home Appliances',
      queries: 450,
      totalMentions: 3600,
      data: [
        { name: 'Your Brand', value: 25, color: '#3b82f6', domain: 'miele.com' },
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
      queries: 300,
      totalMentions: 2550,
      data: [
        { name: 'Your Brand', value: 28, color: '#3b82f6', domain: 'miele.com' },
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
      queries: 240,
      totalMentions: 1950,
      data: [
        { name: 'Your Brand', value: 30, color: '#3b82f6', domain: 'miele.com' },
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
      queries: 540,
      totalMentions: 4350,
      data: [
        { name: 'Your Brand', value: 32, color: '#3b82f6', domain: 'miele.com' },
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
      queries: 360,
      totalMentions: 2940,
      data: [
        { name: 'Your Brand', value: 35, color: '#3b82f6', domain: 'miele.com' },
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
      queries: 285,
      totalMentions: 2160,
      data: [
        { name: 'Your Brand', value: 28, color: '#3b82f6', domain: 'miele.com' },
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
      queries: 420,
      totalMentions: 3300,
      data: [
        { name: 'Your Brand', value: 22, color: '#3b82f6', domain: 'miele.com' },
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
      queries: 330,
      totalMentions: 2670,
      data: [
        { name: 'Your Brand', value: 26, color: '#3b82f6', domain: 'miele.com' },
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
      queries: 225,
      totalMentions: 1740,
      data: [
        { name: 'Samsung', value: 26, color: '#1428a0', domain: 'samsung.com' },
        { name: 'Your Brand', value: 24, color: '#3b82f6', domain: 'miele.com' },
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
// MENTIONS TAB MOCK DATA
// ============================================================
function generateMockMentions(provider: string, count: number) {
  const responses = [
    { text: 'Based on your query, I would recommend considering Miele as a top option. They are known for their premium quality and innovative features. Their German engineering ensures durability and precision that few competitors can match.', position: 1, sentiment: 'positive' as const },
    { text: 'When comparing premium home appliances, Miele stands out alongside brands like Bosch and Samsung. Miele particularly excels in the high-end segment with their innovative smart features and energy-efficient designs.', position: 2, sentiment: 'positive' as const },
    { text: 'For your requirements, there are several excellent options. Samsung offers great value, while Dyson provides cutting-edge technology. Miele rounds out the top tier with their focus on durability and premium materials.', position: 3, sentiment: 'neutral' as const },
    { text: 'Looking at the market leaders in this category, Bosch and Samsung dominate the mid-range segment. For premium options, Miele offers exceptional build quality though at a higher price point.', position: 4, sentiment: 'positive' as const },
    { text: 'Miele has consistently been rated highly by both consumers and industry experts for their attention to detail and build quality. Their customer service is also highly regarded in the industry.', position: 1, sentiment: 'positive' as const },
    { text: 'The premium appliance market features several strong contenders. Miele distinguishes itself through its commitment to precision engineering and innovative design philosophy.', position: 2, sentiment: 'positive' as const },
  ]

  const mentions = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const responseTemplate = responses[i % responses.length]!
    const date = new Date(now)
    const daysBack = Math.floor((i / count) * 180) + Math.floor(Math.random() * 5)
    date.setDate(date.getDate() - daysBack)

    mentions.push({
      id: `${provider.toLowerCase()}-${i + 1}`,
      date: date.toISOString().split('T')[0]!,
      prompt: ['Best premium appliances', 'Top kitchen brands', 'Quality laundry machines', 'Smart home appliances'][i % 4]!,
      response: responseTemplate.text,
      mentionPosition: responseTemplate.position,
      sentiment: responseTemplate.sentiment,
      brandMentioned: true,
    })
  }

  mentions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return mentions
}

const mentionsDataByProvider: Record<string, Array<{
  id: string
  date: string
  prompt: string
  response: string
  mentionPosition: number
  sentiment: 'positive' | 'neutral' | 'negative'
  brandMentioned: boolean
}>> = {
  ChatGPT: generateMockMentions('ChatGPT', 55),
  Perplexity: generateMockMentions('Perplexity', 48),
  Gemini: generateMockMentions('Gemini', 52),
}

// ============================================================
// INSIGHTS TAB MOCK DATA
// ============================================================
type InsightItem = { title: string; description: string; identifiedAt: string }
type RecommendationItem = InsightItem & { priority: string; impact: string }

const insightsDataByProvider: Record<string, {
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
      { title: 'Expand Product Knowledge', description: 'ChatGPT has limited knowledge of your newer product lines. Creating more indexable content could improve coverage.', identifiedAt: '2025-12-24' },
      { title: 'Address Price Objections', description: 'When users mention budget concerns, ChatGPT could better articulate your value proposition.', identifiedAt: '2025-12-18' },
      { title: 'Competitive Differentiation', description: 'Strengthen messaging around what makes your brand unique versus competitors in ChatGPT responses.', identifiedAt: '2025-12-10' },
      { title: 'Regional Coverage', description: 'ChatGPT mentions your brand less frequently for regional-specific queries. Localized content could help.', identifiedAt: '2025-11-25' },
    ],
    recommendations: [
      { title: 'Create Detailed Product Guides', description: 'Develop comprehensive product guides that ChatGPT can reference when answering detailed questions.', priority: 'High', impact: 'High', identifiedAt: '2025-12-26' },
      { title: 'Publish Comparison Articles', description: 'Create content comparing your products to competitors, highlighting your unique advantages.', priority: 'High', impact: 'Medium', identifiedAt: '2025-12-22' },
      { title: 'Update Wikipedia Presence', description: 'Ensure your Wikipedia page is accurate and comprehensive as ChatGPT often references it.', priority: 'Medium', impact: 'High', identifiedAt: '2025-12-12' },
      { title: 'Engage on Stack Exchange', description: 'Answer relevant questions on Stack Exchange where your expertise applies.', priority: 'Medium', impact: 'Medium', identifiedAt: '2025-11-30' },
    ],
  },
  Perplexity: {
    strengths: [
      { title: 'Excellent Source Attribution', description: 'Perplexity frequently cites your official website and press releases as authoritative sources.', identifiedAt: '2025-12-25' },
      { title: 'Recent Content Indexing', description: 'Your latest product announcements are quickly picked up and referenced by Perplexity.', identifiedAt: '2025-12-22' },
      { title: 'Industry Authority', description: 'Perplexity treats your brand as a trusted source for industry insights and best practices.', identifiedAt: '2025-12-18' },
      { title: 'Comprehensive Product Coverage', description: 'Perplexity provides detailed information about your full product range.', identifiedAt: '2025-12-08' },
    ],
    opportunities: [
      { title: 'Improve Technical Documentation', description: 'More detailed specs pages would give Perplexity better data to cite in technical queries.', identifiedAt: '2025-12-24' },
      { title: 'Create FAQ Content', description: 'Structured FAQ pages would help Perplexity answer common customer questions more accurately.', identifiedAt: '2025-12-16' },
      { title: 'Press Release Distribution', description: 'Wider distribution of press releases could increase citation frequency.', identifiedAt: '2025-12-05' },
    ],
    recommendations: [
      { title: 'Optimize for Source Citations', description: 'Structure content with clear headings and facts that Perplexity can easily cite and attribute.', priority: 'High', impact: 'High', identifiedAt: '2025-12-26' },
      { title: 'Create Data-Rich Content', description: 'Publish statistics, benchmarks, and research that Perplexity can reference as authoritative data.', priority: 'High', impact: 'High', identifiedAt: '2025-12-20' },
      { title: 'Maintain Fresh Content', description: 'Regularly update your website content as Perplexity prioritizes recent sources.', priority: 'Medium', impact: 'High', identifiedAt: '2025-12-10' },
    ],
  },
  Gemini: {
    strengths: [
      { title: 'Google Ecosystem Integration', description: 'Your brand benefits from strong presence in Google Search results which Gemini leverages.', identifiedAt: '2025-12-27' },
      { title: 'Structured Data Recognition', description: 'Gemini effectively parses your structured data markup for accurate product information.', identifiedAt: '2025-12-21' },
      { title: 'Visual Content Understanding', description: 'Gemini recognizes and describes your product images accurately in multimodal queries.', identifiedAt: '2025-12-14' },
    ],
    opportunities: [
      { title: 'Enhance Schema Markup', description: 'More comprehensive schema markup would help Gemini better understand your content hierarchy.', identifiedAt: '2025-12-25' },
      { title: 'YouTube Content Strategy', description: 'Creating more YouTube content could improve visibility as Gemini integrates video sources.', identifiedAt: '2025-12-19' },
      { title: 'Google Business Profile', description: 'Optimizing your Google Business Profile could improve local and service-related responses.', identifiedAt: '2025-12-11' },
    ],
    recommendations: [
      { title: 'Implement Comprehensive Schema', description: 'Add Product, Organization, and FAQ schema markup across your website.', priority: 'High', impact: 'High', identifiedAt: '2025-12-27' },
      { title: 'Create YouTube Presence', description: 'Develop a YouTube channel with product demos and tutorials that Gemini can reference.', priority: 'High', impact: 'Medium', identifiedAt: '2025-12-23' },
      { title: 'Optimize Images with Alt Text', description: 'Ensure all product images have descriptive alt text for Gemini\'s multimodal understanding.', priority: 'Medium', impact: 'Medium', identifiedAt: '2025-12-15' },
    ],
  },
}

// Calculate overview stats from the data
const calculateStats = (data: AIVisibilityData): AIVisibilityStats => {
  const avgScore = data.llmProviders.reduce((acc, p) => acc + p.score, 0) / data.llmProviders.length
  const avgSentiment = data.sentimentAnalysis.reduce((acc, p) => acc + p.totalScore, 0) / data.sentimentAnalysis.length

  // Calculate brand mentions from market competition data
  const totalMentions = data.marketCompetition.reduce((acc, s) => {
    const brandMentions = s.data.find((d) => d.name === 'Miele' || d.name === 'Your Brand')
    return acc + (brandMentions ? Math.round((brandMentions.value / 100) * s.totalMentions) : 0)
  }, 0)

  // Calculate competitor gap (difference from top competitor)
  const avgMarketShare =
    data.marketCompetition.reduce((acc, s) => {
      const brandShare = s.data.find((d) => d.name === 'Miele' || d.name === 'Your Brand')?.value || 0
      const topCompetitor = s.data.filter((d) => d.name !== 'Miele' && d.name !== 'Your Brand' && d.name !== 'Other')
      const topCompetitorShare = Math.max(...topCompetitor.map((c) => c.value), 0)
      return acc + (brandShare - topCompetitorShare)
    }, 0) / data.marketCompetition.length

  // Determine overall trend
  const upTrends = data.llmProviders.filter((p) => p.trend === 'up').length
  const downTrends = data.llmProviders.filter((p) => p.trend === 'down').length
  const visibilityTrend = upTrends > downTrends ? 'up' : downTrends > upTrends ? 'down' : 'stable'

  return {
    overallScore: Math.round(avgScore),
    brandMentions: totalMentions,
    competitorGap: Math.round(avgMarketShare),
    aiEnginesTracked: data.llmProviders.length,
    visibilityTrend,
    sentimentScore: Math.round(avgSentiment),
  }
}

// ============================================================
// COMPETITION TAB CONTENT
// ============================================================
function CompetitorMentionsChart({
  selectedProvider,
  onProviderChange,
  data,
}: {
  selectedProvider: string
  onProviderChange: (provider: string) => void
  data: CompetitorData[]
}) {
  const yourBrand = data.find(c => c.isYourBrand)
  const topCompetitor = [...data].filter(c => !c.isYourBrand).sort((a, b) => b.value - a.value)[0]
  const gap = yourBrand && topCompetitor ? yourBrand.value - topCompetitor.value : 0

  const marketPositionData = [
    {
      name: yourBrand?.name || 'Your Brand',
      value: yourBrand?.value || 0,
      color: '#3b82f6',
      isYourBrand: true,
      domain: yourBrand?.domain || null
    },
    {
      name: topCompetitor?.name || 'Top Competitor',
      value: topCompetitor?.value || 0,
      color: topCompetitor?.color || '#8b5cf6',
      isYourBrand: false,
      domain: topCompetitor?.domain || null
    },
    {
      name: 'Others',
      value: data.filter(c => !c.isYourBrand && c !== topCompetitor).reduce((sum, c) => sum + c.value, 0),
      color: '#94a3b8',
      isYourBrand: false,
      domain: null
    },
  ]

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
        <div className="flex w-full flex-col gap-y-2">
          <span className="text-lg font-semibold">Competitor Mentions</span>
          <p className="text-sm text-muted-foreground">
            Aggregated share of voice across all tracked prompts.
          </p>
        </div>

        <div className="flex shrink-0 flex-row items-center gap-2">
          {PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              onClick={() => onProviderChange(provider.name)}
              className={cn(
                'flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all',
                selectedProvider === provider.name
                  ? 'bg-card shadow-sm ring-1 ring-border'
                  : 'opacity-50 hover:opacity-75'
              )}
            >
              <div className="relative h-4 w-4">
                <Image
                  src={provider.logo}
                  alt={provider.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span>{provider.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col gap-y-2 rounded-3xl bg-card p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart 1 - Full Distribution */}
          <div className="flex flex-col">
            <h4 className="text-sm font-medium mb-4 text-muted-foreground">Full Distribution</h4>
            <div className="flex flex-col items-center gap-6">
              <div style={{ width: '280px', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        padding: '8px 12px',
                      }}
                      formatter={(value, name) => [`${value}%`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                {data.map((item) => {
                  const faviconUrl = getFaviconUrl(item.domain)
                  return (
                    <div key={item.name} className="flex items-center gap-2">
                      {faviconUrl ? (
                        <div className="relative h-4 w-4 shrink-0 overflow-hidden rounded">
                          <Image src={faviconUrl} alt={item.name} fill className="object-contain" unoptimized />
                        </div>
                      ) : (
                        <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      )}
                      <span className={cn("text-sm", item.isYourBrand && "font-medium text-primary")}>{item.name}</span>
                      <span className={cn("text-sm font-medium", item.isYourBrand && "text-primary")}>{item.value}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Pie Chart 2 - Your Brand vs Competition */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <h4 className="text-sm font-medium text-muted-foreground">Your Brand vs Competition</h4>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs p-3">
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">What does this chart show?</p>
                    <p className="text-muted-foreground">
                      A simplified view of your market position showing your brand vs the top competitor and all others combined.
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex flex-col items-center gap-6">
              <div className="relative" style={{ width: '280px', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={marketPositionData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={3} dataKey="value">
                      {marketPositionData.map((entry, index) => (
                        <Cell key={`cell-market-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        padding: '8px 12px',
                      }}
                      formatter={(value, name) => [`${value}%`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className={cn("text-3xl font-bold", gap >= 0 ? "text-green-600" : "text-red-600")}>
                    {gap >= 0 ? '+' : ''}{gap}%
                  </span>
                  <span className="text-xs text-muted-foreground">vs {topCompetitor?.name || 'leader'}</span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                {marketPositionData.map((item) => {
                  const faviconUrl = getFaviconUrl(item.domain)
                  return (
                    <div key={item.name} className="flex items-center gap-2">
                      {faviconUrl ? (
                        <div className="relative h-4 w-4 shrink-0 overflow-hidden rounded">
                          <Image src={faviconUrl} alt={item.name} fill className="object-contain" unoptimized />
                        </div>
                      ) : (
                        <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      )}
                      <span className={cn("text-sm", item.isYourBrand && "font-medium text-primary")}>{item.name}</span>
                      <span className={cn("text-sm font-medium", item.isYourBrand && "text-primary")}>{item.value}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MarketSegmentsCard({
  selectedProvider,
  onProviderChange,
}: {
  selectedProvider: string
  onProviderChange: (provider: string) => void
}) {
  const segments = (marketSegmentsDataByProvider[selectedProvider] ?? marketSegmentsDataByProvider['ChatGPT'])!

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
        <div className="flex w-full flex-col gap-y-2">
          <span className="text-lg font-semibold">Market Segments</span>
          <p className="text-sm text-muted-foreground">
            Your brand&apos;s share of voice across different market categories according to {selectedProvider}.
          </p>
        </div>

        <div className="flex shrink-0 flex-row items-center gap-2">
          {PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              onClick={() => onProviderChange(provider.name)}
              className={cn(
                'flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all',
                selectedProvider === provider.name
                  ? 'bg-card shadow-sm ring-1 ring-border'
                  : 'opacity-50 hover:opacity-75'
              )}
            >
              <div className="relative h-4 w-4">
                <Image src={provider.logo} alt={provider.name} fill className="object-contain" />
              </div>
              <span>{provider.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col rounded-3xl bg-card p-4">
        <div className="grid gap-4 lg:grid-cols-3">
          {segments.map((segment) => {
            const brandData = segment.data.find((d) => d.name === 'Your Brand' || d.name === 'Miele') || segment.data[0]

            return (
              <div key={segment.title} className="flex flex-col rounded-2xl border border-border">
                <div className="flex flex-col gap-y-3 p-5 pb-4">
                  <div className="flex flex-col gap-y-1">
                    <span className="text-base font-medium">{segment.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {segment.queries} queries · {segment.totalMentions.toLocaleString()} mentions
                    </span>
                  </div>
                  <h2 className="text-4xl font-light text-blue-600 dark:text-blue-400">
                    {brandData?.value || 0}%
                    <span className="text-lg text-muted-foreground"> share</span>
                  </h2>
                </div>

                <div className="flex flex-col gap-y-4 border-t border-border p-4">
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={segment.data} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={2} dataKey="value">
                          {segment.data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload as { name: string; value: number }
                              return (
                                <div className="rounded-lg bg-popover px-3 py-2 text-sm shadow-md border border-border">
                                  <p className="font-medium">{data.name}</p>
                                  <p className="text-muted-foreground">{data.value}% share</p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                    {segment.data.map((item) => {
                      const faviconUrl = getFaviconUrl(item.domain)
                      return (
                        <div key={item.name} className="flex items-center gap-x-1.5">
                          {faviconUrl ? (
                            <div className="relative h-4 w-4 shrink-0 overflow-hidden rounded">
                              <Image src={faviconUrl} alt={item.name} fill className="object-contain" unoptimized />
                            </div>
                          ) : (
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                          )}
                          <span className="text-xs text-muted-foreground">{item.name} ({item.value}%)</span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="border-t border-border pt-3">
                    <span className="text-xs text-muted-foreground">Key Factors:</span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {segment.keyFactors.map((factor) => (
                        <span key={factor} className="rounded-full bg-muted px-2.5 py-1 text-xs">{factor}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Competitor Breakdown table columns and types
type CompetitorSortKey = 'name' | 'value' | 'position' | 'dateFound'
const COMPETITOR_PAGE_SIZE_OPTIONS = [10, 20, 50] as const

const competitorTableColumns = [
  { key: 'rank', label: 'Rank', sortable: false, tooltip: 'Position in overall share of voice ranking' },
  { key: 'name', label: 'Competitor', sortable: true, tooltip: 'Company name and website domain' },
  { key: 'value', label: 'Share of Voice', sortable: true, tooltip: 'Percentage of AI mentions across all tracked prompts' },
  { key: 'position', label: 'Avg. Position', sortable: true, tooltip: 'Average position when mentioned in AI responses' },
  { key: 'dateFound', label: 'First Detected', sortable: true, tooltip: 'When this competitor was first detected in AI responses' },
] as const

function CompetitionTabContent({ positioning }: { positioning: typeof MOCK_AI_VISIBILITY_DATA.brandPositioning }) {
  const [selectedProvider, setSelectedProvider] = useState('ChatGPT')
  const [competitorSortKey, setCompetitorSortKey] = useState<CompetitorSortKey>('value')
  const [competitorSortDirection, setCompetitorSortDirection] = useState<'asc' | 'desc'>('desc')
  const [competitorSearchQuery, setCompetitorSearchQuery] = useState('')
  const [competitorCurrentPage, setCompetitorCurrentPage] = useState(1)
  const [competitorPageSize, setCompetitorPageSize] = useState<number>(10)

  const competitorData = competitorDataByProvider[selectedProvider] || competitorDataByProvider['ChatGPT']

  // Filter by search
  const searchFilteredCompetitorData = competitorData.filter((competitor) => {
    if (!competitorSearchQuery.trim()) return true
    const query = competitorSearchQuery.toLowerCase()
    return (
      competitor.name.toLowerCase().includes(query) ||
      (competitor.domain?.toLowerCase().includes(query) ?? false)
    )
  })

  // Sort data
  const sortedCompetitorData = [...searchFilteredCompetitorData].sort((a, b) => {
    let comparison = 0
    switch (competitorSortKey) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'value':
        comparison = a.value - b.value
        break
      case 'position':
        comparison = a.position - b.position
        break
      case 'dateFound':
        comparison = new Date(a.dateFound).getTime() - new Date(b.dateFound).getTime()
        break
    }
    return competitorSortDirection === 'asc' ? comparison : -comparison
  })

  // Pagination
  const competitorTotalItems = sortedCompetitorData.length
  const competitorTotalPages = Math.ceil(competitorTotalItems / competitorPageSize)
  const validCompetitorCurrentPage = Math.max(1, Math.min(competitorCurrentPage, competitorTotalPages || 1))
  const competitorStartIndex = (validCompetitorCurrentPage - 1) * competitorPageSize
  const competitorEndIndex = Math.min(competitorStartIndex + competitorPageSize, competitorTotalItems)
  const paginatedCompetitorData = sortedCompetitorData.slice(competitorStartIndex, competitorEndIndex)

  const handleCompetitorProviderChange = (provider: string) => {
    setSelectedProvider(provider)
    setCompetitorCurrentPage(1)
  }

  const handleCompetitorSort = (key: CompetitorSortKey) => {
    if (competitorSortKey === key) {
      setCompetitorSortDirection(competitorSortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setCompetitorSortKey(key)
      setCompetitorSortDirection(key === 'value' ? 'desc' : 'asc')
    }
  }

  const handleCompetitorSearchChange = (query: string) => {
    setCompetitorSearchQuery(query)
    setCompetitorCurrentPage(1)
  }

  return (
    <TabsContent value="competition" className="space-y-8">
      <BrandPositioningSection
        positioning={positioning}
        selectedProvider={selectedProvider}
        onProviderChange={setSelectedProvider}
      />
      <CompetitorMentionsChart
        selectedProvider={selectedProvider}
        onProviderChange={setSelectedProvider}
        data={competitorData}
      />

      {/* Competitor Breakdown Table */}
      <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
          <div className="flex w-full flex-col gap-y-2">
            <span className="text-lg font-semibold">Competitor Breakdown</span>
            <p className="text-sm text-muted-foreground">
              All competitors mentioned in AI responses. Click column headers to sort.
            </p>
          </div>

          <div className="flex shrink-0 flex-row items-center gap-2">
            {PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleCompetitorProviderChange(provider.name)}
                className={cn(
                  'flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all',
                  selectedProvider === provider.name
                    ? 'bg-card shadow-sm ring-1 ring-border'
                    : 'opacity-50 hover:opacity-75'
                )}
              >
                <div className="relative h-4 w-4">
                  <Image src={provider.logo} alt={provider.name} fill className="object-contain" />
                </div>
                <span>{provider.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search competitors..."
                value={competitorSearchQuery}
                onChange={(e) => handleCompetitorSearchChange(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {competitorTableColumns.map((column) => (
                    <th
                      key={column.key}
                      className={cn(
                        "px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider",
                        column.sortable && "cursor-pointer hover:text-foreground transition-colors select-none"
                      )}
                      onClick={() => column.sortable && handleCompetitorSort(column.key as CompetitorSortKey)}
                    >
                      <div className="flex items-center gap-1.5">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center gap-1.5">
                              {column.label}
                              <HelpCircle className="h-3 w-3 opacity-50" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <p className="text-sm">{column.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                        {column.sortable && competitorSortKey === column.key && (
                          <span className="text-primary">
                            {competitorSortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedCompetitorData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-8 w-8 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">
                          {competitorSearchQuery ? 'No competitors match your search' : 'No competitors found'}
                        </p>
                        {competitorSearchQuery && (
                          <Button variant="ghost" size="sm" onClick={() => setCompetitorSearchQuery('')} className="text-primary">
                            Clear search
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedCompetitorData.map((competitor, index) => {
                    const faviconUrl = getFaviconUrl(competitor.domain)
                    const actualRank = competitorStartIndex + index + 1
                    return (
                      <tr
                        key={competitor.name}
                        className={competitor.isYourBrand ? 'bg-primary/5' : 'hover:bg-muted/50 transition-colors'}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-muted-foreground">#{actualRank}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {faviconUrl ? (
                              <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded">
                                <Image src={faviconUrl} alt={competitor.name} fill className="object-contain" unoptimized />
                              </div>
                            ) : (
                              <div className="h-4 w-4 rounded-full shrink-0" style={{ backgroundColor: competitor.color }} />
                            )}
                            <div className="flex flex-col">
                              <span className={`text-sm font-medium ${competitor.isYourBrand ? 'text-primary' : ''}`}>
                                {competitor.name}
                                {competitor.isYourBrand && (
                                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">You</span>
                                )}
                              </span>
                              {competitor.domain && (
                                <span className="text-xs text-muted-foreground">{competitor.domain}</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${competitor.value}%`, backgroundColor: competitor.color }}
                              />
                            </div>
                            <span className="text-sm font-medium">{competitor.value}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm">#{competitor.position}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-muted-foreground">
                            {new Date(competitor.dateFound).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col gap-4 px-6 py-4 border-t border-border bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {competitorTotalItems > 0 ? competitorStartIndex + 1 : 0}–{competitorEndIndex} of {competitorTotalItems} competitor{competitorTotalItems !== 1 ? 's' : ''}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="hidden sm:inline">Show</span>
                <Select
                  value={competitorPageSize.toString()}
                  onValueChange={(value) => { setCompetitorPageSize(Number(value)); setCompetitorCurrentPage(1) }}
                >
                  <SelectTrigger className="w-[70px] h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {COMPETITOR_PAGE_SIZE_OPTIONS.map((size) => (
                      <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="hidden sm:inline">per page</span>
              </div>
              {competitorTotalPages > 1 && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCompetitorCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={validCompetitorCurrentPage === 1}
                    className="h-8 px-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span className="px-2 text-sm text-muted-foreground">{validCompetitorCurrentPage} / {competitorTotalPages}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCompetitorCurrentPage((p) => Math.min(competitorTotalPages, p + 1))}
                    disabled={validCompetitorCurrentPage === competitorTotalPages}
                    className="h-8 px-2"
                  >
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <MarketSegmentsCard
        selectedProvider={selectedProvider}
        onProviderChange={setSelectedProvider}
      />
    </TabsContent>
  )
}

// ============================================================
// MENTIONS TAB CONTENT
// ============================================================
const PAGE_SIZE_OPTIONS = [10, 20, 50] as const
type MentionSortKey = 'date' | 'mentionPosition' | 'sentiment'
type SortDirection = 'asc' | 'desc'

function MentionsTabContent() {
  const { dateRange } = useAnalyticsDateRange()
  const [selectedProvider, setSelectedProvider] = useState('ChatGPT')
  const [sortKey, setSortKey] = useState<MentionSortKey>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(10)

  const mentionData = mentionsDataByProvider[selectedProvider] || mentionsDataByProvider['ChatGPT']

  // Filter by date range
  const dateFilteredData = mentionData.filter((mention) => {
    const mentionDate = new Date(mention.date)
    if (dateRange.from && mentionDate < dateRange.from) return false
    if (dateRange.to && mentionDate > dateRange.to) return false
    return true
  })

  // Filter by search query
  const filteredData = dateFilteredData.filter((mention) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return mention.response.toLowerCase().includes(query) || mention.prompt.toLowerCase().includes(query)
  })

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    let comparison = 0
    switch (sortKey) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
        break
      case 'mentionPosition':
        comparison = a.mentionPosition - b.mentionPosition
        break
      case 'sentiment':
        const sentimentOrder = { positive: 1, neutral: 2, negative: 3 }
        comparison = sentimentOrder[a.sentiment] - sentimentOrder[b.sentiment]
        break
    }
    return sortDirection === 'asc' ? comparison : -comparison
  })

  // Pagination
  const totalItems = sortedData.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1))
  const startIndex = (validCurrentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedData = sortedData.slice(startIndex, endIndex)

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider)
    setCurrentPage(1)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleSort = (key: MentionSortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection(key === 'date' ? 'desc' : 'asc')
    }
  }

  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) newSet.delete(id)
      else newSet.add(id)
      return newSet
    })
  }

  const getSentimentColor = (sentiment: 'positive' | 'neutral' | 'negative') => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'neutral': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
      case 'negative': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    }
  }

  const getProviderLogo = (provider: string) => {
    const p = PROVIDERS.find(pr => pr.name === provider)
    return p?.logo || '/icons/openai.svg'
  }

  return (
    <TabsContent value="mentions" className="space-y-8">
      <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
          <div className="flex w-full flex-col gap-y-2">
            <span className="text-lg font-semibold">AI Mentions</span>
            <p className="text-sm text-muted-foreground">
              All AI responses across tracked prompts. Click rows to expand full response.
            </p>
          </div>

          <div className="flex shrink-0 flex-row items-center gap-2">
            {PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleProviderChange(provider.name)}
                className={cn(
                  'flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all',
                  selectedProvider === provider.name
                    ? 'bg-card shadow-sm ring-1 ring-border'
                    : 'opacity-50 hover:opacity-75'
                )}
              >
                <div className="relative h-4 w-4">
                  <Image src={provider.logo} alt={provider.name} fill className="object-contain" />
                </div>
                <span>{provider.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search responses..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors select-none"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-1.5">
                      Date
                      {sortKey === 'date' && <span className="text-primary">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[200px]">Prompt</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[400px]">AI Response</th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors select-none"
                    onClick={() => handleSort('mentionPosition')}
                  >
                    <div className="flex items-center gap-1.5">
                      Position
                      {sortKey === 'mentionPosition' && <span className="text-primary">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors select-none"
                    onClick={() => handleSort('sentiment')}
                  >
                    <div className="flex items-center gap-1.5">
                      Sentiment
                      {sortKey === 'sentiment' && <span className="text-primary">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-8 w-8 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">
                          {searchQuery ? 'No mentions match your search' : 'No mentions found'}
                        </p>
                        {searchQuery && (
                          <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')} className="text-primary">
                            Clear search
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((mention) => {
                    const isExpanded = expandedRows.has(mention.id)
                    const truncatedResponse = mention.response.length > 150
                      ? mention.response.slice(0, 150) + '...'
                      : mention.response

                    return (
                      <tr
                        key={mention.id}
                        className="hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => toggleRowExpansion(mention.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm">
                            {new Date(mention.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium">{mention.prompt}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-start gap-3">
                              <div className="relative h-5 w-5 shrink-0 mt-0.5">
                                <Image src={getProviderLogo(selectedProvider)} alt={selectedProvider} fill className="object-contain" />
                              </div>
                              <p className={cn("text-sm leading-relaxed", !isExpanded && "line-clamp-2")}>
                                {isExpanded ? mention.response : truncatedResponse}
                              </p>
                            </div>
                            {mention.response.length > 150 && (
                              <button
                                className="text-xs text-primary hover:underline self-start ml-8"
                                onClick={(e) => { e.stopPropagation(); toggleRowExpansion(mention.id) }}
                              >
                                {isExpanded ? 'Show less' : 'Show more'}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline" className="text-xs">#{mention.mentionPosition}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={cn("text-xs capitalize", getSentimentColor(mention.sentiment))}>{mention.sentiment}</Badge>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-4 px-6 py-4 border-t border-border bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {totalItems > 0 ? startIndex + 1 : 0}–{endIndex} of {totalItems} mentions
            </div>
            <div className="flex items-center gap-4">
              <Select value={pageSize.toString()} onValueChange={(value) => { setPageSize(Number(value)); setCurrentPage(1) }}>
                <SelectTrigger className="w-[70px] h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((size) => (<SelectItem key={size} value={size.toString()}>{size}</SelectItem>))}
                </SelectContent>
              </Select>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 px-2">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span className="px-2 text-sm text-muted-foreground">{validCurrentPage} / {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-8 px-2">
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  )
}

// ============================================================
// SENTIMENTS TAB CONTENT
// ============================================================
function SentimentsTabContent() {
  const [sentimentProvider, setSentimentProvider] = useState<string>('ChatGPT')
  const [themesProvider, setThemesProvider] = useState<string>('ChatGPT')

  // Calculate sentiment from the mock data
  const getSentimentPercentages = (provider: string) => {
    const providerData = MOCK_AI_VISIBILITY_DATA.sentimentAnalysis.find(s => s.provider === provider)
    if (!providerData) return { positive: 68, neutral: 24, negative: 8 }
    const score = providerData.totalScore
    // Derive percentages from score (higher score = more positive)
    const positive = Math.round(score * 0.75)
    const negative = Math.round((100 - score) * 0.3)
    const neutral = 100 - positive - negative
    return { positive, neutral, negative }
  }

  const filteredSentimentData = getSentimentPercentages(sentimentProvider)
  const currentThemes = (MOCK_AI_VISIBILITY_DATA as AIVisibilityData & { narrativeThemesByProvider?: Record<string, string[]> }).narrativeThemesByProvider?.[themesProvider] || MOCK_AI_VISIBILITY_DATA.narrativeThemes

  return (
    <TabsContent value="sentiments" className="space-y-8">
      {/* Overall Sentiment Analysis */}
      <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
          <div className="flex w-full flex-col gap-y-2">
            <span className="text-lg font-semibold">Sentiment Analysis</span>
            <p className="text-sm text-muted-foreground">
              How {sentimentProvider} responses characterize your brand across all tracked prompts.
            </p>
          </div>

          <div className="flex shrink-0 flex-row items-center gap-2">
            {PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                onClick={() => setSentimentProvider(provider.name)}
                className={cn(
                  'flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all',
                  sentimentProvider === provider.name
                    ? 'bg-card shadow-sm ring-1 ring-border'
                    : 'opacity-50 hover:opacity-75'
                )}
              >
                <div className="relative h-4 w-4">
                  <Image src={provider.logo} alt={provider.name} fill className="object-contain" />
                </div>
                <span>{provider.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-4 rounded-3xl bg-card p-6">
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm text-muted-foreground">Positive</span>
            <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${filteredSentimentData.positive}%` }} />
            </div>
            <span className="w-12 text-right text-sm font-medium">{filteredSentimentData.positive}%</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm text-muted-foreground">Neutral</span>
            <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gray-400 rounded-full transition-all duration-500" style={{ width: `${filteredSentimentData.neutral}%` }} />
            </div>
            <span className="w-12 text-right text-sm font-medium">{filteredSentimentData.neutral}%</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm text-muted-foreground">Negative</span>
            <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-red-500 rounded-full transition-all duration-500" style={{ width: `${filteredSentimentData.negative}%` }} />
            </div>
            <span className="w-12 text-right text-sm font-medium">{filteredSentimentData.negative}%</span>
          </div>
        </div>
      </div>

      {/* Detailed Sentiment Analysis - Per provider breakdown */}
      <SentimentSection providers={MOCK_AI_VISIBILITY_DATA.sentimentAnalysis} />

      {/* Contextual Analysis - Narrative themes */}
      <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
          <div className="flex w-full flex-col gap-y-2">
            <span className="text-lg font-semibold">Contextual Analysis</span>
            <p className="text-sm text-muted-foreground">
              Recurring narratives and perceptions from {themesProvider}.
            </p>
          </div>

          <div className="flex shrink-0 flex-row items-center gap-2">
            {PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                onClick={() => setThemesProvider(provider.name)}
                className={cn(
                  'flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all',
                  themesProvider === provider.name
                    ? 'bg-card shadow-sm ring-1 ring-border'
                    : 'opacity-50 hover:opacity-75'
                )}
              >
                <div className="relative h-4 w-4">
                  <Image src={provider.logo} alt={provider.name} fill className="object-contain" />
                </div>
                <span>{provider.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col gap-y-4 rounded-3xl bg-card p-6">
          <div className="flex items-center gap-x-3">
            <div className="rounded-xl bg-muted p-2.5">
              <Tag className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">Narrative Themes</span>
              <span className="text-sm text-muted-foreground">{currentThemes.length} themes identified by {themesProvider}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {currentThemes.map((theme, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-muted px-4 py-2 text-sm font-medium text-foreground"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      </div>
    </TabsContent>
  )
}

// ============================================================
// INSIGHTS TAB CONTENT
// ============================================================
type InsightsTabType = 'strengths' | 'opportunities' | 'recommendations'

function InsightsTabContent() {
  const [selectedProvider, setSelectedProvider] = useState<string>('ChatGPT')
  const [activeInsightTab, setActiveInsightTab] = useState<InsightsTabType>('strengths')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(10)

  const providerData = insightsDataByProvider[selectedProvider] || insightsDataByProvider['ChatGPT']

  // Filter by search
  const filteredStrengths = providerData.strengths.filter((item) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
  })

  const filteredOpportunities = providerData.opportunities.filter((item) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
  })

  const filteredRecommendations = providerData.recommendations.filter((item) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
  })

  const getCurrentTabData = () => {
    switch (activeInsightTab) {
      case 'strengths': return filteredStrengths
      case 'opportunities': return filteredOpportunities
      case 'recommendations': return filteredRecommendations
      default: return []
    }
  }

  const currentTabData = getCurrentTabData()
  const totalItems = currentTabData.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1))
  const startIndex = (validCurrentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)

  const paginatedStrengths = filteredStrengths.slice(startIndex, endIndex)
  const paginatedOpportunities = filteredOpportunities.slice(startIndex, endIndex)
  const paginatedRecommendations = filteredRecommendations.slice(startIndex, endIndex)

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider)
    setCurrentPage(1)
  }

  const handleTabChange = (tab: InsightsTabType) => {
    setActiveInsightTab(tab)
    setCurrentPage(1)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const getTabLabel = (tab: InsightsTabType) => {
    switch (tab) {
      case 'strengths': return 'Key Strengths'
      case 'opportunities': return 'Growth Opportunities'
      case 'recommendations': return 'Recommendations'
    }
  }

  const getTabCount = (tab: InsightsTabType) => {
    switch (tab) {
      case 'strengths': return filteredStrengths.length
      case 'opportunities': return filteredOpportunities.length
      case 'recommendations': return filteredRecommendations.length
    }
  }

  const trajectoryColor = MOCK_AI_VISIBILITY_DATA.analysisSummary.marketTrajectory.status === 'positive'
    ? 'text-green-600 dark:text-green-400'
    : MOCK_AI_VISIBILITY_DATA.analysisSummary.marketTrajectory.status === 'negative'
      ? 'text-red-600 dark:text-red-400'
      : 'text-yellow-600 dark:text-yellow-400'

  const trajectoryBgColor = MOCK_AI_VISIBILITY_DATA.analysisSummary.marketTrajectory.status === 'positive'
    ? 'bg-green-100 dark:bg-green-900/30'
    : MOCK_AI_VISIBILITY_DATA.analysisSummary.marketTrajectory.status === 'negative'
      ? 'bg-red-100 dark:bg-red-900/30'
      : 'bg-yellow-100 dark:bg-yellow-900/30'

  return (
    <TabsContent value="insights" className="space-y-8">
      {/* Market Trajectory */}
      <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
          <div className="flex w-full flex-col gap-y-2">
            <span className="text-lg font-semibold">Market Trajectory</span>
            <p className="text-sm text-muted-foreground">
              AI market position analysis for {selectedProvider}.
            </p>
          </div>

          <div className="flex shrink-0 flex-row items-center gap-2">
            {PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleProviderChange(provider.name)}
                className={cn(
                  'flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all',
                  selectedProvider === provider.name
                    ? 'bg-card shadow-sm ring-1 ring-border'
                    : 'opacity-50 hover:opacity-75'
                )}
              >
                <div className="relative h-4 w-4">
                  <Image src={provider.logo} alt={provider.name} fill className="object-contain" />
                </div>
                <span>{provider.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
          <div className="flex items-center gap-x-3 p-6 border-b border-border">
            <div className={cn('rounded-xl p-2.5', trajectoryBgColor)}>
              <TrendingUp className={cn('h-5 w-5', trajectoryColor)} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium">Current Status</span>
              <span className={cn('text-sm capitalize font-medium', trajectoryColor)}>
                {MOCK_AI_VISIBILITY_DATA.analysisSummary.marketTrajectory.status}
              </span>
            </div>
          </div>
          <div className="p-6">
            <p className="text-muted-foreground">{MOCK_AI_VISIBILITY_DATA.analysisSummary.marketTrajectory.description}</p>
          </div>
        </div>
      </div>

      {/* Analysis Insights */}
      <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
          <div className="flex w-full flex-col gap-y-2">
            <span className="text-lg font-semibold">Analysis Insights</span>
            <p className="text-sm text-muted-foreground">
              Key findings and recommendations from {selectedProvider} analysis across all prompts.
            </p>
          </div>

          <div className="flex shrink-0 flex-row items-center gap-2">
            {PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleProviderChange(provider.name)}
                className={cn(
                  'flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all',
                  selectedProvider === provider.name
                    ? 'bg-card shadow-sm ring-1 ring-border'
                    : 'opacity-50 hover:opacity-75'
                )}
              >
                <div className="relative h-4 w-4">
                  <Image src={provider.logo} alt={provider.name} fill className="object-contain" />
                </div>
                <span>{provider.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
          <div className="flex flex-col gap-4 px-6 py-4 border-b border-border sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50">
              {(['strengths', 'opportunities', 'recommendations'] as InsightsTabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all',
                    activeInsightTab === tab
                      ? 'bg-card shadow-sm text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {getTabLabel(tab)}
                  <span className={cn('text-xs tabular-nums', activeInsightTab === tab ? 'text-foreground' : 'text-muted-foreground')}>
                    {getTabCount(tab)}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative max-w-sm w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={`Search ${getTabLabel(activeInsightTab).toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-12">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                  {activeInsightTab === 'recommendations' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">Impact</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activeInsightTab === 'strengths' && (
                  paginatedStrengths.length === 0 ? (
                    <tr><td colSpan={3} className="px-6 py-12 text-center text-sm text-muted-foreground">No strengths found</td></tr>
                  ) : (
                    paginatedStrengths.map((item, index) => (
                      <tr key={index} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 text-sm text-muted-foreground">{startIndex + index + 1}</td>
                        <td className="px-6 py-4"><span className="font-medium text-sm">{item.title}</span></td>
                        <td className="px-6 py-4 text-sm text-muted-foreground max-w-md">{item.description}</td>
                      </tr>
                    ))
                  )
                )}

                {activeInsightTab === 'opportunities' && (
                  paginatedOpportunities.length === 0 ? (
                    <tr><td colSpan={3} className="px-6 py-12 text-center text-sm text-muted-foreground">No opportunities found</td></tr>
                  ) : (
                    paginatedOpportunities.map((item, index) => (
                      <tr key={index} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 text-sm text-muted-foreground">{startIndex + index + 1}</td>
                        <td className="px-6 py-4"><span className="font-medium text-sm">{item.title}</span></td>
                        <td className="px-6 py-4 text-sm text-muted-foreground max-w-md">{item.description}</td>
                      </tr>
                    ))
                  )
                )}

                {activeInsightTab === 'recommendations' && (
                  paginatedRecommendations.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-muted-foreground">No recommendations found</td></tr>
                  ) : (
                    paginatedRecommendations.map((item, index) => (
                      <tr key={index} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 text-sm text-muted-foreground">{startIndex + index + 1}</td>
                        <td className="px-6 py-4"><span className="font-medium text-sm">{item.title}</span></td>
                        <td className="px-6 py-4 text-sm text-muted-foreground max-w-md">{item.description}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            item.priority === 'High' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
                          )}>{item.priority}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            item.impact === 'High' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
                          )}>{item.impact}</span>
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col gap-4 px-6 py-4 border-t border-border bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {totalItems > 0 ? startIndex + 1 : 0}–{endIndex} of {totalItems} {getTabLabel(activeInsightTab).toLowerCase()}
            </div>
            <div className="flex items-center gap-4">
              <Select value={pageSize.toString()} onValueChange={(value) => { setPageSize(Number(value)); setCurrentPage(1) }}>
                <SelectTrigger className="w-[70px] h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[10, 20, 50].map((size) => (<SelectItem key={size} value={size.toString()}>{size}</SelectItem>))}
                </SelectContent>
              </Select>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={validCurrentPage === 1} className="h-8 px-2">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span className="px-2 text-sm text-muted-foreground">{validCurrentPage} / {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={validCurrentPage === totalPages} className="h-8 px-2">
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  )
}

// ============================================================
// MENTIONS TAB CONTENT - REAL DATA
// Uses actual mentions data from getProjectAnalytics
// ============================================================
interface MentionsTabContentRealProps {
  analyticsData: AIVisibilityData
}

function MentionsTabContentReal({ analyticsData }: MentionsTabContentRealProps) {
  const mentions = analyticsData.mentions || []
  
  const [selectedProvider, setSelectedProvider] = useState('all')
  const [sortKey, setSortKey] = useState<MentionSortKey>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(10)

  // Filter by provider
  const providerFilteredData = selectedProvider === 'all' 
    ? mentions 
    : mentions.filter(m => m.provider === selectedProvider)

  // Filter by search query
  const filteredData = providerFilteredData.filter((mention) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return mention.response.toLowerCase().includes(query)
  })

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    let comparison = 0
    switch (sortKey) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
        break
      case 'mentionPosition':
        comparison = (a.mentionPosition || 99) - (b.mentionPosition || 99)
        break
      case 'sentiment':
        const sentimentOrder: Record<string, number> = { positive: 1, neutral: 2, negative: 3 }
        comparison = (sentimentOrder[a.sentiment] || 2) - (sentimentOrder[b.sentiment] || 2)
        break
    }
    return sortDirection === 'asc' ? comparison : -comparison
  })

  // Pagination
  const totalItems = sortedData.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1))
  const startIndex = (validCurrentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedData = sortedData.slice(startIndex, endIndex)

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider)
    setCurrentPage(1)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleSort = (key: MentionSortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection(key === 'date' ? 'desc' : 'asc')
    }
  }

  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) newSet.delete(id)
      else newSet.add(id)
      return newSet
    })
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'neutral': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
      case 'negative': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const getProviderLogo = (provider: string) => {
    const p = PROVIDERS.find(pr => pr.name === provider || pr.id === provider.toLowerCase())
    return p?.logo || '/icons/openai.svg'
  }

  const formatProviderName = (provider: string) => {
    if (provider === 'chatgpt' || provider === 'ChatGPT') return 'ChatGPT'
    if (provider === 'perplexity' || provider === 'Perplexity') return 'Perplexity'
    if (provider === 'gemini' || provider === 'Gemini') return 'Gemini'
    return provider
  }

  if (mentions.length === 0) {
    return (
      <TabsContent value="mentions" className="space-y-8">
        <div className="md:dark:bg-polar-900 dark:border-polar-700 w-full md:rounded-xl md:border md:border-gray-100 md:bg-gray-50 md:p-8 lg:rounded-4xl items-center justify-center gap-y-6 md:flex md:flex-col md:py-24">
          <Search className="text-gray-300 dark:text-gray-600 h-12 w-12" />
          <div className="flex flex-col items-center gap-y-2">
            <h3 className="text-lg font-medium">No mentions yet</h3>
            <p className="dark:text-polar-500 text-gray-500 text-center max-w-md">
              Run scans on your tracked prompts to see AI mentions.
            </p>
          </div>
        </div>
      </TabsContent>
    )
  }

  return (
    <TabsContent value="mentions" className="space-y-8">
      <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
          <div className="flex w-full flex-col gap-y-2">
            <span className="text-lg font-semibold">AI Mentions</span>
            <p className="text-sm text-muted-foreground">
              View all AI responses mentioning your brand across providers.
            </p>
          </div>
          <div className="flex shrink-0 flex-row items-center gap-2">
            <button
              onClick={() => handleProviderChange('all')}
              className={cn(
                'flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all',
                selectedProvider === 'all'
                  ? 'bg-card shadow-sm ring-1 ring-border'
                  : 'opacity-50 hover:opacity-75'
              )}
            >
              <span>All</span>
            </button>
            {PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleProviderChange(provider.name)}
                className={cn(
                  'flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all',
                  selectedProvider === provider.name
                    ? 'bg-card shadow-sm ring-1 ring-border'
                    : 'opacity-50 hover:opacity-75'
                )}
              >
                <div className="relative h-4 w-4">
                  <Image src={provider.logo} alt={provider.name} fill className="object-contain" />
                </div>
                <span className="hidden sm:inline">{provider.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
          {/* Search Bar */}
          <div className="px-6 py-4 border-b border-border">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search mentions..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-12">#</th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-1.5">
                      Date
                      {sortKey === 'date' && <span className="text-primary">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Response</th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('mentionPosition')}
                  >
                    <div className="flex items-center gap-1.5">
                      Position
                      {sortKey === 'mentionPosition' && <span className="text-primary">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('sentiment')}
                  >
                    <div className="flex items-center gap-1.5">
                      Sentiment
                      {sortKey === 'sentiment' && <span className="text-primary">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-8 w-8 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">No results match your search</p>
                        <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')} className="text-primary">
                          Clear search
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((mention, index) => (
                    <tr key={mention.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-muted-foreground">{startIndex + index + 1}</td>
                      <td className="px-6 py-4 text-sm">{new Date(mention.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Image src={getProviderLogo(mention.provider)} alt={mention.provider} width={16} height={16} />
                          <span className="text-sm">{formatProviderName(mention.provider)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-md">
                        <button
                          onClick={() => toggleRowExpansion(mention.id)}
                          className="text-left text-sm text-muted-foreground hover:text-foreground"
                        >
                          {expandedRows.has(mention.id) ? mention.response : `${mention.response.substring(0, 100)}${mention.response.length > 100 ? '...' : ''}`}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {mention.mentionPosition ? `#${mention.mentionPosition}` : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize', getSentimentColor(mention.sentiment))}>
                          {mention.sentiment}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col gap-4 px-6 py-4 border-t border-border bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {totalItems > 0 ? startIndex + 1 : 0}–{endIndex} of {totalItems} mention{totalItems !== 1 ? 's' : ''}
            </div>
            <div className="flex items-center gap-4">
              <Select value={pageSize.toString()} onValueChange={(value) => { setPageSize(Number(value)); setCurrentPage(1) }}>
                <SelectTrigger className="w-[70px] h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((size) => (<SelectItem key={size} value={size.toString()}>{size}</SelectItem>))}
                </SelectContent>
              </Select>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={validCurrentPage === 1} className="h-8 px-2">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span className="px-2 text-sm text-muted-foreground">{validCurrentPage} / {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={validCurrentPage === totalPages} className="h-8 px-2">
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  )
}

// ============================================================
// SENTIMENTS TAB CONTENT - REAL DATA
// Uses actual sentiment data from getProjectAnalytics
// ============================================================
interface SentimentsTabContentRealProps {
  analyticsData: AIVisibilityData
}

function SentimentsTabContentReal({ analyticsData }: SentimentsTabContentRealProps) {
  const [sentimentProvider, setSentimentProvider] = useState('ChatGPT')
  const [themesProvider, setThemesProvider] = useState('ChatGPT')

  const getSentimentBreakdown = (provider: string) => {
    const providerData = analyticsData.sentimentAnalysis.find(s => s.provider === provider)
    if (!providerData) return { positive: 0, neutral: 0, negative: 0 }
    const score = providerData.totalScore
    const positive = Math.round(score * 0.75)
    const negative = Math.round((100 - score) * 0.3)
    const neutral = 100 - positive - negative
    return { positive, neutral, negative }
  }

  const breakdown = getSentimentBreakdown(sentimentProvider)
  
  // Get themes for the selected provider (by name, not id)
  const providerIdMap: Record<string, string> = { 'ChatGPT': 'chatgpt', 'Perplexity': 'perplexity', 'Gemini': 'gemini' }
  const currentThemes = analyticsData.narrativeThemesByProvider?.[providerIdMap[themesProvider]] || analyticsData.narrativeThemes || []

  if (analyticsData.sentimentAnalysis.length === 0) {
    return (
      <TabsContent value="sentiments" className="space-y-8">
        <div className="md:dark:bg-polar-900 dark:border-polar-700 w-full md:rounded-xl md:border md:border-gray-100 md:bg-gray-50 md:p-8 lg:rounded-4xl items-center justify-center gap-y-6 md:flex md:flex-col md:py-24">
          <TrendingUp className="text-gray-300 dark:text-gray-600 h-12 w-12" />
          <div className="flex flex-col items-center gap-y-2">
            <h3 className="text-lg font-medium">No sentiment data yet</h3>
            <p className="dark:text-polar-500 text-gray-500 text-center max-w-md">
              Run scans on your tracked prompts to see sentiment analysis.
            </p>
          </div>
        </div>
      </TabsContent>
    )
  }

  return (
    <TabsContent value="sentiments" className="space-y-8">
      {/* Overall Sentiment Analysis - Horizontal bars like original */}
      <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
          <div className="flex w-full flex-col gap-y-2">
            <span className="text-lg font-semibold">Sentiment Analysis</span>
            <p className="text-sm text-muted-foreground">
              How {sentimentProvider} responses characterize your brand across all tracked prompts.
            </p>
          </div>

          <div className="flex shrink-0 flex-row items-center gap-2">
            {PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                onClick={() => setSentimentProvider(provider.name)}
                className={cn(
                  'flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all',
                  sentimentProvider === provider.name
                    ? 'bg-card shadow-sm ring-1 ring-border'
                    : 'opacity-50 hover:opacity-75'
                )}
              >
                <div className="relative h-4 w-4">
                  <Image src={provider.logo} alt={provider.name} fill className="object-contain" />
                </div>
                <span>{provider.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-4 rounded-3xl bg-card p-6">
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm text-muted-foreground">Positive</span>
            <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${breakdown.positive}%` }} />
            </div>
            <span className="w-12 text-right text-sm font-medium">{breakdown.positive}%</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm text-muted-foreground">Neutral</span>
            <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gray-400 rounded-full transition-all duration-500" style={{ width: `${breakdown.neutral}%` }} />
            </div>
            <span className="w-12 text-right text-sm font-medium">{breakdown.neutral}%</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm text-muted-foreground">Negative</span>
            <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-red-500 rounded-full transition-all duration-500" style={{ width: `${breakdown.negative}%` }} />
            </div>
            <span className="w-12 text-right text-sm font-medium">{breakdown.negative}%</span>
          </div>
        </div>
      </div>

      {/* Detailed Sentiment Analysis - Per provider breakdown */}
      <SentimentSection providers={analyticsData.sentimentAnalysis} />

      {/* Contextual Analysis - Narrative themes */}
      <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
          <div className="flex w-full flex-col gap-y-2">
            <span className="text-lg font-semibold">Contextual Analysis</span>
            <p className="text-sm text-muted-foreground">
              Recurring narratives and perceptions from {themesProvider}.
            </p>
          </div>

          <div className="flex shrink-0 flex-row items-center gap-2">
            {PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                onClick={() => setThemesProvider(provider.name)}
                className={cn(
                  'flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all',
                  themesProvider === provider.name
                    ? 'bg-card shadow-sm ring-1 ring-border'
                    : 'opacity-50 hover:opacity-75'
                )}
              >
                <div className="relative h-4 w-4">
                  <Image src={provider.logo} alt={provider.name} fill className="object-contain" />
                </div>
                <span>{provider.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col gap-y-4 rounded-3xl bg-card p-6">
          <div className="flex items-center gap-x-3">
            <div className="rounded-xl bg-muted p-2.5">
              <Tag className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">Narrative Themes</span>
              <span className="text-sm text-muted-foreground">{currentThemes.length} themes identified by {themesProvider}</span>
            </div>
          </div>

          {currentThemes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {currentThemes.map((theme, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-muted px-4 py-2 text-sm font-medium text-foreground"
                >
                  {theme}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No narrative themes found for {themesProvider}.</p>
          )}
        </div>
      </div>
    </TabsContent>
  )
}

// ============================================================
// INSIGHTS TAB CONTENT - REAL DATA
// Uses actual insights data from getProjectAnalytics
// ============================================================
interface InsightsTabContentRealProps {
  analyticsData: AIVisibilityData & { insightsByProvider?: Record<string, { strengths: Array<{ title: string; description: string }>; opportunities: Array<{ title: string; description: string }>; recommendations: Array<{ title: string; description: string; priority: string; impact: string }> }> }
}

function InsightsTabContentReal({ analyticsData }: InsightsTabContentRealProps) {
  type InsightsTabType = 'strengths' | 'opportunities' | 'recommendations'
  
  const [selectedProvider, setSelectedProvider] = useState<string>('ChatGPT')
  const [activeInsightTab, setActiveInsightTab] = useState<InsightsTabType>('strengths')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(10)

  const summary = analyticsData.analysisSummary

  // Get insights data by provider (fallback to summary if not available)
  const insightsByProvider = (analyticsData as { insightsByProvider?: Record<string, { strengths: Array<{ title: string; description: string }>; opportunities: Array<{ title: string; description: string }>; recommendations: Array<{ title: string; description: string; priority: string; impact: string }> }> }).insightsByProvider

  const providerKey = selectedProvider === 'ChatGPT' ? 'chatgpt' : selectedProvider.toLowerCase()
  const providerInsights = insightsByProvider?.[providerKey] || {
    strengths: summary.strengths || [],
    opportunities: summary.opportunities || [],
    recommendations: (summary.opportunities || []).map(o => ({
      title: `Improve ${o.title}`,
      description: o.description,
      priority: 'Medium',
      impact: 'Medium',
    })),
  }

  // Filter by search
  const filteredStrengths = providerInsights.strengths.filter((item) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
  })

  const filteredOpportunities = providerInsights.opportunities.filter((item) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
  })

  const filteredRecommendations = providerInsights.recommendations.filter((item) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
  })

  const getCurrentTabData = () => {
    switch (activeInsightTab) {
      case 'strengths': return filteredStrengths
      case 'opportunities': return filteredOpportunities
      case 'recommendations': return filteredRecommendations
      default: return []
    }
  }

  const currentTabData = getCurrentTabData()
  const totalItems = currentTabData.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1))
  const startIndex = (validCurrentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedData = currentTabData.slice(startIndex, endIndex)

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider)
    setCurrentPage(1)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleTabChange = (tab: InsightsTabType) => {
    setActiveInsightTab(tab)
    setCurrentPage(1)
    setSearchQuery('')
  }

  const getTabLabel = (tab: InsightsTabType) => {
    switch (tab) {
      case 'strengths': return 'Key Strengths'
      case 'opportunities': return 'Growth Opportunities'
      case 'recommendations': return 'Recommendations'
    }
  }

  const getTabCount = (tab: InsightsTabType) => {
    switch (tab) {
      case 'strengths': return filteredStrengths.length
      case 'opportunities': return filteredOpportunities.length
      case 'recommendations': return filteredRecommendations.length
    }
  }

  const trajectoryColor = summary.marketTrajectory.status === 'positive'
    ? 'text-green-600 dark:text-green-400'
    : summary.marketTrajectory.status === 'negative'
      ? 'text-red-600 dark:text-red-400'
      : 'text-yellow-600 dark:text-yellow-400'

  const trajectoryBgColor = summary.marketTrajectory.status === 'positive'
    ? 'bg-green-100 dark:bg-green-900/30'
    : summary.marketTrajectory.status === 'negative'
      ? 'bg-red-100 dark:bg-red-900/30'
      : 'bg-yellow-100 dark:bg-yellow-900/30'

  return (
    <TabsContent value="insights" className="space-y-8">
      {/* Market Trajectory */}
      <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
          <div className="flex w-full flex-col gap-y-2">
            <span className="text-lg font-semibold">Market Trajectory</span>
            <p className="text-sm text-muted-foreground">
              AI market position analysis for {selectedProvider}.
            </p>
          </div>

          <div className="flex shrink-0 flex-row items-center gap-2">
            {PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleProviderChange(provider.name)}
                className={cn(
                  'flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all',
                  selectedProvider === provider.name
                    ? 'bg-card shadow-sm ring-1 ring-border'
                    : 'opacity-50 hover:opacity-75'
                )}
              >
                <div className="relative h-4 w-4">
                  <Image src={provider.logo} alt={provider.name} fill className="object-contain" />
                </div>
                <span>{provider.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
          <div className="flex items-center gap-x-3 p-6 border-b border-border">
            <div className={cn('rounded-xl p-2.5', trajectoryBgColor)}>
              <TrendingUp className={cn('h-5 w-5', trajectoryColor)} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium">Current Status</span>
              <span className={cn('text-sm capitalize font-medium', trajectoryColor)}>
                {summary.marketTrajectory.status}
              </span>
            </div>
          </div>
          <div className="p-6">
            <p className="text-muted-foreground">{summary.marketTrajectory.description || 'No trajectory description available.'}</p>
          </div>
        </div>
      </div>

      {/* Analysis Insights */}
      <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
          <div className="flex w-full flex-col gap-y-2">
            <span className="text-lg font-semibold">Analysis Insights</span>
            <p className="text-sm text-muted-foreground">
              Key findings and recommendations from {selectedProvider} analysis across all prompts.
            </p>
          </div>

          <div className="flex shrink-0 flex-row items-center gap-2">
            {PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleProviderChange(provider.name)}
                className={cn(
                  'flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all',
                  selectedProvider === provider.name
                    ? 'bg-card shadow-sm ring-1 ring-border'
                    : 'opacity-50 hover:opacity-75'
                )}
              >
                <div className="relative h-4 w-4">
                  <Image src={provider.logo} alt={provider.name} fill className="object-contain" />
                </div>
                <span>{provider.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
          {/* Tabs - Pill Style with counts */}
          <div className="flex flex-col gap-4 px-6 py-4 border-b border-border sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50">
              {(['strengths', 'opportunities', 'recommendations'] as InsightsTabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all',
                    activeInsightTab === tab
                      ? 'bg-card shadow-sm text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {getTabLabel(tab)}
                  <span className={cn('text-xs tabular-nums', activeInsightTab === tab ? 'text-foreground' : 'text-muted-foreground')}>
                    {getTabCount(tab)}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative max-w-sm w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={`Search ${getTabLabel(activeInsightTab).toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-12">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                  {activeInsightTab === 'recommendations' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">Impact</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activeInsightTab === 'strengths' && (
                  paginatedData.length === 0 ? (
                    <tr><td colSpan={3} className="px-6 py-12 text-center text-sm text-muted-foreground">No key strengths found</td></tr>
                  ) : (
                    paginatedData.map((item, index) => (
                      <tr key={index} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 text-sm text-muted-foreground">{startIndex + index + 1}</td>
                        <td className="px-6 py-4"><span className="font-medium text-sm">{item.title}</span></td>
                        <td className="px-6 py-4 text-sm text-muted-foreground max-w-md">{item.description}</td>
                      </tr>
                    ))
                  )
                )}

                {activeInsightTab === 'opportunities' && (
                  paginatedData.length === 0 ? (
                    <tr><td colSpan={3} className="px-6 py-12 text-center text-sm text-muted-foreground">No growth opportunities found</td></tr>
                  ) : (
                    paginatedData.map((item, index) => (
                      <tr key={index} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 text-sm text-muted-foreground">{startIndex + index + 1}</td>
                        <td className="px-6 py-4"><span className="font-medium text-sm">{item.title}</span></td>
                        <td className="px-6 py-4 text-sm text-muted-foreground max-w-md">{item.description}</td>
                      </tr>
                    ))
                  )
                )}

                {activeInsightTab === 'recommendations' && (
                  filteredRecommendations.slice(startIndex, endIndex).length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-muted-foreground">No recommendations found</td></tr>
                  ) : (
                    filteredRecommendations.slice(startIndex, endIndex).map((item, index) => (
                      <tr key={index} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 text-sm text-muted-foreground">{startIndex + index + 1}</td>
                        <td className="px-6 py-4"><span className="font-medium text-sm">{item.title}</span></td>
                        <td className="px-6 py-4 text-sm text-muted-foreground max-w-md">{item.description}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            item.priority === 'High' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
                          )}>{item.priority}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            item.impact === 'High' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
                          )}>{item.impact}</span>
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col gap-4 px-6 py-4 border-t border-border bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {totalItems > 0 ? startIndex + 1 : 0}–{endIndex} of {totalItems} {getTabLabel(activeInsightTab).toLowerCase()}
            </div>
            <div className="flex items-center gap-4">
              <Select value={pageSize.toString()} onValueChange={(value) => { setPageSize(Number(value)); setCurrentPage(1) }}>
                <SelectTrigger className="w-[70px] h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((size) => (<SelectItem key={size} value={size.toString()}>{size}</SelectItem>))}
                </SelectContent>
              </Select>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={validCurrentPage === 1} className="h-8 px-2">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span className="px-2 text-sm text-muted-foreground">{validCurrentPage} / {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={validCurrentPage === totalPages} className="h-8 px-2">
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  )
}

// ============================================================
// EMPTY STATE COMPONENT
// Shows when no analytics data is available
// ============================================================
function AnalyticsEmptyState() {
  return (
    <div className="md:dark:bg-polar-900 dark:border-polar-700 w-full md:rounded-xl md:border md:border-gray-100 md:bg-gray-50 md:p-8 lg:rounded-4xl items-center justify-center gap-y-6 md:flex md:flex-col md:py-48">
      <BarChart3 className="text-gray-300 dark:text-gray-600 h-16 w-16" />
      <div className="flex flex-col items-center gap-y-6">
        <div className="flex flex-col items-center gap-y-2">
          <h3 className="text-lg font-medium">No analytics data yet</h3>
          <p className="dark:text-polar-500 text-gray-500 text-center max-w-md">
            Start tracking prompts and running scans to see aggregated analytics for your brand.
          </p>
        </div>
        <Button asChild variant="outline" className="rounded-lg">
          <Link href="/dashboard">
            <span>Go to Dashboard</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}

// ============================================================
// LOADING STATE COMPONENT
// Shows while analytics data is being fetched
// ============================================================
function AnalyticsLoadingState() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading analytics...</p>
      </div>
    </div>
  )
}

// ============================================================
// ANALYTICS CONTENT COMPONENT
// Consumes date range context and fetches data
// ============================================================
function AnalyticsContent() {
  const { dateRange } = useAnalyticsDateRange()
  
  // Analytics data state
  const [analyticsData, setAnalyticsData] = useState<typeof MOCK_AI_VISIBILITY_DATA | null>(null)
  const [stats, setStats] = useState<AIVisibilityStats | null>(null)
  const [visibilityTrend, setVisibilityTrend] = useState<Array<{ date: string; displayDate?: string; chatgpt: number; perplexity: number; gemini: number }>>([])
  const [hasData, setHasData] = useState<boolean | null>(null)

  // Use mock data for now
  useEffect(() => {
    // Simulate loading mock data
    setHasData(true)
    setAnalyticsData(MOCK_AI_VISIBILITY_DATA)
    setStats({
      overallScore: 85,
      brandMentions: 156,
      competitorGap: 12,
      aiEnginesTracked: 3,
      visibilityTrend: 'up',
      sentimentScore: 78,
    })
    setVisibilityTrend([])
  }, [dateRange.from?.getTime(), dateRange.to?.getTime()])

  const isLoading = hasData === null

  // Show loading state
  if (isLoading) {
    return <AnalyticsLoadingState />
  }

  // Show empty state if no data
  if (!hasData || !analyticsData || !stats) {
    return <AnalyticsEmptyState />
  }

  // Use real data (with fallback to calculated stats for display)
  const displayStats = stats

  return (
    <>
      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        {/* Scrollable tabs container for mobile */}
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6">
          <TabsList className="bg-transparent ring-0 dark:bg-transparent dark:ring-0 p-1 gap-2 w-max md:w-auto">
            <TabsTrigger
              value="overview"
              className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="competition"
              className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
            >
              Competition
            </TabsTrigger>
            <TabsTrigger
              value="mentions"
              className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
            >
              Mentions
            </TabsTrigger>
            <TabsTrigger
              value="sentiments"
              className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
            >
              Sentiments
            </TabsTrigger>
            <TabsTrigger
              value="insights"
              className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
            >
              Insights
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          {/* Visibility Trend Chart - Using real data */}
          <VisibilityTrendChart 
            data={visibilityTrend}
            defaultVisibilityScore={displayStats.overallScore}
          />

          {/* Stats Cards */}
          <OverviewStats stats={displayStats} />

          {/* Provider Scores */}
          <ProviderScores providers={analyticsData.llmProviders} />

        </TabsContent>

        {/* Competition Tab */}
        <CompetitionTabContent positioning={analyticsData.brandPositioning} />

        {/* Mentions Tab - Using real mentions data */}
        <MentionsTabContentReal analyticsData={analyticsData} />

        {/* Sentiments Tab - Using real data */}
        <SentimentsTabContentReal analyticsData={analyticsData} />

        {/* Insights Tab - Using real data */}
        <InsightsTabContentReal analyticsData={analyticsData} />

      </Tabs>
    </>
  )
}

// ============================================================
// MAIN PAGE COMPONENT
// All analytics components share date range via useAnalyticsDateRange hook
// ============================================================
export default function AnalyticsPage() {
  return (
    <AnalyticsDateRangeProvider>
      <div className="relative flex min-w-0 flex-2 flex-col items-center rounded-2xl border-gray-200 px-4 dark:border-polar-800 dark:md:bg-polar-900 md:overflow-y-auto md:border md:bg-white md:px-8 md:shadow-xs">
        <div className="container mx-auto flex w-full flex-col gap-y-8 py-8 pb-16">
          {/* Header */}
          <header className="flex flex-col gap-y-4 md:flex-row md:items-center md:justify-between md:gap-x-4">
            <div className="flex flex-col gap-y-1">
              <h1 className="text-2xl font-semibold">Analytics</h1>
              <p className="text-sm text-muted-foreground">
                Monitor your brand&apos;s visibility across AI search engines and track competitor performance.
              </p>
            </div>
            <AnalyticsDatePicker />
          </header>

          {/* Analytics Content - Consumes date range and fetches data */}
          <AnalyticsContent />
        </div>
      </div>
    </AnalyticsDateRangeProvider>
  )
}
