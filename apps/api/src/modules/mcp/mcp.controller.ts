import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  HttpStatus,
  Query,
  Redirect,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { McpService } from './mcp.service';
import { ClerkService } from '../../features/auth/clerk.service';
import { Public } from '../../features/auth/auth.guard';
import { randomUUID } from 'crypto';

class McpRequestDto {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

// Store for active SSE sessions
const sessions = new Map<
  string,
  { res: Response; messageQueue: unknown[]; userId?: string }
>();

// Store for OAuth authorization codes (in production, use Redis)
const authCodes = new Map<
  string,
  { userId: string; redirectUri: string; expiresAt: number }
>();

// Store for access tokens (in production, use Redis)
const accessTokens = new Map<
  string,
  { userId: string; expiresAt: number }
>();

@ApiTags('mcp')
@Controller('mcp')
export class McpController {
  constructor(
    private readonly mcpService: McpService,
    private readonly clerkService: ClerkService,
  ) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'MCP Server Information',
    description:
      'Returns information about the MCP server, capabilities, and available tools',
  })
  @ApiResponse({
    status: 200,
    description: 'MCP server information with tools',
  })
  async getServerInfo() {
    const serverInfo = this.mcpService.getServerInfo();
    const { tools } = await this.mcpService.listTools();
    return {
      ...serverInfo,
      tools,
    };
  }

  @Get('tools')
  @Public()
  @ApiOperation({
    summary: 'List MCP Tools',
    description: 'Returns a list of all available MCP tools',
  })
  @ApiResponse({
    status: 200,
    description: 'List of available tools',
  })
  async listTools() {
    return this.mcpService.listTools();
  }

  /**
   * OAuth Authorization Endpoint
   * Claude.ai redirects users here to authenticate
   */
  @Get('oauth/authorize')
  @Public()
  @ApiOperation({
    summary: 'OAuth Authorization',
    description: 'OAuth 2.0 authorization endpoint for MCP connectors',
  })
  async oauthAuthorize(
    @Query('client_id') clientId: string,
    @Query('redirect_uri') redirectUri: string,
    @Query('response_type') responseType: string,
    @Query('state') state: string,
    @Query('scope') scope: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // For now, we'll create a simple login page
    // In production, redirect to your Clerk-powered login page
    const loginUrl = process.env.CLERK_SIGN_IN_URL || 'https://searchfit.dev/sign-in';
    
    // Store the OAuth request params in the session/state
    const oauthState = Buffer.from(
      JSON.stringify({ clientId, redirectUri, state, scope }),
    ).toString('base64');

    // Redirect to Clerk login with callback to our OAuth callback
    const callbackUrl = `${req.protocol}://${req.get('host')}/mcp/oauth/callback?oauth_state=${oauthState}`;
    
    // For demo: auto-approve and redirect with code
    // In production: show consent screen or redirect to Clerk
    const code = randomUUID();
    const demoUserId = 'demo_user'; // Replace with actual Clerk user
    
    authCodes.set(code, {
      userId: demoUserId,
      redirectUri,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // Redirect back to Claude with the code
    const redirectUrl = new URL(redirectUri);
    redirectUrl.searchParams.set('code', code);
    if (state) {
      redirectUrl.searchParams.set('state', state);
    }

    return res.redirect(redirectUrl.toString());
  }

  /**
   * OAuth Token Endpoint
   * Claude.ai exchanges authorization code for access token
   */
  @Post('oauth/token')
  @Public()
  @ApiOperation({
    summary: 'OAuth Token Exchange',
    description: 'Exchange authorization code for access token',
  })
  async oauthToken(
    @Body() body: {
      grant_type: string;
      code?: string;
      refresh_token?: string;
      client_id?: string;
      client_secret?: string;
      redirect_uri?: string;
    },
    @Res() res: Response,
  ) {
    const { grant_type, code, refresh_token } = body;

    if (grant_type === 'authorization_code' && code) {
      const authCode = authCodes.get(code);
      
      if (!authCode || authCode.expiresAt < Date.now()) {
        authCodes.delete(code);
        return res.status(400).json({
          error: 'invalid_grant',
          error_description: 'Authorization code expired or invalid',
        });
      }

      // Delete used code
      authCodes.delete(code);

      // Create access token
      const accessToken = `sfmcp_${randomUUID()}`;
      const refreshToken = `sfmcp_refresh_${randomUUID()}`;
      const expiresIn = 3600; // 1 hour

      accessTokens.set(accessToken, {
        userId: authCode.userId,
        expiresAt: Date.now() + expiresIn * 1000,
      });

      return res.json({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: expiresIn,
        refresh_token: refreshToken,
        scope: 'mcp:tools',
      });
    }

    if (grant_type === 'refresh_token' && refresh_token) {
      // Create new access token from refresh token
      const accessToken = `sfmcp_${randomUUID()}`;
      const expiresIn = 3600;

      accessTokens.set(accessToken, {
        userId: 'demo_user', // In production, validate refresh token
        expiresAt: Date.now() + expiresIn * 1000,
      });

      return res.json({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: expiresIn,
        refresh_token: refresh_token,
        scope: 'mcp:tools',
      });
    }

    return res.status(400).json({
      error: 'unsupported_grant_type',
      error_description: 'Grant type not supported',
    });
  }

  /**
   * OAuth callback after Clerk login
   */
  @Get('oauth/callback')
  @Public()
  @ApiOperation({
    summary: 'OAuth Callback',
    description: 'Callback after user authenticates with Clerk',
  })
  async oauthCallback(
    @Query('oauth_state') oauthState: string,
    @Query('session_id') sessionId: string,
    @Res() res: Response,
  ) {
    try {
      const { redirectUri, state } = JSON.parse(
        Buffer.from(oauthState, 'base64').toString(),
      );

      // Verify Clerk session if provided
      let userId = 'demo_user';
      if (sessionId) {
        const sessionResult = await this.clerkService.verifySession(sessionId);
        if (sessionResult.isValid && sessionResult.session) {
          userId = sessionResult.session.userId;
        }
      }

      // Create authorization code
      const code = randomUUID();
      authCodes.set(code, {
        userId,
        redirectUri,
        expiresAt: Date.now() + 10 * 60 * 1000,
      });

      // Redirect back to Claude
      const redirectUrl = new URL(redirectUri);
      redirectUrl.searchParams.set('code', code);
      if (state) {
        redirectUrl.searchParams.set('state', state);
      }

      return res.redirect(redirectUrl.toString());
    } catch (error) {
      return res.status(400).json({ error: 'Invalid OAuth state' });
    }
  }

  /**
   * SSE endpoint for MCP Remote Protocol
   * Claude.ai connects here first to establish the SSE channel
   */
  @Get('sse')
  @Public()
  @ApiOperation({
    summary: 'MCP SSE Endpoint',
    description:
      'Server-Sent Events endpoint for MCP remote protocol communication',
  })
  async handleSse(@Req() req: Request, @Res() res: Response) {
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    // Generate session ID
    const sessionId = randomUUID();

    // Store session
    sessions.set(sessionId, { res, messageQueue: [] });

    // Send the endpoint event with the message URL
    // This tells Claude where to send messages
    const baseUrl =
      process.env.API_URL ||
      `${req.protocol}://${req.get('host')}`;
    const messageEndpoint = `${baseUrl}/mcp/message?sessionId=${sessionId}`;

    res.write(`event: endpoint\n`);
    res.write(`data: ${messageEndpoint}\n\n`);

    // Keep connection alive with periodic comments
    const keepAliveInterval = setInterval(() => {
      res.write(`: keep-alive\n\n`);
    }, 15000);

    // Handle client disconnect
    req.on('close', () => {
      clearInterval(keepAliveInterval);
      sessions.delete(sessionId);
      res.end();
    });
  }

  /**
   * Message endpoint for MCP Remote Protocol
   * Claude.ai sends JSON-RPC messages here
   */
  @Post('message')
  @Public()
  @ApiOperation({
    summary: 'MCP Message Endpoint',
    description: 'Handle MCP JSON-RPC messages from remote clients',
  })
  async handleMessage(
    @Query('sessionId') sessionId: string,
    @Body() body: McpRequestDto,
    @Res() res: Response,
  ) {
    const session = sessions.get(sessionId);

    if (!session) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        jsonrpc: '2.0',
        id: body.id,
        error: {
          code: -32000,
          message: 'Invalid session. Please reconnect via SSE.',
        },
      });
    }

    try {
      const { id, method, params } = body;
      let result: unknown;

      switch (method) {
        case 'initialize':
          result = {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: {},
            },
            serverInfo: {
              name: 'searchfit-mcp',
              version: '1.0.0',
            },
          };
          break;

        case 'notifications/initialized':
          // Client acknowledges initialization - no response needed
          return res.status(HttpStatus.ACCEPTED).send();

        case 'tools/list':
          result = await this.mcpService.listTools();
          break;

        case 'tools/call':
          if (!params?.name) {
            return res.status(HttpStatus.BAD_REQUEST).json({
              jsonrpc: '2.0',
              id,
              error: {
                code: -32602,
                message: 'Invalid params: tool name is required',
              },
            });
          }
          result = await this.mcpService.callTool(
            params.name as string,
            (params.arguments as Record<string, unknown>) || {},
          );
          break;

        case 'ping':
          result = {};
          break;

        default:
          return res.status(HttpStatus.BAD_REQUEST).json({
            jsonrpc: '2.0',
            id,
            error: {
              code: -32601,
              message: `Method not found: ${method}`,
            },
          });
      }

      // Send response back via SSE
      const response = {
        jsonrpc: '2.0',
        id,
        result,
      };

      // Write to SSE stream
      session.res.write(`event: message\n`);
      session.res.write(`data: ${JSON.stringify(response)}\n\n`);

      // Also return 202 Accepted
      return res.status(HttpStatus.ACCEPTED).send();
    } catch (error) {
      const errorResponse = {
        jsonrpc: '2.0',
        id: body.id,
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Internal error',
        },
      };

      // Write error to SSE stream
      session.res.write(`event: message\n`);
      session.res.write(`data: ${JSON.stringify(errorResponse)}\n\n`);

      return res.status(HttpStatus.ACCEPTED).send();
    }
  }

  /**
   * Legacy POST endpoint for direct JSON-RPC calls
   */
  @Post()
  @Public()
  @ApiOperation({
    summary: 'MCP JSON-RPC Endpoint',
    description: 'Handle MCP JSON-RPC requests (direct mode)',
  })
  @ApiBody({
    description: 'JSON-RPC 2.0 request',
    schema: {
      type: 'object',
      properties: {
        jsonrpc: { type: 'string', example: '2.0' },
        id: { type: 'string', example: '1' },
        method: { type: 'string', example: 'tools/list' },
        params: { type: 'object' },
      },
      required: ['jsonrpc', 'id', 'method'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'JSON-RPC response',
  })
  async handleJsonRpc(@Body() body: McpRequestDto, @Res() res: Response) {
    try {
      const { jsonrpc, id, method, params } = body;

      if (jsonrpc !== '2.0') {
        return res.status(HttpStatus.BAD_REQUEST).json({
          jsonrpc: '2.0',
          id,
          error: {
            code: -32600,
            message: 'Invalid Request: jsonrpc must be "2.0"',
          },
        });
      }

      let result: unknown;

      switch (method) {
        case 'initialize':
          result = {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: {},
            },
            serverInfo: {
              name: 'searchfit-mcp',
              version: '1.0.0',
            },
          };
          break;

        case 'notifications/initialized':
          return res.status(HttpStatus.OK).json({
            jsonrpc: '2.0',
            id,
            result: {},
          });

        case 'tools/list':
          result = await this.mcpService.listTools();
          break;

        case 'tools/call':
          if (!params?.name) {
            return res.status(HttpStatus.BAD_REQUEST).json({
              jsonrpc: '2.0',
              id,
              error: {
                code: -32602,
                message: 'Invalid params: tool name is required',
              },
            });
          }
          result = await this.mcpService.callTool(
            params.name as string,
            (params.arguments as Record<string, unknown>) || {},
          );
          break;

        case 'ping':
          result = {};
          break;

        default:
          return res.status(HttpStatus.BAD_REQUEST).json({
            jsonrpc: '2.0',
            id,
            error: {
              code: -32601,
              message: `Method not found: ${method}`,
            },
          });
      }

      return res.json({
        jsonrpc: '2.0',
        id,
        result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        jsonrpc: '2.0',
        id: body.id,
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Internal error',
        },
      });
    }
  }
}
