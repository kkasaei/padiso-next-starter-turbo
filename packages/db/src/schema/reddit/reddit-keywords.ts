/**
 * Reddit Keywords Schema
 *
 * Tracks keywords and subreddits to monitor for a brand
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
// Reddit Keywords Table
// ============================================================

export const redditKeywords = pgTable("reddit_keywords", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Brand relationship
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),

  // Keyword configuration
  keyword: text("keyword").notNull(),
  subreddits: json("subreddits").$type<string[]>(), // Specific subreddits to monitor, null = all
  isActive: boolean("is_active").default(true).notNull(),

  // Stats
  totalOpportunities: integer("total_opportunities").default(0).notNull(),
  lastScanAt: timestamp("last_scan_at"),
  lastOpportunityAt: timestamp("last_opportunity_at"),

  // Audit
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================================
// Relations
// ============================================================

export const redditKeywordsRelations = relations(redditKeywords, ({ one }) => ({
  brand: one(brands, {
    fields: [redditKeywords.brandId],
    references: [brands.id],
  }),
}));

// ============================================================
// Types
// ============================================================

export type RedditKeyword = typeof redditKeywords.$inferSelect;
export type NewRedditKeyword = typeof redditKeywords.$inferInsert;
