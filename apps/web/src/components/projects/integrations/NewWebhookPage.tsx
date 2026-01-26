'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Search, Send } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Checkbox } from '@workspace/ui/components/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import { Label } from '@workspace/ui/components/label'

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

interface NewWebhookPageProps {
  projectId: string
}

export default function NewWebhookPage({ projectId }: NewWebhookPageProps) {
  const router = useRouter()

  const [webhookForm, setWebhookForm] = useState({
    name: '',
    url: '',
    method: 'POST' as 'POST' | 'PUT',
    events: ['mention.new', 'report.generated'] as string[],
    authType: 'none' as 'none' | 'api_key' | 'basic_auth' | 'oauth_bearer' | 'oauth_client_credentials',
    apiKey: '',
    apiKeyHeader: 'Authorization',
    basicAuthUsername: '',
    basicAuthPassword: '',
    oauthBearerToken: '',
    oauthClientId: '',
    oauthClientSecret: '',
    oauthTokenUrl: '',
    oauthScope: '',
  })

  const [eventSearchQuery, setEventSearchQuery] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isTesting, setIsTesting] = useState(false)

  const handleTestWebhook = () => {
    if (!webhookForm.url.trim()) {
      toast.error('Please enter a webhook URL first')
      return
    }

    // Validate auth fields before testing
    if (webhookForm.authType === 'api_key' && !webhookForm.apiKey?.trim()) {
      toast.error('API Key is required for API Key authentication')
      return
    }
    if (webhookForm.authType === 'basic_auth' && (!webhookForm.basicAuthUsername?.trim() || !webhookForm.basicAuthPassword?.trim())) {
      toast.error('Username and password are required for Basic Auth')
      return
    }
    if (webhookForm.authType === 'oauth_bearer' && !webhookForm.oauthBearerToken?.trim()) {
      toast.error('OAuth Bearer Token is required')
      return
    }
    if (webhookForm.authType === 'oauth_client_credentials') {
      if (!webhookForm.oauthClientId?.trim() || !webhookForm.oauthClientSecret?.trim() || !webhookForm.oauthTokenUrl?.trim()) {
        toast.error('Client ID, Client Secret, and Token URL are required for OAuth Client Credentials')
        return
      }
    }

    // TODO: Implement test webhook
    setIsTesting(true)
    setTimeout(() => {
      toast.success('Test webhook sent successfully!')
      setIsTesting(false)
    }, 1000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!webhookForm.name.trim() || !webhookForm.url.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    if (webhookForm.events.length === 0) {
      toast.error('Please select at least one event')
      return
    }

    // Validate auth fields
    if (webhookForm.authType === 'api_key' && !webhookForm.apiKey?.trim()) {
      toast.error('API Key is required for API Key authentication')
      return
    }
    if (webhookForm.authType === 'basic_auth' && (!webhookForm.basicAuthUsername?.trim() || !webhookForm.basicAuthPassword?.trim())) {
      toast.error('Username and password are required for Basic Auth')
      return
    }
    if (webhookForm.authType === 'oauth_bearer' && !webhookForm.oauthBearerToken?.trim()) {
      toast.error('OAuth Bearer Token is required')
      return
    }
    if (webhookForm.authType === 'oauth_client_credentials') {
      if (!webhookForm.oauthClientId?.trim() || !webhookForm.oauthClientSecret?.trim() || !webhookForm.oauthTokenUrl?.trim()) {
        toast.error('Client ID, Client Secret, and Token URL are required for OAuth Client Credentials')
        return
      }
    }

    // TODO: Implement create webhook
    setIsCreating(true)
    setTimeout(() => {
      toast.success(`Webhook "${webhookForm.name}" created successfully!`)
      setIsCreating(false)
      router.push(`/dashboard/projects/${projectId}/integrations?tab=webhooks`)
    }, 1000)
  }

  return (
    <div className="relative flex min-w-0 flex-2 flex-col items-center rounded-2xl border-gray-200 dark:border-polar-800 px-4 md:overflow-y-auto md:border md:bg-white dark:md:bg-polar-900 md:px-8 md:shadow-xs">
      <div className="flex h-full w-full flex-col max-w-3xl">
        {/* Header */}
        <div className="flex flex-col gap-y-4 py-8 md:flex-row md:items-center md:justify-between md:gap-x-4 md:py-8">
          <h4 className="text-2xl font-medium whitespace-nowrap dark:text-white">
            Create Webhook
          </h4>
        </div>

        {/* Main Content */}
        <div className="flex w-full flex-col pb-8 gap-y-16">
          <div className="dark:border-polar-700 dark:divide-polar-700 flex flex-col divide-y divide-gray-200 rounded-4xl border border-gray-200">
            <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
              <div className="dark:divide-polar-700 flex flex-col divide-y">
                {/* Basic Information Section */}
                <FormSection
                  title="Basic Information"
                  description="Configure the basic settings for your webhook endpoint"
                >
                  <div className="flex w-full flex-col gap-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="webhook-name">Name</Label>
                      </div>
                      <div className="relative flex flex-1 flex-row rounded-full">
                        <Input
                          id="webhook-name"
                          name="name"
                          value={webhookForm.name}
                          onChange={(e) => setWebhookForm((f) => ({ ...f, name: e.target.value }))}
                          className="h-10 rounded-lg"
                          placeholder="e.g., Production Webhook"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        A friendly name to identify this webhook
                      </p>
                    </div>

                    {/* Webhook URL Field */}
                    <div className="space-y-2">
                      <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="webhook-url">Webhook URL</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleTestWebhook}
                          disabled={isTesting || !webhookForm.url.trim()}
                          className="h-8"
                        >
                          {isTesting ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                              Testing...
                            </>
                          ) : (
                            <>
                              <Send className="h-3 w-3 mr-1.5" />
                              Test
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="relative flex flex-1 flex-row rounded-full">
                        <Input
                          id="webhook-url"
                          name="url"
                          type="url"
                          value={webhookForm.url}
                          onChange={(e) => setWebhookForm((f) => ({ ...f, url: e.target.value }))}
                          className="h-10 rounded-lg"
                          placeholder="https://your-server.com/webhook"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        The URL where we&apos;ll send webhook requests
                      </p>
                    </div>

                    {/* HTTP Method Field */}
                    <div className="space-y-2">
                      <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="webhook-method">HTTP Method</Label>
                      </div>
                      <Select
                        value={webhookForm.method}
                        onValueChange={(value: 'POST' | 'PUT') => setWebhookForm((f) => ({ ...f, method: value }))}
                      >
                        <SelectTrigger id="webhook-method" className="h-10 rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </FormSection>

                {/* Authentication Section */}
                <FormSection
                  title="Authentication"
                  description="Configure authentication for your webhook endpoint to ensure secure delivery"
                >
                  <div className="flex w-full flex-col gap-y-6">
                    <div className="space-y-2">
                      <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="auth-type">Authentication Type</Label>
                      </div>
                      <Select
                        value={webhookForm.authType}
                        onValueChange={(value: 'none' | 'api_key' | 'basic_auth' | 'oauth_bearer' | 'oauth_client_credentials') => {
                          setWebhookForm((f) => ({
                            ...f,
                            authType: value,
                            // Clear auth fields when switching auth types
                            apiKey: value !== 'api_key' ? '' : f.apiKey,
                            basicAuthUsername: value !== 'basic_auth' ? '' : f.basicAuthUsername,
                            basicAuthPassword: value !== 'basic_auth' ? '' : f.basicAuthPassword,
                            oauthBearerToken: value !== 'oauth_bearer' ? '' : f.oauthBearerToken,
                            oauthClientId: value !== 'oauth_client_credentials' ? '' : f.oauthClientId,
                            oauthClientSecret: value !== 'oauth_client_credentials' ? '' : f.oauthClientSecret,
                            oauthTokenUrl: value !== 'oauth_client_credentials' ? '' : f.oauthTokenUrl,
                            oauthScope: value !== 'oauth_client_credentials' ? '' : f.oauthScope,
                          }))
                        }}
                      >
                        <SelectTrigger id="auth-type" className="h-10 rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="api_key">API Key / Bearer Token</SelectItem>
                          <SelectItem value="basic_auth">Basic Authentication</SelectItem>
                          <SelectItem value="oauth_bearer">OAuth 2.0 Bearer Token</SelectItem>
                          <SelectItem value="oauth_client_credentials">OAuth 2.0 Client Credentials</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* API Key Auth Fields */}
                    {webhookForm.authType === 'api_key' && (
                      <div className="flex flex-col gap-4 rounded-lg border p-4 bg-muted/30">
                        <div className="space-y-2">
                          <div className="flex flex-row items-center justify-between">
                            <Label htmlFor="api-key-header">Header Name</Label>
                          </div>
                          <Input
                            id="api-key-header"
                            placeholder="Authorization"
                            value={webhookForm.apiKeyHeader}
                            onChange={(e) => setWebhookForm((f) => ({ ...f, apiKeyHeader: e.target.value }))}
                            className="h-10 rounded-lg"
                          />
                          <p className="text-xs text-muted-foreground">
                            Header name for the API key (e.g., Authorization, X-API-Key)
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-row items-center justify-between">
                            <Label htmlFor="api-key">API Key / Token</Label>
                          </div>
                          <Input
                            id="api-key"
                            type="password"
                            placeholder="Bearer your-api-key-here or your-api-key-here"
                            value={webhookForm.apiKey}
                            onChange={(e) => setWebhookForm((f) => ({ ...f, apiKey: e.target.value }))}
                            className="h-10 rounded-lg"
                          />
                          <p className="text-xs text-muted-foreground">
                            Your API key or bearer token. Include &quot;Bearer &quot; prefix if needed.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Basic Auth Fields */}
                    {webhookForm.authType === 'basic_auth' && (
                      <div className="flex flex-col gap-4 rounded-lg border p-4 bg-muted/30">
                        <div className="space-y-2">
                          <div className="flex flex-row items-center justify-between">
                            <Label htmlFor="basic-auth-username">Username</Label>
                          </div>
                          <Input
                            id="basic-auth-username"
                            placeholder="username"
                            value={webhookForm.basicAuthUsername}
                            onChange={(e) => setWebhookForm((f) => ({ ...f, basicAuthUsername: e.target.value }))}
                            className="h-10 rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-row items-center justify-between">
                            <Label htmlFor="basic-auth-password">Password</Label>
                          </div>
                          <Input
                            id="basic-auth-password"
                            type="password"
                            placeholder="password"
                            value={webhookForm.basicAuthPassword}
                            onChange={(e) => setWebhookForm((f) => ({ ...f, basicAuthPassword: e.target.value }))}
                            className="h-10 rounded-lg"
                          />
                        </div>
                      </div>
                    )}

                    {/* OAuth Bearer Token Fields */}
                    {webhookForm.authType === 'oauth_bearer' && (
                      <div className="flex flex-col gap-4 rounded-lg border p-4 bg-muted/30">
                        <div className="space-y-2">
                          <div className="flex flex-row items-center justify-between">
                            <Label htmlFor="oauth-bearer-token">OAuth Bearer Token</Label>
                          </div>
                          <Input
                            id="oauth-bearer-token"
                            type="password"
                            placeholder="your-oauth-access-token"
                            value={webhookForm.oauthBearerToken}
                            onChange={(e) => setWebhookForm((f) => ({ ...f, oauthBearerToken: e.target.value }))}
                            className="h-10 rounded-lg"
                          />
                          <p className="text-xs text-muted-foreground">
                            OAuth 2.0 access token. Will be sent as &quot;Authorization: Bearer &lt;token&gt;&quot; header.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* OAuth Client Credentials Fields */}
                    {webhookForm.authType === 'oauth_client_credentials' && (
                      <div className="flex flex-col gap-4 rounded-lg border p-4 bg-muted/30">
                        <div className="space-y-2">
                          <div className="flex flex-row items-center justify-between">
                            <Label htmlFor="oauth-client-id">Client ID</Label>
                          </div>
                          <Input
                            id="oauth-client-id"
                            placeholder="your-client-id"
                            value={webhookForm.oauthClientId}
                            onChange={(e) => setWebhookForm((f) => ({ ...f, oauthClientId: e.target.value }))}
                            className="h-10 rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-row items-center justify-between">
                            <Label htmlFor="oauth-client-secret">Client Secret</Label>
                          </div>
                          <Input
                            id="oauth-client-secret"
                            type="password"
                            placeholder="your-client-secret"
                            value={webhookForm.oauthClientSecret}
                            onChange={(e) => setWebhookForm((f) => ({ ...f, oauthClientSecret: e.target.value }))}
                            className="h-10 rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-row items-center justify-between">
                            <Label htmlFor="oauth-token-url">Token URL</Label>
                          </div>
                          <Input
                            id="oauth-token-url"
                            type="url"
                            placeholder="https://oauth.example.com/token"
                            value={webhookForm.oauthTokenUrl}
                            onChange={(e) => setWebhookForm((f) => ({ ...f, oauthTokenUrl: e.target.value }))}
                            className="h-10 rounded-lg"
                          />
                          <p className="text-xs text-muted-foreground">
                            OAuth 2.0 token endpoint URL for client credentials flow
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-row items-center justify-between">
                            <Label htmlFor="oauth-scope">Scope (Optional)</Label>
                          </div>
                          <Input
                            id="oauth-scope"
                            placeholder="read write"
                            value={webhookForm.oauthScope}
                            onChange={(e) => setWebhookForm((f) => ({ ...f, oauthScope: e.target.value }))}
                            className="h-10 rounded-lg"
                          />
                          <p className="text-xs text-muted-foreground">
                            Space-separated OAuth scopes (optional)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </FormSection>

                {/* Events Section */}
                <FormSection
                  title="Events"
                  description="Select which events should trigger this webhook"
                >
                  <div className="flex w-full flex-col gap-y-6">
                    {/* Search Input */}
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Search events..."
                          value={eventSearchQuery}
                          onChange={(e) => setEventSearchQuery(e.target.value)}
                          className="h-10 rounded-lg pl-9"
                        />
                      </div>
                    </div>

                    {/* Events List */}
                    <div className="flex flex-col gap-4 rounded-lg border p-4">
                      {(() => {
                        const eventGroups = [
                          {
                            category: 'Mentions & Visibility',
                            events: [
                              { value: 'mention.new', label: 'New Mention', description: 'When a new AI mention is detected' },
                              { value: 'mention.position_change', label: 'Position Change', description: 'When mention position changes' },
                              { value: 'competitor.new', label: 'New Competitor', description: 'When a new competitor is detected' },
                              { value: 'keyword.ranking_change', label: 'Keyword Ranking Change', description: 'When keyword rankings change' },
                            ],
                          },
                          {
                            category: 'Opportunities',
                            events: [
                              { value: 'opportunity.created', label: 'Opportunity Created', description: 'When a new opportunity is created' },
                              { value: 'opportunity.updated', label: 'Opportunity Updated', description: 'When an opportunity is updated' },
                            ],
                          },
                          {
                            category: 'Content',
                            events: [
                              { value: 'content.created', label: 'Content Created', description: 'When new content is created' },
                              { value: 'content.approved', label: 'Content Approved', description: 'When content is approved for publishing' },
                              { value: 'content.published', label: 'Content Published', description: 'When content is published' },
                              { value: 'content.status_changed', label: 'Content Status Changed', description: 'When content status changes' },
                            ],
                          },
                          {
                            category: 'Reports',
                            events: [
                              { value: 'report.generated', label: 'Report Generated', description: 'When an AEO report is generated' },
                            ],
                          },
                        ]

                        // Filter events based on search query
                        const filteredGroups = eventGroups
                          .map((group) => {
                            const filteredEvents = group.events.filter((event) => {
                              if (!eventSearchQuery.trim()) return true
                              const query = eventSearchQuery.toLowerCase()
                              return (
                                event.label.toLowerCase().includes(query) ||
                                event.description.toLowerCase().includes(query) ||
                                event.value.toLowerCase().includes(query)
                              )
                            })
                            return { ...group, events: filteredEvents }
                          })
                          .filter((group) => group.events.length > 0) // Only show categories with matching events

                        // Show empty state if search has no results
                        if (eventSearchQuery.trim() && filteredGroups.length === 0) {
                          return (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                              <Search className="h-8 w-8 text-muted-foreground/50 mb-2" />
                              <p className="text-sm text-muted-foreground">No events match your search</p>
                              <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
                            </div>
                          )
                        }

                        // Render filtered groups
                        return filteredGroups.map((group) => (
                          <div key={group.category} className="flex flex-col gap-2">
                            <h4 className="text-sm font-semibold text-foreground">{group.category}</h4>
                            <div className="flex flex-col gap-2 pl-1">
                              {group.events.map((event) => (
                                <div key={event.value} className="flex items-start gap-3">
                                  <Checkbox
                                    id={`event-${event.value}`}
                                    checked={webhookForm.events.includes(event.value)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setWebhookForm((f) => ({ ...f, events: [...f.events, event.value] }))
                                      } else {
                                        setWebhookForm((f) => ({ ...f, events: f.events.filter((e) => e !== event.value) }))
                                      }
                                    }}
                                    className="mt-0.5"
                                  />
                                  <div className="flex-1">
                                    <Label
                                      htmlFor={`event-${event.value}`}
                                      className="text-sm font-medium cursor-pointer"
                                    >
                                      {event.label}
                                    </Label>
                                    <p className="text-xs text-muted-foreground">{event.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      })()}
                    </div>
                  </div>
                </FormSection>
              </div>
            </form>
          </div>

          {/* Submit Button */}
          <div className="flex flex-row items-center gap-2 pb-12">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/dashboard/projects/${projectId}/integrations?tab=webhooks`)}
              className="h-10 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isCreating || !webhookForm.name.trim() || !webhookForm.url.trim()}
              className="h-10 rounded-lg"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Webhook'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
