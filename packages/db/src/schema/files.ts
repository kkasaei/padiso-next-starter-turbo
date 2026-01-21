import { pgTable, text, timestamp, uuid, integer, pgEnum, boolean } from "drizzle-orm/pg-core";
import { projects } from "./projects";
import { users } from "./users";

export const fileTypeEnum = pgEnum("file_type", [
  "pdf",
  "zip",
  "fig",
  "doc",
  "file",
]);

export const files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: fileTypeEnum("type").notNull(),
  sizeMB: integer("size_mb").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  isLinkAsset: boolean("is_link_asset").default(false),
  addedById: uuid("added_by_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
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
