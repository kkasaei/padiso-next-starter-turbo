'use client'

import Image from 'next/image'
import { Button } from '@workspace/ui/components/button'
import { ChartNoAxesCombinedIcon, type LucideIcon } from 'lucide-react'

interface AnalyticsEmptyStateProps {
  /** The icon to display in the empty state */
  icon?: LucideIcon
  /** The heading text */
  title?: string
  /** The description text */
  description: string
  /** The button text */
  buttonText?: string
  /** Show Google icon in button */
  showGoogleIcon?: boolean
  /** Callback when the connect button is clicked */
  onConnect: () => void
}

/**
 * AnalyticsEmptyState Component
 *
 * A reusable empty state card for the analytics page when GSC is not connected.
 * Displays a centered card with an icon, title, description, and action button.
 *
 * @component
 */
export function AnalyticsEmptyState({
  icon: Icon = ChartNoAxesCombinedIcon,
  title,
  description,
  buttonText = 'Connect Google Search Console',
  showGoogleIcon = true,
  onConnect,
}: AnalyticsEmptyStateProps) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-polar-800 bg-gray-50 dark:bg-polar-900 w-full p-8 flex flex-col items-center justify-center py-24 gap-6">
      <div className="text-gray-300 dark:text-gray-600">
        <Icon className="h-12 w-12" />
      </div>
      <div className="flex flex-col items-center gap-4">
        {title && (
          <h3 className="text-lg font-medium">{title}</h3>
        )}
        <p className="text-sm text-muted-foreground text-center max-w-md">
          {description}
        </p>
        <Button 
          onClick={onConnect} 
          variant="outline"
          className="gap-2 bg-white dark:bg-polar-800 rounded-2xl"
        >
          {showGoogleIcon && (
            <Image
              src="/icons/google.svg"
              alt="Google"
              width={16}
              height={16}
            />
          )}
          {buttonText}
        </Button>
      </div>
    </div>
  )
}
