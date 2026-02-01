import { pgTable, text, timestamp, uuid, date, pgEnum } from "drizzle-orm/pg-core";
import { brands } from "../brands/brands";

export const taskStatusEnum = pgEnum("task_status", [
  "todo",
  "in-progress",
  "done",
]);

export const taskPriorityEnum = pgEnum("task_priority", [
  "no-priority",
  "low",
  "medium",
  "high",
  "urgent",
]);

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  status: taskStatusEnum("status").notNull(),
  priority: taskPriorityEnum("priority"),
  tag: text("tag"),
  assigneeId: text("assignee_id"), // Clerk user ID
  startDate: date("start_date"),
  endDate: date("end_date"),
  dueLabel: text("due_label"),
  dueTone: text("due_tone"), // "danger" | "warning" | "muted"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
