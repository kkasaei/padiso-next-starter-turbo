import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { content } from "./content";
import { integrations } from "../integrations/integrations";

/**
 * Export Status Enum
 */
export const exportStatusEnum = pgEnum("export_status", [
  "pending",
  "exporting",
  "completed",
  "failed",
]);

/**
 * Export Format Enum
 */
export const exportFormatEnum = pgEnum("export_format", [
  "google_doc",
  "pdf",
  "markdown",
  "html",
  "docx",
]);

/**
 * Content Exports Table
 *
 * Tracks exports of content to external destinations (Google Drive, etc.)
 */
export const contentExports = pgTable("content_exports", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Relationships
  contentId: uuid("content_id")
    .notNull()
    .references(() => content.id, { onDelete: "cascade" }),
  integrationId: uuid("integration_id")
    .notNull()
    .references(() => integrations.id, { onDelete: "cascade" }),

  // Export info
  status: exportStatusEnum("status").notNull().default("pending"),
  exportFormat: exportFormatEnum("export_format").notNull(),

  // External system reference
  externalId: text("external_id"), // File ID in external system
  externalUrl: text("external_url"), // Link to exported file
  folderId: text("folder_id"), // Destination folder ID
  fileName: text("file_name"), // Exported file name

  // Error handling
  error: text("error"),

  // Timestamps
  exportedAt: timestamp("exported_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ContentExport = typeof contentExports.$inferSelect;
export type NewContentExport = typeof contentExports.$inferInsert;
