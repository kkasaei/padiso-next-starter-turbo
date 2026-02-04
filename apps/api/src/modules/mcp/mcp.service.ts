import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { content, publicReports } from '@workspace/db';
import { BrandsService } from '../brands/brands.service';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { DatabaseService } from '../../features/database/database.service';

interface McpTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolResult {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}

@Injectable()
export class McpService {
  private tools: McpTool[] = [
    {
      name: 'list_workspaces',
      description: 'List all workspaces in the system',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'list_brands',
      description:
        'List all brands with their AI visibility scores, optionally filtered by workspace',
      inputSchema: {
        type: 'object',
        properties: {
          workspaceId: {
            type: 'string',
            description: 'Optional workspace ID to filter brands by',
          },
        },
      },
    },
    {
      name: 'get_brand',
      description:
        'Get detailed information about a brand including AI visibility score',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Brand UUID' },
        },
        required: ['id'],
      },
    },
    {
      name: 'list_content',
      description:
        'List all content (articles, opportunities) for a brand, optionally filtered by status',
      inputSchema: {
        type: 'object',
        properties: {
          brandId: {
            type: 'string',
            description: 'Brand ID to get content for',
          },
          status: {
            type: 'string',
            enum: [
              'opportunity',
              'generating',
              'draft',
              'review',
              'scheduled',
              'published',
              'archived',
            ],
            description: 'Optional status filter',
          },
        },
        required: ['brandId'],
      },
    },
    {
      name: 'get_content_details',
      description:
        'Get detailed information about a specific content item including SEO metrics and article score',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Content UUID' },
        },
        required: ['id'],
      },
    },
    {
      name: 'get_domain_ai_visibility',
      description:
        'Get the AI visibility report for a domain, including scores from ChatGPT, Perplexity, and Gemini',
      inputSchema: {
        type: 'object',
        properties: {
          domain: {
            type: 'string',
            description:
              'Domain name to get AI visibility for (e.g., example.com)',
          },
        },
        required: ['domain'],
      },
    },
  ];

  constructor(
    private readonly brandsService: BrandsService,
    private readonly workspacesService: WorkspacesService,
    private readonly databaseService: DatabaseService,
  ) {}

  private get db() {
    return this.databaseService.db;
  }

  // Get server info for the MCP endpoint
  getServerInfo() {
    return {
      name: 'searchfit-mcp',
      version: '1.0.0',
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: { listChanged: true },
      },
      toolsCount: this.tools.length,
      endpoints: {
        tools: '/mcp/tools',
        jsonRpc: 'POST /mcp',
        sse: '/mcp/sse',
      },
    };
  }

  // List all available tools
  async listTools() {
    return { tools: this.tools };
  }

  // Call a tool
  async callTool(
    name: string,
    args: Record<string, unknown>,
  ): Promise<McpToolResult> {
    try {
      switch (name) {
        case 'list_workspaces': {
          const workspaces = await this.workspacesService.findAll();
          return {
            content: [
              { type: 'text', text: JSON.stringify(workspaces, null, 2) },
            ],
          };
        }

        case 'list_brands': {
          const brands = args?.workspaceId
            ? await this.brandsService.findByWorkspace(
                args.workspaceId as string,
              )
            : await this.brandsService.findAll();

          // Format brands with visibility info
          const formattedBrands = brands.map((brand) => ({
            id: brand.id,
            brandName: brand.brandName,
            websiteUrl: brand.websiteUrl,
            status: brand.status,
            visibilityScore: brand.visibilityScore,
            lastScanAt: brand.lastScanAt,
            workspaceId: brand.workspaceId,
          }));

          return {
            content: [
              { type: 'text', text: JSON.stringify(formattedBrands, null, 2) },
            ],
          };
        }

        case 'get_brand': {
          const brand = await this.brandsService.findOne(args?.id as string);
          return {
            content: [{ type: 'text', text: JSON.stringify(brand, null, 2) }],
          };
        }

        case 'list_content': {
          const brandId = args?.brandId as string;
          const status = args?.status as string | undefined;

          let query = this.db
            .select({
              id: content.id,
              title: content.title,
              status: content.status,
              type: content.type,
              targetKeyword: content.targetKeyword,
              searchVolume: content.searchVolume,
              wordCount: content.wordCount,
              articleScore: content.articleScore,
              locale: content.locale,
              createdAt: content.createdAt,
              updatedAt: content.updatedAt,
            })
            .from(content)
            .where(eq(content.brandId, brandId));

          if (status) {
            query = this.db
              .select({
                id: content.id,
                title: content.title,
                status: content.status,
                type: content.type,
                targetKeyword: content.targetKeyword,
                searchVolume: content.searchVolume,
                wordCount: content.wordCount,
                articleScore: content.articleScore,
                locale: content.locale,
                createdAt: content.createdAt,
                updatedAt: content.updatedAt,
              })
              .from(content)
              .where(eq(content.brandId, brandId));
          }

          const contentList = await query;

          return {
            content: [
              { type: 'text', text: JSON.stringify(contentList, null, 2) },
            ],
          };
        }

        case 'get_content_details': {
          const [contentItem] = await this.db
            .select()
            .from(content)
            .where(eq(content.id, args?.id as string));

          if (!contentItem) {
            return {
              content: [
                {
                  type: 'text',
                  text: `Content with ID ${args?.id} not found`,
                },
              ],
              isError: true,
            };
          }

          return {
            content: [
              { type: 'text', text: JSON.stringify(contentItem, null, 2) },
            ],
          };
        }

        case 'get_domain_ai_visibility': {
          const domain = (args?.domain as string)
            .toLowerCase()
            .replace(/^(https?:\/\/)?(www\.)?/, '')
            .split('/')[0];

          const [report] = await this.db
            .select()
            .from(publicReports)
            .where(eq(publicReports.domain, domain));

          if (!report) {
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      domain,
                      status: 'NOT_FOUND',
                      message: `No AI visibility report found for domain: ${domain}`,
                    },
                    null,
                    2,
                  ),
                },
              ],
            };
          }

          // Extract key visibility data
          const visibilityData = {
            domain: report.domain,
            status: report.status,
            data: report.data,
            llmResults: report.llmResults,
            generationTimeMs: report.generationTimeMs,
            viewCount: report.viewCount,
            createdAt: report.createdAt,
            updatedAt: report.updatedAt,
          };

          return {
            content: [
              { type: 'text', text: JSON.stringify(visibilityData, null, 2) },
            ],
          };
        }

        default:
          return {
            content: [{ type: 'text', text: `Unknown tool: ${name}` }],
            isError: true,
          };
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      };
    }
  }
}
