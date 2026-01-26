'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { ArrowLeft, Loader2, CheckCircle2, XCircle, Clock, Send, Pencil } from 'lucide-react'
import type { IntegrationDetailDto } from '@/lib/shcmea/types/dtos/integration-dto'
import type { WebhookServiceConfig, WebhookExecution } from '@/lib/shcmea/types/integration'
import { Button } from '@workspace/ui/components/button'
import { Switch } from '@workspace/ui/components/switch'
import { Label } from '@workspace/ui/components/label'
import { Badge } from '@workspace/ui/components/badge'

function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="relative flex flex-col gap-12 p-12">
      <div className="flex w-full flex-col gap-y-6">
        <div className="flex flex-col gap-y-2">
          <h2 className="text-lg font-medium">{title}</h2>
          <p className="leading-snug text-gray-500 dark:text-polar-500">
            {description}
          </p>
        </div>
      </div>
      {children}
    </div>
  )
}

interface WebhookDetailPageProps {
  projectId: string
  webhookId: string
}

export default function WebhookDetailPage({ projectId, webhookId }: WebhookDetailPageProps) {
  const router = useRouter()

  const [webhook, setWebhook] = useState<IntegrationDetailDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [executionHistory, setExecutionHistory] = useState<WebhookExecution[]>([])
  const [historyTotal, setHistoryTotal] = useState(0)
  const [isTesting, setIsTesting] = useState(false)

  // Load webhook data
  const loadWebhook = () => {
    setIsLoading(true)
    // TODO: Implement data fetching
    // Simulate loading with mock data
    setTimeout(() => {
      // Mock webhook data for now
      setWebhook({
        id: webhookId,
        projectId,
        provider: 'WEBHOOK',
        name: 'Sample Webhook',
        status: 'ACTIVE',
        providerAccountId: null,
        providerEmail: null,
        tokenScope: [],
        services: [{
          id: 'service-1',
          integrationId: webhookId,
          service: 'CUSTOM_WEBHOOK' as const,
          status: 'ACTIVE' as const,
          isEnabled: true,
          lastSyncAt: null,
          lastSyncStatus: null,
          lastError: null,
          syncCount: 0,
          usageThisMonth: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          config: {
            url: 'https://example.com/webhook',
            method: 'POST',
            authType: 'none',
            events: ['audit.completed', 'page.analyzed'],
          },
        }],
        lastSyncAt: null,
        lastError: null,
        errorCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      setIsLoading(false)
    }, 500)
  }

  // Load execution history
  const loadHistory = () => {
    // TODO: Implement history fetching
    setExecutionHistory([])
    setHistoryTotal(0)
  }

  // Test webhook handler
  const handleTestWebhook = () => {
    setIsTesting(true)
    // TODO: Implement test webhook
    setTimeout(() => {
      toast.success('Test webhook sent successfully!')
      setIsTesting(false)
    }, 1000)
  }

  // Toggle webhook handler
  const handleToggleWebhook = (enabled: boolean) => {
    // TODO: Implement toggle webhook
    toast.success(enabled ? 'Webhook enabled' : 'Webhook disabled')
    if (webhook) {
      setWebhook({
        ...webhook,
        status: enabled ? 'ACTIVE' : 'DISCONNECTED',
      })
    }
  }

  // Load webhook on mount
  useEffect(() => {
    if (webhookId) {
      loadWebhook()
      loadHistory()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webhookId])

  if (isLoading) {
    return (
      <div className="relative flex min-w-0 flex-2 flex-col items-center rounded-2xl border-gray-200 dark:border-polar-800 px-4 md:overflow-y-auto md:border md:bg-white dark:md:bg-polar-900 md:px-8 md:shadow-xs">
        <div className="flex h-full w-full flex-col items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">Loading webhook...</p>
        </div>
      </div>
    )
  }

  if (!webhook) {
    return null
  }

  const webhookService = webhook.services?.[0]
  const webhookConfig = webhookService?.config as WebhookServiceConfig | undefined

  const isEnabled = webhook.status === 'ACTIVE' && webhookService?.isEnabled !== false

  return (
    <div className="relative flex min-w-0 flex-2 flex-col items-center rounded-2xl border-gray-200 dark:border-polar-800 px-4 md:overflow-y-auto md:border md:bg-white dark:md:bg-polar-900 md:px-8 md:shadow-xs">
      <div className="flex h-full w-full flex-col max-w-3xl">
        {/* Header */}
        <div className="flex flex-col gap-y-4 py-8 md:flex-row md:items-center md:justify-between md:gap-x-4 md:py-8">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/projects/${projectId}/integrations?tab=webhooks`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h4 className="text-2xl font-medium whitespace-nowrap dark:text-white">
                {webhook.name || 'Unnamed Webhook'}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {webhookConfig?.url || 'No URL configured'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="webhook-toggle" className="text-sm">
                {isEnabled ? 'Enabled' : 'Disabled'}
              </Label>
              <Switch
                id="webhook-toggle"
                checked={isEnabled}
                onCheckedChange={(checked) => {
                  handleToggleWebhook(checked)
                }}
              />
            </div>
            <Button
              onClick={handleTestWebhook}
              disabled={isTesting || !isEnabled}
              variant="outline"
            >
              {isTesting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Test Webhook
                </>
              )}
            </Button>
            <Button asChild>
              <Link href={`/dashboard/projects/${projectId}/integrations/webhook/${webhookId}/edit`}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex w-full flex-col pb-8 gap-y-16">
          {/* Webhook Configuration */}
          <div className="dark:border-polar-700 dark:divide-polar-700 flex flex-col divide-y divide-gray-200 rounded-4xl border border-gray-200">
            <FormSection
              title="Configuration"
              description="Webhook endpoint configuration and settings"
            >
              <div className="flex w-full flex-col gap-y-6">
                <div className="space-y-2">
                  <Label>Webhook URL</Label>
                  <code className="block text-sm bg-muted/50 px-3 py-2 rounded-lg break-all">
                    {webhookConfig?.url || 'Not configured'}
                  </code>
                </div>

                <div className="space-y-2">
                  <Label>HTTP Method</Label>
                  <Badge variant="outline">{webhookConfig?.method || 'POST'}</Badge>
                </div>

                <div className="space-y-2">
                  <Label>Authentication</Label>
                  <Badge variant="outline" className="capitalize">
                    {webhookConfig?.authType === 'none' ? 'None' :
                     webhookConfig?.authType === 'api_key' ? 'API Key' :
                     webhookConfig?.authType === 'basic_auth' ? 'Basic Auth' :
                     webhookConfig?.authType === 'oauth_bearer' ? 'OAuth Bearer' :
                     webhookConfig?.authType === 'oauth_client_credentials' ? 'OAuth Client Credentials' :
                     'None'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label>Events</Label>
                  <div className="flex flex-wrap gap-2">
                    {webhookConfig?.events && webhookConfig.events.length > 0 ? (
                      webhookConfig.events.map((event) => (
                        <Badge key={event} variant="secondary">
                          {event}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No events configured</span>
                    )}
                  </div>
                </div>
              </div>
            </FormSection>
          </div>

          {/* Execution History */}
          <div className="dark:border-polar-700 dark:divide-polar-700 flex flex-col divide-y divide-gray-200 rounded-4xl border border-gray-200">
            <FormSection
              title="Execution History"
              description={`${historyTotal} total executions`}
            >
              <div className="flex w-full flex-col gap-y-4">
                {executionHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Clock className="h-8 w-8 text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">No execution history yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Test the webhook to see execution history
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Event
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Time
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Duration
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Response
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {executionHistory.map((execution) => (
                          <tr key={execution.id} className="hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap">
                              {execution.success ? (
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  <span className="text-sm font-medium text-green-600">Success</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <XCircle className="h-4 w-4 text-red-600" />
                                  <span className="text-sm font-medium text-red-600">Failed</span>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="text-sm text-muted-foreground">
                                {execution.event || 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="text-sm text-muted-foreground">
                                {new Date(execution.timestamp).toLocaleString()}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="text-sm text-muted-foreground">
                                {execution.duration}ms
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {execution.statusCode ? (
                                <Badge 
                                  variant={execution.statusCode >= 200 && execution.statusCode < 300 ? 'default' : 'outline'}
                                  className={execution.statusCode >= 200 && execution.statusCode < 300 ? '' : 'text-red-600 border-red-300 bg-red-50 dark:bg-red-950/30'}
                                >
                                  {execution.statusCode}
                                </Badge>
                              ) : execution.errorMessage ? (
                                <span className="text-xs text-red-600 truncate max-w-[200px] block" title={execution.errorMessage}>
                                  {execution.errorMessage}
                                </span>
                              ) : (
                                <span className="text-sm text-muted-foreground">N/A</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </FormSection>
          </div>
        </div>
      </div>
    </div>
  )
}
