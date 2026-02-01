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
} from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new subscription' })
  @ApiBody({ type: CreateSubscriptionDto })
  @ApiResponse({
    status: 201,
    description: 'The subscription has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all subscriptions or filter by workspace' })
  @ApiQuery({
    name: 'workspaceId',
    required: false,
    description: 'Filter subscriptions by workspace ID',
  })
  @ApiQuery({
    name: 'activeOnly',
    required: false,
    description: 'Show only active subscriptions',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all subscriptions or filtered by workspace.',
  })
  findAll(
    @Query('workspaceId') workspaceId?: string,
    @Query('activeOnly') activeOnly?: string,
  ) {
    if (workspaceId && activeOnly === 'true') {
      return this.subscriptionsService.findActiveByWorkspace(workspaceId);
    }
    if (workspaceId) {
      return this.subscriptionsService.findByWorkspace(workspaceId);
    }
    return this.subscriptionsService.findAll();
  }

  @Get('stripe/:stripeSubscriptionId')
  @ApiOperation({ summary: 'Get a subscription by Stripe subscription ID' })
  @ApiParam({
    name: 'stripeSubscriptionId',
    description: 'Stripe Subscription ID',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the subscription.',
  })
  @ApiResponse({ status: 404, description: 'Subscription not found.' })
  findByStripeId(@Param('stripeSubscriptionId') stripeSubscriptionId: string) {
    return this.subscriptionsService.findByStripeSubscriptionId(
      stripeSubscriptionId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a subscription by ID' })
  @ApiParam({ name: 'id', description: 'Subscription UUID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Returns the subscription.',
  })
  @ApiResponse({ status: 404, description: 'Subscription not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.subscriptionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a subscription' })
  @ApiParam({ name: 'id', description: 'Subscription UUID', type: 'string' })
  @ApiBody({ type: UpdateSubscriptionDto })
  @ApiResponse({
    status: 200,
    description: 'The subscription has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Subscription not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(id, updateSubscriptionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subscription' })
  @ApiParam({ name: 'id', description: 'Subscription UUID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'The subscription has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Subscription not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.subscriptionsService.remove(id);
  }
}
