import { pgTable, text, uuid, date, pgEnum, timestamp } from "drizzle-orm/pg-core";
import { workstreams } from "./workstreams";
import { tasks } from "./tasks";

export const workstreamTasks = pgTable("workstream_tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  workstreamId: uuid("workstream_id")
    .notNull()
    .references(() => workstreams.id, { onDelete: "cascade" }),
  taskId: uuid("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type WorkstreamTask = typeof workstreamTasks.$inferSelect;
export type NewWorkstreamTask = typeof workstreamTasks.$inferInsert;
