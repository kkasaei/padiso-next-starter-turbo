'use client'

import * as React from 'react'
import { Tag } from 'lucide-react'

interface NarrativeThemesSectionProps {
  themes: string[]
}

export function NarrativeThemesSection({ themes }: NarrativeThemesSectionProps) {
  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      {/* Header Section - Inside gray card */}
      <div className="flex flex-col gap-6 p-6">
        <div className="flex w-full flex-col gap-y-2">
          <span className="text-lg font-semibold">Contextual Analysis</span>
          <p className="text-sm text-muted-foreground">
            Recurring narratives and perceptions associated with your brand.
          </p>
        </div>
      </div>

      {/* Content - White inner card */}
      <div className="flex w-full flex-col gap-y-4 rounded-3xl bg-card p-6">
        {/* Narrative Themes Header */}
        <div className="flex items-center gap-x-3">
          <div className="rounded-xl bg-muted p-2.5">
            <Tag className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Narrative Themes</span>
            <span className="text-sm text-muted-foreground">{themes.length} themes identified</span>
          </div>
        </div>

        {/* Theme Badges */}
        <div className="flex flex-wrap gap-2">
          {themes.map((theme, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-full bg-muted px-4 py-2 text-sm font-medium text-foreground"
            >
              {theme}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
