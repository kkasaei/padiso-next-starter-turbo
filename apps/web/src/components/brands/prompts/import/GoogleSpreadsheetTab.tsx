'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Search,
  Loader2,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Link2,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Info,
  Upload,
  Download,
  Folder,
  Home,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table'
import { cn } from '@workspace/common/lib'
import { toast } from 'sonner'

import type { PromptValidationResult } from '@workspace/common/lib/shcmea/types/prompt-import'
import { PROMPT_CSV_TEMPLATE } from '@workspace/common/lib/shcmea/types/prompt-import'

// Types for Drive items (previously imported from actions)
interface DriveItem {
  id: string
  name: string
  mimeType?: string
  iconLink?: string
  modifiedTime?: string
  isFolder: boolean
}

interface DriveBreadcrumb {
  id: string
  name: string
}

interface GoogleSpreadsheetTabProps {
  projectId: string
  integrationId: string | null
  onImportComplete: () => void
  onClose: () => void
  onConnectIntegration: () => void
}

export function GoogleSpreadsheetTab({
  projectId,
  integrationId,
  onImportComplete,
  onClose,
  onConnectIntegration,
}: GoogleSpreadsheetTabProps) {
  // ============================================================
  // STATE
  // ============================================================
  const [items, setItems] = useState<DriveItem[]>([])
  const [breadcrumbs, setBreadcrumbs] = useState<DriveBreadcrumb[]>([])
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined)
  const [selectedSpreadsheet, setSelectedSpreadsheet] = useState<DriveItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [validationResult, setValidationResult] = useState<PromptValidationResult | null>(null)
  const [isReading, setIsReading] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  // ============================================================
  // MOCK DATA
  // ============================================================
  const mockItems: DriveItem[] = [
    { id: 'folder-1', name: 'Projects', isFolder: true },
    { id: 'folder-2', name: 'Imports', isFolder: true },
    { id: 'sheet-1', name: 'Prompts List.xlsx', isFolder: false, modifiedTime: new Date().toISOString() },
    { id: 'sheet-2', name: 'Marketing Prompts.xlsx', isFolder: false, modifiedTime: new Date(Date.now() - 86400000).toISOString() },
    { id: 'sheet-3', name: 'Q4 Campaigns.xlsx', isFolder: false, modifiedTime: new Date(Date.now() - 172800000).toISOString() },
  ]

  // ============================================================
  // LOAD ITEMS
  // ============================================================
  const loadItems = () => {
    if (!integrationId) return

    setIsLoading(true)
    // Simulate loading files
    setTimeout(() => {
      // Filter by search query if present
      let filteredItems = mockItems
      if (searchQuery) {
        filteredItems = mockItems.filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      setItems(filteredItems)
      setBreadcrumbs([
        { id: 'root', name: 'My Drive' },
        ...(currentFolderId ? [{ id: currentFolderId, name: items.find(i => i.id === currentFolderId)?.name || 'Folder' }] : [])
      ])
      setIsLoading(false)
    }, 500)
  }

  // Initial load
  useEffect(() => {
    if (integrationId) {
      loadItems()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [integrationId, currentFolderId])

  // Handle search with debounce
  useEffect(() => {
    if (!integrationId) return

    const timer = setTimeout(() => {
      loadItems()
    }, 300)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  // ============================================================
  // HANDLERS
  // ============================================================

  // Navigate to folder
  const handleFolderClick = (folderId: string) => {
    setCurrentFolderId(folderId === 'root' ? undefined : folderId)
    setSearchQuery('')
  }

  // Navigate to breadcrumb
  const handleBreadcrumbClick = (crumb: DriveBreadcrumb) => {
    setCurrentFolderId(crumb.id === 'root' ? undefined : crumb.id)
    setSearchQuery('')
  }

  // Go back to parent folder
  const handleGoBack = () => {
    if (breadcrumbs.length > 1) {
      const parentIndex = breadcrumbs.length - 2
      const parent = breadcrumbs[parentIndex]
      setCurrentFolderId(parent?.id === 'root' ? undefined : parent?.id ?? undefined)
    }
  }

  // Select spreadsheet for validation
  const handleSelectSpreadsheet = (item: DriveItem) => {
    setSelectedSpreadsheet(item)
    setValidationResult(null)
    setIsReading(true)

    // Simulate reading and validating the spreadsheet data
    setTimeout(() => {
      // Mock validation result
      const mockValidation: PromptValidationResult = {
        valid: true,
        totalRows: 5,
        validRows: 5,
        errors: [],
        data: [
          { prompt: 'What are the best project management tools for startups?', location: 'US', notes: '' },
          { prompt: 'How to improve team productivity remotely?', location: 'Global', notes: '' },
          { prompt: 'Best practices for agile development', location: '', notes: 'Tech focused' },
          { prompt: 'Top CRM solutions for small businesses', location: 'US', notes: '' },
          { prompt: 'How to scale a SaaS business effectively?', location: 'Global', notes: '' },
        ],
      }
      setValidationResult(mockValidation)
      setIsReading(false)
    }, 1000)
  }

  // Go back to file list
  const handleBackToList = () => {
    setSelectedSpreadsheet(null)
    setValidationResult(null)
  }

  // Start import
  const handleStartImport = () => {
    if (!validationResult || validationResult.data.length === 0) return

    setIsImporting(true)
    // Simulate import
    setTimeout(() => {
      toast.success(`Successfully imported ${validationResult.data.length} prompts`)
      setIsImporting(false)
      onImportComplete()
      onClose()
    }, 1500)
  }

  // Download CSV template
  const handleDownloadTemplate = () => {
    const blob = new Blob([PROMPT_CSV_TEMPLATE], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'prompts-import-template.csv'
    a.click()
    URL.revokeObjectURL(url)
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

  // ============================================================
  // RENDER: No integration connected
  // ============================================================
  if (!integrationId) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
          <Image
            src="/icons/google-sheet.svg"
            alt="Google Sheets"
            width={32}
            height={32}
            className="opacity-50"
          />
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h3 className="font-medium">Connect Google Drive</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Connect your Google account to import prompts from Google Sheets.
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
  // RENDER: Validation results for selected spreadsheet
  // ============================================================
  if (selectedSpreadsheet) {
    return (
      <div className="flex flex-col gap-4">
        {/* Selected Spreadsheet Info */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <FileSpreadsheet className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-sm">{selectedSpreadsheet.name}</span>
              {selectedSpreadsheet.modifiedTime && (
                <span className="text-xs text-muted-foreground">
                  Modified {formatDate(selectedSpreadsheet.modifiedTime)}
                </span>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleBackToList} className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Change
          </Button>
        </div>

        {/* Loading State */}
        {isReading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Validating spreadsheet data...</span>
          </div>
        ) : validationResult ? (
          <>
            {/* Validation Summary */}
            <div className={cn(
              'flex items-center gap-4 p-4 rounded-xl',
              validationResult.valid
                ? 'bg-green-50 dark:bg-green-900/20'
                : 'bg-amber-50 dark:bg-amber-900/20'
            )}>
              {validationResult.valid ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
              )}
              <div className="flex flex-col gap-1">
                <span className={cn(
                  'font-medium text-sm',
                  validationResult.valid
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-amber-800 dark:text-amber-200'
                )}>
                  {validationResult.valid
                    ? `✓ Validation Passed - ${validationResult.validRows} prompts ready to import`
                    : `Validation Issues Found`}
                </span>
                <span className={cn(
                  'text-xs',
                  validationResult.valid
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-amber-700 dark:text-amber-300'
                )}>
                  {validationResult.totalRows} rows processed, {validationResult.validRows} valid
                  {validationResult.errors.length > 0 && `, ${validationResult.errors.length} errors`}
                </span>
              </div>
            </div>

            {/* Errors */}
            {validationResult.errors.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400">
                  <XCircle className="h-4 w-4" />
                  <span>Errors to Fix ({validationResult.errors.length})</span>
                </div>
                <div className="max-h-32 overflow-y-auto rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10 p-3">
                  <ul className="flex flex-col gap-1 text-sm">
                    {validationResult.errors.slice(0, 10).map((err, idx) => (
                      <li key={idx} className="text-red-600 dark:text-red-400">
                        <span className="font-medium">Row {err.row}:</span> {err.message}
                      </li>
                    ))}
                    {validationResult.errors.length > 10 && (
                      <li className="text-red-600 dark:text-red-400 font-medium">
                        ...and {validationResult.errors.length - 10} more errors
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* Preview Table */}
            {validationResult.data.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Preview (first 5 rows)</span>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Prompt</TableHead>
                        <TableHead className="w-[120px]">Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {validationResult.data.slice(0, 5).map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium max-w-[300px]">
                            <span className="line-clamp-2">{row.prompt}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {row.location || '—'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Import Button */}
            {validationResult.data.length > 0 && (
              <Button
                onClick={handleStartImport}
                disabled={isImporting || !validationResult.valid}
                className="rounded-full gap-2"
              >
                {isImporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Import {validationResult.data.length} Prompt
                {validationResult.data.length !== 1 ? 's' : ''}
              </Button>
            )}
          </>
        ) : null}
      </div>
    )
  }

  // ============================================================
  // RENDER: File browser with folder navigation
  // ============================================================
  return (
    <div className="flex flex-col gap-4">
      {/* Format Guidelines + Template */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200">
        <Info className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex flex-col gap-2 text-sm">
            <p className="font-medium">Spreadsheet Format Requirements</p>
            <ul className="space-y-1 text-blue-700 dark:text-blue-300">
              <li>• <strong>Required column:</strong> prompt</li>
              <li>• <strong>Optional columns:</strong> location, notes</li>
              <li>• <strong>Prompt:</strong> The query to track (3-500 characters)</li>
            </ul>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Note: Duplicate prompts will be skipped automatically.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadTemplate}
            className="gap-1.5 rounded-full bg-white/50 dark:bg-white/10 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-white/80 dark:hover:bg-white/20"
          >
            <Download className="h-3.5 w-3.5" />
            Download CSV Template
          </Button>
        </div>
      </div>

      {/* Search and Refresh */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search spreadsheets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-full"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={loadItems}
          disabled={isLoading}
          className="h-10 w-10 rounded-full shrink-0"
        >
          <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
        </Button>
      </div>

      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div className="flex items-center gap-1 px-1 text-sm overflow-x-auto">
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

      {/* File List */}
      <div className="flex flex-col rounded-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border">
          <div className="flex items-center gap-2">
            {currentFolderId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoBack}
                className="h-8 px-2 gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            <span className="text-sm font-medium">
              {items.filter(i => !i.isFolder).length} spreadsheet{items.filter(i => !i.isFolder).length !== 1 ? 's' : ''}
              {items.filter(i => i.isFolder).length > 0 && `, ${items.filter(i => i.isFolder).length} folder${items.filter(i => i.isFolder).length !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>

        {/* List */}
        <div className="max-h-[300px] overflow-y-auto divide-y divide-border">
          {isLoading && items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Loading files...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <FileSpreadsheet className="h-8 w-8 text-muted-foreground/50" />
              <span className="text-sm text-muted-foreground">
                {searchQuery ? 'No files match your search' : 'No files found in this folder'}
              </span>
            </div>
          ) : (
            items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => item.isFolder ? handleFolderClick(item.id) : handleSelectSpreadsheet(item)}
                className="flex items-center gap-3 w-full px-4 py-3 text-left transition-colors hover:bg-muted/50"
              >
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg shrink-0',
                  item.isFolder
                    ? 'bg-amber-100 dark:bg-amber-900/30'
                    : 'bg-green-100 dark:bg-green-900/30'
                )}>
                  {item.isFolder ? (
                    <Folder className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  ) : item.iconLink ? (
                    <Image
                      src={item.iconLink}
                      alt=""
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  ) : (
                    <FileSpreadsheet className="h-5 w-5 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <span className="font-medium text-sm truncate">{item.name}</span>
                  {!item.isFolder && item.modifiedTime && (
                    <span className="text-xs text-muted-foreground">
                      Modified {formatDate(item.modifiedTime)}
                    </span>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            ))
          )}
        </div>
      </div>

      {/* Note */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200">
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
        <p className="text-xs">
          Your spreadsheet will be validated before import. Make sure the first row contains column headers: prompt (required), location (optional), notes (optional).
        </p>
      </div>
    </div>
  )
}
