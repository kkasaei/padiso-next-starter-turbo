/**
 * @workspace/monitoring package
 * 
 * Error monitoring and tracking service
 */

export { MonitoringProvider, useMonitoring, MonitoringContext } from './hooks/use-monitoring';
export { useCaptureError } from './hooks/use-capture-error';
export { default as MonitoringProviderImpl } from './provider';
export type { MonitoringProvider as MonitoringProviderInterface, ErrorContext, ErrorRequest } from './provider/types';
