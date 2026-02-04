import { Injectable } from '@nestjs/common';
import { createClerkClient } from '@clerk/backend';

@Injectable()
export class ClerkService {
  private clerk;

  constructor() {
    this.clerk = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });
  }

  /**
   * Verify a session token from the Authorization header
   */
  async verifyToken(token: string) {
    try {
      const { sub: userId } = await this.clerk.verifyToken(token);
      return { userId, isValid: true };
    } catch (error) {
      return { userId: null, isValid: false, error };
    }
  }

  /**
   * Get user details from Clerk
   */
  async getUser(userId: string) {
    return this.clerk.users.getUser(userId);
  }

  /**
   * Verify a session ID
   */
  async verifySession(sessionId: string) {
    try {
      const session = await this.clerk.sessions.getSession(sessionId);
      return { session, isValid: session.status === 'active' };
    } catch (error) {
      return { session: null, isValid: false, error };
    }
  }

  /**
   * Create an OAuth access token for MCP
   * This creates a short-lived token that Claude can use
   */
  async createMcpToken(userId: string) {
    // Create a JWT token that can be verified later
    // In production, you might want to use Clerk's JWT templates
    const user = await this.getUser(userId);
    return {
      access_token: `mcp_${userId}_${Date.now()}`,
      token_type: 'Bearer',
      expires_in: 3600,
      user: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        name: `${user.firstName} ${user.lastName}`.trim(),
      },
    };
  }

  /**
   * Verify an MCP access token
   */
  async verifyMcpToken(token: string) {
    // For simple tokens, extract userId and verify
    if (token.startsWith('mcp_')) {
      const parts = token.split('_');
      if (parts.length >= 2) {
        const userId = parts[1];
        try {
          const user = await this.getUser(userId);
          return { userId: user.id, isValid: true };
        } catch {
          return { userId: null, isValid: false };
        }
      }
    }
    return { userId: null, isValid: false };
  }

  getClerkClient() {
    return this.clerk;
  }
}
