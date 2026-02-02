/**
 * OAuth Callback Route
 * 
 * Handles OAuth callback from provider, exchanges code for tokens,
 * and saves them to the database.
 * 
 * GET /api/integrations/oauth/[provider]/callback?code=xxx&state=xxx
 * Redirects back to brand settings page
 */

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, integrations, integrationOauthTokens, eq, and } from '@workspace/db';
import { cookies } from 'next/headers';

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

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

interface GoogleUserInfo {
  email: string;
  name?: string;
  picture?: string;
}

async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo | null> {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ provider: string }> }
): Promise<Response> {
  const { provider } = await params;
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  // Build base URL for redirects
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    // Handle OAuth errors
    if (error) {
      console.error(`[OAuth Callback] Provider error: ${error}`);
      return NextResponse.redirect(
        `${baseUrl}/dashboard?error=${provider}_oauth_${error}`
      );
    }

    // Validate required params
    if (!code || !state) {
      return NextResponse.redirect(
        `${baseUrl}/dashboard?error=invalid_oauth_callback`
      );
    }

    // Validate provider
    const config = OAUTH_CONFIGS[provider];
    if (!config) {
      return NextResponse.redirect(
        `${baseUrl}/dashboard?error=unsupported_provider`
      );
    }

    // Verify state from cookie
    const cookieStore = await cookies();
    const storedState = cookieStore.get(`oauth_state_${provider}`)?.value;
    
    if (!storedState || storedState !== state) {
      console.error('[OAuth Callback] State mismatch');
      return NextResponse.redirect(
        `${baseUrl}/dashboard?error=oauth_state_expired`
      );
    }

    // Clear state cookie
    cookieStore.delete(`oauth_state_${provider}`);

    // Decode state to get brandId and userId
    let stateData: { brandId: string; userId: string; timestamp: number };
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64url').toString());
    } catch {
      return NextResponse.redirect(
        `${baseUrl}/dashboard?error=invalid_oauth_state`
      );
    }

    const { brandId, userId } = stateData;

    // Verify authentication matches
    const authResult = await auth();
    if (authResult.userId !== userId) {
      return NextResponse.redirect(
        `${baseUrl}/dashboard?error=oauth_user_mismatch`
      );
    }

    // Get credentials from environment
    const clientId = process.env[config.clientIdEnv];
    const clientSecret = process.env[config.clientSecretEnv];
    
    if (!clientId || !clientSecret) {
      console.error('[OAuth Callback] Missing OAuth credentials');
      return NextResponse.redirect(
        `${baseUrl}/dashboard?error=oauth_not_configured`
      );
    }

    // Build callback URL (must match what was used in connect)
    const redirectUri = `${baseUrl}/api/integrations/oauth/${provider}/callback`;

    // Exchange code for tokens
    const tokenResponse = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('[OAuth Callback] Token exchange failed:', errorText);
      return NextResponse.redirect(
        `${baseUrl}/dashboard?error=oauth_token_exchange_failed`
      );
    }

    const tokens: TokenResponse = await tokenResponse.json();

    // Get user info for Google
    let userEmail: string | undefined;
    if (provider === 'google') {
      const userInfo = await getGoogleUserInfo(tokens.access_token);
      userEmail = userInfo?.email;
    }

    // Calculate token expiration
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

    // Check if integration already exists
    const [existingIntegration] = await db
      .select()
      .from(integrations)
      .where(
        and(
          eq(integrations.brandId, brandId),
          eq(integrations.type, provider)
        )
      )
      .limit(1);

    let integrationId: string;

    if (existingIntegration) {
      // Update existing integration
      integrationId = existingIntegration.id;
      await db
        .update(integrations)
        .set({
          status: 'active',
          lastSyncAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(integrations.id, integrationId));

      // Delete old OAuth token if exists
      await db
        .delete(integrationOauthTokens)
        .where(eq(integrationOauthTokens.integrationId, integrationId));
    } else {
      // Create new integration
      const [newIntegration] = await db
        .insert(integrations)
        .values({
          brandId,
          name: provider.charAt(0).toUpperCase() + provider.slice(1),
          type: provider,
          authType: 'oauth',
          status: 'active',
          config: userEmail ? { email: userEmail } : {},
        })
        .returning();

      if (!newIntegration) {
        return NextResponse.redirect(
          `${baseUrl}/dashboard?error=oauth_integration_create_failed`
        );
      }

      integrationId = newIntegration.id;
    }

    // Save OAuth tokens
    await db.insert(integrationOauthTokens).values({
      integrationId,
      provider: provider as 'google',
      accessToken: tokens.access_token, // TODO: Encrypt in production
      refreshToken: tokens.refresh_token, // TODO: Encrypt in production
      tokenType: tokens.token_type,
      scope: tokens.scope,
      expiresAt,
      rawResponse: tokens as Record<string, unknown>,
    });

    // Redirect back to brand settings with success
    return NextResponse.redirect(
      `${baseUrl}/dashboard/brands/${brandId}/settings?tab=integrations&integration=${provider}&status=connected`
    );
  } catch (err) {
    console.error('[OAuth Callback] Error:', err);
    return NextResponse.redirect(
      `${baseUrl}/dashboard?error=oauth_failed`
    );
  }
}
