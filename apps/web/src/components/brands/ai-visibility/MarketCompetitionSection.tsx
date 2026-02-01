'use client'

import * as React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { MarketSegment } from '@/lib/shcmea/types/dtos/ai-visibility-dto'

interface MarketCompetitionSectionProps {
  segments: MarketSegment[]
}

export function MarketCompetitionSection({ segments }: MarketCompetitionSectionProps) {
  return (
    <div className="flex w-full flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <h2 className="text-lg text-muted-foreground">Market Competition</h2>
        <p className="text-sm text-muted-foreground">
          Your brand&apos;s share of voice in AI responses compared to competitors.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {segments.map((segment) => {
          // Find the brand's share (first item or "Your Brand" / "Miele")
          const brandData = segment.data.find(
            (d) => d.name === 'Miele' || d.name === 'Your Brand'
          ) || segment.data[0]

          return (
            <div
              key={segment.title}
              className="flex flex-col rounded-4xl bg-muted/30"
            >
              {/* Header */}
              <div className="flex flex-col gap-y-4 p-6 pb-4">
                <div className="flex flex-col gap-y-1">
                  <span className="text-lg font-medium">{segment.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {segment.queries} queries · {segment.totalMentions.toLocaleString()} mentions
                  </span>
                </div>
                <h2 className="text-5xl font-light text-blue-600 dark:text-blue-400">
                  {brandData?.value || 0}%
                  <span className="text-2xl text-muted-foreground"> share</span>
                </h2>
              </div>

              {/* Chart & Legend */}
              <div className="m-2 flex flex-col gap-y-4 rounded-3xl bg-card p-4">
                {/* Pie Chart */}
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={segment.data as Array<{ name: string; value: number; color: string; [key: string]: unknown }>}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {segment.data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="rounded-lg bg-popover px-3 py-2 text-sm shadow-md">
                                <p className="font-medium">{data.name}</p>
                                <p className="text-muted-foreground">{data.value}% share</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-2">
                  {segment.data.map((item) => (
                    <div key={item.name} className="flex items-center gap-x-1.5">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {item.name} ({item.value}%)
                      </span>
                    </div>
                  ))}
                </div>

                {/* Key Factors */}
                <div className="border-t border-border pt-3">
                  <span className="text-xs text-muted-foreground">Key Factors:</span>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {segment.keyFactors.map((factor) => (
                      <span
                        key={factor}
                        className="rounded-full bg-muted px-2 py-0.5 text-xs"
                      >
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
