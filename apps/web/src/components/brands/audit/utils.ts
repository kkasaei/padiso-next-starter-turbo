/**
 * Audit Module Utilities
 *
 * Helper functions for the technical audit feature
 */

import type { PageAuditDto } from '@workspace/common/lib/shcmea/types/dtos/audit-dto';
import type { SortKey, SortDirection } from './constants';

// ============================================================
// SCORE HELPERS
// ============================================================
export function getScoreColor(score: number | null): string {
  if (score === null) return '#9CA3AF';
  if (score >= 80) return '#22C55E';
  if (score >= 60) return '#EAB308';
  if (score >= 40) return '#F97316';
  return '#EF4444';
}

export function getScoreTextColor(score: number | null): string {
  if (score === null) return 'text-gray-400';
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
  if (score >= 40) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

export function getScoreBgColor(score: number | null): string {
  if (score === null) return 'bg-gray-100 dark:bg-gray-800';
  if (score >= 80) return 'bg-green-100 dark:bg-green-900/30';
  if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30';
  if (score >= 40) return 'bg-orange-100 dark:bg-orange-900/30';
  return 'bg-red-100 dark:bg-red-900/30';
}

// ============================================================
// SORTING
// ============================================================
export function sortPages(
  pages: PageAuditDto[],
  sortKey: SortKey,
  sortDirection: SortDirection
): PageAuditDto[] {
  return [...pages].sort((a, b) => {
    let comparison = 0;
    switch (sortKey) {
      case 'path':
        comparison = (a.title || a.path).localeCompare(b.title || b.path);
        break;
      case 'overallScore':
        comparison = (a.overallScore ?? -1) - (b.overallScore ?? -1);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });
}

// ============================================================
// FILTERING
// ============================================================
export function filterPagesBySearch(
  pages: PageAuditDto[],
  searchQuery: string
): PageAuditDto[] {
  if (!searchQuery.trim()) return pages;

  const query = searchQuery.toLowerCase();
  return pages.filter((page) => (
    page.url.toLowerCase().includes(query) ||
    page.path.toLowerCase().includes(query) ||
    (page.title?.toLowerCase().includes(query) ?? false)
  ));
}

// ============================================================
// PAGINATION
// ============================================================
export interface PaginationResult<T> {
  paginatedItems: T[];
  totalItems: number;
  totalPages: number;
  validCurrentPage: number;
  startIndex: number;
  endIndex: number;
}

export function paginateItems<T>(
  items: T[],
  currentPage: number,
  pageSize: number
): PaginationResult<T> {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    paginatedItems,
    totalItems,
    totalPages,
    validCurrentPage,
    startIndex,
    endIndex,
  };
}

export function getPageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisiblePages: number = 5
): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = [];

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('ellipsis');

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push('ellipsis');
    if (!pages.includes(totalPages)) pages.push(totalPages);
  }

  return pages;
}

// ============================================================
// PAGE STATISTICS
// ============================================================
export interface PageStats {
  completed: number;
  analyzing: number;
  pending: number;
  failed: number;
}

export function calculatePageStats(pages: PageAuditDto[]): PageStats {
  return {
    completed: pages.filter(p => p.status === 'COMPLETED').length,
    analyzing: pages.filter(p => p.status === 'ANALYZING' || p.status === 'FETCHING').length,
    pending: pages.filter(p => p.status === 'PENDING').length,
    failed: pages.filter(p => p.status === 'FAILED').length,
  };
}

