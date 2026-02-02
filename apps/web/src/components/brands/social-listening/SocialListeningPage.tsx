'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import { Button } from '@workspace/ui/components/button'
import { RefreshCw, Settings2, Hash, MessageSquare, Sparkles } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { toast } from 'sonner'
import { OpportunitiesTab } from './OpportunitiesTab'
import { KeywordsTab } from './KeywordsTab'
import { SettingsTab } from './SettingsTab'
import { StatsCards } from './StatsCards'

export default function SocialListeningPage() {
  const params = useParams()
  const brandId = params.id as string
  const [activeTab, setActiveTab] = useState('opportunities')

  const utils = trpc.useUtils()
  
  const { data: stats, isLoading: statsLoading } = trpc.reddit.getStats.useQuery(
    { brandId },
    { enabled: !!brandId }
  )

  const { data: connectionTest } = trpc.reddit.testConnection.useQuery()

  const triggerScan = trpc.reddit.triggerScan.useMutation({
    onSuccess: (result) => {
      toast.success(`Scan complete! Found ${result.found} opportunities, saved ${result.saved} new.`)
      utils.reddit.getOpportunities.invalidate()
      utils.reddit.getStats.invalidate()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleScan = () => {
    triggerScan.mutate({ brandId })
  }

  const isConnected = connectionTest?.success ?? false

  return (
    <div className="relative flex min-w-0 flex-1 flex-col">
      <div className="flex h-full w-full flex-col gap-8 p-6">
        {/* Actions */}
        <div className="flex justify-end">
          <div className="flex items-center gap-3">
            {!isConnected && (
              <span className="text-xs text-red-500 dark:text-red-400">Reddit not connected</span>
            )}
            <Button 
              onClick={handleScan} 
              disabled={triggerScan.isPending || !isConnected}
              className="rounded-full gap-2"
            >
              {triggerScan.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Scan Reddit
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <StatsCards stats={stats} isLoading={statsLoading} />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="bg-transparent ring-0 dark:bg-transparent dark:ring-0 p-1 gap-2 w-max">
            <TabsTrigger 
              value="opportunities" 
              className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Opportunities
              {stats?.pendingOpportunities ? (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                  {stats.pendingOpportunities}
                </span>
              ) : null}
            </TabsTrigger>
            <TabsTrigger 
              value="keywords" 
              className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 gap-2"
            >
              <Hash className="h-4 w-4" />
              Keywords
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 gap-2"
            >
              <Settings2 className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities" className="flex-1 mt-6">
            <OpportunitiesTab brandId={brandId} />
          </TabsContent>

          <TabsContent value="keywords" className="flex-1 mt-6">
            <KeywordsTab brandId={brandId} />
          </TabsContent>

          <TabsContent value="settings" className="flex-1 mt-6">
            <SettingsTab brandId={brandId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
