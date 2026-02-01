'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Loader2,
  Folder,
  FolderPlus,
  ChevronRight,
  Home,
  Link2,
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@workspace/ui/components/dialog'
import { cn } from '@workspace/common/lib'
import { toast } from 'sonner'

import type { TrackedPrompt } from '../types'
import type { GoogleDriveFolder, GoogleDriveFolderBreadcrumb } from '@workspace/common/lib/shcmea/types/opportunity-export'

interface GoogleSheetsExportTabProps {
  projectId: string
  prompts: TrackedPrompt[]
  integrationId: string | null
  onConnectIntegration: () => void
  onExportComplete: () => void
}

export function GoogleSheetsExportTab({
  projectId,
  prompts,
  integrationId,
  onConnectIntegration,
  onExportComplete,
}: GoogleSheetsExportTabProps) {
  // ============================================================
  // STATE
  // ============================================================
  const [fileName, setFileName] = useState(`Prompts Export - ${new Date().toLocaleDateString()}`)
  const [folders, setFolders] = useState<GoogleDriveFolder[]>([])
  const [breadcrumbs, setBreadcrumbs] = useState<GoogleDriveFolderBreadcrumb[]>([])
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined)
  const [selectedFolderId, setSelectedFolderId] = useState<string>('root')
  const [selectedFolderName, setSelectedFolderName] = useState<string>('My Drive')
  const [isLoading, setIsLoading] = useState(false)
  const [showFolderBrowser, setShowFolderBrowser] = useState(false)
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [exportResult, setExportResult] = useState<{ url: string; name: string } | null>(null)
  const [needsReconnect, setNeedsReconnect] = useState(false)
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // ============================================================
  // MOCK DATA
  // ============================================================
  const mockFolders: GoogleDriveFolder[] = [
    { id: 'folder-1', name: 'Projects' },
    { id: 'folder-2', name: 'Exports' },
    { id: 'folder-3', name: 'Reports' },
  ]

  // ============================================================
  // LOAD FOLDERS
  // ============================================================
  const loadFolders = () => {
    if (!integrationId) return

    setIsLoading(true)
    // Simulate loading folders
    setTimeout(() => {
      setFolders(mockFolders)
      setBreadcrumbs([
        { id: 'root', name: 'My Drive' },
        ...(currentFolderId ? [{ id: currentFolderId, name: folders.find(f => f.id === currentFolderId)?.name || 'Folder' }] : [])
      ])
      setIsLoading(false)
    }, 500)
  }

  // Load folders when folder browser opens or folder changes
  useEffect(() => {
    if (showFolderBrowser && integrationId) {
      loadFolders()
    }
  }, [showFolderBrowser, currentFolderId, integrationId, loadFolders])

  // ============================================================
  // HANDLERS
  // ============================================================

  // Navigate to folder
  const handleFolderClick = (folderId: string) => {
    setCurrentFolderId(folderId === 'root' ? undefined : folderId)
  }

  // Navigate to breadcrumb
  const handleBreadcrumbClick = (crumb: GoogleDriveFolderBreadcrumb) => {
    setCurrentFolderId(crumb.id === 'root' ? undefined : crumb.id)
  }

  // Select current folder as destination
  const handleSelectFolder = () => {
    const currentCrumb = breadcrumbs[breadcrumbs.length - 1]
    setSelectedFolderId(currentCrumb?.id || 'root')
    setSelectedFolderName(currentCrumb?.name || 'My Drive')
    setShowFolderBrowser(false)
  }

  // Select a specific folder
  const handleSelectSpecificFolder = (folder: GoogleDriveFolder) => {
    setSelectedFolderId(folder.id)
    setSelectedFolderName(folder.name)
    setShowFolderBrowser(false)
  }

  // Create new folder
  const handleCreateFolder = () => {
    if (!integrationId || !newFolderName.trim()) return

    setIsCreatingFolder(true)
    // Simulate folder creation
    setTimeout(() => {
      const newFolder: GoogleDriveFolder = {
        id: `folder-${Date.now()}`,
        name: newFolderName.trim(),
      }
      setFolders((prev) => [...prev, newFolder])
      toast.success(`Folder "${newFolder.name}" created`)
      setNewFolderName('')
      setShowNewFolderDialog(false)
      setSelectedFolderId(newFolder.id)
      setSelectedFolderName(newFolder.name)
      setIsCreatingFolder(false)
    }, 500)
  }

  // Export to Google Sheets
  const handleExport = () => {
    if (!integrationId || !fileName.trim()) return

    setIsExporting(true)
    // Simulate export
    setTimeout(() => {
      toast.success(`Exported ${prompts.length} prompts to Google Sheets`)
      setExportResult({
        url: `https://docs.google.com/spreadsheets/d/mock-${Date.now()}`,
        name: fileName.trim(),
      })
      setIsExporting(false)
    }, 1500)
  }

  // ============================================================
  // RENDER: No integration connected
  // ============================================================
  if (!integrationId) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-4">
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
            Connect your Google account to export prompts to Google Sheets.
          </p>
        </div>
        <Button onClick={onConnectIntegration} className="rounded-full gap-2">
          <Link2 className="h-4 w-4" />
          Connect Google Account
        </Button>
      </div>
    )
  }

  // ============================================================
  // RENDER: Export Success
  // ============================================================
  if (exportResult) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h3 className="font-medium">Export Successful!</h3>
          <p className="text-sm text-muted-foreground">
            {prompts.length} prompts exported to Google Sheets
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Button
            asChild
            className="rounded-full gap-2"
          >
            <a href={exportResult.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Open in Google Sheets
            </a>
          </Button>
          <Button
            variant="outline"
            onClick={onExportComplete}
            className="rounded-full"
          >
            Done
          </Button>
        </div>
      </div>
    )
  }

  // ============================================================
  // RENDER: Export Form
  // ============================================================
  return (
    <div className="flex flex-col gap-4">
      {/* File Name Input */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="sheets-filename">Spreadsheet Name</Label>
        <Input
          id="sheets-filename"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Enter spreadsheet name"
        />
      </div>

      {/* Folder Selection */}
      <div className="flex flex-col gap-2">
        <Label>Save to Folder</Label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFolderBrowser(true)}
            className="flex-1 justify-start gap-2 h-10"
          >
            <Folder className="h-4 w-4 text-amber-500" />
            <span className="truncate">{selectedFolderName}</span>
          </Button>
        </div>
      </div>

      {/* Preview */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
          <FileSpreadsheet className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <span className="font-medium text-sm truncate">{fileName || 'Untitled'}</span>
          <span className="text-xs text-muted-foreground">
            {prompts.length} row{prompts.length !== 1 ? 's' : ''} → {selectedFolderName}
          </span>
        </div>
      </div>

      {/* Export Button */}
      {needsReconnect ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-amber-600 dark:text-amber-400">
            Your Google integration needs to be reconnected to grant Sheets access.
          </p>
          <Button
            onClick={() => {
              setNeedsReconnect(false)
              onConnectIntegration()
            }}
            className="rounded-full gap-2"
          >
            <Link2 className="h-4 w-4" />
            Reconnect Google Account
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleExport}
          disabled={!fileName.trim() || isExporting}
          className="rounded-full gap-2"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Export to Google Sheets
            </>
          )}
        </Button>
      )}

      {/* Folder Browser Dialog */}
      <Dialog open={showFolderBrowser} onOpenChange={setShowFolderBrowser}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Folder</DialogTitle>
          </DialogHeader>

          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <div className="flex items-center gap-1 px-1 text-sm overflow-x-auto pb-2">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.id} className="flex items-center shrink-0">
                  {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />}
                  <button
                    type="button"
                    onClick={() => handleBreadcrumbClick(crumb)}
                    className={cn(
                      'flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors',
                      index === breadcrumbs.length - 1
                        ? 'font-medium text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    {index === 0 && <Home className="h-3.5 w-3.5" />}
                    {crumb.name}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Folder List */}
          <div className="flex-1 overflow-y-auto border rounded-lg">
            <div className="flex items-center justify-between px-3 py-2 bg-muted/30 border-b">
              <span className="text-sm font-medium">
                {folders.length} folder{folders.length !== 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadFolders}
                  disabled={isLoading}
                  className="h-7 px-2"
                >
                  <RefreshCw className={cn('h-3.5 w-3.5', isLoading && 'animate-spin')} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewFolderDialog(true)}
                  className="h-7 px-2 gap-1"
                >
                  <FolderPlus className="h-3.5 w-3.5" />
                  New
                </Button>
              </div>
            </div>

            <div className="divide-y max-h-[250px] overflow-y-auto">
              {isLoading && folders.length === 0 ? (
                <div className="flex items-center justify-center py-8 gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Loading folders...</span>
                </div>
              ) : folders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                  <Folder className="h-8 w-8 text-muted-foreground/50" />
                  <span className="text-sm text-muted-foreground">No folders here</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewFolderDialog(true)}
                    className="gap-1"
                  >
                    <FolderPlus className="h-4 w-4" />
                    Create Folder
                  </Button>
                </div>
              ) : (
                folders.map((folder) => (
                  <div
                    key={folder.id}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-muted/50"
                  >
                    <button
                      type="button"
                      onClick={() => handleFolderClick(folder.id)}
                      className="flex items-center gap-2 flex-1 min-w-0"
                    >
                      <Folder className="h-5 w-5 text-amber-500 shrink-0" />
                      <span className="text-sm truncate">{folder.name}</span>
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSelectSpecificFolder(folder)}
                      className="h-7 px-2 text-xs shrink-0"
                    >
                      Select
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          <DialogFooter className="flex-row gap-2 sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setShowFolderBrowser(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSelectFolder}
              className="flex-1"
            >
              Save Here
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Folder Dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-folder-name">Folder Name</Label>
              <Input
                id="new-folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newFolderName.trim()) {
                    handleCreateFolder()
                  }
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Will be created in: {breadcrumbs[breadcrumbs.length - 1]?.name || 'My Drive'}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowNewFolderDialog(false)
                setNewFolderName('')
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim() || isCreatingFolder}
            >
              {isCreatingFolder ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create Folder'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
