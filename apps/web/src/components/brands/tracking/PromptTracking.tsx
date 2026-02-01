'use client'

// ============================================================
// PROMPT DETAIL PAGE
// Displays analytics for a tracked prompt (read-only view)
// All tab components are modularized for fast loading
// ============================================================

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AnalyticsDatePicker } from '@workspace/ui/components/analytics-date-picker'
import { AnalyticsDateRangeProvider, useAnalyticsDateRange } from '@workspace/ui/hooks/use-analytics-date-range'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import {
  Loader2,
  Search,
} from 'lucide-react'

// Import modular tab components
import {
  OverviewTab,
  CompetitionTab,
  SentimentsTab,
  InsightsTab,
  AIResponsesSection,
} from '@/components/brands/prompts/analytics'

// Import types
import type { TrackedPrompt } from '@/components/brands/prompts/types'
import type { PromptAnalyticsData } from '@workspace/common/lib/shcmea/types/dtos/prompt-analytics-dto'

// ============================================================
// MOCK DATA FOR TESTING
// ============================================================
const MOCK_PROMPT: TrackedPrompt = {
  id: 'prompt-001',
  brandId: 'project-001',
  prompt: 'Best project management software for remote teams',
  notes: 'Tracking visibility for our main product keyword',
  lastVisibilityScore: 78,
  lastMentionPosition: 3,
  lastScanDate: new Date('2026-01-25'),
  isActive: true,
  scanStatus: 'COMPLETED',
  targetLocation: 'United States',
  targetLanguage: 'en',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-25'),
}

// ============================================================
// MOCK ANALYTICS DATA FOR TESTING
// Complete data to populate all tabs
// ============================================================
const MOCK_ANALYTICS_DATA: PromptAnalyticsData = {
  // Visibility trend over time (last 14 days)
  visibilityTrend: [
    { date: '2026-01-12', displayDate: 'Jan 12', chatgpt: 72, perplexity: 68, gemini: 65 },
    { date: '2026-01-13', displayDate: 'Jan 13', chatgpt: 74, perplexity: 70, gemini: 67 },
    { date: '2026-01-14', displayDate: 'Jan 14', chatgpt: 71, perplexity: 72, gemini: 69 },
    { date: '2026-01-15', displayDate: 'Jan 15', chatgpt: 76, perplexity: 71, gemini: 68 },
    { date: '2026-01-16', displayDate: 'Jan 16', chatgpt: 78, perplexity: 73, gemini: 70 },
    { date: '2026-01-17', displayDate: 'Jan 17', chatgpt: 75, perplexity: 74, gemini: 72 },
    { date: '2026-01-18', displayDate: 'Jan 18', chatgpt: 77, perplexity: 76, gemini: 71 },
    { date: '2026-01-19', displayDate: 'Jan 19', chatgpt: 80, perplexity: 75, gemini: 73 },
    { date: '2026-01-20', displayDate: 'Jan 20', chatgpt: 79, perplexity: 77, gemini: 74 },
    { date: '2026-01-21', displayDate: 'Jan 21', chatgpt: 82, perplexity: 78, gemini: 75 },
    { date: '2026-01-22', displayDate: 'Jan 22', chatgpt: 81, perplexity: 79, gemini: 76 },
    { date: '2026-01-23', displayDate: 'Jan 23', chatgpt: 83, perplexity: 80, gemini: 77 },
    { date: '2026-01-24', displayDate: 'Jan 24', chatgpt: 85, perplexity: 81, gemini: 78 },
    { date: '2026-01-25', displayDate: 'Jan 25', chatgpt: 84, perplexity: 82, gemini: 79 },
  ],

  // Provider breakdown for pie/bar charts
  providerBreakdown: [
    { provider: 'ChatGPT', score: 84, count: 156 },
    { provider: 'Perplexity', score: 82, count: 134 },
    { provider: 'Gemini', score: 79, count: 112 },
  ],

  // Sentiment breakdown per provider
  sentimentBreakdown: [
    { provider: 'ChatGPT', score: 78, polarization: 12 },
    { provider: 'Perplexity', score: 82, polarization: 8 },
    { provider: 'Gemini', score: 75, polarization: 15 },
  ],

  // Competitor data
  competitors: [
    { name: 'Asana', domain: 'asana.com', isYourBrand: false, mentionPercentage: 28, totalMentions: 89, contextType: 'recommendation' },
    { name: 'Monday.com', domain: 'monday.com', isYourBrand: false, mentionPercentage: 24, totalMentions: 76, contextType: 'comparison' },
    { name: 'Notion', domain: 'notion.com', isYourBrand: false, mentionPercentage: 22, totalMentions: 70, contextType: 'recommendation' },
    { name: 'ClickUp', domain: 'clickup.com', isYourBrand: false, mentionPercentage: 18, totalMentions: 57, contextType: 'alternative' },
    { name: 'Trello', domain: 'trello.com', isYourBrand: false, mentionPercentage: 15, totalMentions: 48, contextType: 'comparison' },
    { name: 'Jira', domain: 'atlassian.com/jira', isYourBrand: false, mentionPercentage: 14, totalMentions: 45, contextType: 'enterprise' },
    { name: 'Basecamp', domain: 'basecamp.com', isYourBrand: false, mentionPercentage: 12, totalMentions: 38, contextType: 'alternative' },
    { name: 'Wrike', domain: 'wrike.com', isYourBrand: false, mentionPercentage: 10, totalMentions: 32, contextType: 'enterprise' },
    { name: 'Teamwork', domain: 'teamwork.com', isYourBrand: false, mentionPercentage: 8, totalMentions: 25, contextType: 'recommendation' },
    { name: 'SearchFit', domain: 'searchfit.io', isYourBrand: true, mentionPercentage: 35, totalMentions: 112, contextType: 'recommendation' },
  ],

  // Market segments
  marketSegments: [
    {
      title: 'Enterprise Solutions',
      queries: 145,
      totalMentions: 423,
      data: [
        { name: 'Jira', value: 32, color: '#0052CC', domain: 'atlassian.com' },
        { name: 'Asana', value: 28, color: '#F06A6A', domain: 'asana.com' },
        { name: 'Monday.com', value: 24, color: '#FF3D57', domain: 'monday.com' },
        { name: 'SearchFit', value: 16, color: '#10B981', domain: 'searchfit.io' },
      ],
      keyFactors: ['Scalability', 'Security', 'Integrations', 'Reporting'],
    },
    {
      title: 'SMB & Startups',
      queries: 212,
      totalMentions: 567,
      data: [
        { name: 'Notion', value: 30, color: '#000000', domain: 'notion.com' },
        { name: 'ClickUp', value: 26, color: '#7B68EE', domain: 'clickup.com' },
        { name: 'SearchFit', value: 24, color: '#10B981', domain: 'searchfit.io' },
        { name: 'Trello', value: 20, color: '#0079BF', domain: 'trello.com' },
      ],
      keyFactors: ['Ease of use', 'Pricing', 'Quick setup', 'Templates'],
    },
    {
      title: 'Remote Team Collaboration',
      queries: 178,
      totalMentions: 489,
      data: [
        { name: 'SearchFit', value: 35, color: '#10B981', domain: 'searchfit.io' },
        { name: 'Notion', value: 25, color: '#000000', domain: 'notion.com' },
        { name: 'Asana', value: 22, color: '#F06A6A', domain: 'asana.com' },
        { name: 'Monday.com', value: 18, color: '#FF3D57', domain: 'monday.com' },
      ],
      keyFactors: ['Async communication', 'Time zones', 'Video integration', 'Real-time sync'],
    },
  ],

  // Brand positioning data per provider
  positioning: [
    {
      provider: 'ChatGPT',
      xAxisLabel: { low: 'Low Visibility', high: 'High Visibility' },
      yAxisLabel: { low: 'Low Sentiment', high: 'High Sentiment' },
      positions: [
        { name: 'SearchFit', x: 78, y: 82, isYourBrand: true, domain: 'searchfit.io', firstSeen: '2025-11-15' },
        { name: 'Asana', x: 85, y: 75, isYourBrand: false, domain: 'asana.com', firstSeen: '2025-10-01' },
        { name: 'Monday.com', x: 80, y: 70, isYourBrand: false, domain: 'monday.com', firstSeen: '2025-10-05' },
        { name: 'Notion', x: 72, y: 85, isYourBrand: false, domain: 'notion.com', firstSeen: '2025-09-20' },
        { name: 'ClickUp', x: 68, y: 72, isYourBrand: false, domain: 'clickup.com', firstSeen: '2025-11-01' },
        { name: 'Trello', x: 60, y: 65, isYourBrand: false, domain: 'trello.com', firstSeen: '2025-08-15' },
      ],
    },
    {
      provider: 'Perplexity',
      xAxisLabel: { low: 'Low Visibility', high: 'High Visibility' },
      yAxisLabel: { low: 'Low Sentiment', high: 'High Sentiment' },
      positions: [
        { name: 'SearchFit', x: 82, y: 85, isYourBrand: true, domain: 'searchfit.io', firstSeen: '2025-11-15' },
        { name: 'Asana', x: 78, y: 72, isYourBrand: false, domain: 'asana.com', firstSeen: '2025-10-01' },
        { name: 'Monday.com', x: 75, y: 68, isYourBrand: false, domain: 'monday.com', firstSeen: '2025-10-05' },
        { name: 'Notion', x: 80, y: 88, isYourBrand: false, domain: 'notion.com', firstSeen: '2025-09-20' },
        { name: 'ClickUp', x: 70, y: 75, isYourBrand: false, domain: 'clickup.com', firstSeen: '2025-11-01' },
      ],
    },
    {
      provider: 'Gemini',
      xAxisLabel: { low: 'Low Visibility', high: 'High Visibility' },
      yAxisLabel: { low: 'Low Sentiment', high: 'High Sentiment' },
      positions: [
        { name: 'SearchFit', x: 75, y: 78, isYourBrand: true, domain: 'searchfit.io', firstSeen: '2025-11-15' },
        { name: 'Asana', x: 82, y: 70, isYourBrand: false, domain: 'asana.com', firstSeen: '2025-10-01' },
        { name: 'Monday.com', x: 78, y: 72, isYourBrand: false, domain: 'monday.com', firstSeen: '2025-10-05' },
        { name: 'Notion', x: 70, y: 80, isYourBrand: false, domain: 'notion.com', firstSeen: '2025-09-20' },
        { name: 'Jira', x: 85, y: 65, isYourBrand: false, domain: 'atlassian.com', firstSeen: '2025-09-01' },
      ],
    },
  ],

  // Legacy insights (fallback)
  insights: {
    trajectory: { status: 'positive', description: 'Your brand visibility is steadily improving across all AI platforms, with particularly strong growth in remote work related queries.' },
    strengths: [
      JSON.stringify({ title: 'Strong Remote Work Positioning', description: 'Your brand is consistently mentioned as a top choice for remote team collaboration, appearing in 35% of relevant queries.' }),
      JSON.stringify({ title: 'Positive User Experience', description: 'AI responses frequently highlight ease of use and intuitive interface as key differentiators.' }),
      JSON.stringify({ title: 'Growing Brand Recognition', description: 'Month-over-month visibility has increased by 12% across all monitored AI platforms.' }),
    ],
    opportunities: [
      JSON.stringify({ title: 'Enterprise Market Gap', description: 'Limited visibility in enterprise-focused queries. Consider creating content targeting large organizations.' }),
      JSON.stringify({ title: 'Integration Mentions', description: 'Competitors are more frequently mentioned for integrations. Highlight your integration capabilities.' }),
      JSON.stringify({ title: 'Pricing Transparency', description: 'AI responses rarely mention your pricing. Adding clearer pricing content could improve conversion.' }),
    ],
    narrativeThemes: ['Remote collaboration', 'User-friendly interface', 'Task management', 'Team productivity', 'Project tracking'],
  },

  // AI Mentions/Responses
  mentions: [
    // ChatGPT responses
    {
      id: 'mention-001',
      date: '2026-01-25',
      provider: 'ChatGPT',
      response: 'For remote teams, I would recommend considering SearchFit as a top option. It offers excellent async collaboration features, real-time project tracking, and integrates seamlessly with popular tools like Slack and Zoom. The interface is intuitive and specifically designed for distributed teams working across different time zones.',
      mentionPosition: 1,
      sentiment: 'positive',
      sentimentScore: 0.89,
      brandMentioned: true,
    },
    {
      id: 'mention-002',
      date: '2026-01-24',
      provider: 'ChatGPT',
      response: 'When comparing project management tools for remote teams, several options stand out. Asana is great for enterprise needs, while Notion excels at documentation. SearchFit offers a balanced approach with strong collaboration features. Monday.com is visually appealing but can be overwhelming for smaller teams.',
      mentionPosition: 3,
      sentiment: 'positive',
      sentimentScore: 0.75,
      brandMentioned: true,
    },
    {
      id: 'mention-003',
      date: '2026-01-23',
      provider: 'ChatGPT',
      response: 'The best project management software depends on your team size and needs. For remote teams specifically, look for tools with good async communication, time zone support, and video integration. Popular choices include Asana, Monday.com, ClickUp, and SearchFit.',
      mentionPosition: 4,
      sentiment: 'neutral',
      sentimentScore: 0.55,
      brandMentioned: true,
    },
    {
      id: 'mention-004',
      date: '2026-01-22',
      provider: 'ChatGPT',
      response: 'For managing remote teams effectively, I suggest looking into tools like SearchFit or Notion. Both offer excellent features for distributed work. SearchFit particularly excels at task tracking and team coordination, while Notion is better for knowledge management.',
      mentionPosition: 1,
      sentiment: 'positive',
      sentimentScore: 0.82,
      brandMentioned: true,
    },
    {
      id: 'mention-005',
      date: '2026-01-21',
      provider: 'ChatGPT',
      response: 'Project management for remote teams requires special consideration. Tools should support async work, have mobile apps, and offer clear visibility into project status. Asana and Monday.com are industry leaders, but SearchFit is gaining popularity for its focus on remote-first features.',
      mentionPosition: 3,
      sentiment: 'positive',
      sentimentScore: 0.72,
      brandMentioned: true,
    },
    // Perplexity responses
    {
      id: 'mention-006',
      date: '2026-01-25',
      provider: 'Perplexity',
      response: 'Based on recent user reviews and feature comparisons, SearchFit emerges as a leading choice for remote team project management. Key strengths include its intuitive interface, robust API, and dedicated features for distributed teams. It competes well against established players like Asana and Monday.com.',
      mentionPosition: 1,
      sentiment: 'positive',
      sentimentScore: 0.91,
      brandMentioned: true,
    },
    {
      id: 'mention-007',
      date: '2026-01-24',
      provider: 'Perplexity',
      response: 'The project management software landscape for remote teams includes several strong contenders. Notion offers flexibility, Asana provides structure, and SearchFit balances both with strong collaboration tools. Consider your team workflow when making a choice.',
      mentionPosition: 3,
      sentiment: 'positive',
      sentimentScore: 0.78,
      brandMentioned: true,
    },
    {
      id: 'mention-008',
      date: '2026-01-23',
      provider: 'Perplexity',
      response: 'Remote teams benefit from project management tools designed with distributed work in mind. SearchFit, ClickUp, and Notion are popular choices. Each has unique strengths: SearchFit for task management, ClickUp for customization, and Notion for documentation.',
      mentionPosition: 1,
      sentiment: 'positive',
      sentimentScore: 0.85,
      brandMentioned: true,
    },
    {
      id: 'mention-009',
      date: '2026-01-22',
      provider: 'Perplexity',
      response: 'According to recent surveys, the most recommended project management tools for remote teams are: 1) Asana - enterprise-grade features, 2) Monday.com - visual workflows, 3) SearchFit - remote-first design, 4) Notion - all-in-one workspace, 5) ClickUp - highly customizable.',
      mentionPosition: 3,
      sentiment: 'neutral',
      sentimentScore: 0.60,
      brandMentioned: true,
    },
    // Gemini responses
    {
      id: 'mention-010',
      date: '2026-01-25',
      provider: 'Gemini',
      response: 'For remote team collaboration, several project management tools stand out. Asana offers robust features for larger teams, while Notion provides flexibility for documentation-heavy workflows. SearchFit is particularly well-suited for teams prioritizing real-time collaboration and async communication.',
      mentionPosition: 3,
      sentiment: 'positive',
      sentimentScore: 0.76,
      brandMentioned: true,
    },
    {
      id: 'mention-011',
      date: '2026-01-24',
      provider: 'Gemini',
      response: 'When evaluating project management software for remote teams, consider factors like: integration capabilities, mobile experience, pricing, and collaboration features. Top recommendations include Monday.com, Asana, SearchFit, and ClickUp based on these criteria.',
      mentionPosition: 3,
      sentiment: 'neutral',
      sentimentScore: 0.58,
      brandMentioned: true,
    },
    {
      id: 'mention-012',
      date: '2026-01-23',
      provider: 'Gemini',
      response: 'The best project management tool depends on your specific needs. For remote teams, SearchFit offers dedicated features for distributed collaboration. Trello is simpler but effective for smaller teams. Jira is preferred for software development teams.',
      mentionPosition: 1,
      sentiment: 'positive',
      sentimentScore: 0.80,
      brandMentioned: true,
    },
    {
      id: 'mention-013',
      date: '2026-01-22',
      provider: 'Gemini',
      response: 'Remote work has increased demand for effective project management tools. Popular options include Asana (enterprise), Monday.com (visual), Notion (flexible), and SearchFit (collaboration-focused). Each serves different team sizes and workflows.',
      mentionPosition: 4,
      sentiment: 'neutral',
      sentimentScore: 0.55,
      brandMentioned: true,
    },
    {
      id: 'mention-014',
      date: '2026-01-21',
      provider: 'Gemini',
      response: 'Project management software selection for remote teams should prioritize async-friendly features, timezone support, and strong mobile apps. SearchFit and Notion both excel in these areas, while traditional tools like Basecamp remain popular for their simplicity.',
      mentionPosition: 1,
      sentiment: 'positive',
      sentimentScore: 0.74,
      brandMentioned: true,
    },
  ],

  // Sentiment metrics by provider (for detailed breakdown)
  sentimentMetricsByProvider: {
    chatgpt: [
      { category: 'Product Quality', score: 82, description: 'Consistently praised for intuitive design and reliable performance', keyFactors: ['User interface', 'Stability', 'Speed'] },
      { category: 'Customer Support', score: 75, description: 'Good support mentioned but response times could improve', keyFactors: ['Documentation', 'Help center', 'Response time'] },
      { category: 'Value for Money', score: 78, description: 'Pricing is competitive, especially for growing teams', keyFactors: ['Free tier', 'Scalable pricing', 'Feature access'] },
      { category: 'Feature Set', score: 85, description: 'Comprehensive features for remote collaboration', keyFactors: ['Task management', 'Integrations', 'Reporting'] },
    ],
    perplexity: [
      { category: 'Product Quality', score: 88, description: 'Highly rated for its modern approach to project management', keyFactors: ['Design', 'Performance', 'Reliability'] },
      { category: 'Customer Support', score: 80, description: 'Responsive support team with helpful resources', keyFactors: ['Quick response', 'Knowledge base', 'Community'] },
      { category: 'Value for Money', score: 82, description: 'Excellent value proposition for SMBs', keyFactors: ['Competitive pricing', 'No hidden fees', 'Full features'] },
      { category: 'Feature Set', score: 84, description: 'Strong feature set with regular updates', keyFactors: ['Innovation', 'User requests', 'Roadmap'] },
    ],
    gemini: [
      { category: 'Product Quality', score: 76, description: 'Solid product with room for improvement in some areas', keyFactors: ['Core features', 'Usability', 'Learning curve'] },
      { category: 'Customer Support', score: 72, description: 'Adequate support but competitors offer more', keyFactors: ['Email support', 'Documentation', 'Tutorials'] },
      { category: 'Value for Money', score: 74, description: 'Fair pricing but premium features require higher tiers', keyFactors: ['Tier structure', 'Feature limits', 'Enterprise pricing'] },
      { category: 'Feature Set', score: 78, description: 'Good feature coverage for core project management needs', keyFactors: ['Task tracking', 'Timeline views', 'Collaboration'] },
    ],
  },

  // Narrative themes by provider
  narrativeThemesByProvider: {
    chatgpt: ['Remote-first design', 'Intuitive interface', 'Team collaboration', 'Async communication', 'Project tracking', 'Integration ecosystem'],
    perplexity: ['Modern approach', 'User experience', 'Productivity boost', 'Distributed teams', 'Real-time sync', 'Mobile-friendly'],
    gemini: ['Reliable platform', 'Task management', 'Team coordination', 'Project visibility', 'Workflow automation', 'Cross-team collaboration'],
  },

  // Insights by provider (for provider-specific trajectory and analysis)
  insightsByProvider: {
    chatgpt: {
      trajectory: { status: 'positive', description: 'Visibility on ChatGPT has increased 15% this month. Your brand is frequently mentioned as a top recommendation for remote teams.' },
      strengths: [
        JSON.stringify({ title: 'First Position Mentions', description: 'Your brand appears first in 40% of ChatGPT responses for this prompt.' }),
        JSON.stringify({ title: 'Feature Highlights', description: 'ChatGPT consistently highlights your async collaboration and real-time sync features.' }),
        JSON.stringify({ title: 'Positive Comparisons', description: 'When compared to competitors, your brand receives favorable sentiment 78% of the time.' }),
      ],
      opportunities: [
        JSON.stringify({ title: 'Enterprise Positioning', description: 'ChatGPT rarely mentions your brand for enterprise use cases. Target enterprise-focused content.' }),
        JSON.stringify({ title: 'Pricing Clarity', description: 'Responses mention competitors pricing more often. Add structured pricing data to your site.' }),
      ],
    },
    perplexity: {
      trajectory: { status: 'positive', description: 'Strong and growing presence on Perplexity. Your brand visibility has increased 22% in the past 30 days.' },
      strengths: [
        JSON.stringify({ title: 'Citation Frequency', description: 'Perplexity cites your documentation and blog posts in 65% of relevant responses.' }),
        JSON.stringify({ title: 'Feature Recognition', description: 'Your remote-first features are highlighted as market-leading.' }),
        JSON.stringify({ title: 'User Review Integration', description: 'Positive G2 and Capterra reviews are being surfaced in responses.' }),
      ],
      opportunities: [
        JSON.stringify({ title: 'Comparison Content', description: 'Create detailed comparison pages against Asana and Monday.com for better positioning.' }),
        JSON.stringify({ title: 'Use Case Pages', description: 'Develop industry-specific landing pages to appear in more niche queries.' }),
      ],
    },
    gemini: {
      trajectory: { status: 'neutral', description: 'Stable visibility on Gemini with moderate growth potential. Focus on technical content to improve positioning.' },
      strengths: [
        JSON.stringify({ title: 'Technical Accuracy', description: 'Gemini accurately describes your core features and capabilities.' }),
        JSON.stringify({ title: 'Consistent Mentions', description: 'Your brand appears in 70% of remote team queries on Gemini.' }),
      ],
      opportunities: [
        JSON.stringify({ title: 'Knowledge Graph Optimization', description: 'Ensure your Google Business Profile and structured data are optimized.' }),
        JSON.stringify({ title: 'API Documentation', description: 'Enhanced API docs could improve technical query visibility.' }),
        JSON.stringify({ title: 'Video Content', description: 'Create YouTube tutorials to improve multi-modal search visibility.' }),
      ],
    },
  },
}

// ============================================================
// ANALYTICS DATA WRAPPER
// Manages analytics data state based on date range
// ============================================================
function PromptAnalyticsWrapper({
  promptId,
  brandId,
  children
}: {
  promptId: string
  brandId: string
  children: (data: PromptAnalyticsData | null) => React.ReactNode
}) {
  const { dateRange } = useAnalyticsDateRange()
  // Use mock data for testing - replace with real data fetching when integrated
  const [analyticsData] = useState<PromptAnalyticsData | null>(MOCK_ANALYTICS_DATA)

  // Analytics data would be loaded here when integrated with data source
  useEffect(() => {
    if (promptId && brandId && dateRange.from) {
      // Data loading placeholder - using mock data for now
      console.log('Load analytics for:', brandId, promptId, dateRange)
    }
  }, [brandId, promptId, dateRange])

  return <>{children(analyticsData)}</>
}

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================
export default function PromptTrackingPage({ brandId, promptId }: { brandId: string, promptId: string }) {
  // State - using mock data for testing
  const [prompt] = useState<TrackedPrompt | null>(MOCK_PROMPT)
  const [isLoading, setIsLoading] = useState(true)

  // Load prompt on mount
  useEffect(() => {
    if (promptId) {
      // Data loading placeholder
      console.log('Load prompt:', promptId)
      setIsLoading(false)
    }
  }, [promptId])

  // Loading state
  if (isLoading) {
    return (
      <div className="relative flex min-w-0 flex-2 flex-col h-full w-full">
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading prompt...</p>
        </div>
      </div>
    )
  }

  // Not found state
  if (!prompt) {
    return (
      <div className="relative flex min-w-0 flex-2 flex-col h-full w-full">
        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Prompt not found</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              The prompt you&apos;re looking for doesn&apos;t exist or may have been deleted.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href={`/dashboard/brands/${brandId}/tracking?tab=prompts`}>
              Back to Prompts
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <AnalyticsDateRangeProvider>
      <PromptAnalyticsWrapper promptId={promptId} brandId={brandId}>
        {(analyticsData) => (
          <div className="relative flex flex-2 flex-col items-center">
            <div className="flex w-full flex-col gap-y-2">
             

              {/* Header */}
              <div className="flex flex-col gap-y-3">
                <div className="flex flex-row items-start justify-between gap-3">
                  <h1 className="text-xl md:text-2xl line-clamp-2 md:line-clamp-1 min-w-0">{prompt.prompt}</h1>
                  <div className="hidden md:block shrink-0">
                    <AnalyticsDatePicker />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`shrink-0 ${
                      prompt.isActive
                        ? 'border-green-500 text-green-600'
                        : 'border-gray-400 text-gray-500'
                    }`}
                  >
                    {prompt.isActive ? 'Active' : 'Paused'}
                  </Badge>
                  {prompt.lastScanDate && (
                    <span className="text-sm text-muted-foreground">
                      Last scan: {new Date(prompt.lastScanDate).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="md:hidden">
                  <AnalyticsDatePicker />
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
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

                {/* Tab Content - Using Modular Components */}
                <OverviewTab prompt={prompt} analyticsData={analyticsData} />
                <CompetitionTab analyticsData={analyticsData} />
                <TabsContent value="mentions" className="space-y-8">
                  <AIResponsesSection analyticsData={analyticsData} />
                </TabsContent>
                <SentimentsTab analyticsData={analyticsData} />
                <InsightsTab analyticsData={analyticsData} brandId={brandId} />
              </Tabs>
            </div>
          </div>
        )}
      </PromptAnalyticsWrapper>
    </AnalyticsDateRangeProvider>
  )
}
