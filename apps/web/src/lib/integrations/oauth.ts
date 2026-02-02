/**
 * OAuth Token Utilities
 * 
 * Provides helper functions for working with OAuth tokens,
 * including automatic token refresh when expired.
 */

import { db, integrations, integrationOauthTokens, eq } from '@workspace/db';

// Token refresh buffer - refresh 5 minutes before expiry
const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000;

// OAuth configuration for supported providers
const OAUTH_CONFIGS: Record<string, {
  tokenUrl: string;
  clientIdEnv: string;
  clientSecretEnv: string;
}> = {
  google: {
    tokenUrl: 'https://oauth2.googleapis.com/token',
    clientIdEnv: 'INTEGRATION_GOOGLE_CLIENT_ID',
    clientSecretEnv: 'INTEGRATION_GOOGLE_CLIENT_SECRET',
  },
};

interface RefreshTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope?: string;
}

/**
 * Get a valid access token for an integration.
 * Automatically refreshes the token if it's expired or about to expire.
 * 
 * @param integrationId - The integration ID
 * @returns The access token, or null if not available
 */
export async function getValidAccessToken(integrationId: string): Promise<string | null> {
  // Get the integration
  const [integration] = await db
    .select()
    .from(integrations)
    .where(eq(integrations.id, integrationId))
    .limit(1);

  if (!integration) {
    console.error('[OAuth] Integration not found:', integrationId);
    return null;
  }

  // Get OAuth token
  const [oauthToken] = await db
    .select()
    .from(integrationOauthTokens)
    .where(eq(integrationOauthTokens.integrationId, integrationId))
    .limit(1);

  if (!oauthToken) {
    console.error('[OAuth] OAuth token not found for integration:', integrationId);
    return null;
  }

  // Check if token is still valid (with buffer)
  const now = Date.now();
  const expiresAt = oauthToken.expiresAt?.getTime() || 0;
  
  if (expiresAt - TOKEN_REFRESH_BUFFER_MS > now) {
    // Token is still valid
    return oauthToken.accessToken;
  }

  // Token is expired or about to expire - refresh it
  if (!oauthToken.refreshToken) {
    console.error('[OAuth] No refresh token available for integration:', integrationId);
    return null;
  }

  const provider = oauthToken.provider;
  const config = OAUTH_CONFIGS[provider];
  
  if (!config) {
    console.error('[OAuth] Unsupported provider:', provider);
    return null;
  }

  const clientId = process.env[config.clientIdEnv];
  const clientSecret = process.env[config.clientSecretEnv];
  
  if (!clientId || !clientSecret) {
    console.error('[OAuth] Missing OAuth credentials for provider:', provider);
    return null;
  }

  try {
    // Refresh the token
    const tokenResponse = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: oauthToken.refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('[OAuth] Token refresh failed:', errorText);
      
      // Mark integration as error
      await db
        .update(integrations)
        .set({
          status: 'error',
          lastError: 'Token refresh failed',
          lastErrorAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(integrations.id, integrationId));

      return null;
    }

    const tokens: RefreshTokenResponse = await tokenResponse.json();
    const newExpiresAt = new Date(Date.now() + tokens.expires_in * 1000);

    // Update OAuth token in database
    await db
      .update(integrationOauthTokens)
      .set({
        accessToken: tokens.access_token, // TODO: Encrypt in production
        tokenType: tokens.token_type,
        scope: tokens.scope || oauthToken.scope,
        expiresAt: newExpiresAt,
        updatedAt: new Date(),
      })
      .where(eq(integrationOauthTokens.id, oauthToken.id));

    // Update integration status
    await db
      .update(integrations)
      .set({
        status: 'active',
        updatedAt: new Date(),
      })
      .where(eq(integrations.id, integrationId));

    return tokens.access_token;
  } catch (err) {
    console.error('[OAuth] Error refreshing token:', err);
    return null;
  }
}

/**
 * Check if an integration's OAuth token is valid.
 * 
 * @param integrationId - The integration ID
 * @returns True if the token is valid (or can be refreshed)
 */
export async function isTokenValid(integrationId: string): Promise<boolean> {
  const token = await getValidAccessToken(integrationId);
  return token !== null;
}

/**
 * Get the Google access token for a brand.
 * Convenience function for the most common use case.
 * 
 * @param brandId - The brand ID
 * @returns The access token, or null if not available
 */
export async function getGoogleAccessToken(brandId: string): Promise<string | null> {
  // Find the Google integration for this brand
  const [integration] = await db
    .select()
    .from(integrations)
    .where(eq(integrations.brandId, brandId))
    .limit(1);

  if (!integration || integration.type !== 'google') {
    return null;
  }

  return getValidAccessToken(integration.id);
}
