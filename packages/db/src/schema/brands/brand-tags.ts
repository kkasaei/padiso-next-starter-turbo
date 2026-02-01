import { pgTable, text, uuid, primaryKey } from "drizzle-orm/pg-core";
import { brands } from "./brands";

export const brandTags = pgTable(
  "brand_tags",
  {
    brandId: uuid("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    tag: text("tag").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.brandId, table.tag] }),
  }),
);

export type BrandTag = typeof brandTags.$inferSelect;
export type NewBrandTag = typeof brandTags.$inferInsert;
