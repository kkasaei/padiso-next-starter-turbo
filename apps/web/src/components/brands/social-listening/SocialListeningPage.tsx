'use client'

import { Button } from '@workspace/ui/components/button'
import { Bell, Ear } from 'lucide-react'

export default function SocialListeningPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0 p-6">
      <div className="md:dark:bg-polar-900 dark:border-polar-700 w-full md:rounded-xl md:border md:border-gray-100 md:bg-gray-50 md:p-8 lg:rounded-4xl items-center justify-center gap-y-6 md:flex md:flex-col md:py-48">
        <div className="text-gray-300 dark:text-gray-600">
          <Ear className="h-12 w-12" />
        </div>
        <div className="flex flex-col items-center gap-y-6">
          <div className="flex flex-col items-center gap-y-2">
            <h3 className="text-lg font-medium">Social Listening</h3>
            <p className="dark:text-polar-500 text-gray-500 text-center max-w-md">
              Monitor brand mentions and conversations across Reddit, Twitter, and other platforms with AI-powered intelligence. Coming soon.
            </p>
          </div>
          <Button variant="outline" className="rounded-2xl gap-2" disabled>
            <Bell className="h-4 w-4" />
            Notify Me When Available
          </Button>
        </div>
      </div>
    </div>
  )
}
