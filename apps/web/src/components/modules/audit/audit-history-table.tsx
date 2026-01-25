'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  ArrowLeft,
} from 'lucide-react';
import { Input } from '@workspace/ui/components/input';
import { Button } from '@workspace/ui/components/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { cn } from '@/lib/utils';

// ============================================================
// TYPES
// ============================================================
export interface AuditHistoryEntry {
  id: string;
  startedAt: string;
  completedAt: string | null;
  status: 'COMPLETED' | 'CANCELLED' | 'FAILED' | 'PENDING' | 'CRAWLING' | 'ANALYZING';
  pagesScanned: number;
  criticalIssues: number;
  warnings: number;
  duration: number | null; // in seconds
}

interface AuditHistoryTableProps {
  history: AuditHistoryEntry[];
}

// ============================================================
// CONSTANTS
// ============================================================
const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

const STATUS_CONFIG = {
  COMPLETED: {
    label: 'Completed',
    icon: CheckCircle,
    className: 'text-green-600 dark:text-green-400',
    bgClassName: 'bg-green-100 dark:bg-green-900/30',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: XCircle,
    className: 'text-gray-500 dark:text-gray-400',
    bgClassName: 'bg-gray-100 dark:bg-gray-800',
  },
  FAILED: {
    label: 'Failed',
    icon: AlertTriangle,
    className: 'text-red-600 dark:text-red-400',
    bgClassName: 'bg-red-100 dark:bg-red-900/30',
  },
  PENDING: {
    label: 'Pending',
    icon: Clock,
    className: 'text-yellow-600 dark:text-yellow-400',
    bgClassName: 'bg-yellow-100 dark:bg-yellow-900/30',
  },
  CRAWLING: {
    label: 'Crawling',
    icon: Clock,
    className: 'text-blue-600 dark:text-blue-400',
    bgClassName: 'bg-blue-100 dark:bg-blue-900/30',
  },
  ANALYZING: {
    label: 'Analyzing',
    icon: Clock,
    className: 'text-blue-600 dark:text-blue-400',
    bgClassName: 'bg-blue-100 dark:bg-blue-900/30',
  },
} as const;

// ============================================================
// HELPER FUNCTIONS
// ============================================================
function formatDuration(seconds: number | null): string {
  if (seconds === null) return '-';
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export function AuditHistoryTable({ history }: AuditHistoryTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Filter by search query (search in date)
  const filteredHistory = history.filter((entry) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const dateStr = format(new Date(entry.startedAt), 'MMM d, yyyy HH:mm').toLowerCase();
    return dateStr.includes(query) || entry.status.toLowerCase().includes(query);
  });

  // Pagination calculations
  const totalItems = filteredHistory.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedHistory = filteredHistory.slice(startIndex, endIndex);

  // Handlers
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Page numbers helper
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (validCurrentPage > 3) pages.push('ellipsis');

      const start = Math.max(2, validCurrentPage - 1);
      const end = Math.min(totalPages - 1, validCurrentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (validCurrentPage < totalPages - 2) pages.push('ellipsis');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      {/* Header Section */}
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
        <div className="flex w-full flex-col gap-y-2">
          <span className="text-lg font-semibold">Audit History</span>
          <p className="text-sm text-muted-foreground">
            Log of all previous website audits
          </p>
        </div>
      </div>

      {/* Table - White card inside */}
      <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-border">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by date or status..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Pages Scanned
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Critical
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Warnings
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">
                        {searchQuery ? 'No results match your search' : 'No audit history found'}
                      </p>
                      {searchQuery && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSearchQuery('')}
                          className="text-primary"
                        >
                          Clear search
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedHistory.map((entry) => {
                  const statusConfig = STATUS_CONFIG[entry.status];
                  const StatusIcon = statusConfig.icon;

                  return (
                    <tr key={entry.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {format(new Date(entry.startedAt), 'MMM d, yyyy')}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(entry.startedAt), 'HH:mm')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={cn(
                          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                          statusConfig.bgClassName,
                          statusConfig.className
                        )}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {statusConfig.label}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {entry.pagesScanned}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {entry.criticalIssues > 0 ? (
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-red-600 dark:text-red-400">
                            {entry.criticalIssues}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">0</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {entry.warnings > 0 ? (
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-yellow-600 dark:text-yellow-400">
                            {entry.warnings}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">0</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {formatDuration(entry.duration)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalItems > 0 && (
          <div className="flex flex-col gap-4 px-6 py-4 border-t border-border bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
            {/* Results info */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                Showing {startIndex + 1}–{endIndex} of {totalItems} audit{totalItems !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Pagination controls and page size */}
            <div className="flex items-center gap-4">
              {/* Page size selector */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="hidden sm:inline">Show</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => handlePageSizeChange(Number(value))}
                >
                  <SelectTrigger className="w-[70px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="hidden sm:inline">per page</span>
              </div>

              {/* Page navigation */}
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={validCurrentPage === 1}
                    className="h-8 px-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>

                  {getPageNumbers().map((page, index) =>
                    page === 'ellipsis' ? (
                      <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                        ...
                      </span>
                    ) : (
                      <Button
                        key={page}
                        variant={validCurrentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="h-8 w-8 p-0"
                      >
                        {page}
                      </Button>
                    )
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={validCurrentPage === totalPages}
                    className="h-8 px-2"
                  >
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

