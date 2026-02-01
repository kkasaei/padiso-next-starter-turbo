import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsInt,
  Min,
  IsEmail,
  IsUrl,
} from 'class-validator';

export enum WorkspaceStatus {
  ACTIVE = 'active',
  TRIALING = 'trialing',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  UNPAID = 'unpaid',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  PAUSED = 'paused',
  ADMIN_SUSPENDED = 'admin_suspended',
  DELETED = 'deleted',
}

export class CreateWorkspaceDto {
  @ApiProperty({
    description: 'Clerk organization ID - source of truth for name, slug, and logo',
    example: 'org_2abc123xyz',
  })
  @IsString()
  clerkOrgId: string;

  @ApiPropertyOptional({
    enum: WorkspaceStatus,
    description: 'Workspace status',
    example: WorkspaceStatus.ACTIVE,
    default: WorkspaceStatus.ACTIVE,
  })
  @IsEnum(WorkspaceStatus)
  @IsOptional()
  status?: WorkspaceStatus;

  @ApiPropertyOptional({
    description: 'Has completed welcome screen',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  hasCompletedWelcomeScreen?: boolean;

  @ApiPropertyOptional({
    description: 'Has completed onboarding',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  hasCompletedOnboarding?: boolean;

  @ApiPropertyOptional({
    description: 'Stripe customer ID',
    example: 'cus_abc123',
  })
  @IsString()
  @IsOptional()
  stripeCustomerId?: string;

  @ApiPropertyOptional({
    description: 'Stripe subscription ID',
    example: 'sub_abc123',
  })
  @IsString()
  @IsOptional()
  stripeSubscriptionId?: string;

  @ApiPropertyOptional({
    description: 'Plan ID',
    example: 'pro',
  })
  @IsString()
  @IsOptional()
  planId?: string;

  @ApiPropertyOptional({
    description: 'Plan name',
    example: 'Professional',
  })
  @IsString()
  @IsOptional()
  planName?: string;

  @ApiPropertyOptional({
    description: 'Billing interval',
    example: 'month',
  })
  @IsString()
  @IsOptional()
  billingInterval?: string;

  @ApiPropertyOptional({
    description: 'Billing email',
    example: 'billing@acme.com',
  })
  @IsEmail()
  @IsOptional()
  billingEmail?: string;

  @ApiPropertyOptional({
    description: 'Limit: number of brands',
    example: 10,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  limitBrands?: number;

  @ApiPropertyOptional({
    description: 'Limit: number of members',
    example: 5,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  limitMembers?: number;

  @ApiPropertyOptional({
    description: 'Limit: storage in GB',
    example: 100,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  limitStorageGb?: number;

  @ApiPropertyOptional({
    description: 'Limit: API calls per month',
    example: 10000,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  limitApiCallsPerMonth?: number;

  @ApiPropertyOptional({
    description: 'Limit: AI credits per month',
    example: 1000,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  limitAiCreditsPerMonth?: number;
}
