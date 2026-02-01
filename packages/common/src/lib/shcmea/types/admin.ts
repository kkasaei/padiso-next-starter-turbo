// ============================================================
// Admin Dashboard Types
// ============================================================

export interface AdminStats {
  totalOrganizations: number
  activeOrganizations: number
  trialingOrganizations: number
  totalProjects: number
  activeProjects: number
  totalAgents: number
  totalTokensUsed: number
  totalReportsGenerated: number
  totalCreditsIssued: number
  totalCreditsUsed: number
}

export interface OrganizationAdmin {
  id: string
  clerkOrganizationId: string
  name: string
  status: OrganizationStatus
  creditsBalance: number
  projectCount: number
  agentCount: number
  tokensUsed: number
  reportsGenerated: number
  createdAt: string
  trialEndsAt: string | null
  subscription: {
    planName: string | null
    status: string | null
    priceAmount: number | null
  } | null
}

export type OrganizationStatus =
  | 'ACTIVE'
  | 'TRIALING'
  | 'PAST_DUE'
  | 'CANCELED'
  | 'UNPAID'
  | 'INCOMPLETE'
  | 'INCOMPLETE_EXPIRED'
  | 'PAUSED'
  | 'ADMIN_SUSPENDED'
  | 'DELETED'

export interface UsageMetric {
  date: string
  reports: number
  pdfs: number
  apiCalls: number
  tokensUsed: number
}

export interface CreditTransaction {
  id: string
  organizationId: string
  organizationName: string
  amount: number
  type: 'PURCHASE' | 'ADMIN_GRANT' | 'USAGE' | 'REFUND' | 'BONUS'
  description: string
  performedBy: string
  createdAt: string
}

export interface TopOrganization {
  id: string
  name: string
  value: number
  trend: number
}

