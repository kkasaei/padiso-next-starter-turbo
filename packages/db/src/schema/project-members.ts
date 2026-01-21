import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { projects } from "./projects";
import { users } from "./users";

export const projectMembers = pgTable(
  "project_members",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.projectId, table.userId] }),
  }),
);

export type ProjectMember = typeof projectMembers.$inferSelect;
export type NewProjectMember = typeof projectMembers.$inferInsert;
