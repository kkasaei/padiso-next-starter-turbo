import * as React from 'react';

import type { AEOReport } from '@workspace/common/lib';

interface ScorePreviewCardProps {
  averageScore: number;
  providers: AEOReport['llmProviders'];
}

export function ScorePreviewCard({
  averageScore,
  providers
}: ScorePreviewCardProps): React.JSX.Element {
  const circumference = 339.292;
  const strokeDasharray = `${(averageScore / 100) * circumference} ${circumference}`;

  return (
    <div className="shrink-0">
      <div className="group relative">
        {/* Glow effect */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-lg transition-opacity group-hover:opacity-30" />

        {/* Card */}
        <div className="relative flex flex-col items-center gap-4 rounded-2xl border-2 bg-background p-8 shadow-xl">
          <div className="text-sm font-medium text-muted-foreground">
            Overall AEO Score
          </div>

          <div className="relative">
            {/* Circular progress */}
            <svg className="size-32" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted/20"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                transform="rotate(-90 60 60)"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>

            {/* Score display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold">{averageScore}</div>
                <div className="text-xs text-muted-foreground">/ 100</div>
              </div>
            </div>
          </div>

          {/* Provider scores */}
          <div className="flex gap-2">
            {providers.map((provider) => (
              <div
                key={provider.name}
                className="flex flex-col items-center gap-1"
              >
                <div className="text-xs font-semibold">{provider.score}</div>
                <div className="text-[10px] text-muted-foreground">
                  {provider.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
