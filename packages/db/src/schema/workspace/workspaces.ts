import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  pgEnum,
  json,
  numeric,
} from "drizzle-orm/pg-core";

/**
 * Workspace Status
 * 
 * - ACTIVE: Workspace is active and operational
 * - TRIALING: Workspace is in trial period
 * - PAST_DUE: Payment is past due but still accessible
 * - CANCELED: Subscription canceled, grace period may apply
 * - UNPAID: Subscription unpaid, limited access
 * - INCOMPLETE: Subscription setup not completed
 * - INCOMPLETE_EXPIRED: Subscription setup expired
 * - PAUSED: Manually paused by admin or user
 * - ADMIN_SUSPENDED: Suspended by admin for policy violations
 * - DELETED: Soft deleted, pending permanent deletion
 */
export const workspaceStatusEnum = pgEnum("workspace_status", [
  "active",
  "trialing",
  "past_due",
  "canceled",
  "unpaid",
  "incomplete",
  "incomplete_expired",
  "paused",
  "admin_suspended",
  "deleted",
]);

/**
 * Workspaces
 * 
 * Top-level organization entity that maps to Clerk organizations.
 * Handles billing, subscriptions, usage tracking, and global settings.
 * All brands/projects belong to a workspace.
 */
export const workspaces = pgTable("workspaces", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Clerk Organization Identity - THIS IS THE KEY!
  clerkOrgId: text("clerk_org_id").notNull().unique(),
  
  // Basic Information
  name: text("name").notNull(),
  slug: text("slug"),
  logoUrl: text("logo_url"),
  
  // Status & Lifecycle
  status: workspaceStatusEnum("status").notNull().default("active"),
  
  // Onboarding & Setup
  hasCompletedWelcomeScreen: boolean("has_completed_welcome_screen").default(false).notNull(),
  hasCompletedOnboarding: boolean("has_completed_onboarding").default(false).notNull(),
  
  // Billing & Subscription
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  planId: text("plan_id"), // e.g., 'free', 'pro', 'enterprise'
  planName: text("plan_name"),
  billingInterval: text("billing_interval"), // 'month' or 'year'
  billingEmail: text("billing_email"),
  
  // Trial & Subscription Periods
  trialStartsAt: timestamp("trial_starts_at"),
  trialEndsAt: timestamp("trial_ends_at"),
  subscriptionPeriodStartsAt: timestamp("subscription_period_starts_at"),
  subscriptionPeriodEndsAt: timestamp("subscription_period_ends_at"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
  
  // Pricing
  priceAmount: numeric("price_amount", { precision: 10, scale: 2 }), // Monthly/Yearly price
  currency: text("currency").default("usd"),
  
  // Usage Limits (from plan)
  limitBrands: integer("limit_brands"),
  limitMembers: integer("limit_members"),
  limitStorageGb: integer("limit_storage_gb"),
  limitApiCallsPerMonth: integer("limit_api_calls_per_month"),
  limitAiCreditsPerMonth: integer("limit_ai_credits_per_month"),
  
  // Current Usage / Analytics (reset each billing period)
  usageBrandsCount: integer("usage_brands_count").default(0).notNull(),
  usageMembersCount: integer("usage_members_count").default(0).notNull(),
  usageStorageBytes: integer("usage_storage_bytes").default(0).notNull(),
  usageApiCallsCount: integer("usage_api_calls_count").default(0).notNull(),
  usageAiCreditsUsed: integer("usage_ai_credits_used").default(0).notNull(),
  
  // Lifetime Analytics
  totalBrandsCreated: integer("total_brands_created").default(0).notNull(),
  totalApiCallsAllTime: integer("total_api_calls_all_time").default(0).notNull(),
  totalAiCreditsAllTime: integer("total_ai_credits_all_time").default(0).notNull(),
  totalStorageBytesAllTime: integer("total_storage_bytes_all_time").default(0).notNull(),
  
  // Credits & Balance
  creditsBalance: integer("credits_balance").default(0).notNull(),
  
  // Settings & Configuration
  config: json("config").$type<Record<string, unknown>>(),
  
  // Timestamps
  lastActivityAt: timestamp("last_activity_at"),
  usageResetAt: timestamp("usage_reset_at"), // When current period usage was last reset
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
