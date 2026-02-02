'use client'

import { memo, useCallback, useMemo, useState } from 'react'
import {
  Play,
  Bot,
  GitBranch,
  Zap,
  Shuffle,
  Clock,
  Globe,
  Flag,
  Lightbulb,
  Folder,
  FileText,
  Settings2,
  Calendar,
  Timer,
  Terminal,
  Repeat,
  CalendarDays,
  CalendarClock,
  Check,
  ChevronsUpDown,
  Search,
  Braces,
  Hash,
  Cpu,
  Database,
  Wrench,
} from 'lucide-react'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { Textarea } from '@workspace/ui/components/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import { Switch } from '@workspace/ui/components/switch'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@workspace/ui/components/command'
import { cn } from '@workspace/common/lib'
import type { WorkflowNode, WorkflowNodeType } from './workflow-types'
import { PromptEditor } from '@workspace/editor/prompt-editor'

// ============================================================
// TYPES
// ============================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NodeData = Record<string, any>

interface NodeConfigPanelProps {
  node: WorkflowNode | null
  onUpdate: (nodeId: string, data: Partial<WorkflowNode['data']>) => void
  projectId?: string
}

// ============================================================
// NODE TYPE INFO
// ============================================================

const nodeTypeInfo: Record<WorkflowNodeType, { label: string; icon: React.ElementType; color: string }> = {
  start: { label: 'Start', icon: Play, color: '#22c55e' },
  agent: { label: 'Agent', icon: Bot, color: '#6366f1' },
  condition: { label: 'Condition', icon: GitBranch, color: '#f59e0b' },
  action: { label: 'Action', icon: Zap, color: '#ec4899' },
  transform: { label: 'Transform', icon: Shuffle, color: '#8b5cf6' },
  delay: { label: 'Delay', icon: Clock, color: '#64748b' },
  webhook: { label: 'Webhook', icon: Globe, color: '#0ea5e9' },
  end: { label: 'End', icon: Flag, color: '#ef4444' },
  opportunities: { label: 'Opportunities', icon: Lightbulb, color: '#f59e0b' },
  projects: { label: 'Projects', icon: Folder, color: '#3b82f6' },
  content: { label: 'Content', icon: FileText, color: '#10b981' },
  'ai-model': { label: 'Chat Model', icon: Cpu, color: '#8b5cf6' },
  'ai-memory': { label: 'Memory', icon: Database, color: '#06b6d4' },
  'ai-tool': { label: 'Tool', icon: Wrench, color: '#f97316' },
}

// ============================================================
// FIELD COMPONENTS
// ============================================================

interface ConfigFieldProps {
  label: string
  description?: string
  children: React.ReactNode
}

function ConfigField({ label, description, children }: ConfigFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  )
}

// ============================================================
// NODE-SPECIFIC CONFIGS
// ============================================================

interface NodeConfigProps {
  node: WorkflowNode
  onUpdate: (data: Partial<WorkflowNode['data']>) => void
  projectId?: string
}

// ============================================================
// TIMEZONE DATA
// ============================================================

const TIMEZONES = [
  { group: 'Americas', zones: [
    { value: 'America/New_York', label: 'New York (EST/EDT)', offset: 'UTC-5' },
    { value: 'America/Chicago', label: 'Chicago (CST/CDT)', offset: 'UTC-6' },
    { value: 'America/Denver', label: 'Denver (MST/MDT)', offset: 'UTC-7' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)', offset: 'UTC-8' },
    { value: 'America/Toronto', label: 'Toronto (EST/EDT)', offset: 'UTC-5' },
    { value: 'America/Vancouver', label: 'Vancouver (PST/PDT)', offset: 'UTC-8' },
    { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)', offset: 'UTC-3' },
  ]},
  { group: 'Europe', zones: [
    { value: 'Europe/London', label: 'London (GMT/BST)', offset: 'UTC+0' },
    { value: 'Europe/Paris', label: 'Paris (CET/CEST)', offset: 'UTC+1' },
    { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)', offset: 'UTC+1' },
    { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)', offset: 'UTC+1' },
    { value: 'Europe/Madrid', label: 'Madrid (CET/CEST)', offset: 'UTC+1' },
    { value: 'Europe/Rome', label: 'Rome (CET/CEST)', offset: 'UTC+1' },
    { value: 'Europe/Stockholm', label: 'Stockholm (CET/CEST)', offset: 'UTC+1' },
  ]},
  { group: 'Asia & Pacific', zones: [
    { value: 'Asia/Dubai', label: 'Dubai (GST)', offset: 'UTC+4' },
    { value: 'Asia/Singapore', label: 'Singapore (SGT)', offset: 'UTC+8' },
    { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)', offset: 'UTC+8' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: 'UTC+9' },
    { value: 'Asia/Seoul', label: 'Seoul (KST)', offset: 'UTC+9' },
    { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)', offset: 'UTC+10' },
    { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)', offset: 'UTC+12' },
  ]},
  { group: 'Other', zones: [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)', offset: 'UTC' },
  ]},
]

const WEEKDAYS = [
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
  { value: '0', label: 'Sunday' },
]

// ============================================================
// SEARCHABLE TIMEZONE SELECT
// ============================================================

// Flatten timezones for search
const ALL_TIMEZONES = TIMEZONES.flatMap((group) =>
  group.zones.map((zone) => ({
    ...zone,
    group: group.group,
    searchText: `${zone.label} ${zone.value} ${zone.offset} ${group.group}`.toLowerCase(),
  }))
)

interface TimezoneSelectProps {
  value: string
  onChange: (value: string) => void
}

function TimezoneSelect({ value, onChange }: TimezoneSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const selectedTimezone = ALL_TIMEZONES.find((tz) => tz.value === value)

  const filteredTimezones = useMemo(() => {
    if (!search.trim()) return ALL_TIMEZONES
    const query = search.toLowerCase()
    return ALL_TIMEZONES.filter((tz) => tz.searchText.includes(query))
  }, [search])

  // Group filtered timezones
  const groupedTimezones = useMemo(() => {
    const groups: Record<string, typeof ALL_TIMEZONES> = {}
    filteredTimezones.forEach((tz) => {
      (groups[tz.group] ??= []).push(tz)
    })
    return groups
  }, [filteredTimezones])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal h-9"
        >
          {selectedTimezone ? (
            <div className="flex items-center gap-2 truncate">
              <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate">{selectedTimezone.label}</span>
              <span className="text-xs text-muted-foreground font-mono shrink-0">
                {selectedTimezone.offset}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">Select timezone...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              placeholder="Search timezones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No timezone found.</CommandEmpty>
            {Object.entries(groupedTimezones).map(([group, zones]) => (
              <CommandGroup key={group} heading={group}>
                {zones.map((zone) => (
                  <CommandItem
                    key={zone.value}
                    value={zone.value}
                    onSelect={() => {
                      onChange(zone.value)
                      setOpen(false)
                      setSearch('')
                    }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Check
                        className={cn(
                          'h-4 w-4',
                          value === zone.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <span>{zone.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      {zone.offset}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// ============================================================
// SCHEDULE PREVIEW HELPER
// ============================================================

function getScheduleDescription(data: NodeData): string {
  if (data.trigger !== 'schedule') return ''

  const scheduleMode = data.scheduleMode || 'simple'

  if (scheduleMode === 'cron' && data.cronExpression) {
    return `Cron: ${data.cronExpression}`
  }

  const frequency = data.frequency || 'daily'
  const time = data.time || '09:00'
  const timezone = data.timezone || 'UTC'
  const tzLabel = TIMEZONES.flatMap(g => g.zones).find(z => z.value === timezone)?.label || timezone

  switch (frequency) {
    case 'hourly':
      return `Every hour at minute ${data.minute || '0'}`
    case 'daily':
      return `Daily at ${time} (${tzLabel})`
    case 'weekly':
      const dayName = WEEKDAYS.find(d => d.value === data.dayOfWeek)?.label || 'Monday'
      return `Every ${dayName} at ${time} (${tzLabel})`
    case 'monthly':
      const dayOfMonth = data.dayOfMonth || '1'
      const suffix = dayOfMonth === '1' ? 'st' : dayOfMonth === '2' ? 'nd' : dayOfMonth === '3' ? 'rd' : 'th'
      return `Monthly on the ${dayOfMonth}${suffix} at ${time} (${tzLabel})`
    case 'custom':
      const interval = data.interval || 30
      const unit = data.intervalUnit || 'minutes'
      return `Every ${interval} ${unit}`
    default:
      return 'Schedule configured'
  }
}

// ============================================================
// TRIGGER TYPE CARD
// ============================================================

interface TriggerCardProps {
  type: 'manual' | 'schedule'
  title: string
  description: string
  icon: React.ReactNode
  isSelected: boolean
  onClick: () => void
}

function TriggerCard({ title, description, icon, isSelected, onClick }: TriggerCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-all w-full',
        'hover:border-primary/50 hover:bg-primary/5',
        isSelected
          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
          : 'border-gray-200 dark:border-polar-700 bg-white dark:bg-polar-900'
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
          isSelected
            ? 'bg-primary text-white'
            : 'bg-gray-100 dark:bg-polar-800 text-gray-500 dark:text-polar-400'
        )}
      >
        {icon}
      </div>
      <div>
        <div className={cn(
          'text-sm font-semibold',
          isSelected ? 'text-primary' : 'text-gray-900 dark:text-white'
        )}>
          {title}
        </div>
        <div className="text-xs text-gray-500 dark:text-polar-400 mt-0.5">
          {description}
        </div>
      </div>
    </button>
  )
}

// ============================================================
// SCHEDULE MODE TABS
// ============================================================

interface ScheduleModeTabsProps {
  value: 'simple' | 'cron'
  onChange: (value: 'simple' | 'cron') => void
}

function ScheduleModeTabs({ value, onChange }: ScheduleModeTabsProps) {
  return (
    <div className="flex rounded-lg bg-gray-100 dark:bg-polar-800 p-1">
      <button
        onClick={() => onChange('simple')}
        className={cn(
          'flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all',
          value === 'simple'
            ? 'bg-white dark:bg-polar-900 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-500 dark:text-polar-400 hover:text-gray-700 dark:hover:text-polar-300'
        )}
      >
        <Calendar className="h-4 w-4" />
        Simple
      </button>
      <button
        onClick={() => onChange('cron')}
        className={cn(
          'flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all',
          value === 'cron'
            ? 'bg-white dark:bg-polar-900 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-500 dark:text-polar-400 hover:text-gray-700 dark:hover:text-polar-300'
        )}
      >
        <Terminal className="h-4 w-4" />
        Cron
      </button>
    </div>
  )
}

// ============================================================
// START NODE CONFIG
// ============================================================

function StartNodeConfig({ node, onUpdate }: NodeConfigProps) {
  const data = node.data as NodeData
  const trigger = data.trigger || 'manual'
  const scheduleMode = data.scheduleMode || 'simple'
  const frequency = data.frequency || 'daily'

  const scheduleDescription = useMemo(() => getScheduleDescription(data), [data])

  return (
    <div className="space-y-6">
      {/* Node Name */}
      <ConfigField label="Node Name">
        <Input
          value={data.label || ''}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="Enter node name..."
        />
      </ConfigField>

      {/* Trigger Type Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Trigger Type</Label>
        <div className="grid grid-cols-2 gap-3">
          <TriggerCard
            type="manual"
            title="Manual"
            description="Run on demand"
            icon={<Play className="h-5 w-5" />}
            isSelected={trigger === 'manual'}
            onClick={() => onUpdate({ trigger: 'manual' })}
          />
          <TriggerCard
            type="schedule"
            title="Schedule"
            description="Run automatically"
            icon={<CalendarClock className="h-5 w-5" />}
            isSelected={trigger === 'schedule'}
            onClick={() => onUpdate({ trigger: 'schedule' })}
          />
        </div>
      </div>

      {/* Schedule Configuration */}
      {trigger === 'schedule' && (
        <div className="space-y-4 pt-2">
          {/* Divider with label */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-polar-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-polar-900 px-3 text-xs font-medium text-gray-500 dark:text-polar-400 uppercase tracking-wider">
                Schedule Settings
              </span>
            </div>
          </div>

          {/* Schedule Mode Tabs */}
          <ScheduleModeTabs
            value={scheduleMode}
            onChange={(mode) => onUpdate({ scheduleMode: mode })}
          />

          {/* Simple Mode */}
          {scheduleMode === 'simple' && (
            <div className="space-y-4">
              {/* Frequency */}
              <ConfigField label="Frequency" description="How often should this run?">
                <Select
                  value={frequency}
                  onValueChange={(value) => onUpdate({ frequency: value as 'daily' | 'hourly' | 'weekly' | 'monthly' | 'custom' })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-gray-400" />
                        <span>Hourly</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="daily">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-gray-400" />
                        <span>Daily</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="weekly">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Weekly</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="monthly">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Monthly</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="custom">
                      <div className="flex items-center gap-2">
                        <Repeat className="h-4 w-4 text-gray-400" />
                        <span>Custom Interval</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </ConfigField>

              {/* Hourly - Minute Selection */}
              {frequency === 'hourly' && (
                <ConfigField label="At minute" description="Which minute of each hour">
                  <Select
                    value={data.minute || '0'}
                    onValueChange={(value) => onUpdate({ minute: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 15, 30, 45].map((min) => (
                        <SelectItem key={min} value={min.toString()}>
                          :{min.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </ConfigField>
              )}

              {/* Custom Interval */}
              {frequency === 'custom' && (
                <ConfigField label="Run every" description="Custom interval">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={data.interval || 30}
                      onChange={(e) => onUpdate({ interval: parseInt(e.target.value) || 30 })}
                      className="w-24"
                      min={1}
                    />
                    <Select
                      value={data.intervalUnit || 'minutes'}
                      onValueChange={(value) => onUpdate({ intervalUnit: value as 'minutes' | 'hours' })}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </ConfigField>
              )}

              {/* Weekly - Day Selection */}
              {frequency === 'weekly' && (
                <ConfigField label="Day of Week">
                  <Select
                    value={data.dayOfWeek || '1'}
                    onValueChange={(value) => onUpdate({ dayOfWeek: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WEEKDAYS.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </ConfigField>
              )}

              {/* Monthly - Day Selection */}
              {frequency === 'monthly' && (
                <ConfigField label="Day of Month">
                  <Select
                    value={data.dayOfMonth || '1'}
                    onValueChange={(value) => onUpdate({ dayOfMonth: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day}{day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </ConfigField>
              )}

              {/* Time Selection (not for hourly/custom) */}
              {!['hourly', 'custom'].includes(frequency) && (
                <ConfigField label="Time" description="When to run each day">
                  <Input
                    type="time"
                    value={data.time || '09:00'}
                    onChange={(e) => onUpdate({ time: e.target.value })}
                    className="w-full"
                  />
                </ConfigField>
              )}

              {/* Timezone */}
              <ConfigField label="Timezone" description="Times are relative to this timezone">
                <TimezoneSelect
                  value={data.timezone || 'UTC'}
                  onChange={(value) => onUpdate({ timezone: value })}
                />
              </ConfigField>
            </div>
          )}

          {/* Cron Mode */}
          {scheduleMode === 'cron' && (
            <div className="space-y-4">
              <ConfigField
                label="Cron Expression"
                description="Standard cron format: minute hour day month weekday"
              >
                <Input
                  value={data.cronExpression || ''}
                  onChange={(e) => onUpdate({ cronExpression: e.target.value })}
                  placeholder="0 9 * * *"
                  className="font-mono"
                />
              </ConfigField>

              {/* Cron Helper */}
              <div className="rounded-lg bg-gray-50 dark:bg-polar-800/50 p-3 space-y-2">
                <div className="text-xs font-medium text-gray-700 dark:text-polar-300">
                  Common examples:
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    { cron: '0 9 * * *', label: 'Daily at 9:00 AM' },
                    { cron: '0 9 * * 1', label: 'Every Monday at 9:00 AM' },
                    { cron: '0 0 1 * *', label: 'First day of month at midnight' },
                    { cron: '*/15 * * * *', label: 'Every 15 minutes' },
                    { cron: '0 */2 * * *', label: 'Every 2 hours' },
                  ].map((example) => (
                    <button
                      key={example.cron}
                      onClick={() => onUpdate({ cronExpression: example.cron })}
                      className="flex items-center gap-2 text-xs text-left px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-polar-700 transition-colors"
                    >
                      <code className="text-primary font-mono bg-primary/10 px-1.5 py-0.5 rounded">
                        {example.cron}
                      </code>
                      <span className="text-gray-500 dark:text-polar-400">
                        {example.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Timezone for Cron */}
              <ConfigField label="Timezone">
                <TimezoneSelect
                  value={data.timezone || 'UTC'}
                  onChange={(value) => onUpdate({ timezone: value })}
                />
              </ConfigField>
            </div>
          )}

          {/* Schedule Preview */}
          {scheduleDescription && (
            <div className="rounded-xl bg-linear-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
                    Schedule Preview
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {scheduleDescription}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Output Format Options
const OUTPUT_FORMATS = [
  {
    value: 'text',
    label: 'Plain Text',
    description: 'Simple text output',
    icon: FileText,
  },
  {
    value: 'markdown',
    label: 'Markdown',
    description: 'Formatted text with headings, lists, etc.',
    icon: Hash,
  },
  {
    value: 'json',
    label: 'JSON',
    description: 'Structured data output',
    icon: Braces,
  },
]

// Agent Node Config - Main Focus
function AgentNodeConfig({ node, onUpdate, projectId }: NodeConfigProps & { projectId?: string }) {
  const data = node.data as NodeData

  return (
    <div className="space-y-5">
      {/* Node Name */}
      <ConfigField label="Agent Name">
        <Input
          value={data.label || ''}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="e.g., Content Writer, Data Analyzer"
        />
      </ConfigField>

      {/* Connection Info */}
      <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 p-3">
        <div className="text-xs font-medium text-indigo-700 dark:text-indigo-300 mb-2">
          Connect AI Components
        </div>
        <div className="space-y-1.5 text-xs text-indigo-600 dark:text-indigo-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span><strong>Chat Model</strong> (required) - OpenAI, Anthropic, etc.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span><strong>Memory</strong> - Conversation context</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            <span><strong>Tools</strong> - APIs, integrations</span>
          </div>
        </div>
      </div>

      {/* System Prompt */}
      <ConfigField
        label="System Prompt"
        description="Define the agent's role, personality, and instructions"
      >
        <Textarea
          value={data.systemPrompt || ''}
          onChange={(e) => onUpdate({ systemPrompt: e.target.value })}
          placeholder="You are a helpful assistant that writes engaging blog content. Always be concise and informative..."
          rows={5}
          className="resize-none"
        />
      </ConfigField>

      {/* User Prompt */}
      <ConfigField
        label="User Prompt"
        description="The task or question. Use {{variable}} for dynamic values"
      >
        <PromptEditor
          value={data.userPrompt || ''}
          onChange={(value) => onUpdate({ userPrompt: value })}
          placeholder="Write a blog post about {{topic}} targeting {{audience}}. Include key points about {{keywords}}."
          availableVariables={['{{input}}', '{{opportunity.title}}', '{{project.name}}']}
          projectId={projectId}
          height="200px"
        />
      </ConfigField>

      {/* Output Format */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Output Format</Label>
        <div className="grid grid-cols-3 gap-2">
          {OUTPUT_FORMATS.map((format) => {
            const Icon = format.icon
            return (
              <button
                key={format.value}
                type="button"
                onClick={() => onUpdate({ outputFormat: format.value as 'text' | 'markdown' | 'json' })}
                className={cn(
                  'flex flex-col items-center gap-1.5 p-3 rounded-lg border text-center transition-all',
                  data.outputFormat === format.value
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-gray-200 dark:border-polar-700 hover:border-gray-300 dark:hover:border-polar-600'
                )}
              >
                <Icon className={cn(
                  'h-5 w-5',
                  data.outputFormat === format.value
                    ? 'text-primary'
                    : 'text-gray-400 dark:text-polar-500'
                )} />
                <span className="text-xs font-medium">{format.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* JSON Schema (only for JSON output) */}
      {data.outputFormat === 'json' && (
        <ConfigField
          label="JSON Schema"
          description="Define the structure of the JSON output (optional)"
        >
          <Textarea
            value={data.jsonSchema || ''}
            onChange={(e) => onUpdate({ jsonSchema: e.target.value })}
            placeholder={`{
  "title": "string",
  "summary": "string",
  "keywords": ["string"]
}`}
            rows={5}
            className="font-mono text-xs resize-none"
          />
        </ConfigField>
      )}

      {/* Output Variable */}
      <ConfigField label="Output Variable" description="Save the result as">
        <Input
          value={data.outputVariable || ''}
          onChange={(e) => onUpdate({ outputVariable: e.target.value })}
          placeholder="e.g., content, analysis, response"
        />
      </ConfigField>
    </div>
  )
}

// ============================================================
// AI MODEL NODE CONFIG
// ============================================================

const MODEL_PROVIDERS = [
  { value: 'openai', label: 'OpenAI', models: ['gpt-5o', 'gpt-5o-mini', 'gpt-4-turbo', 'gpt-4'] },
  { value: 'anthropic', label: 'Anthropic', models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'] },
  { value: 'google', label: 'Google', models: ['gemini-pro', 'gemini-ultra'] },
  { value: 'mistral', label: 'Mistral', models: ['mistral-large', 'mistral-medium', 'mistral-small'] },
]

function AIModelNodeConfig({ node, onUpdate }: NodeConfigProps) {
  const data = node.data as NodeData
  const selectedProvider = MODEL_PROVIDERS.find(p => p.value === data.provider) ?? MODEL_PROVIDERS[0]!

  return (
    <div className="space-y-4">
      <ConfigField label="Model Name">
        <Input
          value={data.label || ''}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="e.g., My GPT Model"
        />
      </ConfigField>

      <ConfigField label="Provider">
        <Select
          value={data.provider || 'openai'}
          onValueChange={(value) => {
            const provider = MODEL_PROVIDERS.find(p => p.value === value)
            onUpdate({
              provider: value as 'openai' | 'anthropic' | 'google' | 'mistral',
              model: provider?.models[0] || ''
            })
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MODEL_PROVIDERS.map((provider) => (
              <SelectItem key={provider.value} value={provider.value}>
                {provider.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ConfigField>

      <ConfigField label="Model">
        <Select
          value={data.model || selectedProvider.models[0]}
          onValueChange={(value) => onUpdate({ model: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {selectedProvider.models.map((model) => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ConfigField>

      <ConfigField label="Temperature" description="0 = focused, 1 = creative">
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={data.temperature ?? 0.7}
            onChange={(e) => onUpdate({ temperature: parseFloat(e.target.value) })}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-polar-700"
          />
          <span className="text-sm font-mono w-8 text-center">{data.temperature ?? 0.7}</span>
        </div>
      </ConfigField>

      <ConfigField label="Max Tokens">
        <Select
          value={data.maxTokens?.toString() || '2048'}
          onValueChange={(value) => onUpdate({ maxTokens: parseInt(value) })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="512">512</SelectItem>
            <SelectItem value="1024">1,024</SelectItem>
            <SelectItem value="2048">2,048</SelectItem>
            <SelectItem value="4096">4,096</SelectItem>
            <SelectItem value="8192">8,192</SelectItem>
          </SelectContent>
        </Select>
      </ConfigField>
    </div>
  )
}

// ============================================================
// AI MEMORY NODE CONFIG
// ============================================================

const MEMORY_TYPES = [
  { value: 'buffer', label: 'Buffer Memory', description: 'Simple in-memory buffer' },
  { value: 'conversation', label: 'Conversation Memory', description: 'Full conversation history' },
  { value: 'vector', label: 'Vector Store', description: 'Semantic search memory' },
  { value: 'postgres', label: 'PostgreSQL', description: 'Database-backed memory' },
  { value: 'redis', label: 'Redis', description: 'Fast cache memory' },
]

function AIMemoryNodeConfig({ node, onUpdate }: NodeConfigProps) {
  const data = node.data as NodeData

  return (
    <div className="space-y-4">
      <ConfigField label="Memory Name">
        <Input
          value={data.label || ''}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="e.g., Conversation Memory"
        />
      </ConfigField>

      <ConfigField label="Memory Type">
        <Select
          value={data.memoryType || 'buffer'}
          onValueChange={(value) => onUpdate({ memoryType: value as 'buffer' | 'conversation' | 'vector' | 'postgres' | 'redis' })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MEMORY_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex flex-col">
                  <span>{type.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ConfigField>

      {/* Buffer/Conversation specific */}
      {(data.memoryType === 'buffer' || data.memoryType === 'conversation') && (
        <ConfigField label="Window Size" description="Number of messages to remember">
          <Input
            type="number"
            value={data.windowSize || 10}
            onChange={(e) => onUpdate({ windowSize: parseInt(e.target.value) })}
            min={1}
            max={100}
          />
        </ConfigField>
      )}

      {/* Vector store specific */}
      {data.memoryType === 'vector' && (
        <>
          <ConfigField label="Vector Store" description="Connected vector database">
            <Input
              value={data.vectorStore || ''}
              onChange={(e) => onUpdate({ vectorStore: e.target.value })}
              placeholder="e.g., pinecone, supabase"
            />
          </ConfigField>
          <ConfigField label="Top K" description="Number of results to retrieve">
            <Input
              type="number"
              value={data.topK || 5}
              onChange={(e) => onUpdate({ topK: parseInt(e.target.value) })}
              min={1}
              max={20}
            />
          </ConfigField>
        </>
      )}

      {/* Database specific */}
      {(data.memoryType === 'postgres' || data.memoryType === 'redis') && (
        <>
          <ConfigField label="Connection String">
            <Input
              value={data.connectionString || ''}
              onChange={(e) => onUpdate({ connectionString: e.target.value })}
              placeholder="e.g., postgresql://..."
              type="password"
            />
          </ConfigField>
          {data.memoryType === 'postgres' && (
            <ConfigField label="Table Name">
              <Input
                value={data.tableName || ''}
                onChange={(e) => onUpdate({ tableName: e.target.value })}
                placeholder="e.g., chat_history"
              />
            </ConfigField>
          )}
        </>
      )}
    </div>
  )
}

// ============================================================
// AI TOOL NODE CONFIG
// ============================================================

const TOOL_TYPES = [
  { value: 'http', label: 'HTTP Request', description: 'Call external APIs' },
  { value: 'code', label: 'Code Execution', description: 'Run custom code' },
  { value: 'search', label: 'Web Search', description: 'Search the web' },
  { value: 'database', label: 'Database', description: 'Query databases' },
  { value: 'integration', label: 'Integration', description: 'Third-party services' },
]

const INTEGRATIONS = [
  { value: 'jira', label: 'Jira Software', operations: ['create:issue', 'update:issue', 'getAll:issues'] },
  { value: 'slack', label: 'Slack', operations: ['send:message', 'invite:channel', 'update:profile'] },
  { value: 'github', label: 'GitHub', operations: ['create:issue', 'create:pr', 'getAll:repos'] },
  { value: 'notion', label: 'Notion', operations: ['create:page', 'update:page', 'query:database'] },
  { value: 'airtable', label: 'Airtable', operations: ['create:record', 'update:record', 'getAll:records'] },
]

function AIToolNodeConfig({ node, onUpdate }: NodeConfigProps) {
  const data = node.data as NodeData
  const selectedIntegration = INTEGRATIONS.find(i => i.value === data.integration)

  return (
    <div className="space-y-4">
      <ConfigField label="Tool Name">
        <Input
          value={data.label || ''}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="e.g., Create Jira Issue"
        />
      </ConfigField>

      <ConfigField label="Tool Type">
        <Select
          value={data.toolType || 'http'}
          onValueChange={(value) => onUpdate({ toolType: value as 'search' | 'code' | 'http' | 'database' | 'integration' })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TOOL_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ConfigField>

      {/* HTTP Tool */}
      {data.toolType === 'http' && (
        <>
          <ConfigField label="Method">
            <Select
              value={data.method || 'GET'}
              onValueChange={(value) => onUpdate({ method: value as 'GET' | 'POST' | 'PUT' | 'DELETE' })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </ConfigField>
          <ConfigField label="URL">
            <Input
              value={data.url || ''}
              onChange={(e) => onUpdate({ url: e.target.value })}
              placeholder="https://api.example.com/endpoint"
            />
          </ConfigField>
        </>
      )}

      {/* Code Tool */}
      {data.toolType === 'code' && (
        <>
          <ConfigField label="Language">
            <Select
              value={data.codeLanguage || 'javascript'}
              onValueChange={(value) => onUpdate({ codeLanguage: value as 'javascript' | 'python' })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
              </SelectContent>
            </Select>
          </ConfigField>
          <ConfigField label="Code">
            <Textarea
              value={data.code || ''}
              onChange={(e) => onUpdate({ code: e.target.value })}
              placeholder="// Your code here..."
              rows={6}
              className="font-mono text-xs"
            />
          </ConfigField>
        </>
      )}

      {/* Integration Tool */}
      {data.toolType === 'integration' && (
        <>
          <ConfigField label="Integration">
            <Select
              value={data.integration || ''}
              onValueChange={(value) => {
                const integration = INTEGRATIONS.find(i => i.value === value)
                onUpdate({
                  integration: value,
                  operation: integration?.operations[0] || ''
                })
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select integration" />
              </SelectTrigger>
              <SelectContent>
                {INTEGRATIONS.map((integration) => (
                  <SelectItem key={integration.value} value={integration.value}>
                    {integration.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ConfigField>
          {selectedIntegration && (
            <ConfigField label="Operation">
              <Select
                value={data.operation || selectedIntegration.operations[0]}
                onValueChange={(value) => onUpdate({ operation: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectedIntegration.operations.map((op) => (
                    <SelectItem key={op} value={op}>
                      {op}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ConfigField>
          )}
        </>
      )}
    </div>
  )
}

// Condition Node Config
function ConditionNodeConfig({ node, onUpdate }: NodeConfigProps) {
  const data = node.data as NodeData
  return (
    <div className="space-y-4">
      <ConfigField label="Node Name">
        <Input
          value={data.label || ''}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="Enter node name..."
        />
      </ConfigField>

      <ConfigField label="Condition" description="Expression to evaluate">
        <Input
          value={data.condition || ''}
          onChange={(e) => onUpdate({ condition: e.target.value })}
          placeholder="e.g., data.status === 'active'"
        />
      </ConfigField>

      <ConfigField label="Operator">
        <Select
          value={data.operator || 'equals'}
          onValueChange={(value) => onUpdate({ operator: value as 'equals' | 'contains' | 'greater' | 'less' | 'exists' | 'custom' })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equals">Equals</SelectItem>
            <SelectItem value="contains">Contains</SelectItem>
            <SelectItem value="greater">Greater than</SelectItem>
            <SelectItem value="less">Less than</SelectItem>
            <SelectItem value="exists">Exists</SelectItem>
            <SelectItem value="custom">Custom expression</SelectItem>
          </SelectContent>
        </Select>
      </ConfigField>

      <ConfigField label="Value" description="Value to compare against">
        <Input
          value={data.value || ''}
          onChange={(e) => onUpdate({ value: e.target.value })}
          placeholder="Enter value..."
        />
      </ConfigField>
    </div>
  )
}

// Action Node Config
function ActionNodeConfig({ node, onUpdate }: NodeConfigProps) {
  const data = node.data as NodeData
  return (
    <div className="space-y-4">
      <ConfigField label="Node Name">
        <Input
          value={data.label || ''}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="Enter node name..."
        />
      </ConfigField>

      <ConfigField label="Action Type">
        <Select
          value={data.actionType || 'email'}
          onValueChange={(value) => onUpdate({ actionType: value as 'email' | 'slack' | 'http' | 'database' | 'file' })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Send Email</SelectItem>
            <SelectItem value="slack">Send Slack Message</SelectItem>
            <SelectItem value="http">HTTP Request</SelectItem>
            <SelectItem value="database">Database Query</SelectItem>
            <SelectItem value="file">File Operation</SelectItem>
          </SelectContent>
        </Select>
      </ConfigField>

      <ConfigField label="Description">
        <Textarea
          value={data.description || ''}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Describe this action..."
          rows={2}
        />
      </ConfigField>
    </div>
  )
}

// Simple Transform Types - User-Friendly
const TRANSFORM_TYPES = [
  {
    value: 'get-first',
    label: 'Get First Item',
    description: 'Get the first item from a list',
  },
  {
    value: 'get-last',
    label: 'Get Last Item',
    description: 'Get the last item from a list',
  },
  {
    value: 'get-property',
    label: 'Get Property',
    description: 'Extract a specific property from data',
  },
  {
    value: 'set-property',
    label: 'Set Property',
    description: 'Add or update a property on data',
  },
  {
    value: 'filter',
    label: 'Filter Items',
    description: 'Keep only items matching a condition',
  },
  {
    value: 'format-text',
    label: 'Format Text',
    description: 'Create formatted text from data',
  },
  {
    value: 'merge',
    label: 'Merge Data',
    description: 'Combine multiple data sources',
  },
  {
    value: 'count',
    label: 'Count Items',
    description: 'Count the number of items in a list',
  },
]

// Transform Node Config
function TransformNodeConfig({ node, onUpdate }: NodeConfigProps) {
  const data = node.data as NodeData
  const selectedType = TRANSFORM_TYPES.find(t => t.value === data.transformType) || TRANSFORM_TYPES[0]

  return (
    <div className="space-y-4">
      <ConfigField label="Node Name">
        <Input
          value={data.label || ''}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="Enter node name..."
        />
      </ConfigField>

      {/* Input Variable */}
      <ConfigField label="Input" description="Which data to transform">
        <Input
          value={data.inputVariable || ''}
          onChange={(e) => onUpdate({ inputVariable: e.target.value })}
          placeholder="e.g., opportunities, content"
        />
      </ConfigField>

      <ConfigField label="Transform Type">
        <Select
          value={data.transformType || 'get-first'}
          onValueChange={(value) => onUpdate({ transformType: value as 'filter' | 'get-first' | 'get-last' | 'get-property' | 'set-property' | 'format-text' | 'merge' | 'count' })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TRANSFORM_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ConfigField>

      {/* Help text */}
      <div className="rounded-lg bg-gray-50 dark:bg-polar-800/50 border border-gray-200 dark:border-polar-700 p-3">
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {selectedType.description}
        </div>
      </div>

      {/* Property Name (for get/set property) */}
      {(data.transformType === 'get-property' || data.transformType === 'set-property') && (
        <ConfigField label="Property Name" description="Name of the property">
          <Input
            value={data.propertyName || ''}
            onChange={(e) => onUpdate({ propertyName: e.target.value })}
            placeholder="e.g., title, status, url"
          />
        </ConfigField>
      )}

      {/* Property Value (for set property) */}
      {data.transformType === 'set-property' && (
        <ConfigField label="Value" description="Value to set">
          <Input
            value={data.propertyValue || ''}
            onChange={(e) => onUpdate({ propertyValue: e.target.value })}
            placeholder="e.g., published, {{title}}"
          />
        </ConfigField>
      )}

      {/* Filter Condition */}
      {data.transformType === 'filter' && (
        <ConfigField label="Condition" description="Keep items where...">
          <div className="flex gap-2">
            <Input
              value={data.filterProperty || ''}
              onChange={(e) => onUpdate({ filterProperty: e.target.value })}
              placeholder="property"
              className="flex-1"
            />
            <Select
              value={data.filterOperator || 'equals'}
              onValueChange={(value) => onUpdate({ filterOperator: value as 'equals' | 'not-equals' | 'contains' | 'gt' | 'lt' })}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">equals</SelectItem>
                <SelectItem value="not-equals">not equals</SelectItem>
                <SelectItem value="contains">contains</SelectItem>
                <SelectItem value="gt">greater than</SelectItem>
                <SelectItem value="lt">less than</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={data.filterValue || ''}
              onChange={(e) => onUpdate({ filterValue: e.target.value })}
              placeholder="value"
              className="flex-1"
            />
          </div>
        </ConfigField>
      )}

      {/* Format Template */}
      {data.transformType === 'format-text' && (
        <ConfigField label="Template" description="Use {{property}} for values">
          <Textarea
            value={data.template || ''}
            onChange={(e) => onUpdate({ template: e.target.value })}
            placeholder="Hello {{name}}, your score is {{score}}"
            rows={3}
          />
        </ConfigField>
      )}

      {/* Output Variable */}
      <ConfigField label="Output" description="Save result as">
        <Input
          value={data.outputVariable || ''}
          onChange={(e) => onUpdate({ outputVariable: e.target.value })}
          placeholder="e.g., result, formattedData"
        />
      </ConfigField>
    </div>
  )
}

// Delay Node Config
function DelayNodeConfig({ node, onUpdate }: NodeConfigProps) {
  const data = node.data as NodeData
  return (
    <div className="space-y-4">
      <ConfigField label="Node Name">
        <Input
          value={data.label || ''}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="Enter node name..."
        />
      </ConfigField>

      <ConfigField label="Duration">
        <div className="flex gap-2">
          <Input
            type="number"
            value={data.duration || 5}
            onChange={(e) => onUpdate({ duration: parseInt(e.target.value) || 0 })}
            className="w-24"
            min={0}
          />
          <Select
            value={data.unit || 'minutes'}
            onValueChange={(value) => onUpdate({ unit: value as 'seconds' | 'minutes' | 'hours' | 'days' })}
          >
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seconds">Seconds</SelectItem>
              <SelectItem value="minutes">Minutes</SelectItem>
              <SelectItem value="hours">Hours</SelectItem>
              <SelectItem value="days">Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </ConfigField>
    </div>
  )
}

// Webhook Node Config
function WebhookNodeConfig({ node, onUpdate }: NodeConfigProps) {
  const data = node.data as NodeData
  return (
    <div className="space-y-4">
      <ConfigField label="Node Name">
        <Input
          value={data.label || ''}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="Enter node name..."
        />
      </ConfigField>

      <ConfigField label="HTTP Method">
        <Select
          value={data.method || 'POST'}
          onValueChange={(value) => onUpdate({ method: value as 'GET' | 'POST' | 'PUT' | 'DELETE' })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>
      </ConfigField>

      <ConfigField label="URL" description="Endpoint to call">
        <Input
          value={data.url || ''}
          onChange={(e) => onUpdate({ url: e.target.value })}
          placeholder="https://api.example.com/webhook"
        />
      </ConfigField>

      <ConfigField label="Description">
        <Textarea
          value={data.description || ''}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="What does this webhook do?"
          rows={2}
        />
      </ConfigField>
    </div>
  )
}

// End Node Config
function EndNodeConfig({ node, onUpdate }: NodeConfigProps) {
  const data = node.data as NodeData
  return (
    <div className="space-y-4">
      <ConfigField label="Node Name">
        <Input
          value={data.label || ''}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="Enter node name..."
        />
      </ConfigField>

      <ConfigField label="Output Variable" description="Final output variable name">
        <Input
          value={data.outputVariable || ''}
          onChange={(e) => onUpdate({ outputVariable: e.target.value })}
          placeholder="e.g., finalResult"
        />
      </ConfigField>

      <div className="flex items-center justify-between py-2">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium">Notify on Complete</Label>
          <p className="text-xs text-muted-foreground">Send notification when workflow ends</p>
        </div>
        <Switch
          checked={data.notifyOnComplete || false}
          onCheckedChange={(checked) => onUpdate({ notifyOnComplete: checked })}
        />
      </div>
    </div>
  )
}

// Opportunities Node Config
function OpportunitiesNodeConfig({ node, onUpdate }: NodeConfigProps) {
  const data = node.data as NodeData
  return (
    <div className="space-y-4">
      <ConfigField label="Node Name">
        <Input
          value={data.label || ''}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="Enter node name..."
        />
      </ConfigField>

      <ConfigField label="Operation">
        <Select
          value={data.operation || 'list'}
          onValueChange={(value) => onUpdate({ operation: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="list">List Opportunities</SelectItem>
            <SelectItem value="get">Get Opportunity</SelectItem>
            <SelectItem value="add">Add Opportunity</SelectItem>
          </SelectContent>
        </Select>
      </ConfigField>

      {data.operation === 'list' && (
        <>
          <ConfigField label="Status Filter">
            <Select
              value={data.filters?.status || 'ALL'}
              onValueChange={(value) => onUpdate({ filters: { ...data.filters, status: value === 'ALL' ? undefined : value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="DISMISSED">Dismissed</SelectItem>
              </SelectContent>
            </Select>
          </ConfigField>

          <ConfigField label="Limit" description="Maximum number of results">
            <Input
              type="number"
              value={data.limit || 10}
              onChange={(e) => onUpdate({ limit: parseInt(e.target.value) || 10 })}
              min={1}
              max={100}
            />
          </ConfigField>
        </>
      )}

      {data.operation === 'get' && (
        <ConfigField label="Opportunity ID" description="ID or variable reference">
          <Input
            value={data.opportunityId || ''}
            onChange={(e) => onUpdate({ opportunityId: e.target.value })}
            placeholder="e.g., {{previousNode.id}}"
          />
        </ConfigField>
      )}

      <ConfigField label="Output Variable">
        <Input
          value={data.outputVariable || ''}
          onChange={(e) => onUpdate({ outputVariable: e.target.value })}
          placeholder="e.g., opportunities"
        />
      </ConfigField>
    </div>
  )
}

// Projects Node Config
function ProjectsNodeConfig({ node, onUpdate }: NodeConfigProps) {
  const data = node.data as NodeData
  return (
    <div className="space-y-4">
      <ConfigField label="Node Name">
        <Input
          value={data.label || ''}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="Enter node name..."
        />
      </ConfigField>

      <ConfigField label="Operation">
        <Select
          value={data.operation || 'get'}
          onValueChange={(value) => onUpdate({ operation: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="query">Query Projects</SelectItem>
            <SelectItem value="get">Get Project</SelectItem>
            <SelectItem value="update">Update Project</SelectItem>
          </SelectContent>
        </Select>
      </ConfigField>

      {(data.operation === 'get' || data.operation === 'update') && (
        <ConfigField label="Project ID" description="ID or variable reference">
          <Input
            value={data.projectId || ''}
            onChange={(e) => onUpdate({ projectId: e.target.value })}
            placeholder="e.g., {{context.projectId}}"
          />
        </ConfigField>
      )}

      <ConfigField label="Output Variable">
        <Input
          value={data.outputVariable || ''}
          onChange={(e) => onUpdate({ outputVariable: e.target.value })}
          placeholder="e.g., project"
        />
      </ConfigField>
    </div>
  )
}

// Content Node Config
function ContentNodeConfig({ node, onUpdate }: NodeConfigProps) {
  const data = node.data as NodeData
  return (
    <div className="space-y-4">
      <ConfigField label="Node Name">
        <Input
          value={data.label || ''}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="Enter node name..."
        />
      </ConfigField>

      <ConfigField label="Operation">
        <Select
          value={data.operation || 'create'}
          onValueChange={(value) => onUpdate({ operation: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="query">Query Content</SelectItem>
            <SelectItem value="create">Create Content</SelectItem>
            <SelectItem value="update">Update Content</SelectItem>
            <SelectItem value="publish">Publish Content</SelectItem>
          </SelectContent>
        </Select>
      </ConfigField>
    </div>
  )
}

// ============================================================
// CONFIG SELECTOR
// ============================================================

const configComponents: Record<WorkflowNodeType, React.ComponentType<NodeConfigProps>> = {
  start: StartNodeConfig,
  agent: AgentNodeConfig,
  condition: ConditionNodeConfig,
  action: ActionNodeConfig,
  transform: TransformNodeConfig,
  delay: DelayNodeConfig,
  webhook: WebhookNodeConfig,
  end: EndNodeConfig,
  opportunities: OpportunitiesNodeConfig,
  projects: ProjectsNodeConfig,
  content: ContentNodeConfig,
  // AI Sub-nodes
  'ai-model': AIModelNodeConfig,
  'ai-memory': AIMemoryNodeConfig,
  'ai-tool': AIToolNodeConfig,
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export const NodeConfigPanel = memo(function NodeConfigPanel({
  node,
  onUpdate,
  projectId,
}: NodeConfigPanelProps) {
  const handleUpdate = useCallback(
    (data: Partial<WorkflowNode['data']>) => {
      if (node) {
        onUpdate(node.id, data)
      }
    },
    [node, onUpdate]
  )

  if (!node) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-polar-800 mb-4">
          <Settings2 className="h-6 w-6 text-gray-400 dark:text-polar-500" />
        </div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          No Node Selected
        </h3>
        <p className="text-xs text-gray-500 dark:text-polar-400 max-w-[200px]">
          Click on a node in the canvas to view and edit its configuration
        </p>
      </div>
    )
  }

  const nodeType = node.type as WorkflowNodeType
  const info = nodeTypeInfo[nodeType]
  const ConfigComponent = configComponents[nodeType]
  const Icon = info?.icon || Settings2

  return (
    <div className="flex flex-col h-full">
      {/* Node Type Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-polar-800">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${info?.color || '#6b7280'}15` }}
        >
          <Icon className="h-5 w-5" style={{ color: info?.color || '#6b7280' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {info?.label || 'Node'}
            </span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {node.id}
            </Badge>
          </div>
          <p className="text-xs text-gray-500 dark:text-polar-400 truncate">
            {(node.data as NodeData).label || 'Untitled'}
          </p>
        </div>
      </div>

      {/* Config Form */}
      <div className="flex-1 overflow-y-auto p-4">
        {ConfigComponent && <ConfigComponent node={node} onUpdate={handleUpdate} projectId={projectId} />}
      </div>
    </div>
  )
})

