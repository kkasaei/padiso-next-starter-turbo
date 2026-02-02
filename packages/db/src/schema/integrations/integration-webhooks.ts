import {
  pgTable,
  uuid,
  text,
  timestamp,
  json,
  pgEnum,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { integrations } from "./integrations";

/**
 * Webhook Direction Enum
 */
export const webhookDirectionEnum = pgEnum("webhook_direction", [
  "inbound",
  "outbound",
]);

/**
 * Webhook Events Type
 */
export type WebhookEvents = {
  events: string[];
};

/**
 * Webhook Headers Type
 */
export type WebhookHeaders = {
  [key: string]: string;
};

/**
 * Integration Webhooks Table
 *
 * Stores webhook endpoints for integrations.
 */
export const integrationWebhooks = pgTable("integration_webhooks", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Integration relationship
  integrationId: uuid("integration_id")
    .notNull()
    .references(() => integrations.id, { onDelete: "cascade" }),

  // Webhook info
  direction: webhookDirectionEnum("direction").notNull(),
  name: text("name"), // Webhook name/label
  url: text("url").notNull(), // Webhook URL
  secret: text("secret"), // Encrypted webhook secret

  // Configuration
  events: json("events").$type<WebhookEvents>(), // Events to trigger/listen for
  headers: json("headers").$type<WebhookHeaders>(), // Custom headers

  // Status
  isActive: boolean("is_active").notNull().default(true),
  lastTriggeredAt: timestamp("last_triggered_at"),
  lastStatusCode: integer("last_status_code"),

  // Audit fields
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type IntegrationWebhook = typeof integrationWebhooks.$inferSelect;
export type NewIntegrationWebhook = typeof integrationWebhooks.$inferInsert;
