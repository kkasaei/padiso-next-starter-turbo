'use client'

import { useState, useMemo } from 'react'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import {
  ExternalLink,
  Sparkles,
  Check,
  X,
  Copy,
  MoreVertical,
  MessageSquare,
  ArrowUp,
  Clock,
  Loader2,
  Rocket,
} from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@workspace/ui/lib/utils'
import { marked } from 'marked'

// Configure marked for safe rendering
marked.setOptions({
  breaks: true,
  gfm: true,
})

// Simple markdown renderer component
function MarkdownContent({ content }: { content: string }) {
  const html = useMemo(() => {
    return marked.parse(content) as string
  }, [content])

  return (
    <div 
      className="text-sm leading-relaxed text-gray-700 dark:text-polar-200 [&_p]:my-2.5 [&_ul]:my-2.5 [&_ul]:pl-4 [&_li]:my-1 [&_strong]:font-semibold [&_strong]:text-gray-900 dark:[&_strong]:text-white"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

interface OpportunitiesTabProps {
  brandId: string
}

type StatusFilter = 'pending' | 'completed' | 'dismissed' | undefined

export function OpportunitiesTab({ brandId }: OpportunitiesTabProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending')
  const [generatingId, setGeneratingId] = useState<string | null>(null)

  const utils = trpc.useUtils()

  const { data, isLoading } = trpc.reddit.getOpportunities.useQuery({
    brandId,
    status: statusFilter,
    limit: 20,
  })

  const generateComment = trpc.reddit.generateComment.useMutation({
    onSuccess: () => {
      toast.success('Comment generated!')
      utils.reddit.getOpportunities.invalidate()
    },
    onError: (error) => {
      toast.error(error.message)
    },
    onSettled: () => {
      setGeneratingId(null)
    },
  })

  const updateStatus = trpc.reddit.updateOpportunityStatus.useMutation({
    onSuccess: () => {
      utils.reddit.getOpportunities.invalidate()
      utils.reddit.getStats.invalidate()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleGenerateComment = (opportunityId: string) => {
    setGeneratingId(opportunityId)
    generateComment.mutate({ opportunityId })
  }

  const handleCopyComment = (comment: string) => {
    navigator.clipboard.writeText(comment)
    toast.success('Comment copied to clipboard!')
  }

  const handleComplete = (opportunityId: string) => {
    updateStatus.mutate({ opportunityId, status: 'completed' })
    toast.success('Marked as completed')
  }

  const handleDismiss = (opportunityId: string) => {
    updateStatus.mutate({ opportunityId, status: 'dismissed' })
    toast.success('Opportunity dismissed')
  }

  const opportunities = data?.opportunities ?? []

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-gray-50 p-6 dark:bg-polar-800">
            <div className="space-y-3">
              <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-polar-700" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-polar-700" />
              <div className="h-20 w-full animate-pulse rounded bg-gray-200 dark:bg-polar-700" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex items-center gap-2">
        {(['pending', 'completed', 'dismissed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status === statusFilter ? undefined : status)}
            className={cn(
              'flex items-center gap-x-2 rounded-full px-4 py-2 text-sm transition-all',
              statusFilter === status
                ? 'bg-gray-100 shadow-sm ring-1 ring-gray-200 dark:bg-polar-700 dark:ring-polar-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-polar-500 dark:hover:text-polar-300'
            )}
          >
            <span className="capitalize">{status}</span>
          </button>
        ))}
      </div>

      {/* Opportunities List */}
      {opportunities.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-gray-50 py-16 text-center dark:bg-polar-800">
          <div className="mb-4 rounded-full bg-gray-200 p-4 dark:bg-polar-700">
            <Rocket className="h-8 w-8 text-gray-400 dark:text-polar-500" />
          </div>
          <h4 className="text-lg font-medium text-gray-700 dark:text-polar-300">No opportunities yet</h4>
          <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-polar-500">
            {statusFilter
              ? `No ${statusFilter} opportunities. Try a different filter or scan for new ones.`
              : 'Add keywords and scan Reddit to discover engagement opportunities.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {opportunities.map((opp) => (
            <div 
              key={opp.id} 
              className="group rounded-2xl bg-gray-50 p-6 transition-all hover:shadow-md dark:bg-polar-800"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <Badge variant="outline" className="rounded-full text-xs font-normal border-gray-200 dark:border-polar-600">
                      r/{opp.subreddit}
                    </Badge>
                    {opp.opportunityType && (
                      <Badge className="rounded-full text-xs font-normal bg-gray-100 text-gray-600 dark:bg-polar-700 dark:text-polar-300 capitalize">
                        {opp.opportunityType.replace(/_/g, ' ')}
                      </Badge>
                    )}
                    {opp.relevanceScore && (
                      <Badge 
                        className={cn(
                          "rounded-full text-xs font-normal",
                          opp.relevanceScore >= 70 
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-600 dark:bg-polar-700 dark:text-polar-300"
                        )}
                      >
                        {opp.relevanceScore}% match
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-base font-medium line-clamp-2 mb-2">
                    {opp.postTitle}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-polar-500">
                    <span className="flex items-center gap-1">
                      <ArrowUp className="h-3 w-3" />
                      {opp.upvotes ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {opp.commentCount ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {opp.postedAt
                        ? formatDistanceToNow(new Date(opp.postedAt), { addSuffix: true })
                        : 'Unknown'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="rounded-full" asChild>
                    <a href={opp.postUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="rounded-full">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem onClick={() => handleComplete(opp.id)} className="rounded-lg">
                        <Check className="h-4 w-4 mr-2" />
                        Mark Complete
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDismiss(opp.id)} className="rounded-lg">
                        <X className="h-4 w-4 mr-2" />
                        Dismiss
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Post Preview */}
              {opp.postBody && (
                <p className="text-sm text-gray-600 dark:text-polar-400 line-clamp-2 mt-4 mb-4">
                  {opp.postBody}
                </p>
              )}

              {/* Matched Keywords */}
              {opp.matchedKeywords && (opp.matchedKeywords as string[]).length > 0 && (
                <div className="flex items-center gap-2 mt-4 mb-4">
                  <span className="text-xs text-gray-500 dark:text-polar-500">Matched:</span>
                  <div className="flex gap-1 flex-wrap">
                    {(opp.matchedKeywords as string[]).map((kw) => (
                      <span 
                        key={kw} 
                        className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Generated Comment */}
              {opp.suggestedComment ? (
                <div className="mt-4 rounded-xl bg-white p-4 dark:bg-polar-900">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-gray-500 dark:text-polar-500">
                      Suggested Comment
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full h-8 text-xs"
                        onClick={() => handleCopyComment(opp.suggestedComment!)}
                      >
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full h-8 text-xs"
                        onClick={() => handleGenerateComment(opp.id)}
                        disabled={generatingId === opp.id}
                      >
                        <Sparkles className="h-3.5 w-3.5 mr-1" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                  <MarkdownContent content={opp.suggestedComment} />
                  {opp.commentTone && (
                    <span className="inline-block mt-3 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 dark:bg-polar-800 dark:text-polar-400 capitalize">
                      {opp.commentTone} tone
                    </span>
                  )}
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGenerateComment(opp.id)}
                  disabled={generatingId === opp.id}
                  className="w-full mt-4 rounded-xl border-dashed"
                >
                  {generatingId === opp.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Comment
                    </>
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {data?.hasMore && (
        <div className="text-center pt-4">
          <Button variant="outline" className="rounded-full">Load More</Button>
        </div>
      )}
    </div>
  )
}
