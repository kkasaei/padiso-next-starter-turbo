import {
  pgTable,
  uuid,
  varchar,
  jsonb,
  boolean,
  timestamp,
  text,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/**
 * Admin Settings
 * 
 * Global application settings and feature flags managed by administrators.
 * Stores configuration in flexible JSONB format for easy updates without code changes.
 */
export const adminSettings = pgTable(
  "admin_settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    
    // Unique identifier for the setting (e.g., "maintenance_mode", "auth_mode")
    key: varchar("key", { length: 255 }).notNull().unique(),
    
    // JSONB value for flexible configuration
    value: jsonb("value").notNull(),
    
    // Category for grouping (e.g., "maintenance", "authentication", "features")
    category: varchar("category", { length: 100 }).notNull(),
    
    // Human-readable description
    description: text("description"),
    
    // Quick on/off toggle without modifying the value
    isActive: boolean("is_active").default(true).notNull(),
    
    // Audit trail
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    updatedBy: varchar("updated_by", { length: 255 }),
    
    // Additional metadata
    metadata: jsonb("metadata").default(sql`'{}'::jsonb`).notNull(),
  },
  (table) => ({
    keyIdx: index("idx_admin_settings_key").on(table.key),
    categoryIdx: index("idx_admin_settings_category").on(table.category),
    isActiveIdx: index("idx_admin_settings_is_active").on(table.isActive),
  })
);

export type AdminSetting = typeof adminSettings.$inferSelect;
export type NewAdminSetting = typeof adminSettings.$inferInsert;
