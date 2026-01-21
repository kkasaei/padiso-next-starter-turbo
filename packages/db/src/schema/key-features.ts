import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { projects } from "./projects";

export const keyFeatures = pgTable("key_features", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  feature: text("feature").notNull(),
  priority: text("priority").notNull(), // "p0", "p1", "p2"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type KeyFeature = typeof keyFeatures.$inferSelect;
export type NewKeyFeature = typeof keyFeatures.$inferInsert;
