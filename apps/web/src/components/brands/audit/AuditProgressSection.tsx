'use client';

import { format } from 'date-fns';
import { Loader2, CheckCircle, Clock, XCircle } from 'lucide-react';
import type { WebsiteAuditDto } from '@/lib/shcmea/types/dtos/audit-dto';
import type { PageStats } from './utils';

// ============================================================
// PROPS
// ============================================================
interface AuditProgressSectionProps {
  audit: WebsiteAuditDto;
  pageStats: PageStats;
  hasPages: boolean;
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export function AuditProgressSection({
  audit,
  pageStats,
  hasPages,
}: AuditProgressSectionProps) {
  const isRunning = audit.status === 'PENDING' || audit.status === 'DISCOVERING' || audit.status === 'SCANNING';
  const isCompleted = audit.status === 'COMPLETED';
  const isCancelled = audit.status === 'CANCELLED';
  const isFailed = audit.status === 'FAILED';

  const progress = audit.totalPages && audit.totalPages > 0
    ? ((audit.pagesScanned || 0) / audit.totalPages) * 100
    : isCompleted ? 100 : 0;

  // Format timestamp
  const getTimestamp = () => {
    if (isCompleted && audit.completedAt) {
      return `Completed ${format(new Date(audit.completedAt), 'MMM d, yyyy \'at\' h:mm a')}`;
    }
    if (isCancelled && audit.startedAt) {
      return `Cancelled ${format(new Date(audit.startedAt), 'MMM d, yyyy \'at\' h:mm a')}`;
    }
    if (isFailed && audit.startedAt) {
      return `Failed ${format(new Date(audit.startedAt), 'MMM d, yyyy \'at\' h:mm a')}`;
    }
    if (audit.startedAt) {
      return `Started ${format(new Date(audit.startedAt), 'MMM d, yyyy \'at\' h:mm a')}`;
    }
    return null;
  };

  // Determine status label based on status
  const getStatusLabel = () => {
    if (isCompleted) return 'Completed';
    if (isCancelled) return 'Cancelled';
    if (isFailed) return 'Failed';
    if (audit.status === 'DISCOVERING') return 'Discovering pages...';
    if (audit.status === 'SCANNING') return 'Scanning pages...';
    return 'Pending';
  };

  const statusLabel = getStatusLabel();
  const timestamp = getTimestamp();

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      {/* Card Header */}
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
        <div className="flex w-full flex-col gap-y-2">
          <div className="flex items-center gap-3">
            <div className={`rounded-xl p-2.5 ${
              isCompleted 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : isCancelled || isFailed
                  ? 'bg-gray-100 dark:bg-gray-800'
                  : 'bg-blue-100 dark:bg-blue-900/30'
            }`}>
              {isRunning ? (
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              ) : isCompleted ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : isCancelled ? (
                <XCircle className="h-5 w-5 text-gray-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">Latest Audit</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  isCompleted 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                    : isCancelled
                      ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      : isFailed
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                }`}>
                  {statusLabel}
                </span>
              </div>
              {timestamp && (
                <p className="text-sm text-muted-foreground">{timestamp}</p>
              )}
            </div>
          </div>
        </div>

        {/* Progress Counter */}
        <div className="flex shrink-0 items-center">
          <div className="text-right">
            <div className="text-2xl font-semibold tabular-nums">
              {audit.pagesScanned || 0}
              <span className="text-muted-foreground font-normal"> / {audit.totalPages || 0}</span>
            </div>
            <p className="text-xs text-muted-foreground">pages scanned</p>
          </div>
        </div>
      </div>

      {/* Progress Content */}
      <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Progress bar */}
          <div className="space-y-3">
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  isCompleted 
                    ? 'bg-gradient-to-r from-green-500 to-green-600' 
                    : isCancelled || isFailed
                      ? 'bg-gradient-to-r from-gray-400 to-gray-500'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Page status summary - only show during running state */}
          {isRunning && hasPages && (
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1.5">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  {pageStats.completed} completed
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1.5">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {pageStats.analyzing} analyzing
                </span>
              </div>
              {pageStats.pending > 0 && (
                <div className="flex items-center gap-2 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1.5">
                  <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {pageStats.pending} waiting
                  </span>
                </div>
              )}
              {pageStats.failed > 0 && (
                <div className="flex items-center gap-2 rounded-full bg-red-100 dark:bg-red-900/30 px-3 py-1.5">
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">
                    {pageStats.failed} failed
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Show failed count if audit finished with failures */}
          {!isRunning && pageStats.failed > 0 && (
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full bg-red-100 dark:bg-red-900/30 px-3 py-1.5">
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-red-700 dark:text-red-300">
                  {pageStats.failed} failed
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
