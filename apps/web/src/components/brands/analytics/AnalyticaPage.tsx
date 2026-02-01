'use client'

import Image from 'next/image'
import { Button } from '@workspace/ui/components/button'
import { ChartNoAxesCombinedIcon } from 'lucide-react'

export default function AnalyticsPageComponent() {
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
        </div>
      </div>
    </div>
  )
}
