'use client'

import { useState } from 'react'
import { Button } from '@workspace/ui/components/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip'
import { 
  FileText, 
  Hash, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  ExternalLink, 
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Send,
  HelpCircle
} from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'
import { StatRow } from '@/components/brands/StatRow'
import type { ContentData } from '@/app/(authenicated)/dashboard/brands/[id]/content/[contentId]/_mockData'

type ContentDetailSidebarProps = {
  content: ContentData
}

type ContentFooterActionsProps = {
  status: ContentData['status']
}

type ArticleScoreCardProps = {
  score: number
  showScoreFactors: boolean
  onToggleScoreFactors: () => void
}

type OptimizationSuggestionsCardProps = {
  isOptimized: boolean
  optimizationMessage?: string
}

type ArticleDataCardProps = {
  targetKeyword: string
  searchVolume: number
  difficulty: number
  wordCount: number
  keywordCount: number
  imageCount: number
  internalLinks: number
  externalLinks: number
}

type SlugCardProps = {
  slug: string
}

type MetaDescriptionCardProps = {
  metaDescription: string
}

const getScoreColor = (score: number) => {
  if (score >= 90) return '#10b981' // emerald
  if (score >= 70) return '#3b82f6' // blue
  if (score >= 50) return '#f59e0b' // amber
  return '#ef4444' // red
}

function ArticleScoreCard({ score, showScoreFactors, onToggleScoreFactors }: ArticleScoreCardProps) {
  const scoreColor = getScoreColor(score)

  const getScoreLabel = (score: number) => {
    if (score >= 90) return { text: 'Excellent', color: 'text-green-600 dark:text-green-400' }
    if (score >= 70) return { text: 'Good', color: 'text-blue-600 dark:text-blue-400' }
    if (score >= 50) return { text: 'Fair', color: 'text-amber-600 dark:text-amber-400' }
    return { text: 'Needs Work', color: 'text-red-600 dark:text-red-400' }
  }

  const scoreLabel = getScoreLabel(score)

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl border border-transparent bg-gray-50 p-2 shadow-xs transition-all hover:shadow-md dark:border-polar-700 dark:bg-polar-800 lg:rounded-4xl">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex w-full flex-col gap-y-4">
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-x-2">
              <h3 className="text-lg">Article Score</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="text-gray-400 hover:text-gray-600 dark:text-polar-500 dark:hover:text-polar-300 transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-sm">Overall content quality score based on SEO best practices, readability, and optimization factors.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="flex items-baseline gap-x-2">
            <h2 className="text-5xl font-light">{score}</h2>
            <span className="text-2xl text-gray-400 dark:text-polar-500">/100</span>
          </div>
          <div className="flex flex-col gap-x-6 gap-y-2 md:flex-row md:items-center">
            <div className="flex flex-row items-center gap-x-2 text-sm">
              <span
                className="h-3 w-3 rounded-full border-2"
                style={{ borderColor: scoreColor }}
              />
              <span className={cn("font-medium", scoreLabel.color)}>
                {scoreLabel.text}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex w-full flex-col gap-y-2 rounded-3xl bg-white px-6 py-4 dark:bg-polar-900">
        <button
          onClick={onToggleScoreFactors}
          className="flex items-center justify-center gap-2 w-full py-2 text-xs text-gray-500 hover:text-gray-700 dark:text-polar-500 dark:hover:text-polar-300 transition-colors"
        >
          <span className="uppercase tracking-[0.16em] font-semibold">Score Factors</span>
          {showScoreFactors ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}

function OptimizationSuggestionsCard({
  isOptimized,
  optimizationMessage,
}: OptimizationSuggestionsCardProps) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.16em] mb-3">
        Optimization Suggestions
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Optional tips to help improve your score
      </p>
      {isOptimized ? (
        <div className="flex items-start gap-3 p-4 rounded-2xl border border-border/60 bg-card shadow-sm">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-foreground mb-1">
              Article Optimized
            </div>
            <p className="text-xs text-muted-foreground">
              {optimizationMessage}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl border border-border/60 bg-card shadow-sm">
          <p className="text-xs text-muted-foreground">
            {optimizationMessage}
          </p>
        </div>
      )}
    </div>
  )
}

function ArticleDataCard({
  targetKeyword,
  searchVolume,
  difficulty,
  wordCount,
  keywordCount,
  imageCount,
  internalLinks,
  externalLinks,
}: ArticleDataCardProps) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.16em] mb-3">
        Article Data
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Key metrics and performance indicators
      </p>

      <div className="mb-4 rounded-xl border border-border/60 bg-background p-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-2">
          Target Keyword
        </div>
        <div className="text-sm font-semibold text-foreground">{targetKeyword}</div>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center rounded-full border border-border/60 px-2.5 py-1">
            Search Vol: {searchVolume}
          </span>
          <span className="inline-flex items-center rounded-full border border-border/60 px-2.5 py-1">
            Difficulty: {difficulty}
          </span>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border/60 bg-background p-4">
        <StatRow
          label="Word Count"
          icon={<FileText className="h-4 w-4" />}
          value={
            <span className="flex items-center gap-2">
              {wordCount.toLocaleString()}
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                wordCount >= 2000
                  ? 'border-emerald-200/60 text-emerald-600 dark:border-emerald-900/40 dark:text-emerald-400'
                  : 'border-amber-200/70 text-amber-700 dark:border-amber-900/40 dark:text-amber-400'
              }`}>
                {wordCount >= 2000 ? 'Strong' : 'Low'}
              </span>
            </span>
          }
        />

        <StatRow
          label="Number of Keywords"
          icon={<Hash className="h-4 w-4" />}
          value={
            <span className="flex items-center gap-2">
              {keywordCount}
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                keywordCount >= 10
                  ? 'border-emerald-200/60 text-emerald-600 dark:border-emerald-900/40 dark:text-emerald-400'
                  : 'border-amber-200/70 text-amber-700 dark:border-amber-900/40 dark:text-amber-400'
              }`}>
                {keywordCount >= 10 ? 'Strong' : 'Low'}
              </span>
            </span>
          }
        />

        <StatRow
          label="Images"
          icon={<ImageIcon className="h-4 w-4" />}
          value={
            <span className="flex items-center gap-2">
              {imageCount}
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                imageCount >= 2
                  ? 'border-emerald-200/60 text-emerald-600 dark:border-emerald-900/40 dark:text-emerald-400'
                  : 'border-amber-200/70 text-amber-700 dark:border-amber-900/40 dark:text-amber-400'
              }`}>
                {imageCount >= 2 ? 'Good' : 'Low'}
              </span>
            </span>
          }
        />

        <StatRow
          label="Internal Links"
          icon={<LinkIcon className="h-4 w-4" />}
          value={
            <span className="flex items-center gap-2">
              {internalLinks}
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                internalLinks >= 3
                  ? 'border-emerald-200/60 text-emerald-600 dark:border-emerald-900/40 dark:text-emerald-400'
                  : 'border-amber-200/70 text-amber-700 dark:border-amber-900/40 dark:text-amber-400'
              }`}>
                {internalLinks >= 3 ? 'Good' : 'Low'}
              </span>
            </span>
          }
        />

        <StatRow
          label="External Links"
          icon={<ExternalLink className="h-4 w-4" />}
          value={
            <span className="flex items-center gap-2">
              {externalLinks}
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                externalLinks >= 5
                  ? 'border-emerald-200/60 text-emerald-600 dark:border-emerald-900/40 dark:text-emerald-400'
                  : 'border-amber-200/70 text-amber-700 dark:border-amber-900/40 dark:text-amber-400'
              }`}>
                {externalLinks >= 5 ? 'Good' : 'Low'}
              </span>
            </span>
          }
        />
      </div>
    </div>
  )
}

function SlugCard({ slug }: SlugCardProps) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.16em] mb-2">
        Slug
      </div>
      <p className="text-xs text-muted-foreground mb-2">The optimized article URL</p>
      <div className="p-3 rounded-2xl border border-border/60 bg-card text-xs font-mono break-all shadow-sm">
        {slug}
      </div>
    </div>
  )
}

function MetaDescriptionCard({ metaDescription }: MetaDescriptionCardProps) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.16em] mb-2">
        Meta Description
      </div>
      <p className="text-xs text-muted-foreground mb-2">Article description for search engines</p>
      <div className="p-3 rounded-2xl border border-border/60 bg-card text-xs shadow-sm">
        {metaDescription}
      </div>
    </div>
  )
}

function ContentFooterActions({ status }: ContentFooterActionsProps) {
  return (
    <div className="sticky bottom-0 border-t border-border/60 bg-background/95 p-4 backdrop-blur">
      <div className="space-y-2">
        {status === 'draft' ? (
          <Button className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90" size="lg">
            <Send className="h-4 w-4 mr-2" />
            Publish Article
          </Button>
        ) : (
          <Button className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90" size="lg">
            <Send className="h-4 w-4 mr-2" />
            Publish Article
          </Button>
        )}
      </div>
    </div>
  )
}

export function ContentDetailSidebar({ content }: ContentDetailSidebarProps) {
  const [showScoreFactors, setShowScoreFactors] = useState(false)

  return (
    <aside className="h-full border-l border-border">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <ArticleScoreCard
            score={content.articleScore}
            showScoreFactors={showScoreFactors}
            onToggleScoreFactors={() => setShowScoreFactors(!showScoreFactors)}
          />
          <OptimizationSuggestionsCard
            isOptimized={content.isOptimized}
            optimizationMessage={content.optimizationMessage}
          />
          <ArticleDataCard
            targetKeyword={content.targetKeyword}
            searchVolume={content.searchVolume}
            difficulty={content.difficulty}
            wordCount={content.wordCount}
            keywordCount={content.keywordCount}
            imageCount={content.imageCount}
            internalLinks={content.internalLinks}
            externalLinks={content.externalLinks}
          />
          <SlugCard slug={content.slug} />
          <MetaDescriptionCard metaDescription={content.metaDescription} />
        </div>

        <ContentFooterActions status={content.status} />
      </div>
    </aside>
  )
}
