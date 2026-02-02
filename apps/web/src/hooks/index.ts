/**
 * Centralized Hook Exports
 * 
 * Barrel file for all custom React hooks.
 * Import from '@/hooks' instead of individual files.
 * 
 * Note: Generic UI hooks (use-debounce, use-mobile, use-mounted, 
 * use-is-touch-device, use-analytics-date-range, use-upload-file, 
 * use-form-wizard-context) are now in @workspace/ui
 */

// Brand & Workspace Management (Re-export from shared packages)
export * from '@workspace/react-providers/active-brand';
export * from '@workspace/react-providers/active-organization';
export * from './use-brands';
export * from './use-workspace';

// Generic form wizard context - now in @workspace/ui
export { 
  useFormWizardContext as useBrandWizardContext,
  type FormWizardContext as BrandWizardContext,
  type UseFormWizardContextResult as UseBrandWizardContextResult,
  type FormData as ProjectFormData
} from '@workspace/ui/hooks/use-form-wizard-context';

// Data Management
export * from './use-tasks';
export * from './use-prompts';

// File Upload - now in @workspace/ui
export * from '@workspace/ui/hooks/use-upload-file';

// Media Upload Context
export * from '@workspace/react-providers/media-upload';
