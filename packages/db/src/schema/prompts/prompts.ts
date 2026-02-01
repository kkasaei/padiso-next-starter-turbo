import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  json,
} from "drizzle-orm/pg-core";
import { brands } from "../brands/brands";

/**
 * Prompt Templates
 * 
 * Reusable AI prompt templates that can be used across a brand/project.
 * Templates support variable substitution (e.g., {{variable_name}}) and
 * can be configured with custom settings.
 */
export const prompts = pgTable("prompts", {
  id: uuid("id").defaultRandom().primaryKey(),
  
  // Brand/Project relationship
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),
  
  // Basic information
  name: text("name").notNull(),
  description: text("description"),
  prompt: text("prompt").notNull(), // The actual prompt content with {{variables}}
  
  // Metadata
  tags: json("tags").$type<string[]>().default([]).notNull(),
  config: json("config").$type<Record<string, unknown>>(), // AI provider config, model settings, etc.
  
  // Usage tracking
  usageCount: integer("usage_count").default(0).notNull(),
  lastUsedAt: timestamp("last_used_at"),
  
  // Audit fields
  createdByUserId: text("created_by_user_id"), // Clerk user ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Prompt = typeof prompts.$inferSelect;
export type NewPrompt = typeof prompts.$inferInsert;
