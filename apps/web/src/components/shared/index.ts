/**
 * Shared Components Barrel Export
 * 
 * Re-exports shared components from workspace packages.
 * Most shared components have been moved to @workspace/ui.
 * 
 * This file exists for backwards compatibility and convenience.
 */

// Re-export from @workspace/ui
export * from '@workspace/ui/components/filter-chip';
export * from '@workspace/ui/components/chip-overflow';
export * from '@workspace/ui/components/filter-popover';
export * from '@workspace/ui/components/priority-badge';
export * from '@workspace/ui/components/progress-circle';
export * from '@workspace/ui/components/quick-create-modal-layout';

// Web-specific components that remain here
export * from '../brands/ViewOptionsPopover';

// Billing guard components
export * from './BillingLimitBanner';
export * from './UpgradePlanModal';
