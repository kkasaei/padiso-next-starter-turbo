import { pgTable, text, timestamp, uuid, boolean, pgEnum, json, integer } from "drizzle-orm/pg-core";
import { workspaces } from "../workspace/workspaces";

export const brandStatusEnum = pgEnum("brand_status", [
  "initializing", // Brand is being set up by the worker (10-15 mins)
  "backlog",
  "planned",
  "active",
  "cancelled",
  "completed",
]);

export const brandPriorityEnum = pgEnum("brand_priority", [
  "urgent",
  "high",
  "medium",
  "low",
]);

export const languageEnum = pgEnum("language", [
  "en-US",
  "en-GB",
  "es",
  "fr",
  "de",
  "pt",
  "it",
  "nl",
  "pl",
  "ru",
  "ja",
  "zh",
  "ko",
  "ar",
  "hi",
  "bg",
  "hu",
  "hr",
]);

export const referralSourceEnum = pgEnum("referral_source", [
  "facebook",
  "instagram",
  "google",
  "email",
  "reddit",
  "linkedin",
  "other",
]);

export const brands = pgTable("brands", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Workspace relationship - A brand belongs to a workspace
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),

  websiteUrl: text("website_url"),
  description: text("description"),
  languages: json("languages").$type<string[]>(),
  targetAudiences: json("target_audiences").$type<string[]>(),
  businessKeywords: json("business_keywords").$type<string[]>(),
  competitors: json("competitors").$type<string[]>(),
  brandName: text("brand_name"),
  brandColor: text("brand_color"),
  iconUrl: text("icon_url"),
  sitemapUrl: text("sitemap_url"),
  referralSource: referralSourceEnum("referral_source"),

  status: brandStatusEnum("status").notNull(),

  // Legacy Clerk reference (deprecated - use workspace relationship instead)
  // Kept for backward compatibility during migration
  orgId: text('org_id'),
  
  // User tracking
  createdByUserId: text("created_by_user_id"), // Clerk user ID
  isFavourite: boolean("is_favourite").default(false),

  // AI Visibility Tracking
  visibilityScore: integer("visibility_score").default(0), // 0-100 score
  lastScanAt: timestamp("last_scan_at"), // When last scanned
  nextScanAt: timestamp("next_scan_at"), // When next scan is scheduled


  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Brand = typeof brands.$inferSelect;
export type NewBrand = typeof brands.$inferInsert;
