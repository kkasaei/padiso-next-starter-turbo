import { useMemo } from 'react';
import type { ProjectFormData } from '@/lib/shcmea/types/project-form';

// ============================================================
// Types
// ============================================================

export interface ProjectContext {
  domain: string | null;
  projectName: string | null;
  description: string | null;
  websiteUrl: string | null;
  hasMinimumContext: boolean;
  canGenerateDescription: boolean;
  canGenerateTargeting: boolean;
  canGenerateGuidelines: boolean;
}

export interface UseProjectContextResult {
  context: ProjectContext;
  extractDomain: () => { success: true; domain: string } | { success: false; error: string };
  getDescriptionInput: () => { domain: string; context?: string } | null;
  getTargetingInput: () => { domain: string; description?: string } | null;
  getGuidelinesInput: () => { domain: string; projectName?: string; description?: string } | null;
}

// ============================================================
// Hook
// ============================================================

export function useProjectContext(formData: ProjectFormData): UseProjectContextResult {
  // Extract domain from URL helper
  const extractDomain = (): { success: true; domain: string } | { success: false; error: string } => {
    if (formData.websiteUrl && formData.websiteUrl.trim()) {
      try {
        const url = new URL(
          formData.websiteUrl.startsWith('http')
            ? formData.websiteUrl
            : `https://${formData.websiteUrl}`
        );
        return { success: true, domain: url.hostname };
      } catch {
        return { success: false, error: 'Invalid website URL format' };
      }
    }

    // Fallback: use project name as domain
    if (formData.name && formData.name.trim()) {
      const domain = formData.name.toLowerCase().replace(/\s+/g, '-') + '.com';
      return { success: true, domain };
    }

    return { success: false, error: 'Please enter a website URL or project name' };
  };

  // Compute project context
  const context: ProjectContext = useMemo(() => {
    // Extract domain inline to avoid dependency issues
    let domain: string | null = null;
    let hasValidUrl = false;

    if (formData.websiteUrl && formData.websiteUrl.trim()) {
      try {
        const url = new URL(
          formData.websiteUrl.startsWith('http')
            ? formData.websiteUrl
            : `https://${formData.websiteUrl}`
        );
        domain = url.hostname;
        hasValidUrl = true;
      } catch {
        // Invalid URL, will stay null
      }
    } else if (formData.name && formData.name.trim()) {
      domain = formData.name.toLowerCase().replace(/\s+/g, '-') + '.com';
    }

    // Check if we have valid description
    const hasDescription = !!(formData.description && formData.description.trim());

    // Button enable logic:
    // - Description: Only needs valid URL (will generate the description)
    // - Targeting: Needs URL AND description (description provides context for targeting)
    // - Guidelines: Needs URL AND description (description provides context for guidelines)
    const canGenerateTargetingAndGuidelines = hasValidUrl && hasDescription;

    return {
      domain,
      projectName: formData.name || null,
      description: formData.description || null,
      websiteUrl: formData.websiteUrl || null,
      hasMinimumContext: !!domain,
      canGenerateDescription: hasValidUrl,                  // Only needs URL
      canGenerateTargeting: canGenerateTargetingAndGuidelines,   // Needs URL AND description
      canGenerateGuidelines: canGenerateTargetingAndGuidelines,  // Needs URL AND description
    };
  }, [formData.name, formData.description, formData.websiteUrl]);

  // Get input for description generation
  const getDescriptionInput = () => {
    const domainResult = extractDomain();
    if (!domainResult.success) return null;

    return {
      domain: domainResult.domain,
      context: formData.name || undefined,
    };
  };

  // Get input for targeting generation
  const getTargetingInput = () => {
    const domainResult = extractDomain();
    if (!domainResult.success) return null;

    return {
      domain: domainResult.domain,
      description: formData.description || undefined,
      context: undefined, // Not used for targeting, but schema expects it
    };
  };

  // Get input for guidelines generation
  const getGuidelinesInput = () => {
    const domainResult = extractDomain();
    if (!domainResult.success) return null;

    return {
      domain: domainResult.domain,
      projectName: formData.name || undefined,
      description: formData.description || undefined,
      context: undefined, // Not used for guidelines, but schema expects it
    };
  };

  return {
    context,
    extractDomain,
    getDescriptionInput,
    getTargetingInput,
    getGuidelinesInput,
  };
}

