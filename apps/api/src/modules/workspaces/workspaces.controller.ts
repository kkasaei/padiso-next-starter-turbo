import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from './dto';

@ApiTags('workspaces')
@ApiBearerAuth('clerk-auth')
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workspace' })
  @ApiBody({ type: CreateWorkspaceDto })
  @ApiResponse({
    status: 201,
    description: 'The workspace has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspacesService.create(createWorkspaceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workspaces' })
  @ApiResponse({
    status: 200,
    description: 'Returns all workspaces.',
  })
  findAll() {
    return this.workspacesService.findAll();
  }

  @Get('by-clerk-org/:clerkOrgId')
  @ApiOperation({ summary: 'Get a workspace by Clerk organization ID' })
  @ApiParam({
    name: 'clerkOrgId',
    description: 'Clerk Organization ID',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the workspace.',
  })
  @ApiResponse({ status: 404, description: 'Workspace not found.' })
  findByClerkOrgId(@Param('clerkOrgId') clerkOrgId: string) {
    return this.workspacesService.findByClerkOrgId(clerkOrgId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a workspace by ID' })
  @ApiParam({ name: 'id', description: 'Workspace UUID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Returns the workspace.',
  })
  @ApiResponse({ status: 404, description: 'Workspace not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.workspacesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a workspace' })
  @ApiParam({ name: 'id', description: 'Workspace UUID', type: 'string' })
  @ApiBody({ type: UpdateWorkspaceDto })
  @ApiResponse({
    status: 200,
    description: 'The workspace has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Workspace not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspacesService.update(id, updateWorkspaceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a workspace' })
  @ApiParam({ name: 'id', description: 'Workspace UUID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'The workspace has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Workspace not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.workspacesService.remove(id);
  }
}
