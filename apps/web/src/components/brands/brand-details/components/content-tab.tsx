'use client'

import { useState } from 'react'
import { Search, FileText, ChevronRight, Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { Input } from '@workspace/ui/components/input'
import { TabsContent } from '@workspace/ui/components/tabs'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@workspace/ui/components/select'
import { cn } from '@workspace/ui/lib/utils'
import { CONTENT_STATUS_CONFIG } from '@workspace/common/constants'

import type { ContentItem } from '../types'
import { PAGE_SIZE_OPTIONS } from '../utils'

interface ContentTabProps {
  projectId: string
}

export function ContentTab({ projectId: _projectId }: ContentTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // TODO: Replace with actual data fetching when API is ready
  const [content] = useState<ContentItem[]>([])
  const [totalItems] = useState(0)
  const [isLoading] = useState(false)

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const validCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (validCurrentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)

  return (
    <TabsContent value="content" className="space-y-8">
      <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
          <div className="flex w-full flex-col gap-y-2">
            <span className="text-lg font-semibold">Content Drafts</span>
            <p className="text-sm text-muted-foreground">
              All content pieces for this project. Click to edit or view details.
            </p>
          </div>

          <div className="flex shrink-0 flex-row items-center gap-2">
            {(['all', 'DRAFT', 'REVIEW', 'PUBLISHED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => { setStatusFilter(status); setCurrentPage(1) }}
                className={cn(
                  'flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all',
                  statusFilter === status
                    ? 'bg-card shadow-sm ring-1 ring-border'
                    : 'opacity-50 hover:opacity-75'
                )}
              >
                <span>{status === 'all' ? 'All' : CONTENT_STATUS_CONFIG[status]?.label}</span>
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
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                className="pl-9 h-9"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Updated</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 text-muted-foreground/50 animate-spin" />
                        <p className="text-sm text-muted-foreground">Loading content...</p>
                      </div>
                    </td>
                  </tr>
                ) : content.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-8 w-8 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">
                          {searchQuery || statusFilter !== 'all' ? 'No content matches your filters' : 'No content drafts yet'}
                        </p>
                        {(searchQuery || statusFilter !== 'all') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setSearchQuery(''); setStatusFilter('all') }}
                            className="text-primary"
                          >
                            Clear filters
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  content.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                            <FileText className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium">{item.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={cn("text-xs", CONTENT_STATUS_CONFIG[item.status]?.bgColor, CONTENT_STATUS_CONFIG[item.status]?.color)}>
                          {CONTENT_STATUS_CONFIG[item.status]?.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-muted-foreground">
                          {new Date(item.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 px-6 py-4 border-t border-border bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {totalItems > 0 ? startIndex + 1 : 0}–{endIndex} of {totalItems} items
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
