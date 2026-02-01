// ============================================================
// AGENT TYPES
// ============================================================
export type AgentStatus = 'active' | 'paused' | 'error' | 'idle'
export type AgentType = 'Content' | 'Research' | 'Monitoring' | 'Outreach' | 'Analysis' | 'Technical'
export type AgentTrigger = 'manual' | 'automated'

export interface Agent {
  id: string
  name: string
  description: string
  status: AgentStatus
  lastRun: string
  totalRuns: number
  successRate: number
  avgDuration: string
  createdAt: string
  schedule: string
  type: AgentType
  trigger: AgentTrigger
}

// ============================================================
// MOCK AGENTS DATA
// ============================================================
export const MOCK_AGENTS: Agent[] = [
  {
    id: '1',
    name: 'Content Optimizer',
    description: 'Analyzes and optimizes existing content for SEO performance and readability',
    status: 'active',
    lastRun: '2 hours ago',
    totalRuns: 124,
    successRate: 98,
    avgDuration: '32s',
    createdAt: '2 weeks ago',
    schedule: 'Daily at 9:00 AM',
    type: 'Content',
    trigger: 'automated',
  },
  {
    id: '2',
    name: 'Keyword Research Bot',
    description: 'Discovers new keyword opportunities and analyzes search trends',
    status: 'active',
    lastRun: '5 hours ago',
    totalRuns: 256,
    successRate: 95,
    avgDuration: '1m 15s',
    createdAt: '1 month ago',
    schedule: 'Every 6 hours',
    type: 'Research',
    trigger: 'automated',
  },
  {
    id: '3',
    name: 'Competitor Monitor',
    description: 'Tracks competitor rankings, content updates, and backlink changes',
    status: 'paused',
    lastRun: '1 day ago',
    totalRuns: 89,
    successRate: 92,
    avgDuration: '2m 30s',
    createdAt: '3 weeks ago',
    schedule: 'On demand',
    type: 'Monitoring',
    trigger: 'manual',
  },
]

