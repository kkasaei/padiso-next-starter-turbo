/**
 * Audit Module Constants
 *
 * Configuration and constants for the website audit feature
 */

import {
  CheckCircle,
  Loader2,
  Clock,
  XCircle,
  Square,
} from 'lucide-react';

// ============================================================
// POLLING
// ============================================================
export const POLL_INTERVAL = 3000; // Poll every 3 seconds while running

// ============================================================
// PAGINATION
// ============================================================
export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;
export const DEFAULT_PAGE_SIZE = 10;

// ============================================================
// AUDIT STATUS CONFIGURATION
// ============================================================
export type AuditStatus = 'PENDING' | 'CRAWLING' | 'ANALYZING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export const AUDIT_STATUS_CONFIG: Record<AuditStatus, {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}> = {
  COMPLETED: { label: 'Completed', variant: 'default', className: 'bg-green-500' },
  ANALYZING: { label: 'Analyzing', variant: 'default', className: 'bg-blue-500' },
  CRAWLING: { label: 'Discovering Pages', variant: 'default', className: 'bg-purple-500' },
  PENDING: { label: 'Pending', variant: 'secondary' },
  FAILED: { label: 'Failed', variant: 'destructive' },
  CANCELLED: { label: 'Cancelled', variant: 'outline', className: 'border-orange-500 text-orange-600 dark:text-orange-400' },
};

// ============================================================
// PAGE STATUS CONFIGURATION
// ============================================================
export type PageStatus = 'PENDING' | 'FETCHING' | 'ANALYZING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export const PAGE_STATUS_CONFIG: Record<PageStatus, {
  icon: typeof CheckCircle;
  label: string;
  iconClassName: string;
  badgeClassName: string;
}> = {
  COMPLETED: {
    icon: CheckCircle,
    label: 'Completed',
    iconClassName: 'text-green-500',
    badgeClassName: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  ANALYZING: {
    icon: Loader2,
    label: 'Analyzing',
    iconClassName: 'animate-spin text-blue-500',
    badgeClassName: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  FETCHING: {
    icon: Loader2,
    label: 'Fetching',
    iconClassName: 'animate-spin text-purple-500',
    badgeClassName: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  PENDING: {
    icon: Clock,
    label: 'Pending',
    iconClassName: 'text-gray-400',
    badgeClassName: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  },
  FAILED: {
    icon: XCircle,
    label: 'Failed',
    iconClassName: 'text-red-500',
    badgeClassName: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  CANCELLED: {
    icon: Square,
    label: 'Cancelled',
    iconClassName: 'text-orange-500',
    badgeClassName: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
};

// ============================================================
// TABLE COLUMNS
// ============================================================
export const TABLE_COLUMNS = [
  { key: 'path', label: 'Page', sortable: true, tooltip: 'Page URL path and title' },
  { key: 'overallScore', label: 'Score', sortable: true, tooltip: 'Overall audit score for this page' },
  { key: 'status', label: 'Status', sortable: true, tooltip: 'Current analysis status' },
] as const;

export type SortKey = typeof TABLE_COLUMNS[number]['key'];
export type SortDirection = 'asc' | 'desc';

// ============================================================
// INTRO SECTION FEATURES
// ============================================================
export const AUDIT_FEATURES = [
  {
    id: 'seo',
    title: 'SEO Analysis',
    description: 'Title tags, meta descriptions, H1-H6 headings, canonical URLs, and more',
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    id: 'aeo',
    title: 'AEO Readiness',
    description: 'Structured data, content clarity, answerability for AI engines',
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  {
    id: 'links',
    title: 'Link Analysis',
    description: 'Internal and external links, broken links, nofollow tags',
    iconColor: 'text-teal-500',
    bgColor: 'bg-teal-100 dark:bg-teal-900/30',
  },
  {
    id: 'images',
    title: 'Image Optimization',
    description: 'Alt text, lazy loading, image dimensions',
    iconColor: 'text-orange-500',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
  {
    id: 'quickwins',
    title: 'Quick Wins',
    description: 'Prioritized list of easy fixes for immediate impact',
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
] as const;

