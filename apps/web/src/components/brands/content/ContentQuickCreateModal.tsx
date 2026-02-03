'use client'

import React, { useState, useRef } from 'react'
import { format } from 'date-fns'
import { CalendarDays, Paperclip, Mic, X, Sparkles, Loader2, FileText, Globe, HelpCircle, Plus, Check, Image, Upload, Trash2 } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Switch } from '@workspace/ui/components/switch'
import { Textarea } from '@workspace/ui/components/textarea'
import { Calendar } from '@workspace/ui/components/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@workspace/ui/components/command'
import { motion } from 'motion/react'
import { cn } from '@workspace/ui/lib/utils'
import { toast } from 'sonner'

// Sample AI-generated images (placeholders) - 16:9 aspect ratio (1200x675)
const AI_GENERATED_IMAGES = [
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=675&fit=crop',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=675&fit=crop',
  'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=1200&h=675&fit=crop',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=675&fit=crop',
]

export type CreateContentContext = {
  scheduledDate?: Date
}

interface ContentQuickCreateModalProps {
  open: boolean
  onClose: () => void
  context?: CreateContentContext
  onContentCreated?: (content: {
    prompt: string
    scheduledDate: Date
    contentType: string
    locales: string[]
    featuredImage?: string | null
  }) => void
}

// Content types
const CONTENT_TYPES = [
  { id: 'product-listicle', label: 'Product Listicle' },
  { id: 'how-to', label: 'How To' },
  { id: 'guide', label: 'Guide' },
  { id: 'explainer', label: 'Explainer' },
  { id: 'listicle', label: 'Listicle' },
  { id: 'tutorial', label: 'Tutorial' },
]

// Available locales
const AVAILABLE_LOCALES = [
  { id: 'en', label: 'English', flag: '🇺🇸' },
  { id: 'es', label: 'Spanish', flag: '🇪🇸' },
  { id: 'fr', label: 'French', flag: '🇫🇷' },
  { id: 'de', label: 'German', flag: '🇩🇪' },
  { id: 'it', label: 'Italian', flag: '🇮🇹' },
  { id: 'pt', label: 'Portuguese', flag: '🇵🇹' },
  { id: 'nl', label: 'Dutch', flag: '🇳🇱' },
  { id: 'pl', label: 'Polish', flag: '🇵🇱' },
  { id: 'ja', label: 'Japanese', flag: '🇯🇵' },
  { id: 'ko', label: 'Korean', flag: '🇰🇷' },
  { id: 'zh', label: 'Chinese', flag: '🇨🇳' },
  { id: 'ar', label: 'Arabic', flag: '🇸🇦' },
]

// AI-generated prompt templates
const AI_PROMPT_TEMPLATES = [
  "Write a comprehensive guide about the benefits and implementation strategies for enterprise AI adoption, targeting C-level executives. Include ROI metrics, case studies, and actionable next steps.",
  "Create an in-depth comparison of the top AI consulting firms, evaluating them based on expertise, pricing, client success stories, and specialization areas. Include pros and cons for each.",
  "Develop a step-by-step tutorial on how businesses can assess their AI readiness, including a checklist of technical, organizational, and cultural factors to consider.",
  "Write an explainer article about the different types of AI consulting services available, from strategy to implementation to ongoing support. Help readers understand which type they need.",
]

export function ContentQuickCreateModal({ 
  open, 
  onClose, 
  context,
  onContentCreated 
}: ContentQuickCreateModalProps) {
  const [prompt, setPrompt] = useState('')
  const [scheduledDate, setScheduledDate] = useState<Date>(context?.scheduledDate || new Date())
  const [contentType, setContentType] = useState<string>('product-listicle')
  const [selectedLocales, setSelectedLocales] = useState<string[]>(['en'])
  const [createMore, setCreateMore] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isTypePickerOpen, setIsTypePickerOpen] = useState(false)
  const [isLocalePickerOpen, setIsLocalePickerOpen] = useState(false)
  
  // Image state
  const [featuredImage, setFeaturedImage] = useState<string | null>(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleGenerateWithAI = async () => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 1200))
    const template = AI_PROMPT_TEMPLATES[Math.floor(Math.random() * AI_PROMPT_TEMPLATES.length)]
    setPrompt(template)
    setIsGenerating(false)
    toast.success('Prompt generated')
  }

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    const randomImage = AI_GENERATED_IMAGES[Math.floor(Math.random() * AI_GENERATED_IMAGES.length)]
    setFeaturedImage(randomImage)
    setIsGeneratingImage(false)
    toast.success('Image generated')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB')
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        setFeaturedImage(event.target?.result as string)
        toast.success('Image uploaded')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setFeaturedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const toggleLocale = (localeId: string) => {
    setSelectedLocales(prev => {
      if (prev.includes(localeId)) {
        // Don't allow removing the last locale
        if (prev.length === 1) return prev
        return prev.filter(id => id !== localeId)
      }
      return [...prev, localeId]
    })
  }

  const handleSubmit = () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt for the content')
      return
    }

    onContentCreated?.({
      prompt: prompt.trim(),
      scheduledDate,
      contentType,
      locales: selectedLocales,
      featuredImage,
    })

    if (createMore) {
      setPrompt('')
      setFeaturedImage(null)
      toast.success('Content queued! Add another.')
    } else {
      onClose()
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault()
      handleSubmit()
    }
  }

  const selectedType = CONTENT_TYPES.find(t => t.id === contentType)
  const selectedLocaleLabels = selectedLocales.map(id => {
    const locale = AVAILABLE_LOCALES.find(l => l.id === id)
    return locale ? locale.flag : id
  }).join(' ')

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="flex w-full max-w-[720px] rounded-3xl bg-background shadow-2xl border border-border"
        onKeyDown={handleKeyDown}
      >
        <div className="flex flex-1 flex-col p-4 gap-3.5">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">Create with AI</span>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-[280px]">
                    <p>Our AI will analyze your prompt, research relevant topics, and generate keyword data (difficulty & search volume). Content will be scheduled for the selected date in all chosen languages.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full opacity-70 hover:opacity-100"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>

          {/* Prompt Input */}
          <div className="flex flex-col gap-2 w-full shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Describe what you want to write about
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGenerateWithAI}
                disabled={isGenerating}
                className="h-7 px-2 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
              >
                {isGenerating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                Generate idea
              </Button>
            </div>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Write an article comparing the top 5 AI consulting firms for enterprise businesses, including pricing, expertise areas, and client testimonials..."
              className="min-h-[120px] resize-none text-base"
            />
          </div>

          {/* Properties */}
          <div className="flex flex-wrap gap-2.5 items-start w-full shrink-0">
            {/* Scheduled date */}
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <button className="bg-muted flex gap-2 h-9 items-center px-3 py-2 rounded-lg border border-border hover:border-primary/50 transition-colors">
                  <CalendarDays className="size-4 text-muted-foreground" />
                  <span className="font-medium text-foreground text-sm leading-5">
                    {format(scheduledDate, 'MMM d, yyyy')}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={scheduledDate}
                  onSelect={(date) => {
                    if (date) {
                      setScheduledDate(date)
                      setIsDatePickerOpen(false)
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Content Type */}
            <Popover open={isTypePickerOpen} onOpenChange={setIsTypePickerOpen}>
              <PopoverTrigger asChild>
                <button className="bg-muted flex gap-2 h-9 items-center px-3 py-2 rounded-lg border border-border hover:border-primary/50 transition-colors">
                  <FileText className="size-4 text-muted-foreground" />
                  <span className="font-medium text-foreground text-sm leading-5">
                    {selectedType?.label || 'Type'}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                  <CommandList>
                    <CommandGroup>
                      {CONTENT_TYPES.map((type) => (
                        <CommandItem
                          key={type.id}
                          value={type.id}
                          onSelect={() => {
                            setContentType(type.id)
                            setIsTypePickerOpen(false)
                          }}
                        >
                          <span className="flex-1">{type.label}</span>
                          {contentType === type.id && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Locales */}
            <Popover open={isLocalePickerOpen} onOpenChange={setIsLocalePickerOpen}>
              <PopoverTrigger asChild>
                <button className="bg-muted flex gap-2 h-9 items-center px-3 py-2 rounded-lg border border-border hover:border-primary/50 transition-colors">
                  <Globe className="size-4 text-muted-foreground" />
                  <span className="font-medium text-foreground text-sm leading-5">
                    {selectedLocales.length === 1 
                      ? AVAILABLE_LOCALES.find(l => l.id === selectedLocales[0])?.label 
                      : `${selectedLocales.length} languages`
                    }
                  </span>
                  <span className="text-base">{selectedLocaleLabels}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[240px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search languages..." />
                  <CommandList>
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                      {AVAILABLE_LOCALES.map((locale) => (
                        <CommandItem
                          key={locale.id}
                          value={locale.id}
                          onSelect={() => toggleLocale(locale.id)}
                        >
                          <span className="mr-2">{locale.flag}</span>
                          <span className="flex-1">{locale.label}</span>
                          {selectedLocales.includes(locale.id) && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Selected locales preview */}
          {selectedLocales.length > 1 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Creating {selectedLocales.length} language variants:</span>
              <div className="flex gap-1 flex-wrap">
                {selectedLocales.map(id => {
                  const locale = AVAILABLE_LOCALES.find(l => l.id === id)
                  return (
                    <span key={id} className="bg-muted px-1.5 py-0.5 rounded text-foreground">
                      {locale?.flag} {locale?.label}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* Featured Image */}
          <div className="flex flex-col gap-2 w-full shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Featured image <span className="text-xs font-normal">(optional, 1200×675px, 16:9)</span>
              </span>
            </div>
            
            {featuredImage ? (
              <div className="relative group aspect-video w-full">
                <img 
                  src={featuredImage} 
                  alt="Featured" 
                  className="w-full h-full object-cover rounded-lg border border-border"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage}
                    className="h-8"
                  >
                    {isGeneratingImage ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-1.5" />
                    )}
                    Regenerate
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8"
                  >
                    <Upload className="h-4 w-4 mr-1.5" />
                    Replace
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="h-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 aspect-video w-full">
                <button
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage}
                  className="flex-1 flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-muted/50 transition-colors"
                >
                  {isGeneratingImage ? (
                    <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                  ) : (
                    <Sparkles className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="text-xs text-muted-foreground">Generate with AI</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-muted/50 transition-colors"
                >
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Upload image</span>
                </button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto w-full pt-4 shrink-0">
            <div className="flex items-center gap-1">
              <button className="flex items-center justify-center size-10 rounded-lg hover:bg-muted transition-colors">
                <Paperclip className="size-4 text-muted-foreground" />
              </button>
              <button className="flex items-center justify-center size-10 rounded-lg hover:bg-muted transition-colors">
                <Mic className="size-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={createMore}
                  onCheckedChange={(value) => setCreateMore(Boolean(value))}
                />
                <span className="text-sm font-medium text-foreground">Create more</span>
              </div>

              <Button type="button" onClick={handleSubmit} className="h-10 px-4 rounded-xl gap-2">
                <Sparkles className="h-4 w-4" />
                Create Content
                {selectedLocales.length > 1 && (
                  <span className="bg-primary-foreground/20 px-1.5 py-0.5 rounded text-xs">
                    ×{selectedLocales.length}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
