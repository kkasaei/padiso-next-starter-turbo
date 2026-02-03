'use client'

import { useState, useRef, useMemo } from 'react'
import Image from 'next/image'
import { Button } from '@workspace/ui/components/button'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@workspace/ui/components/tooltip'
import { Input } from '@workspace/ui/components/input'
import { Textarea } from '@workspace/ui/components/textarea'
import { Label } from '@workspace/ui/components/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'
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
  HelpCircle,
  Sparkles,
  Upload,
  Trash2,
  Loader2,
  Globe,
  Languages,
  ArrowLeftRight,
  Lightbulb,
  X
} from 'lucide-react'
import { Badge } from '@workspace/ui/components/badge'
import { cn } from '@workspace/ui/lib/utils'
import { StatRow } from '@/components/brands/StatRow'
import { PublishModal } from '@/components/brands/content/PublishModal'
import { toast } from 'sonner'
import type { ContentData, LocaleInfo } from '@/app/(authenicated)/dashboard/brands/[id]/content/[contentId]/_mockData'

// Sample AI-generated images (placeholders) - 16:9 aspect ratio
const AI_GENERATED_IMAGES = [
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=675&fit=crop',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=675&fit=crop',
  'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=1200&h=675&fit=crop',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=675&fit=crop',
]

type ContentDetailSidebarProps = {
  content: ContentData
  brandId: string
}

type ContentFooterActionsProps = {
  brandId: string
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

type FeaturedImageCardProps = {
  featuredImage: string | null
  onImageChange: (image: string | null) => void
}

type LanguagesCardProps = {
  primaryLocale?: LocaleInfo
  locales?: LocaleInfo[]
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
    <div className="group flex w-full flex-col justify-between rounded-xl border border-transparent bg-gray-200 p-2 shadow-xs transition-all hover:shadow-md dark:border-polar-700 dark:bg-polar-800 lg:rounded-4xl">
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

function FeaturedImageCard({ featuredImage, onImageChange }: FeaturedImageCardProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleGenerateImage = async () => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    const randomImage = AI_GENERATED_IMAGES[Math.floor(Math.random() * AI_GENERATED_IMAGES.length)] as string
    onImageChange(randomImage)
    setIsGenerating(false)
    toast.success('Image generated')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB')
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        onImageChange(event.target?.result as string)
        toast.success('Image uploaded')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    onImageChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.16em] mb-2">
        Featured Image
      </div>
      <p className="text-xs text-muted-foreground mb-2">1200×675px (16:9 aspect ratio)</p>
      
      {featuredImage ? (
        <div className="relative group aspect-video w-full rounded-2xl overflow-hidden border border-border/60 shadow-sm">
          <img 
            src={featuredImage} 
            alt="Featured" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleGenerateImage}
              disabled={isGenerating}
              className="h-7 text-xs"
            >
              {isGenerating ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <Sparkles className="h-3 w-3 mr-1" />
              )}
              Regenerate
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-7 text-xs"
            >
              <Upload className="h-3 w-3 mr-1" />
              Replace
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemoveImage}
              className="h-7 text-xs px-2"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2 aspect-video w-full">
          <button
            onClick={handleGenerateImage}
            disabled={isGenerating}
            className="flex-1 flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-border hover:border-primary/50 hover:bg-muted/50 transition-colors"
          >
            {isGenerating ? (
              <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
            ) : (
              <Sparkles className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="text-xs text-muted-foreground">Generate with AI</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-border hover:border-primary/50 hover:bg-muted/50 transition-colors"
          >
            <Upload className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Upload image</span>
          </button>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  )
}

function LanguagesCard({ primaryLocale, locales }: LanguagesCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (!primaryLocale) return null
  
  const totalLocales = (locales?.length || 0) + 1 // +1 for primary
  const hasMultipleLocales = locales && locales.length > 0
  
  // Group locales by status
  const publishedLocales = locales?.filter(l => l.status === 'published') || []
  const draftLocales = locales?.filter(l => l.status === 'draft') || []
  const scheduledLocales = locales?.filter(l => l.status === 'scheduled') || []
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-emerald-200/60 text-emerald-600 dark:border-emerald-900/40 dark:text-emerald-400">Published</Badge>
      case 'draft':
        return <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-gray-200/60 text-gray-600 dark:border-gray-700 dark:text-gray-400">Draft</Badge>
      case 'scheduled':
        return <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-blue-200/60 text-blue-600 dark:border-blue-900/40 dark:text-blue-400">Scheduled</Badge>
      default:
        return null
    }
  }
  
  // Show first 5 locales when collapsed
  const visibleLocales = isExpanded ? locales : locales?.slice(0, 5)
  const hiddenCount = (locales?.length || 0) - 5

  return (
    <div>
      <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.16em] mb-2">
        Languages
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        {totalLocales} {totalLocales === 1 ? 'language' : 'languages'} available
      </p>
      
      {/* Primary Language */}
      <div className="mb-3">
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
          Primary
        </div>
        <div className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-background">
          <div className="flex items-center gap-2">
            <span className="text-base">{primaryLocale.flag}</span>
            <span className="text-sm font-medium">{primaryLocale.name}</span>
          </div>
          {getStatusBadge(primaryLocale.status)}
        </div>
      </div>
      
      {/* Other Locales */}
      {hasMultipleLocales && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Translations ({locales.length})
            </div>
            <div className="flex gap-1.5 text-[10px] text-muted-foreground">
              <span className="text-emerald-600 dark:text-emerald-400">{publishedLocales.length} published</span>
              <span>•</span>
              <span>{draftLocales.length} draft</span>
              {scheduledLocales.length > 0 && (
                <>
                  <span>•</span>
                  <span className="text-blue-600 dark:text-blue-400">{scheduledLocales.length} scheduled</span>
                </>
              )}
            </div>
          </div>
          
          <div className="rounded-xl border border-border/60 bg-background overflow-hidden">
            <div className="max-h-[200px] overflow-y-auto">
              {visibleLocales?.map((locale, index) => (
                <div 
                  key={locale.code}
                  className={cn(
                    "flex items-center justify-between px-2.5 py-2 hover:bg-muted/50 transition-colors cursor-pointer",
                    index !== 0 && "border-t border-border/40"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{locale.flag}</span>
                    <span className="text-xs font-medium">{locale.name}</span>
                  </div>
                  {getStatusBadge(locale.status)}
                </div>
              ))}
            </div>
            
            {/* Show more / Show less button */}
            {locales && locales.length > 5 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-center gap-1 py-2 text-xs text-muted-foreground hover:text-foreground border-t border-border/40 hover:bg-muted/30 transition-colors"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3 w-3" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3" />
                    Show {hiddenCount} more
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// ACTIONS CARD
// ============================================================
type ActionsCardProps = {
  targetKeyword: string
  onChangeTopic: () => void
  onAddInstructions: () => void
}

function ActionsCard({ targetKeyword, onChangeTopic, onAddInstructions }: ActionsCardProps) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.16em] mb-2">
        Actions
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Modify content settings and instructions
      </p>
      
      <div className="space-y-2">
        <button
          onClick={onChangeTopic}
          className="w-full flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-background hover:bg-muted/50 transition-colors text-left"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">Change Topic</div>
            <div className="text-xs text-muted-foreground truncate">Current: {targetKeyword}</div>
          </div>
        </button>
        
        <button
          onClick={onAddInstructions}
          className="w-full flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-background hover:bg-muted/50 transition-colors text-left"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">Add Instructions</div>
            <div className="text-xs text-muted-foreground">Provide context for AI generation</div>
          </div>
        </button>
      </div>
    </div>
  )
}

// ============================================================
// ADD INSTRUCTIONS MODAL
// ============================================================
const AI_INSTRUCTION_TEMPLATES = [
  `Focus on practical, actionable advice that readers can implement immediately. Include real-world examples and case studies from successful AI implementations. Highlight common pitfalls to avoid and best practices for maximizing ROI.`,
  `Write in a conversational yet authoritative tone. Target decision-makers (CTOs, CEOs, VPs) who are evaluating AI solutions. Include specific metrics and benchmarks where possible. Address common objections and concerns.`,
  `Structure the article with clear sections: Introduction, Key Considerations, Comparison Criteria, Top Recommendations, and Conclusion. Use bullet points for easy scanning. Include a summary table comparing options.`,
  `Emphasize the strategic value of AI consulting over DIY approaches. Include quotes or insights from industry experts. Reference recent trends and statistics from 2025-2026. Keep the tone professional but accessible.`,
]

interface SidebarAddInstructionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contentTitle: string
  onSave: (instructions: string, referenceUrl: string, productImage: string | null) => void
}

function SidebarAddInstructionsModal({ open, onOpenChange, contentTitle, onSave }: SidebarAddInstructionsModalProps) {
  const [instructions, setInstructions] = useState('')
  const [referenceUrl, setReferenceUrl] = useState('')
  const [productImage, setProductImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const maxLength = 1000

  const handleGenerateWithAI = async () => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 1200))
    const template = AI_INSTRUCTION_TEMPLATES[Math.floor(Math.random() * AI_INSTRUCTION_TEMPLATES.length)] as string
    setInstructions(template)
    setIsGenerating(false)
    toast.success('Instructions generated')
  }

  const handleSave = () => {
    onSave(instructions, referenceUrl, productImage)
    setInstructions('')
    setReferenceUrl('')
    setProductImage(null)
  }

  const handleCancel = () => {
    onOpenChange(false)
    setInstructions('')
    setReferenceUrl('')
    setProductImage(null)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setProductImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold">Article Instructions</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            For: {contentTitle}
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Special Instructions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Special Instructions</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerateWithAI}
                  disabled={isGenerating}
                  className="h-7 px-2 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  {isGenerating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                  Generate with AI
                </Button>
                <span className="text-xs text-muted-foreground">{instructions.length}/{maxLength}</span>
              </div>
            </div>
            <Textarea
              placeholder="Share any context, key points, or specific directions you'd like the model to use when generating this article."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value.slice(0, maxLength))}
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* Reference URL */}
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label className="text-sm font-medium">Reference URL</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add a URL for reference material</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              placeholder="https://example.com/your-notes-or-brief"
              value={referenceUrl}
              onChange={(e) => setReferenceUrl(e.target.value)}
            />
          </div>

          {/* Integrate Product or Logo */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Integrate Product or Logo</Label>
            <p className="text-xs text-muted-foreground">Select which product or logo you want to see in the article images.</p>
            <div className="flex gap-3 mt-3">
              <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors">
                <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Upload New</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              
              {productImage && (
                <div className="relative w-24 h-24 rounded-xl border-2 border-primary overflow-hidden">
                  <Image
                    src={productImage}
                    alt="Product"
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => setProductImage(null)}
                    className="absolute top-1 right-1 p-0.5 bg-background/80 rounded-full hover:bg-background"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0 gap-2">
          <Button variant="outline" onClick={handleCancel} className="rounded-lg">
            Cancel
          </Button>
          <Button onClick={handleSave} className="rounded-lg bg-foreground text-background hover:bg-foreground/90">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================
// CHANGE TOPIC MODAL
// ============================================================
interface TopicSuggestion {
  id: string
  title: string
  difficulty: number
  volume: number
  type: string
}

const INITIAL_TOPICS: TopicSuggestion[] = [
  { id: '1', title: 'AI consulting firms comparison', difficulty: 5, volume: 320, type: 'Product Listicle' },
  { id: '2', title: 'best AI implementation partners', difficulty: 4, volume: 280, type: 'Product Listicle' },
  { id: '3', title: 'enterprise AI strategy consultants', difficulty: 6, volume: 150, type: 'Product Listicle' },
  { id: '4', title: 'how to choose an AI consultant', difficulty: 3, volume: 420, type: 'How To' },
  { id: '5', title: 'AI transformation services guide', difficulty: 4, volume: 190, type: 'Guide' },
  { id: '6', title: 'top AI advisory firms 2026', difficulty: 5, volume: 510, type: 'Listicle' },
]

const AI_GENERATED_TOPICS: TopicSuggestion[][] = [
  [
    { id: '7', title: 'AI readiness assessment services', difficulty: 4, volume: 180, type: 'Product Listicle' },
    { id: '8', title: 'how to build an AI roadmap', difficulty: 3, volume: 340, type: 'How To' },
    { id: '9', title: 'machine learning consulting costs', difficulty: 5, volume: 290, type: 'Explainer' },
    { id: '10', title: 'AI consulting vs in-house teams', difficulty: 4, volume: 220, type: 'Explainer' },
    { id: '11', title: 'best generative AI consultants', difficulty: 6, volume: 480, type: 'Product Listicle' },
    { id: '12', title: 'enterprise AI adoption strategies', difficulty: 5, volume: 360, type: 'Guide' },
  ],
  [
    { id: '13', title: 'AI consulting ROI calculator', difficulty: 4, volume: 150, type: 'How To' },
    { id: '14', title: 'ChatGPT implementation services', difficulty: 5, volume: 620, type: 'Product Listicle' },
    { id: '15', title: 'AI integration best practices', difficulty: 3, volume: 410, type: 'Guide' },
    { id: '16', title: 'custom AI solution providers', difficulty: 6, volume: 180, type: 'Product Listicle' },
    { id: '17', title: 'AI consulting for startups', difficulty: 4, volume: 290, type: 'Guide' },
    { id: '18', title: 'LLM deployment consultants', difficulty: 7, volume: 240, type: 'Product Listicle' },
  ],
]

interface SidebarChangeTopicModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (topic: TopicSuggestion) => void
}

function SidebarChangeTopicModal({ open, onOpenChange, onConfirm }: SidebarChangeTopicModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTopic, setSelectedTopic] = useState<TopicSuggestion | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [topics, setTopics] = useState<TopicSuggestion[]>(INITIAL_TOPICS)
  const [generationIndex, setGenerationIndex] = useState(0)

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics
    const query = searchQuery.toLowerCase()
    return topics.filter(t => t.title.toLowerCase().includes(query))
  }, [searchQuery, topics])

  const handleGenerateWithAI = async () => {
    setIsLoading(true)
    setSelectedTopic(null)
    await new Promise(resolve => setTimeout(resolve, 1500))
    const newTopics = AI_GENERATED_TOPICS[generationIndex % AI_GENERATED_TOPICS.length] as TopicSuggestion[]
    setTopics(newTopics)
    setGenerationIndex(prev => prev + 1)
    setIsLoading(false)
    toast.success('Generated new topic suggestions')
  }

  const handleConfirm = () => {
    if (selectedTopic) {
      onConfirm(selectedTopic)
      setSelectedTopic(null)
      setSearchQuery('')
      setTopics(INITIAL_TOPICS)
      setGenerationIndex(0)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setSelectedTopic(null)
    setSearchQuery('')
    setTopics(INITIAL_TOPICS)
    setGenerationIndex(0)
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return 'text-emerald-600'
    if (difficulty <= 5) return 'text-amber-600'
    return 'text-rose-600'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 rounded-2xl">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-semibold">Choose Alternative Topic</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Choose among our topic recommendations or insert your own.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6">
          <div className="flex gap-3 mb-4">
            <Input
              placeholder="Search or insert your own topic (e.g. 'AI implementation')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={handleGenerateWithAI}
              disabled={isLoading}
              className="shrink-0 gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Generate with AI
            </Button>
          </div>

          <div className="border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Topic</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Difficulty</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Search Volume</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Article Type</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                    </td>
                  </tr>
                ) : filteredTopics.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground text-sm">
                      No topics found. Try a different search term.
                    </td>
                  </tr>
                ) : (
                  filteredTopics.map((topic) => (
                    <tr
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic)}
                      className={cn(
                        "border-b last:border-0 cursor-pointer transition-colors",
                        selectedTopic?.id === topic.id 
                          ? "bg-primary/5 hover:bg-primary/10" 
                          : "hover:bg-muted/30"
                      )}
                    >
                      <td className="py-3 px-4">
                        <span className="text-sm">{topic.title}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn("text-sm font-medium", getDifficultyColor(topic.difficulty))}>
                          {topic.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm">{topic.volume}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-muted-foreground">{topic.type}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <DialogFooter className="p-6 gap-2">
          <Button variant="outline" onClick={handleCancel} className="rounded-lg">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedTopic}
            className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ContentFooterActions({ brandId }: ContentFooterActionsProps) {
  const [showPublishModal, setShowPublishModal] = useState(false)

  return (
    <>
      <div className="shrink-0 border-t border-border/60 bg-background p-4">
        <div className="space-y-2">
          <Button 
            className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90" 
            size="lg"
            onClick={() => setShowPublishModal(true)}
          >
            <Send className="h-4 w-4 mr-2" />
            Publish Article
          </Button>
        </div>
      </div>
      
      {/* Publish Modal */}
      <PublishModal
        open={showPublishModal}
        onOpenChange={setShowPublishModal}
        brandId={brandId}
      />
    </>
  )
}

export function ContentDetailSidebar({ content, brandId }: ContentDetailSidebarProps) {
  const [showScoreFactors, setShowScoreFactors] = useState(false)
  const [featuredImage, setFeaturedImage] = useState<string | null>((content as { featuredImage?: string | null }).featuredImage ?? null)
  const [changeTopicModalOpen, setChangeTopicModalOpen] = useState(false)
  const [instructionsModalOpen, setInstructionsModalOpen] = useState(false)

  const handleChangeTopic = (topic: TopicSuggestion) => {
    toast.success(`Topic changed to "${topic.title}"`)
    setChangeTopicModalOpen(false)
  }

  const handleSaveInstructions = (instructions: string, referenceUrl: string, productImage: string | null) => {
    toast.success('Instructions saved')
    setInstructionsModalOpen(false)
  }

  return (
    <aside className="relative h-full border-l border-border bg-muted/20">
      {/* Scrollable content area - takes full height minus footer */}
      <div className="absolute inset-0 bottom-[73px] overflow-y-auto p-4 space-y-4">
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
        <FeaturedImageCard 
          featuredImage={featuredImage} 
          onImageChange={setFeaturedImage} 
        />
        <LanguagesCard 
          primaryLocale={(content as { primaryLocale?: LocaleInfo }).primaryLocale}
          locales={(content as { locales?: LocaleInfo[] }).locales}
        />
        <ActionsCard
          targetKeyword={content.targetKeyword}
          onChangeTopic={() => setChangeTopicModalOpen(true)}
          onAddInstructions={() => setInstructionsModalOpen(true)}
        />
      </div>

      {/* Fixed footer */}
      <div className="absolute bottom-0 left-0 right-0">
        <ContentFooterActions brandId={brandId} />
      </div>

      {/* Modals */}
      <SidebarChangeTopicModal
        open={changeTopicModalOpen}
        onOpenChange={setChangeTopicModalOpen}
        onConfirm={handleChangeTopic}
      />
      <SidebarAddInstructionsModal
        open={instructionsModalOpen}
        onOpenChange={setInstructionsModalOpen}
        contentTitle={content.title}
        onSave={handleSaveInstructions}
      />
    </aside>
  )
}
