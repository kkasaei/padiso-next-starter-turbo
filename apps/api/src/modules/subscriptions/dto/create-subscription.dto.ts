import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsUUID,
  IsDateString,
} from 'class-validator';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  TRIALING = 'trialing',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  UNPAID = 'unpaid',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  PAUSED = 'paused',
}

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'Workspace ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  workspaceId: string;

  @ApiProperty({
    description: 'Stripe subscription ID',
    example: 'sub_1ABC123',
  })
  @IsString()
  stripeSubscriptionId: string;

  @ApiProperty({
    description: 'Stripe customer ID',
    example: 'cus_1ABC123',
  })
  @IsString()
  stripeCustomerId: string;

  @ApiPropertyOptional({
    description: 'Stripe price ID',
    example: 'price_1ABC123',
  })
  @IsString()
  @IsOptional()
  stripePriceId?: string;

  @ApiProperty({
    description: 'Plan ID',
    example: 'pro',
  })
  @IsString()
  planId: string;

  @ApiProperty({
    description: 'Plan name',
    example: 'Professional',
  })
  @IsString()
  planName: string;

  @ApiProperty({
    enum: SubscriptionStatus,
    description: 'Subscription status',
    example: SubscriptionStatus.ACTIVE,
  })
  @IsEnum(SubscriptionStatus)
  status: SubscriptionStatus;

  @ApiPropertyOptional({
    description: 'Is subscription active',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Cancel at period end',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  cancelAtPeriodEnd?: boolean;

  @ApiPropertyOptional({
    description: 'Canceled at timestamp',
    example: '2024-06-30T00:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  canceledAt?: string;

  @ApiPropertyOptional({
    description: 'Cancellation reason',
    example: 'Customer requested',
  })
  @IsString()
  @IsOptional()
  cancelReason?: string;

  @ApiProperty({
    description: 'Price amount',
    example: '29.99',
  })
  @IsString()
  priceAmount: string;

  @ApiPropertyOptional({
    description: 'Currency',
    example: 'usd',
    default: 'usd',
  })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({
    description: 'Billing interval',
    example: 'month',
  })
  @IsString()
  billingInterval: string;

  @ApiProperty({
    description: 'Current period start',
    example: '2024-01-01T00:00:00Z',
  })
  @IsDateString()
  currentPeriodStart: string;

  @ApiProperty({
    description: 'Current period end',
    example: '2024-02-01T00:00:00Z',
  })
  @IsDateString()
  currentPeriodEnd: string;

  @ApiPropertyOptional({
    description: 'Trial start',
    example: '2024-01-01T00:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  trialStart?: string;

  @ApiPropertyOptional({
    description: 'Trial end',
    example: '2024-01-14T00:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  trialEnd?: string;

  @ApiProperty({
    description: 'Subscription started at',
    example: '2024-01-01T00:00:00Z',
  })
  @IsDateString()
  startedAt: string;

  @ApiPropertyOptional({
    description: 'Subscription ended at',
    example: '2024-12-31T00:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  endedAt?: string;
}
