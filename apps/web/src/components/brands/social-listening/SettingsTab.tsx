'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Label } from '@workspace/ui/components/label'
import { Switch } from '@workspace/ui/components/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip'
import { Save, Loader2, CheckCircle2, HelpCircle } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { toast } from 'sonner'

interface SettingsTabProps {
  brandId: string
}

export function SettingsTab({ brandId }: SettingsTabProps) {
  const utils = trpc.useUtils()

  const { data: settings, isLoading } = trpc.reddit.getSettings.useQuery({ brandId })
  const { data: connectionTest } = trpc.reddit.testConnection.useQuery()

  const [formData, setFormData] = useState({
    isEnabled: true,
    scanFrequencyHours: 6,
    minRelevanceScore: 50,
    autoGenerateComments: true,
    preferredTone: 'helpful',
    includeBrandMention: true,
  })

  useEffect(() => {
    if (settings) {
      setFormData({
        isEnabled: settings.isEnabled,
        scanFrequencyHours: settings.scanFrequencyHours,
        minRelevanceScore: settings.minRelevanceScore,
        autoGenerateComments: settings.autoGenerateComments,
        preferredTone: settings.preferredTone || 'helpful',
        includeBrandMention: settings.includeBrandMention,
      })
    }
  }, [settings])

  const updateSettings = trpc.reddit.updateSettings.useMutation({
    onSuccess: () => {
      toast.success('Settings saved!')
      utils.reddit.getSettings.invalidate()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleSave = () => {
    updateSettings.mutate({
      brandId,
      ...formData,
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-gray-50 p-6 dark:bg-polar-800">
            <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-polar-700" />
            <div className="h-4 w-2/3 mt-2 animate-pulse rounded bg-gray-200 dark:bg-polar-700" />
            <div className="h-10 w-full mt-4 animate-pulse rounded bg-gray-200 dark:bg-polar-700" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Connection Status */}
      <div className="rounded-2xl bg-gray-50 p-6 dark:bg-polar-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium">Reddit Connection</h3>
            <p className="text-sm text-gray-500 dark:text-polar-500 mt-1">API connection status</p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${
                connectionTest?.success
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : 'bg-red-100 dark:bg-red-900/30'
              }`}
            >
              <CheckCircle2
                className={`h-5 w-5 ${
                  connectionTest?.success
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                {connectionTest?.success ? 'Connected' : 'Not Connected'}
              </p>
              <p className="text-xs text-gray-500 dark:text-polar-500">
                {connectionTest?.message || 'Checking...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Settings */}
      <div className="rounded-2xl bg-gray-50 p-6 dark:bg-polar-800 space-y-6">

        {/* Enable/Disable */}
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-polar-700">
          <div className="flex items-center gap-2">
            <Label>Enable Reddit Agent</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-400 hover:text-gray-600 dark:text-polar-500 dark:hover:text-polar-300 transition-colors">
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-sm">Enable or disable automatic Reddit monitoring for this brand.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Switch
            checked={formData.isEnabled}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isEnabled: checked }))
            }
          />
        </div>

        {/* Scan Frequency */}
        <div className="space-y-2 py-3 border-b border-gray-200 dark:border-polar-700">
          <div className="flex items-center gap-2">
            <Label>Scan Frequency</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-400 hover:text-gray-600 dark:text-polar-500 dark:hover:text-polar-300 transition-colors">
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-sm">How often to scan Reddit for new opportunities.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Select
            value={formData.scanFrequencyHours.toString()}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, scanFrequencyHours: parseInt(value) }))
            }
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Every hour</SelectItem>
              <SelectItem value="3">Every 3 hours</SelectItem>
              <SelectItem value="6">Every 6 hours</SelectItem>
              <SelectItem value="12">Every 12 hours</SelectItem>
              <SelectItem value="24">Once a day</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Minimum Relevance Score */}
        <div className="space-y-2 py-3">
          <div className="flex items-center gap-2">
            <Label>Minimum Relevance Score</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-400 hover:text-gray-600 dark:text-polar-500 dark:hover:text-polar-300 transition-colors">
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-sm">Only show opportunities with relevance above this threshold.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Select
            value={formData.minRelevanceScore.toString()}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, minRelevanceScore: parseInt(value) }))
            }
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30% - Show more results</SelectItem>
              <SelectItem value="50">50% - Balanced</SelectItem>
              <SelectItem value="70">70% - High relevance only</SelectItem>
              <SelectItem value="85">85% - Very high relevance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Comment Generation */}
      <div className="rounded-2xl bg-gray-50 p-6 dark:bg-polar-800 space-y-6">

        {/* Auto Generate */}
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-polar-700">
          <div className="flex items-center gap-2">
            <Label>Auto-generate Comments</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-400 hover:text-gray-600 dark:text-polar-500 dark:hover:text-polar-300 transition-colors">
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-sm">Automatically generate comment suggestions for new opportunities.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Switch
            checked={formData.autoGenerateComments}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, autoGenerateComments: checked }))
            }
          />
        </div>

        {/* Preferred Tone */}
        <div className="space-y-2 py-3 border-b border-gray-200 dark:border-polar-700">
          <div className="flex items-center gap-2">
            <Label>Preferred Tone</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-400 hover:text-gray-600 dark:text-polar-500 dark:hover:text-polar-300 transition-colors">
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-sm">The tone AI will use when generating comments.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Select
            value={formData.preferredTone}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, preferredTone: value }))
            }
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="helpful">Helpful - Advice and solutions</SelectItem>
              <SelectItem value="informative">Informative - Sharing knowledge</SelectItem>
              <SelectItem value="casual">Casual - Friendly conversation</SelectItem>
              <SelectItem value="professional">Professional - Business-like</SelectItem>
              <SelectItem value="enthusiastic">Enthusiastic - Excited</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Include Brand Mention */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <Label>Include Brand Mention</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-400 hover:text-gray-600 dark:text-polar-500 dark:hover:text-polar-300 transition-colors">
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-sm">Allow AI to naturally mention your brand when appropriate.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Switch
            checked={formData.includeBrandMention}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, includeBrandMention: checked }))
            }
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={updateSettings.isPending} className="rounded-full gap-2">
          {updateSettings.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
