'use client'

import { Badge } from '@workspace/ui/components/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip'
import {
  FileText,
  HelpCircle,
} from 'lucide-react'
import type { 
  ContextFilesState,
} from '@workspace/common/lib/shcmea/types/context-files'
import { 
  DEFAULT_CONTEXT_FILES_STATE,
} from '@workspace/common/lib/shcmea/types/context-files'

// ============================================================
// TYPES
// ============================================================

interface ContextFilesSectionProps {
  projectId?: string // Optional - only exists on edit page
  contextFiles?: ContextFilesState
  onUpdateContextFiles: (files: ContextFilesState) => void
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function ContextFilesSection({
  projectId,
  contextFiles,
  onUpdateContextFiles,
}: ContextFilesSectionProps) {
  // Initialize state (kept for compatibility, but not used in Coming Soon state)
  const files = contextFiles || DEFAULT_CONTEXT_FILES_STATE

  return (
    <div className="flex w-full flex-col gap-y-8">
      {/* Upload Card */}
      <div className="dark:border-polar-700 flex flex-col rounded-4xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-polar-700 bg-gray-50 dark:bg-polar-800/50">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Context Documents
            </h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="text-gray-400 hover:text-gray-600">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="max-w-sm border border-gray-700 bg-gray-900 p-4 text-white dark:border-gray-300 dark:bg-gray-100 dark:text-gray-900"
                >
                  <div className="space-y-2">
                    <p className="text-sm font-medium">RAG-Powered Context</p>
                    <p className="text-xs leading-relaxed text-gray-100 dark:text-gray-800">
                      Upload documents to give AI deeper context about your business:
                    </p>
                    <ul className="list-disc space-y-1 pl-4 text-xs text-gray-100 dark:text-gray-800">
                      <li>Brand guidelines and voice documentation</li>
                      <li>Product specifications and feature docs</li>
                      <li>Competitor analysis reports</li>
                      <li>Marketing strategy documents</li>
                    </ul>
                    <p className="text-xs text-gray-300 dark:text-gray-600 mt-2">
                      Documents are chunked and indexed in a vector database for intelligent retrieval.
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Upload documents to provide additional context for AI analysis
          </p>
        </div>

        {/* Coming Soon Placeholder */}
        <div className="w-full flex flex-col items-center justify-center gap-y-6 p-8 py-24 md:py-48">
          <div className="text-gray-300 dark:text-gray-600">
            <FileText className="h-16 w-16" />
          </div>
          <div className="flex flex-col items-center gap-y-6">
            <div className="flex flex-col items-center gap-y-2">
              <h3 className="text-lg font-medium">Context Documents</h3>
              <p className="dark:text-polar-500 text-gray-500 text-center max-w-md">
                Upload documents to provide additional context for AI analysis. This feature will be available soon.
              </p>
            </div>
            <Badge variant="outline" className="rounded-lg">Coming Soon</Badge>
          </div>
        </div>

      </div>
    </div>
  )
}
