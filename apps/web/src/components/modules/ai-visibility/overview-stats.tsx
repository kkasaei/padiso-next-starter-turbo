'use client'

import { TrendingUp, TrendingDown, Minus, Bot, Users, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AIVisibilityStats, TrendDirection } from '@/lib/shcmea/types/dtos/ai-visibility-dto'

interface OverviewStatsProps {
  stats: AIVisibilityStats
}

const TrendIcon = ({ trend }: { trend: TrendDirection }) => {
  if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />
  if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />
  return <Minus className="h-4 w-4 text-muted-foreground" />
}

export function OverviewStats({ stats }: OverviewStatsProps) {
  const statCards = [
    {
      label: 'Brand Mentions',
      value: stats.brandMentions.toLocaleString(),
      icon: Users,
      trend: stats.visibilityTrend,
    },
    {
      label: 'Competitor Gap',
      value: stats.competitorGap > 0 ? `+${stats.competitorGap}%` : `${stats.competitorGap}%`,
      icon: BarChart3,
      trend: stats.visibilityTrend,
      isPositive: stats.competitorGap > 0,
    },
    {
      label: 'AI Engines',
      value: stats.aiEnginesTracked,
      icon: Bot,
      trend: stats.visibilityTrend,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl"
        >
          <div className="flex flex-col gap-y-2 p-4 pb-2">
            <div className="flex flex-row items-center justify-between">
              <span className="text-base text-muted-foreground">{stat.label}</span>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <h2
              className={cn(
                'text-4xl font-light',
                stat.isPositive !== undefined && (stat.isPositive ? 'text-green-600 dark:text-green-400' : 'text-foreground')
              )}
            >
              {stat.value}
            </h2>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-card px-4 py-3">
            <span className="text-sm text-muted-foreground">Trend</span>
            <TrendIcon trend={stat.trend} />
          </div>
        </div>
      ))}
    </div>
  )
}
