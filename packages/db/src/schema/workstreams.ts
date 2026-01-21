import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { projects } from "./projects";

export const workstreams = pgTable("workstreams", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Workstream = typeof workstreams.$inferSelect;
export type NewWorkstream = typeof workstreams.$inferInsert;
