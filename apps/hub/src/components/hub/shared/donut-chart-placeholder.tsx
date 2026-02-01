'use client'

import type { DonutChartPlaceholderProps } from '../types'

export function DonutChartPlaceholder({ centerText, centerSubtext }: DonutChartPlaceholderProps) {
  return (
    <div className="relative w-full h-full">
      {/* SVG Donut Chart */}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="16"
          strokeDasharray="65 100"
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#22c55e"
          strokeWidth="16"
          strokeDasharray="65 100"
          strokeDashoffset="-65"
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#f97316"
          strokeWidth="16"
          strokeDasharray="55 100"
          strokeDashoffset="-130"
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="16"
          strokeDasharray="30 100"
          strokeDashoffset="-185"
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
      {/* Center Text */}
      {centerText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-green-500">{centerText}</span>
          {centerSubtext && <span className="text-xs text-muted-foreground">{centerSubtext}</span>}
        </div>
      )}
    </div>
  )
}

