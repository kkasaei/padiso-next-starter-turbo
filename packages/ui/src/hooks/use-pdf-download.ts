import * as React from 'react';
import { toast } from 'sonner';

interface UsePDFDownloadOptions {
  domain: string;
  userEmail?: string;
}

interface PDFDownloadState {
  isLoading: boolean;
  error: string | null;
  pdfUrl: string | null;
}

/**
 * Custom hook for PDF download with caching and polling
 *
 * Flow:
 * 1. Verify user has unlocked report (has email)
 * 2. Request PDF generation (checks cache first)
 * 3. If cached, return URL immediately
 * 4. If generating, poll status every 2 seconds
 * 5. Auto-download when ready
 * 6. Track PDF generation and download separately
 */
export function usePDFDownload({ domain, userEmail }: UsePDFDownloadOptions) {
  const [state, setState] = React.useState<PDFDownloadState>({
    isLoading: false,
    error: null,
    pdfUrl: null,
  });

  const pollingIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const pollCountRef = React.useRef(0);

  // Clear polling on unmount
  React.useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  /**
   * Poll PDF status
   */
  const pollPDFStatus = React.useCallback(async () => {
    try {
      pollCountRef.current += 1;

      const response = await fetch(`/api/reports/${encodeURIComponent(domain)}/pdf-status`);
      const data = await response.json();

      if (data.status === 'ready') {
        // PDF is ready!
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }

        setState({
          isLoading: false,
          error: null,
          pdfUrl: data.pdfUrl,
        });

        // Track download activity
        if (userEmail) {
        }

        // Trigger download
        window.open(data.pdfUrl, '_blank');
        toast.success('PDF is ready for download!');

        return true;
      }

      // Check if we've been polling too long (30 seconds = 15 polls)
      if (pollCountRef.current >= 15) {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }

        setState({
          isLoading: false,
          error: 'PDF generation is taking longer than expected. Please try again.',
          pdfUrl: null,
        });

        toast.error('PDF generation timeout. Please try again.');
        return false;
      }

      return false;
    } catch (error) {
      console.error('[PDF Download] Polling error:', error);
      return false;
    }
  }, [domain]);

  /**
   * Start PDF download process
   */
  const downloadPDF = React.useCallback(async () => {
    // Verify user has unlocked the report
    if (!userEmail) {
      toast.error('Please unlock the report first to download the PDF.');
      return;
    }

    setState({
      isLoading: true,
      error: null,
      pdfUrl: null,
    });

    pollCountRef.current = 0;

    try {
      // 1. Request PDF generation
      const response = await fetch(`/api/reports/${encodeURIComponent(domain)}/request-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to request PDF');
      }

      const data = await response.json();

      // 2. Check if PDF is already cached
      if (data.status === 'ready' && data.pdfUrl) {
        setState({
          isLoading: false,
          error: null,
          pdfUrl: data.pdfUrl,
        });

        // Instant download for cached PDFs
        window.open(data.pdfUrl, '_blank');
        toast.success('PDF downloaded successfully!');
        return;
      }

      // 3. PDF is generating - start polling
      if (data.status === 'generating') {
        toast.info('Generating PDF... This may take a few seconds.');

        // Start polling every 2 seconds
        pollingIntervalRef.current = setInterval(pollPDFStatus, 2000);
      }
    } catch (error) {
      console.error('[PDF Download] Error:', error);

      setState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to download PDF',
        pdfUrl: null,
      });

      toast.error('Failed to download PDF. Please try again.');
    }
  }, [domain, userEmail, pollPDFStatus]);

  return {
    downloadPDF,
    isLoading: state.isLoading,
    error: state.error,
    pdfUrl: state.pdfUrl,
  };
}
