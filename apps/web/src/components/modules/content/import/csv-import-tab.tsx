'use client'

import { useState, useCallback } from 'react'
import {
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Trash2,
  Download,
  Loader2,
} from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

import type {
  CsvImportRow,
  CsvValidationResult,
  ContentStatusForImport,
} from '@/lib/shcmea/types/content-import'

// Content status config
const CONTENT_STATUS_CONFIG: Record<string, { label: string }> = {
  DRAFT: { label: 'Draft' },
  IDEA: { label: 'Idea' },
  IN_PROGRESS: { label: 'In Progress' },
  REVIEW: { label: 'Review' },
  PUBLISHED: { label: 'Published' },
  ARCHIVED: { label: 'Archived' },
}

type ContentStatus = keyof typeof CONTENT_STATUS_CONFIG

interface CsvImportTabProps {
  projectId: string
  onImportStarted: (jobId: string) => void
}

export function CsvImportTab({ projectId, onImportStarted }: CsvImportTabProps) {
  const [file, setFile] = useState<File | null>(null)
  const [validationResult, setValidationResult] = useState<CsvValidationResult | null>(null)
  const [defaultStatus, setDefaultStatus] = useState<ContentStatusForImport>('DRAFT')
  const [isValidating, setIsValidating] = useState(false)
  const [importStatus, setImportStatus] = useState<'idle' | 'executing'>('idle')

  // Mock import function
  const startImport = useCallback((_params: { projectId: string; rows: CsvImportRow[]; defaultStatus: ContentStatusForImport }) => {
    setImportStatus('executing')
    // TODO: Implement import action
    setTimeout(() => {
      const mockJobId = `job-${Date.now()}`
      toast.success('Import started successfully')
      onImportStarted(mockJobId)
      setImportStatus('idle')
    }, 1000)
  }, [onImportStarted])

  // Parse CSV content
  const parseCSV = useCallback((content: string): CsvValidationResult => {
    const lines = content.split(/\r?\n/).filter((line) => line.trim())
    if (lines.length === 0) {
      return {
        valid: false,
        totalRows: 0,
        validRows: 0,
        errors: [{ row: 0, field: 'file', message: 'CSV file is empty' }],
        data: [],
      }
    }

    // Parse header row
    const headers = lines[0]!.split(',').map((h) => h.trim().toLowerCase())
    const titleIndex = headers.findIndex((h) => h === 'title')
    const contentIndex = headers.findIndex((h) => h === 'content')
    const statusIndex = headers.findIndex((h) => h === 'status')

    if (titleIndex === -1) {
      return {
        valid: false,
        totalRows: lines.length - 1,
        validRows: 0,
        errors: [{ row: 0, field: 'header', message: 'Missing required "title" column' }],
        data: [],
      }
    }

    const errors: CsvValidationResult['errors'] = []
    const data: CsvImportRow[] = []

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]!
      const values = parseCSVLine(line)

      const title = values[titleIndex]?.trim()
      const content = contentIndex >= 0 ? values[contentIndex]?.trim() : undefined
      const status = statusIndex >= 0 ? values[statusIndex]?.trim().toUpperCase() : undefined

      // Validate title
      if (!title) {
        errors.push({ row: i + 1, field: 'title', message: 'Title is required' })
        continue
      }

      if (title.length > 500) {
        errors.push({
          row: i + 1,
          field: 'title',
          message: 'Title must be under 500 characters',
        })
        continue
      }

      // Validate status if provided
      if (status && !Object.keys(CONTENT_STATUS_CONFIG).includes(status)) {
        errors.push({
          row: i + 1,
          field: 'status',
          message: `Invalid status "${status}". Valid statuses: ${Object.keys(CONTENT_STATUS_CONFIG).join(', ')}`,
        })
        continue
      }

      data.push({
        title,
        content,
        status: status as ContentStatusForImport | undefined,
      })
    }

    return {
      valid: errors.length === 0 && data.length > 0,
      totalRows: lines.length - 1,
      validRows: data.length,
      errors,
      data,
    }
  }, [])

  // Parse a single CSV line (handling quoted values)
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }
    result.push(current)

    return result
  }

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Please select a CSV file')
      return
    }

    setFile(selectedFile)
    setIsValidating(true)

    try {
      const content = await selectedFile.text()
      const result = parseCSV(content)
      setValidationResult(result)
    } catch (error) {
      toast.error('Failed to read file')
      setValidationResult(null)
    } finally {
      setIsValidating(false)
    }
  }

  // Handle drag and drop
  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()

      const droppedFile = e.dataTransfer.files[0]
      if (!droppedFile) return

      if (!droppedFile.name.endsWith('.csv')) {
        toast.error('Please drop a CSV file')
        return
      }

      setFile(droppedFile)
      setIsValidating(true)

      try {
        const content = await droppedFile.text()
        const result = parseCSV(content)
        setValidationResult(result)
      } catch (error) {
        toast.error('Failed to read file')
        setValidationResult(null)
      } finally {
        setIsValidating(false)
      }
    },
    [parseCSV]
  )

  // Clear file
  const handleClear = () => {
    setFile(null)
    setValidationResult(null)
  }

  // Start import
  const handleStartImport = () => {
    if (!validationResult || validationResult.data.length === 0) return

    startImport({
      projectId,
      rows: validationResult.data,
      defaultStatus,
    })
  }

  // Download template
  const handleDownloadTemplate = () => {
    const template = `title,content,status
"My First Blog Post","This is the content of my blog post. You can use multiple lines by wrapping in quotes.",DRAFT
"How-To Guide","Step-by-step instructions for doing something.",IDEA
"Case Study: Company X","A detailed case study about Company X's success.",DRAFT`

    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'content-import-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* File Upload Area */}
      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={cn(
            'flex flex-col items-center justify-center gap-4 p-8',
            'border-2 border-dashed border-border rounded-xl',
            'transition-colors hover:border-primary/50 hover:bg-muted/30'
          )}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="font-medium">Drop your CSV file here</p>
            <p className="text-sm text-muted-foreground">or click to browse</p>
          </div>
          <label className="cursor-pointer">
            <Button variant="outline" className="rounded-full gap-2" asChild>
              <span>
                <Upload className="h-4 w-4" />
                Select CSV File
              </span>
            </Button>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownloadTemplate}
            className="text-xs text-muted-foreground gap-1"
          >
            <Download className="h-3 w-3" />
            Download template
          </Button>
        </div>
      ) : (
        <>
          {/* File Info */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <FileSpreadsheet className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-sm">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Validation Result */}
          {isValidating ? (
            <div className="flex items-center justify-center py-8 gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Validating file...</span>
            </div>
          ) : validationResult ? (
            <>
              {/* Stats */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm">
                    <strong>{validationResult.validRows}</strong> valid rows
                  </span>
                </div>
                {validationResult.errors.length > 0 && (
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <span className="text-sm">
                      <strong>{validationResult.errors.length}</strong> errors
                    </span>
                  </div>
                )}
              </div>

              {/* Errors */}
              {validationResult.errors.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <span>Validation Errors</span>
                  </div>
                  <div className="max-h-32 overflow-y-auto rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10 p-3">
                    <ul className="flex flex-col gap-1 text-sm">
                      {validationResult.errors.slice(0, 10).map((err, idx) => (
                        <li key={idx} className="text-red-600 dark:text-red-400">
                          Row {err.row}: {err.message}
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
                          <TableHead className="w-[200px]">Title</TableHead>
                          <TableHead>Content</TableHead>
                          <TableHead className="w-[100px]">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {validationResult.data.slice(0, 5).map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium truncate max-w-[200px]">
                              {row.title}
                            </TableCell>
                            <TableCell className="truncate max-w-[200px]">
                              {row.content || <span className="text-muted-foreground">-</span>}
                            </TableCell>
                            <TableCell>
                              {row.status || (
                                <span className="text-muted-foreground">{defaultStatus}</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Default Settings */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  Default status for rows without status:
                </span>
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
                        {CONTENT_STATUS_CONFIG[status]!.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Import Button */}
              {validationResult.valid && validationResult.data.length > 0 && (
                <Button
                  onClick={handleStartImport}
                  disabled={importStatus === 'executing'}
                  className="rounded-full gap-2"
                >
                  {importStatus === 'executing' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Import {validationResult.data.length} Item
                  {validationResult.data.length !== 1 ? 's' : ''}
                </Button>
              )}
            </>
          ) : null}
        </>
      )}
    </div>
  )
}

