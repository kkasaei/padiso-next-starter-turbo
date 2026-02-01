'use client'

import { Check } from 'lucide-react'
import { cn } from '@workspace/common/lib'

// ============================================================
// TYPES
// ============================================================
export interface WizardSubStep {
  id: string
  label: string
}

export interface WizardStepConfig {
  id: string
  label: string
  description?: string
  subSteps?: WizardSubStep[] // Optional substeps for combined steps
}

interface WizardStepIndicatorProps {
  steps: WizardStepConfig[]
  currentStep: number
  currentStepId?: string // Optional: current step ID to determine active substep
  onStepClick?: (stepIndex: number) => void
}

// ============================================================
// WIZARD STEP INDICATOR
// ============================================================
export function WizardStepIndicator({ steps, currentStep, currentStepId, onStepClick }: WizardStepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol role="list" className="flex items-start w-full">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isUpcoming = index > currentStep
          const isLast = index === steps.length - 1
          // For the last step, if it's current and matches the step ID, consider it completed
          const isLastStepCompleted = isLast && isCurrent && currentStepId === step.id
          const shouldShowCheckmark = isCompleted || isLastStepCompleted
          const isClickable = onStepClick && (isCompleted || isCurrent)

          return (
            <li
              key={step.id}
              className={cn(
                'relative flex-1 flex flex-col items-center',
                isClickable && 'cursor-pointer'
              )}
            >
              {/* Connector Line - Properly aligned from circle edge to circle edge */}
              {!isLast && (
                <div
                  className="absolute top-4 h-[1px]"
                  style={{
                    left: 'calc(50% + 1rem)',
                    right: 'calc(-50% + 1rem)'
                  }}
                  aria-hidden="true"
                >
                  <div
                    className={cn(
                      'h-full w-full transition-colors duration-300',
                      (isCompleted || (isLast && isLastStepCompleted))
                        ? 'bg-blue-300 dark:bg-blue-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    )}
                  />
                </div>
              )}

              {/* Step Circle - Clean ANTD style */}
              <div 
                className="relative z-10 flex flex-col items-center"
                onClick={() => isClickable && onStepClick?.(index)}
              >
                <span
                  className={cn(
                    'relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300',
                    'font-medium',
                    (isCompleted || isLastStepCompleted) && [
                      'bg-blue-400 dark:bg-blue-500',
                      'text-white',
                      isClickable && 'hover:bg-blue-500 dark:hover:bg-blue-600'
                    ],
                    isCurrent && !isLastStepCompleted && [
                      'border-2 border-blue-500 dark:border-blue-400',
                      'bg-white dark:bg-polar-900',
                      'text-blue-500 dark:text-blue-400',
                      isClickable && 'hover:border-blue-600 dark:hover:border-blue-300'
                    ],
                    isUpcoming && [
                      'border-2 border-gray-300 dark:border-gray-600',
                      'bg-white dark:bg-polar-900',
                      'text-gray-400 dark:text-gray-500'
                    ]
                  )}
                >
                  {shouldShowCheckmark ? (
                    <Check
                      className="h-4 w-4 text-white"
                      aria-hidden="true"
                      strokeWidth={3}
                    />
                  ) : (
                    <span className="text-xs font-semibold">
                      {index + 1}
                    </span>
                  )}
                </span>

                {/* Step Name - Clean typography */}
                <span
                  className={cn(
                    'mt-3 text-sm font-medium transition-colors duration-300 text-center',
                    (isCompleted || isLastStepCompleted) && [
                      'text-gray-500 dark:text-gray-400',
                      isClickable && 'hover:text-gray-700 dark:hover:text-gray-300'
                    ],
                    isCurrent && !isLastStepCompleted && 'text-gray-900 dark:text-white font-semibold',
                    isUpcoming && 'text-gray-400 dark:text-gray-500'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Step Description - Subtle and clean */}
              {step.description && (
                <span
                  className={cn(
                    'mt-1.5 text-xs transition-colors duration-300 text-center',
                    'text-gray-500 dark:text-gray-400'
                  )}
                >
                  {step.description}
                </span>
              )}

              {/* Substeps - Show when step has substeps */}
              {step.subSteps && step.subSteps.length > 0 && (
                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {step.subSteps.map((subStep, subIndex) => {
                    // Determine substep state based on currentStepId
                    const isSubStepCurrent = isCurrent && currentStepId === subStep.id
                    const currentSubStepIndex = step.subSteps!.findIndex(s => s.id === currentStepId)
                    const isSubStepCompleted = isCompleted || (isCurrent && subIndex < currentSubStepIndex)
                    
                    return (
                      <span
                        key={subStep.id}
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors',
                          isSubStepCompleted
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : isSubStepCurrent
                            ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                        )}
                      >
                        {isSubStepCompleted && (
                          <Check className="h-2.5 w-2.5 flex-shrink-0" strokeWidth={3} />
                        )}
                        <span>{subStep.label}</span>
                      </span>
                    )
                  })}
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
