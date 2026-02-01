'use client'

import { useState } from 'react'
import { Sparkles, FileText, Clock, TrendingUp, TrendingDown, User, Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { TabsContent } from '@workspace/ui/components/tabs'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@workspace/ui/components/select'
import { ACTIVITY_TYPE_LABELS } from '@/lib/common/constants'

import type { Activity } from '../types'
import { PAGE_SIZE_OPTIONS } from '../utils'

interface ActivitiesTabProps {
  projectId: string
}

export function ActivitiesTab({ projectId: _projectId }: ActivitiesTabProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // TODO: Replace with actual data fetching when API is ready
  const [activities] = useState<Activity[]>([])
  const [totalItems] = useState(0)
  const [isLoading] = useState(false)

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const validCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (validCurrentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'PROJECT_CREATED':
        return <Sparkles className="h-4 w-4 text-green-500" />
      case 'PROJECT_UPDATED':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'PROJECT_DELETED':
        return <Clock className="h-4 w-4 text-red-500" />
      case 'PROJECT_FAVORITED':
        return <TrendingUp className="h-4 w-4 text-yellow-500" />
      case 'PROJECT_UNFAVORITED':
        return <TrendingDown className="h-4 w-4 text-gray-500 dark:text-polar-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500 dark:text-polar-500" />
    }
  }

  const formatMetadata = (activity: Activity) => {
    if (!activity.metadata || Object.keys(activity.metadata).length === 0) {
      return null
    }
    if (activity.metadata.field) {
      return (
        <span className="text-muted-foreground">
          Changed <span className="font-medium text-foreground">{activity.metadata.field}</span>
          {activity.metadata.from && (
            <>
              {' from '}<span className="font-medium text-foreground">&quot;{activity.metadata.from || 'empty'}&quot;</span>
            </>
          )}
          {activity.metadata.to && (
            <>
              {' to '}<span className="font-medium text-foreground">&quot;{activity.metadata.to}&quot;</span>
            </>
          )}
        </span>
      )
    }
    return null
  }

  return (
    <TabsContent value="activities" className="space-y-8">
      <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
          <div className="flex w-full flex-col gap-y-2">
            <span className="text-lg font-semibold">Activity Log</span>
            <p className="text-sm text-muted-foreground">
              Audit trail of all changes made to this project.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 text-muted-foreground/50 animate-spin" />
                        <p className="text-sm text-muted-foreground">Loading activities...</p>
                      </div>
                    </td>
                  </tr>
                ) : activities.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Clock className="h-8 w-8 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">No activity recorded yet</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  activities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm">
                            {new Date(activity.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(activity.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getActivityIcon(activity.type)}
                          <span className="text-sm font-medium">{ACTIVITY_TYPE_LABELS[activity.type]}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                          <span className="text-sm">{activity.performedByUserId || 'System'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm">
                          {formatMetadata(activity) || <span className="text-muted-foreground">—</span>}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 px-6 py-4 border-t border-border bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {totalItems > 0 ? startIndex + 1 : 0}–{endIndex} of {totalItems} activities
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
