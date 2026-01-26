'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  Search,
  FileText,
  Loader2,
  ChevronRight,
  Check,
  RefreshCw,
  AlertCircle,
  Link2,
} from 'lucide-react'
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
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

import { CONTENT_STATUS_CONFIG } from '@/lib/shcmea/types/content-import'
import type { GoogleDriveDocForImport, ContentStatusForImport } from '@/lib/shcmea/types/content-import'
import type { ContentStatus } from '@prisma/client'

interface GoogleDriveTabProps {
  projectId: string
  integrationId: string | null
  onImportStarted: (jobId: string) => void
  onConnectIntegration: () => void
}

export function GoogleDriveTab({
  projectId,
  integrationId,
  onImportStarted,
  onConnectIntegration,
}: GoogleDriveTabProps) {
  const [documents, setDocuments] = useState<GoogleDriveDocForImport[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [defaultStatus, setDefaultStatus] = useState<ContentStatusForImport>('DRAFT')
  const [importStatus, setImportStatus] = useState<'idle' | 'executing'>('idle')

  // Mock fetch documents
  const fetchDocs = useCallback((_params: { projectId: string; integrationId: string; search?: string }) => {
    // TODO: Implement fetch documents action
    setTimeout(() => {
      // Mock data
      setDocuments([
        { id: '1', name: 'Sample Document 1', modifiedTime: new Date().toISOString() },
        { id: '2', name: 'Sample Document 2', modifiedTime: new Date().toISOString() },
      ])
      setIsLoading(false)
    }, 500)
  }, [])

  // Mock start import
  const startImport = useCallback((_params: { projectId: string; integrationId: string; documentIds: string[]; defaultStatus: ContentStatusForImport }) => {
    setImportStatus('executing')
    // TODO: Implement import action
    setTimeout(() => {
      const mockJobId = `job-${Date.now()}`
      toast.success('Import started successfully')
      onImportStarted(mockJobId)
      setImportStatus('idle')
    }, 1000)
  }, [onImportStarted])

  // Load documents
  const loadDocuments = useCallback(() => {
    if (!integrationId) return

    setIsLoading(true)
    fetchDocs({
      projectId,
      integrationId,
      search: searchQuery || undefined,
    })
  }, [projectId, integrationId, searchQuery, fetchDocs])

  // Initial load
  useEffect(() => {
    if (integrationId) {
      loadDocuments()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [integrationId])

  // Handle search with debounce
  useEffect(() => {
    if (!integrationId) return

    const timer = setTimeout(() => {
      loadDocuments()
    }, 300)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  // Selection handlers
  const handleToggleSelect = (docId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(docId)) {
        next.delete(docId)
      } else {
        next.add(docId)
      }
      return next
    })
  }

  const handleSelectAll = () => {
    if (selectedIds.size === documents.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(documents.map((d) => d.id)))
    }
  }

  // Start import
  const handleStartImport = () => {
    if (!integrationId || selectedIds.size === 0) return

    startImport({
      projectId,
      integrationId,
      documentIds: Array.from(selectedIds),
      defaultStatus,
    })
  }

  // Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // No integration connected
  if (!integrationId) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
          <Image
            src="/icons/google-drive.svg"
            alt="Google Drive"
            width={32}
            height={32}
            className="opacity-50"
          />
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h3 className="font-medium">Connect Google Drive</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Connect your Google account to import documents from Google Drive.
          </p>
        </div>
        <Button onClick={onConnectIntegration} className="rounded-full gap-2">
          <Link2 className="h-4 w-4" />
          Connect Google Account
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search and Refresh */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-full"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={loadDocuments}
          disabled={isLoading}
          className="h-10 w-10 rounded-full shrink-0"
        >
          <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
        </Button>
      </div>

      {/* Default Settings */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
        <span className="text-sm text-muted-foreground whitespace-nowrap">Import with status:</span>
        <Select
          value={defaultStatus}
          onValueChange={(v) => setDefaultStatus(v as ContentStatusForImport)}
        >
          <SelectTrigger className="w-[120px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(CONTENT_STATUS_CONFIG) as ContentStatus[]).map((status) => (
              <SelectItem key={status} value={status}>
                {CONTENT_STATUS_CONFIG[status].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Document List */}
      <div className="flex flex-col rounded-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={documents.length > 0 && selectedIds.size === documents.length}
              onCheckedChange={handleSelectAll}
              aria-label="Select all"
            />
            <span className="text-sm font-medium">
              {selectedIds.size > 0
                ? `${selectedIds.size} selected`
                : `${documents.length} document${documents.length !== 1 ? 's' : ''}`}
            </span>
          </div>
          {selectedIds.size > 0 && (
            <Button
              size="sm"
              onClick={handleStartImport}
              disabled={importStatus === 'executing'}
              className="rounded-full gap-2"
            >
              {importStatus === 'executing' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Import {selectedIds.size} Document{selectedIds.size !== 1 ? 's' : ''}
            </Button>
          )}
        </div>

        {/* List */}
        <div className="max-h-[300px] overflow-y-auto divide-y divide-border">
          {isLoading && documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Loading documents...</span>
            </div>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <FileText className="h-8 w-8 text-muted-foreground/50" />
              <span className="text-sm text-muted-foreground">
                {searchQuery ? 'No documents match your search' : 'No Google Docs found'}
              </span>
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                role="button"
                tabIndex={0}
                onClick={() => handleToggleSelect(doc.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleToggleSelect(doc.id)
                  }
                }}
                className={cn(
                  'flex items-center gap-3 w-full px-4 py-3 text-left transition-colors cursor-pointer',
                  selectedIds.has(doc.id)
                    ? 'bg-primary/5'
                    : 'hover:bg-muted/50'
                )}
              >
                <Checkbox
                  checked={selectedIds.has(doc.id)}
                  onCheckedChange={() => handleToggleSelect(doc.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 shrink-0">
                  {doc.iconLink ? (
                    <Image
                      src={doc.iconLink}
                      alt=""
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  ) : (
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <span className="font-medium text-sm truncate">{doc.name}</span>
                  {doc.modifiedTime && (
                    <span className="text-xs text-muted-foreground">
                      Modified {formatDate(doc.modifiedTime)}
                    </span>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Note */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200">
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
        <p className="text-xs">
          Documents will be converted from Google Docs to Markdown format. Complex formatting may
          be simplified.
        </p>
      </div>
    </div>
  )
}

