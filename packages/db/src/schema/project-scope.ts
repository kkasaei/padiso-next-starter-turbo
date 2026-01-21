import { pgTable, text, uuid, boolean, timestamp } from "drizzle-orm/pg-core";
import { projects } from "./projects";

export const projectScope = pgTable("project_scope", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  item: text("item").notNull(),
  isInScope: boolean("is_in_scope").notNull(), // true for inScope, false for outOfScope
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ProjectScopeItem = typeof projectScope.$inferSelect;
export type NewProjectScopeItem = typeof projectScope.$inferInsert;
