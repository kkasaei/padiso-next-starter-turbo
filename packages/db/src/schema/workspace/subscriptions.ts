import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  numeric,
  pgEnum,
} from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";

/**
 * Subscription Status
 * 
 * Mirrors Stripe subscription statuses for accurate tracking
 */
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "trialing",
  "past_due",
  "canceled",
  "unpaid",
  "incomplete",
  "incomplete_expired",
  "paused",
]);

/**
 * Subscriptions
 * 
 * Tracks subscription history and current subscription state.
 * Each workspace can have multiple subscription records over time,
 * but only one active subscription at a time.
 */
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  
  // Workspace relationship
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  
  // Stripe identifiers
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id").notNull(),
  stripePriceId: text("stripe_price_id"),
  
  // Plan details
  planId: text("plan_id").notNull(), // 'free', 'pro', 'enterprise'
  planName: text("plan_name").notNull(),
  
  // Status
  status: subscriptionStatusEnum("status").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
  canceledAt: timestamp("canceled_at"),
  cancelReason: text("cancel_reason"),
  
  // Pricing
  priceAmount: numeric("price_amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("usd").notNull(),
  billingInterval: text("billing_interval").notNull(), // 'month' or 'year'
  
  // Periods
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  
  // Trial
  trialStart: timestamp("trial_start"),
  trialEnd: timestamp("trial_end"),
  
  // Timestamps
  startedAt: timestamp("started_at").notNull(),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
