import { z } from "zod";
import { eq, desc, inArray, and } from "drizzle-orm";
import {
  integrations,
  integrationApiKeys,
  integrationWebhooks,
  integrationOauthTokens,
  brands,
} from "@workspace/db/schema";
import { router, publicProcedure } from "../trpc";

// Zod schemas for validation
const integrationTypeSchema = z.enum([
  "google",
  "wordpress",
  "webflow",
  "shopify",
  "medium",
  "ghost",
  "custom_api",
  "dropbox",
  "ahrefs",
  "semrush",
  "moz",
  "webhook",
]);

const integrationAuthTypeSchema = z.enum([
  "api_key",
  "oauth",
  "webhook",
  "basic_auth",
]);

const integrationStatusSchema = z.enum([
  "active",
  "inactive",
  "error",
  "pending_auth",
]);

const webhookDirectionSchema = z.enum(["inbound", "outbound"]);

const oauthProviderSchema = z.enum([
  "google",
  "facebook",
  "linkedin",
  "twitter",
  "github",
  "microsoft",
]);

export const integrationsRouter = router({
  // ==================== INTEGRATIONS CRUD ====================

  /**
   * Get all integrations for a workspace
   */
  getByWorkspace: publicProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
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

      return await ctx.db
        .select()
        .from(integrations)
        .where(inArray(integrations.brandId, brandIds))
        .orderBy(desc(integrations.createdAt));
    }),

  /**
   * Get all integrations for a brand
   */
  getByBrand: publicProcedure
    .input(
      z.object({
        brandId: z.string().uuid(),
        type: integrationTypeSchema.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (input.type) {
        return await ctx.db
          .select()
          .from(integrations)
          .where(
            and(
              eq(integrations.brandId, input.brandId),
              eq(integrations.type, input.type)
            )
          )
          .orderBy(desc(integrations.createdAt));
      }

      return await ctx.db
        .select()
        .from(integrations)
        .where(eq(integrations.brandId, input.brandId))
        .orderBy(desc(integrations.createdAt));
    }),

  /**
   * Get integration by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [integration] = await ctx.db
        .select()
        .from(integrations)
        .where(eq(integrations.id, input.id))
        .limit(1);

      if (!integration) {
        throw new Error("Integration not found");
      }

      return integration;
    }),

  /**
   * Create integration
   */
  create: publicProcedure
    .input(
      z.object({
        brandId: z.string().uuid(),
        name: z.string().min(1),
        type: integrationTypeSchema,
        authType: integrationAuthTypeSchema,
        status: integrationStatusSchema.optional(),
        config: z.record(z.unknown()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [integration] = await ctx.db
        .insert(integrations)
        .values({
          brandId: input.brandId,
          name: input.name,
          type: input.type,
          authType: input.authType,
          status: input.status || "pending_auth",
          config: input.config,
        })
        .returning();

      if (!integration) {
        throw new Error("Failed to create integration");
      }

      return integration;
    }),

  /**
   * Update integration
   */
  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        status: integrationStatusSchema.optional(),
        config: z.record(z.unknown()).optional(),
        lastError: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, lastError, ...updates } = input;

      const updateData: Record<string, unknown> = {
        ...updates,
        updatedAt: new Date(),
      };

      if (lastError) {
        updateData.lastError = lastError;
        updateData.lastErrorAt = new Date();
      }

      if (updates.status === "active") {
        updateData.lastSyncAt = new Date();
      }

      const [integration] = await ctx.db
        .update(integrations)
        .set(updateData)
        .where(eq(integrations.id, id))
        .returning();

      if (!integration) {
        throw new Error("Integration not found");
      }

      return integration;
    }),

  /**
   * Delete integration
   */
  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(integrations).where(eq(integrations.id, input.id));
      return { success: true };
    }),

  /**
   * Connect integration (convenience method)
   * Creates integration and stores credentials in one call
   */
  connect: publicProcedure
    .input(
      z.object({
        brandId: z.string().uuid(),
        type: integrationTypeSchema,
        config: z.record(z.unknown()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Determine auth type and name based on integration type
      const authTypeMap: Record<string, "api_key" | "oauth" | "webhook" | "basic_auth"> = {
        google: "oauth",
        wordpress: "api_key",
        webflow: "api_key",
        shopify: "api_key",
        webhook: "webhook",
        dropbox: "oauth",
      };

      const nameMap: Record<string, string> = {
        google: "Google",
        wordpress: "WordPress",
        webflow: "Webflow",
        shopify: "Shopify",
        webhook: "Webhooks",
        dropbox: "Dropbox",
        ahrefs: "Ahrefs",
        semrush: "SEMrush",
        moz: "Moz",
      };

      const authType = authTypeMap[input.type] || "api_key";
      const name = nameMap[input.type] || input.type;

      // Check if integration already exists for this brand and type
      const [existing] = await ctx.db
        .select()
        .from(integrations)
        .where(
          and(
            eq(integrations.brandId, input.brandId),
            eq(integrations.type, input.type)
          )
        )
        .limit(1);

      if (existing) {
        // Update existing integration
        const [updated] = await ctx.db
          .update(integrations)
          .set({
            config: input.config,
            status: "active",
            updatedAt: new Date(),
          })
          .where(eq(integrations.id, existing.id))
          .returning();

        return updated;
      }

      // Create new integration
      const [integration] = await ctx.db
        .insert(integrations)
        .values({
          brandId: input.brandId,
          name,
          type: input.type,
          authType,
          status: "active",
          config: input.config,
        })
        .returning();

      if (!integration) {
        throw new Error("Failed to create integration");
      }

      return integration;
    }),

  /**
   * Disconnect integration
   */
  disconnect: publicProcedure
    .input(
      z.object({
        brandId: z.string().uuid(),
        type: integrationTypeSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(integrations)
        .where(
          and(
            eq(integrations.brandId, input.brandId),
            eq(integrations.type, input.type)
          )
        );
      return { success: true };
    }),

  // ==================== API KEYS ====================

  /**
   * Get API keys for integration
   */
  getApiKeys: publicProcedure
    .input(z.object({ integrationId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(integrationApiKeys)
        .where(eq(integrationApiKeys.integrationId, input.integrationId))
        .orderBy(desc(integrationApiKeys.createdAt));
    }),

  /**
   * Create API key
   */
  createApiKey: publicProcedure
    .input(
      z.object({
        integrationId: z.string().uuid(),
        name: z.string().optional(),
        apiKey: z.string(), // Should be encrypted before storage
        apiSecret: z.string().optional(),
        expiresAt: z.string().datetime().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [key] = await ctx.db
        .insert(integrationApiKeys)
        .values({
          integrationId: input.integrationId,
          name: input.name,
          apiKey: input.apiKey,
          apiSecret: input.apiSecret,
          expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
        })
        .returning();

      if (!key) {
        throw new Error("Failed to create API key");
      }

      // Update integration status to active
      await ctx.db
        .update(integrations)
        .set({ status: "active", updatedAt: new Date() })
        .where(eq(integrations.id, input.integrationId));

      return key;
    }),

  /**
   * Delete API key
   */
  deleteApiKey: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(integrationApiKeys)
        .where(eq(integrationApiKeys.id, input.id));
      return { success: true };
    }),

  // ==================== WEBHOOKS ====================

  /**
   * Get webhooks for integration
   */
  getWebhooks: publicProcedure
    .input(z.object({ integrationId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(integrationWebhooks)
        .where(eq(integrationWebhooks.integrationId, input.integrationId))
        .orderBy(desc(integrationWebhooks.createdAt));
    }),

  /**
   * Create webhook
   */
  createWebhook: publicProcedure
    .input(
      z.object({
        integrationId: z.string().uuid(),
        direction: webhookDirectionSchema,
        name: z.string().optional(),
        url: z.string().url(),
        secret: z.string().optional(),
        events: z.object({ events: z.array(z.string()) }).optional(),
        headers: z.record(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [webhook] = await ctx.db
        .insert(integrationWebhooks)
        .values({
          integrationId: input.integrationId,
          direction: input.direction,
          name: input.name,
          url: input.url,
          secret: input.secret,
          events: input.events,
          headers: input.headers,
        })
        .returning();

      if (!webhook) {
        throw new Error("Failed to create webhook");
      }

      return webhook;
    }),

  /**
   * Update webhook
   */
  updateWebhook: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().optional(),
        url: z.string().url().optional(),
        secret: z.string().optional(),
        events: z.object({ events: z.array(z.string()) }).optional(),
        headers: z.record(z.string()).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;

      const [webhook] = await ctx.db
        .update(integrationWebhooks)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(integrationWebhooks.id, id))
        .returning();

      if (!webhook) {
        throw new Error("Webhook not found");
      }

      return webhook;
    }),

  /**
   * Delete webhook
   */
  deleteWebhook: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(integrationWebhooks)
        .where(eq(integrationWebhooks.id, input.id));
      return { success: true };
    }),

  // ==================== OAUTH TOKENS ====================

  /**
   * Get OAuth token for integration
   */
  getOAuthToken: publicProcedure
    .input(z.object({ integrationId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [token] = await ctx.db
        .select()
        .from(integrationOauthTokens)
        .where(eq(integrationOauthTokens.integrationId, input.integrationId))
        .limit(1);

      return token || null;
    }),

  /**
   * Save OAuth token
   */
  saveOAuthToken: publicProcedure
    .input(
      z.object({
        integrationId: z.string().uuid(),
        provider: oauthProviderSchema,
        accessToken: z.string(),
        refreshToken: z.string().optional(),
        tokenType: z.string().optional(),
        scope: z.string().optional(),
        expiresAt: z.string().datetime().optional(),
        rawResponse: z.record(z.unknown()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Delete existing token if any
      await ctx.db
        .delete(integrationOauthTokens)
        .where(eq(integrationOauthTokens.integrationId, input.integrationId));

      // Insert new token
      const [token] = await ctx.db
        .insert(integrationOauthTokens)
        .values({
          integrationId: input.integrationId,
          provider: input.provider,
          accessToken: input.accessToken,
          refreshToken: input.refreshToken,
          tokenType: input.tokenType,
          scope: input.scope,
          expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
          rawResponse: input.rawResponse,
        })
        .returning();

      if (!token) {
        throw new Error("Failed to save OAuth token");
      }

      // Update integration status to active
      await ctx.db
        .update(integrations)
        .set({ status: "active", updatedAt: new Date() })
        .where(eq(integrations.id, input.integrationId));

      return token;
    }),

  /**
   * Refresh OAuth token
   */
  refreshOAuthToken: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        accessToken: z.string(),
        refreshToken: z.string().optional(),
        expiresAt: z.string().datetime().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, expiresAt, ...updates } = input;

      const [token] = await ctx.db
        .update(integrationOauthTokens)
        .set({
          ...updates,
          expiresAt: expiresAt ? new Date(expiresAt) : undefined,
          updatedAt: new Date(),
        })
        .where(eq(integrationOauthTokens.id, id))
        .returning();

      if (!token) {
        throw new Error("OAuth token not found");
      }

      return token;
    }),

  /**
   * Delete OAuth token
   */
  deleteOAuthToken: publicProcedure
    .input(z.object({ integrationId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(integrationOauthTokens)
        .where(eq(integrationOauthTokens.integrationId, input.integrationId));

      // Update integration status to pending_auth
      await ctx.db
        .update(integrations)
        .set({ status: "pending_auth", updatedAt: new Date() })
        .where(eq(integrations.id, input.integrationId));

      return { success: true };
    }),
});
