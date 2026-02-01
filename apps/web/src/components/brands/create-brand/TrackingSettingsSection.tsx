'use client'

import { Label } from '@workspace/ui/components/label'
import { RadioGroup, RadioGroupItem } from '@workspace/ui/components/radio-group'
import type { ProjectFormData } from '@workspace/common/lib/shcmea/types/project-form'
import { FormSection } from './FormSection'

interface TrackingSettingsSectionProps {
  formData: ProjectFormData
  updateFormData: (field: keyof ProjectFormData, value: string) => void
}

export function TrackingSettingsSection({
  formData,
  updateFormData,
}: TrackingSettingsSectionProps) {
  return (
    <FormSection
      title="Tracking Settings"
      description="Configure how frequently you want to track your SEO metrics"
    >
      <div className="flex w-full flex-col gap-6">
        <div className="@container">
          <RadioGroup
            value="weekly"
            className="grid grid-cols-1 gap-3 @md:grid-cols-3"
          >
            <Label
              htmlFor="tracking-daily"
              className="flex cursor-not-allowed flex-col gap-3 rounded-2xl border p-4 font-normal transition-colors opacity-50 dark:bg-polar-800 bg-gray-50"
            >
              <div>
                <div className="flex items-center gap-2.5 font-medium">
                  <RadioGroupItem
                    value="daily"
                    id="tracking-daily"
                    disabled
                  />
                  Daily
                </div>
              </div>
            </Label>

            <Label
              htmlFor="tracking-weekly"
              className="flex flex-col gap-3 rounded-2xl border-2 border-primary p-4 font-normal transition-colors dark:bg-polar-800 bg-blue-50/50"
            >
              <div>
                <div className="flex items-center gap-2.5 font-medium">
                  <RadioGroupItem
                    value="weekly"
                    id="tracking-weekly"
                    checked
                  />
                  Weekly
                </div>
              </div>
            </Label>

            <Label
              htmlFor="tracking-monthly"
              className="flex cursor-not-allowed flex-col gap-3 rounded-2xl border p-4 font-normal transition-colors opacity-50 dark:bg-polar-800 bg-gray-50"
            >
              <div>
                <div className="flex items-center gap-2.5 font-medium">
                  <RadioGroupItem
                    value="monthly"
                    id="tracking-monthly"
                    disabled
                  />
                  Monthly
                </div>
              </div>
            </Label>
          </RadioGroup>
        </div>
        <p className="text-xs text-gray-500 dark:text-polar-500">
          Tracking frequency is determined by your organization&apos;s plan. <a href="/dashboard/settings/billing" className="text-primary hover:underline">Upgrade your plan</a> to access daily tracking.
        </p>
      </div>
    </FormSection>
  )
}

