import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { McpService } from './mcp.service';

class McpRequestDto {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

@ApiTags('mcp')
@Controller('mcp')
export class McpController {
  constructor(private readonly mcpService: McpService) {}

  @Get()
  @ApiOperation({
    summary: 'MCP Server Information',
    description: 'Returns information about the MCP server and its capabilities',
  })
  @ApiResponse({
    status: 200,
    description: 'MCP server information',
  })
  getServerInfo() {
    return this.mcpService.getServerInfo();
  }

  @Get('tools')
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

  @Post()
  @ApiOperation({
    summary: 'MCP JSON-RPC Endpoint',
    description: 'Handle MCP JSON-RPC requests',
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
            serverInfo: this.mcpService.getServerInfo(),
          };
          break;

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

  @Get('sse')
  @ApiOperation({
    summary: 'MCP SSE Endpoint',
    description: 'Server-Sent Events endpoint for MCP communication',
  })
  async handleSse(@Req() req: Request, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Send initial connection message
    const serverInfo = this.mcpService.getServerInfo();
    res.write(
      `data: ${JSON.stringify({ type: 'connection', server: serverInfo })}\n\n`,
    );

    // Send available tools
    const tools = await this.mcpService.listTools();
    res.write(`data: ${JSON.stringify({ type: 'tools', ...tools })}\n\n`);

    // Keep connection alive with periodic pings
    const pingInterval = setInterval(() => {
      res.write(`data: ${JSON.stringify({ type: 'ping', timestamp: Date.now() })}\n\n`);
    }, 30000);

    // Handle client disconnect
    req.on('close', () => {
      clearInterval(pingInterval);
      res.end();
    });
  }
}
