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
import { BrandMembersService } from './brand-members.service';
import { CreateBrandMemberDto, UpdateBrandMemberDto } from './dto';

@ApiTags('brand-members')
@ApiBearerAuth('clerk-auth')
@Controller('brand-members')
export class BrandMembersController {
  constructor(private readonly brandMembersService: BrandMembersService) {}

  @Post()
  @ApiOperation({ summary: 'Add a member to a brand' })
  @ApiBody({ type: CreateBrandMemberDto })
  @ApiResponse({
    status: 201,
    description: 'The member has been successfully added to the brand.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() createBrandMemberDto: CreateBrandMemberDto) {
    return this.brandMembersService.create(createBrandMemberDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all brand members or filter by brand/user' })
  @ApiQuery({
    name: 'brandId',
    required: false,
    description: 'Filter by brand ID',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter by user ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns brand members.',
  })
  findAll(
    @Query('brandId') brandId?: string,
    @Query('userId') userId?: string,
  ) {
    if (brandId) {
      return this.brandMembersService.findByBrand(brandId);
    }
    if (userId) {
      return this.brandMembersService.findByUser(userId);
    }
    return this.brandMembersService.findAll();
  }

  @Get(':brandId/:userId')
  @ApiOperation({ summary: 'Get a specific brand member' })
  @ApiParam({ name: 'brandId', description: 'Brand UUID', type: 'string' })
  @ApiParam({ name: 'userId', description: 'User ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Returns the brand member.',
  })
  @ApiResponse({ status: 404, description: 'Brand member not found.' })
  findOne(
    @Param('brandId', ParseUUIDPipe) brandId: string,
    @Param('userId') userId: string,
  ) {
    return this.brandMembersService.findOne(brandId, userId);
  }

  @Patch(':brandId/:userId')
  @ApiOperation({ summary: 'Update a brand member role' })
  @ApiParam({ name: 'brandId', description: 'Brand UUID', type: 'string' })
  @ApiParam({ name: 'userId', description: 'User ID', type: 'string' })
  @ApiBody({ type: UpdateBrandMemberDto })
  @ApiResponse({
    status: 200,
    description: 'The brand member has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Brand member not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  update(
    @Param('brandId', ParseUUIDPipe) brandId: string,
    @Param('userId') userId: string,
    @Body() updateBrandMemberDto: UpdateBrandMemberDto,
  ) {
    return this.brandMembersService.update(
      brandId,
      userId,
      updateBrandMemberDto,
    );
  }

  @Delete(':brandId/:userId')
  @ApiOperation({ summary: 'Remove a member from a brand' })
  @ApiParam({ name: 'brandId', description: 'Brand UUID', type: 'string' })
  @ApiParam({ name: 'userId', description: 'User ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'The member has been successfully removed from the brand.',
  })
  @ApiResponse({ status: 404, description: 'Brand member not found.' })
  remove(
    @Param('brandId', ParseUUIDPipe) brandId: string,
    @Param('userId') userId: string,
  ) {
    return this.brandMembersService.remove(brandId, userId);
  }
}
