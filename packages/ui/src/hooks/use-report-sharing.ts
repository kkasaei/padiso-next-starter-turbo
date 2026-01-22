import * as React from 'react';

interface UseReportSharingReturn {
  isShareModalOpen: boolean;
  openShareModal: () => void;
  closeShareModal: () => void;
}

/**
 * Custom hook to manage report sharing functionality
 * Handles share modal state only - confetti is managed by ReportShareCard internally
 */
export function useReportSharing(): UseReportSharingReturn {
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  const openShareModal = React.useCallback(() => {
    setIsShareModalOpen(true);
  }, []);

  const closeShareModal = React.useCallback(() => {
    setIsShareModalOpen(false);
  }, []);

  return {
    isShareModalOpen,
    openShareModal,
    closeShareModal
  };
}
