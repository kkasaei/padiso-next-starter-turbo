'use client'

// ============================================================
// STAT CARD COMPONENT
// Displays a single statistic with optional trend indicator
// ============================================================

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  trend?: 'up' | 'down' | 'stable'
  trendValue?: string
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
}: StatCardProps) {
  return (
    <div className="group flex w-full flex-col justify-between p-2 bg-transparent dark:bg-transparent border dark:border-polar-700 border-t-0 border-r border-b border-l-0 border-gray-200 shadow-none">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">{title}</span>
            <span className="text-4xl font-light tracking-tight">{value}</span>
            {subtitle && (
              <span className="text-sm text-muted-foreground">{subtitle}</span>
            )}
          </div>
          <div className="rounded-full border border-gray-200 p-2.5 dark:border-polar-600">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                trend === 'up'
                  ? 'text-green-600'
                  : trend === 'down'
                  ? 'text-red-600'
                  : 'text-gray-500'
              }`}
            >
              {trend === 'up' ? `↑ ${trendValue || '+5.2%'}` : trend === 'down' ? `↓ ${trendValue || '-3.1%'}` : '→ Stable'}
            </span>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
        )}
      </div>
    </div>
  )
}

