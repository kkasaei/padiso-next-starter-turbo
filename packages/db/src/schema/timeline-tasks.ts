import { pgTable, text, uuid, date, pgEnum, timestamp } from "drizzle-orm/pg-core";
import { projects } from "./projects";

export const timelineTaskStatusEnum = pgEnum("timeline_task_status", [
  "planned",
  "in-progress",
  "done",
]);

export const timelineTasks = pgTable("timeline_tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  status: timelineTaskStatusEnum("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type TimelineTask = typeof timelineTasks.$inferSelect;
export type NewTimelineTask = typeof timelineTasks.$inferInsert;
