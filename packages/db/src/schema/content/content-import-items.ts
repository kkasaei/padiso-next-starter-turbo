import {
  pgTable,
  uuid,
  text,
  timestamp,
  json,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";
import { contentImports } from "./content-imports";
import { content } from "./content";

/**
 * Import Item Status Enum
 */
export const importItemStatusEnum = pgEnum("import_item_status", [
  "pending",
  "created",
  "skipped",
  "failed",
]);

/**
 * Content Import Items Table
 *
 * Tracks individual rows from import jobs.
 */
export const contentImportItems = pgTable("content_import_items", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Relationships
  importId: uuid("import_id")
    .notNull()
    .references(() => contentImports.id, { onDelete: "cascade" }),
  contentId: uuid("content_id")
    .references(() => content.id, { onDelete: "set null" }),

  // Row info
  rowNumber: integer("row_number").notNull(),
  status: importItemStatusEnum("status").notNull().default("pending"),

  // Data
  rawData: json("raw_data").$type<Record<string, unknown>>().notNull(),
  mappedData: json("mapped_data").$type<Record<string, unknown>>(),

  // Error handling
  error: text("error"),

  // Audit fields
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ContentImportItem = typeof contentImportItems.$inferSelect;
export type NewContentImportItem = typeof contentImportItems.$inferInsert;
