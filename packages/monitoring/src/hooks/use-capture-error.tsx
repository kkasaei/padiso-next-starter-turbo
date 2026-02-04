'use client';

import * as React from 'react';

import { useMonitoring } from './use-monitoring';

export function useCaptureError(error: Error): void {
  const monitoring = useMonitoring();

  React.useEffect(() => {
    monitoring.captureError(error);
  }, [monitoring, error]);
}
