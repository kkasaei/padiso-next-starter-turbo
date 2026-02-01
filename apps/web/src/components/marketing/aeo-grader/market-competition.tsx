'use client';

import * as React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import { Badge } from '@workspace/ui/components/badge';

interface CompetitorData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number; // Index signature for Recharts compatibility
}

interface MarketSegment {
  title: string;
  data: CompetitorData[];
  totalMentions: number;
  queries: number;
  keyFactors: string[];
}

interface MarketCompetitionProps {
  segments: MarketSegment[];
}

export function MarketCompetition({
  segments
}: MarketCompetitionProps): React.JSX.Element {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Market Competition</h2>
        <p className="text-muted-foreground">
          Measures your brand&apos;s presence in industry conversations compared
          to competitors - your &quot;share of voice&quot;.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-8 md:grid-cols-3">
          {Array.isArray(segments) && segments.map((segment, index) => (
            <div
              key={index}
              className="group/card space-y-4 rounded-2xl border-2 bg-gradient-to-br from-card to-card/50 p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:shadow-2xl"
            >
              <div>
                <h4 className="mb-3 text-lg font-bold">{segment.title}</h4>
                <div className="flex flex-wrap gap-2 text-sm">
                  <Badge variant="secondary" className="font-semibold shadow-sm">
                    {segment.queries} queries
                  </Badge>
                  <Badge variant="secondary" className="font-semibold shadow-sm">
                    {segment.totalMentions} mentions
                  </Badge>
                </div>
              </div>

              <div className="h-48">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={segment.data}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {segment.data.map((entry, idx) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={entry.color}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number | undefined) => value !== undefined ? `${value}%` : '0%'}
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid hsl(var(--border))',
                        backgroundColor: 'hsl(var(--background))'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                <h5 className="text-sm font-bold">Key Factors:</h5>
                <ul className="space-y-2 text-sm">
                  {segment.keyFactors.map((factor, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 rounded-lg bg-muted/30 px-3 py-2"
                    >
                      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-sm" />
                      <span className="font-medium">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}



