import * as React from 'react';

interface ReportHeaderProps {
  domain: string;
}

export function ReportHeader({
  domain
}: ReportHeaderProps): React.JSX.Element {
  return (
    <div className="mb-8 flex items-center justify-center gap-3 sm:justify-start">
      {/* Status Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-xs font-medium shadow-sm backdrop-blur-sm">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        Live Report
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="size-1 rounded-full bg-muted-foreground/50" />
        Generated Report
      </div>
    </div>
  );
}
