'use client';

import * as React from 'react';
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  PolarAngleAxis
} from 'recharts';
import { Smile, Meh, Frown } from 'lucide-react';

import { Badge } from '@workspace/ui/components/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@workspace/ui/components/accordion';

interface SentimentMetric {
  category: string;
  score: number;
  description: string;
  keyFactors: string[];
}

interface SentimentProvider {
  provider: string;
  totalScore: number;
  metrics: SentimentMetric[];
  polarization: number;
  reliableData: boolean;
}

interface SentimentAnalysisProps {
  providers: SentimentProvider[];
}

const getSentimentColor = (score: number): string => {
  if (score >= 70) return '#10b981'; // green
  if (score >= 50) return '#f59e0b'; // yellow
  return '#ef4444'; // red
};

const getSentimentIcon = (score: number) => {
  if (score >= 70)
    return <Smile className="size-5 text-green-500" />;
  if (score >= 50) return <Meh className="size-5 text-yellow-500" />;
  return <Frown className="size-5 text-red-500" />;
};

export function SentimentAnalysis({
  providers
}: SentimentAnalysisProps): React.JSX.Element {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Sentiment Analysis</h2>
        <p className="text-muted-foreground">
          Evaluates the language in AI responses to queries about your brand to
          determine the holistic sentiment and market perception.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
          {providers.map((provider) => (
            <div
              key={provider.provider}
              className="group/card space-y-4 rounded-2xl border-2 bg-gradient-to-br from-card to-card/50 p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:shadow-2xl"
            >
              {/* Provider Header */}
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold">{provider.provider}</h4>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-gradient-to-br from-primary/10 to-primary/5 p-2">
                    {getSentimentIcon(provider.totalScore)}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {provider.totalScore}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">/100</span>
                  </div>
                </div>
              </div>

              {/* Metrics Chart */}
              <div className="h-64">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="20%"
                    outerRadius="90%"
                    data={Array.isArray(provider.metrics) 
                      ? provider.metrics.map((metric) => ({
                          name: metric.category,
                          value: metric.score,
                          fill: getSentimentColor(metric.score)
                        }))
                      : []
                    }
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarAngleAxis
                      type="number"
                      domain={[0, 100]}
                      angleAxisId={0}
                      tick={false}
                    />
                    <RadialBar
                      label={{
                        position: 'insideStart',
                        fill: '#fff',
                        fontSize: 12,
                        fontWeight: 600
                      }}
                      background
                      dataKey="value"
                    />
                    <Legend
                      iconSize={10}
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{
                        paddingTop: '10px',
                        fontSize: '12px'
                      }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>

              {/* Additional Info */}
              <div className="space-y-3 border-t-2 pt-4">
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm font-medium">
                  <span>Polarization</span>
                  <Badge variant="outline" className="font-bold">{provider.polarization}/100</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm font-medium">
                  <span>Reliable Data</span>
                  <Badge variant={provider.reliableData ? 'default' : 'secondary'} className="font-bold">
                    {provider.reliableData ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>

              {/* Detailed Metrics */}
              <Accordion
                type="single"
                collapsible
                className="w-full"
              >
                <AccordionItem value="details" className="border-none">
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                    View Detailed Metrics
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      {Array.isArray(provider.metrics) && provider.metrics.map((metric, index) => (
                        <div
                          key={index}
                          className="rounded-xl border-2 bg-gradient-to-br from-muted/50 to-muted/30 p-4 shadow-sm transition-all hover:shadow-md"
                        >
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {metric.category}
                            </span>
                            <span className="text-sm font-semibold">
                              {metric.score}/100
                            </span>
                          </div>
                          <p className="mb-2 text-xs text-muted-foreground">
                            {metric.description}
                          </p>
                          <div className="space-y-1">
                            {metric.keyFactors.map((factor, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 text-xs text-muted-foreground"
                              >
                                <span className="mt-1 size-1 shrink-0 rounded-full bg-primary" />
                                {factor}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
      </div>
    </div>
  );
}

