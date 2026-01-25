'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Checkbox } from '@workspace/ui/components/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
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
  Loader2,
  Pencil,
  Trash2,
  Eye,
  ArrowLeft,
  X,
  Download,
  Upload,
  Lightbulb,
  FileText,
  Image,
  ExternalLink,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { cn } from '@/lib/utils'

// ============================================================
// TYPES
// ============================================================
type OpportunityStatus = 'new' | 'in_progress' | 'completed' | 'dismissed'
type ContentStatus = 'draft' | 'published' | 'scheduled' | 'archived'
type AssetType = 'image' | 'video' | 'document' | 'other'

interface Opportunity {
  id: string
  title: string
  description: string
  source: string
  status: OpportunityStatus
  priority: 'high' | 'medium' | 'low'
  createdAt: Date
  updatedAt: Date
}

interface ContentItem {
  id: string
  title: string
  type: 'blog' | 'article' | 'landing_page' | 'social'
  status: ContentStatus
  author: string
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

interface Asset {
  id: string
  name: string
  type: AssetType
  size: number
  url: string
  createdAt: Date
  updatedAt: Date
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================
function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return bytes + ' B'
}

function formatDate(date: Date | null): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ============================================================
// SHARED CONSTANTS
// ============================================================
const PAGE_SIZE_OPTIONS = [10, 20, 50] as const
type OpportunitySortKey = 'title' | 'status' | 'priority' | 'createdAt'
type ContentSortKey = 'title' | 'type' | 'status' | 'publishedAt' | 'createdAt'
type AssetSortKey = 'name' | 'type' | 'size' | 'createdAt'
type SortDirection = 'asc' | 'desc'

// ============================================================
// TAB TYPE
// ============================================================
type ContentTab = 'opportunities' | 'content' | 'assets'

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================
export default function ContentListPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const projectId = params.id as string

  // Get tab from URL query param, default to 'opportunities'
  const tabFromUrl = searchParams.get('tab') as ContentTab | null
  const initialTab: ContentTab = tabFromUrl && ['opportunities', 'content', 'assets'].includes(tabFromUrl)
    ? tabFromUrl
    : 'opportunities'

  // Tab state
  const [activeTab, setActiveTab] = useState<ContentTab>(initialTab)

  // ============================================================
  // OPPORTUNITIES STATE
  // ============================================================
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [opportunitySearchQuery, setOpportunitySearchQuery] = useState('')
  const [opportunityToDelete, setOpportunityToDelete] = useState<string | null>(null)
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [opportunitySortKey, setOpportunitySortKey] = useState<OpportunitySortKey>('createdAt')
  const [opportunitySortDirection, setOpportunitySortDirection] = useState<SortDirection>('desc')
  const [opportunityCurrentPage, setOpportunityCurrentPage] = useState(1)
  const [opportunityPageSize, setOpportunityPageSize] = useState<number>(10)
  const [selectedOpportunityIds, setSelectedOpportunityIds] = useState<Set<string>>(new Set())
  const [opportunitiesLoading, setOpportunitiesLoading] = useState(true)

  // ============================================================
  // CONTENT STATE
  // ============================================================
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [contentSearchQuery, setContentSearchQuery] = useState('')
  const [contentSortKey, setContentSortKey] = useState<ContentSortKey>('createdAt')
  const [contentSortDirection, setContentSortDirection] = useState<SortDirection>('desc')
  const [contentCurrentPage, setContentCurrentPage] = useState(1)
  const [contentPageSize, setContentPageSize] = useState<number>(10)
  const [selectedContentIds, setSelectedContentIds] = useState<Set<string>>(new Set())
  const [contentLoading, setContentLoading] = useState(true)

  // ============================================================
  // ASSETS STATE
  // ============================================================
  const [assets, setAssets] = useState<Asset[]>([])
  const [assetSearchQuery, setAssetSearchQuery] = useState('')
  const [assetSortKey, setAssetSortKey] = useState<AssetSortKey>('createdAt')
  const [assetSortDirection, setAssetSortDirection] = useState<SortDirection>('desc')
  const [assetCurrentPage, setAssetCurrentPage] = useState(1)
  const [assetPageSize, setAssetPageSize] = useState<number>(10)
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(new Set())
  const [assetsLoading, setAssetsLoading] = useState(true)

  // ============================================================
  // LOAD DATA
  // ============================================================
  useEffect(() => {
    if (projectId) {
      // Load opportunities
      const opportunityTimer = setTimeout(() => {
        setOpportunities([])
        setOpportunitiesLoading(false)
      }, 300)
      // Load content
      const contentTimer = setTimeout(() => {
        setContentItems([])
        setContentLoading(false)
      }, 300)
      // Load assets
      const assetTimer = setTimeout(() => {
        setAssets([])
        setAssetsLoading(false)
      }, 300)
      return () => {
        clearTimeout(opportunityTimer)
        clearTimeout(contentTimer)
        clearTimeout(assetTimer)
      }
    }
  }, [projectId])

  // ============================================================
  // OPPORTUNITIES HANDLERS
  // ============================================================
  const handleOpportunityDelete = (id: string) => {
    setOpportunityToDelete(id)
  }

  const confirmOpportunityDelete = () => {
    if (opportunityToDelete) {
      setOpportunities((prev) => prev.filter((o) => o.id !== opportunityToDelete))
      toast.success('Opportunity deleted!')
      setOpportunityToDelete(null)
    }
  }

  const handleOpportunityStatusChange = (id: string, status: OpportunityStatus) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status, updatedAt: new Date() } : o))
    )
    toast.success('Status updated!')
  }

  const handleSelectOpportunity = (id: string, selected: boolean) => {
    setSelectedOpportunityIds((prev) => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }

  const handleSelectAllOpportunities = (selected: boolean) => {
    if (selected) {
      setSelectedOpportunityIds(new Set(paginatedOpportunities.map((o) => o.id)))
    } else {
      setSelectedOpportunityIds(new Set())
    }
  }

  const handleBulkDeleteOpportunities = () => {
    setBulkDeleteOpen(true)
  }

  const confirmBulkDelete = () => {
    const ids = Array.from(selectedOpportunityIds)
    if (ids.length === 0) return
    setOpportunities((prev) => prev.filter((o) => !ids.includes(o.id)))
    setSelectedOpportunityIds(new Set())
    toast.success(`${ids.length} opportunity(ies) deleted!`)
    setBulkDeleteOpen(false)
  }

  const handleOpportunitySort = (key: OpportunitySortKey) => {
    if (opportunitySortKey === key) {
      setOpportunitySortDirection(opportunitySortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setOpportunitySortKey(key)
      setOpportunitySortDirection('desc')
    }
    setOpportunityCurrentPage(1)
  }

  // ============================================================
  // CONTENT HANDLERS
  // ============================================================
  const handleContentDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      setContentItems((prev) => prev.filter((c) => c.id !== id))
      toast.success('Content deleted!')
    }
  }

  const handleSelectContent = (id: string, selected: boolean) => {
    setSelectedContentIds((prev) => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }

  const handleSelectAllContent = (selected: boolean) => {
    if (selected) {
      setSelectedContentIds(new Set(paginatedContent.map((c) => c.id)))
    } else {
      setSelectedContentIds(new Set())
    }
  }

  const handleContentSort = (key: ContentSortKey) => {
    if (contentSortKey === key) {
      setContentSortDirection(contentSortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setContentSortKey(key)
      setContentSortDirection('desc')
    }
    setContentCurrentPage(1)
  }

  // ============================================================
  // ASSETS HANDLERS
  // ============================================================
  const handleAssetDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      setAssets((prev) => prev.filter((a) => a.id !== id))
      toast.success('Asset deleted!')
    }
  }

  const handleSelectAsset = (id: string, selected: boolean) => {
    setSelectedAssetIds((prev) => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }

  const handleSelectAllAssets = (selected: boolean) => {
    if (selected) {
      setSelectedAssetIds(new Set(paginatedAssets.map((a) => a.id)))
    } else {
      setSelectedAssetIds(new Set())
    }
  }

  const handleAssetSort = (key: AssetSortKey) => {
    if (assetSortKey === key) {
      setAssetSortDirection(assetSortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setAssetSortKey(key)
      setAssetSortDirection('desc')
    }
    setAssetCurrentPage(1)
  }

  // ============================================================
  // OPPORTUNITIES DATA PROCESSING
  // ============================================================
  const filteredOpportunities = opportunities.filter((opportunity) => {
    if (!opportunitySearchQuery.trim()) return true
    const query = opportunitySearchQuery.toLowerCase()
    return opportunity.title.toLowerCase().includes(query) || opportunity.description.toLowerCase().includes(query)
  })

  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    let comparison = 0
    switch (opportunitySortKey) {
      case 'title': comparison = a.title.localeCompare(b.title); break
      case 'status': comparison = a.status.localeCompare(b.status); break
      case 'priority': {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
        break
      }
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        break
    }
    return opportunitySortDirection === 'asc' ? comparison : -comparison
  })

  const opportunityTotalItems = sortedOpportunities.length
  const opportunityTotalPages = Math.ceil(opportunityTotalItems / opportunityPageSize)
  const opportunityValidCurrentPage = Math.max(1, Math.min(opportunityCurrentPage, opportunityTotalPages || 1))
  const opportunityStartIndex = (opportunityValidCurrentPage - 1) * opportunityPageSize
  const opportunityEndIndex = Math.min(opportunityStartIndex + opportunityPageSize, opportunityTotalItems)
  const paginatedOpportunities = sortedOpportunities.slice(opportunityStartIndex, opportunityEndIndex)

  // ============================================================
  // CONTENT DATA PROCESSING
  // ============================================================
  const filteredContent = contentItems.filter((content) => {
    if (!contentSearchQuery.trim()) return true
    const query = contentSearchQuery.toLowerCase()
    return content.title.toLowerCase().includes(query) || content.type.toLowerCase().includes(query)
  })

  const sortedContent = [...filteredContent].sort((a, b) => {
    let comparison = 0
    switch (contentSortKey) {
      case 'title': comparison = a.title.localeCompare(b.title); break
      case 'type': comparison = a.type.localeCompare(b.type); break
      case 'status': comparison = a.status.localeCompare(b.status); break
      case 'publishedAt':
        const pubA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
        const pubB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
        comparison = pubA - pubB
        break
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        break
    }
    return contentSortDirection === 'asc' ? comparison : -comparison
  })

  const contentTotalItems = sortedContent.length
  const contentTotalPages = Math.ceil(contentTotalItems / contentPageSize)
  const contentValidCurrentPage = Math.max(1, Math.min(contentCurrentPage, contentTotalPages || 1))
  const contentStartIndex = (contentValidCurrentPage - 1) * contentPageSize
  const contentEndIndex = Math.min(contentStartIndex + contentPageSize, contentTotalItems)
  const paginatedContent = sortedContent.slice(contentStartIndex, contentEndIndex)

  // ============================================================
  // ASSETS DATA PROCESSING
  // ============================================================
  const filteredAssets = assets.filter((asset) => {
    if (!assetSearchQuery.trim()) return true
    const query = assetSearchQuery.toLowerCase()
    return asset.name.toLowerCase().includes(query) || asset.type.toLowerCase().includes(query)
  })

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    let comparison = 0
    switch (assetSortKey) {
      case 'name': comparison = a.name.localeCompare(b.name); break
      case 'type': comparison = a.type.localeCompare(b.type); break
      case 'size': comparison = a.size - b.size; break
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        break
    }
    return assetSortDirection === 'asc' ? comparison : -comparison
  })

  const assetTotalItems = sortedAssets.length
  const assetTotalPages = Math.ceil(assetTotalItems / assetPageSize)
  const assetValidCurrentPage = Math.max(1, Math.min(assetCurrentPage, assetTotalPages || 1))
  const assetStartIndex = (assetValidCurrentPage - 1) * assetPageSize
  const assetEndIndex = Math.min(assetStartIndex + assetPageSize, assetTotalItems)
  const paginatedAssets = sortedAssets.slice(assetStartIndex, assetEndIndex)

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="relative flex min-w-0 flex-2 flex-col items-center">
      <div className="mx-auto flex w-full flex-col">

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ContentTab)} className="w-full">
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6">
            <TabsList className="bg-transparent ring-0 dark:bg-transparent dark:ring-0 p-1 gap-2 w-max md:w-auto">
              <TabsTrigger
                value="opportunities"
                className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Opportunities
              </TabsTrigger>
              <TabsTrigger
                value="content"
                className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                <FileText className="h-4 w-4 mr-2" />
                Content
              </TabsTrigger>
              <TabsTrigger
                value="assets"
                className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                <Image className="h-4 w-4 mr-2" />
                Assets
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="mt-0">
            <OpportunitiesTabContent
              projectId={projectId}
              opportunities={paginatedOpportunities}
              isLoading={opportunitiesLoading}
              searchQuery={opportunitySearchQuery}
              onSearchChange={(v) => { setOpportunitySearchQuery(v); setOpportunityCurrentPage(1) }}
              sortKey={opportunitySortKey}
              sortDirection={opportunitySortDirection}
              onSort={handleOpportunitySort}
              currentPage={opportunityCurrentPage}
              pageSize={opportunityPageSize}
              totalItems={opportunityTotalItems}
              totalPages={opportunityTotalPages}
              startIndex={opportunityStartIndex}
              endIndex={opportunityEndIndex}
              onPageChange={setOpportunityCurrentPage}
              onPageSizeChange={(v) => { setOpportunityPageSize(v); setOpportunityCurrentPage(1) }}
              onDelete={handleOpportunityDelete}
              onStatusChange={handleOpportunityStatusChange}
              selectedIds={selectedOpportunityIds}
              onSelectOne={handleSelectOpportunity}
              onSelectAll={handleSelectAllOpportunities}
              onBulkDelete={handleBulkDeleteOpportunities}
            />
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="mt-0">
            <ContentTabContent
              projectId={projectId}
              content={paginatedContent}
              isLoading={contentLoading}
              searchQuery={contentSearchQuery}
              onSearchChange={(v) => { setContentSearchQuery(v); setContentCurrentPage(1) }}
              sortKey={contentSortKey}
              sortDirection={contentSortDirection}
              onSort={handleContentSort}
              currentPage={contentCurrentPage}
              pageSize={contentPageSize}
              totalItems={contentTotalItems}
              totalPages={contentTotalPages}
              startIndex={contentStartIndex}
              endIndex={contentEndIndex}
              onPageChange={setContentCurrentPage}
              onPageSizeChange={(v) => { setContentPageSize(v); setContentCurrentPage(1) }}
              onDelete={handleContentDelete}
              selectedIds={selectedContentIds}
              onSelectOne={handleSelectContent}
              onSelectAll={handleSelectAllContent}
            />
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets" className="mt-0">
            <AssetsTabContent
              projectId={projectId}
              assets={paginatedAssets}
              isLoading={assetsLoading}
              searchQuery={assetSearchQuery}
              onSearchChange={(v) => { setAssetSearchQuery(v); setAssetCurrentPage(1) }}
              sortKey={assetSortKey}
              sortDirection={assetSortDirection}
              onSort={handleAssetSort}
              currentPage={assetCurrentPage}
              pageSize={assetPageSize}
              totalItems={assetTotalItems}
              totalPages={assetTotalPages}
              startIndex={assetStartIndex}
              endIndex={assetEndIndex}
              onPageChange={setAssetCurrentPage}
              onPageSizeChange={(v) => { setAssetPageSize(v); setAssetCurrentPage(1) }}
              onDelete={handleAssetDelete}
              selectedIds={selectedAssetIds}
              onSelectOne={handleSelectAsset}
              onSelectAll={handleSelectAllAssets}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Opportunity Confirmation Modal */}
      <AlertDialog open={opportunityToDelete !== null} onOpenChange={(open) => !open && setOpportunityToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Opportunity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this opportunity? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmOpportunityDelete}
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
            <AlertDialogTitle>Delete {selectedOpportunityIds.size} Item(s)</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedOpportunityIds.size} selected item(s)? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-destructive text-white hover:bg-destructive/90 focus:ring-destructive"
            >
              Delete {selectedOpportunityIds.size} Item(s)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ============================================================
// OPPORTUNITIES TAB CONTENT
// ============================================================
interface OpportunitiesTabContentProps {
  projectId: string
  opportunities: Opportunity[]
  isLoading: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  sortKey: OpportunitySortKey
  sortDirection: SortDirection
  onSort: (key: OpportunitySortKey) => void
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  startIndex: number
  endIndex: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: OpportunityStatus) => void
  selectedIds: Set<string>
  onSelectOne: (id: string, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
  onBulkDelete: () => void
}

function OpportunitiesTabContent(props: OpportunitiesTabContentProps) {
  const { projectId, opportunities, isLoading, searchQuery, onSearchChange, sortKey, sortDirection, onSort, totalItems, totalPages, startIndex, endIndex, currentPage, pageSize, onPageChange, onPageSizeChange, onDelete, onStatusChange, selectedIds, onSelectOne, onSelectAll, onBulkDelete } = props

  const allSelected = opportunities.length > 0 && opportunities.every((o) => selectedIds.has(o.id))
  const someSelected = selectedIds.size > 0
  const checkboxState = allSelected ? true : someSelected ? 'indeterminate' : false

  const getStatusBadge = (status: OpportunityStatus) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      case 'in_progress': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
      case 'completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
      case 'dismissed': return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
      case 'medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
      case 'low': return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
        <div className="flex w-full flex-col gap-y-2">
          <span className="text-lg font-semibold">Content Opportunities</span>
          <p className="text-sm text-muted-foreground">Discover and manage content opportunities to improve your visibility.</p>
        </div>
        <div className="flex shrink-0 flex-row items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-polar-800">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="text" placeholder="Search opportunities..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="pl-9 h-9" />
          </div>
        </div>

        <div className="relative">
          {someSelected && (
            <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-muted/95 px-6 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{selectedIds.size} selected</span>
                <Button variant="ghost" size="sm" onClick={() => onSelectAll(false)} className="h-7 gap-1 px-2 text-xs">
                  <X className="h-3 w-3" />
                  Clear
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onBulkDelete} className="h-8 gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete ({selectedIds.size})
                </Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-polar-800">
                  <th className="w-12 px-4 py-4">
                    <Checkbox checked={checkboxState} onCheckedChange={(checked) => onSelectAll(checked === true)} aria-label="Select all" />
                  </th>
                  {[{ key: 'title', label: 'Opportunity' }, { key: 'status', label: 'Status' }, { key: 'priority', label: 'Priority' }, { key: 'createdAt', label: 'Created' }].map(({ key, label }) => (
                    <th key={key} className="cursor-pointer px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground" onClick={() => onSort(key as OpportunitySortKey)}>
                      <div className="flex items-center gap-1.5">
                        {label}
                        {sortKey === key && <span className="text-foreground">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-polar-800">
                {isLoading ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></td></tr>
                ) : opportunities.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Lightbulb className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">{searchQuery ? 'No opportunities match your search' : 'No opportunities yet'}</p>
                      {searchQuery && <Button variant="ghost" size="sm" onClick={() => onSearchChange('')}>Clear search</Button>}
                    </div>
                  </td></tr>
                ) : (
                  opportunities.map((opp) => (
                    <tr key={opp.id} className={`transition-colors ${selectedIds.has(opp.id) ? 'bg-muted/50' : 'hover:bg-gray-50 dark:hover:bg-polar-800/50'}`}>
                      <td className="w-12 px-4 py-4">
                        <Checkbox checked={selectedIds.has(opp.id)} onCheckedChange={(checked) => onSelectOne(opp.id, checked === true)} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <Link href={`/dashboard/projects/${projectId}/content/opportunities/${opp.id}`} className="text-sm font-medium hover:text-foreground/80 transition-colors">{opp.title}</Link>
                          <span className="text-xs text-muted-foreground line-clamp-1">{opp.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium cursor-pointer transition-colors', getStatusBadge(opp.status))}>
                              {opp.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => onStatusChange(opp.id, 'new')}>New</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onStatusChange(opp.id, 'in_progress')}>In Progress</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onStatusChange(opp.id, 'completed')}>Completed</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onStatusChange(opp.id, 'dismissed')}>Dismissed</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', getPriorityBadge(opp.priority))}>
                          {opp.priority.charAt(0).toUpperCase() + opp.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{formatDate(opp.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <Link href={`/dashboard/projects/${projectId}/content/opportunities/${opp.id}`}><Eye className="h-4 w-4" /></Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(opp.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {totalItems > 0 && <PaginationFooter label="opportunities" startIndex={startIndex} endIndex={endIndex} totalItems={totalItems} totalPages={totalPages} currentPage={currentPage} pageSize={pageSize} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />}
      </div>
    </div>
  )
}

// ============================================================
// CONTENT TAB CONTENT
// ============================================================
interface ContentTabContentProps {
  projectId: string
  content: ContentItem[]
  isLoading: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  sortKey: ContentSortKey
  sortDirection: SortDirection
  onSort: (key: ContentSortKey) => void
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  startIndex: number
  endIndex: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onDelete: (id: string) => void
  selectedIds: Set<string>
  onSelectOne: (id: string, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
}

function ContentTabContent(props: ContentTabContentProps) {
  const { projectId, content, isLoading, searchQuery, onSearchChange, sortKey, sortDirection, onSort, totalItems, totalPages, startIndex, endIndex, currentPage, pageSize, onPageChange, onPageSizeChange, onDelete, selectedIds, onSelectOne, onSelectAll } = props

  const allSelected = content.length > 0 && content.every((c) => selectedIds.has(c.id))
  const someSelected = selectedIds.size > 0
  const checkboxState = allSelected ? true : someSelected ? 'indeterminate' : false

  const getStatusBadge = (status: ContentStatus) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
      case 'published': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
      case 'scheduled': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      case 'archived': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
    }
  }

  const getTypeBadge = (type: ContentItem['type']) => {
    switch (type) {
      case 'blog': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
      case 'article': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      case 'landing_page': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
      case 'social': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300'
    }
  }

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
        <div className="flex w-full flex-col gap-y-2">
          <span className="text-lg font-semibold">Content Library</span>
          <p className="text-sm text-muted-foreground">Manage and organize all your content pieces.</p>
        </div>
        <div className="flex shrink-0 flex-row items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="gap-2" onClick={() => toast.info('Create content coming soon')}>
            <Plus className="h-4 w-4" />
            New Content
          </Button>
        </div>
      </div>
      <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-polar-800">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="text" placeholder="Search content..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="pl-9 h-9" />
          </div>
        </div>

        <div className="relative">
          {someSelected && (
            <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-muted/95 px-6 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{selectedIds.size} selected</span>
                <Button variant="ghost" size="sm" onClick={() => onSelectAll(false)} className="h-7 gap-1 px-2 text-xs">
                  <X className="h-3 w-3" />
                  Clear
                </Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-polar-800">
                  <th className="w-12 px-4 py-4">
                    <Checkbox checked={checkboxState} onCheckedChange={(checked) => onSelectAll(checked === true)} aria-label="Select all" />
                  </th>
                  {[{ key: 'title', label: 'Title' }, { key: 'type', label: 'Type' }, { key: 'status', label: 'Status' }, { key: 'publishedAt', label: 'Published' }, { key: 'createdAt', label: 'Created' }].map(({ key, label }) => (
                    <th key={key} className="cursor-pointer px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground" onClick={() => onSort(key as ContentSortKey)}>
                      <div className="flex items-center gap-1.5">
                        {label}
                        {sortKey === key && <span className="text-foreground">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-polar-800">
                {isLoading ? (
                  <tr><td colSpan={7} className="px-6 py-12 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></td></tr>
                ) : content.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">{searchQuery ? 'No content matches your search' : 'No content yet'}</p>
                      {searchQuery && <Button variant="ghost" size="sm" onClick={() => onSearchChange('')}>Clear search</Button>}
                    </div>
                  </td></tr>
                ) : (
                  content.map((item) => (
                    <tr key={item.id} className={`transition-colors ${selectedIds.has(item.id) ? 'bg-muted/50' : 'hover:bg-gray-50 dark:hover:bg-polar-800/50'}`}>
                      <td className="w-12 px-4 py-4">
                        <Checkbox checked={selectedIds.has(item.id)} onCheckedChange={(checked) => onSelectOne(item.id, checked === true)} />
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/projects/${projectId}/content/${item.id}`} className="text-sm font-medium hover:text-foreground/80 transition-colors">{item.title}</Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', getTypeBadge(item.type))}>
                          {item.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', getStatusBadge(item.status))}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{formatDate(item.publishedAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{formatDate(item.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <Link href={`/dashboard/projects/${projectId}/content/${item.id}`}><Eye className="h-4 w-4" /></Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <Link href={`/dashboard/projects/${projectId}/content/${item.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {totalItems > 0 && <PaginationFooter label="content items" startIndex={startIndex} endIndex={endIndex} totalItems={totalItems} totalPages={totalPages} currentPage={currentPage} pageSize={pageSize} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />}
      </div>
    </div>
  )
}

// ============================================================
// ASSETS TAB CONTENT
// ============================================================
interface AssetsTabContentProps {
  projectId: string
  assets: Asset[]
  isLoading: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  sortKey: AssetSortKey
  sortDirection: SortDirection
  onSort: (key: AssetSortKey) => void
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  startIndex: number
  endIndex: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onDelete: (id: string) => void
  selectedIds: Set<string>
  onSelectOne: (id: string, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
}

function AssetsTabContent(props: AssetsTabContentProps) {
  const { assets, isLoading, searchQuery, onSearchChange, sortKey, sortDirection, onSort, totalItems, totalPages, startIndex, endIndex, currentPage, pageSize, onPageChange, onPageSizeChange, onDelete, selectedIds, onSelectOne, onSelectAll } = props

  const allSelected = assets.length > 0 && assets.every((a) => selectedIds.has(a.id))
  const someSelected = selectedIds.size > 0
  const checkboxState = allSelected ? true : someSelected ? 'indeterminate' : false

  const getTypeIcon = (type: AssetType) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4 text-purple-500" />
      case 'video': return <FileText className="h-4 w-4 text-blue-500" />
      case 'document': return <FileText className="h-4 w-4 text-amber-500" />
      default: return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
        <div className="flex w-full flex-col gap-y-2">
          <span className="text-lg font-semibold">Media Assets</span>
          <p className="text-sm text-muted-foreground">Upload and manage images, videos, and documents.</p>
        </div>
        <div className="flex shrink-0 flex-row items-center gap-2">
          <Button size="sm" className="gap-2" onClick={() => toast.info('Upload coming soon')}>
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>
      <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-polar-800">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="text" placeholder="Search assets..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="pl-9 h-9" />
          </div>
        </div>

        <div className="relative">
          {someSelected && (
            <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-muted/95 px-6 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{selectedIds.size} selected</span>
                <Button variant="ghost" size="sm" onClick={() => onSelectAll(false)} className="h-7 gap-1 px-2 text-xs">
                  <X className="h-3 w-3" />
                  Clear
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 gap-2">
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-polar-800">
                  <th className="w-12 px-4 py-4">
                    <Checkbox checked={checkboxState} onCheckedChange={(checked) => onSelectAll(checked === true)} aria-label="Select all" />
                  </th>
                  {[{ key: 'name', label: 'Name' }, { key: 'type', label: 'Type' }, { key: 'size', label: 'Size' }, { key: 'createdAt', label: 'Uploaded' }].map(({ key, label }) => (
                    <th key={key} className="cursor-pointer px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground" onClick={() => onSort(key as AssetSortKey)}>
                      <div className="flex items-center gap-1.5">
                        {label}
                        {sortKey === key && <span className="text-foreground">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-polar-800">
                {isLoading ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></td></tr>
                ) : assets.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Image className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">{searchQuery ? 'No assets match your search' : 'No assets yet'}</p>
                      {searchQuery && <Button variant="ghost" size="sm" onClick={() => onSearchChange('')}>Clear search</Button>}
                    </div>
                  </td></tr>
                ) : (
                  assets.map((asset) => (
                    <tr key={asset.id} className={`transition-colors ${selectedIds.has(asset.id) ? 'bg-muted/50' : 'hover:bg-gray-50 dark:hover:bg-polar-800/50'}`}>
                      <td className="w-12 px-4 py-4">
                        <Checkbox checked={selectedIds.has(asset.id)} onCheckedChange={(checked) => onSelectOne(asset.id, checked === true)} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(asset.type)}
                          <span className="text-sm font-medium">{asset.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-muted-foreground capitalize">{asset.type}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{formatFileSize(asset.size)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{formatDate(asset.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <a href={asset.url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(asset.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {totalItems > 0 && <PaginationFooter label="assets" startIndex={startIndex} endIndex={endIndex} totalItems={totalItems} totalPages={totalPages} currentPage={currentPage} pageSize={pageSize} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />}
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
