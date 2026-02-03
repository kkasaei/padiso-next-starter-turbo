'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@workspace/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@workspace/ui/components/dialog'
import { Send, ArrowRight, Check, ExternalLink } from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'
import { toast } from 'sonner'
import { useIntegrations } from '@/hooks/use-integrations'

// CMS providers that support publishing content
const CMS_PUBLISH_PROVIDERS = [
  { id: 'wordpress', name: 'WordPress', description: 'Publish to WordPress', icon: 'wordpress', popular: true },
  { id: 'shopify', name: 'Shopify', description: 'Sync with Shopify blog', icon: 'shopify_glyph_black', popular: true },
  { id: 'webflow', name: 'Webflow', description: 'Connect Webflow CMS', icon: 'webflow', popular: true },
  { id: 'notion', name: 'Notion', description: 'Connect your Notion workspace', icon: 'notion', popular: true },
  { id: 'ghost', name: 'Ghost', description: 'Headless CMS integration', icon: 'ghost', popular: false },
  { id: 'contentful', name: 'Contentful', description: 'Enterprise headless CMS', icon: 'contentful', popular: false },
  { id: 'sanity', name: 'Sanity', description: 'Real-time content platform', icon: 'sanity', popular: false },
  { id: 'strapi', name: 'Strapi', description: 'Open-source headless CMS', icon: 'strapi', popular: false },
] as const

// Mock connected integrations for development/testing
const MOCK_CONNECTED_INTEGRATIONS = [
  { id: 'mock-wordpress-1', type: 'wordpress' },
  { id: 'mock-webflow-1', type: 'webflow' },
]

// CMS Icon Component
function CMSIcon({ icon, name, className }: { icon: string; name: string; className?: string }) {
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

type PublishModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  brandId: string
}

export function PublishModal({ open, onOpenChange, brandId }: PublishModalProps) {
  const { data: connectedIntegrations, isLoading } = useIntegrations(brandId)
  
  // Filter to only CMS integrations that support publishing
  const realCmsIntegrations = connectedIntegrations?.filter(integration => 
    CMS_PUBLISH_PROVIDERS.some(provider => provider.id === integration.type)
  ) || []
  
  // Use mock integrations if no real ones exist (for development/testing)
  const cmsIntegrations = realCmsIntegrations.length > 0 
    ? realCmsIntegrations 
    : MOCK_CONNECTED_INTEGRATIONS
  
  const hasConnectedCMS = cmsIntegrations.length > 0

  if (isLoading) {
    return null
  }

  if (hasConnectedCMS) {
    return (
      <IntegrationSelectModal
        open={open}
        onOpenChange={onOpenChange}
        connectedIntegrations={cmsIntegrations}
        brandId={brandId}
      />
    )
  }

  return (
    <IntegrationSetupModal
      open={open}
      onOpenChange={onOpenChange}
      brandId={brandId}
    />
  )
}

// Integration Selection Modal - shown when user has connected integrations
type IntegrationSelectModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  connectedIntegrations: Array<{ id: string; type: string }>
  brandId: string
}

function IntegrationSelectModal({
  open,
  onOpenChange,
  connectedIntegrations,
  brandId,
}: IntegrationSelectModalProps) {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)
  
  // Get CMS providers that are connected
  const connectedCMSProviders = CMS_PUBLISH_PROVIDERS.filter(provider => 
    connectedIntegrations.some(integration => integration.type === provider.id)
  )

  const handlePublish = async () => {
    if (!selectedId) return
    
    const provider = CMS_PUBLISH_PROVIDERS.find(p => p.id === selectedId)
    const providerName = provider?.name || 'CMS'
    
    setIsPublishing(true)
    try {
      // TODO: Implement actual publish logic
      console.log('Publishing to:', selectedId)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success toast
      toast('Article published', {
        description: `Successfully published to ${providerName}`,
      })
      
      onOpenChange(false)
      setSelectedId(null)
    } catch {
      // Show error toast
      toast('Failed to publish', {
        description: `Could not publish to ${providerName}. Please try again.`,
      })
    } finally {
      setIsPublishing(false)
    }
  }

  const handleGoToIntegrations = () => {
    router.push(`/dashboard/brands/${brandId}/settings?tab=integrations`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Publish Article</DialogTitle>
          <DialogDescription>
            Select where you&apos;d like to publish this content.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {connectedCMSProviders.map((provider) => {
              const isSelected = selectedId === provider.id
              return (
                <button
                  key={provider.id}
                  onClick={() => setSelectedId(provider.id)}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl border w-full text-left transition-all',
                    isSelected
                      ? 'border-foreground bg-foreground/5'
                      : 'border-gray-200 dark:border-polar-800 hover:border-gray-300 dark:hover:border-polar-700'
                  )}
                >
                  {/* Checkbox indicator */}
                  <div className={cn(
                    'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all',
                    isSelected
                      ? 'bg-foreground border-foreground'
                      : 'border-gray-300 dark:border-polar-600'
                  )}>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-background" strokeWidth={3} />
                    )}
                  </div>
                  <CMSIcon icon={provider.icon} name={provider.name} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{provider.name}</span>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        Connected
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{provider.description}</span>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={handlePublish}
              disabled={!selectedId || isPublishing}
              className="w-full gap-2"
            >
              {isPublishing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Publishing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Publish to {selectedId ? connectedCMSProviders.find(p => p.id === selectedId)?.name : 'CMS'}
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleGoToIntegrations}
              disabled={isPublishing}
              className="w-full gap-2"
            >
              Need more integrations?
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPublishing}
              className="w-full text-muted-foreground"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Integration Setup Modal - shown when user has no connected integrations
function IntegrationSetupModal({
  open,
  onOpenChange,
  brandId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  brandId: string
}) {
  const router = useRouter()

  const handleGoToSettings = () => {
    router.push(`/dashboard/brands/${brandId}/settings?tab=integrations`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Connect Your CMS</DialogTitle>
          <DialogDescription>
            Connect your content management system to start publishing content automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Provider Grid - 2 columns */}
          <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
            {CMS_PUBLISH_PROVIDERS.map((provider) => (
              <div
                key={provider.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-polar-800"
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
              I&apos;ll do this later
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
