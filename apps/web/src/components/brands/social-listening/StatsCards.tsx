'use client'

import { Card, CardContent, CardHeader } from '@workspace/ui/components/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip'
import { HelpCircle, MessageSquare, CheckCircle, Hash, TrendingUp } from 'lucide-react'

interface Stats {
  totalOpportunities: number
  pendingOpportunities: number
  completedOpportunities: number
  dismissedOpportunities: number
  monitoredKeywords: number
  searchVolume: number
  totalComments: number
}

interface StatsCardsProps {
  stats?: Stats
  isLoading: boolean
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const cards = [
    {
      label: 'Pending',
      description: 'Reddit opportunities waiting for your review and engagement.',
      value: stats?.pendingOpportunities ?? 0,
      icon: MessageSquare,
    },
    {
      label: 'Completed',
      description: 'Opportunities you\'ve engaged with or marked as done.',
      value: stats?.completedOpportunities ?? 0,
      icon: CheckCircle,
    },
    {
      label: 'Keywords',
      description: 'Active keywords being monitored across Reddit.',
      value: stats?.monitoredKeywords ?? 0,
      icon: Hash,
    },
    {
      label: 'Total Reach',
      description: 'Combined upvotes from all discovered opportunities.',
      value: formatNumber(stats?.searchVolume ?? 0),
      icon: TrendingUp,
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="rounded-2xl border border-transparent bg-gray-50 shadow-none dark:border-transparent dark:bg-polar-800">
            <CardHeader className="pb-2">
              <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-polar-700" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-polar-700" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card 
          key={card.label} 
          className="rounded-2xl border border-transparent bg-gray-50 text-gray-950 shadow-none dark:border-transparent dark:bg-polar-800 dark:text-white"
        >
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <card.icon className="h-4 w-4 text-gray-400 dark:text-polar-500" />
            <span className="text-sm text-gray-500 dark:text-polar-500">{card.label}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-400 hover:text-gray-600 dark:text-polar-500 dark:hover:text-polar-300 transition-colors">
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-sm">{card.description}</p>
              </TooltipContent>
            </Tooltip>
          </CardHeader>
          <CardContent className="pt-0">
            <h3 className="text-2xl font-light">{card.value}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}
