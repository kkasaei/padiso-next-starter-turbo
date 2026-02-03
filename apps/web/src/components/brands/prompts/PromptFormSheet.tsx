'use client'

import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Textarea } from '@workspace/ui/components/textarea'
import {
  Sheet,
  SheetContent,
} from '@workspace/ui/components/sheet'
import { Loader2 } from 'lucide-react'
import { LabelWithHelp } from './LabelWithHelp'
import { FIELD_HELP } from './constants'
import type { TrackedPrompt, PromptFormData } from './types'

interface PromptFormSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  editingPrompt: TrackedPrompt | null
  formData: PromptFormData
  onFormChange: (data: Partial<PromptFormData>) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  isSaving: boolean
}

export function PromptFormSheet({
  isOpen,
  onOpenChange,
  editingPrompt,
  formData,
  onFormChange,
  onSubmit,
  onCancel,
  isSaving,
}: PromptFormSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onCancel() }}>
      <SheetContent className="w-full sm:max-w-[540px] p-0">
        <div className="flex flex-col gap-y-6 px-8 py-10">
          <div>
            <h2 className="text-lg font-medium">
              {editingPrompt ? 'Edit Prompt' : 'Create Prompt'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Enter a query that users might ask AI assistants
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-y-6">
            <div className="space-y-2">
              <LabelWithHelp htmlFor="prompt-text" helpText={FIELD_HELP.prompt}>
                Prompt *
              </LabelWithHelp>
              <Textarea
                id="prompt-text"
                value={formData.promptText}
                onChange={(e) => onFormChange({ promptText: e.target.value })}
                placeholder="e.g., best activation platform for SaaS companies"
                rows={4}
                required
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <LabelWithHelp htmlFor="location" helpText={FIELD_HELP.location}>
                Target Location
              </LabelWithHelp>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => onFormChange({ location: e.target.value })}
                placeholder="e.g., Sydney, Australia"
              />
            </div>

            <div className="space-y-2">
              <LabelWithHelp htmlFor="notes" helpText={FIELD_HELP.notes}>
                Notes
              </LabelWithHelp>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => onFormChange({ notes: e.target.value })}
                placeholder="Why are you tracking this prompt?"
                rows={2}
                className="resize-none"
              />
            </div>

            <div className="flex flex-row items-center gap-x-4">
              <Button type="submit" disabled={isSaving} className="rounded-full px-6">
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingPrompt ? 'Update' : 'Create'}
              </Button>
              <Button type="button" variant="ghost" onClick={onCancel} className="rounded-full">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}

