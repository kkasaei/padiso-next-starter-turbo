'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  FolderOpen,
  ChevronRight,
  Loader2,
  ArrowLeft,
  FolderPlus,
  FileText,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@workspace/ui/components/dialog'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { Progress } from '@workspace/ui/components/progress'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

import type { ExportJob } from '@/lib/shcmea/types/content-export'

// ============================================================
// TYPES
// ============================================================

interface DriveFolder {
  id: string
  name: string
  hasChildren?: boolean
}

interface ContentItem {
  id: string
  title: string
}

interface BulkExportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contentItems: ContentItem[]
  integrationId: string
  onSuccess?: () => void
}

// ============================================================
// COMPONENT
// ============================================================

export function BulkExportModal({
  open,
  onOpenChange,
  contentItems,
  integrationId,
  onSuccess,
}: BulkExportModalProps) {
  // Folder navigation state
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [currentFolderName, setCurrentFolderName] = useState<string>('My Drive')
  const [folders, setFolders] = useState<DriveFolder[]>([])
  const [documents, setDocuments] = useState<Array<{ id: string; name: string }>>([])
  const [isLoadingFolders, setIsLoadingFolders] = useState(false)
  const [folderPath, setFolderPath] = useState<Array<{ id: string | null; name: string }>>([
    { id: null, name: 'My Drive' },
  ])

  // Create folder state
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  // Export job state
  const [exportJobId, setExportJobId] = useState<string | null>(null)
  const [exportJob, setExportJob] = useState<ExportJob | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  // Reset state when modal opens
  useEffect(() => {
    if (!open) return

    queueMicrotask(() => {
      setCurrentFolderId(null)
      setCurrentFolderName('My Drive')
      setFolderPath([{ id: null, name: 'My Drive' }])
      setIsCreatingFolder(false)
      setNewFolderName('')
      setDocuments([])
      setExportJobId(null)
      setExportJob(null)
      setIsExporting(false)
      loadFolders(null)
    })
  }, [open])

  const [createFolderStatus, setCreateFolderStatus] = useState<'idle' | 'executing'>('idle')

  // Mock fetch folders
  const fetchFolders = useCallback((_params: { integrationId: string; parentId?: string }) => {
    // TODO: Implement fetch folders action
    setTimeout(() => {
      setFolders([
        { id: 'folder-1', name: 'Documents', hasChildren: true },
        { id: 'folder-2', name: 'Projects', hasChildren: true },
      ])
      setDocuments([])
      setIsLoadingFolders(false)
    }, 500)
  }, [])

  // Mock create folder
  const createFolder = useCallback((_params: { integrationId: string; parentId?: string; folderName: string }) => {
    setCreateFolderStatus('executing')
    // TODO: Implement create folder action
    setTimeout(() => {
      toast.success(`Folder "${_params.folderName}" created!`)
      setNewFolderName('')
      setIsCreatingFolder(false)
      setCreateFolderStatus('idle')
      setFolders((prev) => [...prev, { id: `folder-${Date.now()}`, name: _params.folderName }])
    }, 500)
  }, [])

  // Mock fetch export job
  const fetchExportJob = useCallback((_params: { jobId: string }) => {
    // TODO: Implement fetch export job action
    setExportJob((prev) => {
      if (!prev) {
        return {
          id: _params.jobId,
          projectId: 'mock-project',
          organizationId: 'mock-org',
          userId: 'mock-user',
          sourceType: 'google_drive',
          status: 'processing',
          progress: { total: contentItems.length, processed: 0, successful: 0, failed: 0 },
          errors: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          folderId: null,
          folderName: null,
          contentIds: contentItems.map(item => item.id),
          config: {},
        } as ExportJob
      }
      const newProcessed = Math.min(prev.progress.processed + 1, prev.progress.total)
      const isComplete = newProcessed >= prev.progress.total
      if (isComplete) {
        toast.success('Export completed!', {
          description: `${newProcessed} of ${prev.progress.total} items exported successfully.`,
        })
        setIsExporting(false)
        onSuccess?.()
      }
      return {
        ...prev,
        status: isComplete ? 'completed' : 'processing',
        progress: {
          ...prev.progress,
          processed: newProcessed,
          successful: newProcessed,
        },
        updatedAt: new Date().toISOString(),
      } as ExportJob
    })
  }, [contentItems, onSuccess])

  // Mock start bulk export
  const startBulkExport = useCallback((_params: { contentIds: string[]; integrationId: string; folderId?: string; folderName: string }) => {
    // TODO: Implement bulk export action
    const mockJobId = `export-job-${Date.now()}`
    setExportJobId(mockJobId)
    setIsExporting(true)
    toast.success('Export started!', {
      description: `Exporting ${contentItems.length} items to Google Drive...`,
    })
  }, [contentItems.length])

  // Mock cancel export
  const cancelExport = useCallback((_params: { jobId: string }) => {
    // TODO: Implement cancel export action
    toast.info('Export cancelled')
    setIsExporting(false)
    setExportJob((prev) => prev ? { ...prev, status: 'cancelled' as const } : null)
  }, [])

  // Poll for export job status
  useEffect(() => {
    if (!exportJobId) return

    const interval = setInterval(() => {
      fetchExportJob({ jobId: exportJobId })
    }, 1000)

    return () => clearInterval(interval)
  }, [exportJobId, fetchExportJob])

  // Load folders for a parent
  const loadFolders = useCallback(
    (parentId: string | null) => {
      setIsLoadingFolders(true)
      setFolders([])
      setDocuments([])
      fetchFolders({
        integrationId,
        parentId: parentId || undefined,
      })
    },
    [fetchFolders, integrationId]
  )

  // Navigate into a folder
  const handleNavigateIntoFolder = useCallback(
    (folder: DriveFolder) => {
      setCurrentFolderId(folder.id)
      setCurrentFolderName(folder.name)
      setFolderPath((prev) => [...prev, { id: folder.id, name: folder.name }])
      loadFolders(folder.id)
    },
    [loadFolders]
  )

  // Navigate back
  const handleNavigateBack = useCallback(() => {
    if (folderPath.length > 1) {
      const newPath = folderPath.slice(0, folderPath.length - 1)
      const lastItem = newPath[newPath.length - 1]!

      setFolderPath(newPath)
      setCurrentFolderId(lastItem.id)
      setCurrentFolderName(lastItem.name)
      loadFolders(lastItem.id)
    }
  }, [folderPath, loadFolders])

  // Navigate to a specific path item
  const handleNavigateToPath = useCallback(
    (index: number) => {
      if (index < folderPath.length - 1) {
        const newPath = folderPath.slice(0, index + 1)
        const targetItem = newPath[newPath.length - 1]!

        setFolderPath(newPath)
        setCurrentFolderId(targetItem.id)
        setCurrentFolderName(targetItem.name)
        loadFolders(targetItem.id)
      }
    },
    [folderPath, loadFolders]
  )

  // Handle new folder creation
  const handleCreateFolder = useCallback(() => {
    if (!newFolderName.trim()) {
      toast.error('Folder name cannot be empty')
      return
    }

    createFolder({
      integrationId,
      parentId: currentFolderId || undefined,
      folderName: newFolderName.trim(),
    })
  }, [integrationId, currentFolderId, newFolderName, createFolder])

  // Handle export
  const handleExport = useCallback(() => {
    startBulkExport({
      contentIds: contentItems.map((item) => item.id),
      integrationId,
      folderId: currentFolderId || undefined,
      folderName: currentFolderName,
    })
  }, [contentItems, integrationId, currentFolderId, currentFolderName, startBulkExport])

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (exportJobId) {
      cancelExport({ jobId: exportJobId })
    }
  }, [exportJobId, cancelExport])

  const isCreatingFolderLoading = createFolderStatus === 'executing'
  const canGoBack = folderPath.length > 1
  const progressPercent = exportJob
    ? (exportJob.progress.processed / exportJob.progress.total) * 100
    : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px] w-full overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image
              src="/icons/google-drive.svg"
              alt="Google Drive"
              width={24}
              height={24}
            />
            Export {contentItems.length} Items to Google Drive
          </DialogTitle>
        </DialogHeader>

        {/* Export Progress View */}
        {isExporting || exportJob ? (
          <div className="flex flex-col gap-6 py-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {exportJob?.status === 'completed'
                    ? 'Export Complete!'
                    : exportJob?.status === 'failed'
                    ? 'Export Failed'
                    : exportJob?.status === 'cancelled'
                    ? 'Export Cancelled'
                    : 'Exporting...'}
                </span>
                {exportJob && (
                  <span className="text-sm text-muted-foreground">
                    {exportJob.progress.processed} / {exportJob.progress.total}
                  </span>
                )}
              </div>

              <Progress value={progressPercent} className="h-2" />

              {exportJob && exportJob.progress.processed > 0 && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{exportJob.progress.successful} successful</span>
                  </div>
                  {exportJob.progress.failed > 0 && (
                    <div className="flex items-center gap-1.5 text-red-600">
                      <XCircle className="h-4 w-4" />
                      <span>{exportJob.progress.failed} failed</span>
                    </div>
                  )}
                </div>
              )}

              {/* Error list */}
              {exportJob && exportJob.errors.length > 0 && (
                <div className="max-h-[150px] overflow-y-auto rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30 p-3">
                  <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-2">
                    Failed items:
                  </p>
                  <ul className="space-y-1">
                    {exportJob.errors.map((error, index) => (
                      <li key={index} className="text-xs text-red-600 dark:text-red-400">
                        • {error.title}: {error.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <DialogFooter>
              {exportJob?.status === 'processing' && (
                <Button variant="outline" onClick={handleCancel}>
                  Cancel Export
                </Button>
              )}
              {(exportJob?.status === 'completed' ||
                exportJob?.status === 'failed' ||
                exportJob?.status === 'cancelled') && (
                <Button onClick={() => onOpenChange(false)}>Close</Button>
              )}
            </DialogFooter>
          </div>
        ) : (
          /* Folder Selection View */
          <div className="flex flex-col gap-6 py-4 max-w-[460px]">
            {/* Items to export */}
            <div className="flex flex-col gap-2">
              <Label>Items to Export ({contentItems.length})</Label>
              <div className="max-h-[100px] overflow-y-auto rounded-lg border border-border bg-muted/30 p-2">
                <div className="flex flex-wrap gap-1.5">
                  {contentItems.slice(0, 10).map((item) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center px-2 py-1 text-xs bg-background rounded border border-border truncate max-w-[150px]"
                      title={item.title}
                    >
                      {item.title}
                    </span>
                  ))}
                  {contentItems.length > 10 && (
                    <span className="inline-flex items-center px-2 py-1 text-xs text-muted-foreground">
                      +{contentItems.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Folder Selection */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label>Save Location</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreatingFolder(!isCreatingFolder)}
                  className="h-7 text-xs gap-1"
                >
                  <FolderPlus className="h-3.5 w-3.5" />
                  New Folder
                </Button>
              </div>

              {/* Create Folder Input */}
              {isCreatingFolder && (
                <div className="flex gap-2">
                  <Input
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="New folder name"
                    className="flex-1"
                    disabled={isCreatingFolderLoading}
                  />
                  <Button
                    onClick={handleCreateFolder}
                    disabled={isCreatingFolderLoading || !newFolderName.trim()}
                    size="sm"
                  >
                    {isCreatingFolderLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Create'
                    )}
                  </Button>
                </div>
              )}

              {/* Breadcrumbs */}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                {canGoBack && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleNavigateBack}
                    aria-label="Go back"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                {folderPath.map((item, index) => (
                  <div key={item.id || 'root'} className="flex items-center">
                    {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
                    <button
                      onClick={() => handleNavigateToPath(index)}
                      className={cn(
                        'hover:underline',
                        index === folderPath.length - 1 && 'font-medium text-foreground'
                      )}
                      disabled={index === folderPath.length - 1}
                    >
                      {item.name}
                    </button>
                  </div>
                ))}
              </div>

              {/* Folder & Document List */}
              <div className="border rounded-lg max-h-[200px] overflow-y-auto bg-muted/30">
                {isLoadingFolders ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : folders.length === 0 && documents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                    <FolderOpen className="h-8 w-8 text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">This folder is empty</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Items will be saved in <span className="font-medium">{currentFolderName}</span>
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {folders.map((folder) => (
                      <div
                        key={folder.id}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors cursor-pointer group"
                        onClick={() => handleNavigateIntoFolder(folder)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleNavigateIntoFolder(folder)
                          }
                        }}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 shrink-0">
                          <FolderOpen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{folder.name}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-3 px-4 py-2.5 opacity-60"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 shrink-0">
                          <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{doc.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Location Display */}
              <div className="flex items-center gap-2 text-sm bg-muted/30 px-3 py-2 rounded-xl border border-border">
                <FolderOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">
                  Save to:{' '}
                  <span className="font-medium text-foreground">{currentFolderName}</span>
                </span>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleExport}>
                Export {contentItems.length} Items
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

