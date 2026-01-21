import { pgTable, text, timestamp, uuid, integer, date, pgEnum } from "drizzle-orm/pg-core";

export const projectStatusEnum = pgEnum("project_status", [
  "backlog",
  "planned",
  "active",
  "cancelled",
  "completed",
]);

export const projectPriorityEnum = pgEnum("project_priority", [
  "urgent",
  "high",
  "medium",
  "low",
]);

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  taskCount: integer("task_count").default(0).notNull(),
  progress: integer("progress").default(0).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  status: projectStatusEnum("status").notNull(),
  priority: projectPriorityEnum("priority").notNull(),
  client: text("client"),
  typeLabel: text("type_label"),
  durationLabel: text("duration_label"),
  // Meta fields
  priorityLabel: text("priority_label"),
  locationLabel: text("location_label"),
  sprintLabel: text("sprint_label"),
  lastSyncLabel: text("last_sync_label"),
  // Time summary
  estimateLabel: text("estimate_label"),
  dueDate: date("due_date"),
  daysRemainingLabel: text("days_remaining_label"),
  progressPercent: integer("progress_percent"),
  // Backlog summary
  backlogStatusLabel: text("backlog_status_label"),
  backlogGroupLabel: text("backlog_group_label"),
  backlogPriorityLabel: text("backlog_priority_label"),
  backlogLabelBadge: text("backlog_label_badge"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
