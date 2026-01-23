'use client'

import { Label } from '@workspace/ui/components/label'
import { HelpCircle } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip'

interface LabelWithHelpProps {
  htmlFor: string
  children: React.ReactNode
  helpText: string
}

export function LabelWithHelp({ htmlFor, children, helpText }: LabelWithHelpProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Label htmlFor={htmlFor}>{children}</Label>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
              <HelpCircle className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-[280px] text-sm whitespace-pre-line">
            {helpText}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

