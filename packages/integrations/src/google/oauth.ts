/**
 * Google OAuth Service
 *
 * Handles Google OAuth 2.0 authentication flow and token management.
 * Supports multiple Google services: Search Console, Drive, Docs, etc.
 */

import { google } from 'googleapis';
import { env } from '../env';
import { encrypt, decrypt } from '../lib/crypto';
import { SERVICE_METADATA, type ServiceType } from '../types/integration';

// ============================================================
// OAUTH CONFIGURATION
// ============================================================

/** Get OAuth2 client */
export function getOAuth2Client() {
  if (!env.INTEGRATION_GOOGLE_CLIENT_ID || !env.INTEGRATION_GOOGLE_CLIENT_SECRET) {
    throw new Error(
      'Google OAuth credentials not configured. ' +
        'Set INTEGRATION_GOOGLE_CLIENT_ID and INTEGRATION_GOOGLE_CLIENT_SECRET environment variables.'
    );
  }

  return new google.auth.OAuth2(
    env.INTEGRATION_GOOGLE_CLIENT_ID,
    env.INTEGRATION_GOOGLE_CLIENT_SECRET,
    `${env.NEXT_PUBLIC_CLIENT_URL}/api/integrations/google/callback`
  );
}

/** Get scopes for requested services */
export function getScopesForServices(services: ServiceType[]): string[] {
  const scopes = new Set<string>();

  // Always include email and profile for identification
  scopes.add('openid');
  scopes.add('email');
  scopes.add('profile');

  // Add scopes for each service
  for (const service of services) {
    const meta = SERVICE_METADATA[service];
    if (meta?.requiredScopes) {
      meta.requiredScopes.forEach((scope) => scopes.add(scope));
    }
  }

  return Array.from(scopes);
}

// ============================================================
// OAUTH FLOW
// ============================================================

export interface GenerateAuthUrlOptions {
  projectId: string;
  services: ServiceType[];
  state?: string;
}

/** Generate OAuth authorization URL */
export function generateAuthUrl(options: GenerateAuthUrlOptions): string {
  const { projectId, services, state } = options;

  const oauth2Client = getOAuth2Client();
  const scopes = getScopesForServices(services);

  // Create state with project and services info
  const stateData = {
    projectId,
    services,
    nonce: crypto.randomUUID(),
    timestamp: Date.now(),
  };

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // For refresh token
    scope: scopes,
    state: state || Buffer.from(JSON.stringify(stateData)).toString('base64url'),
    prompt: 'consent', // Always show consent screen to get refresh token
    include_granted_scopes: true, // Incremental authorization
  });

  return authUrl;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string | null;
  expiryDate: Date | null;
  scope: string[];
  tokenType: string;
}

/** Exchange authorization code for tokens */
export async function exchangeCodeForTokens(code: string): Promise<TokenResponse> {
  const oauth2Client = getOAuth2Client();

  const { tokens } = await oauth2Client.getToken(code);

  if (!tokens.access_token) {
    throw new Error('No access token received from Google');
  }

  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token || null,
    expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
    scope: tokens.scope?.split(' ') || [],
    tokenType: tokens.token_type || 'Bearer',
  };
}

/** Refresh access token using refresh token */
export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const oauth2Client = getOAuth2Client();

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  const { credentials } = await oauth2Client.refreshAccessToken();

  if (!credentials.access_token) {
    throw new Error('Failed to refresh access token');
  }

  return {
    accessToken: credentials.access_token,
    refreshToken: credentials.refresh_token || refreshToken, // Use new if provided, else keep old
    expiryDate: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
    scope: credentials.scope?.split(' ') || [],
    tokenType: credentials.token_type || 'Bearer',
  };
}

/** Revoke access (disconnect integration) */
export async function revokeAccess(accessToken: string): Promise<void> {
  const oauth2Client = getOAuth2Client();
  await oauth2Client.revokeToken(accessToken);
}

// ============================================================
// USER INFO
// ============================================================

export interface GoogleUserInfo {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

/** Get user info from access token */
export async function getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });

  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const { data } = await oauth2.userinfo.get();

  if (!data.id || !data.email) {
    throw new Error('Failed to get user info from Google');
  }

  return {
    id: data.id,
    email: data.email,
    name: data.name || undefined,
    picture: data.picture || undefined,
  };
}

// ============================================================
// AUTHENTICATED CLIENT FACTORY
// ============================================================

export interface AuthenticatedClientOptions {
  accessToken: string;
  refreshToken?: string;
  onTokenRefresh?: (tokens: TokenResponse) => Promise<void>;
}

/** Create an authenticated OAuth2 client */
export function createAuthenticatedClient(
  options: AuthenticatedClientOptions
): ReturnType<typeof getOAuth2Client> {
  const { accessToken, refreshToken, onTokenRefresh } = options;

  const oauth2Client = getOAuth2Client();

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  // Handle token refresh
  if (onTokenRefresh) {
    oauth2Client.on('tokens', async (tokens) => {
      if (tokens.access_token) {
        await onTokenRefresh({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token || refreshToken || null,
          expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
          scope: tokens.scope?.split(' ') || [],
          tokenType: tokens.token_type || 'Bearer',
        });
      }
    });
  }

  return oauth2Client;
}

// ============================================================
// TOKEN ENCRYPTION HELPERS
// ============================================================

/** Encrypt tokens for database storage */
export function encryptTokens(tokens: TokenResponse): {
  accessToken: string;
  refreshToken: string | null;
} {
  return {
    accessToken: encrypt(tokens.accessToken),
    refreshToken: tokens.refreshToken ? encrypt(tokens.refreshToken) : null,
  };
}

/** Decrypt tokens from database */
export function decryptTokens(encrypted: {
  accessToken: string;
  refreshToken: string | null;
}): {
  accessToken: string;
  refreshToken: string | null;
} {
  return {
    accessToken: decrypt(encrypted.accessToken),
    refreshToken: encrypted.refreshToken ? decrypt(encrypted.refreshToken) : null,
  };
}

// ============================================================
// STATE MANAGEMENT (for OAuth flow)
// ============================================================

export interface OAuthState {
  projectId: string;
  services: ServiceType[];
  nonce: string;
  timestamp: number;
}

/** Encode OAuth state */
export function encodeOAuthState(state: OAuthState): string {
  return Buffer.from(JSON.stringify(state)).toString('base64url');
}

/** Decode OAuth state */
export function decodeOAuthState(encoded: string): OAuthState | null {
  try {
    const decoded = Buffer.from(encoded, 'base64url').toString('utf8');
    const state = JSON.parse(decoded) as OAuthState;

    // Validate required fields
    if (!state.projectId || !state.services || !state.nonce || !state.timestamp) {
      return null;
    }

    // Check if state is expired (15 minutes)
    const fifteenMinutes = 15 * 60 * 1000;
    if (Date.now() - state.timestamp > fifteenMinutes) {
      return null;
    }

    return state;
  } catch {
    return null;
  }
}

// ============================================================
// 401 ERROR HANDLING & AUTOMATIC TOKEN REFRESH
// ============================================================

/**
 * Check if an error is a 401 Unauthorized error
 */
export function isUnauthorizedError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    // Check for common 401/auth error patterns from Google APIs
    if (
      message.includes('401') ||
      message.includes('unauthorized') ||
      message.includes('invalid_grant') ||
      message.includes('token has been expired') ||
      message.includes('token has been revoked') ||
      message.includes('invalid credentials')
    ) {
      return true;
    }
  }

  // Check for GaxiosError with status code
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'status' in error.response
  ) {
    return error.response.status === 401;
  }

  // Check for error code property
  if (error && typeof error === 'object' && 'code' in error) {
    return error.code === 401 || error.code === '401';
  }

  return false;
}

/**
 * Options for executing OAuth-protected API calls with automatic refresh
 */
export interface OAuthApiCallOptions {
  /** The encrypted access token from database */
  accessToken: string;
  /** The encrypted refresh token from database (required for auto-refresh) */
  refreshToken: string | null;
  /** Integration ID for updating tokens in database */
  integrationId: string;
  /** Callback to update tokens in database */
  onTokenRefresh?: (
    integrationId: string,
    tokens: { accessToken: string; refreshToken: string | null; tokenExpiry: Date | null }
  ) => Promise<void>;
}

/**
 * Execute an OAuth-protected API call with automatic token refresh on 401 errors.
 *
 * This function:
 * 1. Decrypts tokens and attempts the API call
 * 2. If a 401 error occurs and refresh token exists, refreshes the token
 * 3. Saves the new tokens to database via callback
 * 4. Retries the API call with new tokens
 *
 * @param options - OAuth configuration including tokens and callbacks
 * @param apiCall - The API call function to execute, receives AuthenticatedClientOptions
 * @returns The result of the API call
 * @throws Error if API call fails after retry or if refresh fails
 */
export async function executeWithTokenRefresh<T>(
  options: OAuthApiCallOptions,
  apiCall: (authOptions: AuthenticatedClientOptions) => Promise<T>
): Promise<T> {
  const { accessToken: encryptedAccessToken, refreshToken: encryptedRefreshToken, integrationId, onTokenRefresh } =
    options;

  // Decrypt tokens
  const decrypted = decryptTokens({
    accessToken: encryptedAccessToken,
    refreshToken: encryptedRefreshToken,
  });

  // Create auth options with token refresh callback
  const authOptions: AuthenticatedClientOptions = {
    accessToken: decrypted.accessToken,
    refreshToken: decrypted.refreshToken || undefined,
    onTokenRefresh: onTokenRefresh
      ? async (tokens) => {
          // Encrypt and save new tokens
          const encrypted = encryptTokens(tokens);
          await onTokenRefresh(integrationId, {
            accessToken: encrypted.accessToken,
            refreshToken: encrypted.refreshToken,
            tokenExpiry: tokens.expiryDate,
          });
        }
      : undefined,
  };

  try {
    // First attempt
    return await apiCall(authOptions);
  } catch (error) {
    // Check if it's a 401 error and we have a refresh token
    if (isUnauthorizedError(error) && decrypted.refreshToken) {
      console.log(`[OAuth] 401 error detected for integration ${integrationId}, attempting token refresh...`);

      try {
        // Refresh the token
        const newTokens = await refreshAccessToken(decrypted.refreshToken);
        console.log(`[OAuth] Token refresh successful for integration ${integrationId}`);

        // Save new tokens to database if callback provided
        if (onTokenRefresh) {
          const encrypted = encryptTokens(newTokens);
          await onTokenRefresh(integrationId, {
            accessToken: encrypted.accessToken,
            refreshToken: encrypted.refreshToken,
            tokenExpiry: newTokens.expiryDate,
          });
          console.log(`[OAuth] New tokens saved to database for integration ${integrationId}`);
        }

        // Retry with new tokens
        const retryAuthOptions: AuthenticatedClientOptions = {
          accessToken: newTokens.accessToken,
          refreshToken: newTokens.refreshToken || undefined,
          onTokenRefresh: authOptions.onTokenRefresh,
        };

        return await apiCall(retryAuthOptions);
      } catch (refreshError) {
        console.error(`[OAuth] Token refresh failed for integration ${integrationId}:`, refreshError);

        // If refresh fails with invalid_grant, the refresh token itself is invalid
        if (isUnauthorizedError(refreshError)) {
          throw new Error(
            `OAuth token refresh failed - user may need to reconnect the integration. ` +
              `Integration ID: ${integrationId}`
          );
        }

        throw refreshError;
      }
    }

    // Not a 401 error or no refresh token available, rethrow original error
    throw error;
  }
}

