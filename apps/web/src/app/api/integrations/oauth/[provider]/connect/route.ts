/**
 * OAuth Connect Route
 * 
 * Initiates OAuth flow by redirecting to the provider's authorization URL.
 * 
 * GET /api/integrations/oauth/[provider]/connect?brandId=xxx
 * Redirects to provider's OAuth authorization page
 */

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, brands, eq } from '@workspace/db';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

// OAuth configuration for supported providers
const OAUTH_CONFIGS: Record<string, {
  authUrl: string;
  scopes: string[];
  clientIdEnv: string;
}> = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scopes: [
      'openid',
      'email',
      'profile',
      'https://www.googleapis.com/auth/webmasters.readonly', // Search Console
      'https://www.googleapis.com/auth/analytics.readonly', // Analytics
      'https://www.googleapis.com/auth/drive.readonly', // Drive
    ],
    clientIdEnv: 'INTEGRATION_GOOGLE_CLIENT_ID',
  },
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ provider: string }> }
): Promise<Response> {
  try {
    const { provider } = await params;
    const url = new URL(req.url);
    const brandId = url.searchParams.get('brandId');

    // Verify authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    // Validate provider
    const config = OAUTH_CONFIGS[provider];
    if (!config) {
      return NextResponse.json(
        { error: `Unsupported OAuth provider: ${provider}` },
        { status: 400 }
      );
    }

    // Validate brandId
    if (!brandId) {
      return NextResponse.json(
        { error: 'Missing brandId parameter' },
        { status: 400 }
      );
    }

    // Verify brand exists and user has access
    const [brand] = await db
      .select()
      .from(brands)
      .where(eq(brands.id, brandId))
      .limit(1);

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // Get client ID from environment
    const clientId = process.env[config.clientIdEnv];
    if (!clientId) {
      console.error(`[OAuth] Missing environment variable: ${config.clientIdEnv}`);
      return NextResponse.json(
        { error: 'OAuth not configured' },
        { status: 500 }
      );
    }

    // Build callback URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const redirectUri = `${baseUrl}/api/integrations/oauth/${provider}/callback`;

    // Generate state for CSRF protection (includes brandId)
    const state = Buffer.from(JSON.stringify({
      brandId,
      userId,
      timestamp: Date.now(),
    })).toString('base64url');

    // Store state in cookie for verification
    const cookieStore = await cookies();
    cookieStore.set(`oauth_state_${provider}`, state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 minutes
      path: '/',
    });

    // Build authorization URL
    const authParams = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: config.scopes.join(' '),
      state,
      access_type: 'offline', // Request refresh token
      prompt: 'consent', // Force consent to get refresh token
    });

    const authorizationUrl = `${config.authUrl}?${authParams.toString()}`;

    // Redirect to OAuth provider
    return NextResponse.redirect(authorizationUrl);
  } catch (err) {
    console.error('[OAuth Connect] Error:', err);
    return NextResponse.json(
      { error: 'Failed to initiate OAuth' },
      { status: 500 }
    );
  }
}
