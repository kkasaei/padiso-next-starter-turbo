import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  json,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { aiProviderEnum } from "../prompts/prompts";

/**
 * Admin Prompt Purpose Enum
 * Categorizes what the prompt is used for
 */
export const adminPromptPurposeEnum = pgEnum("admin_prompt_purpose", [
  "master",              // Master/system-wide default prompt
  "content_creation",    // General content generation
  "seo_optimization",    // SEO-focused content
  "social_media",        // Social media posts
  "blog_writing",        // Blog articles
  "product_description", // E-commerce product descriptions
  "email_marketing",     // Email campaigns
  "ad_copy",            // Advertisement copy
  "meta_description",   // Meta descriptions for SEO
  "reddit_agent",       // Reddit marketing agent
  "custom",             // Custom admin-defined purpose
]);

/**
 * Admin Prompts
 * 
 * System-wide prompts managed by administrators.
 * These prompts can be used across all workspaces/brands
 * and serve as templates for different content generation purposes.
 */
export const adminPrompts = pgTable("admin_prompts", {
  id: uuid("id").defaultRandom().primaryKey(),
  
  // Basic information
  name: text("name").notNull(),
  description: text("description"), // What this prompt does
  prompt: text("prompt").notNull(), // The actual prompt content (supports {{variables}})
  
  // Purpose/Category
  purpose: adminPromptPurposeEnum("purpose").notNull(),
  
  // AI Provider
  aiProvider: aiProviderEnum("ai_provider").default("claude"),
  
  // Master flag - only one master prompt should be active
  isMaster: boolean("is_master").default(false).notNull(),
  
  // Active/Inactive toggle
  isActive: boolean("is_active").default(true).notNull(),
  
  // Configuration (temperature, maxTokens, model, etc.)
  config: json("config").$type<{
    temperature?: number;
    maxTokens?: number;
    model?: string;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    [key: string]: unknown;
  }>(),
  
  // Version control
  version: integer("version").default(1).notNull(),
  previousVersionId: uuid("previous_version_id"), // Link to previous version
  
  // Usage tracking
  usageCount: integer("usage_count").default(0).notNull(),
  lastUsedAt: timestamp("last_used_at"),
  
  // Audit fields
  createdByUserId: text("created_by_user_id"), // Clerk admin user ID
  updatedByUserId: text("updated_by_user_id"), // Who last updated it
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AdminPrompt = typeof adminPrompts.$inferSelect;
export type NewAdminPrompt = typeof adminPrompts.$inferInsert;
