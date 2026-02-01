'use client';

import Link from 'next/link';
import { Search, HelpCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Badge } from '@workspace/ui/components/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip';
import { cn } from '@workspace/common/lib';
import type { PageAuditDto } from '@workspace/common/lib/shcmea/types/dtos/audit-dto';
import {
  TABLE_COLUMNS,
  PAGE_SIZE_OPTIONS,
  PAGE_STATUS_CONFIG,
  type SortKey,
  type SortDirection,
  type PageStatus,
} from './constants';
import { getScoreBgColor, getScoreTextColor } from './utils';

// ============================================================
// PROPS
// ============================================================
interface AuditPagesTableProps {
  pages: PageAuditDto[];
  projectId: string;
  isRunning: boolean;
  totalPages: number;
  // Search
  searchQuery: string;
  onSearchChange: (query: string) => void;
  // Sorting
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
  // Pagination
  currentPage: number;
  pageSize: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export function AuditPagesTable({
  pages,
  projectId,
  isRunning,
  totalPages,
  searchQuery,
  onSearchChange,
  sortKey,
  sortDirection,
  onSort,
  currentPage,
  pageSize,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  onPageSizeChange,
}: AuditPagesTableProps) {
  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      {/* Card Header */}
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
        <div className="flex w-full flex-col gap-y-2">
          <span className="text-lg font-semibold">Audited Pages</span>
          <p className="text-sm text-muted-foreground">
            {isRunning
              ? 'Pages discovered during the audit. Click column headers to sort.'
              : `${totalItems} pages analyzed. Click column headers to sort.`}
          </p>
        </div>

        {!isRunning && (
          <Link href={`/dashboard/brands/${projectId}/audit/pages`}>
            <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
              View All
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Table Container */}
      <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-border">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {TABLE_COLUMNS.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      'px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider',
                      column.sortable && 'cursor-pointer hover:text-foreground transition-colors select-none',
                      column.key !== 'path' && 'text-center'
                    )}
                    onClick={() => column.sortable && onSort(column.key as SortKey)}
                  >
                    <div className={cn('flex items-center gap-1.5', column.key !== 'path' && 'justify-center')}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="flex items-center gap-1.5">
                            {column.label}
                            <HelpCircle className="h-3 w-3 opacity-50" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p className="text-sm">{column.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                      {column.sortable && sortKey === column.key && (
                        <span className="text-primary">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-4 w-[50px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">
                        {searchQuery ? 'No pages match your search' : 'No pages found'}
                      </p>
                      {searchQuery && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSearchChange('')}
                          className="text-primary"
                        >
                          Clear search
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                pages.map((page) => {
                  const statusConfig = PAGE_STATUS_CONFIG[page.status as PageStatus] || PAGE_STATUS_CONFIG.PENDING;
                  const StatusIcon = statusConfig.icon;

                  return (
                    <tr
                      key={page.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      {/* Page Info */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5 min-w-0 max-w-md">
                          <span className="text-sm font-medium truncate dark:text-white">
                            {page.title || page.path}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {page.path}
                          </span>
                        </div>
                      </td>

                      {/* Overall Score */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          {page.status === 'COMPLETED' && page.overallScore !== null ? (
                            <span
                              className={cn(
                                'inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold min-w-[40px]',
                                getScoreBgColor(page.overallScore),
                                getScoreTextColor(page.overallScore)
                              )}
                            >
                              {page.overallScore}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <Badge className={cn('text-xs capitalize gap-1.5', statusConfig.badgeClassName)}>
                            <StatusIcon className={cn('h-4 w-4', statusConfig.iconClassName)} />
                            {statusConfig.label}
                          </Badge>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/brands/${projectId}/audit/pages/${page.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col gap-4 px-6 py-4 border-t border-border bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {totalItems > 0 ? startIndex + 1 : 0}–{endIndex} of {totalItems} page{totalItems !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="hidden sm:inline">Show</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => onPageSizeChange(Number(value))}
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
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="h-8 px-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <span className="px-2 text-sm text-muted-foreground">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 px-2"
                >
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

