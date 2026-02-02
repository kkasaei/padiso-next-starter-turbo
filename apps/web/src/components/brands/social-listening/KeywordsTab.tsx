'use client'

import { useState } from 'react'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Switch } from '@workspace/ui/components/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog'
import { Plus, Trash2, Hash, Search, Loader2, Rocket } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

interface KeywordsTabProps {
  brandId: string
}

export function KeywordsTab({ brandId }: KeywordsTabProps) {
  const [newKeyword, setNewKeyword] = useState('')
  const [newSubreddits, setNewSubreddits] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const utils = trpc.useUtils()

  const { data: keywords, isLoading } = trpc.reddit.getKeywords.useQuery({ brandId })

  const addKeyword = trpc.reddit.addKeyword.useMutation({
    onSuccess: () => {
      toast.success('Keyword added!')
      utils.reddit.getKeywords.invalidate()
      setNewKeyword('')
      setNewSubreddits('')
      setIsDialogOpen(false)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const updateKeyword = trpc.reddit.updateKeyword.useMutation({
    onSuccess: () => {
      utils.reddit.getKeywords.invalidate()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const deleteKeyword = trpc.reddit.deleteKeyword.useMutation({
    onSuccess: () => {
      toast.success('Keyword deleted')
      utils.reddit.getKeywords.invalidate()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) {
      toast.error('Please enter a keyword')
      return
    }

    const subreddits = newSubreddits
      .split(',')
      .map((s) => s.trim().replace(/^r\//, ''))
      .filter(Boolean)

    addKeyword.mutate({
      brandId,
      keyword: newKeyword.trim(),
      subreddits: subreddits.length > 0 ? subreddits : undefined,
    })
  }

  const handleToggleActive = (id: string, isActive: boolean) => {
    updateKeyword.mutate({ id, isActive: !isActive })
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this keyword?')) {
      deleteKeyword.mutate({ id })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-gray-50 p-6 dark:bg-polar-800">
            <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-polar-700" />
            <div className="h-4 w-1/4 mt-2 animate-pulse rounded bg-gray-200 dark:bg-polar-700" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Add Keyword Dialog */}
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full gap-2">
              <Plus className="h-4 w-4" />
              Add Keyword
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Add Keyword to Monitor</DialogTitle>
              <DialogDescription>
                Enter a keyword or phrase to search for on Reddit.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Keyword</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="e.g., best SEO tools"
                    className="pl-9 rounded-xl"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-polar-500">
                  Use quotes for exact phrases: &quot;SEO tool for agencies&quot;
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subreddits (optional)</label>
                <Input
                  value={newSubreddits}
                  onChange={(e) => setNewSubreddits(e.target.value)}
                  placeholder="e.g., seo, marketing, smallbusiness"
                  className="rounded-xl"
                />
                <p className="text-xs text-gray-500 dark:text-polar-500">
                  Comma-separated. Leave empty to search all of Reddit.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-full">
                Cancel
              </Button>
              <Button onClick={handleAddKeyword} disabled={addKeyword.isPending} className="rounded-full">
                {addKeyword.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Keyword'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Keywords List */}
      {!keywords || keywords.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-gray-50 py-16 text-center dark:bg-polar-800">
          <div className="mb-4 rounded-full bg-gray-200 p-4 dark:bg-polar-700">
            <Rocket className="h-8 w-8 text-gray-400 dark:text-polar-500" />
          </div>
          <h4 className="text-lg font-medium text-gray-700 dark:text-polar-300">No keywords yet</h4>
          <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-polar-500">
            Add keywords to start monitoring Reddit for opportunities.
          </p>
          <Button className="mt-4 rounded-full gap-2" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Your First Keyword
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {keywords.map((keyword) => (
            <div 
              key={keyword.id} 
              className="flex items-center justify-between rounded-2xl bg-gray-50 p-5 dark:bg-polar-800"
            >
              <div className="flex items-center gap-4">
                <Switch
                  checked={keyword.isActive}
                  onCheckedChange={() => handleToggleActive(keyword.id, keyword.isActive)}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-gray-400 dark:text-polar-500" />
                    <p className="font-medium">{keyword.keyword}</p>
                    {!keyword.isActive && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-600 dark:bg-polar-700 dark:text-polar-400">
                        Paused
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    {keyword.subreddits && (keyword.subreddits as string[]).length > 0 ? (
                      <span className="text-xs text-gray-500 dark:text-polar-500">
                        {(keyword.subreddits as string[]).map((s) => `r/${s}`).join(', ')}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500 dark:text-polar-500">
                        All of Reddit
                      </span>
                    )}
                    <span className="text-xs text-gray-400 dark:text-polar-600">•</span>
                    <span className="text-xs text-gray-500 dark:text-polar-500">
                      {keyword.totalOpportunities} opportunities
                    </span>
                    {keyword.lastScanAt && (
                      <>
                        <span className="text-xs text-gray-400 dark:text-polar-600">•</span>
                        <span className="text-xs text-gray-500 dark:text-polar-500">
                          {formatDistanceToNow(new Date(keyword.lastScanAt), { addSuffix: true })}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(keyword.id)}
                className="rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      <div className="rounded-2xl bg-blue-50/50 p-6 dark:bg-blue-900/10">
        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-3">Keyword Tips</h4>
        <ul className="space-y-2 text-sm text-blue-800/80 dark:text-blue-300/80">
          <li><strong>Recommendations:</strong> &quot;best [category]&quot;, &quot;recommend a [product]&quot;</li>
          <li><strong>Problems:</strong> &quot;how to [solve]&quot;, &quot;help with [issue]&quot;</li>
          <li><strong>Competitors:</strong> Add competitor names to find comparison opportunities</li>
        </ul>
      </div>
    </div>
  )
}
