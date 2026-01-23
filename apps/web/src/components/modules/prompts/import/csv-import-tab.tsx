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
  Info,
} from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
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
  PromptImportRow,
  PromptValidationResult,
  PromptValidationError,
} from '@/lib/shcmea/types/prompt-import'
import {
  PROMPT_CSV_TEMPLATE,
  REQUIRED_PROMPT_COLUMNS,
} from '@/lib/shcmea/types/prompt-import'

interface CsvImportTabProps {
  projectId: string
  onImportComplete: () => void
  onClose: () => void
}

export function CsvImportTab({ projectId, onImportComplete, onClose }: CsvImportTabProps) {
  const [file, setFile] = useState<File | null>(null)
  const [validationResult, setValidationResult] = useState<PromptValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  // Parse CSV content
  const parseCSV = useCallback((content: string): PromptValidationResult => {
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
    const headers = lines[0]?.split(',').map((h) => h.trim().toLowerCase()) ?? []

    // Check for required columns
    const missingColumns = REQUIRED_PROMPT_COLUMNS.filter((col) => !headers.includes(col))
    if (missingColumns.length > 0) {
      return {
        valid: false,
        totalRows: lines.length - 1,
        validRows: 0,
        errors: [{
          row: 0,
          field: 'header',
          message: `Missing required columns: ${missingColumns.join(', ')}`,
        }],
        data: [],
      }
    }

    // Find column indices
    const promptIndex = headers.indexOf('prompt')
    const locationIndex = headers.indexOf('location')
    const notesIndex = headers.indexOf('notes')

    const errors: PromptValidationError[] = []
    const data: PromptImportRow[] = []

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      const values = parseCSVLine(line ?? '')
      const rowNumber = i + 1

      const prompt = values[promptIndex]?.trim()
      const location = locationIndex >= 0 ? values[locationIndex]?.trim() : undefined
      const notes = notesIndex >= 0 ? values[notesIndex]?.trim() : undefined

      // Validate prompt
      if (!prompt) {
        errors.push({ row: rowNumber, field: 'prompt', message: 'Prompt is required' })
        continue
      }
      if (prompt.length < 3) {
        errors.push({ row: rowNumber, field: 'prompt', message: 'Prompt must be at least 3 characters' })
        continue
      }
      if (prompt.length > 500) {
        errors.push({ row: rowNumber, field: 'prompt', message: 'Prompt must be less than 500 characters' })
        continue
      }

      // Validate location length if provided
      if (location && location.length > 100) {
        errors.push({ row: rowNumber, field: 'location', message: 'Location must be less than 100 characters' })
        continue
      }

      // Validate notes length if provided
      if (notes && notes.length > 1000) {
        errors.push({ row: rowNumber, field: 'notes', message: 'Notes must be less than 1000 characters' })
        continue
      }

      data.push({
        prompt,
        location: location || undefined,
        notes: notes || undefined,
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
    } catch {
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
      } catch {
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
  }

  // Download template
  const handleDownloadTemplate = () => {
    const blob = new Blob([PROMPT_CSV_TEMPLATE], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'prompts-import-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Format Guidelines + Template */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200">
        <Info className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-3 flex-1">
            <div className="flex flex-col gap-2 text-sm">
              <p className="font-medium">CSV Format Requirements</p>
              <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                <li>• <strong>Required column:</strong> prompt</li>
                <li>• <strong>Optional columns:</strong> location, notes</li>
                <li>• <strong>Prompt:</strong> The query to track (3-500 characters)</li>
                <li>• <strong>Location:</strong> Target geographic location (optional)</li>
              </ul>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Note: Duplicate prompts will be skipped automatically.
              </p>
            </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadTemplate}
            className="w-fit gap-1.5 rounded-full bg-white/50 dark:bg-white/10 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-white/80 dark:hover:bg-white/20"
          >
            <Download className="h-3.5 w-3.5" />
            Download Template
          </Button>
        </div>
      </div>

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
                  <div className="rounded-lg border border-border overflow-hidden overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Prompt</TableHead>
                          <TableHead className="w-[120px]">Location</TableHead>
                          <TableHead className="w-[150px]">Notes</TableHead>
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
                            <TableCell className="max-w-[150px]">
                              <span className="text-xs text-muted-foreground line-clamp-2">
                                {row.notes || '—'}
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
                  disabled={!validationResult.valid}
                  className="rounded-full gap-2"
                >
                    <Upload className="h-4 w-4" />
                  Import {validationResult.data.length} Prompt
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
