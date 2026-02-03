'use client'

import { cn } from '@workspace/common/lib'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@workspace/ui/components/dialog'
import { Button } from '@workspace/ui/components/button'
import {
  Settings,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'
import Image from 'next/image'
import type { CMSProvider } from './types'
import { MOCK_CMS_PROVIDERS } from './mock-data'

// ============================================================
// CMS Provider Icon Component (using actual SVG icons)
// ============================================================
interface CMSIconProps {
  icon: string
  name: string
  className?: string
}

function CMSIcon({ icon, name, className }: CMSIconProps) {
  return (
    <div
      className={cn(
        'w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-polar-800 overflow-hidden',
        className
      )}
    >
      <Image
        src={`/icons/${icon}.svg`}
        alt={name}
        width={24}
        height={24}
        className="w-6 h-6"
      />
    </div>
  )
}

// ============================================================
// Provider Card (simplified - just display, no selection)
// ============================================================
interface ProviderCardProps {
  provider: CMSProvider
}

function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-polar-800'
      )}
    >
      <CMSIcon icon={provider.icon} name={provider.name} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{provider.name}</span>
          {provider.popular && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              Popular
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground">{provider.description}</span>
      </div>
    </div>
  )
}

// ============================================================
// Integration Setup Modal (redirects to settings)
// ============================================================
interface IntegrationSetupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConnect: (providerId: string) => void
}

export function IntegrationSetupModal({
  open,
  onOpenChange,
}: IntegrationSetupModalProps) {
  const handleGoToSettings = () => {
    // In production, this would use router.push to navigate to settings
    // For now, we'll just close the modal and log
    console.log('Navigating to settings/integrations')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Connect Your CMS</DialogTitle>
          <DialogDescription>
            Connect your content management system to start receiving backlinks automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Provider Grid - 2 columns */}
          <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
            {MOCK_CMS_PROVIDERS.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={handleGoToSettings}
              className="w-full gap-2"
            >
              Go to Integrations
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full text-muted-foreground"
            >
              I'll do this later
            </Button>
          </div>

          {/* Help Link */}
          <div className="text-center pt-2">
            <a
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              Need help? View integration guide
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================
// Integration Empty State Card
// ============================================================
interface IntegrationEmptyStateProps {
  onSetupClick: () => void
}

export function IntegrationEmptyState({ onSetupClick }: IntegrationEmptyStateProps) {
  // Show first 8 providers in a grid
  const displayProviders = MOCK_CMS_PROVIDERS.slice(0, 8)

  return (
    <div className="rounded-xl border border-gray-200 dark:border-polar-800 bg-gray-50 dark:bg-polar-900 p-8 flex flex-col items-center justify-center text-center py-16">
      {/* Icon grid */}
      <div className="flex flex-wrap justify-center gap-3 mb-8 max-w-md">
        {displayProviders.map((provider) => (
          <CMSIcon
            key={provider.id}
            icon={provider.icon}
            name={provider.name}
            className="w-12 h-12 shadow-sm"
          />
        ))}
      </div>
      
      <h3 className="text-lg font-medium mb-2">Connect Your CMS</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        Connect your content management system to start receiving high-quality backlinks from our exchange network.
      </p>
      
      <Button onClick={onSetupClick} className="gap-2">
        <Settings className="h-4 w-4" />
        Set up Integration
      </Button>
    </div>
  )
}
