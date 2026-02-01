'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export function ProviderSelector() {
  const [selectedProvider, setSelectedProvider] = useState('ChatGPT')
  const providers = [
    { provider: 'ChatGPT', logo: '/icons/openai.svg' },
    { provider: 'Perplexity', logo: '/icons/perplexity.svg' },
    { provider: 'Gemini', logo: '/icons/gemini.svg' },
  ]

  return (
    <div className="flex shrink-0 flex-row items-center gap-2">
      {providers.map((p) => (
        <button
          key={p.provider}
          onClick={() => setSelectedProvider(p.provider)}
          className={cn(
            'flex items-center gap-x-2 rounded-full px-3 py-1.5 text-sm transition-all',
            selectedProvider === p.provider
              ? 'bg-card shadow-sm ring-1 ring-border'
              : 'opacity-50 hover:opacity-75'
          )}
        >
          <div className="relative h-4 w-4">
            <Image
              src={p.logo}
              alt={p.provider}
              fill
              className="object-contain"
            />
          </div>
          <span>{p.provider}</span>
        </button>
      ))}
    </div>
  )
}

