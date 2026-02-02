/**
 * OAuth Token Refresh Route
 * 
 * Refreshes an expired OAuth access token using the refresh token.
 * 
 * POST /api/integrations/oauth/[provider]/refresh
 * Body: { integrationId: string }
 * Returns: { success: boolean, expiresAt: string }
 */

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, integrations, integrationOauthTokens, brands, eq } from '@workspace/db';

export const runtime = 'nodejs';

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

export async function POST(
  req: Request,
  { params }: { params: Promise<{ provider: string }> }
): Promise<Response> {
  try {
    const { provider } = await params;
    
    // Verify authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate provider
    const config = OAUTH_CONFIGS[provider];
    if (!config) {
      return NextResponse.json(
        { error: `Unsupported OAuth provider: ${provider}` },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { integrationId } = body as { integrationId: string };

    if (!integrationId) {
      return NextResponse.json(
        { error: 'Missing integrationId' },
        { status: 400 }
      );
    }

    // Get integration and verify access
    const [integration] = await db
      .select()
      .from(integrations)
      .where(eq(integrations.id, integrationId))
      .limit(1);

    if (!integration) {
      return NextResponse.json(
        { error: 'Integration not found' },
        { status: 404 }
      );
    }

    // Verify user has access to the brand
    const [brand] = await db
      .select()
      .from(brands)
      .where(eq(brands.id, integration.brandId))
      .limit(1);

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    // Get OAuth token
    const [oauthToken] = await db
      .select()
      .from(integrationOauthTokens)
      .where(eq(integrationOauthTokens.integrationId, integrationId))
      .limit(1);

    if (!oauthToken) {
      return NextResponse.json(
        { error: 'OAuth token not found' },
        { status: 404 }
      );
    }

    if (!oauthToken.refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token available' },
        { status: 400 }
      );
    }

    // Get credentials from environment
    const clientId = process.env[config.clientIdEnv];
    const clientSecret = process.env[config.clientSecretEnv];
    
    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'OAuth not configured' },
        { status: 500 }
      );
    }

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
      console.error('[OAuth Refresh] Token refresh failed:', errorText);
      
      // Mark integration as error if refresh fails
      await db
        .update(integrations)
        .set({
          status: 'error',
          lastError: 'Token refresh failed',
          lastErrorAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(integrations.id, integrationId));

      return NextResponse.json(
        { error: 'Token refresh failed' },
        { status: 400 }
      );
    }

    const tokens: RefreshTokenResponse = await tokenResponse.json();
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

    // Update OAuth token
    await db
      .update(integrationOauthTokens)
      .set({
        accessToken: tokens.access_token, // TODO: Encrypt in production
        tokenType: tokens.token_type,
        scope: tokens.scope || oauthToken.scope,
        expiresAt,
        updatedAt: new Date(),
      })
      .where(eq(integrationOauthTokens.id, oauthToken.id));

    // Update integration status
    await db
      .update(integrations)
      .set({
        status: 'active',
        lastSyncAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(integrations.id, integrationId));

    return NextResponse.json({
      success: true,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (err) {
    console.error('[OAuth Refresh] Error:', err);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}
