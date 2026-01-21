import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { projects } from "./projects";

export const projectOutcomes = pgTable("project_outcomes", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  outcome: text("outcome").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ProjectOutcome = typeof projectOutcomes.$inferSelect;
export type NewProjectOutcome = typeof projectOutcomes.$inferInsert;
