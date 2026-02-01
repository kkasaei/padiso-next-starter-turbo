'use client'

import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import type { EmptyStateExampleProps } from '../types'

export function EmptyStateExample({ title, description, icon, actionLabel, variant = 'default' }: EmptyStateExampleProps) {
  return (
    <div className="md:dark:bg-polar-900 dark:border-polar-700 w-full md:rounded-xl md:border md:border-gray-100 md:bg-gray-50 md:p-8 lg:rounded-4xl items-center justify-center gap-y-6 md:flex md:flex-col md:py-24">
      <div className="text-gray-300 dark:text-gray-600">{icon}</div>
      <div className="flex flex-col items-center gap-y-6">
        <div className="flex flex-col items-center gap-y-2">
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="dark:text-polar-500 text-gray-500 text-center max-w-md">
            {description}
          </p>
        </div>
        {variant === 'coming-soon' ? (
          <Badge variant="outline" className="rounded-lg">Coming Soon</Badge>
        ) : actionLabel ? (
          <Button variant="outline" className="rounded-lg">
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </div>
  )
}

