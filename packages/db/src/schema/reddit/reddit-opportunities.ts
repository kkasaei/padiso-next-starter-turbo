/**
 * Reddit Opportunities Schema
 *
 * Stores Reddit posts that represent engagement opportunities for a brand
 */

import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  json,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { brands } from "../brands/brands";

// ============================================================
// Enums
// ============================================================

export const redditOpportunityStatusEnum = pgEnum("reddit_opportunity_status", [
  "pending", // New opportunity, not yet acted upon
  "completed", // User copied/posted comment
  "dismissed", // User dismissed the opportunity
  "expired", // Post too old or locked
]);

export const redditOpportunityTypeEnum = pgEnum("reddit_opportunity_type", [
  "recommendation_request", // User asking for recommendations
  "problem_discussion", // User discussing a problem
  "competitor_mention", // Competitor mentioned
  "industry_discussion", // General industry discussion
  "question", // Direct question
  "review_thread", // Review/comparison thread
  "other", // Other type
]);

// ============================================================
// Reddit Opportunities Table
// ============================================================

export const redditOpportunities = pgTable(
  "reddit_opportunities",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Brand relationship
    brandId: uuid("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),

    // Reddit post data
    postId: text("post_id").notNull(), // Reddit fullname (e.g., "t3_abc123")
    postTitle: text("post_title").notNull(),
    postUrl: text("post_url").notNull(),
    postBody: text("post_body"),
    subreddit: text("subreddit").notNull(),
    author: text("author"),
    upvotes: integer("upvotes"),
    commentCount: integer("comment_count"),
    postedAt: timestamp("posted_at"),

    // Analysis results
    relevanceScore: integer("relevance_score"), // 0-100
    matchedKeywords: json("matched_keywords").$type<string[]>(),
    opportunityType: redditOpportunityTypeEnum("opportunity_type"),

    // Status
    status: redditOpportunityStatusEnum("status").default("pending").notNull(),

    // Generated comment
    suggestedComment: text("suggested_comment"),
    commentTone: text("comment_tone"), // helpful, informative, casual, etc.
    commentConfidence: integer("comment_confidence"), // 0-100
    commentGeneratedAt: timestamp("comment_generated_at"),

    // User actions
    completedAt: timestamp("completed_at"),
    dismissedAt: timestamp("dismissed_at"),
    dismissReason: text("dismiss_reason"),

    // Audit
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    // Index for querying by brand and status
    brandStatusIdx: index("reddit_opp_brand_status_idx").on(
      table.brandId,
      table.status
    ),
    // Index for querying by relevance
    brandRelevanceIdx: index("reddit_opp_brand_relevance_idx").on(
      table.brandId,
      table.relevanceScore
    ),
    // Unique constraint to prevent duplicate posts per brand
    brandPostIdx: uniqueIndex("reddit_opp_brand_post_idx").on(
      table.brandId,
      table.postId
    ),
  })
);

// ============================================================
// Relations
// ============================================================

export const redditOpportunitiesRelations = relations(
  redditOpportunities,
  ({ one }) => ({
    brand: one(brands, {
      fields: [redditOpportunities.brandId],
      references: [brands.id],
    }),
  })
);

// ============================================================
// Types
// ============================================================

export type RedditOpportunity = typeof redditOpportunities.$inferSelect;
export type NewRedditOpportunity = typeof redditOpportunities.$inferInsert;
export type RedditOpportunityStatus = (typeof redditOpportunityStatusEnum.enumValues)[number];
export type RedditOpportunityType = (typeof redditOpportunityTypeEnum.enumValues)[number];
