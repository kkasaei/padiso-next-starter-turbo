'use client'

import { useState } from 'react'
import { cn } from '@workspace/common/lib'
import {
  Dialog,
  DialogContent,
} from '@workspace/ui/components/dialog'
import { Button } from '@workspace/ui/components/button'
import { ArrowRight, Loader2 } from 'lucide-react'
import { MOCK_SUBSCRIPTION_PLANS } from './mock-data'

// ============================================================
// Buy Credits Modal
// ============================================================
interface BuyCreditsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPurchase: (planId: string) => void
}

export function BuyCreditsModal({
  open,
  onOpenChange,
  onPurchase,
}: BuyCreditsModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('growth')
  const [isLoading, setIsLoading] = useState(false)

  const handlePurchase = async () => {
    if (selectedPlan) {
      setIsLoading(true)
      await onPurchase(selectedPlan)
      setIsLoading(false)
      onOpenChange(false)
    }
  }

  const selectedPlanData = MOCK_SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlan)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">
              Add credits
            </h2>
            <p className="text-sm text-muted-foreground">
              Select a monthly credit package. Cancel anytime.
            </p>
          </div>

          {/* Plan Options */}
          <div className="space-y-3">
            {MOCK_SUBSCRIPTION_PLANS.map((plan) => {
              const isSoldOut = plan.slotsAvailable === 0
              const isSelected = selectedPlan === plan.id

              return (
                <button
                  key={plan.id}
                  onClick={() => !isSoldOut && setSelectedPlan(plan.id)}
                  disabled={isSoldOut}
                  className={cn(
                    'w-full p-4 rounded-xl border text-left transition-colors relative',
                    isSelected && !isSoldOut
                      ? 'border-foreground bg-muted/50'
                      : 'border-border hover:border-muted-foreground/50',
                    isSoldOut && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {/* Slots badge */}
                  {plan.slotsAvailable <= 5 && plan.slotsAvailable > 0 && (
                    <div className="absolute -top-2 right-4">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                        {plan.slotsAvailable} left
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Radio indicator */}
                      <div className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                        isSelected ? 'border-foreground' : 'border-muted-foreground/50'
                      )}>
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-foreground" />
                        )}
                      </div>
                      
                      <div>
                        <span className="font-medium text-foreground">{plan.credits} credits</span>
                        <p className="text-sm text-muted-foreground">per month</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-2xl font-semibold text-foreground">${plan.price}</span>
                      <span className="text-sm text-muted-foreground">/mo</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* CTA */}
          <Button
            onClick={handlePurchase}
            disabled={!selectedPlan || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Continue with {selectedPlanData?.credits} credits
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Credits roll over month to month.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
