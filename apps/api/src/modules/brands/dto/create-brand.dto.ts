import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsUrl,
  IsUUID,
  IsBoolean,
  IsInt,
  IsDate,
  Min,
  Max,
} from 'class-validator';

export enum BrandStatus {
  BACKLOG = 'backlog',
  PLANNED = 'planned',
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum BrandPriority {
  URGENT = 'urgent',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum Language {
  EN_US = 'en-US',
  EN_GB = 'en-GB',
  ES = 'es',
  FR = 'fr',
  DE = 'de',
  PT = 'pt',
  IT = 'it',
  NL = 'nl',
  PL = 'pl',
  RU = 'ru',
  JA = 'ja',
  ZH = 'zh',
  KO = 'ko',
  AR = 'ar',
  HI = 'hi',
  BG = 'bg',
  HU = 'hu',
  HR = 'hr',
}

export enum ReferralSource {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  GOOGLE = 'google',
  EMAIL = 'email',
  REDDIT = 'reddit',
  LINKEDIN = 'linkedin',
  OTHER = 'other',
}

export class CreateBrandDto {
  @ApiProperty({
    description: 'Workspace ID that this brand belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  workspaceId: string;

  @ApiPropertyOptional({
    description: 'Brand website URL',
    example: 'https://example.com',
  })
  @IsUrl()
  @IsOptional()
  websiteUrl?: string;

  @ApiPropertyOptional({
    description: 'Languages supported by the brand',
    example: ['en-US', 'es'],
  })
  @IsArray()
  @IsOptional()
  languages?: string[];

  @ApiPropertyOptional({
    description: 'Target audiences for the brand',
    example: ['Millennials', 'Tech enthusiasts'],
  })
  @IsArray()
  @IsOptional()
  targetAudiences?: string[];

  @ApiPropertyOptional({
    description: 'Business keywords',
    example: ['SaaS', 'Marketing', 'Analytics'],
  })
  @IsArray()
  @IsOptional()
  businessKeywords?: string[];

  @ApiPropertyOptional({
    description: 'Competitor websites',
    example: ['competitor1.com', 'competitor2.com'],
  })
  @IsArray()
  @IsOptional()
  competitors?: string[];

  @ApiPropertyOptional({
    description: 'Brand name',
    example: 'Acme Corporation',
  })
  @IsString()
  @IsOptional()
  brandName?: string;

  @ApiPropertyOptional({
    description: 'Brand primary color',
    example: '#FF5733',
  })
  @IsString()
  @IsOptional()
  brandColor?: string;

  @ApiPropertyOptional({
    description: 'Brand icon URL',
    example: 'https://example.com/icon.png',
  })
  @IsUrl()
  @IsOptional()
  iconUrl?: string;

  @ApiPropertyOptional({
    description: 'Sitemap URL',
    example: 'https://example.com/sitemap.xml',
  })
  @IsUrl()
  @IsOptional()
  sitemapUrl?: string;

  @ApiPropertyOptional({
    enum: ReferralSource,
    description: 'How the user found the platform',
    example: ReferralSource.GOOGLE,
  })
  @IsEnum(ReferralSource)
  @IsOptional()
  referralSource?: ReferralSource;

  @ApiProperty({
    enum: BrandStatus,
    description: 'Brand status',
    example: BrandStatus.ACTIVE,
  })
  @IsEnum(BrandStatus)
  status: BrandStatus;

  @ApiPropertyOptional({
    description: 'Clerk user ID of the creator',
    example: 'user_2abc123',
  })
  @IsString()
  @IsOptional()
  createdByUserId?: string;

  @ApiPropertyOptional({
    description: 'Is this brand marked as favourite',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isFavourite?: boolean;

  // AI Visibility Tracking
  @ApiPropertyOptional({
    description: 'AI visibility score (0-100)',
    example: 75,
    minimum: 0,
    maximum: 100,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  visibilityScore?: number;

  @ApiPropertyOptional({
    description: 'When the brand was last scanned for AI visibility',
    example: new Date(),
  })
  @IsDate()
  @IsOptional()
  lastScanAt?: Date;

  @ApiPropertyOptional({
    description: 'When the next AI visibility scan is scheduled',
    example: new Date(),
  })
  @IsDate()
  @IsOptional()
  nextScanAt?: Date;
}
