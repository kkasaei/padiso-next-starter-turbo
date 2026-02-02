'use client'

import { useRef, useCallback } from 'react'
import { Label } from '@workspace/ui/components/label'
import { TooltipContent } from '@workspace/ui/components/tooltip'
import { TiptapEditor, type TiptapEditorRef } from '@/components/common/TiptapEditor'
import type { ProjectFormData } from '@workspace/common/lib/shcmea/types/project-form'
import { FormSection } from './FormSection'
import { GenerateWithAIButton } from './GenerateWithAiButton'

interface AIGuidelinesSectionProps {
  formData: ProjectFormData
  updateFormData: (field: keyof ProjectFormData, value: string) => void
  onGenerateAIGuidelines: () => void
  isGeneratingGuidelines: boolean
  canGenerate: boolean
}

const GUIDELINES_PLACEHOLDER = `# AI Guidelines for [Project Name]

## Target Audience
- Focus on **technical decision-makers** (CTOs, VPs of Engineering)
- Prioritize enterprise clients over SMB or consumer markets

## Content Strategy
- Emphasize security, compliance, and scalability topics
- Use technical, professional tone in all recommendations
- Avoid consumer-focused or non-technical content

## Geographic Priorities
- **Primary**: North America (United States, Canada)
- **Secondary**: Western Europe, Australia

## Keyword Strategy
- Focus on **B2B SaaS keywords** only
- Target long-tail enterprise keywords
- Avoid B2C or consumer-oriented terms

## Brand Voice
- Professional and authoritative
- Technical but accessible
- Solution-focused messaging`

export function AIGuidelinesSection({
  formData,
  updateFormData,
  onGenerateAIGuidelines,
  isGeneratingGuidelines,
  canGenerate,
}: AIGuidelinesSectionProps) {
  const editorRef = useRef<TiptapEditorRef>(null)
  
  // Handle guidelines changes from TiptapEditor
  const handleGuidelinesChange = useCallback(
    (markdown: string) => {
      updateFormData('aiGuidelines', markdown)
    },
    [updateFormData]
  )

  return (
    <FormSection
      title="AI Guidelines"
      description="Provide context and rules that AI agents should follow when analyzing this project"
      action={
        <GenerateWithAIButton
          onClick={onGenerateAIGuidelines}
          isLoading={isGeneratingGuidelines}
          disabled={!canGenerate}
        />
      }
      helpContent={<GuidelinesHelpContent />}
    >
      <div className="flex w-full flex-col gap-y-6">
        <div className="flex flex-col gap-2 space-y-2">
          <Label htmlFor="aiGuidelines">Guidelines for AI Analysis</Label>
          <TiptapEditor
            ref={editorRef}
            initialValue={formData.aiGuidelines || GUIDELINES_PLACEHOLDER}
            onContentChange={handleGuidelinesChange}
            placeholder="Add guidelines for AI analysis..."
            height="600px"
            className="rounded-xl"
          />
          <p className="dark:text-polar-500 text-xs text-gray-500">
            Define rules, constraints, and context that AI should consider when
            analyzing your project. These act as guardrails for AI-generated
            recommendations.
          </p>
        </div>
      </div>
    </FormSection>
  )
}

function GuidelinesHelpContent() {
  return (
    <TooltipContent
      side="right"
      className="max-w-md border border-gray-700 bg-gray-900 p-4 text-white dark:border-gray-300 dark:bg-gray-100 dark:text-gray-900"
    >
      <div className="space-y-3">
        <p className="text-sm font-medium text-white dark:text-gray-900">
          AI Agent Context & Rules
        </p>
        <p className="text-xs leading-relaxed text-gray-100 dark:text-gray-800">
          Similar to how Cursor uses AGENTS.md, these guidelines help AI
          understand your project&apos;s specific requirements, constraints, and
          preferences.
        </p>
        <div className="mt-3 rounded-lg border border-gray-700 bg-gray-800 p-2 dark:border-gray-400 dark:bg-gray-200">
          <p className="mb-1 text-xs font-medium text-white dark:text-gray-900">
            Example Guidelines:
          </p>
          <ul className="space-y-1 text-xs text-gray-200 dark:text-gray-700">
            <li>• Always prioritize B2B SaaS keywords over B2C</li>
            <li>• Focus on technical decision-makers (CTOs, VPs)</li>
            <li>• Avoid targeting consumer-focused content</li>
            <li>• Emphasize enterprise security and compliance</li>
            <li>• Target North American markets first</li>
          </ul>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-gray-100 dark:text-gray-800">
          <strong>Use cases:</strong> Brand voice preferences, content
          restrictions, target audience rules, regional considerations,
          technical constraints, and strategic priorities.
        </p>
      </div>
    </TooltipContent>
  )
}

