// ============================================================
// AGENT TYPES
// ============================================================

// Agent status enum (mirrors database enum)
export type AgentStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | 'ERROR' | 'IDLE'

// Agent trigger enum (mirrors database enum)
export type AgentTrigger = 'MANUAL' | 'SCHEDULE' | 'EVENT' | 'WEBHOOK'

// Agent run status enum (mirrors database enum)
export type AgentRunStatus = 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'CANCELLED'

// Agent type (mirrors database model)
export interface Agent {
  id: string
  orgId: string
  projectId: string | null
  name: string
  description: string | null
  isTemplate: boolean
  status: AgentStatus
  trigger: AgentTrigger
  schedule: string | null
  scheduleData: unknown | null
  nodes: unknown[]
  edges: unknown[]
  totalRuns: number
  successCount: number
  failureCount: number
  lastRunAt: Date | null
  avgDurationMs: number
  createdAt: Date
  updatedAt: Date
}

// AgentRun type (mirrors database model)
export interface AgentRun {
  id: string
  agentId: string
  status: AgentRunStatus
  triggeredBy: string
  triggeredById: string | null
  input: unknown | null
  startedAt: Date | null
  completedAt: Date | null
  durationMs: number | null
  output: unknown | null
  error: string | null
  logs: unknown | null
  contentDraftId: string | null
  opportunityId: string | null
  createdAt: Date
}

// ============================================================
// AGENT DTOs (Data Transfer Objects)
// ============================================================

export interface AgentDto {
  id: string
  orgId: string
  projectId: string | null
  name: string
  description: string | null
  isTemplate: boolean
  status: AgentStatus
  trigger: AgentTrigger
  schedule: string | null
  scheduleData: Record<string, unknown> | null
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  totalRuns: number
  successCount: number
  failureCount: number
  successRate: number // Computed
  lastRunAt: Date | null
  avgDurationMs: number
  createdAt: Date
  updatedAt: Date
}

export interface AgentRunDto {
  id: string
  agentId: string
  status: AgentRunStatus
  triggeredBy: string
  triggeredById: string | null
  input: Record<string, unknown> | null
  startedAt: Date | null
  completedAt: Date | null
  durationMs: number | null
  output: Record<string, unknown> | null
  error: string | null
  logs: AgentRunLog[] | null
  contentDraftId: string | null
  opportunityId: string | null
  createdAt: Date
}

// ============================================================
// WORKFLOW TYPES (ReactFlow)
// ============================================================

export interface WorkflowNodePosition {
  x: number
  y: number
}

export interface WorkflowNode {
  id: string
  type: string
  position: WorkflowNodePosition
  data: Record<string, unknown>
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
  type?: string
  animated?: boolean
  style?: Record<string, unknown>
  markerEnd?: unknown
}

// ============================================================
// EXECUTION TYPES
// ============================================================

export interface AgentRunLog {
  nodeId: string
  nodeName: string
  nodeType: string
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped'
  input?: Record<string, unknown>
  output?: Record<string, unknown>
  error?: string
  durationMs?: number
  timestamp: string
}

export interface AgentExecutionContext {
  agentId: string
  runId: string
  orgId: string
  projectId: string | null
  variables: Record<string, unknown>
  logs: AgentRunLog[]
}

// ============================================================
// LIST/FILTER TYPES
// ============================================================

export interface ListAgentsParams {
  status?: AgentStatus
  trigger?: AgentTrigger
  projectId?: string
  search?: string
  limit?: number
  offset?: number
}

export interface ListAgentRunsParams {
  agentId: string
  status?: AgentRunStatus
  limit?: number
  offset?: number
}

