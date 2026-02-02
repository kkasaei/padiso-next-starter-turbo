import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { brands } from "./brands";
import { integrations } from "../integrations/integrations";

/**
 * Brand Locales Table
 *
 * Tracks which locales are active for a brand and their configuration.
 * Each brand can have multiple locales with different publish destinations.
 */
export const brandLocales = pgTable("brand_locales", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Brand relationship
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),

  // Locale info
  locale: text("locale").notNull(), // Language code (e.g., "en-US", "de", "fr")
  isDefault: boolean("is_default").notNull().default(false), // Primary locale for the brand
  isActive: boolean("is_active").notNull().default(true), // Is this locale enabled

  // Locale-specific configuration
  subdomain: text("subdomain"), // e.g., "de" for de.example.com
  pathPrefix: text("path_prefix"), // e.g., "/de" for example.com/de/...
  
  // Locale-specific publish destination
  publishIntegrationId: uuid("publish_integration_id")
    .references(() => integrations.id, { onDelete: "set null" }),

  // Audit fields
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type BrandLocale = typeof brandLocales.$inferSelect;
export type NewBrandLocale = typeof brandLocales.$inferInsert;
