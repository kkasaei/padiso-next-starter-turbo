import {
  pgTable,
  uuid,
  text,
  timestamp,
  json,
  pgEnum,
} from "drizzle-orm/pg-core";
import { brands } from "../brands/brands";

/**
 * Integration Type Enum
 */
export const integrationTypeEnum = pgEnum("integration_type", [
  // Publishing
  "wordpress",
  "webflow",
  "medium",
  "ghost",
  "custom_api",
  // Export destinations
  "google_drive",
  "dropbox",
  // Import sources
  "google_sheets",
  // Analytics/SEO
  "google_search_console",
  "google_analytics",
  "ahrefs",
  "semrush",
  "moz",
]);

/**
 * Integration Auth Type Enum
 */
export const integrationAuthTypeEnum = pgEnum("integration_auth_type", [
  "api_key",
  "oauth",
  "webhook",
  "basic_auth",
]);

/**
 * Integration Status Enum
 */
export const integrationStatusEnum = pgEnum("integration_status", [
  "active",
  "inactive",
  "error",
  "pending_auth",
]);

/**
 * Integration Config Types
 */
export type WordPressConfig = {
  siteUrl: string;
  defaultCategory?: number;
  defaultAuthor?: number;
  defaultStatus?: "draft" | "publish" | "pending";
};

export type WebflowConfig = {
  siteId: string;
  collectionId?: string;
  domain?: string;
};

export type GoogleDriveConfig = {
  defaultFolderId?: string;
  folderName?: string;
};

export type GoogleSheetsConfig = {
  spreadsheetId?: string;
  sheetName?: string;
};

export type IntegrationConfig =
  | WordPressConfig
  | WebflowConfig
  | GoogleDriveConfig
  | GoogleSheetsConfig
  | Record<string, unknown>;

/**
 * Integrations Table
 *
 * Stores connected services for publishing, exporting, and importing content.
 */
export const integrations = pgTable("integrations", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Brand relationship
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),

  // Integration info
  name: text("name").notNull(), // User-friendly name
  type: integrationTypeEnum("type").notNull(),
  authType: integrationAuthTypeEnum("auth_type").notNull(),
  status: integrationStatusEnum("status").notNull().default("pending_auth"),

  // Configuration
  config: json("config").$type<IntegrationConfig>(),

  // Sync tracking
  lastSyncAt: timestamp("last_sync_at"),
  lastErrorAt: timestamp("last_error_at"),
  lastError: text("last_error"),

  // Audit fields
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Integration = typeof integrations.$inferSelect;
export type NewIntegration = typeof integrations.$inferInsert;
