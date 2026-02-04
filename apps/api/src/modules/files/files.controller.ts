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
import { FilesService } from './files.service';
import { CreateFileDto, UpdateFileDto } from './dto';

@ApiTags('files')
@ApiBearerAuth('clerk-auth')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new file record' })
  @ApiBody({ type: CreateFileDto })
  @ApiResponse({
    status: 201,
    description: 'The file record has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() createFileDto: CreateFileDto) {
    return this.filesService.create(createFileDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all files or filter by brand' })
  @ApiQuery({
    name: 'brandId',
    required: false,
    description: 'Filter files by brand ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all files or filtered by brand.',
  })
  findAll(@Query('brandId') brandId?: string) {
    if (brandId) {
      return this.filesService.findByBrand(brandId);
    }
    return this.filesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a file by ID' })
  @ApiParam({ name: 'id', description: 'File UUID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Returns the file.',
  })
  @ApiResponse({ status: 404, description: 'File not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.filesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a file record' })
  @ApiParam({ name: 'id', description: 'File UUID', type: 'string' })
  @ApiBody({ type: UpdateFileDto })
  @ApiResponse({
    status: 200,
    description: 'The file record has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'File not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFileDto: UpdateFileDto,
  ) {
    return this.filesService.update(id, updateFileDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a file record' })
  @ApiParam({ name: 'id', description: 'File UUID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'The file record has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'File not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.filesService.remove(id);
  }
}
