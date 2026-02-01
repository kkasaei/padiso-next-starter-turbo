import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { brands } from "./brands";

export const brandOutcomes = pgTable("brand_outcomes", {
  id: uuid("id").defaultRandom().primaryKey(),
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),
  outcome: text("outcome").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type BrandOutcome = typeof brandOutcomes.$inferSelect;
export type NewBrandOutcome = typeof brandOutcomes.$inferInsert;
