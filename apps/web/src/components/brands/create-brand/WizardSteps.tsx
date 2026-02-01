'use client'

import { Check, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================
// TYPES
// ============================================================
export type WizardStepStatus = 'pending' | 'in_progress' | 'completed' | 'error' | 'skipped'

export interface WizardStep {
  id: string
  title: string
  description?: string
  status: WizardStepStatus
}

interface WizardStepsProps {
  steps: WizardStep[]
  currentStepIndex: number
}

// ============================================================
// WIZARD STEPS COMPONENT - Clean ANTD Style
// ============================================================
export function WizardSteps({ steps, currentStepIndex }: WizardStepsProps) {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex
        const isCompleted = step.status === 'completed'
        const isInProgress = step.status === 'in_progress'
        const isError = step.status === 'error'
        const isSkipped = step.status === 'skipped'
        const isPending = step.status === 'pending'

        return (
          <div key={step.id} className="relative flex items-start">
            {/* Left: Step Circle */}
            <div className="relative z-10 flex-shrink-0 flex flex-col items-center">
              {/* Connector Line - Perfectly centered */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'absolute left-1/2 top-8 h-full w-[1px] -translate-x-1/2',
                    isCompleted
                      ? 'bg-blue-300 dark:bg-blue-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  )}
                  style={{ height: 'calc(100% + 0.5rem)' }}
                />
              )}

              {/* Step Circle - Clean ANTD style */}
              <span
                className={cn(
                  'relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300',
                  'font-medium',
                  isCompleted && [
                    'bg-blue-400 dark:bg-blue-500',
                    'text-white'
                  ],
                  isInProgress && [
                    'border-2 border-blue-500 dark:border-blue-400',
                    'bg-white dark:bg-polar-900',
                    'text-blue-500 dark:text-blue-400'
                  ],
                  isError && [
                    'border-2 border-red-500 dark:border-red-400',
                    'bg-white dark:bg-polar-900',
                    'text-red-500 dark:text-red-400'
                  ],
                  isSkipped && [
                    'border-2 border-yellow-500 dark:border-yellow-400',
                    'bg-white dark:bg-polar-900',
                    'text-yellow-500 dark:text-yellow-400'
                  ],
                  isPending && [
                    'border-2 border-gray-300 dark:border-gray-600',
                    'bg-white dark:bg-polar-900',
                    'text-gray-400 dark:text-gray-500'
                  ]
                )}
              >
                {isCompleted ? (
                  <Check
                    className="h-4 w-4 text-white"
                    aria-hidden="true"
                    strokeWidth={3}
                  />
                ) : isInProgress ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isError ? (
                  <X className="h-4 w-4" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-current" />
                )}
              </span>
            </div>

            {/* Right: Step Content */}
            <div className="ml-4 flex-1 min-w-0 pb-6">
              <div
                className={cn(
                  'text-sm font-medium transition-colors duration-300',
                  isCompleted && 'text-gray-500 dark:text-gray-400',
                  isInProgress && 'text-blue-500 dark:text-blue-400',
                  isError && 'text-red-500 dark:text-red-400',
                  isSkipped && 'text-yellow-500 dark:text-yellow-400',
                  isPending && 'text-gray-400 dark:text-gray-500'
                )}
              >
                {step.title}
              </div>

              {step.description && (
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {step.description}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
