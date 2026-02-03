'use client'

import { useState } from 'react'
import { Button } from '@workspace/ui/components/button'
import { Link2, Play } from 'lucide-react'

// Local components
import { BacklinkStatsCards } from './BacklinkStatsCards'
import { BacklinksTabsTable } from './BacklinksTable'
import { IntegrationSetupModal, IntegrationEmptyState } from './IntegrationSetupModal'
import { BuyCreditsModal } from './BuyCreditsModal'

// Mock data
import {
  MOCK_BACKLINK_METRICS,
  MOCK_BACKLINKS_RECEIVED_FULL,
  MOCK_BACKLINKS_GIVEN,
} from './mock-data'

// ============================================================
// Coming Soon Empty State
// ============================================================
interface ComingSoonStateProps {
  onViewDemo: () => void
}

function ComingSoonState({ onViewDemo }: ComingSoonStateProps) {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <div className="md:dark:bg-polar-900 dark:border-polar-700 w-full md:rounded-xl md:border md:border-gray-100 md:bg-gray-50 md:p-8 lg:rounded-4xl items-center justify-center gap-y-6 md:flex md:flex-col md:py-48">
        <div className="text-gray-300 dark:text-gray-600">
          <Link2 className="h-12 w-12" />
        </div>
        <div className="flex flex-col items-center gap-y-6">
          <div className="flex flex-col items-center gap-y-2">
            <h3 className="text-lg font-medium">Backlink Exchange</h3>
            <p className="dark:text-polar-500 text-gray-500 text-center max-w-md">
              Grow your domain authority and AI visibility through our credit-based backlink exchange. 
              Track incoming and outgoing links, and verify link quality — all from one dashboard.
            </p>
          </div>
          <Button onClick={onViewDemo} className="rounded-2xl gap-2">
            <Play className="h-4 w-4" />
            View Demo
          </Button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Main Page Component
// ============================================================
interface BacklinkExchangePageProps {
  brandId?: string
}

export function BacklinkExchangePage({ brandId }: BacklinkExchangePageProps) {
  // Default to false to show "Coming Soon" state
  const [isExchangeEnabled, setIsExchangeEnabled] = useState(false)
  const [isIntegrated, setIsIntegrated] = useState(true)
  const [integrationModalOpen, setIntegrationModalOpen] = useState(false)
  const [buyCreditsModalOpen, setBuyCreditsModalOpen] = useState(false)

  const handleIntegrationConnect = (providerId: string) => {
    console.log('Connecting to:', providerId)
    setIsIntegrated(true)
  }

  const handlePurchaseCredits = (planId: string) => {
    console.log('Purchasing plan:', planId)
  }

  // Show Coming Soon state when exchange is not enabled
  if (!isExchangeEnabled) {
    return <ComingSoonState onViewDemo={() => setIsExchangeEnabled(true)} />
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Main Content - Show Dashboard or Empty State */}
      {isIntegrated ? (
        <>
          {/* Stats Cards */}
          <BacklinkStatsCards
            metrics={MOCK_BACKLINK_METRICS}
            onBuyCredits={() => setBuyCreditsModalOpen(true)}
          />

          {/* Tables Section */}
          <BacklinksTabsTable
            receivedData={MOCK_BACKLINKS_RECEIVED_FULL}
            givenData={MOCK_BACKLINKS_GIVEN}
          />
        </>
      ) : (
        <IntegrationEmptyState onSetupClick={() => setIntegrationModalOpen(true)} />
      )}

      {/* Modals */}
      <IntegrationSetupModal
        open={integrationModalOpen}
        onOpenChange={setIntegrationModalOpen}
        onConnect={handleIntegrationConnect}
      />

      <BuyCreditsModal
        open={buyCreditsModalOpen}
        onOpenChange={setBuyCreditsModalOpen}
        onPurchase={handlePurchaseCredits}
      />
    </div>
  )
}

export default BacklinkExchangePage
