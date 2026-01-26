'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  FolderOpen,
  ChevronRight,
  Loader2,
  ArrowLeft,
  Home,
  FolderPlus,
  FileText,
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
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// ============================================================
// TYPES
// ============================================================

interface DriveFolder {
  id: string
  name: string
  hasChildren?: boolean
}

interface ExportToDriveModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contentId: string
  contentTitle: string
  integrationId: string
  onSuccess?: () => void
}

// ============================================================
// COMPONENT
// ============================================================

export function ExportToDriveModal({
  open,
  onOpenChange,
  contentId,
  contentTitle,
  integrationId,
  onSuccess,
}: ExportToDriveModalProps) {
  // State
  const [fileName, setFileName] = useState(contentTitle)
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [currentFolderName, setCurrentFolderName] = useState<string>('My Drive')
  const [folders, setFolders] = useState<DriveFolder[]>([])
  const [documents, setDocuments] = useState<Array<{ id: string; name: string; mimeType?: string }>>([])
  const [isLoadingFolders, setIsLoadingFolders] = useState(false)
  const [folderPath, setFolderPath] = useState<Array<{ id: string | null; name: string }>>([
    { id: null, name: 'My Drive' },
  ])

  // Create folder state
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [createFolderStatus, setCreateFolderStatus] = useState<'idle' | 'executing'>('idle')
  const [exportStatus, setExportStatus] = useState<'idle' | 'executing'>('idle')

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
      toast.success(`Folder "${_params.folderName}" created`)
      setNewFolderName('')
      setIsCreatingFolder(false)
      setCreateFolderStatus('idle')
      // Add mock folder to list
      setFolders((prev) => [...prev, { id: `folder-${Date.now()}`, name: _params.folderName }])
    }, 500)
  }, [])

  // Mock export to drive
  const exportToDrive = useCallback((_params: { contentId: string; integrationId: string; folderId?: string; fileName: string }) => {
    setExportStatus('executing')
    // TODO: Implement export action
    setTimeout(() => {
      toast.success('Saved to Google Drive!', {
        description: `${_params.fileName} saved to ${currentFolderName}`,
      })
      setExportStatus('idle')
      onOpenChange(false)
      onSuccess?.()
    }, 1000)
  }, [currentFolderName, onOpenChange, onSuccess])

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

  // Reset state when modal opens
  useEffect(() => {
    if (!open) return

    // Use queueMicrotask to batch state updates after effect completes
    queueMicrotask(() => {
      setFileName(contentTitle)
      setCurrentFolderId(null)
      setCurrentFolderName('My Drive')
      setFolderPath([{ id: null, name: 'My Drive' }])
      setIsCreatingFolder(false)
      setNewFolderName('')
      setDocuments([])
      // Load root folders
      loadFolders(null)
    })
  }, [open, contentTitle, loadFolders])

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
    if (folderPath.length <= 1) return

    const newPath = folderPath.slice(0, -1)
    const lastItem = newPath[newPath.length - 1]!

    setFolderPath(newPath)
    setCurrentFolderId(lastItem.id)
    setCurrentFolderName(lastItem.name)
    loadFolders(lastItem.id)
  }, [folderPath, loadFolders])

  // Navigate to a specific path item (breadcrumb)
  const handleNavigateToPath = useCallback(
    (index: number) => {
      if (index >= folderPath.length - 1) return // Already at this location

      const newPath = folderPath.slice(0, index + 1)
      const targetItem = newPath[newPath.length - 1]!

      setFolderPath(newPath)
      setCurrentFolderId(targetItem.id)
      setCurrentFolderName(targetItem.name)
      loadFolders(targetItem.id)
    },
    [folderPath, loadFolders]
  )

  // Handle create folder
  const handleCreateFolder = useCallback(() => {
    if (!newFolderName.trim()) {
      toast.error('Please enter a folder name')
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
    if (!fileName.trim()) {
      toast.error('Please enter a file name')
      return
    }

    exportToDrive({
      contentId,
      integrationId,
      folderId: currentFolderId || undefined,
      fileName: fileName.trim(),
    })
  }, [contentId, integrationId, currentFolderId, fileName, exportToDrive])

  const isExporting = exportStatus === 'executing'
  const isCreatingFolderLoading = createFolderStatus === 'executing'
  const canGoBack = folderPath.length > 1

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] w-full overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image
              src="/icons/google-drive.svg"
              alt="Google Drive"
              width={24}
              height={24}
            />
            Save to Google Drive
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4 max-w-[460px]">
          {/* File Name Input */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="fileName">Document Name</Label>
            <Input
              id="fileName"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter document name"
              className="max-w-[460px]"
            />
            <p className="text-xs text-muted-foreground">
              Will be saved as a Google Doc with formatted content
            </p>
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
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="New folder name"
                  className="h-8 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateFolder()
                    if (e.key === 'Escape') {
                      setIsCreatingFolder(false)
                      setNewFolderName('')
                    }
                  }}
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={handleCreateFolder}
                  disabled={isCreatingFolderLoading || !newFolderName.trim()}
                  className="h-8"
                >
                  {isCreatingFolderLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Create'
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsCreatingFolder(false)
                    setNewFolderName('')
                  }}
                  className="h-8"
                >
                  Cancel
                </Button>
              </div>
            )}

            {/* Navigation Header */}
            <div className="flex items-center gap-2 text-sm">
              {/* Back Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNavigateBack}
                disabled={!canGoBack || isLoadingFolders}
                className="h-7 w-7 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              {/* Breadcrumb Path */}
              <div className="flex items-center gap-1 text-muted-foreground overflow-x-auto flex-1">
                {folderPath.map((item, index) => (
                  <div key={index} className="flex items-center gap-1 shrink-0">
                    {index > 0 && <ChevronRight className="h-3 w-3" />}
                    <button
                      onClick={() => handleNavigateToPath(index)}
                      disabled={index === folderPath.length - 1}
                      className={cn(
                        'hover:text-foreground transition-colors px-1 py-0.5 rounded text-sm',
                        index === folderPath.length - 1
                          ? 'text-foreground font-medium cursor-default'
                          : 'hover:bg-muted cursor-pointer'
                      )}
                    >
                      {index === 0 ? (
                        <span className="flex items-center gap-1">
                          <Home className="h-3 w-3" />
                          {item.name}
                        </span>
                      ) : (
                        item.name
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Folder & Document List */}
            <div className="border rounded-lg max-h-[240px] overflow-y-auto bg-muted/30">
              {isLoadingFolders ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : folders.length === 0 && documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                  <FolderOpen className="h-8 w-8 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">This folder is empty</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Document will be saved in <span className="font-medium">{currentFolderName}</span>
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {/* Folders - can be navigated into */}
                  {folders.map((folder) => (
                    <div
                      key={folder.id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer group"
                      onClick={() => handleNavigateIntoFolder(folder)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleNavigateIntoFolder(folder)
                        }
                      }}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 shrink-0">
                        <FolderOpen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{folder.name}</p>
                        <p className="text-xs text-muted-foreground">Folder</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}

                  {/* Documents - shown for context (not clickable) */}
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 px-4 py-3 opacity-60"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 shrink-0">
                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">Google Doc</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Location Display */}
            <div className="flex items-center gap-2 text-sm bg-muted/30 px-3 py-2.5 rounded-xl">
              <FolderOpen className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">
                Save to:{' '}
                <span className="font-medium text-foreground">{currentFolderName}</span>
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting || !fileName.trim()}>
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Save to Drive
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
