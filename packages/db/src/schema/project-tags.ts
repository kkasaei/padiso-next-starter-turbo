import { pgTable, text, uuid, primaryKey } from "drizzle-orm/pg-core";
import { projects } from "./projects";

export const projectTags = pgTable(
  "project_tags",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    tag: text("tag").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.projectId, table.tag] }),
  }),
);

export type ProjectTag = typeof projectTags.$inferSelect;
export type NewProjectTag = typeof projectTags.$inferInsert;
