import { useMemo } from 'react'
import type { ProjectFormData } from '@workspace/common/lib/shcmea/types/project-form'

export function useBrandWizardContext(formData: ProjectFormData) {
  const context = useMemo(() => {
    const hasWebsiteUrl = Boolean(formData.websiteUrl?.trim())
    const hasDescription = Boolean(formData.description?.trim())

    return {
      canGenerateDescription: hasWebsiteUrl,
      canGenerateTargeting: hasWebsiteUrl && hasDescription,
      canGenerateGuidelines: hasWebsiteUrl && hasDescription,
    }
  }, [formData.websiteUrl, formData.description])

  return {
    context,
    getDescriptionInput: () => {
      if (!formData.websiteUrl?.trim()) return null
      return {
        websiteUrl: formData.websiteUrl,
        name: formData.name,
        country: formData.country,
      }
    },
    getTargetingInput: () => {
      if (!formData.websiteUrl?.trim() || !formData.description?.trim()) return null
      return {
        websiteUrl: formData.websiteUrl,
        description: formData.description,
        name: formData.name,
      }
    },
    getGuidelinesInput: () => {
      if (!formData.websiteUrl?.trim() || !formData.description?.trim()) return null
      return {
        websiteUrl: formData.websiteUrl,
        description: formData.description,
        name: formData.name,
      }
    },
  }
}
