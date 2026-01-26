'use client'

import { useEffect } from 'react'
import { CheckCircle2, XCircle, Loader2, AlertCircle, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { ImportJob } from '@/types/content-import'

interface ImportProgressProps {
  job: ImportJob
  onRefresh: () => void
  onCancel?: () => void
  onClose: () => void
}

export function ImportProgress({ job, onRefresh, onCancel, onClose }: ImportProgressProps) {
  const { status, progress, errors } = job
  const isActive = status === 'pending' || status === 'processing'
  const isDone = status === 'completed' || status === 'failed' || status === 'cancelled'
  const percentComplete =
    progress.total > 0 ? Math.round((progress.processed / progress.total) * 100) : 0

  // Auto-refresh while active
  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      onRefresh()
    }, 1500) // Poll every 1.5 seconds

    return () => clearInterval(interval)
  }, [isActive, onRefresh])

  return (
    <div className="flex flex-col gap-6">
      {/* Status Header */}
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full',
            status === 'completed' && 'bg-green-100 dark:bg-green-900/30',
            status === 'failed' && 'bg-red-100 dark:bg-red-900/30',
            status === 'cancelled' && 'bg-gray-100 dark:bg-polar-800',
            isActive && 'bg-blue-100 dark:bg-blue-900/30'
          )}
        >
          {status === 'completed' && (
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
          )}
          {status === 'failed' && <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />}
          {status === 'cancelled' && (
            <X className="h-6 w-6 text-gray-500 dark:text-polar-400" />
          )}
          {isActive && (
            <Loader2 className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-spin" />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-lg">
            {status === 'pending' && 'Preparing import...'}
            {status === 'processing' && 'Importing content...'}
            {status === 'completed' && 'Import complete!'}
            {status === 'failed' && 'Import failed'}
            {status === 'cancelled' && 'Import cancelled'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isActive && progress.currentItem && `Processing: ${progress.currentItem}`}
            {status === 'completed' &&
              `Successfully imported ${progress.succeeded} item${progress.succeeded !== 1 ? 's' : ''}`}
            {status === 'failed' && 'An error occurred during import'}
            {status === 'cancelled' && 'Import was cancelled by user'}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-2">
        <Progress value={percentComplete} className="h-2" />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {progress.processed} of {progress.total} processed
          </span>
          <span>{percentComplete}%</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center justify-center rounded-xl bg-muted/30 p-4">
          <FileText className="h-5 w-5 text-muted-foreground mb-1" />
          <span className="text-2xl font-semibold">{progress.total}</span>
          <span className="text-xs text-muted-foreground">Total</span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl bg-green-100/50 dark:bg-green-900/20 p-4">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mb-1" />
          <span className="text-2xl font-semibold text-green-600 dark:text-green-400">
            {progress.succeeded}
          </span>
          <span className="text-xs text-muted-foreground">Succeeded</span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl bg-red-100/50 dark:bg-red-900/20 p-4">
          <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mb-1" />
          <span className="text-2xl font-semibold text-red-600 dark:text-red-400">
            {progress.failed}
          </span>
          <span className="text-xs text-muted-foreground">Failed</span>
        </div>
      </div>

      {/* Errors List */}
      {errors.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span>Errors ({errors.length})</span>
          </div>
          <div className="max-h-32 overflow-y-auto rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10 p-3">
            <ul className="flex flex-col gap-2 text-sm">
              {errors.map((err, idx) => (
                <li key={idx} className="flex flex-col gap-0.5">
                  <span className="font-medium text-red-700 dark:text-red-300">{err.item}</span>
                  <span className="text-red-600 dark:text-red-400 text-xs">{err.error}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
        {isActive && onCancel && (
          <Button variant="outline" onClick={onCancel} className="rounded-full">
            Cancel Import
          </Button>
        )}
        {isDone && (
          <Button onClick={onClose} className="rounded-full">
            Done
          </Button>
        )}
      </div>
    </div>
  )
}

