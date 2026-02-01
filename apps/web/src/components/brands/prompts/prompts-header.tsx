'use client'

import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Plus, Search, Sparkles, Loader2, Play } from 'lucide-react'

interface PromptsHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onSuggestionsClick: () => void
  onRunScan: () => void
  onNewPromptClick: () => void
  isScanning: boolean
  hasActivePrompts: boolean
}

export function PromptsHeader({
  searchQuery,
  onSearchChange,
  onSuggestionsClick,
  onRunScan,
  onNewPromptClick,
  isScanning,
  hasActivePrompts,
}: PromptsHeaderProps) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div className="relative flex flex-1 flex-row rounded-full">
        <Input
          type="text"
          placeholder="Search Prompts"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-full md:max-w-64"
        />
        <div className="dark:text-polar-400 pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3 text-gray-500">
          <Search className="h-4 w-4" />
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <Button
          variant="outline"
          className="whitespace-nowrap"
          onClick={onSuggestionsClick}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          <span>Suggestions</span>
        </Button>
        <Button
          variant="outline"
          className="whitespace-nowrap"
          onClick={onRunScan}
          disabled={isScanning || !hasActivePrompts}
        >
          {isScanning ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Play className="h-4 w-4 mr-2" />
          )}
          <span>{isScanning ? 'Scanning...' : 'Run Scan'}</span>
        </Button>
        <Button className="whitespace-nowrap" onClick={onNewPromptClick}>
          <Plus className="h-4 w-4 mr-2" />
          <span>New Prompt</span>
        </Button>
      </div>
    </div>
  )
}

