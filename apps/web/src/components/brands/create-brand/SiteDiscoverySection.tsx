'use client'

import { useState, useCallback, useRef } from 'react'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { Switch } from '@workspace/ui/components/switch'
import { Badge } from '@workspace/ui/components/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip'
import {
  Search,
  FileText,
  Globe,
  Upload,
  Check,
  X,
  Loader2,
  RefreshCw,
  HelpCircle,
  Link2,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@workspace/common/lib'
import type { 
  SiteFile, 
  SiteFileType, 
  SiteDiscoveryState, 
  DiscoverFilesResult 
} from '@workspace/common/lib/shcmea/types/site-discovery'
import { DEFAULT_SITE_DISCOVERY_CONFIG } from '@workspace/common/lib/shcmea/types/site-discovery'

// ============================================================
// TYPES
// ============================================================

interface SiteDiscoverySectionProps {
  websiteUrl: string
  siteDiscovery?: SiteDiscoveryState
  onUpdateSiteDiscovery: (discovery: SiteDiscoveryState) => void
}

// File type display info
const FILE_TYPE_INFO: Record<SiteFileType, { label: string; description: string; icon: React.ReactNode }> = {
  'llms.txt': {
    label: 'llms.txt',
    description: 'AI context file for LLMs',
    icon: <FileText className="h-4 w-4" />,
  },
  'llms-full.txt': {
    label: 'llms-full.txt',
    description: 'Extended AI context file',
    icon: <FileText className="h-4 w-4" />,
  },
  'sitemap.xml': {
    label: 'sitemap.xml',
    description: 'XML sitemap for search engines',
    icon: <Globe className="h-4 w-4" />,
  },
  'sitemap.txt': {
    label: 'sitemap.txt',
    description: 'Text-based URL list',
    icon: <Globe className="h-4 w-4" />,
  },
  'robots.txt': {
    label: 'robots.txt',
    description: 'Crawler directives',
    icon: <FileText className="h-4 w-4" />,
  },
}

// ============================================================
// STATUS BADGE COMPONENT
// ============================================================

// ============================================================
// SITE FILES TABLE COMPONENT
// ============================================================

interface SiteFilesTableProps {
  files: SiteFile[]
  onRemoveFile: (fileId: string) => void
  itemsLabel: string
  emptyMessage: string
}

function SiteFilesTable({ files, onRemoveFile, itemsLabel, emptyMessage }: SiteFilesTableProps) {
  // Format date for display
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (files.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <Globe className="h-8 w-8 text-gray-400 mx-auto mb-3" />
        <p className="text-sm text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-polar-700">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              File
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {itemsLabel === 'pages' ? 'Pages Found' : itemsLabel === 'sections' ? 'Sections' : 'Items'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Last Scanned
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-polar-900 divide-y divide-gray-200 dark:divide-polar-700">
          {files.map((file) => {
            const info = FILE_TYPE_INFO[file.type]
            const hasItems = file.itemsExtracted !== undefined && file.itemsExtracted > 0
            
            return (
              <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-polar-800/50 transition-colors">
                {/* File Info */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-polar-800 text-gray-600 dark:text-gray-400">
                      {info.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {info.label}
                      </span>
                      {file.url && (
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gray-500 hover:text-primary truncate max-w-[200px]"
                        >
                          {file.url}
                        </a>
                      )}
                    </div>
                  </div>
                </td>
                
                {/* Status */}
                <td className="px-4 py-3">
                  <StatusBadge status={file.status} hasItems={hasItems} />
                  {file.error && (
                    <p className="text-xs text-red-500 mt-1">{file.error}</p>
                  )}
                </td>
                
                {/* Items Found */}
                <td className="px-4 py-3 text-right">
                  {hasItems ? (
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {file.itemsExtracted!.toLocaleString()}
                    </span>
                  ) : file.status === 'fetching' || file.status === 'processing' ? (
                    <div className="flex items-center justify-end gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      <span className="text-xs text-gray-500">scanning...</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>
                
                {/* Last Scanned */}
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(file.lastFetchedAt || file.discoveredAt)}
                  </span>
                </td>
                
                {/* Actions */}
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onRemoveFile(file.id)}
                    className="h-8 w-8 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
        
        {/* Summary Footer */}
        {(() => {
          const totalItems = files.reduce((sum, f) => sum + (f.itemsExtracted || 0), 0)
          
          if (totalItems > 0) {
            return (
              <tfoot>
                <tr className="bg-gray-50 dark:bg-polar-800 border-t border-gray-200 dark:border-polar-700">
                  <td colSpan={2} className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Total
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {totalItems.toLocaleString()}
                    </span>
                  </td>
                  <td colSpan={2} className="px-4 py-3"></td>
                </tr>
              </tfoot>
            )
          }
          return null
        })()}
      </table>
    </div>
  )
}

// ============================================================
// STATUS BADGE COMPONENT
// ============================================================

function StatusBadge({ status, hasItems }: { status: SiteFile['status']; hasItems?: boolean }) {
  const statusConfig: Record<SiteFile['status'], { label: string; variant: 'default' | 'secondary' | 'outline' | 'muted'; className?: string }> = {
    discovered: { label: hasItems ? 'Scanned' : 'Discovered', variant: hasItems ? 'default' : 'secondary' },
    fetching: { label: 'Fetching...', variant: 'outline' },
    processing: { label: 'Processing...', variant: 'outline' },
    indexed: { label: 'Indexed', variant: 'default' },
    failed: { label: 'Failed', variant: 'secondary', className: 'bg-destructive/10 text-destructive border-destructive/20' },
    not_found: { label: 'Not Found', variant: 'secondary' },
    uploaded: { label: 'Uploaded', variant: 'default' },
  }

  const config = statusConfig[status]
  const showCheck = status === 'indexed' || status === 'uploaded' || (status === 'discovered' && hasItems)

  return (
    <Badge variant={config.variant} className={cn("text-xs", config.className)}>
      {status === 'fetching' || status === 'processing' ? (
        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
      ) : showCheck ? (
        <Check className="mr-1 h-3 w-3" />
      ) : status === 'failed' ? (
        <X className="mr-1 h-3 w-3" />
      ) : null}
      {config.label}
    </Badge>
  )
}


// ============================================================
// ADD FILE DIALOG COMPONENT
// ============================================================

interface AddFileDialogProps {
  fileType: SiteFileType
  onAdd: (file: SiteFile) => void
  onCancel: () => void
}

function AddFileDialog({ fileType, onAdd, onCancel }: AddFileDialogProps) {
  const [mode, setMode] = useState<'url' | 'upload'>('url')
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const info = FILE_TYPE_INFO[fileType]

  const handleUrlSubmit = async () => {
    if (!url.trim()) {
      toast.error('Please enter a URL')
      return
    }

    setIsLoading(true)
    try {
      // Create file entry (will be fetched when project is saved)
      const newFile: SiteFile = {
        id: crypto.randomUUID(),
        type: fileType,
        source: 'custom_url',
        url: url.trim(),
        status: 'discovered',
        discoveredAt: new Date().toISOString(),
      }
      onAdd(newFile)
      toast.success(`Added ${info.label}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const newFile: SiteFile = {
        id: crypto.randomUUID(),
        type: fileType,
        source: 'uploaded',
        url: null,
        status: 'indexed',
        content,
        size: content.length,
        discoveredAt: new Date().toISOString(),
        lastFetchedAt: new Date().toISOString(),
        lastIndexedAt: new Date().toISOString(),
      }
      onAdd(newFile)
      toast.success(`Uploaded ${info.label}`)
      setIsLoading(false)
    }
    reader.onerror = () => {
      toast.error('Failed to read file')
      setIsLoading(false)
    }
    reader.readAsText(file)
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-polar-700 bg-gray-50 dark:bg-polar-800 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {info.icon}
          <span className="text-sm font-medium">Add {info.label}</span>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onCancel}
          className="h-6 w-6"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={mode === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('url')}
          className="flex-1 gap-1"
        >
          <Link2 className="h-3.5 w-3.5" />
          URL
        </Button>
        <Button
          variant={mode === 'upload' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('upload')}
          className="flex-1 gap-1"
        >
          <Upload className="h-3.5 w-3.5" />
          Upload
        </Button>
      </div>

      {mode === 'url' ? (
        <div className="flex gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={`https://example.com/${fileType}`}
            className="flex-1 h-9"
          />
          <Button
            onClick={handleUrlSubmit}
            disabled={isLoading || !url.trim()}
            size="sm"
            className="h-9"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add'}
          </Button>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.xml"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="w-full h-20 border-dashed flex flex-col gap-1"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Upload className="h-5 w-5 text-gray-400" />
                <span className="text-xs text-gray-500">Click to upload or drag and drop</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function SiteDiscoverySection({
  websiteUrl,
  siteDiscovery,
  onUpdateSiteDiscovery,
}: SiteDiscoverySectionProps) {
  const [isDiscovering, setIsDiscovering] = useState(false)
  const [addingFileType, setAddingFileType] = useState<SiteFileType | null>(null)

  // Initialize discovery state if not provided
  const discovery = siteDiscovery || {
    config: DEFAULT_SITE_DISCOVERY_CONFIG,
    files: [],
  }

  const isDisabled = !websiteUrl || !websiteUrl.trim()

  // Discover files action
  
  // TODO: Discover files - loading state

  const handleDiscover = useCallback(() => {
    if (isDisabled) return
    setIsDiscovering(true)
  }, [websiteUrl, isDisabled])

  const handleRemoveFile = useCallback((fileId: string) => {
    onUpdateSiteDiscovery({
      ...discovery,
      files: discovery.files.filter(f => f.id !== fileId),
    })
    toast.success('File removed')
  }, [discovery, onUpdateSiteDiscovery])

  const handleAddFile = useCallback((file: SiteFile) => {
    // Replace if same type exists
    const filteredFiles = discovery.files.filter(f => f.type !== file.type)
    onUpdateSiteDiscovery({
      ...discovery,
      files: [...filteredFiles, file],
    })
    setAddingFileType(null)
  }, [discovery, onUpdateSiteDiscovery])

  const handleSyncToggle = useCallback((enabled: boolean) => {
    onUpdateSiteDiscovery({
      ...discovery,
      config: {
        ...discovery.config,
        syncEnabled: enabled,
        syncFrequency: 'weekly', // Always weekly
      },
    })
  }, [discovery, onUpdateSiteDiscovery])

  // Get file types not yet added
  const missingFileTypes = (Object.keys(FILE_TYPE_INFO) as SiteFileType[])
    .filter(type => !discovery.files.some(f => f.type === type))

  return (
    <div className={cn(
      'flex w-full flex-col gap-y-8 transition-opacity',
      isDisabled && 'opacity-50 pointer-events-none'
    )}>
      {/* Card 1: Header & Discovery */}
      <div className="dark:border-polar-700 flex flex-col rounded-4xl border border-gray-200 p-8">
        <div className="flex flex-col gap-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Site Files Discovery</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="text-gray-400 hover:text-gray-600">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="max-w-sm border border-gray-700 bg-gray-900 p-4 text-white dark:border-gray-300 dark:bg-gray-100 dark:text-gray-900"
                >
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-white dark:text-gray-900">
                      Why import site files?
                    </p>
                    <p className="text-xs leading-relaxed text-gray-100 dark:text-gray-800">
                      These files help AI systems understand your website better:
                    </p>
                    <ul className="list-disc space-y-1 pl-4 text-xs text-gray-100 dark:text-gray-800">
                      <li><strong>llms.txt</strong> - Tells AI models about your business</li>
                      <li><strong>sitemap.xml</strong> - Lists all your pages for indexing</li>
                      <li><strong>robots.txt</strong> - Shows crawling preferences</li>
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Discover and import your site&apos;s llms.txt, sitemap, and other files to enhance AI understanding of your content.
          </p>
          
          {/* Discover Button */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleDiscover}
              disabled={isDisabled || isDiscovering}
              className="gap-2"
            >
              {isDiscovering ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {isDiscovering ? 'Discovering...' : 'Discover Files'}
            </Button>
            {isDisabled && (
              <span className="text-sm text-gray-500">
                Enter a website URL first
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card 2: Files Table & Settings */}
      <div className="dark:border-polar-700 flex flex-col rounded-4xl border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-polar-700 bg-gray-50 dark:bg-polar-800/50">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Discovered Files
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {discovery.files.length === 0 
              ? 'No files discovered yet' 
              : `${discovery.files.length} file${discovery.files.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Files Table */}
        <SiteFilesTable
          files={discovery.files}
          onRemoveFile={handleRemoveFile}
          itemsLabel="items"
          emptyMessage="No files discovered yet. Click 'Discover Files' above to scan your website."
        />

        {/* Add File Section */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-polar-700 space-y-4">
          {/* Add File Dialog */}
          {addingFileType && (
            <AddFileDialog
              fileType={addingFileType}
              onAdd={handleAddFile}
              onCancel={() => setAddingFileType(null)}
            />
          )}

          {/* Add File Buttons */}
          {!addingFileType && missingFileTypes.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs text-gray-600 dark:text-gray-400">
                Add files manually
              </Label>
              <div className="flex flex-wrap gap-2">
                {missingFileTypes.map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAddingFileType(type)}
                    className="gap-1.5 text-xs"
                  >
                    {FILE_TYPE_INFO[type].icon}
                    {FILE_TYPE_INFO[type].label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Weekly Sync Toggle */}
          {discovery.files.length > 0 && (
            <div className="rounded-lg border border-gray-200 dark:border-polar-700 bg-gray-50 dark:bg-polar-800 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-4 w-4 text-gray-500" />
                  <div>
                    <Label className="text-sm font-medium">Weekly Sync</Label>
                    <p className="text-xs text-gray-500">
                      Automatically re-scan and index files every week
                    </p>
                  </div>
                </div>
                <Switch
                  checked={discovery.config.syncEnabled}
                  onCheckedChange={handleSyncToggle}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
