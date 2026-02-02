import { z } from "zod";
import { eq, desc, inArray, and, isNull, ne, sql } from "drizzle-orm";
import {
  content,
  contentPublications,
  contentExports,
  contentImports,
  contentImportItems,
  brands,
  integrations,
  brandLocales,
} from "@workspace/db/schema";
import { router, publicProcedure } from "../trpc";
import { randomUUID } from "crypto";

// Zod schemas for validation
const contentStatusSchema = z.enum([
  "opportunity",
  "generating",
  "draft",
  "review",
  "scheduled",
  "published",
  "archived",
]);

const contentTypeSchema = z.enum([
  "how_to",
  "listicle",
  "explainer",
  "comparison",
  "review",
  "case_study",
  "ultimate_guide",
  "roundup",
  "news",
  "faq",
  "checklist",
  "opinion",
  "tutorial",
  "glossary",
  "pillar",
]);

const publicationStatusSchema = z.enum([
  "pending",
  "scheduled",
  "publishing",
  "published",
  "failed",
]);

const exportStatusSchema = z.enum([
  "pending",
  "exporting",
  "completed",
  "failed",
]);

const exportFormatSchema = z.enum([
  "google_doc",
  "pdf",
  "markdown",
  "html",
  "docx",
]);

const importStatusSchema = z.enum([
  "pending",
  "processing",
  "completed",
  "failed",
  "partial",
]);

const importSourceTypeSchema = z.enum([
  "google_sheets",
  "csv_upload",
  "excel_upload",
]);

export const contentRouter = router({
  // ==================== CONTENT CRUD ====================

  /**
   * Get all content for a workspace (across all brands)
   */
  getByWorkspace: publicProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        status: contentStatusSchema.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const workspaceBrands = await ctx.db
        .select({ id: brands.id })
        .from(brands)
        .where(eq(brands.workspaceId, input.workspaceId));

      if (workspaceBrands.length === 0) {
        return [];
      }

      const brandIds = workspaceBrands.map((b) => b.id);

      let query = ctx.db
        .select()
        .from(content)
        .where(inArray(content.brandId, brandIds))
        .orderBy(desc(content.createdAt));

      if (input.status) {
        query = ctx.db
          .select()
          .from(content)
          .where(
            and(
              inArray(content.brandId, brandIds),
              eq(content.status, input.status)
            )
          )
          .orderBy(desc(content.createdAt));
      }

      return await query;
    }),

  /**
   * Get all content for a brand
   */
  getByBrand: publicProcedure
    .input(
      z.object({
        brandId: z.string().uuid(),
        status: contentStatusSchema.optional(),
        locale: z.string().optional(), // Filter by locale
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(content.brandId, input.brandId)];
      
      if (input.status) {
        conditions.push(eq(content.status, input.status));
      }
      
      if (input.locale) {
        conditions.push(eq(content.locale, input.locale));
      }

      return await ctx.db
        .select()
        .from(content)
        .where(and(...conditions))
        .orderBy(desc(content.createdAt));
    }),

  /**
   * Get content by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [item] = await ctx.db
        .select()
        .from(content)
        .where(eq(content.id, input.id))
        .limit(1);

      if (!item) {
        throw new Error("Content not found");
      }

      return item;
    }),

  /**
   * Create new content
   */
  create: publicProcedure
    .input(
      z.object({
        brandId: z.string().uuid(),
        type: contentTypeSchema,
        title: z.string().min(1),
        status: contentStatusSchema.optional(),
        locale: z.string().optional(), // Defaults to "en-US"
        content: z.string().optional(),
        featuredImage: z.string().optional(),
        featuredImageAlt: z.string().optional(),
        authorId: z.string().optional(),
        authorName: z.string().optional(),
        slug: z.string().optional(),
        metaDescription: z.string().optional(),
        targetKeyword: z.string().optional(),
        searchVolume: z.number().optional(),
        keywordDifficulty: z.number().optional(),
        promptInstructions: z.string().optional(),
        outline: z
          .object({
            sections: z.array(
              z.object({
                title: z.string(),
                points: z.array(z.string()),
              })
            ),
          })
          .optional(),
        customFields: z.record(z.unknown()).optional(),
        plannedAt: z.string().datetime().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Generate translationGroupId for new content (source locale)
      const translationGroupId = randomUUID();
      
      const [item] = await ctx.db
        .insert(content)
        .values({
          brandId: input.brandId,
          type: input.type,
          title: input.title,
          status: input.status || "opportunity",
          locale: input.locale || "en-US",
          translationGroupId,
          isSourceLocale: true,
          content: input.content,
          featuredImage: input.featuredImage,
          featuredImageAlt: input.featuredImageAlt,
          authorId: input.authorId,
          authorName: input.authorName,
          slug: input.slug,
          metaDescription: input.metaDescription,
          targetKeyword: input.targetKeyword,
          searchVolume: input.searchVolume,
          keywordDifficulty: input.keywordDifficulty,
          promptInstructions: input.promptInstructions,
          outline: input.outline,
          customFields: input.customFields,
          plannedAt: input.plannedAt ? new Date(input.plannedAt) : undefined,
        })
        .returning();

      if (!item) {
        throw new Error("Failed to create content");
      }

      return item;
    }),

  /**
   * Update content
   */
  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        type: contentTypeSchema.optional(),
        title: z.string().min(1).optional(),
        status: contentStatusSchema.optional(),
        content: z.string().optional(),
        featuredImage: z.string().optional(),
        featuredImageAlt: z.string().optional(),
        authorId: z.string().optional(),
        authorName: z.string().optional(),
        slug: z.string().optional(),
        metaDescription: z.string().optional(),
        targetKeyword: z.string().optional(),
        searchVolume: z.number().optional(),
        keywordDifficulty: z.number().optional(),
        promptInstructions: z.string().optional(),
        outline: z
          .object({
            sections: z.array(
              z.object({
                title: z.string(),
                points: z.array(z.string()),
              })
            ),
          })
          .optional(),
        wordCount: z.number().optional(),
        readTimeMinutes: z.number().optional(),
        keywordCount: z.number().optional(),
        imageCount: z.number().optional(),
        internalLinkCount: z.number().optional(),
        externalLinkCount: z.number().optional(),
        articleScore: z.number().optional(),
        customFields: z.record(z.unknown()).optional(),
        plannedAt: z.string().datetime().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, plannedAt, ...updates } = input;

      const [item] = await ctx.db
        .update(content)
        .set({
          ...updates,
          plannedAt: plannedAt ? new Date(plannedAt) : undefined,
          updatedAt: new Date(),
        })
        .where(eq(content.id, id))
        .returning();

      if (!item) {
        throw new Error("Content not found");
      }

      return item;
    }),

  /**
   * Delete content
   */
  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(content).where(eq(content.id, input.id));
      return { success: true };
    }),

  // ==================== PUBLICATIONS ====================

  /**
   * Get publications for content
   */
  getPublications: publicProcedure
    .input(z.object({ contentId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(contentPublications)
        .where(eq(contentPublications.contentId, input.contentId))
        .orderBy(desc(contentPublications.createdAt));
    }),

  /**
   * Create publication
   */
  createPublication: publicProcedure
    .input(
      z.object({
        contentId: z.string().uuid(),
        integrationId: z.string().uuid(),
        status: publicationStatusSchema.optional(),
        publishConfig: z.record(z.unknown()).optional(),
        scheduledAt: z.string().datetime().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [pub] = await ctx.db
        .insert(contentPublications)
        .values({
          contentId: input.contentId,
          integrationId: input.integrationId,
          status: input.status || "pending",
          publishConfig: input.publishConfig,
          scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
        })
        .returning();

      if (!pub) {
        throw new Error("Failed to create publication");
      }

      return pub;
    }),

  /**
   * Update publication
   */
  updatePublication: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: publicationStatusSchema.optional(),
        publishConfig: z.record(z.unknown()).optional(),
        scheduledAt: z.string().datetime().optional(),
        publishedAt: z.string().datetime().optional(),
        externalId: z.string().optional(),
        externalUrl: z.string().optional(),
        error: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, scheduledAt, publishedAt, ...updates } = input;

      const [pub] = await ctx.db
        .update(contentPublications)
        .set({
          ...updates,
          scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
          publishedAt: publishedAt ? new Date(publishedAt) : undefined,
          updatedAt: new Date(),
        })
        .where(eq(contentPublications.id, id))
        .returning();

      if (!pub) {
        throw new Error("Publication not found");
      }

      return pub;
    }),

  // ==================== EXPORTS ====================

  /**
   * Get exports for content
   */
  getExports: publicProcedure
    .input(z.object({ contentId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(contentExports)
        .where(eq(contentExports.contentId, input.contentId))
        .orderBy(desc(contentExports.createdAt));
    }),

  /**
   * Create export
   */
  createExport: publicProcedure
    .input(
      z.object({
        contentId: z.string().uuid(),
        integrationId: z.string().uuid(),
        exportFormat: exportFormatSchema,
        folderId: z.string().optional(),
        fileName: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [exp] = await ctx.db
        .insert(contentExports)
        .values({
          contentId: input.contentId,
          integrationId: input.integrationId,
          exportFormat: input.exportFormat,
          folderId: input.folderId,
          fileName: input.fileName,
        })
        .returning();

      if (!exp) {
        throw new Error("Failed to create export");
      }

      return exp;
    }),

  /**
   * Update export
   */
  updateExport: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: exportStatusSchema.optional(),
        externalId: z.string().optional(),
        externalUrl: z.string().optional(),
        error: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;

      const updateData: Record<string, unknown> = {
        ...updates,
        updatedAt: new Date(),
      };

      if (updates.status === "completed") {
        updateData.exportedAt = new Date();
      }

      const [exp] = await ctx.db
        .update(contentExports)
        .set(updateData)
        .where(eq(contentExports.id, id))
        .returning();

      if (!exp) {
        throw new Error("Export not found");
      }

      return exp;
    }),

  // ==================== IMPORTS ====================

  /**
   * Get imports for a brand
   */
  getImports: publicProcedure
    .input(z.object({ brandId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(contentImports)
        .where(eq(contentImports.brandId, input.brandId))
        .orderBy(desc(contentImports.createdAt));
    }),

  /**
   * Create import
   */
  createImport: publicProcedure
    .input(
      z.object({
        brandId: z.string().uuid(),
        sourceType: importSourceTypeSchema,
        integrationId: z.string().uuid().optional(),
        sourceUrl: z.string().optional(),
        sourceFileId: z.string().optional(),
        fileName: z.string().optional(),
        columnMapping: z.record(z.string()).optional(),
        importedBy: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [imp] = await ctx.db
        .insert(contentImports)
        .values({
          brandId: input.brandId,
          sourceType: input.sourceType,
          integrationId: input.integrationId,
          sourceUrl: input.sourceUrl,
          sourceFileId: input.sourceFileId,
          fileName: input.fileName,
          columnMapping: input.columnMapping,
          importedBy: input.importedBy,
        })
        .returning();

      if (!imp) {
        throw new Error("Failed to create import");
      }

      return imp;
    }),

  /**
   * Update import
   */
  updateImport: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: importStatusSchema.optional(),
        totalRows: z.number().optional(),
        processedRows: z.number().optional(),
        successCount: z.number().optional(),
        errorCount: z.number().optional(),
        errors: z
          .array(
            z.object({
              row: z.number(),
              field: z.string().optional(),
              message: z.string(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;

      const updateData: Record<string, unknown> = {
        ...updates,
        updatedAt: new Date(),
      };

      if (
        updates.status === "processing" &&
        !updates.processedRows
      ) {
        updateData.startedAt = new Date();
      }

      if (
        updates.status === "completed" ||
        updates.status === "failed" ||
        updates.status === "partial"
      ) {
        updateData.completedAt = new Date();
      }

      const [imp] = await ctx.db
        .update(contentImports)
        .set(updateData)
        .where(eq(contentImports.id, id))
        .returning();

      if (!imp) {
        throw new Error("Import not found");
      }

      return imp;
    }),

  /**
   * Get import items
   */
  getImportItems: publicProcedure
    .input(z.object({ importId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(contentImportItems)
        .where(eq(contentImportItems.importId, input.importId))
        .orderBy(contentImportItems.rowNumber);
    }),

  /**
   * Create import item
   */
  createImportItem: publicProcedure
    .input(
      z.object({
        importId: z.string().uuid(),
        rowNumber: z.number(),
        rawData: z.record(z.unknown()),
        mappedData: z.record(z.unknown()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [item] = await ctx.db
        .insert(contentImportItems)
        .values({
          importId: input.importId,
          rowNumber: input.rowNumber,
          rawData: input.rawData,
          mappedData: input.mappedData,
        })
        .returning();

      if (!item) {
        throw new Error("Failed to create import item");
      }

      return item;
    }),

  // ==================== TRANSLATIONS ====================

  /**
   * Get all translations of a content piece
   */
  getTranslations: publicProcedure
    .input(z.object({ translationGroupId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(content)
        .where(eq(content.translationGroupId, input.translationGroupId))
        .orderBy(content.isSourceLocale, content.locale);
    }),

  /**
   * Create a translation of existing content
   */
  createTranslation: publicProcedure
    .input(
      z.object({
        sourceContentId: z.string().uuid(), // The content to translate from
        locale: z.string(), // Target locale (e.g., "de", "fr")
        title: z.string().min(1),
        content: z.string().optional(),
        slug: z.string().optional(),
        metaDescription: z.string().optional(),
        targetKeyword: z.string().optional(),
        searchVolume: z.number().optional(),
        keywordDifficulty: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get the source content
      const [source] = await ctx.db
        .select()
        .from(content)
        .where(eq(content.id, input.sourceContentId))
        .limit(1);

      if (!source) {
        throw new Error("Source content not found");
      }

      // Use existing translationGroupId or create one if source doesn't have it
      const translationGroupId = source.translationGroupId || randomUUID();

      // If source doesn't have a translationGroupId, update it
      if (!source.translationGroupId) {
        await ctx.db
          .update(content)
          .set({ translationGroupId, isSourceLocale: true, updatedAt: new Date() })
          .where(eq(content.id, source.id));
      }

      // Create the translation
      const [translation] = await ctx.db
        .insert(content)
        .values({
          brandId: source.brandId,
          type: source.type,
          status: "opportunity",
          locale: input.locale,
          translationGroupId,
          isSourceLocale: false,
          title: input.title,
          content: input.content,
          slug: input.slug,
          metaDescription: input.metaDescription,
          targetKeyword: input.targetKeyword,
          searchVolume: input.searchVolume,
          keywordDifficulty: input.keywordDifficulty,
          // Copy some fields from source
          featuredImage: source.featuredImage,
          featuredImageAlt: source.featuredImageAlt,
          authorId: source.authorId,
          authorName: source.authorName,
          promptInstructions: source.promptInstructions,
          outline: source.outline,
          customFields: source.customFields,
        })
        .returning();

      if (!translation) {
        throw new Error("Failed to create translation");
      }

      return translation;
    }),

  /**
   * Get content that is missing a translation for a specific locale
   */
  getMissingTranslations: publicProcedure
    .input(
      z.object({
        brandId: z.string().uuid(),
        targetLocale: z.string(), // The locale we want to find missing translations for
      })
    )
    .query(async ({ ctx, input }) => {
      // Get all source content for the brand that doesn't have a translation in targetLocale
      const sourceContent = await ctx.db
        .select()
        .from(content)
        .where(
          and(
            eq(content.brandId, input.brandId),
            eq(content.isSourceLocale, true)
          )
        );

      // For each source, check if translation exists
      const missingTranslations = [];

      for (const source of sourceContent) {
        if (!source.translationGroupId) {
          // Source has no translations at all
          missingTranslations.push(source);
          continue;
        }

        // Check if translation exists for target locale
        const [existingTranslation] = await ctx.db
          .select()
          .from(content)
          .where(
            and(
              eq(content.translationGroupId, source.translationGroupId),
              eq(content.locale, input.targetLocale)
            )
          )
          .limit(1);

        if (!existingTranslation) {
          missingTranslations.push(source);
        }
      }

      return missingTranslations;
    }),

  // ==================== BRAND LOCALES ====================

  /**
   * Get all locales for a brand
   */
  getBrandLocales: publicProcedure
    .input(z.object({ brandId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(brandLocales)
        .where(eq(brandLocales.brandId, input.brandId))
        .orderBy(brandLocales.isDefault, brandLocales.locale);
    }),

  /**
   * Add a locale to a brand
   */
  addBrandLocale: publicProcedure
    .input(
      z.object({
        brandId: z.string().uuid(),
        locale: z.string(),
        isDefault: z.boolean().optional(),
        subdomain: z.string().optional(),
        pathPrefix: z.string().optional(),
        publishIntegrationId: z.string().uuid().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // If this is set as default, unset other defaults
      if (input.isDefault) {
        await ctx.db
          .update(brandLocales)
          .set({ isDefault: false, updatedAt: new Date() })
          .where(eq(brandLocales.brandId, input.brandId));
      }

      const [locale] = await ctx.db
        .insert(brandLocales)
        .values({
          brandId: input.brandId,
          locale: input.locale,
          isDefault: input.isDefault || false,
          subdomain: input.subdomain,
          pathPrefix: input.pathPrefix,
          publishIntegrationId: input.publishIntegrationId,
        })
        .returning();

      if (!locale) {
        throw new Error("Failed to add brand locale");
      }

      return locale;
    }),

  /**
   * Update a brand locale
   */
  updateBrandLocale: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        isDefault: z.boolean().optional(),
        isActive: z.boolean().optional(),
        subdomain: z.string().optional(),
        pathPrefix: z.string().optional(),
        publishIntegrationId: z.string().uuid().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;

      // If setting as default, get the brandId first and unset other defaults
      if (updates.isDefault) {
        const [current] = await ctx.db
          .select({ brandId: brandLocales.brandId })
          .from(brandLocales)
          .where(eq(brandLocales.id, id))
          .limit(1);

        if (current) {
          await ctx.db
            .update(brandLocales)
            .set({ isDefault: false, updatedAt: new Date() })
            .where(eq(brandLocales.brandId, current.brandId));
        }
      }

      const [locale] = await ctx.db
        .update(brandLocales)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(brandLocales.id, id))
        .returning();

      if (!locale) {
        throw new Error("Brand locale not found");
      }

      return locale;
    }),

  /**
   * Remove a locale from a brand
   */
  removeBrandLocale: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(brandLocales).where(eq(brandLocales.id, input.id));
      return { success: true };
    }),
});
