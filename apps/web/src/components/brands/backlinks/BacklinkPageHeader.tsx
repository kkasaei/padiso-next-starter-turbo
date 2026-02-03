'use client'

import { useState } from 'react'
import { Button } from '@workspace/ui/components/button'
import { HelpCircle, Settings } from 'lucide-react'
import { IntegrationSetupModal } from './IntegrationSetupModal'

export function BacklinkPageHeader() {
  const [integrationModalOpen, setIntegrationModalOpen] = useState(false)

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIntegrationModalOpen(true)}
          className="gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
          Integrations
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <HelpCircle className="h-4 w-4" />
          How it works
        </Button>
      </div>

      <IntegrationSetupModal
        open={integrationModalOpen}
        onOpenChange={setIntegrationModalOpen}
        onConnect={(providerId) => {
          console.log('Connecting to:', providerId)
          setIntegrationModalOpen(false)
        }}
      />
    </>
  )
}
