'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@workspace/ui/components/button'
import { Separator } from '@workspace/ui/components/separator'
import { 
  Pencil, 
  FileText, 
  Hash, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  ExternalLink, 
  Calendar,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Settings,
  Download
} from 'lucide-react'
import { StatRow } from '@/components/brands/StatRow'
import type { ContentData } from '@/app/dashboard/brands/[id]/content/[contentId]/_mockData'

type ContentDetailSidebarProps = {
  content: ContentData
  brandId: string
}

const formatDate = (date: Date | null) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

const getScoreColor = (score: number) => {
  if (score >= 90) return '#10b981' // emerald
  if (score >= 70) return '#3b82f6' // blue
  if (score >= 50) return '#f59e0b' // amber
  return '#ef4444' // red
}

export function ContentDetailSidebar({ content, brandId }: ContentDetailSidebarProps) {
  const [showScoreFactors, setShowScoreFactors] = useState(false)

  const scoreColor = getScoreColor(content.articleScore)
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - content.articleScore / 100)

  return (
    <aside className="h-full overflow-y-auto border-l border-border bg-muted/10">
      <div className="p-6 space-y-6 min-h-full">
        {/* Article Score */}
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Article Score
          </div>
          <div className="flex justify-center mb-4">
            <div className="relative" style={{ width: 120, height: 120 }}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/20"
                />
                {/* Progress circle */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{content.articleScore}</span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
            </div>
          </div>

          {/* Score Factors Toggle */}
          <button
            onClick={() => setShowScoreFactors(!showScoreFactors)}
            className="flex items-center justify-center gap-2 w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="uppercase tracking-wide font-medium">Score Factors</span>
            {showScoreFactors ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        <Separator />

        {/* Optimization Suggestions */}
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Optimization Suggestions
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Optional tips to help improve your score
          </p>
          {content.isOptimized ? (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-1">
                  Article Optimized
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  {content.optimizationMessage}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30">
              <p className="text-xs text-amber-700 dark:text-amber-300">
                {content.optimizationMessage}
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Article Data */}
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Article Data
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Key metrics and performance indicators
          </p>

          {/* Target Keyword */}
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">{content.targetKeyword}</div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Search Vol: {content.searchVolume}</span>
              <span>Difficulty: {content.difficulty}</span>
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-3">
            <StatRow
              label="Word Count"
              icon={<FileText className="h-4 w-4" />}
              value={
                <span className="flex items-center gap-2">
                  {content.wordCount.toLocaleString()}
                  <span className={`h-2 w-2 rounded-full ${content.wordCount >= 2000 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                </span>
              }
            />

            <StatRow
              label="Number of Keywords"
              icon={<Hash className="h-4 w-4" />}
              value={
                <span className="flex items-center gap-2">
                  {content.keywordCount}
                  <span className={`h-2 w-2 rounded-full ${content.keywordCount >= 10 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                </span>
              }
            />

            <StatRow
              label="Images"
              icon={<ImageIcon className="h-4 w-4" />}
              value={
                <span className="flex items-center gap-2">
                  {content.imageCount}
                  <span className={`h-2 w-2 rounded-full ${content.imageCount >= 2 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                </span>
              }
            />

            <StatRow
              label="Internal Links"
              icon={<LinkIcon className="h-4 w-4" />}
              value={
                <span className="flex items-center gap-2">
                  {content.internalLinks}
                  <span className={`h-2 w-2 rounded-full ${content.internalLinks >= 3 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                </span>
              }
            />

            <StatRow
              label="External Links"
              icon={<ExternalLink className="h-4 w-4" />}
              value={
                <span className="flex items-center gap-2">
                  {content.externalLinks}
                  <span className={`h-2 w-2 rounded-full ${content.externalLinks >= 5 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                </span>
              }
            />
          </div>
        </div>

        <Separator />

        {/* Slug */}
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Slug
          </div>
          <p className="text-xs text-muted-foreground mb-2">The optimized article URL</p>
          <div className="p-2 rounded bg-muted/50 text-xs font-mono break-all">
            {content.slug}
          </div>
        </div>

        {/* Meta Description */}
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Meta Description
          </div>
          <p className="text-xs text-muted-foreground mb-2">Article description for search engines</p>
          <div className="p-2 rounded bg-muted/50 text-xs">
            {content.metaDescription}
          </div>
        </div>

        <Separator />

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(content.updatedAt)}</span>
        </div>

        {/* Primary Actions */}
        <div className="space-y-2 pt-2">
          {content.status === 'draft' ? (
            <Button className="w-full" size="lg">
              <Settings className="h-4 w-4 mr-2" />
              Publish Article
            </Button>
          ) : (
            <Button className="w-full" variant="outline" size="lg">
              <Settings className="h-4 w-4 mr-2" />
              Update Integration
            </Button>
          )}

          <Button variant="outline" size="sm" className="w-full justify-between" asChild>
            <Link href={`/dashboard/brands/${brandId}/content/${content.id}/export`}>
              <span className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export Article
              </span>
              <ChevronDown className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Separator />

        {/* Edit Action */}
        <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
          <Link href={`/dashboard/brands/${brandId}/content/${content.id}/edit`}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Content
          </Link>
        </Button>
      </div>
    </aside>
  )
}
