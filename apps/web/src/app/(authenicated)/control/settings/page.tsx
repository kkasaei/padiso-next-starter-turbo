"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Switch } from "@workspace/ui/components/switch"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { 
  FileText, 
  Clock, 
  Flag, 
  Save,
  Pencil,
  X,
  Bot,
} from "lucide-react"
import { PromptEditor } from "@/components/admin/PromptEditor"

type Provider = "claude" | "openai" | "gemini"

type FeatureFlag = {
  id: string
  name: string
  description: string
  enabled: boolean
}

export default function SettingsPage() {
  // Waitlist Mode
  const [waitlistMode, setWaitlistMode] = useState(false)

  // Master Prompt (single prompt)
  const [masterPrompt, setMasterPrompt] = useState({
    content: "<p>You are a helpful AI assistant that generates high-quality SEO content. Focus on creating engaging, informative content that provides value to readers while naturally incorporating relevant keywords.</p><p>Guidelines:</p><ul><li>Maintain a professional yet approachable tone</li><li>Use clear, concise language</li><li>Naturally incorporate keywords without keyword stuffing</li><li>Focus on providing value to the reader</li></ul>",
    provider: "claude" as Provider,
  })
  const [isEditingPrompt, setIsEditingPrompt] = useState(false)
  const [editedPrompt, setEditedPrompt] = useState(masterPrompt.content)
  const [editedProvider, setEditedProvider] = useState<Provider>(masterPrompt.provider)

  // Feature Flags
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([
    {
      id: "1",
      name: "AI Content Generation",
      description: "Enable AI-powered content generation for all workspaces",
      enabled: true,
    },
    {
      id: "2",
      name: "Reddit Agent",
      description: "Allow workspaces to use the Reddit marketing agent",
      enabled: true,
    },
    {
      id: "3",
      name: "Advanced Analytics",
      description: "Show advanced analytics dashboard to users",
      enabled: false,
    },
    {
      id: "4",
      name: "API Access",
      description: "Allow API access for enterprise customers",
      enabled: true,
    },
    {
      id: "5",
      name: "Beta Features",
      description: "Enable experimental beta features for testing",
      enabled: false,
    },
    {
      id: "6",
      name: "Custom Integrations",
      description: "Allow custom webhook and integration configurations",
      enabled: true,
    },
  ])

  const toggleFeatureFlag = (id: string) => {
    setFeatureFlags(flags =>
      flags.map(flag =>
        flag.id === id ? { ...flag, enabled: !flag.enabled } : flag
      )
    )
  }

  const startEditing = () => {
    setEditedPrompt(masterPrompt.content)
    setEditedProvider(masterPrompt.provider)
    setIsEditingPrompt(true)
  }

  const cancelEditing = () => {
    setEditedPrompt(masterPrompt.content)
    setEditedProvider(masterPrompt.provider)
    setIsEditingPrompt(false)
  }

  const savePrompt = () => {
    setMasterPrompt({
      content: editedPrompt,
      provider: editedProvider,
    })
    setIsEditingPrompt(false)
  }

  const getProviderLabel = (provider: Provider) => {
    switch (provider) {
      case "claude": return "Claude (Anthropic)"
      case "openai": return "OpenAI (GPT)"
      case "gemini": return "Gemini (Google)"
    }
  }

  const getProviderColor = (provider: Provider) => {
    switch (provider) {
      case "claude": return "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400"
      case "openai": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
      case "gemini": return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
    }
  }

  return (
    <div className="mt-10">
      <div className="flex flex-1 flex-col gap-8 overflow-y-auto p-6 md:p-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Platform configuration and settings
          </p>
        </div>

        {/* Waitlist Mode */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Waitlist Mode</h2>
                <p className="text-sm text-muted-foreground">
                  Control new user signups and access to the platform
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="waitlist-mode" className="text-base font-medium">
                  Enable Waitlist Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  When enabled, new users will be added to a waitlist instead of getting immediate access
                </p>
              </div>
              <Switch
                id="waitlist-mode"
                checked={waitlistMode}
                onCheckedChange={setWaitlistMode}
              />
            </div>
            {waitlistMode && (
              <div className="mt-4 p-4 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/50">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Waitlist mode is active. New signups will require manual approval before accessing the platform.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Master Prompt */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Master Prompt</h2>
                  <p className="text-sm text-muted-foreground">
                    Configure the system-wide AI prompt used for content generation
                  </p>
                </div>
              </div>
              {!isEditingPrompt && (
                <Button onClick={startEditing} variant="outline" size="sm">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
          <div className="p-6 space-y-4">
            {/* Provider Selection */}
            <div className="space-y-2">
              <Label>AI Provider</Label>
              {isEditingPrompt ? (
                <Select value={editedProvider} onValueChange={(v) => setEditedProvider(v as Provider)}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="claude">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        Claude (Anthropic)
                      </div>
                    </SelectItem>
                    <SelectItem value="openai">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        OpenAI (GPT)
                      </div>
                    </SelectItem>
                    <SelectItem value="gemini">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        Gemini (Google)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getProviderColor(masterPrompt.provider)}`}>
                    <Bot className="h-4 w-4 mr-2" />
                    {getProviderLabel(masterPrompt.provider)}
                  </span>
                </div>
              )}
            </div>

            {/* Prompt Content */}
            <div className="space-y-2">
              <Label>Prompt Content</Label>
              {isEditingPrompt ? (
                <PromptEditor
                  value={editedPrompt}
                  onChange={setEditedPrompt}
                  placeholder="Enter the master prompt instructions..."
                />
              ) : (
                <div 
                  className="rounded-lg border border-border bg-muted/30 p-4 prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: masterPrompt.content }}
                />
              )}
            </div>

            {/* Action Buttons */}
            {isEditingPrompt && (
              <div className="flex gap-2 pt-2">
                <Button onClick={savePrompt} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" size="sm" onClick={cancelEditing}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Feature Flags */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950">
                <Flag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Feature Flags</h2>
                <p className="text-sm text-muted-foreground">
                  Enable or disable features across the platform
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="divide-y divide-border">
              {featureFlags.map((flag) => (
                <div
                  key={flag.id}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{flag.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {flag.description}
                    </p>
                  </div>
                  <Switch
                    checked={flag.enabled}
                    onCheckedChange={() => toggleFeatureFlag(flag.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
