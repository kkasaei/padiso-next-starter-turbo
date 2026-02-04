import { Injectable } from '@nestjs/common';
import { BrandsService } from '../brands/brands.service';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { TasksService } from '../tasks/tasks.service';
import { PromptsService } from '../prompts/prompts.service';
import { BrandStatus } from '../brands/dto/create-brand.dto';

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
      description: 'List all workspaces',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'get_workspace',
      description: 'Get a workspace by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Workspace UUID' },
        },
        required: ['id'],
      },
    },
    {
      name: 'list_brands',
      description: 'List all brands, optionally filtered by workspace',
      inputSchema: {
        type: 'object',
        properties: {
          workspaceId: {
            type: 'string',
            description: 'Optional workspace ID to filter by',
          },
        },
      },
    },
    {
      name: 'get_brand',
      description: 'Get a brand by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Brand UUID' },
        },
        required: ['id'],
      },
    },
    {
      name: 'create_brand',
      description: 'Create a new brand',
      inputSchema: {
        type: 'object',
        properties: {
          workspaceId: { type: 'string', description: 'Workspace UUID' },
          brandName: { type: 'string', description: 'Brand name' },
          websiteUrl: { type: 'string', description: 'Website URL' },
          brandColor: { type: 'string', description: 'Brand color hex' },
          status: {
            type: 'string',
            enum: ['backlog', 'planned', 'active', 'cancelled', 'completed'],
            description: 'Brand status',
            default: 'active',
          },
        },
        required: ['workspaceId', 'brandName', 'status'],
      },
    },
    {
      name: 'list_tasks',
      description: 'List all tasks, optionally filtered by brand',
      inputSchema: {
        type: 'object',
        properties: {
          brandId: {
            type: 'string',
            description: 'Optional brand ID to filter by',
          },
        },
      },
    },
    {
      name: 'get_task',
      description: 'Get a task by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Task UUID' },
        },
        required: ['id'],
      },
    },
    {
      name: 'list_prompts',
      description: 'List all prompt templates',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'get_prompt',
      description: 'Get a prompt template by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Prompt UUID' },
        },
        required: ['id'],
      },
    },
  ];

  constructor(
    private readonly brandsService: BrandsService,
    private readonly workspacesService: WorkspacesService,
    private readonly tasksService: TasksService,
    private readonly promptsService: PromptsService,
  ) {}

  // Get server info for the MCP endpoint
  getServerInfo() {
    return {
      name: 'searchfit-api',
      version: '1.0.0',
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {},
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

        case 'get_workspace': {
          const workspace = await this.workspacesService.findOne(
            args?.id as string,
          );
          return {
            content: [
              { type: 'text', text: JSON.stringify(workspace, null, 2) },
            ],
          };
        }

        case 'list_brands': {
          const brands = args?.workspaceId
            ? await this.brandsService.findByWorkspace(
                args.workspaceId as string,
              )
            : await this.brandsService.findAll();
          return {
            content: [{ type: 'text', text: JSON.stringify(brands, null, 2) }],
          };
        }

        case 'get_brand': {
          const brand = await this.brandsService.findOne(args?.id as string);
          return {
            content: [{ type: 'text', text: JSON.stringify(brand, null, 2) }],
          };
        }

        case 'create_brand': {
          const status = (args?.status as BrandStatus) || BrandStatus.ACTIVE;
          const newBrand = await this.brandsService.create({
            workspaceId: args?.workspaceId as string,
            brandName: args?.brandName as string,
            websiteUrl: args?.websiteUrl as string,
            brandColor: args?.brandColor as string,
            status,
          });
          return {
            content: [
              { type: 'text', text: JSON.stringify(newBrand, null, 2) },
            ],
          };
        }

        case 'list_tasks': {
          const tasks = args?.brandId
            ? await this.tasksService.findByBrand(args.brandId as string)
            : await this.tasksService.findAll();
          return {
            content: [{ type: 'text', text: JSON.stringify(tasks, null, 2) }],
          };
        }

        case 'get_task': {
          const task = await this.tasksService.findOne(args?.id as string);
          return {
            content: [{ type: 'text', text: JSON.stringify(task, null, 2) }],
          };
        }

        case 'list_prompts': {
          const prompts = await this.promptsService.findAll();
          return {
            content: [{ type: 'text', text: JSON.stringify(prompts, null, 2) }],
          };
        }

        case 'get_prompt': {
          const prompt = await this.promptsService.findOne(args?.id as string);
          return {
            content: [{ type: 'text', text: JSON.stringify(prompt, null, 2) }],
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
