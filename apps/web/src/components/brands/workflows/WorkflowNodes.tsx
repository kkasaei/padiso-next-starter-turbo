'use client'

import { memo, useMemo } from 'react'
import { Handle, Position } from '@xyflow/react'
import {
  Play,
  Bot,
  GitBranch,
  Zap,
  Shuffle,
  Clock,
  Globe,
  Flag,
  MoreHorizontal,
  Lightbulb,
  Folder,
  FileText,
  CalendarClock,
  Hand,
  Brain,
  Wrench,
} from 'lucide-react'
import { cn } from '@workspace/common/lib'
import type {
  StartNodeData,
  AgentNodeData,
  ConditionNodeData,
  ActionNodeData,
  TransformNodeData,
  DelayNodeData,
  WebhookNodeData,
  EndNodeData,
  OpportunitiesNodeData,
  ProjectsNodeData,
  ContentNodeData,
  AIModelNodeData,
  AIMemoryNodeData,
  AIToolNodeData,
} from './workflow-types'

// ============================================================
// CUSTOM NODE PROPS TYPE
// React Flow v12 requires proper typing for node components
// ============================================================

interface CustomNodeProps<T> {
  id: string
  data: T
  selected?: boolean
  type?: string
}

// ============================================================
// BASE NODE WRAPPER
// ============================================================

interface BaseNodeProps {
  children: React.ReactNode
  color: string
  selected?: boolean
  hasSourceHandle?: boolean
  hasTargetHandle?: boolean
  sourceHandlePosition?: Position
  targetHandlePosition?: Position
  multipleSourceHandles?: boolean
}

function BaseNode({
  children,
  color,
  selected,
  hasSourceHandle = true,
  hasTargetHandle = true,
  sourceHandlePosition = Position.Right,
  targetHandlePosition = Position.Left,
  multipleSourceHandles = false,
}: BaseNodeProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl border-2 bg-white dark:bg-polar-900 shadow-md transition-all min-w-[180px]',
        selected
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-polar-900'
          : 'hover:shadow-lg'
      )}
      style={{ borderColor: color }}
    >
      {hasTargetHandle && (
        <Handle
          type="target"
          position={targetHandlePosition}
          className="!w-3 !h-3 !bg-gray-400 dark:!bg-polar-500 !border-2 !border-white dark:!border-polar-900"
        />
      )}
      {children}
      {hasSourceHandle && !multipleSourceHandles && (
        <Handle
          type="source"
          position={sourceHandlePosition}
          className="!w-3 !h-3 !border-2 !border-white dark:!border-polar-900"
          style={{ backgroundColor: color }}
        />
      )}
      {hasSourceHandle && multipleSourceHandles && (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="true"
            className="!w-3 !h-3 !bg-green-500 !border-2 !border-white dark:!border-polar-900"
            style={{ top: '30%' }}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="false"
            className="!w-3 !h-3 !bg-red-500 !border-2 !border-white dark:!border-polar-900"
            style={{ top: '70%' }}
          />
        </>
      )}
    </div>
  )
}

// ============================================================
// NODE HEADER
// ============================================================

interface NodeHeaderProps {
  icon: React.ReactNode
  label: string
  color: string
  onOptionsClick?: () => void
}

function NodeHeader({ icon, label, color, onOptionsClick }: NodeHeaderProps) {
  return (
    <div
      className="flex items-center justify-between gap-2 px-3 py-2 rounded-t-[10px]"
      style={{ backgroundColor: `${color}15` }}
    >
      <div className="flex items-center gap-2">
        <div
          className="flex h-6 w-6 items-center justify-center rounded-md"
          style={{ backgroundColor: color }}
        >
          <span className="text-white">{icon}</span>
        </div>
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </span>
      </div>
      {onOptionsClick && (
        <button
          onClick={onOptionsClick}
          className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5"
        >
          <MoreHorizontal className="h-4 w-4 text-gray-400" />
        </button>
      )}
    </div>
  )
}

// ============================================================
// NODE CONTENT
// ============================================================

interface NodeContentProps {
  children?: React.ReactNode
}

function NodeContent({ children }: NodeContentProps) {
  return (
    <div className="px-3 py-2 text-xs text-gray-500 dark:text-polar-400">
      {children}
    </div>
  )
}

// ============================================================
// SCHEDULE DESCRIPTION HELPER
// ============================================================

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getScheduleDisplayText(data: StartNodeData): string {
  if (data.trigger !== 'schedule') return ''

  const scheduleMode = data.scheduleMode || 'simple'

  if (scheduleMode === 'cron' && data.cronExpression) {
    return data.cronExpression
  }

  const frequency = data.frequency || 'daily'
  const time = data.time || '09:00'

  switch (frequency) {
    case 'hourly':
      const minute = data.minute || '0'
      return `Every hour at :${minute.padStart(2, '0')}`
    case 'daily':
      return `Daily at ${time}`
    case 'weekly':
      const dayOfWeek = data.dayOfWeek || '1'
      const dayName = WEEKDAY_NAMES[parseInt(dayOfWeek)] || 'Mon'
      return `${dayName} at ${time}`
    case 'monthly':
      const dayOfMonth = data.dayOfMonth || '1'
      return `${dayOfMonth}${dayOfMonth === '1' ? 'st' : dayOfMonth === '2' ? 'nd' : dayOfMonth === '3' ? 'rd' : 'th'} at ${time}`
    case 'custom':
      const interval = data.interval || 30
      const unit = data.intervalUnit || 'minutes'
      return `Every ${interval} ${unit}`
    default:
      return 'Scheduled'
  }
}

// ============================================================
// START NODE
// ============================================================

const StartNodeComponent = memo(function StartNode({
  data,
  selected,
}: CustomNodeProps<StartNodeData>) {
  const color = '#22c55e'

  const scheduleText = useMemo(() => getScheduleDisplayText(data), [data])

  const isManual = data.trigger === 'manual' || !data.trigger
  const isSchedule = data.trigger === 'schedule'

  return (
    <BaseNode color={color} selected={selected} hasTargetHandle={false}>
      <NodeHeader
        icon={<Play className="h-3.5 w-3.5" />}
        label={data.label || 'Start'}
        color={color}
      />
      <NodeContent>
        <div className="flex items-center gap-2">
          {isManual && (
            <>
              <Hand className="h-3.5 w-3.5 text-gray-400" />
              <span>Manual trigger</span>
            </>
          )}
          {isSchedule && (
            <>
              <CalendarClock className="h-3.5 w-3.5 text-green-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {scheduleText || 'Scheduled'}
              </span>
            </>
          )}
          {data.trigger === 'webhook' && (
            <>
              <Globe className="h-3.5 w-3.5 text-blue-500" />
              <span>Webhook trigger</span>
            </>
          )}
          {data.trigger === 'event' && (
            <>
              <Zap className="h-3.5 w-3.5 text-yellow-500" />
              <span>Event-based</span>
            </>
          )}
        </div>
        {isSchedule && data.timezone && data.timezone !== 'UTC' && (
          <div className="text-[10px] text-gray-400 mt-1">
            {data.timezone.split('/').pop()?.replace('_', ' ')}
          </div>
        )}
      </NodeContent>
    </BaseNode>
  )
})

// ============================================================
// AGENT NODE (with Model, Memory, Tools handles like N8N)
// ============================================================

const OUTPUT_FORMAT_LABELS: Record<string, string> = {
  'text': 'Text',
  'markdown': 'Markdown',
  'json': 'JSON',
}

const AgentNodeComponent = memo(function AgentNode({
  data,
  selected,
}: CustomNodeProps<AgentNodeData>) {
  const color = '#6366f1'
  const formatLabel = OUTPUT_FORMAT_LABELS[data.outputFormat] || 'Text'

  // Get a preview of the user prompt
  const promptPreview = data.userPrompt
    ? (data.userPrompt.length > 30 ? data.userPrompt.slice(0, 30) + '...' : data.userPrompt)
    : null

  // Check which sub-nodes are connected
  const hasModel = !!data.connectedModel
  const hasMemory = !!data.connectedMemory
  const hasTools = data.connectedTools && data.connectedTools.length > 0

  return (
    <div className="relative">
      {/* Main Node */}
      <div
        className={cn(
          'relative rounded-xl border-2 bg-white dark:bg-polar-900 shadow-md transition-all min-w-[200px]',
          selected
            ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-polar-900'
            : 'hover:shadow-lg'
        )}
        style={{ borderColor: color }}
      >
        {/* Main Input Handle (Left) */}
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !bg-gray-400 dark:!bg-polar-500 !border-2 !border-white dark:!border-polar-900"
        />

        {/* Node Content */}
        <NodeHeader
          icon={<Bot className="h-3.5 w-3.5" />}
          label={data.label || 'AI Agent'}
          color={color}
        />
        <NodeContent>
          <div className="flex flex-col gap-1.5">
            {/* Output Format Badge */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                Tools Agent
              </span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-polar-800 text-gray-600 dark:text-polar-400">
                {formatLabel}
              </span>
            </div>

            {/* Prompt Preview */}
            {promptPreview ? (
              <span className="text-[10px] text-gray-500 dark:text-polar-400 line-clamp-2">
                {promptPreview}
              </span>
            ) : (
              <span className="text-[10px] text-gray-400 dark:text-polar-500 italic">
                Configure prompts...
              </span>
            )}

            {/* Output Variable */}
            {data.outputVariable && (
              <span className="text-[10px] text-gray-400 dark:text-polar-500">
                → {data.outputVariable}
              </span>
            )}
          </div>
        </NodeContent>

        {/* Main Output Handle (Right) */}
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !border-2 !border-white dark:!border-polar-900"
          style={{ backgroundColor: color }}
        />

        {/* Sub-node Handles on Bottom Border */}
        {/* Chat Model Handle */}
        <Handle
          type="target"
          position={Position.Bottom}
          id="model"
          className={cn(
            '!w-2.5 !h-2.5 !border-2 !border-white dark:!border-polar-900',
            hasModel ? '!bg-indigo-500' : '!bg-gray-300 dark:!bg-polar-600'
          )}
          style={{ left: '25%' }}
        />

        {/* Memory Handle */}
        <Handle
          type="target"
          position={Position.Bottom}
          id="memory"
          className={cn(
            '!w-2.5 !h-2.5 !border-2 !border-white dark:!border-polar-900',
            hasMemory ? '!bg-purple-500' : '!bg-gray-300 dark:!bg-polar-600'
          )}
          style={{ left: '50%' }}
        />

        {/* Tool Handle */}
        <Handle
          type="target"
          position={Position.Bottom}
          id="tool"
          className={cn(
            '!w-2.5 !h-2.5 !border-2 !border-white dark:!border-polar-900',
            hasTools ? '!bg-violet-500' : '!bg-gray-300 dark:!bg-polar-600'
          )}
          style={{ left: '75%' }}
        />
      </div>

      {/* Labels below the node */}
      <div className="flex justify-between px-2 mt-1">
        <span className="text-[8px] text-gray-400 dark:text-polar-500" style={{ marginLeft: '15%' }}>
          Chat Model{!hasModel && <span className="text-red-400">*</span>}
        </span>
        <span className="text-[8px] text-gray-400 dark:text-polar-500">
          Memory
        </span>
        <span className="text-[8px] text-gray-400 dark:text-polar-500" style={{ marginRight: '15%' }}>
          Tool
        </span>
      </div>
    </div>
  )
})

// ============================================================
// CONDITION NODE
// ============================================================

const ConditionNodeComponent = memo(function ConditionNode({
  data,
  selected,
}: CustomNodeProps<ConditionNodeData>) {
  const color = '#f59e0b'

  return (
    <BaseNode color={color} selected={selected} multipleSourceHandles>
      <NodeHeader
        icon={<GitBranch className="h-3.5 w-3.5" />}
        label={data.label || 'Condition'}
        color={color}
      />
      <NodeContent>
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] bg-gray-100 dark:bg-polar-800 px-1.5 py-0.5 rounded">
            {data.condition || 'if condition'}
          </span>
          <div className="flex justify-between text-[10px]">
            <span className="text-green-600 dark:text-green-400">✓ True</span>
            <span className="text-red-600 dark:text-red-400">✗ False</span>
          </div>
        </div>
      </NodeContent>
    </BaseNode>
  )
})

// ============================================================
// ACTION NODE
// ============================================================

const ActionNodeComponent = memo(function ActionNode({
  data,
  selected,
}: CustomNodeProps<ActionNodeData>) {
  const color = '#ec4899'

  const actionLabels = {
    email: 'Send email',
    slack: 'Send Slack message',
    http: 'HTTP request',
    database: 'Database query',
    file: 'File operation',
  }

  return (
    <BaseNode color={color} selected={selected}>
      <NodeHeader
        icon={<Zap className="h-3.5 w-3.5" />}
        label={data.label || 'Action'}
        color={color}
      />
      <NodeContent>
        {actionLabels[data.actionType] || data.description || 'Configure action'}
      </NodeContent>
    </BaseNode>
  )
})

// ============================================================
// TRANSFORM NODE
// ============================================================

const TRANSFORM_LABELS: Record<string, string> = {
  'get-first': 'Get First',
  'get-last': 'Get Last',
  'get-property': 'Get Property',
  'set-property': 'Set Property',
  'filter': 'Filter',
  'format-text': 'Format Text',
  'merge': 'Merge',
  'count': 'Count',
}

const TransformNodeComponent = memo(function TransformNode({
  data,
  selected,
}: CustomNodeProps<TransformNodeData>) {
  const color = '#8b5cf6'
  const typeLabel = TRANSFORM_LABELS[data.transformType] || data.transformType || 'Transform'

  // Build detail text
  let detailText = ''
  if (data.inputVariable && data.outputVariable) {
    detailText = `${data.inputVariable} → ${data.outputVariable}`
  } else if (data.inputVariable) {
    detailText = `From: ${data.inputVariable}`
  } else if (data.outputVariable) {
    detailText = `To: ${data.outputVariable}`
  }

  return (
    <BaseNode color={color} selected={selected}>
      <NodeHeader
        icon={<Shuffle className="h-3.5 w-3.5" />}
        label={data.label || 'Transform'}
        color={color}
      />
      <NodeContent>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-purple-600 dark:text-purple-400">
            {typeLabel}
          </span>
          {detailText && (
            <span className="text-[10px] text-gray-400 dark:text-polar-500">
              {detailText}
            </span>
          )}
        </div>
      </NodeContent>
    </BaseNode>
  )
})

// ============================================================
// DELAY NODE
// ============================================================

const DelayNodeComponent = memo(function DelayNode({
  data,
  selected,
}: CustomNodeProps<DelayNodeData>) {
  const color = '#64748b'

  return (
    <BaseNode color={color} selected={selected}>
      <NodeHeader
        icon={<Clock className="h-3.5 w-3.5" />}
        label={data.label || 'Delay'}
        color={color}
      />
      <NodeContent>
        Wait {data.duration} {data.unit}
      </NodeContent>
    </BaseNode>
  )
})

// ============================================================
// WEBHOOK NODE
// ============================================================

const WebhookNodeComponent = memo(function WebhookNode({
  data,
  selected,
}: CustomNodeProps<WebhookNodeData>) {
  const color = '#0ea5e9'

  return (
    <BaseNode color={color} selected={selected}>
      <NodeHeader
        icon={<Globe className="h-3.5 w-3.5" />}
        label={data.label || 'Webhook'}
        color={color}
      />
      <NodeContent>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-polar-800">
            {data.method} {data.url ? new URL(data.url).hostname : 'URL'}
          </span>
        </div>
      </NodeContent>
    </BaseNode>
  )
})

// ============================================================
// END NODE
// ============================================================

const EndNodeComponent = memo(function EndNode({
  data,
  selected,
}: CustomNodeProps<EndNodeData>) {
  const color = '#ef4444'

  return (
    <BaseNode color={color} selected={selected} hasSourceHandle={false}>
      <NodeHeader
        icon={<Flag className="h-3.5 w-3.5" />}
        label={data.label || 'End'}
        color={color}
      />
      <NodeContent>
        {data.notifyOnComplete ? 'Notify on complete' : 'Workflow ends'}
      </NodeContent>
    </BaseNode>
  )
})

// ============================================================
// OPPORTUNITIES NODE
// ============================================================

const OpportunitiesNodeComponent = memo(function OpportunitiesNode({
  data,
  selected,
}: CustomNodeProps<OpportunitiesNodeData>) {
  const color = '#f59e0b'

  const operationLabels = {
    list: 'List opportunities',
    get: 'Get opportunity',
    add: 'Add opportunity',
  }

  const operationDescriptions = {
    list: data.filters ? `Filtered by ${Object.keys(data.filters).join(', ')}` : 'All opportunities',
    get: data.opportunityId ? `ID: ${data.opportunityId.slice(0, 8)}...` : 'Select opportunity',
    add: 'Create new opportunity',
  }

  return (
    <BaseNode color={color} selected={selected}>
      <NodeHeader
        icon={<Lightbulb className="h-3.5 w-3.5" />}
        label={data.label || 'Opportunities'}
        color={color}
      />
      <NodeContent>
        <div className="flex flex-col gap-1">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {operationLabels[data.operation] || 'Select operation'}
          </span>
          <span className="text-[10px]">
            {operationDescriptions[data.operation]}
          </span>
          {data.limit && data.operation === 'list' && (
            <span className="text-[10px] text-gray-400">Limit: {data.limit}</span>
          )}
        </div>
      </NodeContent>
    </BaseNode>
  )
})

// ============================================================
// PROJECTS NODE
// ============================================================

const ProjectsNodeComponent = memo(function ProjectsNode({
  data,
  selected,
}: CustomNodeProps<ProjectsNodeData>) {
  const color = '#3b82f6'

  const operationLabels = {
    query: 'Query projects',
    get: 'Get project',
    update: 'Update project',
  }

  return (
    <BaseNode color={color} selected={selected}>
      <NodeHeader
        icon={<Folder className="h-3.5 w-3.5" />}
        label={data.label || 'Projects'}
        color={color}
      />
      <NodeContent>
        <div className="flex flex-col gap-1">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {operationLabels[data.operation] || 'Select operation'}
          </span>
          {data.projectId && (
            <span className="text-[10px]">ID: {data.projectId.slice(0, 8)}...</span>
          )}
        </div>
      </NodeContent>
    </BaseNode>
  )
})

// ============================================================
// CONTENT NODE
// ============================================================

const ContentNodeComponent = memo(function ContentNode({
  data,
  selected,
}: CustomNodeProps<ContentNodeData>) {
  const color = '#10b981'

  const operationLabels = {
    query: 'Query content',
    create: 'Create content',
    update: 'Update content',
    publish: 'Publish content',
  }

  const contentTypeLabels = {
    blog: 'Blog post',
    page: 'Page',
    article: 'Article',
  }

  return (
    <BaseNode color={color} selected={selected}>
      <NodeHeader
        icon={<FileText className="h-3.5 w-3.5" />}
        label={data.label || 'Content'}
        color={color}
      />
      <NodeContent>
        <div className="flex flex-col gap-1">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {operationLabels[data.operation] || 'Select operation'}
          </span>
          {data.contentType && (
            <span className="text-[10px]">
              Type: {contentTypeLabels[data.contentType]}
            </span>
          )}
        </div>
      </NodeContent>
    </BaseNode>
  )
})

// ============================================================
// AI MODEL NODE (Sub-node for Agent)
// ============================================================

const MODEL_PROVIDERS: Record<string, { label: string; icon: string }> = {
  openai: { label: 'OpenAI', icon: 'AI' },
  anthropic: { label: 'Anthropic', icon: 'A\\' },
  google: { label: 'Google', icon: 'G' },
  mistral: { label: 'Mistral', icon: 'M' },
}

const AIModelNodeComponent = memo(function AIModelNode({
  data,
  selected,
}: CustomNodeProps<AIModelNodeData>) {
  const color = '#818cf8'
  const provider = MODEL_PROVIDERS[data.provider] || { label: data.provider, icon: '?' }

  return (
    <div
      className={cn(
        'relative rounded-full border-2 bg-white dark:bg-polar-900 shadow-md transition-all min-w-[120px] p-3',
        selected
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-polar-900'
          : 'hover:shadow-lg'
      )}
      style={{ borderColor: color }}
    >
      {/* No target handle - this is a source-only node */}

      <div className="flex items-center gap-2">
        {/* Provider Icon */}
        <div
          className="flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-bold"
          style={{ backgroundColor: color }}
        >
          {provider.icon}
        </div>

        {/* Label */}
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {data.label || provider.label}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-polar-500">
            {data.model || 'Select model'}
          </span>
        </div>
      </div>

      {/* Source Handle (Top) - connects to Agent's model handle */}
      <Handle
        type="source"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !border-2 !border-white dark:!border-polar-900"
        style={{ backgroundColor: color }}
      />
    </div>
  )
})

// ============================================================
// AI MEMORY NODE (Sub-node for Agent)
// ============================================================

const MEMORY_TYPES: Record<string, string> = {
  buffer: 'Buffer',
  conversation: 'Conversation',
  vector: 'Vector Store',
  postgres: 'PostgreSQL',
  redis: 'Redis',
}

const AIMemoryNodeComponent = memo(function AIMemoryNode({
  data,
  selected,
}: CustomNodeProps<AIMemoryNodeData>) {
  const color = '#a78bfa'
  const memoryLabel = MEMORY_TYPES[data.memoryType] || data.memoryType

  return (
    <div
      className={cn(
        'relative rounded-full border-2 bg-white dark:bg-polar-900 shadow-md transition-all min-w-[120px] p-3',
        selected
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-polar-900'
          : 'hover:shadow-lg'
      )}
      style={{ borderColor: color }}
    >
      <div className="flex items-center gap-2">
        {/* Memory Icon */}
        <div
          className="flex items-center justify-center w-8 h-8 rounded-full text-white"
          style={{ backgroundColor: color }}
        >
          <Brain className="h-4 w-4" />
        </div>

        {/* Label */}
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {data.label || memoryLabel}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-polar-500">
            {memoryLabel}
          </span>
        </div>
      </div>

      {/* Source Handle (Top) - connects to Agent's memory handle */}
      <Handle
        type="source"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !border-2 !border-white dark:!border-polar-900"
        style={{ backgroundColor: color }}
      />
    </div>
  )
})

// ============================================================
// AI TOOL NODE (Sub-node for Agent)
// ============================================================

const TOOL_TYPES: Record<string, string> = {
  http: 'HTTP Request',
  code: 'Code',
  search: 'Web Search',
  database: 'Database',
  integration: 'Integration',
}

const AIToolNodeComponent = memo(function AIToolNode({
  data,
  selected,
}: CustomNodeProps<AIToolNodeData>) {
  const color = '#c4b5fd'
  const toolLabel = TOOL_TYPES[data.toolType] || data.toolType

  return (
    <div
      className={cn(
        'relative rounded-full border-2 bg-white dark:bg-polar-900 shadow-md transition-all min-w-[120px] p-3',
        selected
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-polar-900'
          : 'hover:shadow-lg'
      )}
      style={{ borderColor: color }}
    >
      <div className="flex items-center gap-2">
        {/* Tool Icon */}
        <div
          className="flex items-center justify-center w-8 h-8 rounded-full text-white"
          style={{ backgroundColor: color }}
        >
          <Wrench className="h-4 w-4" />
        </div>

        {/* Label */}
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {data.label || toolLabel}
          </span>
          {data.integration && data.operation && (
            <span className="text-[10px] text-gray-400 dark:text-polar-500">
              {data.operation}
            </span>
          )}
          {!data.integration && (
            <span className="text-[10px] text-gray-400 dark:text-polar-500">
              {toolLabel}
            </span>
          )}
        </div>
      </div>

      {/* Source Handle (Top) - connects to Agent's tool handle */}
      <Handle
        type="source"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !border-2 !border-white dark:!border-polar-900"
        style={{ backgroundColor: color }}
      />
    </div>
  )
})

// ============================================================
// EXPORTS
// ============================================================

export const nodeTypes = {
  start: StartNodeComponent,
  agent: AgentNodeComponent,
  condition: ConditionNodeComponent,
  action: ActionNodeComponent,
  transform: TransformNodeComponent,
  delay: DelayNodeComponent,
  webhook: WebhookNodeComponent,
  end: EndNodeComponent,
  opportunities: OpportunitiesNodeComponent,
  projects: ProjectsNodeComponent,
  content: ContentNodeComponent,
  // AI Sub-nodes
  'ai-model': AIModelNodeComponent,
  'ai-memory': AIMemoryNodeComponent,
  'ai-tool': AIToolNodeComponent,
}

export {
  StartNodeComponent,
  AgentNodeComponent,
  ConditionNodeComponent,
  ActionNodeComponent,
  TransformNodeComponent,
  DelayNodeComponent,
  WebhookNodeComponent,
  EndNodeComponent,
  OpportunitiesNodeComponent,
  ProjectsNodeComponent,
  ContentNodeComponent,
  AIModelNodeComponent,
  AIMemoryNodeComponent,
  AIToolNodeComponent,
}

