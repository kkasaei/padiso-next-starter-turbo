'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { RefreshCw, Square, Loader2 } from 'lucide-react';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Button } from '@workspace/ui/components/button';

import {
  AuditIntroSection,
  AuditProgressSection,
  AuditMetricsGrid,
  AuditHistoryTable,
  calculatePageStats,
  type AuditHistoryEntry,
} from '@/components/modules/audit';

import { useActiveOrganization } from '@/hooks/use-active-organization';

import type { WebsiteAuditDto, PageAuditDto } from '@/lib/shcmea/types/dtos/audit-dto';

// ============================================================
// MOCK DATA
// ============================================================
const createMockAudit = (projectId: string): WebsiteAuditDto => ({
  id: `audit-${Date.now()}`,
  projectId,
  sitemapUrl: null,
  maxPagesToScan: 100,
  status: 'COMPLETED',
  startedAt: new Date(Date.now() - 3600000).toISOString(),
  completedAt: new Date(Date.now() - 3000000).toISOString(),
  overallScore: 78,
  seoScore: 82,
  performanceScore: 74,
  accessibilityScore: 85,
  contentScore: 71,
  criticalIssues: 3,
  warningIssues: 12,
  infoIssues: 8,
  totalPages: 50,
  pagesDiscovered: 50,
  pagesScanned: 47,
  pagesFailed: 3,
  pagesQueued: 0,
  totalLinks: 234,
  brokenLinks: 5,
  totalAssets: 128,
  assetsWithIssues: 12,
  totalCost: null,
  createdAt: new Date(Date.now() - 3600000).toISOString(),
  updatedAt: new Date(Date.now() - 3000000).toISOString(),
});

const createMockPages = (): PageAuditDto[] => [
  {
    id: 'page-1',
    auditId: 'audit-1',
    url: 'https://example.com/',
    path: '/',
    title: 'Home Page',
    discoveredAt: new Date().toISOString(),
    discoveredFrom: 'sitemap',
    depth: 0,
    overallScore: 85,
    seoScore: 88,
    aeoScore: 72,
    contentScore: 80,
    technicalScore: 90,
    metadata: null,
    analysis: null,
    issues: [],
    content: null,
    status: 'COMPLETED',
    error: null,
    scannedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'page-2',
    auditId: 'audit-1',
    url: 'https://example.com/about',
    path: '/about',
    title: 'About Us',
    discoveredAt: new Date().toISOString(),
    discoveredFrom: 'crawl',
    depth: 1,
    overallScore: 72,
    seoScore: 75,
    aeoScore: 68,
    contentScore: 70,
    technicalScore: 78,
    metadata: null,
    analysis: null,
    issues: [],
    content: null,
    status: 'COMPLETED',
    error: null,
    scannedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

const createMockHistory = (projectId: string): WebsiteAuditDto[] => [
  createMockAudit(projectId),
  {
    ...createMockAudit(projectId),
    id: `audit-${Date.now() - 86400000}`,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    startedAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: new Date(Date.now() - 86100000).toISOString(),
    updatedAt: new Date(Date.now() - 86100000).toISOString(),
    overallScore: 72,
  },
];

// ============================================================
// HELPER: Transform WebsiteAuditDto to AuditHistoryEntry
// ============================================================
function toHistoryEntry(audit: WebsiteAuditDto): AuditHistoryEntry {
  const startedAt = audit.startedAt || audit.createdAt;
  const completedAt = audit.completedAt || null;
  
  // Calculate duration in seconds
  let duration: number | null = null;
  if (startedAt && completedAt) {
    duration = Math.floor(
      (new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 1000
    );
  }

  return {
    id: audit.id,
    startedAt,
    completedAt,
    status: audit.status as AuditHistoryEntry['status'],
    pagesScanned: audit.pagesScanned,
    criticalIssues: audit.criticalIssues,
    warnings: audit.warningIssues,
    duration,
  };
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function AuditPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const organization = useActiveOrganization();

  // ============================================================
  // DATA STATE
  // ============================================================
  const [audit, setAudit] = useState<WebsiteAuditDto | null>(null);
  const [pages, setPages] = useState<PageAuditDto[]>([]);
  const [auditHistory, setAuditHistory] = useState<WebsiteAuditDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Polling ref for live updates
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  // ============================================================
  // MOCK DATA LOADING FUNCTIONS
  // ============================================================
  const loadAuditData = useCallback(() => {
    // TODO: Replace with actual API call
    setTimeout(() => {
      setAudit(createMockAudit(projectId));
      setPages(createMockPages());
      setAuditHistory(createMockHistory(projectId));
      setIsLoading(false);
    }, 500);
  }, [projectId]);

  // ============================================================
  // POLLING FOR LIVE UPDATES
  // ============================================================
  const startPolling = useCallback(() => {
    if (pollInterval) return;

    const interval = setInterval(() => {
      // TODO: Replace with actual polling logic
      console.log('Polling for audit updates...');
    }, 3000);

    setPollInterval(interval);
  }, [pollInterval]);

  const stopPolling = useCallback(() => {
    if (pollInterval) {
      clearInterval(pollInterval);
      setPollInterval(null);
    }
  }, [pollInterval]);

  // Stop polling when audit completes
  useEffect(() => {
    if (audit && !isRunning(audit.status)) {
      stopPolling();
    }
  }, [audit, stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [pollInterval]);

  // ============================================================
  // INITIAL DATA LOADING
  // ============================================================
  useEffect(() => {
    setIsLoading(true);
    loadAuditData();
  }, [projectId, organization.id, loadAuditData]);

  // Start polling if audit is running
  useEffect(() => {
    if (audit && isRunning(audit.status)) {
      startPolling();
    }
  }, [audit, startPolling]);

  // ============================================================
  // DERIVED STATE
  // ============================================================
  const pageStats = calculatePageStats(pages);
  const isAuditRunning = audit && isRunning(audit.status);

  // ============================================================
  // HANDLERS
  // ============================================================
  const handleRunAudit = useCallback(() => {
    setIsStarting(true);
    // TODO: Replace with actual API call
    toast.info('Starting audit...');
    setTimeout(() => {
      const newAudit: WebsiteAuditDto = {
        ...createMockAudit(projectId),
        status: 'SCANNING',
      };
      setAudit(newAudit);
      setIsStarting(false);
      toast.success('Audit started!');
      startPolling();
    }, 1000);
  }, [projectId, startPolling]);

  const handleCancelAudit = useCallback(() => {
    if (!audit) return;
    setIsCancelling(true);
    // TODO: Replace with actual API call
    toast.info('Cancelling audit...');
    setTimeout(() => {
      setAudit((prev) => prev ? { ...prev, status: 'CANCELLED' } : null);
      setIsCancelling(false);
      toast.success('Audit cancelled');
      stopPolling();
    }, 500);
  }, [audit, stopPolling]);

  // ============================================================
  // RENDER: Loading State
  // ============================================================
  if (isLoading) {
    return (
      <div className="relative flex h-full w-full min-w-0 flex-col overflow-y-auto rounded-2xl border-gray-200 dark:border-polar-800 px-4 py-6 md:border md:bg-white dark:md:bg-polar-900 md:px-8 md:shadow-xs">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-24" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER: No Audit State (Introduction)
  // ============================================================
  if (!audit) {
    return (
      <AuditIntroSection
        onRunAudit={handleRunAudit}
        isStarting={isStarting}
      />
    );
  }

  // ============================================================
  // RENDER: Main Content (Audit with Pages)
  // ============================================================
  return (
    <div className="relative flex h-full w-full min-w-0 flex-col overflow-y-auto rounded-2xl border-gray-200 dark:border-polar-800 px-4 py-6 md:border md:bg-white dark:md:bg-polar-900 md:px-8 md:shadow-xs">
      <div className="container mx-auto flex w-full flex-col gap-y-8 pb-16">
        {/* Page Header */}
        <header className="flex flex-col gap-y-4 md:flex-row md:items-center md:justify-between md:gap-x-4">
          <h1 className="text-2xl font-semibold">Website Audit</h1>
          <div className="flex gap-2">
            {isAuditRunning ? (
              <Button
                onClick={handleCancelAudit}
                disabled={isCancelling}
                variant="destructive"
                size="sm"
                className="gap-2"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <Square className="h-4 w-4" />
                    Cancel Audit
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleRunAudit}
                disabled={isStarting}
                size="sm"
                className="gap-2"
              >
                {isStarting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Re-run Audit
                  </>
                )}
              </Button>
            )}
          </div>
        </header>

        {/* Progress Section */}
        <AuditProgressSection
          audit={audit}
          pageStats={pageStats}
          hasPages={pages.length > 0}
        />

        {/* Metrics Grid - Always visible */}
        <AuditMetricsGrid
          audit={audit}
          pages={pages}
          projectId={projectId}
        />

        {/* Audit History Table */}
        <AuditHistoryTable history={auditHistory.map(toHistoryEntry)} />
      </div>
    </div>
  );
}

// ============================================================
// HELPER FUNCTION
// ============================================================
function isRunning(status: string): boolean {
  return ['PENDING', 'DISCOVERING', 'SCANNING'].includes(status);
}
