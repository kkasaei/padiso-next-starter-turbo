'use client'

import { Button } from '@workspace/ui/components/button'
import { Sparkle, Loader2 } from 'lucide-react'

interface GenerateWithAIButtonProps {
  onClick?: () => void
  disabled?: boolean
  isLoading?: boolean
}

export function GenerateWithAIButton({
  onClick,
  disabled = false,
  isLoading = false,
}: GenerateWithAIButtonProps) {
  return (
    <Button
      variant="outline"
      type="button"
      onClick={(e) => {
        e.preventDefault()
        if (onClick && !disabled && !isLoading) {
          onClick()
        }
      }}
      disabled={disabled || isLoading}
      className={disabled && !isLoading ? 'cursor-not-allowed opacity-50' : ''}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <Sparkle className="h-4 w-4" />
          <span>Generate with AI</span>
        </>
      )}
    </Button>
  )
}

