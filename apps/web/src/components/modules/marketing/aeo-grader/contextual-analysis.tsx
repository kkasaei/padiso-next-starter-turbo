'use client';

import * as React from 'react';
import { Tag, Square } from 'lucide-react';


interface ContextualAnalysisProps {
  narrativeThemes: string[];
}

export function ContextualAnalysis({
  narrativeThemes
}: ContextualAnalysisProps): React.JSX.Element {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Contextual Analysis</h2>
        <p className="text-muted-foreground">
          This section assesses how your brand is perceived within the industry
          by analyzing recurring narratives, perceptions, and topic
          associations.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-primary to-primary/80 p-2.5 shadow-lg">
              <Tag className="size-6 text-primary-foreground" />
            </div>
            <h4 className="text-2xl font-bold">Narrative Themes</h4>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {narrativeThemes.map((theme, index) => (
              <div
                key={index}
                className="group/theme flex items-start gap-3 rounded-xl border-2 bg-gradient-to-br from-card to-card/50 p-4 shadow-md transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:shadow-xl"
              >
                <div className="mt-1 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 p-2">
                  <Square className="size-4 shrink-0 text-primary" />
                </div>
                <span className="break-words text-sm font-medium leading-relaxed">{theme}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border-2 bg-gradient-to-br from-muted/50 to-muted/30 p-6 shadow-lg">
            <p className="break-words text-sm font-medium leading-relaxed text-muted-foreground">
              These themes represent the most common narratives and perceptions
              associated with your brand across various AI platforms and digital
              channels. Strong recurring themes indicate clear brand positioning
              and messaging consistency.
            </p>
          </div>
        </div>
    </div>
  );
}

