'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  PromptFormSheet,
  SuggestionsSheet,
  ImportPromptsModal,
  ExportPromptsModal,
  type TrackedPrompt,
  type PromptFormData,
  type SuggestedPrompt,
} from '@/components/brands/prompts'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Badge } from '@workspace/ui/components/badge'
import { Label } from '@workspace/ui/components/label'
import { Textarea } from '@workspace/ui/components/textarea'
import { Checkbox } from '@workspace/ui/components/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@workspace/ui/components/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import {
  Plus,
  Search,
  Sparkles,
  Loader2,
  Play,
  Pencil,
  Trash2,
  Eye,
  ArrowLeft,
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Download,
  Upload,
  Users,
} from 'lucide-react'
import { cn } from '@workspace/common/lib'
import {
  MOCK_KEYWORDS,
  MOCK_COMPETITORS,
  MOCK_PROMPTS,
  SUGGESTED_KEYWORDS,
  INTENT_LABELS,
  type TrackedKeyword,
  type TrackedCompetitor,
  type SuggestedKeywordItem,
  type KeywordIntent,
  type KeywordTrend,
} from '@workspace/common/lib/mocks/tracking'
import { FEATURE_FLAGS } from '@/lib/feature-flags'

// ============================================================
// PROMPTS TYPES & CONSTANTS
// ============================================================
const DEFAULT_PROMPT_FORM_DATA: PromptFormData = {
  promptText: '',
  location: '',
  notes: '',
}

// Note: Tracking prompts feature not yet fully implemented
// This is separate from regular prompts - it's for AI visibility tracking
// Will need a separate database schema and tRPC endpoint

// ============================================================
// KEYWORDS TYPES & CONSTANTS
// ============================================================
interface KeywordFormData {
  keyword: string
  intent: KeywordIntent
  notes: string
}

const DEFAULT_KEYWORD_FORM_DATA: KeywordFormData = {
  keyword: '',
  intent: 'informational',
  notes: '',
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================
function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

function getDifficultyLabel(difficulty: number): string {
  if (difficulty >= 70) return 'Hard'
  if (difficulty >= 50) return 'Medium'
  if (difficulty >= 30) return 'Easy'
  return 'Very Easy'
}

function TrendIcon({ trend }: { trend: KeywordTrend }) {
  switch (trend) {
    case 'up': return <TrendingUp className="h-4 w-4 text-foreground" />
    case 'down': return <TrendingDown className="h-4 w-4 text-muted-foreground" />
    default: return <Minus className="h-4 w-4 text-muted-foreground" />
  }
}

// ============================================================
// SHARED CONSTANTS
// ============================================================
const PAGE_SIZE_OPTIONS = [10, 20, 50] as const
type PromptSortKey = 'prompt' | 'status' | 'visibility' | 'lastScan'
type KeywordSortKey = 'keyword' | 'searchVolume' | 'difficulty' | 'cpc' | 'position' | 'lastUpdated'
type CompetitorSortKey = 'name' | 'shareOfVoice' | 'avgPosition' | 'mentionCount'
type SortDirection = 'asc' | 'desc'

// ============================================================
// TAB TYPE
// ============================================================
type TrackingTab = 'prompts' | 'keywords' | 'competitors'

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================
export default function TrackingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const projectId = (params.id || params.projectId) as string

  // Get tab from URL query param, default to 'prompts'
  const tabFromUrl = searchParams.get('tab') as TrackingTab | null
  const initialTab: TrackingTab = tabFromUrl && ['prompts', 'keywords', 'competitors'].includes(tabFromUrl)
    ? tabFromUrl
    : 'prompts'

  // Tab state
  const [activeTab, setActiveTab] = useState<TrackingTab>(initialTab)

  // ============================================================
  // PROMPTS STATE
  // ============================================================
  // TODO: TrackedPrompt is different from regular prompts - it's for AI visibility tracking
  // For now, we'll keep the mock data until the tracking feature is fully implemented
  // When ready, create a separate tRPC endpoint for tracked prompts
  const [prompts, setPrompts] = useState<TrackedPrompt[]>([])
  const [promptSearchQuery, setPromptSearchQuery] = useState('')
  const [isPromptFormSheetOpen, setIsPromptFormSheetOpen] = useState(false)
  const [isPromptSuggestionsSheetOpen, setIsPromptSuggestionsSheetOpen] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<TrackedPrompt | null>(null)
  const [promptFormData, setPromptFormData] = useState<PromptFormData>(DEFAULT_PROMPT_FORM_DATA)
  const [promptToDelete, setPromptToDelete] = useState<string | null>(null)
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [promptSortKey, setPromptSortKey] = useState<PromptSortKey>('lastScan')
  const [promptSortDirection, setPromptSortDirection] = useState<SortDirection>('desc')
  const [promptCurrentPage, setPromptCurrentPage] = useState(1)
  const [promptPageSize, setPromptPageSize] = useState<number>(10)
  const [selectedPromptIds, setSelectedPromptIds] = useState<Set<string>>(new Set())
  const [promptsLoading, setPromptsLoading] = useState(true)
  const [promptSaving, setPromptSaving] = useState(false)

  // ============================================================
  // PROMPTS IMPORT/EXPORT STATE
  // ============================================================
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [googleIntegrationId, setGoogleIntegrationId] = useState<string | null>(null)

  // ============================================================
  // KEYWORDS STATE
  // ============================================================
  const [keywords, setKeywords] = useState<TrackedKeyword[]>([])
  const [keywordSearchQuery, setKeywordSearchQuery] = useState('')
  const [isKeywordFormSheetOpen, setIsKeywordFormSheetOpen] = useState(false)
  const [isKeywordSuggestionsSheetOpen, setIsKeywordSuggestionsSheetOpen] = useState(false)
  const [editingKeyword, setEditingKeyword] = useState<TrackedKeyword | null>(null)
  const [keywordFormData, setKeywordFormData] = useState<KeywordFormData>(DEFAULT_KEYWORD_FORM_DATA)
  const [keywordSortKey, setKeywordSortKey] = useState<KeywordSortKey>('searchVolume')
  const [keywordSortDirection, setKeywordSortDirection] = useState<SortDirection>('desc')
  const [keywordCurrentPage, setKeywordCurrentPage] = useState(1)
  const [keywordPageSize, setKeywordPageSize] = useState<number>(10)
  const [keywordsLoading, setKeywordsLoading] = useState(true)

  // ============================================================
  // COMPETITORS STATE
  // ============================================================
  const [competitors, setCompetitors] = useState<TrackedCompetitor[]>([])
  const [competitorSearchQuery, setCompetitorSearchQuery] = useState('')
  const [competitorSortKey, setCompetitorSortKey] = useState<CompetitorSortKey>('shareOfVoice')
  const [competitorSortDirection, setCompetitorSortDirection] = useState<SortDirection>('desc')
  const [competitorCurrentPage, setCompetitorCurrentPage] = useState(1)
  const [competitorPageSize, setCompetitorPageSize] = useState<number>(10)
  const [competitorsLoading, setCompetitorsLoading] = useState(true)


  // ============================================================
  // LOAD DATA
  // ============================================================
  useEffect(() => {
    // Load mock prompts for PADISO.co demo
    const promptTimer = setTimeout(() => {
      // Convert mock prompts to TrackedPrompt format
      const loadedPrompts: TrackedPrompt[] = MOCK_PROMPTS.map((p) => ({
        id: p.id,
        brandId: p.brandId,
        prompt: p.prompt,
        notes: p.notes,
        lastVisibilityScore: p.lastVisibilityScore,
        lastMentionPosition: p.lastMentionPosition,
        lastScanDate: p.lastScanDate,
        isActive: p.isActive,
        scanStatus: p.scanStatus,
        targetLocation: p.targetLocation,
        targetLanguage: p.targetLanguage,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }))
      setPrompts(loadedPrompts)
      setPromptsLoading(false)
    }, 500)
    // Load mock keywords
    const keywordTimer = setTimeout(() => {
      setKeywords(MOCK_KEYWORDS)
      setKeywordsLoading(false)
    }, 500)
    // Load mock competitors
    const competitorTimer = setTimeout(() => {
      setCompetitors(MOCK_COMPETITORS)
      setCompetitorsLoading(false)
    }, 500)
    return () => {
      clearTimeout(promptTimer)
      clearTimeout(keywordTimer)
      clearTimeout(competitorTimer)
    }
  }, [])

  // ============================================================
  // PROMPTS HANDLERS
  // ============================================================
  const resetPromptForm = () => {
    setPromptFormData(DEFAULT_PROMPT_FORM_DATA)
    setEditingPrompt(null)
  }

  const handlePromptFormChange = (data: Partial<PromptFormData>) => {
    setPromptFormData((prev) => ({ ...prev, ...data }))
  }

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPromptSaving(true)
    
    if (editingPrompt) {
      // Update existing prompt in local state
      setPrompts((prev) =>
        prev.map((p) =>
          p.id === editingPrompt.id
            ? {
                ...p,
                prompt: promptFormData.promptText,
                targetLocation: promptFormData.location || null,
                notes: promptFormData.notes || null,
              }
            : p
        )
      )
      toast.success('Prompt updated!')
    } else {
      // Create new prompt in local state
      const newPrompt: TrackedPrompt = {
        id: crypto.randomUUID(),
        brandId: projectId,
        prompt: promptFormData.promptText,
        targetLocation: promptFormData.location || null,
        targetLanguage: null,
        notes: promptFormData.notes || null,
        isActive: true,
        scanStatus: 'IDLE',
        lastScanDate: null,
        lastVisibilityScore: null,
        lastMentionPosition: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setPrompts((prev) => [newPrompt, ...prev])
      toast.success('Prompt created!')
    }
    
    resetPromptForm()
    setIsPromptFormSheetOpen(false)
    setPromptSaving(false)
  }

  const handlePromptEdit = (prompt: TrackedPrompt) => {
    setEditingPrompt(prompt)
    setPromptFormData({
      promptText: prompt.prompt,
      location: prompt.targetLocation || '',
      notes: prompt.notes || '',
    })
    setIsPromptFormSheetOpen(true)
  }

  const handlePromptDelete = (id: string) => {
    setPromptToDelete(id)
  }

  const confirmPromptDelete = () => {
    if (promptToDelete) {
      setPrompts((prev) => prev.filter((p) => p.id !== promptToDelete))
      toast.success('Prompt deleted!')
      setPromptToDelete(null)
    }
  }

  const handlePromptToggleActive = (id: string, currentStatus: boolean) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !currentStatus } : p))
    )
    toast.success(!currentStatus ? 'Prompt activated!' : 'Prompt paused!')
  }

  const handlePromptRunScan = (id: string) => {
    // Set status to SCANNING
    setPrompts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, scanStatus: 'SCANNING' as const } : p
      )
    )
    toast.success('Scan started!')
    
    // Simulate scan completion after 3 seconds
    setTimeout(() => {
      setPrompts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                scanStatus: 'IDLE' as const,
                lastScanDate: new Date(),
                lastVisibilityScore: Math.floor(Math.random() * 40) + 60, // Random score 60-100
              }
            : p
        )
      )
      toast.success('Scan completed!')
    }, 3000)
  }

  // ============================================================
  // BULK SELECTION HANDLERS
  // ============================================================
  const handleSelectPrompt = (id: string, selected: boolean) => {
    setSelectedPromptIds((prev) => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }

  const handleSelectAllPrompts = (selected: boolean) => {
    if (selected) {
      setSelectedPromptIds(new Set(paginatedPrompts.map((p) => p.id)))
    } else {
      setSelectedPromptIds(new Set())
    }
  }

  const handleBulkDeletePrompts = () => {
    setBulkDeleteOpen(true)
  }

  const confirmBulkDelete = () => {
    const ids = Array.from(selectedPromptIds)
    if (ids.length === 0) return
    setPrompts((prev) => prev.filter((p) => !ids.includes(p.id)))
    setSelectedPromptIds(new Set())
    toast.success(`${ids.length} prompt(s) deleted!`)
    setBulkDeleteOpen(false)
  }

  const handleBulkScanPrompts = () => {
    const ids = Array.from(selectedPromptIds)
    if (ids.length === 0) return
    
    // Set all selected prompts to SCANNING
    setPrompts((prev) =>
      prev.map((p) =>
        ids.includes(p.id) ? { ...p, scanStatus: 'SCANNING' as const } : p
      )
    )
    setSelectedPromptIds(new Set())
    toast.success(`Scanning ${ids.length} prompt(s)...`)
    
    // Simulate scan completion after 3 seconds
    setTimeout(() => {
      setPrompts((prev) =>
        prev.map((p) =>
          ids.includes(p.id)
            ? {
                ...p,
                scanStatus: 'IDLE' as const,
                lastScanDate: new Date(),
                lastVisibilityScore: Math.floor(Math.random() * 40) + 60,
              }
            : p
        )
      )
      toast.success('Scans completed!')
    }, 3000)
  }

  const handleBulkToggleActive = () => {
    const ids = Array.from(selectedPromptIds)
    if (ids.length === 0) return
    
    // Get current active status of selected prompts
    const selectedPromptsForToggle = prompts.filter((p) => ids.includes(p.id))
    const allActive = selectedPromptsForToggle.every((p) => p.isActive)
    const newStatus = !allActive

    setPrompts((prev) =>
      prev.map((p) => (ids.includes(p.id) ? { ...p, isActive: newStatus } : p))
    )
    setSelectedPromptIds(new Set())
    toast.success(`${ids.length} prompt(s) ${newStatus ? 'activated' : 'paused'}`)
  }

  const handlePromptSelectSuggestion = (suggestion: SuggestedPrompt) => {
    // Create a new prompt from the suggestion
    const newPrompt: TrackedPrompt = {
      id: crypto.randomUUID(),
      brandId: projectId,
      prompt: suggestion.prompt,
      targetLocation: null,
      targetLanguage: null,
      notes: null,
      isActive: true,
      scanStatus: 'IDLE',
      lastScanDate: null,
      lastVisibilityScore: null,
      lastMentionPosition: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setPrompts((prev) => [newPrompt, ...prev])
    setIsPromptSuggestionsSheetOpen(false)
    toast.success('Prompt added from suggestions!')
  }

  const handlePromptSort = (key: PromptSortKey) => {
    if (promptSortKey === key) {
      setPromptSortDirection(promptSortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setPromptSortKey(key)
      setPromptSortDirection('desc')
    }
    setPromptCurrentPage(1)
  }

  // ============================================================
  // KEYWORDS HANDLERS
  // ============================================================
  const resetKeywordForm = () => {
    setKeywordFormData(DEFAULT_KEYWORD_FORM_DATA)
    setEditingKeyword(null)
  }

  const handleKeywordFormChange = (data: Partial<KeywordFormData>) => {
    setKeywordFormData((prev) => ({ ...prev, ...data }))
  }

  const handleKeywordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!keywordFormData.keyword.trim()) {
      toast.error('Please enter a keyword')
      return
    }
    if (editingKeyword) {
      setKeywords((prev) =>
        prev.map((k) =>
          k.id === editingKeyword.id
            ? { ...k, keyword: keywordFormData.keyword, intent: keywordFormData.intent, notes: keywordFormData.notes || null }
            : k
        )
      )
      toast.success('Keyword updated!')
    } else {
      const newKeyword: TrackedKeyword = {
        id: crypto.randomUUID(),
        keyword: keywordFormData.keyword,
        searchVolume: Math.floor(Math.random() * 10000) + 500,
        difficulty: Math.floor(Math.random() * 60) + 20,
        cpc: parseFloat((Math.random() * 15 + 1).toFixed(2)),
        trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as KeywordTrend,
        intent: keywordFormData.intent,
        isTracking: true,
        position: null,
        lastUpdated: new Date().toISOString(),
        notes: keywordFormData.notes || null,
      }
      setKeywords((prev) => [newKeyword, ...prev])
      toast.success('Keyword added!')
    }
    resetKeywordForm()
    setIsKeywordFormSheetOpen(false)
  }

  const handleKeywordEdit = (keyword: TrackedKeyword) => {
    setEditingKeyword(keyword)
    setKeywordFormData({ keyword: keyword.keyword, intent: keyword.intent, notes: keyword.notes || '' })
    setIsKeywordFormSheetOpen(true)
  }

  const handleKeywordDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this keyword?')) {
      setKeywords((prev) => prev.filter((k) => k.id !== id))
      toast.success('Keyword deleted!')
    }
  }

  const handleKeywordToggleTracking = (id: string, currentStatus: boolean) => {
    setKeywords((prev) => prev.map((k) => (k.id === id ? { ...k, isTracking: !currentStatus } : k)))
    toast.success(currentStatus ? 'Tracking paused' : 'Tracking enabled')
  }

  const handleKeywordSelectSuggestion = (suggestion: SuggestedKeywordItem) => {
    const newKeyword: TrackedKeyword = {
      id: crypto.randomUUID(),
      keyword: suggestion.keyword,
      searchVolume: suggestion.searchVolume,
      difficulty: suggestion.difficulty,
      cpc: suggestion.cpc,
      trend: 'stable',
      intent: suggestion.intent,
      isTracking: true,
      position: null,
      lastUpdated: new Date().toISOString(),
      notes: null,
    }
    setKeywords((prev) => [newKeyword, ...prev])
    setIsKeywordSuggestionsSheetOpen(false)
    toast.success('Keyword added from suggestions!')
  }

  const handleKeywordSort = (key: KeywordSortKey) => {
    if (keywordSortKey === key) {
      setKeywordSortDirection(keywordSortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setKeywordSortKey(key)
      setKeywordSortDirection('desc')
    }
    setKeywordCurrentPage(1)
  }

  // ============================================================
  // COMPETITORS HANDLERS
  // ============================================================
  const handleCompetitorToggleTracking = (id: string, currentStatus: boolean) => {
    setCompetitors((prev) => prev.map((c) => (c.id === id ? { ...c, isTracking: !currentStatus } : c)))
    toast.success(currentStatus ? 'Tracking paused' : 'Tracking enabled')
  }

  const handleCompetitorDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this competitor?')) {
      setCompetitors((prev) => prev.filter((c) => c.id !== id))
      toast.success('Competitor deleted!')
    }
  }

  const handleCompetitorSort = (key: CompetitorSortKey) => {
    if (competitorSortKey === key) {
      setCompetitorSortDirection(competitorSortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setCompetitorSortKey(key)
      setCompetitorSortDirection('desc')
    }
    setCompetitorCurrentPage(1)
  }

  // ============================================================
  // PROMPTS DATA PROCESSING
  // ============================================================
  const filteredPrompts = prompts.filter((prompt) => {
    if (!promptSearchQuery.trim()) return true
    const query = promptSearchQuery.toLowerCase()
    return prompt.prompt.toLowerCase().includes(query)
  })

  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    let comparison = 0
    switch (promptSortKey) {
      case 'prompt': comparison = a.prompt.localeCompare(b.prompt); break
      case 'status': comparison = (a.isActive ? 1 : 0) - (b.isActive ? 1 : 0); break
      case 'visibility': comparison = (a.lastVisibilityScore ?? -1) - (b.lastVisibilityScore ?? -1); break
      case 'lastScan':
        const dateA = a.lastScanDate ? new Date(a.lastScanDate).getTime() : 0
        const dateB = b.lastScanDate ? new Date(b.lastScanDate).getTime() : 0
        comparison = dateA - dateB
        break
    }
    return promptSortDirection === 'asc' ? comparison : -comparison
  })

  const promptTotalItems = sortedPrompts.length
  const promptTotalPages = Math.ceil(promptTotalItems / promptPageSize)
  const promptValidCurrentPage = Math.max(1, Math.min(promptCurrentPage, promptTotalPages || 1))
  const promptStartIndex = (promptValidCurrentPage - 1) * promptPageSize
  const promptEndIndex = Math.min(promptStartIndex + promptPageSize, promptTotalItems)
  const paginatedPrompts = sortedPrompts.slice(promptStartIndex, promptEndIndex)

  // ============================================================
  // KEYWORDS DATA PROCESSING
  // ============================================================
  const filteredKeywords = keywords.filter((keyword) => {
    if (!keywordSearchQuery.trim()) return true
    const query = keywordSearchQuery.toLowerCase()
    return keyword.keyword.toLowerCase().includes(query) || INTENT_LABELS[keyword.intent].toLowerCase().includes(query)
  })

  const sortedKeywords = [...filteredKeywords].sort((a, b) => {
    let comparison = 0
    switch (keywordSortKey) {
      case 'keyword': comparison = a.keyword.localeCompare(b.keyword); break
      case 'searchVolume': comparison = a.searchVolume - b.searchVolume; break
      case 'difficulty': comparison = a.difficulty - b.difficulty; break
      case 'cpc': comparison = a.cpc - b.cpc; break
      case 'position': comparison = (a.position ?? 999) - (b.position ?? 999); break
      case 'lastUpdated':
        const dateA = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0
        const dateB = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0
        comparison = dateA - dateB
        break
    }
    return keywordSortDirection === 'asc' ? comparison : -comparison
  })

  const keywordTotalItems = sortedKeywords.length
  const keywordTotalPages = Math.ceil(keywordTotalItems / keywordPageSize)
  const keywordValidCurrentPage = Math.max(1, Math.min(keywordCurrentPage, keywordTotalPages || 1))
  const keywordStartIndex = (keywordValidCurrentPage - 1) * keywordPageSize
  const keywordEndIndex = Math.min(keywordStartIndex + keywordPageSize, keywordTotalItems)
  const paginatedKeywords = sortedKeywords.slice(keywordStartIndex, keywordEndIndex)

  // ============================================================
  // COMPETITORS DATA PROCESSING
  // ============================================================
  const filteredCompetitors = competitors.filter((competitor) => {
    if (!competitorSearchQuery.trim()) return true
    const query = competitorSearchQuery.toLowerCase()
    return competitor.name.toLowerCase().includes(query) || competitor.domain.toLowerCase().includes(query)
  })

  const sortedCompetitors = [...filteredCompetitors].sort((a, b) => {
    let comparison = 0
    switch (competitorSortKey) {
      case 'name': comparison = a.name.localeCompare(b.name); break
      case 'shareOfVoice': comparison = a.shareOfVoice - b.shareOfVoice; break
      case 'avgPosition': comparison = a.avgPosition - b.avgPosition; break
      case 'mentionCount': comparison = a.mentionCount - b.mentionCount; break
    }
    return competitorSortDirection === 'asc' ? comparison : -comparison
  })

  const competitorTotalItems = sortedCompetitors.length
  const competitorTotalPages = Math.ceil(competitorTotalItems / competitorPageSize)
  const competitorValidCurrentPage = Math.max(1, Math.min(competitorCurrentPage, competitorTotalPages || 1))
  const competitorStartIndex = (competitorValidCurrentPage - 1) * competitorPageSize
  const competitorEndIndex = Math.min(competitorStartIndex + competitorPageSize, competitorTotalItems)
  const paginatedCompetitors = sortedCompetitors.slice(competitorStartIndex, competitorEndIndex)

  // ============================================================
  // COMPUTED VALUES
  // ============================================================
  const isPromptsLoading = promptsLoading
  const isPromptSaving = promptSaving
  const trackingKeywordsCount = keywords.filter((k) => k.isTracking).length
  const trackingCompetitorsCount = competitors.filter((c) => c.isTracking).length

  // ============================================================
  // RENDER
  // ============================================================
  
  // If tabs are coming soon, just show prompts table directly without tabs
  if (FEATURE_FLAGS.AI_TRACKING_TABS_COMING_SOON) {
    return (
      <div className="relative flex min-w-0 flex-2 flex-col items-center">
        <div className="mx-auto flex w-full flex-col">
          <PromptsTabContent
            projectId={projectId}
            prompts={paginatedPrompts}
            allPrompts={prompts}
            isLoading={isPromptsLoading}
            searchQuery={promptSearchQuery}
            onSearchChange={(v) => { setPromptSearchQuery(v); setPromptCurrentPage(1) }}
            sortKey={promptSortKey}
            sortDirection={promptSortDirection}
            onSort={handlePromptSort}
            currentPage={promptCurrentPage}
            pageSize={promptPageSize}
            totalItems={promptTotalItems}
            totalPages={promptTotalPages}
            startIndex={promptStartIndex}
            endIndex={promptEndIndex}
            onPageChange={setPromptCurrentPage}
            onPageSizeChange={(v) => { setPromptPageSize(v); setPromptCurrentPage(1) }}
            onEdit={handlePromptEdit}
            onDelete={handlePromptDelete}
            onToggleActive={handlePromptToggleActive}
            onRunScan={handlePromptRunScan}
            selectedIds={selectedPromptIds}
            onSelectOne={handleSelectPrompt}
            onSelectAll={handleSelectAllPrompts}
            onBulkDelete={handleBulkDeletePrompts}
            onBulkScan={handleBulkScanPrompts}
            onBulkToggleActive={handleBulkToggleActive}
            onNewPrompt={() => { resetPromptForm(); setIsPromptFormSheetOpen(true) }}
            onSuggestions={() => setIsPromptSuggestionsSheetOpen(true)}
            onImport={() => setIsImportModalOpen(true)}
            onExport={() => setIsExportModalOpen(true)}
          />
        </div>

        {/* Prompt Form Sheet */}
        <PromptFormSheet
          isOpen={isPromptFormSheetOpen}
          onOpenChange={setIsPromptFormSheetOpen}
          editingPrompt={editingPrompt}
          formData={promptFormData}
          onFormChange={handlePromptFormChange}
          onSubmit={handlePromptSubmit}
          onCancel={() => { resetPromptForm(); setIsPromptFormSheetOpen(false) }}
          isSaving={isPromptSaving}
        />

        {/* Prompt Suggestions Sheet */}
        <SuggestionsSheet
          projectId={projectId}
          isOpen={isPromptSuggestionsSheetOpen}
          onOpenChange={setIsPromptSuggestionsSheetOpen}
          onSelectSuggestion={handlePromptSelectSuggestion}
        />

        {/* Delete Prompt Confirmation Modal */}
        <AlertDialog open={promptToDelete !== null} onOpenChange={(open) => !open && setPromptToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Prompt</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this prompt? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmPromptDelete}
                className="bg-destructive text-white hover:bg-destructive/90 focus:ring-destructive"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Bulk Delete Confirmation Modal */}
        <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {selectedPromptIds.size} Prompt(s)</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedPromptIds.size} selected prompt(s)? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmBulkDelete}
                className="bg-destructive text-white hover:bg-destructive/90 focus:ring-destructive"
              >
                Delete {selectedPromptIds.size} Prompt(s)
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Import Prompts Modal */}
        <ImportPromptsModal
          open={isImportModalOpen}
          onOpenChange={setIsImportModalOpen}
          projectId={projectId}
          googleIntegrationId={googleIntegrationId}
          onConnectGoogle={() => toast.info('Google connection coming soon')}
          onImportComplete={() => toast.success('Import completed!')}
        />

        {/* Export Prompts Modal */}
        <ExportPromptsModal
          open={isExportModalOpen}
          onOpenChange={setIsExportModalOpen}
          projectId={projectId}
          prompts={prompts}
          selectedIds={selectedPromptIds}
          googleIntegrationId={googleIntegrationId}
          onConnectGoogle={() => toast.info('Google connection coming soon')}
        />
      </div>
    )
  }
  
  return (
    <div className="relative flex min-w-0 flex-2 flex-col items-center">
      <div className="mx-auto flex w-full flex-col">

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TrackingTab)} className="w-full">
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6">
            <TabsList className="bg-transparent ring-0 dark:bg-transparent dark:ring-0 p-1 gap-2 w-max md:w-auto">
              <TabsTrigger
                value="prompts"
                className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Prompts
              </TabsTrigger>
              <TabsTrigger
                value="keywords"
                className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Keywords
              </TabsTrigger>
              <TabsTrigger
                value="competitors"
                className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Competitors
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Prompts Tab */}
          <TabsContent value="prompts" className="mt-0">
            <PromptsTabContent
              projectId={projectId}
              prompts={paginatedPrompts}
              allPrompts={prompts}
              isLoading={isPromptsLoading}
              searchQuery={promptSearchQuery}
              onSearchChange={(v) => { setPromptSearchQuery(v); setPromptCurrentPage(1) }}
              sortKey={promptSortKey}
              sortDirection={promptSortDirection}
              onSort={handlePromptSort}
              currentPage={promptCurrentPage}
              pageSize={promptPageSize}
              totalItems={promptTotalItems}
              totalPages={promptTotalPages}
              startIndex={promptStartIndex}
              endIndex={promptEndIndex}
              onPageChange={setPromptCurrentPage}
              onPageSizeChange={(v) => { setPromptPageSize(v); setPromptCurrentPage(1) }}
              onEdit={handlePromptEdit}
              onDelete={handlePromptDelete}
              onToggleActive={handlePromptToggleActive}
              onRunScan={handlePromptRunScan}
              selectedIds={selectedPromptIds}
              onSelectOne={handleSelectPrompt}
              onSelectAll={handleSelectAllPrompts}
              onBulkDelete={handleBulkDeletePrompts}
              onBulkScan={handleBulkScanPrompts}
              onBulkToggleActive={handleBulkToggleActive}
              onNewPrompt={() => { resetPromptForm(); setIsPromptFormSheetOpen(true) }}
              onSuggestions={() => setIsPromptSuggestionsSheetOpen(true)}
              onImport={() => setIsImportModalOpen(true)}
              onExport={() => setIsExportModalOpen(true)}
            />
          </TabsContent>

          {/* Keywords Tab */}
          <TabsContent value="keywords" className="mt-0">
            <KeywordsTabContent
              projectId={projectId}
              keywords={paginatedKeywords}
              isLoading={keywordsLoading}
              searchQuery={keywordSearchQuery}
              onSearchChange={(v) => { setKeywordSearchQuery(v); setKeywordCurrentPage(1) }}
              sortKey={keywordSortKey}
              sortDirection={keywordSortDirection}
              onSort={handleKeywordSort}
              currentPage={keywordCurrentPage}
              pageSize={keywordPageSize}
              totalItems={keywordTotalItems}
              totalPages={keywordTotalPages}
              startIndex={keywordStartIndex}
              endIndex={keywordEndIndex}
              onPageChange={setKeywordCurrentPage}
              onPageSizeChange={(v) => { setKeywordPageSize(v); setKeywordCurrentPage(1) }}
              onEdit={handleKeywordEdit}
              onDelete={handleKeywordDelete}
              onToggleTracking={handleKeywordToggleTracking}
              onNewKeyword={() => { resetKeywordForm(); setIsKeywordFormSheetOpen(true) }}
              onSuggestions={() => setIsKeywordSuggestionsSheetOpen(true)}
              trackingCount={trackingKeywordsCount}
            />
          </TabsContent>

          {/* Competitors Tab */}
          <TabsContent value="competitors" className="mt-0">
            <CompetitorsTabContent
              projectId={projectId}
              competitors={paginatedCompetitors}
              isLoading={competitorsLoading}
              searchQuery={competitorSearchQuery}
              onSearchChange={(v) => { setCompetitorSearchQuery(v); setCompetitorCurrentPage(1) }}
              sortKey={competitorSortKey}
              sortDirection={competitorSortDirection}
              onSort={handleCompetitorSort}
              currentPage={competitorCurrentPage}
              pageSize={competitorPageSize}
              totalItems={competitorTotalItems}
              totalPages={competitorTotalPages}
              startIndex={competitorStartIndex}
              endIndex={competitorEndIndex}
              onPageChange={setCompetitorCurrentPage}
              onPageSizeChange={(v) => { setCompetitorPageSize(v); setCompetitorCurrentPage(1) }}
              onDelete={handleCompetitorDelete}
              onToggleTracking={handleCompetitorToggleTracking}
              trackingCount={trackingCompetitorsCount}
            />
          </TabsContent>


        </Tabs>
      </div>

      {/* Prompt Form Sheet */}
      <PromptFormSheet
        isOpen={isPromptFormSheetOpen}
        onOpenChange={setIsPromptFormSheetOpen}
        editingPrompt={editingPrompt}
        formData={promptFormData}
        onFormChange={handlePromptFormChange}
        onSubmit={handlePromptSubmit}
        onCancel={() => { resetPromptForm(); setIsPromptFormSheetOpen(false) }}
        isSaving={isPromptSaving}
      />

      {/* Prompt Suggestions Sheet */}
      <SuggestionsSheet
        projectId={projectId}
        isOpen={isPromptSuggestionsSheetOpen}
        onOpenChange={setIsPromptSuggestionsSheetOpen}
        onSelectSuggestion={handlePromptSelectSuggestion}
      />

      {/* Keyword Form Sheet */}
      <Sheet open={isKeywordFormSheetOpen} onOpenChange={setIsKeywordFormSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{editingKeyword ? 'Edit Keyword' : 'Add Keyword'}</SheetTitle>
            <SheetDescription>
              {editingKeyword ? 'Update keyword details and tracking settings.' : 'Add a new keyword to track its rankings and performance.'}
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleKeywordSubmit} className="flex flex-col gap-6 mt-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="keyword">Keyword</Label>
              <Input id="keyword" placeholder="e.g., best project management software" value={keywordFormData.keyword} onChange={(e) => handleKeywordFormChange({ keyword: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="intent">Search Intent</Label>
              <Select value={keywordFormData.intent} onValueChange={(value: KeywordIntent) => handleKeywordFormChange({ intent: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="informational">Informational</SelectItem>
                  <SelectItem value="transactional">Transactional</SelectItem>
                  <SelectItem value="navigational">Navigational</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" placeholder="Add context..." value={keywordFormData.notes} onChange={(e) => handleKeywordFormChange({ notes: e.target.value })} rows={3} />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => { resetKeywordForm(); setIsKeywordFormSheetOpen(false) }}>Cancel</Button>
              <Button type="submit" className="flex-1">{editingKeyword ? 'Update' : 'Add Keyword'}</Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* Keyword Suggestions Sheet */}
      <Sheet open={isKeywordSuggestionsSheetOpen} onOpenChange={setIsKeywordSuggestionsSheetOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Keyword Suggestions</SheetTitle>
            <SheetDescription>AI-powered keyword suggestions based on your industry.</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-6">
            {SUGGESTED_KEYWORDS.map((suggestion, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">{suggestion.keyword}</span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{formatNumber(suggestion.searchVolume)}/mo</span>
                    <span>{getDifficultyLabel(suggestion.difficulty)}</span>
                    <span>${suggestion.cpc.toFixed(2)} CPC</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleKeywordSelectSuggestion(suggestion)}><Plus className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Prompt Confirmation Modal */}
      <AlertDialog open={promptToDelete !== null} onOpenChange={(open) => !open && setPromptToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Prompt</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this prompt? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmPromptDelete}
              className="bg-destructive text-white hover:bg-destructive/90 focus:ring-destructive"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Modal */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedPromptIds.size} Prompt(s)</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedPromptIds.size} selected prompt(s)? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-destructive text-white hover:bg-destructive/90 focus:ring-destructive"
            >
              Delete {selectedPromptIds.size} Prompt(s)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import Prompts Modal */}
      <ImportPromptsModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        projectId={projectId}
        googleIntegrationId={googleIntegrationId}
        onConnectGoogle={() => toast.info('Google connection coming soon')}
        onImportComplete={() => toast.success('Import completed!')}
      />

      {/* Export Prompts Modal */}
      <ExportPromptsModal
        open={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
        projectId={projectId}
        prompts={prompts}
        selectedIds={selectedPromptIds}
        googleIntegrationId={googleIntegrationId}
        onConnectGoogle={() => toast.info('Google connection coming soon')}
      />
    </div>
  )
}

// ============================================================
// PROMPTS TAB CONTENT
// ============================================================
interface PromptsTabContentProps {
  projectId: string
  prompts: TrackedPrompt[]
  allPrompts: TrackedPrompt[]
  isLoading: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  sortKey: PromptSortKey
  sortDirection: SortDirection
  onSort: (key: PromptSortKey) => void
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  startIndex: number
  endIndex: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onEdit: (prompt: TrackedPrompt) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string, currentStatus: boolean) => void
  onRunScan: (id: string) => void
  onNewPrompt: () => void
  onSuggestions: () => void
  selectedIds: Set<string>
  onSelectOne: (id: string, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
  onBulkDelete: () => void
  onBulkScan: () => void
  onBulkToggleActive: () => void
  onImport: () => void
  onExport: () => void
}

function PromptsTabContent(props: PromptsTabContentProps) {
  const { projectId, prompts, allPrompts, isLoading, searchQuery, onSearchChange, sortKey, sortDirection, onSort, currentPage, pageSize, totalItems, totalPages, startIndex, endIndex, onPageChange, onPageSizeChange, onEdit, onDelete, onToggleActive, onRunScan, onNewPrompt, onSuggestions, selectedIds, onSelectOne, onSelectAll, onBulkDelete, onBulkScan, onBulkToggleActive, onImport, onExport } = props

  const allSelected = prompts.length > 0 && prompts.every((p) => selectedIds.has(p.id))
  const someSelected = selectedIds.size > 0
  const checkboxState = allSelected ? true : someSelected ? 'indeterminate' : false

  // Determine bulk toggle button text
  const selectedPrompts = prompts.filter((p) => selectedIds.has(p.id))
  const allSelectedActive = selectedPrompts.length > 0 && selectedPrompts.every((p) => p.isActive)
  const bulkToggleText = allSelectedActive ? 'Pause' : 'Activate'

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
        <div className="flex w-full flex-col gap-y-2">
          <span className="text-lg font-semibold">Tracked Prompts</span>
          <p className="text-sm text-muted-foreground">Manage prompts to track your brand visibility across AI platforms.</p>
        </div>
        <div className="flex shrink-0 flex-row items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onImport} className="rounded-full h-8 px-3 text-muted-foreground hover:text-foreground">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Import
          </Button>
          <Button variant="ghost" size="sm" onClick={onExport} disabled={allPrompts.length === 0} className="rounded-full h-8 px-3 text-muted-foreground hover:text-foreground">
            <Upload className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>
          <Button variant="ghost" size="sm" onClick={onSuggestions} className="rounded-full h-8 px-3 text-muted-foreground hover:text-foreground">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Suggestions
          </Button>
          <Button variant="ghost" size="sm" onClick={onNewPrompt} className="rounded-full h-8 px-3 text-muted-foreground hover:text-foreground">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            New Prompt
          </Button>
        </div>
      </div>
      <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-polar-800">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="text" placeholder="Search prompts..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="pl-9 h-9" />
          </div>
        </div>

        {/* Table with bulk actions - matches opportunities pattern */}
        <div className="relative">
          {/* Bulk Action Bar */}
          {someSelected && (
            <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-muted/95 px-6 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">
                  {selectedIds.size} selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectAll(false)}
                  className="h-7 gap-1 px-2 text-xs"
                >
                  <X className="h-3 w-3" />
                  Clear
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onExport}
                  className="rounded-full h-7 px-3 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBulkScan}
                  className="rounded-full h-7 px-3 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Play className="h-3 w-3 mr-1" />
                  Run Scan
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBulkToggleActive}
                  className="rounded-full h-7 px-3 text-xs text-muted-foreground hover:text-foreground"
                >
                  {bulkToggleText}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBulkDelete}
                  className="rounded-full h-7 px-3 text-xs text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-polar-800">
                {/* Checkbox column */}
                <th className="w-12 px-4 py-4">
                  <Checkbox
                    checked={checkboxState}
                    onCheckedChange={(checked) => onSelectAll(checked === true)}
                    aria-label="Select all"
                  />
                </th>
                {['prompt', 'status', 'visibility', 'lastScan'].map((key) => (
                  <th
                    key={key}
                    className="cursor-pointer px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => onSort(key as PromptSortKey)}
                  >
                    <div className="flex items-center gap-1.5">
                      {key === 'lastScan' ? 'Last Scan' : key.charAt(0).toUpperCase() + key.slice(1)}
                      {sortKey === key && <span className="text-foreground">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-polar-800">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></td></tr>
              ) : prompts.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">{searchQuery ? 'No prompts match your search' : 'No prompts yet'}</p>
                    {searchQuery ? <Button variant="ghost" size="sm" onClick={() => onSearchChange('')}>Clear search</Button> : <Button variant="ghost" size="sm" onClick={onNewPrompt}>Add your first prompt</Button>}
                  </div>
                </td></tr>
              ) : (
                prompts.map((prompt) => (
                  <tr
                    key={prompt.id}
                    className={`transition-colors ${
                      selectedIds.has(prompt.id)
                        ? 'bg-muted/50'
                        : 'hover:bg-gray-50 dark:hover:bg-polar-800/50'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="w-12 px-4 py-4">
                      <Checkbox
                        checked={selectedIds.has(prompt.id)}
                        onCheckedChange={(checked) => onSelectOne(prompt.id, checked === true)}
                        aria-label={`Select ${prompt.prompt}`}
                      />
                    </td>
                    <td className="px-6 py-4"><Link href={`/dashboard/brands/${projectId}/ai-tracking/prompts/${prompt.id}`} className="text-sm font-medium hover:text-foreground/80 transition-colors line-clamp-2">{prompt.prompt}</Link></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Show scan status only when actively scanning */}
                      {prompt.scanStatus === 'SCANNING' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          In Progress
                        </span>
                      ) : (
                        /* Show Active/Paused badge when not scanning */
                        <button
                          onClick={() => onToggleActive(prompt.id, prompt.isActive)}
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium cursor-pointer transition-colors',
                            prompt.isActive
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                          )}
                        >
                          {prompt.isActive ? 'Active' : 'Paused'}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{prompt.lastVisibilityScore !== null ? <span className="text-sm font-medium">{prompt.lastVisibilityScore}%</span> : <span className="text-sm text-muted-foreground">—</span>}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm text-muted-foreground">{prompt.lastScanDate ? new Date(prompt.lastScanDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          asChild
                        >
                          <Link href={`/dashboard/brands/${projectId}/ai-tracking/prompts/${prompt.id}`} title="View details">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onRunScan(prompt.id)}
                          disabled={prompt.scanStatus === 'SCANNING'}
                          title={prompt.scanStatus === 'SCANNING' ? 'Scan in progress...' : 'Run scan for this prompt'}
                        >
                          {prompt.scanStatus === 'SCANNING' ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onEdit(prompt)}
                          title="Edit prompt"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onDelete(prompt.id)}
                          title="Delete prompt"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
        {totalItems > 0 && <PaginationFooter label="prompts" startIndex={startIndex} endIndex={endIndex} totalItems={totalItems} totalPages={totalPages} currentPage={currentPage} pageSize={pageSize} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />}
      </div>
    </div>
  )
}

// ============================================================
// KEYWORDS TAB CONTENT
// ============================================================
interface KeywordsTabContentProps {
  projectId: string
  keywords: TrackedKeyword[]
  isLoading: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  sortKey: KeywordSortKey
  sortDirection: SortDirection
  onSort: (key: KeywordSortKey) => void
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  startIndex: number
  endIndex: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onEdit: (keyword: TrackedKeyword) => void
  onDelete: (id: string) => void
  onToggleTracking: (id: string, currentStatus: boolean) => void
  onNewKeyword: () => void
  onSuggestions: () => void
  trackingCount: number
}

function KeywordsTabContent(props: KeywordsTabContentProps) {
  const { projectId, keywords, isLoading, searchQuery, onSearchChange, sortKey, sortDirection, onSort, currentPage, pageSize, totalItems, totalPages, startIndex, endIndex, onPageChange, onPageSizeChange, onEdit, onDelete, onToggleTracking, onNewKeyword, onSuggestions, trackingCount } = props

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
        <div className="flex w-full flex-col gap-y-2">
          <span className="text-lg font-semibold">Keyword Research</span>
          <p className="text-sm text-muted-foreground">Track keyword rankings and discover new opportunities. {trackingCount} keywords being tracked.</p>
        </div>
        <div className="flex shrink-0 flex-row items-center gap-2">
          <Button variant="outline" size="sm" onClick={onSuggestions}><Sparkles className="h-4 w-4 mr-2" />Suggestions</Button>
          <Button variant="outline" size="sm" onClick={() => toast.success('Keywords exported to CSV')}><Download className="h-4 w-4 mr-2" />Export</Button>
          <Button size="sm" onClick={onNewKeyword}><Plus className="h-4 w-4 mr-2" />Add Keyword</Button>
        </div>
      </div>
      <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="text" placeholder="Search keywords..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="pl-9 h-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {[{ key: 'keyword', label: 'Keyword' }, { key: 'searchVolume', label: 'Volume' }, { key: 'difficulty', label: 'Difficulty' }, { key: 'cpc', label: 'CPC' }, { key: 'position', label: 'Position' }].map(({ key, label }) => (
                  <th key={key} className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors select-none" onClick={() => onSort(key as KeywordSortKey)}>
                    <div className="flex items-center gap-1.5">{label}{sortKey === key && <span className="text-foreground">{sortDirection === 'asc' ? '↑' : '↓'}</span>}</div>
                  </th>
                ))}
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Trend</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Intent</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={9} className="px-6 py-12 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></td></tr>
              ) : keywords.length === 0 ? (
                <tr><td colSpan={9} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Target className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">{searchQuery ? 'No keywords match your search' : 'No keywords yet'}</p>
                    {searchQuery ? <Button variant="ghost" size="sm" onClick={() => onSearchChange('')}>Clear search</Button> : <Button variant="ghost" size="sm" onClick={onNewKeyword}>Add your first keyword</Button>}
                  </div>
                </td></tr>
              ) : (
                keywords.map((keyword) => (
                  <tr key={keyword.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/brands/${projectId}/tracking/keywords/${keyword.id}`} className="flex flex-col gap-1 hover:opacity-80 transition-opacity">
                        <span className="text-sm font-medium">{keyword.keyword}</span>
                        {keyword.notes && <span className="text-xs text-muted-foreground line-clamp-1">{keyword.notes}</span>}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm font-medium">{formatNumber(keyword.searchVolume)}</span><span className="text-xs text-muted-foreground">/mo</span></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full rounded-full bg-foreground/60" style={{ width: `${keyword.difficulty}%` }} /></div>
                        <span className="text-sm font-medium">{keyword.difficulty}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm">${keyword.cpc.toFixed(2)}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap">{keyword.position !== null ? <span className="text-sm font-medium">#{keyword.position}</span> : <span className="text-sm text-muted-foreground">—</span>}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><TrendIcon trend={keyword.trend} /></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                                      <Badge
                                        variant="outline"
                                        className={cn(
                                          "text-xs border-0",
                                          keyword.intent === 'informational' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                                          keyword.intent === 'transactional' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
                                          keyword.intent === 'navigational' && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
                                          keyword.intent === 'commercial' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
                                        )}
                                      >
                                        {INTENT_LABELS[keyword.intent]}
                                      </Badge>
                                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => onToggleTracking(keyword.id, keyword.isTracking)} className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium cursor-pointer transition-colors', keyword.isTracking ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700')}>
                        {keyword.isTracking ? 'Tracking' : 'Paused'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild><Link href={`/dashboard/brands/${projectId}/tracking/keywords/${keyword.id}`}><Eye className="h-4 w-4" /></Link></Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEdit(keyword)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onDelete(keyword.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalItems > 0 && <PaginationFooter label="keywords" startIndex={startIndex} endIndex={endIndex} totalItems={totalItems} totalPages={totalPages} currentPage={currentPage} pageSize={pageSize} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />}
      </div>
    </div>
  )
}

// ============================================================
// COMPETITORS TAB CONTENT
// ============================================================
interface CompetitorsTabContentProps {
  projectId: string
  competitors: TrackedCompetitor[]
  isLoading: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  sortKey: CompetitorSortKey
  sortDirection: SortDirection
  onSort: (key: CompetitorSortKey) => void
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  startIndex: number
  endIndex: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onDelete: (id: string) => void
  onToggleTracking: (id: string, currentStatus: boolean) => void
  trackingCount: number
}

function CompetitorsTabContent(props: CompetitorsTabContentProps) {
  const { projectId, competitors, isLoading, searchQuery, onSearchChange, sortKey, sortDirection, onSort, currentPage, pageSize, totalItems, totalPages, startIndex, endIndex, onPageChange, onPageSizeChange, onDelete, onToggleTracking, trackingCount } = props

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
        <div className="flex w-full flex-col gap-y-2">
          <span className="text-lg font-semibold">Competitor Tracking</span>
          <p className="text-sm text-muted-foreground">Monitor competitors appearing in AI responses. {trackingCount} competitors being tracked.</p>
        </div>
        <div className="flex shrink-0 flex-row items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.success('Competitors exported to CSV')}><Download className="h-4 w-4 mr-2" />Export</Button>
          <Button size="sm" onClick={() => toast.info('Add competitor coming soon')}><Plus className="h-4 w-4 mr-2" />Add Competitor</Button>
        </div>
      </div>
      <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="text" placeholder="Search competitors..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="pl-9 h-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {[{ key: 'name', label: 'Competitor' }, { key: 'shareOfVoice', label: 'Share of Voice' }, { key: 'avgPosition', label: 'Avg. Position' }, { key: 'mentionCount', label: 'Mentions' }].map(({ key, label }) => (
                  <th key={key} className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors select-none" onClick={() => onSort(key as CompetitorSortKey)}>
                    <div className="flex items-center gap-1.5">{label}{sortKey === key && <span className="text-foreground">{sortDirection === 'asc' ? '↑' : '↓'}</span>}</div>
                  </th>
                ))}
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></td></tr>
              ) : competitors.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">{searchQuery ? 'No competitors match your search' : 'No competitors yet'}</p>
                    {searchQuery && <Button variant="ghost" size="sm" onClick={() => onSearchChange('')}>Clear search</Button>}
                  </div>
                </td></tr>
              ) : (
                competitors.map((competitor) => (
                  <tr key={competitor.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/brands/${projectId}/tracking/competitors/${competitor.id}`} className="flex flex-col gap-1 hover:opacity-80 transition-opacity">
                        <span className="text-sm font-medium">{competitor.name}</span>
                        <span className="text-xs text-muted-foreground">{competitor.domain}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm font-medium">{competitor.shareOfVoice.toFixed(1)}%</span></td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm">#{competitor.avgPosition.toFixed(1)}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm">{competitor.mentionCount}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => onToggleTracking(competitor.id, competitor.isTracking)} className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium cursor-pointer transition-colors', competitor.isTracking ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700')}>
                        {competitor.isTracking ? 'Tracking' : 'Paused'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild><Link href={`/dashboard/brands/${projectId}/tracking/competitors/${competitor.id}`}><Eye className="h-4 w-4" /></Link></Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onDelete(competitor.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalItems > 0 && <PaginationFooter label="competitors" startIndex={startIndex} endIndex={endIndex} totalItems={totalItems} totalPages={totalPages} currentPage={currentPage} pageSize={pageSize} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />}
      </div>
    </div>
  )
}

// ============================================================
// COMING SOON CONTENT
// ============================================================
interface ComingSoonContentProps {
  title: string
  description: string
  icon: React.ReactNode
}

function ComingSoonContent({ title, description, icon }: ComingSoonContentProps) {
  return (
    <div className="md:dark:bg-polar-900 dark:border-polar-700 w-full md:rounded-xl md:border md:border-gray-100 md:bg-gray-50 md:p-8 lg:rounded-4xl items-center justify-center gap-y-6 md:flex md:flex-col md:py-48">
      <div className="text-gray-300 dark:text-gray-600">{icon}</div>
      <div className="flex flex-col items-center gap-y-6">
        <div className="flex flex-col items-center gap-y-2">
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="dark:text-polar-500 text-gray-500 text-center max-w-md">
            {description}
          </p>
        </div>
        <Badge variant="outline" className="rounded-lg">Coming Soon</Badge>
      </div>
    </div>
  )
}

// ============================================================
// PAGINATION FOOTER
// ============================================================
interface PaginationFooterProps {
  label: string
  startIndex: number
  endIndex: number
  totalItems: number
  totalPages: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

function PaginationFooter({ label, startIndex, endIndex, totalItems, totalPages, currentPage, pageSize, onPageChange, onPageSizeChange }: PaginationFooterProps) {
  return (
    <div className="flex flex-col gap-4 px-6 py-4 border-t border-border bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-muted-foreground">Showing {startIndex + 1}–{endIndex} of {totalItems} {label}</div>
      <div className="flex items-center gap-4">
        <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
          <SelectTrigger className="w-[70px] h-8"><SelectValue /></SelectTrigger>
          <SelectContent>{PAGE_SIZE_OPTIONS.map((size) => <SelectItem key={size} value={size.toString()}>{size}</SelectItem>)}</SelectContent>
        </Select>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="h-8 px-2"><ArrowLeft className="h-4 w-4" /></Button>
            <span className="px-2 text-sm text-muted-foreground">{currentPage} / {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="h-8 px-2"><ArrowLeft className="h-4 w-4 rotate-180" /></Button>
          </div>
        )}
      </div>
    </div>
  )
}
