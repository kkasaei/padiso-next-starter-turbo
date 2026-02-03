'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@workspace/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { ArrowLeft, Pencil, Send, Copy, Trash2, MoreHorizontal, Plus, X, ChevronDown } from 'lucide-react'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@workspace/ui/components/resizable'
import { toast } from 'sonner'
import { cn } from '@workspace/ui/lib/utils'
import { ContentDetailSidebar } from '@/components/brands/content/ContentDetailSidebar'
import { ArticleContent } from '@/components/brands/content/ArticleContent'
import { PublishModal } from '@/components/brands/content/PublishModal'
import { mockContentData, localeContentData, type LocaleInfo, type ContentData } from './_mockData'

// All available languages that can be added
const ALL_AVAILABLE_LANGUAGES: LocaleInfo[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', status: 'draft' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', status: 'draft' },
  { code: 'fr', name: 'French', flag: '🇫🇷', status: 'draft' },
  { code: 'de', name: 'German', flag: '🇩🇪', status: 'draft' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', status: 'draft' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', status: 'draft' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', status: 'draft' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱', status: 'draft' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', status: 'draft' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', status: 'draft' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', status: 'draft' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', status: 'draft' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', status: 'draft' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', status: 'draft' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', status: 'draft' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', status: 'draft' },
  { code: 'th', name: 'Thai', flag: '🇹🇭', status: 'draft' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪', status: 'draft' },
  { code: 'da', name: 'Danish', flag: '🇩🇰', status: 'draft' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮', status: 'draft' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴', status: 'draft' },
  { code: 'cs', name: 'Czech', flag: '🇨🇿', status: 'draft' },
  { code: 'el', name: 'Greek', flag: '🇬🇷', status: 'draft' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱', status: 'draft' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩', status: 'draft' },
  { code: 'ms', name: 'Malay', flag: '🇲🇾', status: 'draft' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦', status: 'draft' },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴', status: 'draft' },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺', status: 'draft' },
]

export default function ContentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const contentId = params.contentId as string
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [activeLocale, setActiveLocale] = useState<string>('en')
  const [addedLocales, setAddedLocales] = useState<LocaleInfo[]>([])

  const baseContent = mockContentData[contentId]

  if (!baseContent) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <p className="text-muted-foreground mb-4">Content not found</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    )
  }

  // Get base locales from content (primary + existing)
  const baseLocales = useMemo(() => {
    const locales: LocaleInfo[] = []
    if (baseContent.primaryLocale) {
      locales.push(baseContent.primaryLocale)
    }
    if (baseContent.locales) {
      const contentLocales = localeContentData[contentId]
      baseContent.locales.forEach(locale => {
        if (contentLocales && contentLocales[locale.code]) {
          locales.push(locale)
        }
      })
    }
    return locales
  }, [baseContent, contentId])

  // Combine base locales with user-added locales
  const activeLocales = useMemo(() => {
    const combined = [...baseLocales]
    addedLocales.forEach(locale => {
      if (!combined.find(l => l.code === locale.code)) {
        combined.push(locale)
      }
    })
    return combined
  }, [baseLocales, addedLocales])

  // Languages available to add (not already in activeLocales)
  const availableToAdd = useMemo(() => {
    return ALL_AVAILABLE_LANGUAGES.filter(
      lang => !activeLocales.find(l => l.code === lang.code)
    )
  }, [activeLocales])

  // Handle adding a new locale
  const handleAddLocale = (locale: LocaleInfo) => {
    setAddedLocales(prev => [...prev, locale])
    toast.success(`${locale.flag} ${locale.name} translation added`)
  }

  // Handle removing a locale
  const handleRemoveLocale = (localeCode: string) => {
    // Don't allow removing primary locale
    if (baseContent.primaryLocale?.code === localeCode) {
      toast.error('Cannot remove the primary language')
      return
    }
    
    // If it's a user-added locale, remove from addedLocales
    setAddedLocales(prev => prev.filter(l => l.code !== localeCode))
    
    // If we're viewing the removed locale, switch to primary
    if (activeLocale === localeCode) {
      setActiveLocale(baseContent.primaryLocale?.code || 'en')
    }
    
    const locale = activeLocales.find(l => l.code === localeCode)
    toast.success(`${locale?.flag} ${locale?.name} translation removed`)
  }

  // Merge base content with locale-specific content
  const content: ContentData = useMemo(() => {
    const localeData = localeContentData[contentId]?.[activeLocale]
    if (localeData) {
      return {
        ...baseContent,
        title: localeData.title,
        content: localeData.content,
        metaDescription: localeData.metaDescription,
        slug: localeData.slug,
        targetKeyword: localeData.targetKeyword,
        wordCount: localeData.wordCount,
        keywordCount: localeData.keywordCount,
      }
    }
    return baseContent
  }, [baseContent, contentId, activeLocale])

  const handleCopy = () => {
    toast('Content duplicated')
  }

  const handleDelete = () => {
    toast('Content deleted')
    router.back()
  }

  const isPrimaryLocale = (code: string) => baseContent.primaryLocale?.code === code

  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border h-[82px]">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => router.back()}>
            <ArrowLeft className="h-3.5 w-3.5" />
          </Button>
          <h1 className="text-lg font-medium">Content Details</h1>
        </div>
        
        {/* Action Button Group */}
        <div className="flex items-center">
          <div className="flex items-center border border-border rounded-full overflow-hidden">
            {/* Publish - Primary action */}
            <Button 
              size="sm" 
              className="rounded-none border-0 bg-foreground text-background hover:bg-foreground/90 px-4"
              onClick={() => setShowPublishModal(true)}
            >
              <Send className="h-4 w-4 mr-2" />
              Publish
            </Button>
            
            {/* Divider */}
            <div className="w-px h-6 bg-border" />
            
            {/* Edit */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-none border-0 px-3"
              onClick={() => router.push(`/dashboard/brands/${projectId}/content/${contentId}/edit`)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            
            {/* Divider */}
            <div className="w-px h-6 bg-border" />
            
            {/* More actions dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-none border-0 px-3">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Secondary Nav - Locale Tabs */}
      {activeLocales.length > 0 && (
        <div className="flex items-center gap-4 px-6 py-3 border-b border-border">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Language</span>
          <div className="flex items-center gap-1">
            {activeLocales.map((locale) => (
              <div
                key={locale.code}
                className={cn(
                  "group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  activeLocale === locale.code
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <button
                  onClick={() => setActiveLocale(locale.code)}
                  className="flex items-center gap-1.5"
                >
                  <span>{locale.flag}</span>
                  <span>{locale.name}</span>
                  {locale.status !== 'published' && (
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full",
                      locale.status === 'draft' ? "bg-background text-muted-foreground" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    )}>
                      {locale.status}
                    </span>
                  )}
                </button>
                {/* Delete button - hidden for primary locale */}
                {!isPrimaryLocale(locale.code) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveLocale(locale.code)
                    }}
                    className="opacity-0 group-hover:opacity-100 ml-1 p-0.5 rounded hover:bg-background transition-opacity"
                    title="Remove translation"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                )}
              </div>
            ))}
            
            {/* Add more dropdown */}
            {availableToAdd.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add more</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto">
                  {availableToAdd.map((locale) => (
                    <DropdownMenuItem
                      key={locale.code}
                      onClick={() => handleAddLocale(locale)}
                      className="cursor-pointer"
                    >
                      <span className="mr-2">{locale.flag}</span>
                      <span>{locale.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      )}
      
      {/* Publish Modal */}
      <PublishModal
        open={showPublishModal}
        onOpenChange={setShowPublishModal}
        brandId={projectId}
      />

      {/* Content with Sidebar */}
      <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
        {/* Main Content Panel - 70% */}
        <ResizablePanel defaultSize={70} minSize={50}>
          <div className="h-full overflow-auto">
            <ArticleContent content={content} />
          </div>
        </ResizablePanel>

        {/* Resizable Handle */}
        <ResizableHandle withHandle />

        {/* Sidebar Panel - 30% */}
        <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
          <div className="h-full">
            <ContentDetailSidebar content={content} brandId={projectId} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
