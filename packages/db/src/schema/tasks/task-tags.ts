import {
  pgTable,
  uuid,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { brands } from "../brands/brands";

/**
 * Task Tags
 * 
 * User-created tags for organizing and categorizing tasks.
 * One tag can be applied to many tasks (one-to-many relationship).
 * Tags are scoped to a brand.
 */
export const taskTags = pgTable("task_tags", {
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

export type TaskTag = typeof taskTags.$inferSelect;
export type NewTaskTag = typeof taskTags.$inferInsert;
