import { router, publicProcedure } from "../trpc";
import { db, adminPrompts } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import { z } from "zod";

const adminPromptPurposeEnum = z.enum([
  "master",
  "content_creation",
  "seo_optimization",
  "social_media",
  "blog_writing",
  "product_description",
  "email_marketing",
  "ad_copy",
  "meta_description",
  "reddit_agent",
  "custom",
]);

const aiProviderEnum = z.enum([
  "claude",
  "openai",
  "perplexity",
  "gemini",
  "grok",
  "mistral",
  "llama",
]);

export const adminPromptsRouter = router({
  // Get all prompts
  getAll: publicProcedure.query(async () => {
    const prompts = await db
      .select()
      .from(adminPrompts)
      .orderBy(desc(adminPrompts.isMaster), desc(adminPrompts.createdAt));
    
    return prompts;
  }),

  // Get prompt by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [prompt] = await db
        .select()
        .from(adminPrompts)
        .where(eq(adminPrompts.id, input.id))
        .limit(1);
      
      return prompt;
    }),

  // Get master prompt
  getMaster: publicProcedure.query(async () => {
    const [masterPrompt] = await db
      .select()
      .from(adminPrompts)
      .where(and(eq(adminPrompts.isMaster, true), eq(adminPrompts.isActive, true)))
      .limit(1);
    
    return masterPrompt;
  }),

  // Get prompts by purpose
  getByPurpose: publicProcedure
    .input(z.object({ purpose: adminPromptPurposeEnum }))
    .query(async ({ input }) => {
      const prompts = await db
        .select()
        .from(adminPrompts)
        .where(eq(adminPrompts.purpose, input.purpose))
        .orderBy(desc(adminPrompts.createdAt));
      
      return prompts;
    }),

  // Create prompt
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        prompt: z.string(),
        purpose: adminPromptPurposeEnum,
        aiProvider: aiProviderEnum.optional(),
        isMaster: z.boolean().optional(),
        isActive: z.boolean().optional(),
        config: z.any().optional(),
        createdByUserId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // If setting as master, deactivate current master
      if (input.isMaster) {
        await db
          .update(adminPrompts)
          .set({ isMaster: false, updatedAt: new Date() })
          .where(eq(adminPrompts.isMaster, true));
      }

      const [created] = await db
        .insert(adminPrompts)
        .values({
          name: input.name,
          description: input.description,
          prompt: input.prompt,
          purpose: input.purpose,
          aiProvider: input.aiProvider ?? "claude",
          isMaster: input.isMaster ?? false,
          isActive: input.isActive ?? true,
          config: input.config,
          createdByUserId: input.createdByUserId,
          version: 1,
          usageCount: 0,
        })
        .returning();

      return created;
    }),

  // Update prompt
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        prompt: z.string().optional(),
        purpose: adminPromptPurposeEnum.optional(),
        aiProvider: aiProviderEnum.optional(),
        isMaster: z.boolean().optional(),
        isActive: z.boolean().optional(),
        config: z.any().optional(),
        updatedByUserId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;

      // If setting as master, deactivate current master
      if (updates.isMaster) {
        await db
          .update(adminPrompts)
          .set({ isMaster: false, updatedAt: new Date() })
          .where(and(eq(adminPrompts.isMaster, true), eq(adminPrompts.id, id)));
      }

      const [updated] = await db
        .update(adminPrompts)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(adminPrompts.id, id))
        .returning();

      return updated;
    }),

  // Toggle active status
  toggleActive: publicProcedure
    .input(
      z.object({
        id: z.string(),
        updatedByUserId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const [current] = await db
        .select()
        .from(adminPrompts)
        .where(eq(adminPrompts.id, input.id))
        .limit(1);

      if (!current) {
        throw new Error("Prompt not found");
      }

      const [updated] = await db
        .update(adminPrompts)
        .set({
          isActive: !current.isActive,
          updatedByUserId: input.updatedByUserId,
          updatedAt: new Date(),
        })
        .where(eq(adminPrompts.id, input.id))
        .returning();

      return updated;
    }),

  // Set as master
  setAsMaster: publicProcedure
    .input(
      z.object({
        id: z.string(),
        updatedByUserId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Deactivate current master
      await db
        .update(adminPrompts)
        .set({ isMaster: false, updatedAt: new Date() })
        .where(eq(adminPrompts.isMaster, true));

      // Set new master
      const [updated] = await db
        .update(adminPrompts)
        .set({
          isMaster: true,
          isActive: true,
          updatedByUserId: input.updatedByUserId,
          updatedAt: new Date(),
        })
        .where(eq(adminPrompts.id, input.id))
        .returning();

      return updated;
    }),

  // Delete prompt
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // Don't allow deleting master prompt
      const [prompt] = await db
        .select()
        .from(adminPrompts)
        .where(eq(adminPrompts.id, input.id))
        .limit(1);

      if (prompt?.isMaster) {
        throw new Error("Cannot delete master prompt");
      }

      await db
        .delete(adminPrompts)
        .where(eq(adminPrompts.id, input.id));

      return { success: true };
    }),

  // Duplicate prompt
  duplicate: publicProcedure
    .input(
      z.object({
        id: z.string(),
        createdByUserId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const [original] = await db
        .select()
        .from(adminPrompts)
        .where(eq(adminPrompts.id, input.id))
        .limit(1);

      if (!original) {
        throw new Error("Prompt not found");
      }

      const [duplicated] = await db
        .insert(adminPrompts)
        .values({
          name: `${original.name} (Copy)`,
          description: original.description,
          prompt: original.prompt,
          purpose: original.purpose,
          aiProvider: original.aiProvider,
          isMaster: false, // Duplicates are never master
          isActive: true,
          config: original.config,
          createdByUserId: input.createdByUserId,
          version: 1,
          usageCount: 0,
        })
        .returning();

      return duplicated;
    }),

  // Increment usage count
  incrementUsage: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const [current] = await db
        .select()
        .from(adminPrompts)
        .where(eq(adminPrompts.id, input.id))
        .limit(1);

      if (!current) {
        throw new Error("Prompt not found");
      }

      const [updated] = await db
        .update(adminPrompts)
        .set({
          usageCount: (current.usageCount ?? 0) + 1,
          lastUsedAt: new Date(),
        })
        .where(eq(adminPrompts.id, input.id))
        .returning();

      return updated;
    }),
});
