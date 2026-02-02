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
  // Google (covers all Google services)
  "google",
  // Publishing / CMS
  "wordpress",
  "webflow",
  "shopify",
  "medium",
  "ghost",
  "custom_api",
  // Storage
  "dropbox",
  // SEO Tools
  "ahrefs",
  "semrush",
  "moz",
  // Automation
  "webhook",
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
export type GoogleConfig = {
  clientId: string;
  clientSecret: string;
};

export type WordPressConfig = {
  webhookUrl: string;
  accessToken: string;
  authorId?: string;
  postStatus?: "draft" | "publish" | "pending" | "private" | "future";
};

export type WebflowConfig = {
  apiKey: string;
  siteId?: string;
  collectionId?: string;
  domain?: string;
};

export type ShopifyConfig = {
  storeName: string;
  clientId: string;
  secret: string;
  blog?: string;
  author?: string;
  publishStatus?: "publish" | "draft";
};

export type WebhookConfig = {
  webhookUrl: string;
  secret?: string;
};

export type DropboxConfig = {
  accessToken: string;
  defaultFolderId?: string;
};

export type IntegrationConfig =
  | GoogleConfig
  | WordPressConfig
  | WebflowConfig
  | ShopifyConfig
  | WebhookConfig
  | DropboxConfig
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
