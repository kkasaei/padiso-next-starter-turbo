'use client';

import * as React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { ReportSkeleton } from '@/components/marketing/aeo-grader/report-skeleton';
import { StickyBottomBar } from '@/components/marketing/aeo-grader/sticky-bottom-bar';
import { ExitIntentModal } from '@/components/marketing/aeo-grader/exit-intent-modal';
import { ShareModal } from '@/components/marketing/aeo-grader/share-modal';
import { UnlockReportModal } from '@/components/marketing/aeo-grader/unlock-report-modal';
import {
  ReportNotFound,
  ReportHeader,
  ReportHeroSection,
  ReportHeroBanner,
  ReportShareCard,
  ReportContentSections
} from '@/components/marketing/public-report/report';
import { useReportData } from '@workspace/ui/hooks/use-report-data';
import { useReportSharing } from '@workspace/ui/hooks/use-report-sharing';
import { usePDFDownload } from '@workspace/ui/hooks/use-pdf-download';
import { calculateAverageScore, generateReportUrl, formatDomain } from '@/lib/report-utils';
import { REPORT_CONFIG } from '@/lib/common/constants';
import { trpc } from '@/lib/trpc/client';

/**
 * Report Page Component
 *
 * Displays comprehensive AEO (Answer Engine Optimization) report for a domain.
 *
 * Architecture:
 * - Custom hooks for data fetching and state management
 * - Modular components for each section
 * - Utility functions for calculations
 * - Constants for configuration
 *
 * @see useReportData - Handles report data fetching and validation
 * @see useReportSharing - Manages sharing functionality
 */
export default function ReportPage(): React.JSX.Element {
  const params = useParams();
  const searchParams = useSearchParams();
  const domain = params.domain as string;
  const vertical = searchParams.get('vertical') || undefined;

  // Data fetching hook - passes vertical for industry context
  const { data, isLoading, isNotFound } = useReportData({ domain, vertical });

  // Sharing functionality hook
  const { isShareModalOpen, openShareModal, closeShareModal } = useReportSharing();

  // Unlock state management
  const [isUnlocked, setIsUnlocked] = React.useState(false);
  const [unlockModalOpen, setUnlockModalOpen] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState<string | undefined>();

  // PDF download hook with caching and polling
  const { downloadPDF, isLoading: isPDFLoading } = usePDFDownload({
    domain,
    userEmail,
  });

  // Generate URLs and format data
  const currentUrl = generateReportUrl(domain);
  const formattedDomain = formatDomain(domain);

  // Check unlock status on mount using tRPC
  const { data: unlockStatus } = trpc.publicReport.checkUnlockStatus.useQuery(
    { domain },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  React.useEffect(() => {
    if (unlockStatus) {
      setIsUnlocked(unlockStatus.unlocked);
      if (unlockStatus.unlocked && 'email' in unlockStatus && unlockStatus.email) {
        setUserEmail(unlockStatus.email);
      }
    }
  }, [unlockStatus]);

  // Handle download attempt
  const handleDownloadAttempt = React.useCallback(() => {
    if (!isUnlocked) {
      // User hasn't unlocked - show modal
      setUnlockModalOpen(true);
    } else {
      // User has unlocked - proceed with download
      downloadPDF();
    }
  }, [isUnlocked, downloadPDF]);

  // tRPC utils for manual refetch
  const utils = trpc.useUtils();

  // Handle successful unlock from PDF download button
  const handleUnlockSuccess = React.useCallback(async () => {
    // Re-check unlock status to get user email
    const result = await utils.publicReport.checkUnlockStatus.fetch({ domain });
    if (result.unlocked && 'email' in result && result.email) {
      setIsUnlocked(true);
      setUserEmail(result.email);

      // Trigger download after unlock (with slight delay to ensure state is updated)
      setTimeout(() => {
        downloadPDF();
      }, 300);
    }
  }, [domain, downloadPDF, utils]);

  // Handle successful unlock from overlay (viewing content)
  const handleOverlayUnlockSuccess = React.useCallback(async () => {
    // Re-check unlock status to get user email
    const result = await utils.publicReport.checkUnlockStatus.fetch({ domain });
    if (result.unlocked && 'email' in result && result.email) {
      setIsUnlocked(true);
      setUserEmail(result.email);
      toast.success('Report unlocked! PDF generation started automatically.');

      // Automatically start PDF generation (don't make user wait)
      setTimeout(() => {
        downloadPDF();
      }, 500);
    }
  }, [domain, downloadPDF, utils]);

  // Show skeleton while loading
  if (isLoading) {
    return <ReportSkeleton domain={domain} />;
  }

  // Show not found state
  if (!data || isNotFound) {
    return <ReportNotFound domain={formattedDomain} />;
  }

  // Calculate metrics
  const averageScore = calculateAverageScore(data.llmProviders as unknown as Array<{ score: number; [key: string]: unknown }>);

  return (
      <div className="min-h-screen bg-background">
      {/* Hero Banner with Header */}
      <ReportHeroBanner>
        <ReportHeader
          domain={formattedDomain}
        />
        <ReportHeroSection
          domain={domain}
          data={data}
          averageScore={averageScore}
          onShare={openShareModal}
          onDownload={handleDownloadAttempt}
          isDownloading={isPDFLoading}
          isUnlocked={isUnlocked}
        />
      </ReportHeroBanner>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-16">
          <ReportContentSections
            data={data}
            domain={formattedDomain}
            isUnlocked={isUnlocked}
            onUnlockSuccess={handleOverlayUnlockSuccess}
          />

          {/* Share Results Card */}
          <ReportShareCard
            averageScore={averageScore}
            onShare={openShareModal}
          />
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <StickyBottomBar
        userScore={25}
        topCompetitorScore={65}
        triggerScrollDepth={REPORT_CONFIG.STICKY_BAR_TRIGGER_DEPTH}
      />

      {/* Exit Intent Modal */}
      <ExitIntentModal />

      {/* Share Modal */}
      <ShareModal
        open={isShareModalOpen}
        onOpenChange={closeShareModal}
        url={currentUrl}
        domain={formattedDomain}
        score={averageScore}
      />

      {/* Unlock Report Modal - shown when user tries to download without unlocking */}
      <UnlockReportModal
        open={unlockModalOpen}
        onOpenChange={setUnlockModalOpen}
        onSuccess={handleUnlockSuccess}
        domain={domain}
        downloadIntent={true}
      />
    </div>
  );
}
