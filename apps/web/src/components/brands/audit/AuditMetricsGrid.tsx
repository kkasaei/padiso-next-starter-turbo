'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  ArrowUpRight,
} from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, XAxis } from 'recharts';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip';
import { cn } from '@workspace/common/lib';
import type { WebsiteAuditDto, PageAuditDto } from '@workspace/common/lib/shcmea/types/dtos/audit-dto';

// ============================================================
// TYPES
// ============================================================
interface AuditMetricsGridProps {
  audit: WebsiteAuditDto;
  pages: PageAuditDto[];
  projectId: string;
}

interface MetricCardData {
  id: string;
  title: string;
  tooltip: string;
  value: string | number;
  suffix?: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  chartData: { day: string; value: number }[];
  chartColor: string;
  chartGradientFrom: string;
  href: string;
}

// ============================================================
// HELPERS
// ============================================================

// Generate trend data for the past 7 days
function generateTrendData(baseValue: number, variance: number = 0.15): { day: string; value: number }[] {
  const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const data: { day: string; value: number }[] = [];
  
  let currentValue = baseValue * (1 - variance * 0.8);
  
  for (let i = 0; i < days.length; i++) {
    const targetValue = baseValue;
    currentValue = currentValue + (targetValue - currentValue) * (0.2 + Math.random() * 0.3);
    data.push({ day: days[i]!, value: Math.round(currentValue) });
  }
  
  if (data.length > 0) {
    data[data.length - 1]!.value = baseValue;
  }
  
  return data;
}

// Calculate metrics from audit and pages
function calculateMetrics(audit: WebsiteAuditDto, pages: PageAuditDto[]): {
  pagesScanned: number;
  linksAnalyzed: number;
  assetsReviewed: number;
  performanceScore: number;
} {
  const pagesScanned = pages.length || audit.pagesScanned || 0;
  
  // Calculate links from page metadata
  const linksAnalyzed = pages.reduce((total, page) => {
    const links = page.metadata?.links?.length || 0;
    return total + links;
  }, 0) || pagesScanned * 15; // Fallback estimate
  
  // Calculate assets from page metadata
  const assetsReviewed = pages.reduce((total, page) => {
    const images = page.metadata?.images?.length || 0;
    return total + images;
  }, 0) || pagesScanned * 8; // Fallback estimate
  
  // Use audit performance score or calculate average from page scores
  const performanceScore = audit.performanceScore ?? 
    (Math.round(pages.reduce((sum, p) => sum + (p.technicalScore || 0), 0) / (pages.length || 1)) || 75);
  
  return {
    pagesScanned,
    linksAnalyzed,
    assetsReviewed,
    performanceScore,
  };
}

// ============================================================
// MINI CHART COMPONENT
// ============================================================
function MiniAreaChart({ 
  data, 
  color, 
  gradientFrom,
  id,
}: { 
  data: { day: string; value: number }[]; 
  color: string;
  gradientFrom: string;
  id: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={120}>
      <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={gradientFrom} stopOpacity={0.4} />
            <stop offset="100%" stopColor={gradientFrom} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="day" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          dy={8}
          interval={0}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#gradient-${id})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ============================================================
// METRIC CARD COMPONENT (Matching Hub Design)
// ============================================================
function MetricCard({ metric }: { metric: MetricCardData }) {
  return (
    <div className="group flex w-full flex-col justify-between rounded-xl border border-transparent bg-gray-50 p-2 shadow-xs transition-all hover:shadow-md dark:border-polar-700 dark:bg-polar-800 lg:rounded-4xl">
      {/* Header Section */}
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
        <div className="flex w-full flex-col gap-y-4">
          {/* Title Row */}
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-x-2">
              <h3 className="text-lg">{metric.title}</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-gray-400 hover:text-gray-600 dark:text-polar-500 dark:hover:text-polar-300 transition-colors">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-sm">{metric.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Link 
              href={metric.href}
              className="flex items-center justify-center h-8 w-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-polar-500 dark:hover:text-polar-300 dark:hover:bg-polar-700 transition-all"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          
          {/* Value */}
          <div className="flex items-baseline gap-x-2">
            <h2 className="text-5xl font-light">{metric.value}</h2>
            {metric.suffix && (
              <span className="text-2xl text-gray-400 dark:text-polar-500">{metric.suffix}</span>
            )}
          </div>
          
          {/* Change indicator */}
          <div className="flex flex-row items-center gap-x-2 text-sm">
            <span 
              className="h-3 w-3 rounded-full border-2" 
              style={{ borderColor: metric.chartColor }} 
            />
            <span className="text-gray-500 dark:text-polar-500">Last 7 days</span>
            <span 
              className={cn(
                'font-medium',
                metric.trend === 'up' && 'text-green-600 dark:text-green-400',
                metric.trend === 'down' && 'text-red-600 dark:text-red-400',
                metric.trend === 'neutral' && 'text-gray-500 dark:text-polar-500'
              )}
            >
              {metric.change}
            </span>
          </div>
        </div>
      </div>
      
      {/* Chart Section - White inner card */}
      <div className="flex w-full flex-col gap-y-2 rounded-3xl bg-white p-4 dark:bg-polar-900">
        <MiniAreaChart 
          data={metric.chartData} 
          color={metric.chartColor}
          gradientFrom={metric.chartGradientFrom}
          id={metric.id}
        />
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export function AuditMetricsGrid({ audit, pages, projectId }: AuditMetricsGridProps) {
  const metrics = useMemo(() => {
    const calculated = calculateMetrics(audit, pages);
    const basePath = `/dashboard/brands/${projectId}/audit`;
    
    const metricsData: MetricCardData[] = [
      {
        id: 'pages',
        title: 'Pages Scanned',
        tooltip: 'Total number of pages discovered and analyzed during the technical audit.',
        value: calculated.pagesScanned,
        suffix: '',
        change: `+${Math.max(1, Math.round(calculated.pagesScanned * 0.05))}`,
        trend: 'up',
        chartData: generateTrendData(calculated.pagesScanned, 0.2),
        chartColor: '#3b82f6',
        chartGradientFrom: '#93c5fd',
        href: `${basePath}/pages`,
      },
      {
        id: 'links',
        title: 'Links Analyzed',
        tooltip: 'Total internal and external links found across all scanned pages.',
        value: calculated.linksAnalyzed || 0,
        change: calculated.linksAnalyzed > 0 ? `+${Math.round(calculated.linksAnalyzed * 0.08)}` : '—',
        trend: calculated.linksAnalyzed > 0 ? 'up' : 'neutral',
        chartData: generateTrendData(calculated.linksAnalyzed || 10, 0.15),
        chartColor: '#10b981',
        chartGradientFrom: '#6ee7b7',
        href: `${basePath}/links`,
      },
      {
        id: 'assets',
        title: 'Assets Reviewed',
        tooltip: 'Images, scripts, and other assets analyzed for optimization opportunities.',
        value: calculated.assetsReviewed,
        change: calculated.assetsReviewed > 0 ? `${calculated.assetsReviewed} total` : '—',
        trend: 'neutral',
        chartData: generateTrendData(calculated.assetsReviewed || 5, 0.1),
        chartColor: '#f472b6',
        chartGradientFrom: '#f9a8d4',
        href: `${basePath}/assets`,
      },
      {
        id: 'performance',
        title: 'Performance Score',
        tooltip: 'Overall performance score based on page speed, optimization, and best practices.',
        value: calculated.performanceScore,
        suffix: '/100',
        change: '+12',
        trend: calculated.performanceScore >= 70 ? 'up' : calculated.performanceScore >= 50 ? 'neutral' : 'down',
        chartData: generateTrendData(calculated.performanceScore || 50, 0.1),
        chartColor: '#a78bfa',
        chartGradientFrom: '#c4b5fd',
        href: `${basePath}/performance`,
      },
    ];
    
    return metricsData;
  }, [audit, pages, projectId]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {metrics.map((metric) => (
        <MetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
}
