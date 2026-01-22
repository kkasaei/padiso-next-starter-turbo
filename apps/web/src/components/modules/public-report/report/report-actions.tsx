import * as React from 'react';
import { Download, Share2, Loader2, Lock } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';

interface ReportActionsProps {
  onShare: () => void;
  onDownload?: () => void;
  variant?: 'desktop' | 'mobile';
  isDownloading?: boolean;
  isUnlocked?: boolean;
}

export function ReportActions({
  onShare,
  onDownload,
  variant = 'desktop',
  isDownloading = false,
  isUnlocked = false
}: ReportActionsProps): React.JSX.Element {
  if (variant === 'mobile') {
    return (
      <div className="flex gap-3 sm:hidden">
        <Button
          variant="outline"
          size="lg"
          className="flex-1 gap-2 rounded-xl border-2 font-semibold"
          onClick={onShare}
        >
          <Share2 className="size-5" />
          Share Report
        </Button>
        <Button
          size="lg"
          className="flex-1 gap-2 rounded-xl font-semibold"
          onClick={onDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Generating...
            </>
          ) : isUnlocked ? (
            <>
              <Download className="size-5" />
              Download PDF
            </>
          ) : (
            <>
              <Lock className="size-5" />
              Unlock Full Report
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden gap-3 sm:flex">
      <Button
        variant="outline"
        size="lg"
        className="gap-2 rounded-xl border-2 font-semibold"
        onClick={onShare}
      >
        <Share2 className="size-5" />
        Share Report
      </Button>
      <Button
        variant="default"
        size="lg"
        className="gap-2 rounded-xl font-semibold"
        onClick={onDownload}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Generating...
          </>
        ) : isUnlocked ? (
          <>
            <Download className="size-5" />
            Download PDF
          </>
        ) : (
          <>
            <Lock className="size-5" />
            Unlock Full Report
          </>
        )}
      </Button>
    </div>
  );
}
