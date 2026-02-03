// ============================================================
// BACKLINK EXCHANGE TYPES
// ============================================================

/**
 * Represents a backlink received from another website
 */
export interface BacklinkReceived {
  id: string
  date: string
  sourceWebsite: string
  sourceUrl: string
  article: string
  articleUrl: string
  domainRating: number
  linkValue: number
  status: 'verified' | 'pending' | 'lost'
}

/**
 * Represents a backlink given to another website
 */
export interface BacklinkGiven {
  id: string
  date: string
  destinationWebsite: string
  destinationUrl: string
  article: string
  articleUrl: string
  creditsEarned: number
  status: 'active' | 'pending' | 'removed'
}

/**
 * Credit transaction record
 */
export interface CreditTransaction {
  id: string
  date: string
  type: 'earned' | 'spent' | 'purchased' | 'bonus'
  amount: number
  description: string
  balanceAfter: number
}

/**
 * Dashboard metrics for backlink exchange
 */
export interface BacklinkMetrics {
  creditBalance: number
  totalReceived: number
  totalGiven: number
  backlinksValue: number
  domainRating: number
  monthlyCreditsEarned: number
  monthlyCreditsSpent: number
}

/**
 * Subscription plan for backlink credits
 */
export interface SubscriptionPlan {
  id: string
  name: string
  credits: number
  price: number
  slotsAvailable: number
  totalSlots: number
  features: string[]
}

/**
 * Integration status for CMS
 */
export interface IntegrationStatus {
  connected: boolean
  provider?: string
  lastSynced?: string
  articlesIndexed?: number
}

/**
 * CMS Provider option
 */
export interface CMSProvider {
  id: string
  name: string
  icon: string
  description: string
  popular?: boolean
}
