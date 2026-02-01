"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Button } from "@workspace/ui/components/button";
import { ExternalLink } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Generate mock time series data
const generateData = (baseValue: number, variance: number) => {
  const data = [];
  const startDate = new Date("2026-01-19");

  for (let i = 0; i < 8; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const randomValue = baseValue + Math.floor(Math.random() * variance);

    data.push({
      date: date.toISOString().split("T")[0],
      displayDate: `${date.toLocaleDateString("en-US", { month: "short" })} ${date.getDate()}`,
      value: randomValue,
    });
  }

  return data;
};

// Mock data for each metric
const projectsData = generateData(10, 4);
const visibilityData = generateData(68, 12);
const reportsData = generateData(130, 40);
const creditsData = generateData(700, 200);

type ChartDataPoint = {
  date: string;
  displayDate: string;
  value: number;
};

// Area Chart Component matching existing style
function MetricAreaChart({ data, color = "#2563eb" }: { data: ChartDataPoint[]; color?: string }) {
  return (
    <div className="flex w-full flex-col gap-y-2 rounded-3xl bg-white dark:bg-zinc-900 p-4">
      <div style={{ height: "200px", width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.025} />
                <stop offset="100%" stopColor={color} stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="6 6"
              stroke="#ccc"
              opacity={0.3}
              vertical={true}
              horizontal={false}
            />
            <XAxis
              dataKey="displayDate"
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#gradient-${color.replace("#", "")})`}
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Metric Card Component matching existing style
function MetricCard({
  title,
  value,
  dateRange,
  data,
  color = "#2563eb",
  span = 1,
}: {
  title: string;
  value: string | number;
  dateRange: string;
  data: ChartDataPoint[];
  color?: string;
  span?: 1 | 2;
}) {
  return (
    <div
      className={`group flex w-full flex-col justify-between p-2 bg-transparent border ${
        span === 2 ? "lg:col-span-2" : ""
      } border-t-0 border-r border-b border-l-0 border-gray-200 dark:border-zinc-700 shadow-none`}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between p-6">
        <div className="flex w-full flex-col gap-y-4">
          <div className="flex flex-row items-center gap-x-2">
            <h3 className="text-lg">{title}</h3>
          </div>
          <h2 className="text-5xl font-light">{value}</h2>
          <div className="flex flex-col gap-x-6 gap-y-2 md:flex-row md:items-center">
            <div className="flex flex-row items-center gap-x-2 text-sm">
              <span
                className="h-3 w-3 rounded-full border-2"
                style={{ borderColor: color }}
              />
              <span className="text-gray-500 dark:text-zinc-500">{dateRange}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="hidden rounded-full opacity-0 transition-opacity group-hover:opacity-100 md:block h-8 w-8"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <MetricAreaChart data={data} color={color} />
    </div>
  );
}

export function AnalyticsContent() {
  const [dateRange, setDateRange] = useState("7d");

  const cards = [
    {
      title: "Active Projects",
      value: projectsData[projectsData.length - 1].value,
      dateRange: "Jan 19 – Jan 26, 2026",
      data: projectsData,
      color: "#3b82f6",
      span: 1 as const,
    },
    {
      title: "Avg. AI Visibility",
      value: `${visibilityData[visibilityData.length - 1].value}/100`,
      dateRange: "Jan 19 – Jan 26, 2026",
      data: visibilityData,
      color: "#10b981",
      span: 1 as const,
    },
    {
      title: "Content Generated",
      value: reportsData.reduce((acc, d) => acc + d.value, 0).toLocaleString(),
      dateRange: "Jan 19 – Jan 26, 2026",
      data: reportsData,
      color: "#f59e0b",
      span: 1 as const,
    },
    {
      title: "Credits Used",
      value: creditsData.reduce((acc, d) => acc + d.value, 0).toLocaleString(),
      dateRange: "Jan 19 – Jan 26, 2026",
      data: creditsData,
      color: "#8b5cf6",
      span: 1 as const,
    },
  ];

  return (
    <div className="flex flex-1 flex-col min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <p className="text-base font-medium text-foreground">Analytics</p>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-zinc-700">
            <div className="grid grid-cols-1 md:grid-cols-2 [clip-path:inset(1px_1px_1px_1px)]">
              {cards.map((card, index) => (
                <MetricCard key={index} {...card} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
