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
import { PromptsService } from './prompts.service';
import { CreatePromptDto, UpdatePromptDto } from './dto';

@ApiTags('prompts')
@ApiBearerAuth('clerk-auth')
@Controller('prompts')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new prompt template' })
  @ApiBody({ type: CreatePromptDto })
  @ApiResponse({
    status: 201,
    description: 'The prompt has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() createPromptDto: CreatePromptDto) {
    return this.promptsService.create(createPromptDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all prompts or filter by brand' })
  @ApiQuery({
    name: 'brandId',
    required: false,
    description: 'Filter prompts by brand ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all prompts or filtered by brand.',
  })
  findAll(@Query('brandId') brandId?: string) {
    if (brandId) {
      return this.promptsService.findByBrand(brandId);
    }
    return this.promptsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a prompt by ID' })
  @ApiParam({ name: 'id', description: 'Prompt UUID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Returns the prompt.',
  })
  @ApiResponse({ status: 404, description: 'Prompt not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.promptsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a prompt' })
  @ApiParam({ name: 'id', description: 'Prompt UUID', type: 'string' })
  @ApiBody({ type: UpdatePromptDto })
  @ApiResponse({
    status: 200,
    description: 'The prompt has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Prompt not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePromptDto: UpdatePromptDto,
  ) {
    return this.promptsService.update(id, updatePromptDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a prompt' })
  @ApiParam({ name: 'id', description: 'Prompt UUID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'The prompt has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Prompt not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.promptsService.remove(id);
  }

  @Post(':id/increment-usage')
  @ApiOperation({ summary: 'Increment usage count for a prompt' })
  @ApiParam({ name: 'id', description: 'Prompt UUID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Usage count incremented successfully.',
  })
  @ApiResponse({ status: 404, description: 'Prompt not found.' })
  incrementUsage(@Param('id', ParseUUIDPipe) id: string) {
    return this.promptsService.incrementUsage(id);
  }
}
