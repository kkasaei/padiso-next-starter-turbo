import type { Node, Edge } from '@xyflow/react'

// ============================================================
// WORKFLOW NODE TYPES
// ============================================================

export type WorkflowNodeType =
  | 'start'
  | 'agent'
  | 'condition'
  | 'action'
  | 'transform'
  | 'delay'
  | 'webhook'
  | 'opportunities'
  | 'projects'
  | 'content'
  | 'end'
  // AI Sub-nodes (connect to Agent node)
  | 'ai-model'
  | 'ai-memory'
  | 'ai-tool'

export interface BaseNodeData {
  label: string
  description?: string
  [key: string]: unknown
}

export interface StartNodeData extends BaseNodeData {
  trigger: 'manual' | 'schedule' | 'webhook' | 'event'
  // Schedule configuration
  scheduleMode?: 'simple' | 'cron'
  frequency?: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'custom'
  time?: string // HH:mm format
  timezone?: string
  dayOfWeek?: string // 0-6 (Sunday-Saturday)
  dayOfMonth?: string // 1-31
  minute?: string // 0-59 (for hourly)
  interval?: number // For custom frequency
  intervalUnit?: 'minutes' | 'hours'
  cronExpression?: string
  // Legacy
  schedule?: string
  webhookUrl?: string
}

export interface AgentNodeData extends BaseNodeData {
  agentId?: string
  agentName?: string
  // Prompts
  systemPrompt?: string
  userPrompt?: string
  // Output Configuration
  outputFormat: 'text' | 'markdown' | 'json'
  outputVariable?: string
  jsonSchema?: string
  // Connected Sub-nodes (populated via edges)
  connectedModel?: string // Node ID of connected ai-model
  connectedMemory?: string // Node ID of connected ai-memory
  connectedTools?: string[] // Node IDs of connected ai-tools
}

// ============================================================
// AI SUB-NODE TYPES (Connect to Agent node)
// ============================================================

export interface AIModelNodeData extends BaseNodeData {
  provider: 'openai' | 'anthropic' | 'google' | 'mistral'
  model: string
  // OpenAI models
  // 'gpt-5o' | 'gpt-5o-mini' | 'gpt-4-turbo' | 'gpt-4'
  // Anthropic models
  // 'claude-3-opus' | 'claude-3-sonnet' | 'claude-3-haiku'
  temperature?: number
  maxTokens?: number
}

export interface AIMemoryNodeData extends BaseNodeData {
  memoryType: 'buffer' | 'conversation' | 'vector' | 'postgres' | 'redis'
  // Buffer Memory
  windowSize?: number
  // Vector Memory
  vectorStore?: string
  topK?: number
  // Database Memory
  connectionString?: string
  tableName?: string
}

export interface AIToolNodeData extends BaseNodeData {
  toolType: 'http' | 'code' | 'search' | 'database' | 'integration'
  // HTTP Tool
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url?: string
  headers?: Record<string, string>
  // Code Tool
  codeLanguage?: 'javascript' | 'python'
  code?: string
  // Integration Tool
  integration?: string // e.g., 'jira', 'slack', 'github'
  operation?: string // e.g., 'create:user', 'getAll:user'
}

export interface ConditionNodeData extends BaseNodeData {
  condition: string
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'exists' | 'custom'
  value?: string
}

export interface ActionNodeData extends BaseNodeData {
  actionType: 'email' | 'slack' | 'http' | 'database' | 'file'
  config?: Record<string, unknown>
}

export interface TransformNodeData extends BaseNodeData {
  transformType: 
    | 'get-first' 
    | 'get-last' 
    | 'get-property'
    | 'set-property' 
    | 'filter'
    | 'format-text'
    | 'merge'
    | 'count'
  inputVariable?: string
  outputVariable?: string
  // For get/set property
  propertyName?: string
  propertyValue?: string
  // For filter
  filterProperty?: string
  filterOperator?: 'equals' | 'not-equals' | 'contains' | 'gt' | 'lt'
  filterValue?: string
  // For format-text
  template?: string
}

export interface DelayNodeData extends BaseNodeData {
  duration: number
  unit: 'seconds' | 'minutes' | 'hours' | 'days'
}

export interface WebhookNodeData extends BaseNodeData {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
  headers?: Record<string, string>
}

export interface EndNodeData extends BaseNodeData {
  outputVariable?: string
  notifyOnComplete?: boolean
}

export interface OpportunitiesNodeData extends BaseNodeData {
  operation: 'list' | 'get' | 'add'
  filters?: {
    category?: string
    status?: string
    impact?: string
  }
  opportunityId?: string // For 'get' operation
  limit?: number
  outputVariable?: string
}

export interface ProjectsNodeData extends BaseNodeData {
  operation: 'query' | 'get' | 'update'
  projectId?: string
  outputVariable?: string
}

export interface ContentNodeData extends BaseNodeData {
  operation: 'query' | 'create' | 'update' | 'publish'
  contentType?: 'blog' | 'page' | 'article'
  filters?: Record<string, unknown>
  outputVariable?: string
}

export type WorkflowNodeData =
  | StartNodeData
  | AgentNodeData
  | ConditionNodeData
  | ActionNodeData
  | TransformNodeData
  | DelayNodeData
  | WebhookNodeData
  | OpportunitiesNodeData
  | ProjectsNodeData
  | ContentNodeData
  | EndNodeData
  // AI Sub-nodes
  | AIModelNodeData
  | AIMemoryNodeData
  | AIToolNodeData

// ============================================================
// WORKFLOW TYPES
// ============================================================

export type WorkflowNode = Node<WorkflowNodeData, WorkflowNodeType>
export type WorkflowEdge = Edge

export interface Workflow {
  id: string
  name: string
  description: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  status: 'draft' | 'active' | 'paused' | 'archived'
  createdAt: string
  updatedAt: string
  lastRun?: string
  totalRuns: number
}

// ============================================================
// NODE DEFINITIONS FOR SIDEBAR
// ============================================================

export interface NodeDefinition {
  type: WorkflowNodeType
  label: string
  description: string
  icon: string
  category: 'triggers' | 'logic' | 'actions' | 'integrations' | 'data' | 'ai'
  color: string
  isSubNode?: boolean // For AI sub-nodes that connect to Agent
}

export const NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'start',
    label: 'Start',
    description: 'Workflow entry point',
    icon: 'play',
    category: 'triggers',
    color: '#22c55e',
  },
  {
    type: 'agent',
    label: 'AI Agent',
    description: 'Run an AI agent with model, memory & tools',
    icon: 'bot',
    category: 'logic',
    color: '#6366f1',
  },
  {
    type: 'condition',
    label: 'Condition',
    description: 'Branch based on conditions',
    icon: 'git-branch',
    category: 'logic',
    color: '#f59e0b',
  },
  {
    type: 'action',
    label: 'Action',
    description: 'Perform an action',
    icon: 'zap',
    category: 'actions',
    color: '#ec4899',
  },
  {
    type: 'transform',
    label: 'Transform',
    description: 'Transform data',
    icon: 'shuffle',
    category: 'logic',
    color: '#8b5cf6',
  },
  {
    type: 'delay',
    label: 'Delay',
    description: 'Wait for a duration',
    icon: 'clock',
    category: 'logic',
    color: '#64748b',
  },
  {
    type: 'webhook',
    label: 'Webhook',
    description: 'Call external API',
    icon: 'globe',
    category: 'integrations',
    color: '#0ea5e9',
  },
  {
    type: 'end',
    label: 'End',
    description: 'Workflow exit point',
    icon: 'flag',
    category: 'triggers',
    color: '#ef4444',
  },
  // SearchFit Data Sources
  {
    type: 'opportunities',
    label: 'Opportunities',
    description: 'List, get, or add opportunities',
    icon: 'lightbulb',
    category: 'data',
    color: '#f59e0b',
  },
  {
    type: 'projects',
    label: 'Projects',
    description: 'Access project data',
    icon: 'folder',
    category: 'data',
    color: '#3b82f6',
  },
  {
    type: 'content',
    label: 'Content',
    description: 'Manage content & blog posts',
    icon: 'file-text',
    category: 'data',
    color: '#10b981',
  },
  // AI Sub-nodes (connect to Agent)
  {
    type: 'ai-model',
    label: 'Chat Model',
    description: 'LLM provider (OpenAI, Anthropic, etc.)',
    icon: 'sparkles',
    category: 'ai',
    color: '#818cf8',
    isSubNode: true,
  },
  {
    type: 'ai-memory',
    label: 'Memory',
    description: 'Conversation memory & context',
    icon: 'brain',
    category: 'ai',
    color: '#a78bfa',
    isSubNode: true,
  },
  {
    type: 'ai-tool',
    label: 'Tool',
    description: 'Tool the agent can use',
    icon: 'wrench',
    category: 'ai',
    color: '#c4b5fd',
    isSubNode: true,
  },
]

export const NODE_CATEGORIES = [
  { id: 'triggers', label: 'Triggers' },
  { id: 'data', label: 'SearchFit Data' },
  { id: 'logic', label: 'Logic' },
  { id: 'ai', label: 'AI Components' },
  { id: 'actions', label: 'Actions' },
  { id: 'integrations', label: 'Integrations' },
] as const

