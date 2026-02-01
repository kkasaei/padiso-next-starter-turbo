import {
  pgTable,
  uuid,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { brands } from "../brands/brands";

/**
 * Prompt Tags
 * 
 * User-created tags for organizing and categorizing prompts.
 * One tag can be applied to many prompts (one-to-many relationship).
 * Tags are scoped to a brand.
 */
export const promptTags = pgTable("prompt_tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  
  // Brand relationship - tags belong to a brand
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),
  
  // Tag information
  name: text("name").notNull(),
  color: text("color"), // Hex color for visual distinction (e.g., "#3b82f6", "#10b981")
  description: text("description"),
  
  // Audit fields
  createdByUserId: text("created_by_user_id"), // Clerk user ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type PromptTag = typeof promptTags.$inferSelect;
export type NewPromptTag = typeof promptTags.$inferInsert;
