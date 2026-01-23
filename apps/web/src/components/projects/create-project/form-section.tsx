'use client'

import { Button } from '@workspace/ui/components/button'
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip'
import { HelpCircle } from 'lucide-react'

interface FormSectionProps {
  title: string
  description: string
  children: React.ReactNode
  helpContent?: React.ReactNode
  action?: React.ReactNode
}

export function FormSection({
  title,
  description,
  children,
  helpContent,
  action,
}: FormSectionProps) {
  return (
    <div className="relative flex flex-col gap-12 p-12">
      <div className="flex w-full flex-col gap-y-6">
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium">{title}</h2>
              {helpContent && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-5 w-5 p-0 hover:bg-transparent"
                        type="button"
                      >
                        <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
                      </Button>
                    </TooltipTrigger>
                    {helpContent}
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {action && <div className="flex items-center">{action}</div>}
          </div>
          <p className="dark:text-polar-500 leading-snug text-gray-500">
            {description}
          </p>
        </div>
      </div>
      {children}
    </div>
  )
}

