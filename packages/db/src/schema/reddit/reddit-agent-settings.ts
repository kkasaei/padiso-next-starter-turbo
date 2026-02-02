/**
 * Reddit Agent Settings Schema
 *
 * Stores configuration for the Reddit agent per brand
 */

import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  json,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { brands } from "../brands/brands";

// ============================================================
// Reddit Agent Settings Table
// ============================================================

export const redditAgentSettings = pgTable("reddit_agent_settings", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Brand relationship (one-to-one)
  brandId: uuid("brand_id")
    .notNull()
    .unique()
    .references(() => brands.id, { onDelete: "cascade" }),

  // Agent configuration
  isEnabled: boolean("is_enabled").default(true).notNull(),
  
  // Scanning settings
  scanFrequencyHours: integer("scan_frequency_hours").default(6).notNull(), // How often to scan
  maxKeywords: integer("max_keywords").default(5).notNull(), // Max keywords to track
  minRelevanceScore: integer("min_relevance_score").default(50).notNull(), // Min score to show
  
  // Subreddit settings
  defaultSubreddits: json("default_subreddits").$type<string[]>(), // Default subreddits to monitor
  excludedSubreddits: json("excluded_subreddits").$type<string[]>(), // Subreddits to exclude
  
  // Comment generation settings
  autoGenerateComments: boolean("auto_generate_comments").default(true).notNull(),
  preferredTone: text("preferred_tone").default("helpful"), // helpful, informative, casual
  includeBrandMention: boolean("include_brand_mention").default(true).notNull(),
  
  // Notification settings
  emailNotifications: boolean("email_notifications").default(false).notNull(),
  slackNotifications: boolean("slack_notifications").default(false).notNull(),
  slackWebhookUrl: text("slack_webhook_url"),
  
  // Stats
  totalScans: integer("total_scans").default(0).notNull(),
  totalOpportunities: integer("total_opportunities").default(0).notNull(),
  totalCommentsGenerated: integer("total_comments_generated").default(0).notNull(),
  lastScanAt: timestamp("last_scan_at"),
  nextScanAt: timestamp("next_scan_at"),

  // Audit
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================================
// Relations
// ============================================================

export const redditAgentSettingsRelations = relations(
  redditAgentSettings,
  ({ one }) => ({
    brand: one(brands, {
      fields: [redditAgentSettings.brandId],
      references: [brands.id],
    }),
  })
);

// ============================================================
// Types
// ============================================================

export type RedditAgentSettings = typeof redditAgentSettings.$inferSelect;
export type NewRedditAgentSettings = typeof redditAgentSettings.$inferInsert;
