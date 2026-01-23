// ============================================================
// STUDIO AGENT DETAIL MOCK DATA
// ============================================================

import type { Agent } from './agents'

// Activity status type
export type ActivityStatus = 'success' | 'error' | 'info'

export interface ActivityItem {
  id: string
  time: string
  action: string
  status: ActivityStatus
}

// Mock agent data - replace with actual fetch
export const MOCK_AGENT: Agent = {
  id: '1',
  name: 'Content Writer Pro',
  description: 'AI-powered content generation agent for blog posts and articles',
  status: 'active',
  lastRun: '2 hours ago',
  totalRuns: 234,
  successRate: 96,
  avgDuration: '45s',
  createdAt: '2 weeks ago',
  schedule: 'Daily at 9:00 AM AEST',
  type: 'Content',
  trigger: 'manual',
}

// Mock activity data
export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: '1', time: '2 hours ago', action: 'Generated 3 blog posts successfully', status: 'success' },
  { id: '2', time: '5 hours ago', action: 'Started scheduled content run', status: 'success' },
  { id: '3', time: '8 hours ago', action: 'Processed 5 content requests', status: 'success' },
  { id: '4', time: '1 day ago', action: 'Configuration updated by admin', status: 'info' },
  { id: '5', time: '2 days ago', action: 'Completed scheduled run with 100% success', status: 'success' },
  { id: '6', time: '3 days ago', action: 'API rate limit exceeded during run', status: 'error' },
  { id: '7', time: '4 days ago', action: 'Agent paused due to error threshold', status: 'error' },
  { id: '8', time: '5 days ago', action: 'New workflow version deployed', status: 'info' },
]

