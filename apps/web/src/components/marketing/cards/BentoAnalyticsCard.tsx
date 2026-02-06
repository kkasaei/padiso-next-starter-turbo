'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react';
import Image from 'next/image';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';
import {
  ChartContainer,
  ChartTooltip,
} from '@workspace/ui/components/chart';
import { cn } from '@workspace/common/lib';

const AI_PLATFORMS = [
  { key: 'chatgpt', name: 'ChatGPT', icon: '/icons/openai.svg', color: '#60a5fa' },
  { key: 'perplexity', name: 'Perplexity', icon: '/icons/perplexity.svg', color: '#f97316' },
  { key: 'claude', name: 'Claude', icon: '/icons/claude.svg', color: '#a855f7' },
  { key: 'gemini', name: 'Gemini', icon: '/icons/gemini.svg', color: '#22c55e' },
  { key: 'grok', name: 'Grok', icon: '/icons/xai.svg', color: '#ef4444' },
  { key: 'deepseek', name: 'DeepSeek', icon: '/icons/deepseek.svg', color: '#06b6d4' },
];

const TIME_PERIODS = [
  { label: '1D', days: 1 },
  { label: '7D', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: '12M', days: 365 },
  { label: '16M', days: 480 },
];

// Generate realistic data based on time period
function generateData(days: number) {
  const data: Array<{
    label: string;
    chatgpt: number;
    perplexity: number;
    claude: number;
    gemini: number;
    grok: number;
    deepseek: number;
  }> = [];
  
  // Base values that grow over time
  const baseValues = {
    chatgpt: 45,
    perplexity: 32,
    claude: 28,
    gemini: 22,
    grok: 15,
    deepseek: 12,
  };
  
  // Determine number of data points and label format
  let points: number;
  let labelFormat: 'hour' | 'day' | 'week' | 'month';
  
  if (days === 1) {
    points = 24;
    labelFormat = 'hour';
  } else if (days <= 7) {
    points = days;
    labelFormat = 'day';
  } else if (days <= 90) {
    points = Math.ceil(days / 7);
    labelFormat = 'week';
  } else {
    points = Math.ceil(days / 30);
    labelFormat = 'month';
  }
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days_short = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1 || 1);
    const noise = () => (Math.random() - 0.5) * 8;
    
    let label: string;
    if (labelFormat === 'hour') {
      label = `${i}:00`;
    } else if (labelFormat === 'day') {
      label = days_short[i % 7];
    } else if (labelFormat === 'week') {
      label = `W${i + 1}`;
    } else {
      label = months[i % 12];
    }
    
    // Growth factor based on time span
    const growthMultiplier = days > 30 ? 1 + progress * 0.8 : 1 + progress * 0.2;
    
    data.push({
      label,
      chatgpt: Math.round(baseValues.chatgpt * growthMultiplier + noise()),
      perplexity: Math.round(baseValues.perplexity * growthMultiplier + noise()),
      claude: Math.round(baseValues.claude * growthMultiplier + noise()),
      gemini: Math.round(baseValues.gemini * growthMultiplier + noise()),
      grok: Math.round(baseValues.grok * growthMultiplier + noise()),
      deepseek: Math.round(baseValues.deepseek * growthMultiplier + noise()),
    });
  }
  
  return data;
}

// Custom tooltip with logos
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload) return null;
  
  return (
    <div className="rounded-lg border bg-background p-3 shadow-lg">
      <p className="mb-2 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="space-y-1.5">
        {payload.map((entry) => {
          const platform = AI_PLATFORMS.find(p => p.key === entry.dataKey);
          if (!platform) return null;
          return (
            <div key={entry.dataKey} className="flex items-center gap-2">
              <Image
                src={platform.icon}
                alt={platform.name}
                width={14}
                height={14}
                className="dark:invert"
              />
              <span className="text-xs" style={{ color: platform.color }}>{platform.name}</span>
              <span className="ml-auto text-xs font-semibold">{entry.value}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const MotionCard = motion.create(Card);

export function BentoAnalyticsCard({
  className,
  ...other
}: React.ComponentPropsWithoutRef<typeof MotionCard>): React.JSX.Element {
  const [selectedPeriod, setSelectedPeriod] = React.useState(90);
  
  const chartData = React.useMemo(() => generateData(selectedPeriod), [selectedPeriod]);
  const tooltipIndex = React.useMemo(() => Math.floor(chartData.length / 2), [chartData.length]);

  return (
    <MotionCard
      className={cn(
        'relative h-[380px] max-h-[380px] overflow-hidden',
        className
      )}
      {...other}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <TrendingUp className="size-5 text-primary" />
          AI Tracking
        </CardTitle>
        <div className="flex items-center gap-0.5 rounded-lg border bg-muted/50 p-0.5">
          {TIME_PERIODS.map((period) => (
            <button
              key={period.days}
              onClick={() => setSelectedPeriod(period.days)}
              className={cn(
                'rounded-md px-2 py-1 text-[10px] font-medium transition-all',
                selectedPeriod === period.days
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {period.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Track your AI visibility growth across platforms over time
        </p>
        
        {/* Chart */}
        <ChartContainer config={{}} className="h-[260px] w-full">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="bento-chatgptGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="chatgpt" stroke="#60a5fa" fill="url(#bento-chatgptGradient)" strokeWidth={2} />
            <Area type="monotone" dataKey="perplexity" stroke="#f97316" fill="transparent" strokeWidth={2} />
            <Area type="monotone" dataKey="claude" stroke="#a855f7" fill="transparent" strokeWidth={2} />
            <Area type="monotone" dataKey="gemini" stroke="#22c55e" fill="transparent" strokeWidth={2} />
            <Area type="monotone" dataKey="grok" stroke="#ef4444" fill="transparent" strokeWidth={2} />
            <Area type="monotone" dataKey="deepseek" stroke="#06b6d4" fill="transparent" strokeWidth={2} />
            <ChartTooltip 
              content={<CustomTooltip />}
              cursor={false}
              defaultIndex={tooltipIndex}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </MotionCard>
  );
}
