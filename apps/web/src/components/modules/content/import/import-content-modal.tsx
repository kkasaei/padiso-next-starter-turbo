'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { FileSpreadsheet } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import { toast } from 'sonner'

import { GoogleDriveTab } from './google-drive-tab'
import { CsvImportTab } from './csv-import-tab'
import { ImportProgress } from './import-progress'
import type { ImportJob } from '@/lib/shcmea/types/content-import'

type ImportTab = 'google_drive' | 'csv'
type ModalView = 'select' | 'progress'

interface ImportContentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  googleIntegrationId?: string | null
  onConnectGoogle: () => void
  onImportComplete?: () => void
  defaultTab?: ImportTab
}

export function ImportContentModal({
  open,
  onOpenChange,
  googleIntegrationId,
  onConnectGoogle,
  onImportComplete,
  defaultTab = 'google_drive',
}: ImportContentModalProps) {
  const params = useParams()
  const projectId = params.projectId as string

  const [activeTab, setActiveTab] = useState<ImportTab>(defaultTab)
  const [view, setView] = useState<ModalView>('select')
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)
  const [currentJob, setCurrentJob] = useState<ImportJob | null>(null)

  // Mock fetch job
  const fetchJob = useCallback((_params: { jobId: string }) => {
    // TODO: Implement fetch job action
    // Simulate job progress
    setCurrentJob((prev) => {
      if (!prev) {
        return {
          id: _params.jobId,
          status: 'processing' as const,
          progress: { total: 10, processed: 0, succeeded: 0, failed: 0 },
          errors: [],
          createdAt: new Date().toISOString(),
        }
      }
      const newProcessed = Math.min(prev.progress.processed + 2, prev.progress.total)
      return {
        ...prev,
        status: newProcessed >= prev.progress.total ? 'completed' as const : 'processing' as const,
        progress: {
          ...prev.progress,
          processed: newProcessed,
          succeeded: newProcessed,
        },
      }
    })
  }, [])

  // Mock cancel job
  const cancelJob = useCallback((_params: { jobId: string }) => {
    // TODO: Implement cancel job action
    toast.success('Import cancelled')
    setCurrentJob((prev) => prev ? { ...prev, status: 'cancelled' as const } : null)
  }, [])

  // Handle import started
  const handleImportStarted = useCallback((jobId: string) => {
    setCurrentJobId(jobId)
    setView('progress')
  }, [])

  // Refresh job status
  const refreshJob = useCallback(() => {
    if (currentJobId) {
      fetchJob({ jobId: currentJobId })
    }
  }, [currentJobId, fetchJob])

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (currentJobId) {
      cancelJob({ jobId: currentJobId })
    }
  }, [currentJobId, cancelJob])

  // Handle close/done
  const handleClose = useCallback(() => {
    // If job completed successfully, trigger refresh
    if (currentJob?.status === 'completed' && currentJob.progress.succeeded > 0) {
      onImportComplete?.()
    }

    // Reset state
    setView('select')
    setCurrentJobId(null)
    setCurrentJob(null)
    onOpenChange(false)
  }, [currentJob, onImportComplete, onOpenChange])

  // Load job when modal opens with existing job
  useEffect(() => {
    if (open && currentJobId) {
      refreshJob()
    }
  }, [open, currentJobId, refreshJob])

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      // Delay reset to avoid UI flash
      const timer = setTimeout(() => {
        if (!open) {
          setView('select')
          setCurrentJobId(null)
          setCurrentJob(null)
        }
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [open])

  // Update active tab when defaultTab changes (when modal opens)
  useEffect(() => {
    if (open) {
      setActiveTab(defaultTab)
    }
  }, [open, defaultTab])

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>
              {view === 'select' ? 'Import Content' : 'Importing Content'}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-2">
          {view === 'select' ? (
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as ImportTab)}
              className="w-full"
            >
              <TabsList className="w-full grid grid-cols-2 h-12 p-1 mb-4">
                <TabsTrigger
                  value="google_drive"
                  className="flex items-center gap-2 h-10 rounded-lg"
                >
                  <Image
                    src="/icons/google-drive.svg"
                    alt="Google Drive"
                    width={18}
                    height={18}
                  />
                  Google Drive
                </TabsTrigger>
                <TabsTrigger
                  value="csv"
                  className="flex items-center gap-2 h-10 rounded-lg"
                >
                  <FileSpreadsheet className="h-[18px] w-[18px]" />
                  CSV File
                </TabsTrigger>
              </TabsList>

              <TabsContent value="google_drive" className="mt-0">
                <GoogleDriveTab
                  projectId={projectId}
                  integrationId={googleIntegrationId || null}
                  onImportStarted={handleImportStarted}
                  onConnectIntegration={onConnectGoogle}
                />
              </TabsContent>

              <TabsContent value="csv" className="mt-0">
                <CsvImportTab
                  projectId={projectId}
                  onImportStarted={handleImportStarted}
                />
              </TabsContent>
            </Tabs>
          ) : currentJob ? (
            <ImportProgress
              job={currentJob}
              onRefresh={refreshJob}
              onCancel={
                currentJob.status === 'pending' || currentJob.status === 'processing'
                  ? handleCancel
                  : undefined
              }
              onClose={handleClose}
            />
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

