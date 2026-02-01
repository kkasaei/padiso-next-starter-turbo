// ============================================================
// Admin Dashboard Mock Data
// Frontend-only mock data for admin interface
// ============================================================

import type {
  AdminStats,
  OrganizationAdmin,
  UsageMetric,
  CreditTransaction,
  TopOrganization,
} from '@/types/admin'

// ============================================================
// ADMIN STATS
// ============================================================
export const mockAdminStats: AdminStats = {
  totalOrganizations: 847,
  activeOrganizations: 623,
  trialingOrganizations: 156,
  totalProjects: 3245,
  activeProjects: 2891,
  totalAgents: 1247,
  totalTokensUsed: 15_847_293,
  totalReportsGenerated: 8734,
  totalCreditsIssued: 2_500_000,
  totalCreditsUsed: 1_847_293,
}

// ============================================================
// ORGANIZATIONS LIST
// ============================================================
export const mockOrganizations: OrganizationAdmin[] = [
  {
    id: '1',
    clerkOrganizationId: 'org_2abc123',
    name: 'Acme Corp',
    status: 'ACTIVE',
    creditsBalance: 15000,
    projectCount: 12,
    agentCount: 5,
    tokensUsed: 245000,
    reportsGenerated: 87,
    createdAt: '2024-06-15T10:30:00Z',
    trialEndsAt: null,
    subscription: {
      planName: 'Pro Plan',
      status: 'ACTIVE',
      priceAmount: 99,
    },
  },
  {
    id: '2',
    clerkOrganizationId: 'org_2def456',
    name: 'TechStart Inc',
    status: 'TRIALING',
    creditsBalance: 500,
    projectCount: 3,
    agentCount: 1,
    tokensUsed: 12000,
    reportsGenerated: 5,
    createdAt: '2024-12-20T14:20:00Z',
    trialEndsAt: '2025-01-20T14:20:00Z',
    subscription: null,
  },
  {
    id: '3',
    clerkOrganizationId: 'org_2ghi789',
    name: 'Global Marketing Agency',
    status: 'ACTIVE',
    creditsBalance: 45000,
    projectCount: 28,
    agentCount: 12,
    tokensUsed: 892000,
    reportsGenerated: 234,
    createdAt: '2024-03-10T08:00:00Z',
    trialEndsAt: null,
    subscription: {
      planName: 'Enterprise',
      status: 'ACTIVE',
      priceAmount: 299,
    },
  },
  {
    id: '4',
    clerkOrganizationId: 'org_2jkl012',
    name: 'Startup Labs',
    status: 'PAST_DUE',
    creditsBalance: 0,
    projectCount: 5,
    agentCount: 2,
    tokensUsed: 45000,
    reportsGenerated: 12,
    createdAt: '2024-09-05T11:45:00Z',
    trialEndsAt: null,
    subscription: {
      planName: 'Pro Plan',
      status: 'PAST_DUE',
      priceAmount: 99,
    },
  },
  {
    id: '5',
    clerkOrganizationId: 'org_2mno345',
    name: 'Digital First Co',
    status: 'ACTIVE',
    creditsBalance: 8500,
    projectCount: 8,
    agentCount: 3,
    tokensUsed: 156000,
    reportsGenerated: 56,
    createdAt: '2024-08-22T16:30:00Z',
    trialEndsAt: null,
    subscription: {
      planName: 'Growth',
      status: 'ACTIVE',
      priceAmount: 49,
    },
  },
  {
    id: '6',
    clerkOrganizationId: 'org_2pqr678',
    name: 'SEO Masters',
    status: 'CANCELED',
    creditsBalance: 2100,
    projectCount: 4,
    agentCount: 1,
    tokensUsed: 78000,
    reportsGenerated: 23,
    createdAt: '2024-05-12T09:15:00Z',
    trialEndsAt: null,
    subscription: {
      planName: 'Pro Plan',
      status: 'CANCELED',
      priceAmount: 99,
    },
  },
  {
    id: '7',
    clerkOrganizationId: 'org_2stu901',
    name: 'Content Kings',
    status: 'TRIALING',
    creditsBalance: 1000,
    projectCount: 2,
    agentCount: 0,
    tokensUsed: 5000,
    reportsGenerated: 2,
    createdAt: '2024-12-28T13:00:00Z',
    trialEndsAt: '2025-01-28T13:00:00Z',
    subscription: null,
  },
  {
    id: '8',
    clerkOrganizationId: 'org_2vwx234',
    name: 'Enterprise Solutions Ltd',
    status: 'ACTIVE',
    creditsBalance: 125000,
    projectCount: 45,
    agentCount: 18,
    tokensUsed: 2340000,
    reportsGenerated: 567,
    createdAt: '2024-01-08T07:30:00Z',
    trialEndsAt: null,
    subscription: {
      planName: 'Enterprise',
      status: 'ACTIVE',
      priceAmount: 499,
    },
  },
  {
    id: '9',
    clerkOrganizationId: 'org_2yza567',
    name: 'Small Biz SEO',
    status: 'ADMIN_SUSPENDED',
    creditsBalance: 0,
    projectCount: 1,
    agentCount: 0,
    tokensUsed: 15000,
    reportsGenerated: 8,
    createdAt: '2024-10-15T10:00:00Z',
    trialEndsAt: null,
    subscription: {
      planName: 'Growth',
      status: 'PAUSED',
      priceAmount: 49,
    },
  },
  {
    id: '10',
    clerkOrganizationId: 'org_2bcd890',
    name: 'AI Marketing Hub',
    status: 'ACTIVE',
    creditsBalance: 32000,
    projectCount: 15,
    agentCount: 7,
    tokensUsed: 456000,
    reportsGenerated: 145,
    createdAt: '2024-07-20T12:45:00Z',
    trialEndsAt: null,
    subscription: {
      planName: 'Pro Plan',
      status: 'ACTIVE',
      priceAmount: 99,
    },
  },
]

// ============================================================
// USAGE METRICS (Last 30 days)
// ============================================================
export const mockUsageMetrics: UsageMetric[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (29 - i))
  return {
    date: date.toISOString().split('T')[0],
    reports: Math.floor(Math.random() * 500) + 200,
    pdfs: Math.floor(Math.random() * 800) + 300,
    apiCalls: Math.floor(Math.random() * 50000) + 20000,
    tokensUsed: Math.floor(Math.random() * 2000000) + 500000,
  }
})

// ============================================================
// RECENT CREDIT TRANSACTIONS
// ============================================================
export const mockCreditTransactions: CreditTransaction[] = [
  {
    id: '1',
    organizationId: '3',
    organizationName: 'Global Marketing Agency',
    amount: 10000,
    type: 'ADMIN_GRANT',
    description: 'Enterprise onboarding bonus',
    performedBy: 'admin@searchfit.io',
    createdAt: '2025-01-02T09:30:00Z',
  },
  {
    id: '2',
    organizationId: '1',
    organizationName: 'Acme Corp',
    amount: 5000,
    type: 'PURCHASE',
    description: 'Credit package purchase',
    performedBy: 'billing@acme.com',
    createdAt: '2025-01-01T14:20:00Z',
  },
  {
    id: '3',
    organizationId: '8',
    organizationName: 'Enterprise Solutions Ltd',
    amount: 25000,
    type: 'ADMIN_GRANT',
    description: 'Annual plan credit allocation',
    performedBy: 'admin@searchfit.io',
    createdAt: '2024-12-31T11:00:00Z',
  },
  {
    id: '4',
    organizationId: '2',
    organizationName: 'TechStart Inc',
    amount: 500,
    type: 'BONUS',
    description: 'Trial welcome bonus',
    performedBy: 'system',
    createdAt: '2024-12-30T16:45:00Z',
  },
  {
    id: '5',
    organizationId: '5',
    organizationName: 'Digital First Co',
    amount: -2500,
    type: 'USAGE',
    description: 'Monthly overage charges',
    performedBy: 'system',
    createdAt: '2024-12-29T23:59:00Z',
  },
  {
    id: '6',
    organizationId: '4',
    organizationName: 'Startup Labs',
    amount: 1000,
    type: 'REFUND',
    description: 'Service credit for downtime',
    performedBy: 'support@searchfit.io',
    createdAt: '2024-12-28T10:15:00Z',
  },
]

// ============================================================
// TOP ORGANIZATIONS BY USAGE
// ============================================================
export const mockTopOrganizationsByTokens: TopOrganization[] = [
  { id: '8', name: 'Enterprise Solutions Ltd', value: 2340000, trend: 12 },
  { id: '3', name: 'Global Marketing Agency', value: 892000, trend: 8 },
  { id: '10', name: 'AI Marketing Hub', value: 456000, trend: 15 },
  { id: '1', name: 'Acme Corp', value: 245000, trend: -3 },
  { id: '5', name: 'Digital First Co', value: 156000, trend: 22 },
]

export const mockTopOrganizationsByReports: TopOrganization[] = [
  { id: '8', name: 'Enterprise Solutions Ltd', value: 567, trend: 18 },
  { id: '3', name: 'Global Marketing Agency', value: 234, trend: 5 },
  { id: '10', name: 'AI Marketing Hub', value: 145, trend: 28 },
  { id: '1', name: 'Acme Corp', value: 87, trend: -8 },
  { id: '5', name: 'Digital First Co', value: 56, trend: 12 },
]

export const mockTopOrganizationsByProjects: TopOrganization[] = [
  { id: '8', name: 'Enterprise Solutions Ltd', value: 45, trend: 5 },
  { id: '3', name: 'Global Marketing Agency', value: 28, trend: 10 },
  { id: '10', name: 'AI Marketing Hub', value: 15, trend: 7 },
  { id: '1', name: 'Acme Corp', value: 12, trend: 0 },
  { id: '5', name: 'Digital First Co', value: 8, trend: 14 },
]

