'use client'

import { Badge } from '@workspace/ui/components/badge'
import { ChartBar } from '@phosphor-icons/react/dist/ssr'

export default function AnalyticsPageComponent() {
  return (
    <div className="flex flex-1 flex-col min-w-0 p-6">
      <div className="md:dark:bg-polar-900 dark:border-polar-700 w-full md:rounded-xl md:border md:border-gray-100 md:bg-gray-50 md:p-8 lg:rounded-4xl items-center justify-center gap-y-6 md:flex md:flex-col md:py-48">
        <div className="text-gray-300 dark:text-gray-600">
          <ChartBar className="h-12 w-12" weight="duotone" />
        </div>
        <div className="flex flex-col items-center gap-y-6">
          <div className="flex flex-col items-center gap-y-2">
            <h3 className="text-lg font-medium">Analytics</h3>
            <p className="dark:text-polar-500 text-gray-500 text-center max-w-md">
              Track your AI visibility scores and discover insights about your brand performance across AI platforms.
            </p>
          </div>
          <Badge variant="outline" className="rounded-lg">Coming Soon</Badge>
        </div>
      </div>
    </div>
  )
}
