import {
  pgTable,
  uuid,
  text,
  timestamp,
  json,
  pgEnum,
} from "drizzle-orm/pg-core";
import { integrations } from "./integrations";

/**
 * OAuth Provider Enum
 */
export const oauthProviderEnum = pgEnum("oauth_provider", [
  "google",
  "facebook",
  "linkedin",
  "twitter",
  "github",
  "microsoft",
]);

/**
 * OAuth Raw Response Type
 */
export type OAuthRawResponse = {
  [key: string]: unknown;
};

/**
 * Integration OAuth Tokens Table
 *
 * Stores OAuth tokens for integrations.
 * Tokens should be encrypted before storage.
 */
export const integrationOauthTokens = pgTable("integration_oauth_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Integration relationship
  integrationId: uuid("integration_id")
    .notNull()
    .references(() => integrations.id, { onDelete: "cascade" }),

  // OAuth info
  provider: oauthProviderEnum("provider").notNull(),
  accessToken: text("access_token").notNull(), // Encrypted access token
  refreshToken: text("refresh_token"), // Encrypted refresh token
  tokenType: text("token_type"), // e.g., "Bearer"
  scope: text("scope"), // Granted scopes

  // Expiration
  expiresAt: timestamp("expires_at"),

  // Raw response from OAuth provider
  rawResponse: json("raw_response").$type<OAuthRawResponse>(),

  // Audit fields
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type IntegrationOauthToken = typeof integrationOauthTokens.$inferSelect;
export type NewIntegrationOauthToken = typeof integrationOauthTokens.$inferInsert;
