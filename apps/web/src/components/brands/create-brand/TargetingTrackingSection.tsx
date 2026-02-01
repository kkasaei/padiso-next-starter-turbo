'use client'

import { Label } from '@workspace/ui/components/label'
import { Textarea } from '@workspace/ui/components/textarea'
import { TooltipContent } from '@workspace/ui/components/tooltip'
import type { ProjectFormData } from '@/lib/shcmea/types/project-form'
import { FormSection } from './FormSection'
import { GenerateWithAIButton } from './GenerateWithAiButton'

interface TargetingTrackingSectionProps {
  formData: ProjectFormData
  updateFormData: (field: keyof ProjectFormData, value: string) => void
  onGenerateTargeting: () => void
  isGeneratingTargeting: boolean
  canGenerate: boolean
}

const TARGETING_FIELDS = [
  {
    id: 'keywords',
    label: 'Keywords',
    placeholder:
      'seo tools, keyword research, rank tracking, answer engine optimization',
    helpText: 'Enter keywords separated by commas. You can add more later.',
  },
  {
    id: 'competitors',
    label: 'Competitor Domains',
    placeholder: 'competitor1.com, competitor2.com, competitor3.com',
    helpText:
      'Enter competitor domains separated by commas (e.g., example.com, another.com)',
  },
  {
    id: 'locations',
    label: 'Locations',
    placeholder: 'United States, Australia, United Kingdom, Canada',
    helpText:
      "Enter countries/regions separated by commas. We'll track rankings for each location.",
  },
] as const

export function TargetingTrackingSection({
  formData,
  updateFormData,
  onGenerateTargeting,
  isGeneratingTargeting,
  canGenerate,
}: TargetingTrackingSectionProps) {
  return (
    <FormSection
      title="Targeting & Tracking"
      description="Define keywords, competitors, and locations to track for comprehensive SEO insights"
      action={
        <GenerateWithAIButton
          onClick={onGenerateTargeting}
          isLoading={isGeneratingTargeting}
          disabled={!canGenerate}
        />
      }
      helpContent={<TargetingHelpContent />}
    >
      <div className="flex w-full flex-col gap-y-6">
        {TARGETING_FIELDS.map((field) => (
          <div key={field.id} className="flex flex-col gap-2 space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Textarea
              id={field.id}
              name={field.id}
              value={formData[field.id as keyof ProjectFormData] as string}
              onChange={(e) =>
                updateFormData(field.id as keyof ProjectFormData, e.target.value)
              }
              className="min-h-32 resize-none rounded-2xl"
              placeholder={field.placeholder}
            />
            <p className="dark:text-polar-500 text-xs text-gray-500">
              {field.helpText}
            </p>
          </div>
        ))}
      </div>
    </FormSection>
  )
}

function TargetingHelpContent() {
  return (
    <TooltipContent
      side="right"
      className="max-w-md border border-gray-700 bg-gray-900 p-4 text-white dark:border-gray-300 dark:bg-gray-100 dark:text-gray-900"
    >
      <div className="space-y-3">
        <p className="text-sm font-medium text-white dark:text-gray-900">
          AI-Powered Targeting
        </p>
        <p className="text-xs leading-relaxed text-gray-100 dark:text-gray-800">
          Our AI analyzes your project description to automatically suggest:
        </p>
        <div className="space-y-2">
          <div>
            <p className="text-xs font-medium text-white dark:text-gray-900">
              Keywords
            </p>
            <p className="text-xs text-gray-100 dark:text-gray-800">
              Relevant search terms aligned with your business goals
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-white dark:text-gray-900">
              Competitors
            </p>
            <p className="text-xs text-gray-100 dark:text-gray-800">
              Direct competitors in your SEO landscape
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-white dark:text-gray-900">
              Locations
            </p>
            <p className="text-xs text-gray-100 dark:text-gray-800">
              Geographic regions matching your target markets
            </p>
          </div>
        </div>
      </div>
    </TooltipContent>
  )
}

