'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@workspace/ui/components/button'
import { ChartNoAxesCombinedIcon, CheckCircle2, Settings } from 'lucide-react'
import { useIntegrations } from '@/hooks/use-integrations'

interface AnalyticsPageProps {
  brandId: string
}

export default function AnalyticsPageComponent({ brandId }: AnalyticsPageProps) {
  const { data: integrations, isLoading } = useIntegrations(brandId)
  
  // Check if Google integration is connected (covers Search Console, Analytics, etc.)
  const googleIntegration = integrations?.find(
    (i) => i.type === 'google' && i.status === 'active'
  )
  const isConnected = !!googleIntegration

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col min-w-0 p-6">
        <div className="md:dark:bg-polar-900 dark:border-polar-700 w-full md:rounded-xl md:border md:border-gray-100 md:bg-gray-50 md:p-8 lg:rounded-4xl items-center justify-center gap-y-6 md:flex md:flex-col md:py-48">
          <div className="text-gray-300 dark:text-gray-600 animate-pulse">
            <ChartNoAxesCombinedIcon className="h-12 w-12" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (isConnected) {
    return (
      <div className="flex flex-1 flex-col min-w-0 p-6">
        <div className="md:dark:bg-polar-900 dark:border-polar-700 w-full md:rounded-xl md:border md:border-gray-100 md:bg-gray-50 md:p-8 lg:rounded-4xl items-center justify-center gap-y-6 md:flex md:flex-col md:py-48">
          <div className="text-emerald-500">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <div className="flex flex-col items-center gap-y-6">
            <div className="flex flex-col items-center gap-y-2">
              <h3 className="text-lg font-medium">Google Search Console Connected</h3>
              <p className="dark:text-polar-500 text-gray-500 text-center max-w-md">
                Your Google Search Console account is connected. Analytics data will appear here soon.
              </p>
            </div>
            <Link href={`/dashboard/brands/${brandId}/settings`}>
              <Button variant="outline" className="rounded-2xl">
                <Settings className="h-4 w-4 mr-2" />
                Manage Integration
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col min-w-0 p-6">
      <div className="md:dark:bg-polar-900 dark:border-polar-700 w-full md:rounded-xl md:border md:border-gray-100 md:bg-gray-50 md:p-8 lg:rounded-4xl items-center justify-center gap-y-6 md:flex md:flex-col md:py-48">
        <div className="text-gray-300 dark:text-gray-600">
          <ChartNoAxesCombinedIcon className="h-12 w-12" />
        </div>
        <div className="flex flex-col items-center gap-y-6">
          <div className="flex flex-col items-center gap-y-2">
            <h3 className="text-lg font-medium">Analytics</h3>
            <p className="dark:text-polar-500 text-gray-500 text-center max-w-md">
              Connect your Google Search Console account to view your brand&apos;s search console data.
            </p>
          </div>
          <Link href={`/dashboard/brands/${brandId}/settings`}>
            <Button variant="outline" className="rounded-2xl">
              <Image 
                src="/icons/google.svg" 
                alt="Google Search Console" 
                width={16} 
                height={16} 
                className="mr-2"
              />
              Connect Google Search Console
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
