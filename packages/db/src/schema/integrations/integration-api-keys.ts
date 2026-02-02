import {
  pgTable,
  uuid,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { integrations } from "./integrations";

/**
 * Integration API Keys Table
 *
 * Stores API key credentials for integrations.
 * Keys should be encrypted before storage.
 */
export const integrationApiKeys = pgTable("integration_api_keys", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Integration relationship
  integrationId: uuid("integration_id")
    .notNull()
    .references(() => integrations.id, { onDelete: "cascade" }),

  // Key info
  name: text("name"), // Key name/label
  apiKey: text("api_key").notNull(), // Encrypted API key
  apiSecret: text("api_secret"), // Encrypted API secret (if needed)

  // Expiration and usage
  expiresAt: timestamp("expires_at"),
  lastUsedAt: timestamp("last_used_at"),

  // Audit fields
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type IntegrationApiKey = typeof integrationApiKeys.$inferSelect;
export type NewIntegrationApiKey = typeof integrationApiKeys.$inferInsert;
