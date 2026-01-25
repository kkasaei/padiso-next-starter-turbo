'use client';

import { RefreshCw, Square, Loader2 } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { AUDIT_STATUS_CONFIG, type AuditStatus } from './constants';

// ============================================================
// PROPS
// ============================================================
export interface AuditHeaderProps {
  status: string;
  isRunning: boolean;
  isStarting: boolean;
  isCancelling: boolean;
  hasAudit: boolean;
  onRunAudit: () => void;
  onCancelAudit: () => void;
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export function AuditHeader({
  status,
  isRunning,
  isStarting,
  isCancelling,
  hasAudit,
  onRunAudit,
  onCancelAudit,
}: AuditHeaderProps) {
  const statusConfig = AUDIT_STATUS_CONFIG[status as AuditStatus];

  return (
    <header className="flex flex-col gap-y-4 md:flex-row md:items-center md:justify-between md:gap-x-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Website Audit</h1>
        {statusConfig && (
          <Badge variant={statusConfig.variant} className={statusConfig.className}>
            {statusConfig.label}
          </Badge>
        )}
      </div>
      <div className="flex gap-2">
        {isRunning ? (
          <Button
            onClick={onCancelAudit}
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
            onClick={onRunAudit}
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
                {hasAudit ? 'Re-run Audit' : 'Run Audit'}
              </>
            )}
          </Button>
        )}
      </div>
    </header>
  );
}

