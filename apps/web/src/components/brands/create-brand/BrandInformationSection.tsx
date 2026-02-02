'use client'

import * as React from 'react'
import { useRef, useCallback, useState } from 'react'
import { Input } from '@workspace/ui/components/input'
import { Button } from '@workspace/ui/components/button'
import { Label } from '@workspace/ui/components/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@workspace/ui/components/command'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip'
import { HelpCircle, Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@workspace/common/lib'
import { TiptapEditor, type TiptapEditorRef } from '@/components/common/TiptapEditor'
import type { ProjectFormData } from '@workspace/common/lib/shcmea/types/project-form'
import { FormSection } from './FormSection'
import { GenerateWithAIButton } from './GenerateWithAiButton'
import { COUNTRIES, getCountryByCode } from '@workspace/common/constants'

function CountryCombobox({
  value,
  onValueChange,
}: {
  value: string
  onValueChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const selectedCountry = getCountryByCode(value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-10 w-full justify-between rounded-lg font-normal"
        >
          {selectedCountry ? (
            <span className="flex items-center gap-2">
              <span>{selectedCountry.flag}</span>
              <span>{selectedCountry.name}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">Search for a country...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search countries..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {COUNTRIES.map((country) => (
                <CommandItem
                  key={country.code}
                  value={`${country.name} ${country.code}`}
                  onSelect={() => {
                    onValueChange(country.code)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === country.code ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <span className="flex items-center gap-2">
                    <span>{country.flag}</span>
                    <span>{country.name}</span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface ProjectInformationSectionProps {
  formData: ProjectFormData
  updateFormData: (field: keyof ProjectFormData, value: string) => void
  onGenerateDescription: () => void
  isGeneratingDescription: boolean
  canGenerate: boolean
}

export function ProjectInformationSection({
  formData,
  updateFormData,
  onGenerateDescription,
  isGeneratingDescription,
  canGenerate,
}: ProjectInformationSectionProps) {
  const editorRef = useRef<TiptapEditorRef>(null)
  
  // Handle description changes from TiptapEditor
  const handleDescriptionChange = useCallback(
    (markdown: string) => {
      updateFormData('description', markdown)
    },
    [updateFormData]
  )

  return (
    <FormSection
      title="Project Information"
      description="Basic project information to help you track and identify your SEO project"
    >
      <div className="flex w-full flex-col gap-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <div className="flex flex-row items-center justify-between">
            <Label htmlFor="name">Name</Label>
          </div>
          <div className="relative flex flex-1 flex-row rounded-full">
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              className="h-10 rounded-lg"
              placeholder="My Awesome Project"
            />
          </div>
        </div>

        {/* Website URL Field */}
        <div className="space-y-2">
          <div className="flex flex-row items-center justify-between">
            <Label htmlFor="websiteUrl">Website URL</Label>
          </div>
          <div className="relative flex flex-1 flex-row rounded-full">
            <Input
              id="websiteUrl"
              name="websiteUrl"
              type="url"
              value={formData.websiteUrl}
              onChange={(e) => updateFormData('websiteUrl', e.target.value)}
              className="h-10 rounded-lg"
              placeholder="https://example.com"
            />
          </div>
        </div>

        {/* Country Field */}
        <div className="space-y-2">
          <div className="flex flex-row items-center justify-between">
            <Label htmlFor="country">Business Location</Label>
          </div>
          <CountryCombobox
            value={formData.country || ''}
            onValueChange={(value) => updateFormData('country', value)}
          />
          <p className="dark:text-polar-500 text-xs text-gray-500">
            The country where your business is primarily located.
          </p>
        </div>

        {/* Description Field */}
        <div className="flex flex-col gap-2 space-y-2">
          <div className="flex flex-row items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <Label htmlFor="description">Description</Label>
              <DescriptionHelpTooltip />
            </div>
            <GenerateWithAIButton
              onClick={onGenerateDescription}
              isLoading={isGeneratingDescription}
              disabled={!canGenerate}
            />
          </div>
          <TiptapEditor
            ref={editorRef}
            initialValue={formData.description || ''}
            onContentChange={handleDescriptionChange}
            placeholder="Describe your project and SEO goals..."
            height="400px"
            className="rounded-xl"
          />
          <p className="dark:text-polar-500 text-xs text-gray-500">
            This description serves as the base context for AI analysis. Be detailed about your business, target audience, and SEO goals.
          </p>
        </div>
      </div>
    </FormSection>
  )
}

function DescriptionHelpTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-5 w-5 p-0 hover:bg-transparent"
            type="button"
          >
            <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="max-w-sm border border-gray-700 bg-gray-900 p-4 text-white dark:border-gray-300 dark:bg-gray-100 dark:text-gray-900"
        >
          <div className="space-y-2">
            <p className="text-sm font-medium text-white dark:text-gray-900">
              Why is this important?
            </p>
            <p className="text-xs leading-relaxed text-gray-100 dark:text-gray-800">
              This description serves as the{' '}
              <strong>base context for our AI agent</strong> when analyzing your
              project. A detailed description helps us:
            </p>
            <ul className="list-disc space-y-1 pl-4 text-xs text-gray-100 dark:text-gray-800">
              <li>Understand your business positioning and target audience</li>
              <li>Identify relevant keywords and search intent</li>
              <li>Optimize for Answer Engine Optimization (AEO)</li>
              <li>Generate contextually accurate SEO strategies</li>
            </ul>
            <div className="mt-3 rounded-lg border border-gray-700 bg-gray-800 p-2 dark:border-gray-400 dark:bg-gray-200">
              <p className="mb-1 text-xs font-medium text-white dark:text-gray-900">
                Example:
              </p>
              <p className="text-xs leading-relaxed text-gray-200 dark:text-gray-700">
                &ldquo;Padiso.co is an AI solutions studio helping businesses
                adopt and scale practical AI systems. We target founders and
                leadership teams who need AI strategy, automation, and technical
                guidance. Our SEO goals include ranking for AI consulting
                keywords, building authority in agentic workflows, and
                optimizing for AEO to appear in AI-generated responses.&rdquo;
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

