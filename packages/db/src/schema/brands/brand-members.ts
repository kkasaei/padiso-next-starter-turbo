import { pgTable, uuid, primaryKey, text } from "drizzle-orm/pg-core";
import { brands } from "./brands";

/**
 * Brand Member Roles:
 * 
 * - owner: Full control including billing, brand deletion, and ownership transfer.
 *          Only one owner per brand. Set at brand creation.
 * 
 * - admin: Everything except billing and brand deletion. Can manage all members,
 *          edit brand settings, and perform all content operations.
 * 
 * - editor: Can create, edit, and delete any content within the brand.
 *           Cannot manage members or change brand settings.
 * 
 * - contributor: Can create and edit their own content only. Cannot delete
 *                content or access other members' drafts.
 * 
 * - viewer: Read-only access to published content and analytics.
 *           Cannot create, edit, or delete anything.
 */
export const brandMemberRoles = [
  "owner",
  "admin",
  "editor",
  "contributor",
  "viewer",
] as const;

export type BrandMemberRole = (typeof brandMemberRoles)[number];

export const brandMembers = pgTable(
  "brand_members",
  {
    brandId: uuid("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull(), // Clerk user ID
    role: text("role", { enum: brandMemberRoles })
      .notNull()
      .default("owner"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.brandId, table.userId] }),
  }),
);

export type BrandMember = typeof brandMembers.$inferSelect;
export type NewBrandMember = typeof brandMembers.$inferInsert;
