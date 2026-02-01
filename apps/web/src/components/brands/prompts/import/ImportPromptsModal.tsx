'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FileSpreadsheet } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'

import { GoogleSpreadsheetTab } from './GoogleSpreadsheetTab'
import { CsvImportTab } from './CsvImportTab'

type ImportTab = 'google_spreadsheet' | 'csv'

interface ImportPromptsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  googleIntegrationId?: string | null
  onConnectGoogle: () => void
  onImportComplete?: () => void
  defaultTab?: ImportTab
}

export function ImportPromptsModal({
  open,
  onOpenChange,
  projectId,
  googleIntegrationId,
  onConnectGoogle,
  onImportComplete,
  defaultTab = 'csv',
}: ImportPromptsModalProps) {
  const [activeTab, setActiveTab] = useState<ImportTab>(defaultTab)

  // Handle close
  const handleClose = () => {
    onOpenChange(false)
  }

  // Handle import complete
  const handleImportComplete = () => {
    onImportComplete?.()
  }

  // Update active tab when defaultTab changes (when modal opens)
  useEffect(() => {
    if (open) {
      setActiveTab(defaultTab)
    }
  }, [open, defaultTab])

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>Import Prompts</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-2">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as ImportTab)}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-2 h-12 p-1 mb-4">
              <TabsTrigger
                value="csv"
                className="flex items-center gap-2 h-10 rounded-lg"
              >
                <FileSpreadsheet className="h-[18px] w-[18px]" />
                CSV File
              </TabsTrigger>
              <TabsTrigger
                value="google_spreadsheet"
                className="flex items-center gap-2 h-10 rounded-lg"
              >
                <Image
                  src="/icons/google-sheet.svg"
                  alt="Google Sheets"
                  width={18}
                  height={18}
                />
                Google Sheets
              </TabsTrigger>
            </TabsList>

            <TabsContent value="csv" className="mt-0">
              <CsvImportTab
                projectId={projectId}
                onImportComplete={handleImportComplete}
                onClose={handleClose}
              />
            </TabsContent>

            <TabsContent value="google_spreadsheet" className="mt-0">
              <GoogleSpreadsheetTab
                projectId={projectId}
                integrationId={googleIntegrationId || null}
                onImportComplete={handleImportComplete}
                onClose={handleClose}
                onConnectIntegration={onConnectGoogle}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
