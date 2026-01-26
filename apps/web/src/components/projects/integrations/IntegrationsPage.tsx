'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { Input } from '@workspace/ui/components/input'
import { Switch } from '@workspace/ui/components/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@workspace/ui/components/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip'
import {
  Plug2,
  Search,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Unplug,
  Settings2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  PROVIDER_METADATA,
  SERVICE_METADATA,
  CATEGORY_LABELS,
  getProvidersByCategory,
  type IntegrationProvider,
  type ProviderCategory,
  type ProviderMetadata,
} from '@/lib/shcmea/types/integration'
import type { IntegrationDetailDto } from '@/lib/shcmea/types/dtos/integration-dto'

// ============================================================
// CONSTANTS
// ============================================================

const CATEGORY_ORDER: ProviderCategory[] = [
  'search',
  'communication',
  'analytics',
  'content',
  'social',
  'seo',
  'ecommerce',
  'advertising',
  'automation',
  'ai',
  'data',
]

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getStatusBadge(status: string) {
  switch (status) {
    case 'ACTIVE':
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 border-0">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Connected
        </Badge>
      )
    case 'EXPIRED':
    case 'ERROR':
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 border-0">
          <AlertCircle className="mr-1 h-3 w-3" />
          {status === 'EXPIRED' ? 'Expired' : 'Error'}
        </Badge>
      )
    case 'REVOKED':
    case 'DISCONNECTED':
      return (
        <Badge variant="outline" className="text-muted-foreground">
          Disconnected
        </Badge>
      )
    default:
      return null
  }
}

function formatDate(dateString: string | null): string {
  if (!dateString) return 'Never'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDateTime(dateString: string | null): string {
  if (!dateString) return 'Never'
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

// ============================================================
// INTEGRATION CARD COMPONENT
// ============================================================

function IntegrationCard({
  provider,
  isConnected,
  isConnecting,
  onConnect,
  onManage,
}: {
  provider: ProviderMetadata
  isConnected: boolean
  isConnecting: boolean
  onConnect: (provider: IntegrationProvider) => void
  onManage: (provider: IntegrationProvider) => void
}) {
  return (
    <div
      className={cn(
        'flex flex-col p-4 rounded-xl border border-border transition-all',
        provider.isAvailable && !isConnected
          ? 'hover:border-foreground/20 hover:shadow-sm'
          : '',
        isConnected ? 'bg-muted/30 border-emerald-200 dark:border-emerald-900' : ''
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="relative h-10 w-10 rounded-lg bg-muted/50 p-2 flex items-center justify-center">
          <Image
            src={provider.icon}
            alt={provider.name}
            width={24}
            height={24}
            className="object-contain"
          />
        </div>
        {isConnected ? (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 border-0 text-xs">
            Connected
          </Badge>
        ) : provider.comingSoon ? (
          <Badge variant="outline" className="text-xs">
            Coming Soon
          </Badge>
        ) : null}
      </div>
      <h4 className="text-sm font-medium mb-1">{provider.name}</h4>
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
        {provider.description}
      </p>
      {isConnected ? (
        <Button
          size="sm"
          variant="outline"
          className="mt-auto"
          onClick={() => onManage(provider.id)}
        >
          <Settings2 className="h-4 w-4 mr-1" />
          Manage
        </Button>
      ) : (
        <Button
          size="sm"
          variant={provider.isAvailable ? 'default' : 'outline'}
          className="mt-auto"
          disabled={!provider.isAvailable || isConnecting}
          onClick={() => onConnect(provider.id)}
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Connecting...
            </>
          ) : provider.isAvailable ? (
            <>
              <Plug2 className="h-4 w-4 mr-1" />
              Connect
            </>
          ) : (
            'Coming Soon'
          )}
        </Button>
      )}
    </div>
  )
}

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================

interface IntegrationsPageProps {
  projectId: string
}

export default function IntegrationsPage({ projectId }: IntegrationsPageProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  // State
  const [integrations, setIntegrations] = useState<IntegrationDetailDto[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [connectedSearchQuery, setConnectedSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationDetailDto | null>(null)
  const [disconnectTarget, setDisconnectTarget] = useState<IntegrationDetailDto | null>(null)
  const [connectingProvider, setConnectingProvider] = useState<IntegrationProvider | null>(null)
  const [activeTab, setActiveTab] = useState<string>('connected')
  const [selectedCategory, setSelectedCategory] = useState<ProviderCategory | 'all'>('all')


  // Loading states for actions
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)

  // Load integrations
  const loadIntegrations = () => {
    setIsLoading(true)
    // TODO: Implement data fetching
    // For now, simulate loading with empty state
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }


  // Load integrations on mount
  useEffect(() => {
    if (projectId) {
      loadIntegrations()
    }
  }, [projectId])

  // Read tab from URL params
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['connected', 'webhooks', 'available'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Handle OAuth callback status from URL params
  useEffect(() => {
    const integration = searchParams.get('integration')
    const status = searchParams.get('status')
    const error = searchParams.get('error')

    if (integration && status === 'connected') {
      toast.success(`${integration.charAt(0).toUpperCase() + integration.slice(1)} connected successfully!`)
      // Clear URL params
      router.replace(`/dashboard/projects/${projectId}/integrations`)
    } else if (error) {
      const errorMessages: Record<string, string> = {
        oauth_failed: 'Failed to connect integration. Please try again.',
        oauth_state_expired: 'Connection timed out. Please try again.',
        project_not_found: 'Project not found or access denied.',
        invalid_oauth_callback: 'Invalid OAuth callback. Please try again.',
        google_oauth_access_denied: 'Google access was denied. Please try again.',
      }
      toast.error(errorMessages[error] || `Connection failed: ${error}`)
      // Clear URL params
      router.replace(`/dashboard/projects/${projectId}/integrations`)
    }
  }, [searchParams, projectId, router])

  // Handlers
  const handleConnect = (provider: IntegrationProvider) => {
    // For webhooks, navigate to the new webhook page
    if (provider === 'WEBHOOK') {
      router.push(`/dashboard/projects/${projectId}/integrations/webhook/new`)
      return
    }

    setConnectingProvider(provider)
    setIsConnecting(true)
    // TODO: Implement connect integration
    toast.info(`Connecting ${provider}...`)
    setTimeout(() => {
      setIsConnecting(false)
      setConnectingProvider(null)
      toast.success('Integration connected successfully!')
    }, 1000)
  }

  const handleDisconnect = (integration: IntegrationDetailDto) => {
    setDisconnectTarget(integration)
  }

  const confirmDisconnect = () => {
    if (disconnectTarget) {
      setIsDisconnecting(true)
      // TODO: Implement disconnect integration
      setTimeout(() => {
        toast.success('Integration disconnected')
        setDisconnectTarget(null)
        setIsDisconnecting(false)
        // Remove from local state
        setIntegrations((prev) => prev.filter((i) => i.id !== disconnectTarget.id))
      }, 500)
    }
  }

  const handleServiceToggle = (serviceId: string, isEnabled: boolean) => {
    // TODO: Implement service toggle
    toast.success(isEnabled ? 'Service enabled' : 'Service disabled')
  }

  const handleWebhookToggle = (integrationId: string, isEnabled: boolean) => {
    // TODO: Implement webhook toggle
    toast.success(isEnabled ? 'Webhook enabled' : 'Webhook disabled')
  }

  // Filter providers by search
  const filterProviders = (providers: ProviderMetadata[]) => {
    if (!searchQuery.trim()) return providers
    const query = searchQuery.toLowerCase()
    return providers.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    )
  }

  // Get connected integrations (all active/error/expired)
  const connectedIntegrations = integrations.filter(
    (i) => i.status === 'ACTIVE' || i.status === 'ERROR' || i.status === 'EXPIRED'
  )

  // Separate webhooks from other integrations
  const webhookIntegrations = connectedIntegrations.filter((i) => i.provider === 'WEBHOOK')
  const nonWebhookIntegrations = connectedIntegrations.filter((i) => i.provider !== 'WEBHOOK')
  const connectedProviderIds = new Set(nonWebhookIntegrations.map((i) => i.provider))

  // Filter connected integrations by search (non-webhook)
  const filteredConnectedIntegrations = nonWebhookIntegrations.filter((integration) => {
    if (!connectedSearchQuery.trim()) return true
    const query = connectedSearchQuery.toLowerCase()
    const provider = PROVIDER_METADATA[integration.provider]
    return (
      provider?.name.toLowerCase().includes(query) ||
      provider?.description.toLowerCase().includes(query) ||
      integration.name?.toLowerCase().includes(query) ||
      integration.providerEmail?.toLowerCase().includes(query)
    )
  })

  // Filter webhooks by search
  const filteredWebhooks = webhookIntegrations.filter((webhook) => {
    if (!connectedSearchQuery.trim()) return true
    const query = connectedSearchQuery.toLowerCase()
    const webhookConfig = webhook.services?.[0]?.config as { url?: string } | undefined
    return (
      webhook.name?.toLowerCase().includes(query) ||
      webhookConfig?.url?.toLowerCase().includes(query)
    )
  })

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="relative flex min-w-0 flex-2 flex-col items-center  md:overflow-y-auto h-full">
      <div className="mx-auto flex w-full flex-col gap-y-6 ">


        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6">
            <TabsList className="bg-transparent ring-0 dark:bg-transparent dark:ring-0 p-1 gap-2 w-max md:w-auto">
              <TabsTrigger
                value="connected"
                className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Connected
                {nonWebhookIntegrations.length > 0 && (
                  <Badge variant="outline" className="ml-2 text-[10px] px-1.5 py-0">
                    {nonWebhookIntegrations.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="webhooks"
                className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Webhooks
                {webhookIntegrations.length > 0 && (
                  <Badge variant="outline" className="ml-2 text-[10px] px-1.5 py-0">
                    {webhookIntegrations.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="available"
                className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Available
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Connected Tab Content */}
          <TabsContent value="connected" className="mt-0">
            <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
              <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-y-1">
                  <span className="text-lg font-semibold">Connected Integrations</span>
                  <p className="text-sm text-muted-foreground">
                    Manage integrations connected to this project.
                  </p>
                </div>
              </div>

              <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
                {/* Search Bar */}
                <div className="px-6 py-4 border-b border-border">
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search connected integrations..."
                      value={connectedSearchQuery}
                      onChange={(e) => setConnectedSearchQuery(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </div>

                {/* Table */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredConnectedIntegrations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    {connectedSearchQuery ? (
                      <>
                        <Search className="h-8 w-8 text-muted-foreground/50 mb-4" />
                        <p className="text-sm text-muted-foreground">No integrations match your search</p>
                        <Button variant="ghost" size="sm" onClick={() => setConnectedSearchQuery('')} className="mt-2">
                          Clear search
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="text-gray-300 dark:text-gray-600 mb-4">
                          <Plug2 className="h-12 w-12" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No integrations connected</h3>
                        <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                          Connect Google Search Console to start tracking your keyword rankings, or browse available integrations.
                        </p>
                        <div className="flex gap-3">
                          <Button onClick={() => handleConnect('GOOGLE')} disabled={connectingProvider === 'GOOGLE'}>
                            {connectingProvider === 'GOOGLE' ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Connecting...
                              </>
                            ) : (
                              <>
                                <Image src="/icons/google.svg" alt="Google" width={16} height={16} className="mr-2" />
                                Connect Google
                              </>
                            )}
                          </Button>
                          <Button variant="outline" onClick={() => setActiveTab('available')}>
                            Browse Available
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Integration
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Services
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Last Synced
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Connected
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredConnectedIntegrations.map((integration) => {
                          const provider = PROVIDER_METADATA[integration.provider]
                          if (!provider) return null

                          const enabledServices = integration.services?.filter((s) => s.isEnabled) || []

                          return (
                            <tr key={integration.id} className="hover:bg-muted/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <div className="relative h-10 w-10 rounded-lg bg-muted/50 p-2 flex items-center justify-center shrink-0">
                                    <Image
                                      src={provider.icon}
                                      alt={provider.name}
                                      width={24}
                                      height={24}
                                      className="object-contain"
                                    />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium">
                                      {provider.name}
                                      {integration.name && integration.name !== 'Default' && (
                                        <span className="text-muted-foreground font-normal"> · {integration.name}</span>
                                      )}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {integration.providerEmail || provider.description}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(integration.status)}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1 max-w-xs">
                                  {enabledServices.length > 0 ? (
                                    enabledServices.slice(0, 3).map((service) => {
                                      const serviceMeta = SERVICE_METADATA[service.service]
                                      return (
                                        <Badge
                                          key={service.id}
                                          variant="secondary"
                                          className="text-xs font-normal"
                                        >
                                          {serviceMeta?.name || service.service}
                                        </Badge>
                                      )
                                    })
                                  ) : (
                                    <span className="text-sm text-muted-foreground">None enabled</span>
                                  )}
                                  {enabledServices.length > 3 && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge variant="outline" className="text-xs font-normal cursor-pointer">
                                          +{enabledServices.length - 3} more
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent side="bottom" className="max-w-xs">
                                        <div className="flex flex-col gap-1">
                                          <span className="text-xs font-medium mb-1">Additional services:</span>
                                          {enabledServices.slice(3).map((service) => {
                                            const serviceMeta = SERVICE_METADATA[service.service]
                                            return (
                                              <span key={service.id} className="text-xs">
                                                • {serviceMeta?.name || service.service}
                                              </span>
                                            )
                                          })}
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-muted-foreground">
                                  {formatDateTime(integration.lastSyncAt)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-muted-foreground">
                                  {formatDate(integration.createdAt)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedIntegration(integration)}
                                  >
                                    <Settings2 className="h-4 w-4 mr-1" />
                                    Settings
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDisconnect(integration)}
                                  >
                                    <Unplug className="h-4 w-4 mr-1" />
                                    Disconnect
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Webhooks Tab Content */}
          <TabsContent value="webhooks" className="mt-0">
            <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
              <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-y-1">
                  <span className="text-lg font-semibold">Webhooks</span>
                  <p className="text-sm text-muted-foreground">
                    Send real-time notifications to external services when events occur.
                  </p>
                </div>
                <Link href={`/dashboard/projects/${projectId}/integrations/webhook/new`}>
                  <Button className="shrink-0">
                    <Plug2 className="h-4 w-4 mr-2" />
                    Add Webhook
                  </Button>
                </Link>
              </div>

              <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
                {/* Search Bar */}
                <div className="px-6 py-4 border-b border-border">
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search webhooks..."
                      value={connectedSearchQuery}
                      onChange={(e) => setConnectedSearchQuery(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </div>

                {/* Webhooks Table */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredWebhooks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    {connectedSearchQuery ? (
                      <>
                        <Search className="h-8 w-8 text-muted-foreground/50 mb-4" />
                        <p className="text-sm text-muted-foreground">No webhooks match your search</p>
                        <Button variant="ghost" size="sm" onClick={() => setConnectedSearchQuery('')} className="mt-2">
                          Clear search
                        </Button>
                      </>
                    ) : (
                      <>
                        <Plug2 className="h-12 w-12 text-muted-foreground/30 mb-4" />
                        <p className="text-sm font-medium text-muted-foreground mb-1">No webhooks configured</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Add a webhook to receive notifications when events occur.
                        </p>
                        <Link href={`/dashboard/projects/${projectId}/integrations/webhook/new`}>
                          <Button variant="outline" size="sm">
                            <Plug2 className="h-4 w-4 mr-2" />
                            Add Your First Webhook
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Webhook
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            URL
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Events
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Last Triggered
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Enabled
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredWebhooks.map((webhook) => {
                          const webhookService = webhook.services?.[0]
                          const webhookConfig = webhookService?.config as { url?: string; events?: string[]; method?: string } | undefined

                          return (
                            <tr key={webhook.id} className="hover:bg-muted/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <div className="relative h-10 w-10 rounded-lg bg-muted/50 p-2 flex items-center justify-center shrink-0">
                                    <Plug2 className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium">{webhook.name || 'Unnamed Webhook'}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {webhookConfig?.method || 'POST'} Request
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(webhook.status)}
                              </td>
                              <td className="px-6 py-4">
                                <code className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded max-w-[200px] truncate block">
                                  {webhookConfig?.url || 'No URL configured'}
                                </code>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="secondary" className="text-xs font-normal">
                                  {webhookConfig?.events?.length || 'All'} events
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-muted-foreground">
                                  {formatDateTime(webhookService?.lastSyncAt || null)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center justify-center">
                                  <Switch
                                    checked={webhook.status === 'ACTIVE' && webhookService?.isEnabled !== false}
                                    onCheckedChange={(checked) => {
                                      handleWebhookToggle(webhook.id, checked)
                                    }}
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                  >
                                    <Link href={`/dashboard/projects/${projectId}/integrations/webhook/${webhook.id}`}>
                                      <Settings2 className="h-4 w-4 mr-1" />
                                      Settings
                                    </Link>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDisconnect(webhook)}
                                  >
                                    <Unplug className="h-4 w-4 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Available Tab Content */}
          <TabsContent value="available" className="mt-0">
            <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
              <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-y-1">
                  <span className="text-lg font-semibold">Available Integrations</span>
                  <p className="text-sm text-muted-foreground">
                    Browse and connect services to enhance your SEO workflow.
                  </p>
                </div>
              </div>

              <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
                {/* Search Bar + Category Filter */}
                <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search integrations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => setSelectedCategory(value as ProviderCategory | 'all')}
                  >
                    <SelectTrigger className="w-[180px] h-9">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {CATEGORY_ORDER.map((category) => {
                        const categoryProviders = getProvidersByCategory(category)
                        if (categoryProviders.length === 0) return null
                        return (
                          <SelectItem key={category} value={category}>
                            {CATEGORY_LABELS[category]}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Integrations Grid */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="p-6">
                    {(() => {
                      // Get providers based on selected category (exclude WEBHOOK - has its own tab)
                      const categoriesToShow = selectedCategory === 'all' ? CATEGORY_ORDER : [selectedCategory]
                      const allProviders = categoriesToShow
                        .flatMap((cat) => filterProviders(getProvidersByCategory(cat)))
                        .filter((p) => p.id !== 'WEBHOOK')

                      if (allProviders.length === 0) {
                        return (
                          <div className="flex flex-col items-center justify-center py-16">
                            <Search className="h-8 w-8 text-muted-foreground/50 mb-4" />
                            <p className="text-sm text-muted-foreground">No integrations match your search</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSearchQuery('')
                                setSelectedCategory('all')
                              }}
                              className="mt-2"
                            >
                              Clear filters
                            </Button>
                          </div>
                        )
                      }

                      // If showing all categories, group by category
                      if (selectedCategory === 'all') {
                        return (
                          <div className="space-y-8">
                            {CATEGORY_ORDER.map((category) => {
                              const categoryProviders = filterProviders(getProvidersByCategory(category))
                                .filter((p) => p.id !== 'WEBHOOK') // Exclude WEBHOOK - has its own tab
                              if (categoryProviders.length === 0) return null

                              return (
                                <div key={category}>
                                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                                    {CATEGORY_LABELS[category]}
                                  </h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {categoryProviders.map((provider) => (
                                      <IntegrationCard
                                        key={provider.id}
                                        provider={provider}
                                        isConnected={connectedProviderIds.has(provider.id)}
                                        isConnecting={connectingProvider === provider.id && isConnecting}
                                        onConnect={handleConnect}
                                        onManage={(providerId) => {
                                          const integration = connectedIntegrations.find((i) => i.provider === providerId)
                                          if (integration) setSelectedIntegration(integration)
                                        }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )
                      }

                      // Single category view - flat grid
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {allProviders.map((provider) => (
                            <IntegrationCard
                              key={provider.id}
                              provider={provider}
                              isConnected={connectedProviderIds.has(provider.id)}
                              isConnecting={connectingProvider === provider.id && isConnecting}
                              onConnect={handleConnect}
                              onManage={(providerId) => {
                                const integration = connectedIntegrations.find((i) => i.provider === providerId)
                                if (integration) setSelectedIntegration(integration)
                              }}
                            />
                          ))}
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Integration Settings Sheet */}
      <Sheet open={selectedIntegration !== null} onOpenChange={(open) => !open && setSelectedIntegration(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selectedIntegration && (() => {
            const providerMeta = PROVIDER_METADATA[selectedIntegration.provider]
            const providerIcon = providerMeta?.icon || '/icons/default.svg'
            return (
            <>
              <SheetHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-lg bg-muted/50 p-2 flex items-center justify-center shrink-0">
                    <Image
                      src={providerIcon}
                      alt={providerMeta?.name || 'Integration'}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <SheetTitle>
                      {providerMeta?.name || 'Integration'} Settings
                      {selectedIntegration.name && selectedIntegration.name !== 'Default' && (
                        <span className="text-muted-foreground font-normal text-sm"> · {selectedIntegration.name}</span>
                      )}
                    </SheetTitle>
                    <SheetDescription>
                      {selectedIntegration.providerEmail || providerMeta?.description}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex flex-col gap-6 mt-6">
                {/* Status */}
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-sm font-medium">Status</span>
                  {getStatusBadge(selectedIntegration.status)}
                </div>

                {/* Last Synced */}
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-sm font-medium">Last Synced</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDateTime(selectedIntegration.lastSyncAt)}
                  </span>
                </div>

                {/* Connected */}
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-sm font-medium">Connected</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(selectedIntegration.createdAt)}
                  </span>
                </div>

                {/* Services */}
                {selectedIntegration.services && selectedIntegration.services.length > 0 && (
                  <div className="flex flex-col gap-4">
                    <h4 className="text-sm font-medium">Services</h4>
                    <div className="flex flex-col gap-3">
                      {selectedIntegration.services.map((service) => {
                        const serviceMeta = SERVICE_METADATA[service.service]
                        if (!serviceMeta) return null

                        return (
                          <div
                            key={service.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative h-8 w-8 rounded bg-background p-1.5 flex items-center justify-center shrink-0">
                                <Image
                                  src={providerIcon}
                                  alt={serviceMeta.name}
                                  width={16}
                                  height={16}
                                  className="object-contain"
                                />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-sm font-medium">{serviceMeta.name}</span>
                                <span className="text-xs text-muted-foreground truncate">{serviceMeta.description}</span>
                              </div>
                            </div>
                            <Switch
                              checked={service.isEnabled}
                              onCheckedChange={(checked) => handleServiceToggle(service.id, checked)}
                              disabled={!serviceMeta.isAvailable}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedIntegration(null)
                      handleDisconnect(selectedIntegration)
                    }}
                  >
                    <Unplug className="h-4 w-4 mr-2" />
                    Disconnect Integration
                  </Button>
                </div>
              </div>
            </>
            )
          })()}
        </SheetContent>
      </Sheet>

      {/* Disconnect Confirmation Dialog */}
      <AlertDialog open={disconnectTarget !== null} onOpenChange={(open) => !open && setDisconnectTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Integration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disconnect {PROVIDER_METADATA[disconnectTarget?.provider as IntegrationProvider]?.name || 'this integration'}?
              You will need to reconnect and reauthorize to use it again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDisconnect}
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={isDisconnecting}
            >
              {isDisconnecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                'Disconnect'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}
