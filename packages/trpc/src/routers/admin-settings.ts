import { router, publicProcedure } from "../trpc";
import { db, adminSettings } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

export const adminSettingsRouter = router({
  // Get all settings
  getAll: publicProcedure.query(async () => {
    const settings = await db
      .select()
      .from(adminSettings)
      .orderBy(desc(adminSettings.category), adminSettings.key);
    
    return settings;
  }),

  // Get setting by key
  getByKey: publicProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      const [setting] = await db
        .select()
        .from(adminSettings)
        .where(eq(adminSettings.key, input.key))
        .limit(1);
      
      return setting;
    }),

  // Get settings by category
  getByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      const settings = await db
        .select()
        .from(adminSettings)
        .where(eq(adminSettings.category, input.category))
        .orderBy(adminSettings.key);
      
      return settings;
    }),

  // Create or update setting
  upsert: publicProcedure
    .input(
      z.object({
        key: z.string(),
        value: z.any(),
        category: z.string(),
        description: z.string().optional(),
        isActive: z.boolean().optional(),
        updatedBy: z.string().optional(),
        metadata: z.any().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const existing = await db
        .select()
        .from(adminSettings)
        .where(eq(adminSettings.key, input.key))
        .limit(1);

      if (existing.length > 0) {
        // Update existing
        const [updated] = await db
          .update(adminSettings)
          .set({
            value: input.value,
            category: input.category,
            description: input.description,
            isActive: input.isActive,
            updatedBy: input.updatedBy,
            metadata: input.metadata,
            updatedAt: new Date(),
          })
          .where(eq(adminSettings.key, input.key))
          .returning();

        return updated;
      } else {
        // Insert new
        const [created] = await db
          .insert(adminSettings)
          .values({
            key: input.key,
            value: input.value,
            category: input.category,
            description: input.description,
            isActive: input.isActive ?? true,
            updatedBy: input.updatedBy,
            metadata: input.metadata ?? {},
          })
          .returning();

        return created;
      }
    }),

  // Update setting value only
  updateValue: publicProcedure
    .input(
      z.object({
        key: z.string(),
        value: z.any(),
        updatedBy: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const [updated] = await db
        .update(adminSettings)
        .set({
          value: input.value,
          updatedBy: input.updatedBy,
          updatedAt: new Date(),
        })
        .where(eq(adminSettings.key, input.key))
        .returning();

      return updated;
    }),

  // Toggle active status
  toggleActive: publicProcedure
    .input(
      z.object({
        key: z.string(),
        updatedBy: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const [current] = await db
        .select()
        .from(adminSettings)
        .where(eq(adminSettings.key, input.key))
        .limit(1);

      if (!current) {
        throw new Error("Setting not found");
      }

      const [updated] = await db
        .update(adminSettings)
        .set({
          isActive: !current.isActive,
          updatedBy: input.updatedBy,
          updatedAt: new Date(),
        })
        .where(eq(adminSettings.key, input.key))
        .returning();

      return updated;
    }),

  // Delete setting
  delete: publicProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input }) => {
      await db
        .delete(adminSettings)
        .where(eq(adminSettings.key, input.key));

      return { success: true };
    }),
});
