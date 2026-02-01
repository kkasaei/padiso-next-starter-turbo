import { pgTable, text, timestamp, uuid, integer, pgEnum, boolean } from "drizzle-orm/pg-core";
import { brands } from "../brands/brands";

export const fileTypeEnum = pgEnum("file_type", [
  "pdf",
  "zip",
  "fig",
  "doc",
  "file",
]);

export const files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: fileTypeEnum("type").notNull(),
  sizeMB: integer("size_mb").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  isLinkAsset: boolean("is_link_asset").default(false),
  addedById: text("added_by_id").notNull(), // Clerk user ID
  addedDate: timestamp("added_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const fileAttachments = pgTable("file_attachments", {
  id: uuid("id").defaultRandom().primaryKey(),
  fileId: uuid("file_id")
    .notNull()
    .references(() => files.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: fileTypeEnum("type").notNull(),
  sizeMB: integer("size_mb").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;
export type FileAttachment = typeof fileAttachments.$inferSelect;
export type NewFileAttachment = typeof fileAttachments.$inferInsert;
