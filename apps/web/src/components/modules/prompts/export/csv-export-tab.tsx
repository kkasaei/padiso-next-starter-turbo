'use client'

import { useState } from 'react'
import { Download, FileSpreadsheet, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import type { TrackedPrompt } from '../types'
import { PROMPT_EXPORT_CSV_HEADERS } from '@/types/prompt-export'

interface CsvExportTabProps {
  prompts: TrackedPrompt[]
  onExportComplete: () => void
}

export function CsvExportTab({ prompts, onExportComplete }: CsvExportTabProps) {
  const [fileName, setFileName] = useState(`prompts-export-${new Date().toISOString().split('T')[0]}`)
  const [isExported, setIsExported] = useState(false)

  // Generate CSV content
  const generateCsvContent = (): string => {
    const headerRow = PROMPT_EXPORT_CSV_HEADERS.join(',')

    const dataRows = prompts.map((p) => {
      const values = [
        escapeCSVValue(p.prompt),
        escapeCSVValue(p.targetLocation || ''),
        escapeCSVValue(p.notes || ''),
        p.isActive ? 'Active' : 'Paused',
        p.lastVisibilityScore !== null ? `${p.lastVisibilityScore}%` : '',
        p.lastScanDate ? new Date(p.lastScanDate).toISOString() : '',
        new Date(p.createdAt).toISOString(),
      ]
      return values.join(',')
    })

    return [headerRow, ...dataRows].join('\n')
  }

  // Escape CSV value (handle commas, quotes, newlines)
  const escapeCSVValue = (value: string): string => {
    if (!value) return ''

    // If value contains comma, quote, or newline, wrap in quotes
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      // Escape any existing quotes by doubling them
      return `"${value.replace(/"/g, '""')}"`
    }

    return value
  }

  // Handle export
  const handleExport = () => {
    try {
      const csvContent = generateCsvContent()
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `${fileName}.csv`
      link.click()

      URL.revokeObjectURL(url)

      setIsExported(true)
      toast.success(`Exported ${prompts.length} prompts to CSV`)

      // Close modal after a short delay
      setTimeout(() => {
        onExportComplete()
      }, 1000)
    } catch (error) {
      toast.error('Failed to export CSV')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* File Name Input */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="csv-filename">File Name</Label>
        <div className="flex items-center gap-2">
          <Input
            id="csv-filename"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter file name"
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground">.csv</span>
        </div>
      </div>

      {/* Preview */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
          <FileSpreadsheet className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-sm">{fileName}.csv</span>
          <span className="text-xs text-muted-foreground">
            {prompts.length} row{prompts.length !== 1 ? 's' : ''} • {PROMPT_EXPORT_CSV_HEADERS.length} columns
          </span>
        </div>
      </div>

      {/* Columns Info */}
      <div className="text-xs text-muted-foreground">
        <span className="font-medium">Columns:</span>{' '}
        {PROMPT_EXPORT_CSV_HEADERS.map((h) => {
          // Convert camelCase to Title Case
          return h.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
        }).join(', ')}
      </div>

      {/* Export Button */}
      <Button
        onClick={handleExport}
        disabled={!fileName.trim() || isExported}
        className="rounded-full gap-2"
      >
        {isExported ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Exported!
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Download CSV
          </>
        )}
      </Button>
    </div>
  )
}
