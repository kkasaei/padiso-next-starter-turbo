#!/usr/bin/env node

/**
 * MCP Bridge for SearchFit API
 * 
 * This script bridges Claude Desktop to the SearchFit MCP HTTP server.
 * It reads JSON-RPC requests from stdin and forwards them to the HTTP endpoint.
 * 
 * Usage in Claude Desktop config (~/.claude/claude_desktop_config.json):
 * 
 * {
 *   "mcpServers": {
 *     "searchfit": {
 *       "command": "node",
 *       "args": ["/path/to/searchfit-turbo/apps/api/mcp-bridge.js"]
 *     }
 *   }
 * }
 * 
 * For local development, set SEARCHFIT_API_URL=http://localhost:3001
 */

const API_URL = process.env.SEARCHFIT_API_URL || 'https://api.searchfit.dev';

async function sendRequest(request) {
  try {
    const response = await fetch(`${API_URL}/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    return await response.json();
  } catch (error) {
    return {
      jsonrpc: '2.0',
      id: request.id,
      error: {
        code: -32603,
        message: `Failed to connect to SearchFit API: ${error.message}`,
      },
    };
  }
}

async function handleRequest(request) {
  const { method, id, params } = request;

  // Handle initialization locally
  if (method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: { listChanged: true },
        },
        serverInfo: {
          name: 'searchfit-mcp',
          version: '1.0.0',
        },
      },
    };
  }

  // Handle notifications (no response needed)
  if (method === 'notifications/initialized') {
    return null;
  }

  // Forward all other requests to the HTTP server
  return sendRequest(request);
}

// Read from stdin line by line
let buffer = '';

process.stdin.setEncoding('utf8');

process.stdin.on('data', async (chunk) => {
  buffer += chunk;
  
  // Process complete lines
  const lines = buffer.split('\n');
  buffer = lines.pop() || ''; // Keep incomplete line in buffer
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    try {
      const request = JSON.parse(line);
      const response = await handleRequest(request);
      
      // Only send response if not a notification
      if (response) {
        process.stdout.write(JSON.stringify(response) + '\n');
      }
    } catch (error) {
      // Parse error
      process.stdout.write(JSON.stringify({
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32700,
          message: 'Parse error',
        },
      }) + '\n');
    }
  }
});

process.stdin.on('end', () => {
  process.exit(0);
});

// Handle errors gracefully
process.on('uncaughtException', (error) => {
  process.stderr.write(`Error: ${error.message}\n`);
});
