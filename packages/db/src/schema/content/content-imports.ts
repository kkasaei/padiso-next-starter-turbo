import {
  pgTable,
  uuid,
  text,
  timestamp,
  json,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";
import { brands } from "../brands/brands";
import { integrations } from "../integrations/integrations";

/**
 * Import Status Enum
 */
export const importStatusEnum = pgEnum("import_status", [
  "pending",
  "processing",
  "completed",
  "failed",
  "partial",
]);

/**
 * Import Source Type Enum
 */
export const importSourceTypeEnum = pgEnum("import_source_type", [
  "google_sheets",
  "csv_upload",
  "excel_upload",
]);

/**
 * Column Mapping Type
 */
export type ColumnMapping = {
  [columnKey: string]: string; // Maps spreadsheet column to content field
};

/**
 * Import Error Type
 */
export type ImportError = {
  row: number;
  field?: string;
  message: string;
};

/**
 * Content Imports Table
 *
 * Tracks bulk import jobs from spreadsheets.
 */
export const contentImports = pgTable("content_imports", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Relationships
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),
  integrationId: uuid("integration_id")
    .references(() => integrations.id, { onDelete: "set null" }),

  // Import info
  status: importStatusEnum("status").notNull().default("pending"),
  sourceType: importSourceTypeEnum("source_type").notNull(),
  sourceUrl: text("source_url"), // Google Sheets URL
  sourceFileId: text("source_file_id"), // Uploaded file reference
  fileName: text("file_name"), // Original file name

  // Mapping configuration
  columnMapping: json("column_mapping").$type<ColumnMapping>(),

  // Progress tracking
  totalRows: integer("total_rows"),
  processedRows: integer("processed_rows").default(0),
  successCount: integer("success_count").default(0),
  errorCount: integer("error_count").default(0),
  errors: json("errors").$type<ImportError[]>(),

  // User tracking
  importedBy: text("imported_by").notNull(), // Clerk user ID

  // Timestamps
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ContentImport = typeof contentImports.$inferSelect;
export type NewContentImport = typeof contentImports.$inferInsert;
