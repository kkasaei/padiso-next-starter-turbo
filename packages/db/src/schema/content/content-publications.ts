import {
  pgTable,
  uuid,
  text,
  timestamp,
  json,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";
import { content } from "./content";
import { integrations } from "../integrations/integrations";

/**
 * Publication Status Enum
 */
export const publicationStatusEnum = pgEnum("publication_status", [
  "pending",
  "scheduled",
  "publishing",
  "published",
  "failed",
]);

/**
 * Publish Config Type
 */
export type PublishConfig = {
  categoryId?: number;
  tags?: string[];
  postStatus?: string;
  collectionId?: string;
  isDraft?: boolean;
  headers?: Record<string, string>;
  [key: string]: unknown;
};

/**
 * Content Publications Table (Join Table)
 *
 * Tracks publishing of content to integrations.
 * Many-to-many relationship between content and integrations.
 */
export const contentPublications = pgTable("content_publications", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Relationships
  contentId: uuid("content_id")
    .notNull()
    .references(() => content.id, { onDelete: "cascade" }),
  integrationId: uuid("integration_id")
    .notNull()
    .references(() => integrations.id, { onDelete: "cascade" }),

  // Status
  status: publicationStatusEnum("status").notNull().default("pending"),

  // Configuration
  publishConfig: json("publish_config").$type<PublishConfig>(),

  // Scheduling
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),

  // External system reference
  externalId: text("external_id"), // ID from external system (e.g., WP post ID)
  externalUrl: text("external_url"), // Published URL

  // Error handling
  error: text("error"),
  retryCount: integer("retry_count").notNull().default(0),

  // Audit fields
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ContentPublication = typeof contentPublications.$inferSelect;
export type NewContentPublication = typeof contentPublications.$inferInsert;
