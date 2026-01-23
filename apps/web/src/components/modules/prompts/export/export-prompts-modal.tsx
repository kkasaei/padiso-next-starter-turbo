'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Download } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CsvExportTab } from './csv-export-tab'
import { GoogleSheetsExportTab } from './google-sheets-export-tab'
import type { TrackedPrompt } from '../types'

interface ExportPromptsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  prompts: TrackedPrompt[]
  selectedIds: Set<string>
  googleIntegrationId: string | null
  onConnectGoogle: () => void
}

export function ExportPromptsModal({
  open,
  onOpenChange,
  projectId,
  prompts,
  selectedIds,
  googleIntegrationId,
  onConnectGoogle,
}: ExportPromptsModalProps) {
  const [activeTab, setActiveTab] = useState<'csv' | 'google-sheets'>('csv')

  // Get selected prompts or all if none selected
  const promptsToExport = selectedIds.size > 0
    ? prompts.filter((p) => selectedIds.has(p.id))
    : prompts

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Export Prompts</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Export {promptsToExport.length} prompt{promptsToExport.length !== 1 ? 's' : ''}
          {selectedIds.size > 0 ? ' (selected)' : ' (all)'}
        </p>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'csv' | 'google-sheets')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="csv" className="gap-2">
              <Download className="h-4 w-4" />
              CSV File
            </TabsTrigger>
            <TabsTrigger value="google-sheets" className="gap-2">
              <div className="relative h-4 w-4">
                <Image
                  src="/icons/google-sheet.svg"
                  alt="Google Sheets"
                  fill
                  className="object-contain"
                />
              </div>
              Google Sheets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="csv" className="mt-4">
            <CsvExportTab
              prompts={promptsToExport}
              onExportComplete={handleClose}
            />
          </TabsContent>

          <TabsContent value="google-sheets" className="mt-4">
            <GoogleSheetsExportTab
              projectId={projectId}
              prompts={promptsToExport}
              integrationId={googleIntegrationId}
              onConnectIntegration={onConnectGoogle}
              onExportComplete={handleClose}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
