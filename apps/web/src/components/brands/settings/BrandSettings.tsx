'use client'

import * as React from 'react'
import { useState, useCallback, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Input } from '@workspace/ui/components/input'
import { Button } from '@workspace/ui/components/button'
import { Label } from '@workspace/ui/components/label'
import { Textarea } from '@workspace/ui/components/textarea'
import { RadioGroup, RadioGroupItem } from '@workspace/ui/components/radio-group'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import { Badge } from '@workspace/ui/components/badge'
import { Sparkle, HelpCircle, Loader2 } from 'lucide-react'
import type { ProjectFormData } from '@workspace/common/lib/shcmea/types/project-form'
import type { SiteDiscoveryState } from '@workspace/common/lib/shcmea/types/site-discovery'
import type { ContextFilesState } from '@workspace/common/lib/shcmea/types/context-files'

import { SiteDiscoverySection } from '@/components/brands/create-brand/SiteDiscoverySection'
import { ContextFilesSection } from '@/components/brands/create-brand/ContextFilesSection'
import { SimpleEditor, type SimpleEditorRef } from '@/components/editor/simple-editor'
import { COUNTRIES, getCountryByCode } from '@workspace/common/constants'
import { useBrandWizardContext } from '@/hooks/use-brand-wizard-context'
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
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@workspace/common/lib'

function FormSection({
  title,
  description,
  children,
  helpContent,
  action,
}: {
  title: string
  description: string
  children: React.ReactNode
  helpContent?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="relative flex flex-col gap-12 p-12">
      <div className="flex w-full flex-col gap-y-6">
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium">{title}</h2>
              {helpContent && (
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
                    {helpContent}
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {action && <div className="flex items-center">{action}</div>}
          </div>
          <p className="leading-snug text-gray-500 dark:text-polar-500">
            {description}
          </p>
        </div>
      </div>
      {children}
    </div>
  )
}

function CountryCombobox({
  value,
  onValueChange,
}: {
  value: string
  onValueChange: (value: string) => void
}) {
  const [open, setOpen] = React.useState(false)
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

function GenerateWithAIButton({
  onClick,
  disabled = false,
  isLoading = false,
}: {
  onClick?: () => void
  disabled?: boolean
  isLoading?: boolean
}) {
  return (
    <Button
      variant="outline"
      type="button"
      onClick={(e) => {
        e.preventDefault()
        if (onClick && !disabled && !isLoading) {
          onClick()
        }
      }}
      disabled={disabled || isLoading}
      className={disabled && !isLoading ? 'opacity-50 cursor-not-allowed' : ''}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <Sparkle className="h-4 w-4" />
          <span>Generate with AI</span>
        </>
      )}
    </Button>
  )
}

function ProjectInformationSection({
  formData,
  updateFormData,
  onGenerateDescription,
  isGeneratingDescription,
  canGenerate,
}: {
  formData: ProjectFormData
  updateFormData: (field: keyof ProjectFormData, value: string) => void
  onGenerateDescription: () => void
  isGeneratingDescription: boolean
  canGenerate: boolean
}) {
  const editorRef = useRef<SimpleEditorRef>(null)

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
          <p className="text-xs text-gray-500 dark:text-polar-500">
            The country where your business is primarily located.
          </p>
        </div>

        {/* Description Field */}
        <div className="space-y-2 flex flex-col gap-2">
          <div className="flex flex-row items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <Label htmlFor="description">Description</Label>
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
                  <TooltipContent side="right" className="max-w-sm p-4 bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 border border-gray-700 dark:border-gray-300">
                    <div className="space-y-2">
                      <p className="font-medium text-sm text-white dark:text-gray-900">
                        Why is this important?
                      </p>
                      <p className="text-xs leading-relaxed text-gray-100 dark:text-gray-800">
                        This description serves as the <strong>base context for our AI agent</strong> when analyzing your project. A detailed description helps us:
                      </p>
                      <ul className="text-xs space-y-1 list-disc pl-4 text-gray-100 dark:text-gray-800">
                        <li>Understand your business positioning and target audience</li>
                        <li>Identify relevant keywords and search intent</li>
                        <li>Optimize for Answer Engine Optimization (AEO)</li>
                        <li>Generate contextually accurate SEO strategies</li>
                      </ul>
                      <div className="mt-3 p-2 bg-gray-800 dark:bg-gray-200 rounded-lg border border-gray-700 dark:border-gray-400">
                        <p className="text-xs font-medium mb-1 text-white dark:text-gray-900">Example:</p>
                        <p className="text-xs leading-relaxed text-gray-200 dark:text-gray-700">
                          &ldquo;Padiso.co is an AI solutions studio helping businesses adopt and scale practical AI systems. We target founders and leadership teams who need AI strategy, automation, and technical guidance. Our SEO goals include ranking for AI consulting keywords, building authority in agentic workflows, and optimizing for AEO to appear in AI-generated responses.&rdquo;
                        </p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <GenerateWithAIButton
              onClick={onGenerateDescription}
              isLoading={isGeneratingDescription}
              disabled={!canGenerate}
            />
          </div>
          <SimpleEditor
            ref={editorRef}
            initialValue={formData.description}
            onContentChange={(content) => updateFormData('description', content)}
            placeholder="Describe your project and SEO goals..."
            height="400px"
            className="rounded-xl"
          />
        </div>
      </div>
    </FormSection>
  )
}

function TrackingSettingsSection() {
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
              className="flex flex-col gap-3 rounded-2xl border p-4 font-normal transition-colors cursor-not-allowed opacity-50 dark:bg-polar-800 bg-gray-50"
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
              className="flex flex-col gap-3 rounded-2xl border p-4 font-normal transition-colors cursor-not-allowed opacity-50 dark:bg-polar-800 bg-gray-50"
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
          Tracking frequency is determined by your organization&apos;s plan. <a href="/dashboard/settings" className="text-primary hover:underline">Upgrade your plan</a> to access daily tracking.
        </p>
      </div>
    </FormSection>
  )
}

function TargetingTrackingSection({
  formData,
  updateFormData,
  onGenerateTargeting,
  isGeneratingTargeting,
  canGenerate,
}: {
  formData: ProjectFormData
  updateFormData: (field: keyof ProjectFormData, value: string) => void
  onGenerateTargeting: () => void
  isGeneratingTargeting: boolean
  canGenerate: boolean
}) {
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
      helpContent={
        <TooltipContent side="right" className="max-w-md p-4 bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 border border-gray-700 dark:border-gray-300">
          <div className="space-y-3">
            <p className="font-medium text-sm text-white dark:text-gray-900">
              AI-Powered Targeting
            </p>
            <p className="text-xs leading-relaxed text-gray-100 dark:text-gray-800">
              Our AI analyzes your project description to automatically suggest:
            </p>
            <div className="space-y-2">
              <div>
                <p className="text-xs font-medium text-white dark:text-gray-900">Keywords</p>
                <p className="text-xs text-gray-100 dark:text-gray-800">Relevant search terms aligned with your business goals</p>
              </div>
              <div>
                <p className="text-xs font-medium text-white dark:text-gray-900">Competitors</p>
                <p className="text-xs text-gray-100 dark:text-gray-800">Direct competitors in your SEO landscape</p>
              </div>
              <div>
                <p className="text-xs font-medium text-white dark:text-gray-900">Locations</p>
                <p className="text-xs text-gray-100 dark:text-gray-800">Geographic regions matching your target markets</p>
              </div>
            </div>
          </div>
        </TooltipContent>
      }
    >
      <div className="flex w-full flex-col gap-y-6">
        {/* Keywords */}
        <div className="space-y-2 flex flex-col gap-2">
          <Label htmlFor="keywords">Keywords</Label>
          <Textarea
            id="keywords"
            name="keywords"
            value={formData.keywords}
            onChange={(e) => updateFormData('keywords', e.target.value)}
            className="min-h-32 resize-none rounded-2xl"
            placeholder="seo tools, keyword research, rank tracking, answer engine optimization"
          />
          <p className="text-xs text-gray-500 dark:text-polar-500">
            Enter keywords separated by commas. You can add more later.
          </p>
        </div>

        {/* Competitors */}
        <div className="space-y-2 flex flex-col gap-2">
          <Label htmlFor="competitors">Competitor Domains</Label>
          <Textarea
            id="competitors"
            name="competitors"
            value={formData.competitors}
            onChange={(e) => updateFormData('competitors', e.target.value)}
            className="min-h-32 resize-none rounded-2xl"
            placeholder="competitor1.com, competitor2.com, competitor3.com"
          />
          <p className="text-xs text-gray-500 dark:text-polar-500">
            Enter competitor domains separated by commas (e.g., example.com, another.com)
          </p>
        </div>

        {/* Locations */}
        <div className="space-y-2 flex flex-col gap-2">
          <Label htmlFor="locations">Locations</Label>
          <Textarea
            id="locations"
            name="locations"
            value={formData.locations}
            onChange={(e) => updateFormData('locations', e.target.value)}
            className="min-h-32 resize-none rounded-2xl"
            placeholder="United States, Australia, United Kingdom, Canada"
          />
          <p className="text-xs text-gray-500 dark:text-polar-500">
            Enter countries/regions separated by commas. We&apos;ll track rankings for each location.
          </p>
        </div>
      </div>
    </FormSection>
  )
}

function AIGuidelinesSection({
  formData,
  updateFormData,
  onGenerateAIGuidelines,
  isGeneratingGuidelines,
  canGenerate,
}: {
  formData: ProjectFormData
  updateFormData: (field: keyof ProjectFormData, value: string) => void
  onGenerateAIGuidelines: () => void
  isGeneratingGuidelines: boolean
  canGenerate: boolean
}) {
  const editorRef = useRef<SimpleEditorRef>(null)

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
      helpContent={
        <TooltipContent side="right" className="max-w-md p-4 bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 border border-gray-700 dark:border-gray-300">
          <div className="space-y-3">
            <p className="font-medium text-sm text-white dark:text-gray-900">
              AI Agent Context & Rules
            </p>
            <p className="text-xs leading-relaxed text-gray-100 dark:text-gray-800">
              Similar to how Cursor uses AGENTS.md, these guidelines help AI understand your project&apos;s specific requirements, constraints, and preferences.
            </p>
            <div className="mt-3 p-2 bg-gray-800 dark:bg-gray-200 rounded-lg border border-gray-700 dark:border-gray-400">
              <p className="text-xs font-medium mb-1 text-white dark:text-gray-900">Example Guidelines:</p>
              <ul className="text-xs space-y-1 text-gray-200 dark:text-gray-700">
                <li>• Always prioritize B2B SaaS keywords over B2C</li>
                <li>• Focus on technical decision-makers (CTOs, VPs)</li>
                <li>• Avoid targeting consumer-focused content</li>
                <li>• Emphasize enterprise security and compliance</li>
                <li>• Target North American markets first</li>
              </ul>
            </div>
            <p className="text-xs leading-relaxed text-gray-100 dark:text-gray-800 mt-2">
              <strong>Use cases:</strong> Brand voice preferences, content restrictions, target audience rules, regional considerations, technical constraints, and strategic priorities.
            </p>
          </div>
        </TooltipContent>
      }
    >
      <div className="flex w-full flex-col gap-y-6">
        <div className="space-y-2 flex flex-col gap-2">
          <Label htmlFor="aiGuidelines">Guidelines for AI Analysis</Label>
          <SimpleEditor
            ref={editorRef}
            initialValue={formData.aiGuidelines}
            onContentChange={(content) => updateFormData('aiGuidelines', content)}
            placeholder={`# AI Guidelines for [Project Name]

## Target Audience
- Focus on **technical decision-makers** (CTOs, VPs of Engineering)
- Prioritize enterprise clients over SMB or consumer markets

## Content Strategy
- Emphasize security, compliance, and scalability topics
- Use technical, professional tone in all recommendations

## Keyword Strategy
- Focus on **B2B SaaS keywords** only
- Target long-tail enterprise keywords`}
            height="600px"
            className="rounded-xl"
          />
          <p className="text-xs text-gray-500 dark:text-polar-500">
            Define rules, constraints, and context that AI should consider when analyzing your project. These act as guardrails for AI-generated recommendations.
          </p>
        </div>
      </div>
    </FormSection>
  )
}

export default function Page() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string

  const [isSaving, setIsSaving] = useState(false)
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
  const [isGeneratingTargeting, setIsGeneratingTargeting] = useState(false)
  const [isGeneratingGuidelines, setIsGeneratingGuidelines] = useState(false)
  const [formData, setFormData] = useState<ProjectFormData & { contextFiles?: ContextFilesState }>({
    name: '',
    description: '',
    websiteUrl: '',
    country: '',
    aiGuidelines: '',
    trackingFrequency: 'daily',
    keywords: '',
    competitors: '',
    locations: '',
    siteDiscovery: undefined,
    contextFiles: undefined,
  })

  // ============================================================
  // PROJECT CONTEXT HOOK
  // ============================================================
  const brandContext = useBrandWizardContext(formData)

  // TODO: Load project data on mount
  // - Fetch project by projectId
  // - Populate formData with project settings
  // - Handle organization mismatch redirect

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.name.trim()) {
      toast.error('Project name is required')
      return
    }

    if (formData.websiteUrl && !formData.websiteUrl.match(/^https?:\/\/.+/)) {
      toast.error('Please enter a valid website URL')
      return
    }

    // TODO: Implement project update
    // - Call API to update project with formData
    // - Show success toast and redirect to project page
    setIsSaving(true)
    toast.info('TODO: Implement project update')
    setTimeout(() => setIsSaving(false), 1000)
  }

  const updateFormData = (field: keyof ProjectFormData, value: string) => {
    setFormData((prev: ProjectFormData & { contextFiles?: ContextFilesState }) => ({ ...prev, [field]: value }))
  }

  const updateSiteDiscovery = useCallback((discovery: SiteDiscoveryState) => {
    setFormData((prev: ProjectFormData & { contextFiles?: ContextFilesState }) => ({ ...prev, siteDiscovery: discovery }))
  }, [])

  const updateContextFiles = useCallback((contextFiles: ContextFilesState) => {
    setFormData((prev: ProjectFormData & { contextFiles?: ContextFilesState }) => ({ ...prev, contextFiles }))
  }, [])

  const handleGenerateDescription = () => {
    const input = brandContext.getDescriptionInput()

    if (!input) {
      toast.error('Please enter a website URL first')
      return
    }

    // TODO: Implement AI description generation
    // - Call AI API with input
    // - Update description field with generated content
    setIsGeneratingDescription(true)
    toast.info('TODO: Implement AI description generation')
    setTimeout(() => setIsGeneratingDescription(false), 1000)
  }

  const handleGenerateTargeting = () => {
    const input = brandContext.getTargetingInput()

    if (!input) {
      toast.error('Please enter a valid website URL and description first')
      return
    }

    // TODO: Implement AI targeting generation
    // - Call AI API with input
    // - Update keywords, competitors, locations fields
    setIsGeneratingTargeting(true)
    toast.info('TODO: Implement AI targeting generation')
    setTimeout(() => setIsGeneratingTargeting(false), 1000)
  }

  const handleGenerateAIGuidelines = () => {
    const input = brandContext.getGuidelinesInput()

    if (!input) {
      toast.error('Please enter a valid website URL and description first')
      return
    }

    // TODO: Implement AI guidelines generation
    // - Call AI API with input
    // - Update aiGuidelines field with generated content
    setIsGeneratingGuidelines(true)
    toast.info('TODO: Implement AI guidelines generation')
    setTimeout(() => setIsGeneratingGuidelines(false), 1000)
  }

  return (
    <div className="relative flex min-w-0 flex-2 flex-col items-center px-4 md:overflow-y-auto md:bg-white dark:md:bg-polar-900 md:px-8 md:shadow-xs">
    <div className="flex h-full w-full flex-col max-w-(--breakpoint-md)! max-w-(--breakpoint-xl)">
      {/* Page-Level Tabs */}
      <Tabs defaultValue="project-info" className="w-full">
        <TabsList className="bg-transparent ring-0 dark:bg-transparent dark:ring-0 p-1 gap-2 w-max mb-6 flex-wrap">
          <TabsTrigger
            value="project-info"
            className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
          >
            Project Information
          </TabsTrigger>
          <TabsTrigger
            value="tracking"
            className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
          >
            Tracking & Targeting
          </TabsTrigger>
          <TabsTrigger
            value="ai-guidelines"
            className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
          >
            AI Guidelines
            {(() => {
              const docsCount = formData.contextFiles?.files?.length || 0
              return docsCount > 0 ? (
                <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">
                  {docsCount} doc{docsCount !== 1 ? 's' : ''}
                </Badge>
              ) : null
            })()}
          </TabsTrigger>
          <TabsTrigger
            value="site-files"
            className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
          >
            Site Files
            {(() => {
              const sitemapCount = formData.siteDiscovery?.files
                ?.filter((f: { type: string; itemsExtracted?: number }) => f.type === 'sitemap.xml' || f.type === 'sitemap.txt')
                .reduce((sum: number, f: { itemsExtracted?: number }) => sum + (f.itemsExtracted || 0), 0) || 0
              return sitemapCount > 0 ? (
                <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  {sitemapCount.toLocaleString()} pages
                </Badge>
              ) : null
            })()}
          </TabsTrigger>
        </TabsList>

        {/* Project Information Tab */}
        <TabsContent value="project-info" className="mt-0">
          <div className="flex w-full flex-col pb-8 gap-y-16" style={{ opacity: 1 }}>
            <div className="dark:border-polar-700 dark:divide-polar-700 flex flex-col divide-y divide-gray-200 rounded-4xl border border-gray-200">
              <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
                <div className="dark:divide-polar-700 flex flex-col divide-y">
                  <ProjectInformationSection
                    formData={formData}
                    updateFormData={updateFormData}
                    onGenerateDescription={handleGenerateDescription}
                    isGeneratingDescription={isGeneratingDescription}
                    canGenerate={brandContext.context.canGenerateDescription}
                  />
                </div>
              </form>
            </div>

            {/* Submit Button */}
            <div className="flex flex-row items-center gap-2 pb-12">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/dashboard/brands/${projectId}`)}
                className="h-10 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isSaving}
                className="h-10 rounded-lg"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Tracking & Targeting Tab */}
        <TabsContent value="tracking" className="mt-0">
          <div className="flex w-full flex-col pb-8 gap-y-16" style={{ opacity: 1 }}>
            <div className="dark:border-polar-700 dark:divide-polar-700 flex flex-col divide-y divide-gray-200 rounded-4xl border border-gray-200">
              <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
                <div className="dark:divide-polar-700 flex flex-col divide-y">
                  <TrackingSettingsSection />

                  <TargetingTrackingSection
                    formData={formData}
                    updateFormData={updateFormData}
                    onGenerateTargeting={handleGenerateTargeting}
                    isGeneratingTargeting={isGeneratingTargeting}
                    canGenerate={brandContext.context.canGenerateTargeting}
                  />
                </div>
              </form>
            </div>

            {/* Submit Button */}
            <div className="flex flex-row items-center gap-2 pb-12">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/dashboard/brands/${projectId}`)}
                className="h-10 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isSaving}
                className="h-10 rounded-lg"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* AI Guidelines Tab */}
        <TabsContent value="ai-guidelines" className="mt-0">
          <div className="flex w-full flex-col pb-8 gap-y-8" style={{ opacity: 1 }}>
            {/* Guidelines Section */}
            <div className="dark:border-polar-700 dark:divide-polar-700 flex flex-col divide-y divide-gray-200 rounded-4xl border border-gray-200">
              <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
                <div className="dark:divide-polar-700 flex flex-col divide-y">
                  <AIGuidelinesSection
                    formData={formData}
                    updateFormData={updateFormData}
                    onGenerateAIGuidelines={handleGenerateAIGuidelines}
                    isGeneratingGuidelines={isGeneratingGuidelines}
                    canGenerate={brandContext.context.canGenerateGuidelines}
                  />
                </div>
              </form>
            </div>

            {/* Context Files Upload Section */}
            <ContextFilesSection
              projectId={projectId}
              contextFiles={formData.contextFiles}
              onUpdateContextFiles={updateContextFiles}
            />

            {/* Submit Button */}
            <div className="flex flex-row items-center gap-2 pb-12">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/dashboard/brands/${projectId}`)}
                className="h-10 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isSaving}
                className="h-10 rounded-lg"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Site Files Tab */}
        <TabsContent value="site-files" className="mt-0">
          <div className="flex w-full flex-col pb-8 gap-y-8" style={{ opacity: 1 }}>
            <SiteDiscoverySection
              websiteUrl={formData.websiteUrl}
              siteDiscovery={formData.siteDiscovery}
              onUpdateSiteDiscovery={updateSiteDiscovery}
            />

            {/* Submit Button */}
            <div className="flex flex-row items-center gap-2 pb-12">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/dashboard/brands/${projectId}`)}
                className="h-10 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isSaving}
                className="h-10 rounded-lg"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
  )
}
