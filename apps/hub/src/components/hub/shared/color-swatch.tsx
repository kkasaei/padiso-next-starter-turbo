'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import type { ColorSwatchProps } from '../types'

export function ColorSwatch({ name, variable, className, textClass = 'text-foreground' }: ColorSwatchProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(variable)
    setCopied(true)
    toast.success(`Copied: ${variable}`)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="group flex flex-col gap-2 text-left transition-transform hover:scale-105"
    >
      <div
        className={`h-20 w-full rounded-xl border border-border ${className} flex items-center justify-center transition-all group-hover:shadow-lg`}
      >
        {copied ? (
          <Check className={`h-5 w-5 ${textClass}`} />
        ) : (
          <Copy className={`h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity ${textClass}`} />
        )}
      </div>
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground font-mono">{variable}</p>
      </div>
    </button>
  )
}

